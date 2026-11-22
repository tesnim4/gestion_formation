import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/accueil');
        } catch (err) {
            setError('Identifiants invalides');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Connexion</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10, boxSizing: 'border-box' }}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10, boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ width: '100%', padding: 10, background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Se connecter
                </button>
            </form>
        </div>
    );
}