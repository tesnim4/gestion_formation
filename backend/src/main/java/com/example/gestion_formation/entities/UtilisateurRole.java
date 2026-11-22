package com.example.gestion_formation.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
@Entity
@Data
public class UtilisateurRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
@JoinColumn(name = "utilisateur_id")
@ToString.Exclude
@EqualsAndHashCode.Exclude
private Utilisateur utilisateur;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}