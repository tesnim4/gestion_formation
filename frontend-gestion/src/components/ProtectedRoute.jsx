import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (loading) return <p>Chargement...</p>;
    
    if (!user) return <Navigate to="/login" replace />;
    
    if (roles && !roles.some(r => user.roles.includes(r))) {
        return <Navigate to="/accueil" replace />;
    }
    
    return children;
}