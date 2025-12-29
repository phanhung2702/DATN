import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if(!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

    // Kiểm tra nếu username đã tồn tại
        const duplicate = await User.findOne({username});
        if(duplicate) {
            return res.status(409).json({ message: 'Username already exists' });
        }

    // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);


    // Tạo người dùng mới trong cơ sở dữ liệu
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });
    // Trả về phản hồi thành công
       return res.sendStatus(204);

    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const signIn = async (req, res) => {
    try {
        // lấy input
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // lấy hashedPassword từ db để so với password input
        const user = await User.findOne({ username });

        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // kiểm tra password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // nếu khớp, tạo accessToken với JWT
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // tạo refreshToken
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // tạo session mới để lưu refreshToken
        await Session.create({
            userId: user._id,
            refreshToken,
            expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // trả về refreshToken trong httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', // 'Strict'
            maxAge: REFRESH_TOKEN_TTL,
        });

        // trả về accessToken trong response body
        res.status(200).json({ message: 'Signin successful', accessToken });

       
    } catch (error) {
        console.error('Error during user signin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const signOut = async (req, res) => {
    try {
        // lấy refreshToken từ cookie
        const token = req.cookies?.refreshToken;

        if (!token) {
        // xóa refreshToken trong session
            await Session.deleteOne({ refreshToken: token });

        // xóa cookie
         res.clearCookie('refreshToken');
        }
        return res.sendStatus(204); // No content


    } catch (error) {
        console.error('Error during user signout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
 // tạo accessToken mới dựa trên refreshToken
export const refreshToken = async (req, res) => {
    try {
        // lấy refreshToken từ cookie
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        // so với refreshToken trong db
        const session = await Session.findOne({ refreshToken: token });
        if (!session) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // kiểm tra token đã hết hạn chưa
        if (session.expiredAt < new Date()) {
            return res.status(403).json({ message: 'Refresh token has expired' });
        }

        // nếu hợp lệ, tạo accessToken mới và trả về
        const accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // return 
        res.status(200).json({ accessToken });
    }
    catch (error) {
        console.error('Error during token refresh:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

};