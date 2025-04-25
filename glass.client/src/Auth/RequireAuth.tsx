import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = localStorage.getItem("authToken"); // or use a proper auth flag/token

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RequireAuth;