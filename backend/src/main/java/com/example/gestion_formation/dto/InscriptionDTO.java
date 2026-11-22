package com.example.gestion_formation.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class InscriptionDTO {
    private Long id;
    private LocalDate dateInscription;
    private Long apprenantId;
    private String apprenantNomComplet;
    private Long sessionId;
    private String sessionDescription;
}