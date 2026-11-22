package com.example.gestion_formation.repositories;

import com.example.gestion_formation.entities.SessionFormation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SessionFormationRepository extends JpaRepository<SessionFormation, Long> {
    
    List<SessionFormation> findByDatebutBetween(LocalDate dd, LocalDate df);

    List<SessionFormation> findByThemeFormation_ThemeContaining(String theme);
    
    List<SessionFormation> findByInscriptions_Apprenant_Id(Long apprenantId);
@Query("""
    SELECT DISTINCT s FROM SessionFormation s
    JOIN s.inscriptions i
    JOIN i.apprenant a
    WHERE a.email = :email
""")
List<SessionFormation> findByInscriptionsApprenantEmail(@Param("email") String email);

@Query("""
    SELECT COUNT(s) FROM SessionFormation s
    JOIN s.inscriptions i
    JOIN i.apprenant a
    WHERE a.email = :email
""")
long countByApprenantEmail(@Param("email") String email);
}