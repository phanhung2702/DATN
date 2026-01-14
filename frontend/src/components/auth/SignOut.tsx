import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlayerStore } from '@/stores/usePlayerStore'; // 1. Import PlayerStore

const SignOut = () => {
    const signOut = useAuthStore((state) => state.signOut);
    const resetPlayer = usePlayerStore((state) => state.reset); // 2. Lấy hàm reset
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            // 3. Xóa trạng thái trình phát nhạc trước
            resetPlayer(); 
            
            // 4. Thực hiện đăng xuất tài khoản
            await signOut();
            
            // 5. Điều hướng
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    return (
        <Button onClick={handleSignOut}>SignOut</Button>
    )
}

export default SignOut;