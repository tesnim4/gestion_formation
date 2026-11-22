package com.example.gestion_formation.repositories;

import com.example.gestion_formation.entities.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    int countBySessionFormationId(Long sessionId);

@Query("""
    SELECT i FROM Inscription i
    JOIN i.apprenant a
    WHERE a.email = :email
""")
List<Inscription> findByApprenantEmail(@Param("email") String email);
}