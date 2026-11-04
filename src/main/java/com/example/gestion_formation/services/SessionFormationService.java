package com.example.gestion_formation.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.gestion_formation.entities.SessionFormation;
import com.example.gestion_formation.repositories.InscriptionRepository;
import com.example.gestion_formation.repositories.SessionFormationRepository;

@Service
public class SessionFormationService {

    private final SessionFormationRepository sessionRepository;
    private final InscriptionRepository inscriptionRepository;

    public SessionFormationService(SessionFormationRepository sessionRepository,
            InscriptionRepository inscriptionRepository) {
        this.sessionRepository = sessionRepository;
        this.inscriptionRepository = inscriptionRepository;
    }

    public List<SessionFormation> rechercherParDates(LocalDate dd, LocalDate df) {
        return sessionRepository.findByDatebutBetween(dd, df);
    }

    public List<SessionFormation> rechercherParTheme(String theme) {
        return sessionRepository.findByThemeFormation_ThemeContaining(theme);
    }

    public int nombreTotalApprenantsParSession(Long idSession) {
        return inscriptionRepository.countBySessionFormationId(idSession);
    }

    public List<SessionFormation> listerParApprenant(Long idApprenant) {
        return sessionRepository.findByInscriptions_Apprenant_Id(idApprenant);
    }
}