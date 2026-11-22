package com.example.gestion_formation.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.example.gestion_formation.entities.Formateur;

public interface FormateurRepository extends JpaRepository<Formateur, Long> {
    
    List<Formateur> findByNomAndPrenom(String nom, String prenom);

    @Query("SELECT f FROM Formateur f WHERE f.grade LIKE %:motCle% OR f.fonction LIKE %:motCle% OR f.nom LIKE %:motCle% OR f.prenom LIKE %:motCle%")
    List<Formateur> rechercherParMotCle(@Param("motCle") String motCle);
}