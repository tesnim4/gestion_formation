import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (loading) return <p>Chargement...</p>;
    
    // Si pas connecté, on redirige vers login
    if (!user) return <Navigate to="/login" replace />;
    
    // Si des rôles sont requis et que l'utilisateur ne les a pas
    if (roles && !roles.some(r => user.roles.includes(r))) {
        return <Navigate to="/accueil" replace />;
    }
    
    return children;
}