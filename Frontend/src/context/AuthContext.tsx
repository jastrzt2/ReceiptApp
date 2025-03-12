import { getCurrentUser } from '@/lib/api/api';
import { IContextType, IUser } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
    id: '',
    email: '',
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
}

export const AuthContext = createContext<IContextType>(INITIAL_STATE);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthUser = async () => {
        try {
            setIsLoading(true);
            const currentAccount = await getCurrentUser();
            console.log('Current Account po załadowaniu:', currentAccount);
            if (currentAccount) {
                setUser({
                    id: currentAccount.id,
                    email: currentAccount.email,
                });
                setIsAuthenticated(true);
                return true;
            }
            
            navigate("/signin");
            setIsAuthenticated(false);
            return false;
        } catch (error) {
            navigate("/signin");
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

    useEffect(() => {
        checkAuthUser();
    }, []);


    /*const login = (userData: IUser) => {
        setUser(userData);
        setIsAuthenticated(true);
        navigate('/');
    };


    const logout = async () => {
        await signOutAccount();
        setUser(INITIAL_USER);
        setIsAuthenticated(false);
        navigate('/signin');
    };*/




    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(AuthContext);
}
