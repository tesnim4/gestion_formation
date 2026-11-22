import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AccueilPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const hasRole = (role) => user?.roles?.includes(role);

    return (
        <div style={{ maxWidth: 600, margin: '50px auto', textAlign: 'center' }}>
            <h1>APPLICATION DE GESTION DES FORMATIONS</h1>
            <p>Connecté en tant que : <b>{user.username}</b></p>
            <p>Rôles : <i>{user.roles.join(', ')}</i></p>
            <hr />

            {/* Boutons visibles uniquement selon le rôle */}
            {(hasRole('ROLE_ADMIN') || hasRole('ROLE_FORMATEUR')) && (
                <Link to="/apprenants"><button style={btnStyle}>Gestion des apprenants</button></Link>
            )}
            
            {hasRole('ROLE_ADMIN') && (
                <Link to="/themes"><button style={btnStyle}>Gestion des thèmes</button></Link>
            )}
            
            {hasRole('ROLE_ADMIN') && (
                <Link to="/formateurs"><button style={btnStyle}>Gestion des formateurs</button></Link>
            )}

            {(hasRole('ROLE_ADMIN') || hasRole('ROLE_FORMATEUR')) && (
                <Link to="/sessions"><button style={btnStyle}>Gestion des sessions</button></Link>
            )}

            <Link to="/inscriptions"><button style={btnStyle}>Inscriptions</button></Link>

            <button onClick={handleLogout} style={{ ...btnStyle, background: '#dc3545' }}>
                Se déconnecter
            </button>
        </div>
    );
}

const btnStyle = {
    display: 'block', width: '100%', padding: 12, margin: '10px 0',
    background: '#007bff', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 16
};