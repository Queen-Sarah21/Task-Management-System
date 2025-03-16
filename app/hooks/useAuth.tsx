import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken, decodeToken, removeToken, setToken } from '../utils/auth';

interface User {
    email: string;
    role: string;
    [key: string]: any; //Allow other properties in the token
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decoded = decodeToken(token) as User; //Decode the token and type it as User.
                setUser(decoded);
            } catch (error) {
                console.error('Failed to decode token: ', error);
                removeToken();  //"Remove the invalid token.
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        try {
            const decoded = decodeToken(token) as User; //Decode the token and type it as User.
            setToken(token); // Store the token in localStorage
            setUser(decoded); // Update the user's state
            router.push('/'); // Redirect to the home page
        } catch (error) {
            console.error('Failed to decode token: ', error);
        }
    };

    const logout = () => {
        removeToken(); // Remove the token from localStorage
        setUser(null); // clear the user's state
        router.push('/login'); // redirect to the login page.
    };

    return { user, loading, login, logout };
}