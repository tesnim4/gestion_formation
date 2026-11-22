import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AccueilPage from './pages/AccueilPage';

import ThemesPage from './pages/ThemesPage';
import ThemeFormPage from './pages/ThemeFormPage';

import SessionsPage from './pages/SessionsPage';
import SessionFormPage from './pages/SessionFormPage'; 

import ApprenantsPage from './pages/ApprenantsPage';

import FormateursPage from './pages/FormateursPage';
import FormateurFormPage from './pages/FormateurFormPage'; 

import InscriptionsPage from './pages/InscriptionsPage';
import InscriptionFormPage from './pages/InscriptionFormPage';
import ProtectedRoute from './components/ProtectedRoute';
import ApprenantFormPage from './pages/ApprenantFormPage';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/accueil" element={
                <ProtectedRoute><AccueilPage /></ProtectedRoute>
            } />
            
            <Route path="/themes" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}><ThemesPage /></ProtectedRoute>
            } />
          <Route path="/themes/nouveau" element={
                <ProtectedRoute roles={['ROLE_ADMIN']}><ThemeFormPage /></ProtectedRoute>
            } />
          <Route path="/themes/:id/edit" element={
                <ProtectedRoute roles={['ROLE_ADMIN']}><ThemeFormPage /></ProtectedRoute>
            } />

            <Route path="/sessions" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}><SessionsPage /></ProtectedRoute>
            } />
            <Route path="/sessions/nouvelle" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}><SessionFormPage /></ProtectedRoute>
            } />  
            <Route path="/sessions/:id/edit" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}><SessionFormPage /></ProtectedRoute>
            } />
        
            <Route path="/apprenants" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}><ApprenantsPage /></ProtectedRoute>
            } />
            <Route path="/apprenants/nouveau" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}>
                    <ApprenantFormPage />
                </ProtectedRoute>
            } />
            <Route path="/apprenants/:id/edit" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}>
                    <ApprenantFormPage />
                </ProtectedRoute>
            } />

            <Route path="/formateurs" element={
                <ProtectedRoute roles={['ROLE_ADMIN']}><FormateursPage /></ProtectedRoute>
            } />
            <Route path="/formateurs/nouveau" element={
                <ProtectedRoute roles={['ROLE_ADMIN']}><FormateurFormPage /></ProtectedRoute>
            } />
            <Route path="/formateurs/:id/edit" element={
                <ProtectedRoute roles={['ROLE_ADMIN']}><FormateurFormPage /></ProtectedRoute>
            } />
            
            <Route path="/inscriptions" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR', 'ROLE_APPRENANT']}><InscriptionsPage /></ProtectedRoute>
            } />
            <Route path="/inscriptions/nouveau" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}><InscriptionFormPage /></ProtectedRoute>
            } />
            <Route path="/inscriptions/:id/edit" element={
                <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR']}><InscriptionFormPage /></ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/accueil" replace />} />
        </Routes>
    );
}