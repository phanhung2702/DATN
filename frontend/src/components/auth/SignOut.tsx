
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

const SignOut = () => {
    const SignOut = useAuthStore((state) => state.signOut);
    const navigate = useNavigate();
    const handleSignOut = async () => {
        try {
            await SignOut();
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }
  return (
    <Button onClick={handleSignOut}>SignOut</Button>
  )

}
export default SignOut