import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AccueilPage from './pages/AccueilPage';

import ThemesPage from './pages/ThemesPage';
import ThemeFormPage from './pages/ThemeFormPage';

import SessionsPage from './pages/SessionsPage';
import SessionFormPage from './pages/SessionFormPage';

import ApprenantsPage from './pages/ApprenantsPage';
import ApprenantFormPage from './pages/ApprenantFormPage';

import FormateursPage from './pages/FormateursPage';
import FormateurFormPage from './pages/FormateurFormPage';

import InscriptionsPage from './pages/InscriptionsPage';
import InscriptionFormPage from './pages/InscriptionFormPage';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const ADMIN = ['ROLE_ADMIN'];
const STAFF = ['ROLE_ADMIN', 'ROLE_FORMATEUR'];
const ALL = ['ROLE_ADMIN', 'ROLE_FORMATEUR', 'ROLE_APPRENANT'];

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/accueil" element={<AccueilPage />} />

                <Route path="/themes" element={<ProtectedRoute roles={STAFF}><ThemesPage /></ProtectedRoute>} />
                <Route path="/themes/nouveau" element={<ProtectedRoute roles={ADMIN}><ThemeFormPage /></ProtectedRoute>} />
                <Route path="/themes/:id/edit" element={<ProtectedRoute roles={ADMIN}><ThemeFormPage /></ProtectedRoute>} />

                <Route path="/sessions" element={<ProtectedRoute roles={ALL}><SessionsPage /></ProtectedRoute>} />
                <Route path="/sessions/nouvelle" element={<ProtectedRoute roles={STAFF}><SessionFormPage /></ProtectedRoute>} />
                <Route path="/sessions/:id/edit" element={<ProtectedRoute roles={STAFF}><SessionFormPage /></ProtectedRoute>} />

                <Route path="/apprenants" element={<ProtectedRoute roles={STAFF}><ApprenantsPage /></ProtectedRoute>} />
                <Route path="/apprenants/nouveau" element={<ProtectedRoute roles={STAFF}><ApprenantFormPage /></ProtectedRoute>} />
                <Route path="/apprenants/:id/edit" element={<ProtectedRoute roles={STAFF}><ApprenantFormPage /></ProtectedRoute>} />

                <Route path="/formateurs" element={<ProtectedRoute roles={ADMIN}><FormateursPage /></ProtectedRoute>} />
                <Route path="/formateurs/nouveau" element={<ProtectedRoute roles={ADMIN}><FormateurFormPage /></ProtectedRoute>} />
                <Route path="/formateurs/:id/edit" element={<ProtectedRoute roles={ADMIN}><FormateurFormPage /></ProtectedRoute>} />

                <Route path="/inscriptions" element={<ProtectedRoute roles={ALL}><InscriptionsPage /></ProtectedRoute>} />
                <Route path="/inscriptions/nouveau" element={<ProtectedRoute roles={STAFF}><InscriptionFormPage /></ProtectedRoute>} />
                <Route path="/inscriptions/:id/edit" element={<ProtectedRoute roles={STAFF}><InscriptionFormPage /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/accueil" replace />} />
        </Routes>
    );
}
