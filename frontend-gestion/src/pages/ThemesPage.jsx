import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function ThemesPage() {
    const [themes, setThemes] = useState([]);
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    const loadThemes = () => {
        axiosClient.get('/themes').then(res => setThemes(res.data));
    };

    useEffect(() => { 
        loadThemes(); 
    }, []);

    const deleteTheme = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce thème ?')) {
            await axiosClient.delete(`/themes/${id}`);
            loadThemes();
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <Link to="/accueil">← Retour à l'accueil</Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Gestion des Thèmes</h2>
                {isAdmin && (
                    <Link to="/themes/nouveau">
                        <button style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                            + Ajouter un thème
                        </button>
                    </Link>
                )}
            </div>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f4f4f4' }}>
                    <tr>
                        <th>ID</th>
                        <th>Thème</th>
                        <th>Mots-clés</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {themes.map(t => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.theme}</td>
                            <td>{t.motsCles}</td>
                            {isAdmin && (
                                <td>
                                    <Link to={`/themes/${t.id}/edit`}>
                                        <button style={{ marginRight: 10, cursor: 'pointer' }}>Modifier</button>
                                    </Link>
                                    <button onClick={() => deleteTheme(t.id)} style={{ color: 'red', cursor: 'pointer' }}>Supprimer</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}