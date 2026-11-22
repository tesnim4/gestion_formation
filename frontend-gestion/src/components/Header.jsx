import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS, roleClass } from './menuConfig';

export default function Header({ onToggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const mainRole = user?.roles?.[0];
    const initial = (user?.username || '?').charAt(0).toUpperCase();

    return (
        <header className="app-header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Menu">☰</button>
                <div className="brand">
                    <div className="brand-logo">🎯</div>
                    <div>
                        FormaGest
                        <small>Gestion des formations</small>
                    </div>
                </div>
            </div>

            <div className="header-right">
                <div className="user-chip">
                    <div className="user-info">
                        <strong>{user?.username}</strong>
                        <span className={`role-badge ${roleClass(mainRole)}`}>
                            {ROLE_LABELS[mainRole] || mainRole}
                        </span>
                    </div>
                    <div className="avatar">{initial}</div>
                </div>
                <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
            </div>
        </header>
    );
}
