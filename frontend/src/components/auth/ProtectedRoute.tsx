import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState} from 'react';

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const {accessToken, user, loading, refresh, fetchUser} = useAuthStore(); //TODO: get auth state from store
    const [starting, setStarting] =  useState(true);


    const init = async () => {
        if (!accessToken) {
            await refresh();
        }
        if (accessToken && !user) {
            await fetchUser();
        }
        setStarting(false);
        
    }
    useEffect(() => {
       
        init();
    }, [])


    if (loading || starting) {
        return <div className='flex h-screen items-center justify-center'>Loading...</div>;
    }

    if (!accessToken) {
        return (
            <Navigate to="/signin" replace />
        );
    }
    

   return <Outlet></Outlet>;
};


export default ProtectedRoute