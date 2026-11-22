import { useAuth } from '../context/AuthContext';

export default function Footer() {
    const { user } = useAuth();
    const isApprenant = user?.roles?.includes('ROLE_APPRENANT')
        && !user?.roles?.includes('ROLE_ADMIN')
        && !user?.roles?.includes('ROLE_FORMATEUR');

    return (
        <footer className="app-footer">
            <span>© {new Date().getFullYear()} FormaGest — Application de gestion des formations</span>
            <span>
                <span className="dot">●</span>{' '}
                {isApprenant ? 'Besoin d’aide ? Contactez votre formateur.' : 'Session sécurisée'}
            </span>
        </footer>
    );
}
