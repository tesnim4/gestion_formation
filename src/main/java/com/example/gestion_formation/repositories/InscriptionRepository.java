package com.example.gestion_formation.repositories;

import com.example.gestion_formation.entities.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    int countBySessionFormationId(Long sessionId);
}