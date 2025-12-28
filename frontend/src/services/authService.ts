
import api from '../lib/axios';

export const authService = {
    SignUp: async (
        username: string,
        password: string,
        email: string,
        firstname: string,
        lastname: string
    ) => {
        const response = await api.post('/auth/signup', 
            {username, 
            password,
            email, 
            firstName: firstname, 
            lastName: lastname},
            { withCredentials: true }
        );
        return response.data;
    },

    SignIn: async (username: string, password: string) => {
        const response = await api.post('/auth/signin', 
            {username, password},
            { withCredentials: true }
        );
        return response.data; //accessToken
    },

    SignOut: async () => {
        return api.post('/auth/signout', {}, { withCredentials: true });
    }
};