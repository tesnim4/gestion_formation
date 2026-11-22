package com.example.gestion_formation.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FormateurDTO {
    private Long id;
    private String cin;
    private String nom;
    private String prenom;
    private String email;
    private LocalDate dateNaissance;
    private String grade;
    private String fonction;
    private LocalDate datePremiereFormation;
}