import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { use, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface RoleBasedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[]; //protect routes using roles 
    //backend is to validate that, frontend is to improve user experience
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (!loading && user && !allowedRoles.includes(user.role)) {
            router.push('/access-denied'); //go to access-denied page if no access
        }
    }, [user, loading]);

    if (loading || !user) {
        return <LoadingSpinner />;
    }

    if (!allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
};

export default RoleBasedRoute;