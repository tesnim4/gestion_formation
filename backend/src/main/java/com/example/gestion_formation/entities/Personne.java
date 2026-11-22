package com.example.gestion_formation.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Data
@Inheritance(strategy = InheritanceType.JOINED) 
public abstract class Personne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cin;
    private String prenom;
    private String nom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dateNaissance;
    private String email;
}