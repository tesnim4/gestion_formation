package com.example.gestion_formation.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.util.List;
import lombok.ToString;
@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Formateur extends Personne {
    private String grade;
    private String fonction;
    private LocalDate datePremiereFormation;

   @OneToMany(mappedBy = "formateur")
@ToString.Exclude
@EqualsAndHashCode.Exclude
private List<SessionFormation> sessions;
}