package com.example.gestion_formation.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class SessionFormation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private LocalDate datebut;
    private LocalDate datefin;

    @ManyToOne
    @JoinColumn(name = "theme_id")
    private ThemeFormation themeFormation;

    @OneToMany(mappedBy = "sessionFormation")
    private List<Inscription> inscriptions;
}