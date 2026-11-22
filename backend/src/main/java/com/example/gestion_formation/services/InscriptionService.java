package com.example.gestion_formation.services;

import org.springframework.stereotype.Service;

import com.example.gestion_formation.repositories.InscriptionRepository;

@Service
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;

    public InscriptionService(InscriptionRepository inscriptionRepository) {
        this.inscriptionRepository = inscriptionRepository;
    }

    public int nombreTotalParSession(Long idSession) {
        return inscriptionRepository.countBySessionFormationId(idSession);
    }
}