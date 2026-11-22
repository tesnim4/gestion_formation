package com.example.gestion_formation.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.gestion_formation.entities.Formateur;
import com.example.gestion_formation.repositories.FormateurRepository;

@Service
public class FormateurService {

    private final FormateurRepository formateurRepository;

    public FormateurService(FormateurRepository formateurRepository) {
        this.formateurRepository = formateurRepository;
    }

    public List<Formateur> rechercherParNomPrenom(String nom, String prenom) {
        return formateurRepository.findByNomAndPrenom(nom, prenom);
    }

    public List<Formateur> rechercherParMotCle(String motCle) {
        return formateurRepository.rechercherParMotCle(motCle);
    }
}