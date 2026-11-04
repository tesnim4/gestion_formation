package com.example.gestion_formation.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Apprenant extends Personne {
    private String numero;
    private LocalDate datePremiereInscription;

    @OneToMany(mappedBy = "apprenant")
    private List<Inscription> inscriptions;
}