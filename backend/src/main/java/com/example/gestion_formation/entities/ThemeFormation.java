package com.example.gestion_formation.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class ThemeFormation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String theme;
    private String motsCles;

    @OneToMany(mappedBy = "themeFormation")
    private List<SessionFormation> sessions;
}