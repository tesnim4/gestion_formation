package com.example.gestion_formation.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom; 

    @OneToMany(mappedBy = "role")
    private List<UtilisateurRole> utilisateurs;
}