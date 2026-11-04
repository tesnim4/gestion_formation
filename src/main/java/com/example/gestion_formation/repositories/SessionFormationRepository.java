package com.example.gestion_formation.repositories;

import com.example.gestion_formation.entities.SessionFormation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface SessionFormationRepository extends JpaRepository<SessionFormation, Long> {
    
    List<SessionFormation> findByDatebutBetween(LocalDate dd, LocalDate df);

    List<SessionFormation> findByThemeFormation_ThemeContaining(String theme);
    
    List<SessionFormation> findByInscriptions_Apprenant_Id(Long apprenantId);
}