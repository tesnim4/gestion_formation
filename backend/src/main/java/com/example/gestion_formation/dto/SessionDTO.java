package com.example.gestion_formation.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SessionDTO {
    private Long id;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Long themeId;
    private String themeNom;
    private Long formateurId;
    private String formateurNom;
}