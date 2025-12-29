import {create} from 'zustand';
import {toast} from 'sonner';
import { authService } from '@/services/authService';
import api from '@/lib/axios';
import type { AuthState } from '@/types/store';
import type { User } from '@/types/user';


export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        // remove axios auth header when clearing
        if (api && api.defaults && api.defaults.headers) {
            delete api.defaults.headers.common['Authorization'];
        }
        set({accessToken: null, user: null, loading: false});
    },

    // fetch current user from backend and set to store
    fetchUser: async () => {
        try {
            set({loading: true});
            const data = await authService.getMe();
            // backend returns { user }
            const user: User = data.user ?? data;
            set({user});
        } catch (error) {
            console.error('Error fetching user:', error);
            // nếu lỗi 401/403 thì clear state
            get().clearState();
        } finally {
            set({loading: false});
        }
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({loading: true});
            await authService.SignUp(username, password, email, firstName, lastName);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        } catch (error) {
            console.error('Error during sign up:', error);
            toast.error('Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            set({loading: false});
        }
    },

    signIn: async (username, password) => {
        try {
            set({loading: true});
            // authService.SignIn now returns the accessToken string
            const accessToken = await authService.SignIn(username, password);
            if (!accessToken) {
                throw new Error('No access token returned from signin');
            }
            set({accessToken});

            // gán Authorization header cho axios để các request bảo vệ có thể dùng
            if (api && api.defaults && api.defaults.headers) {
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            }

            // fetch thông tin người dùng ngay sau khi sign in
            await get().fetchUser();

            toast.success('Đăng nhập thành công!');
        } catch (error) {
            console.error('Error during sign in:', error);
            toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
            throw error;
        }
        finally {
            set({loading: false});
        }
    },
   
    signOut: async () => {
        try {
            get().clearState();
            await authService.SignOut();
            toast.success('Đăng xuất thành công!');
        } catch (error) {
            console.error('Error during sign out:', error);
            toast.error('Đăng xuất thất bại. Vui lòng thử lại.');
        }
    },

    refresh: async () => {
        try {
            set({loading: true});
            const {user, fetchUser} = get();
            const accessToken = await authService.refresh();
            set({accessToken}); 
            // cập nhật lại header Authorization cho axios
            if (api && api.defaults && api.defaults.headers) {
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            }       
            if (!user) {
                await fetchUser();
            }
        } catch (error) {
            console.error('Error during token refresh:', error);
            toast.error('Làm mới phiên đăng nhập thất bại. Vui lòng đăng nhập lại.');
            get().clearState();
        } finally {
            set({loading: false});
        }
    }
}));