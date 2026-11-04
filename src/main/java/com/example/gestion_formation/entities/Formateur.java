package com.example.gestion_formation.entities;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Formateur extends Personne {
    private String grade;
    private String fonction;
    private LocalDate datePremiereFormation;
}