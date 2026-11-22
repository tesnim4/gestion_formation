package com.example.gestion_formation.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ApprenantDTO {
    private Long id;
    private String cin;
    private String nom;
    private String prenom;
    private String email;
    private LocalDate dateNaissance;
    private String numero;
    private LocalDate datePremiereInscription;
}