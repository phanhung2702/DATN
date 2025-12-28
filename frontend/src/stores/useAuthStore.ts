import {create} from 'zustand';
import {toast} from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';


export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({accessToken: null, user: null, loading: false
        })
    },
    

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({loading: true});
            // gọi API để đăng ký người dùng
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
            // gọi API để đăng nhập người dùng
            const accessToken = await authService.SignIn(username, password);
            set({accessToken});

            toast.success('Đăng nhập thành công!');
        } catch (error) {
            console.error('Error during sign in:', error);
            toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
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
    }
}))