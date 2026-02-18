import { useEffect } from "react";

interface Props {
    setIsAuthenticated: (auth: boolean) => void;
    setUserRole: (role: string) => void;
    setCurrentPage: (page: string) => void;
}

export function GoogleAuthSuccess({
    setIsAuthenticated,
    setUserRole,
    setCurrentPage
}: Props) {

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const role = params.get("role");

        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("role", role || "customer");
            sessionStorage.setItem("isLoggedIn", "true");
            setIsAuthenticated(true);
            setUserRole(role || "customer");
            setCurrentPage("profile");
        }
    }, []);


    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg">Signing you in with Google...</p>
        </div>
    );
}
