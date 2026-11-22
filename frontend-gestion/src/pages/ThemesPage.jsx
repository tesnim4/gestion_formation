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
        <div>
            <div className="page-head">
                <div>
                    <h2>Thèmes de formation</h2>
                    <p>{themes.length} thème(s) disponible(s)</p>
                </div>
                {isAdmin && (
                    <Link to="/themes/nouveau" className="btn btn-primary">+ Ajouter un thème</Link>
                )}
            </div>

            <div className="card table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Thème</th>
                            <th>Mots-clés</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {themes.length === 0 && (
                            <tr><td colSpan={isAdmin ? 4 : 3} className="empty">Aucun thème pour le moment.</td></tr>
                        )}
                        {themes.map(t => (
                            <tr key={t.id}>
                                <td className="id-cell">#{t.id}</td>
                                <td className="strong">{t.theme}</td>
                                <td>{t.motsCles}</td>
                                {isAdmin && (
                                    <td>
                                        <div className="actions">
                                            <Link to={`/themes/${t.id}/edit`} className="btn btn-sm btn-edit">Modifier</Link>
                                            <button onClick={() => deleteTheme(t.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
