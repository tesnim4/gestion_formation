package com.example.gestion_formation.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom; 

    @OneToMany(mappedBy = "role")
@ToString.Exclude
@EqualsAndHashCode.Exclude
private List<UtilisateurRole> utilisateurs;
}