package com.example.gestion_formation.controllers;

import org.springframework.stereotype.Controller;

import com.example.gestion_formation.entities.Inscription;
import com.example.gestion_formation.repositories.ApprenantRepository;
import com.example.gestion_formation.repositories.InscriptionRepository;
import com.example.gestion_formation.repositories.SessionFormationRepository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@Controller
@RequestMapping("/inscriptions")
public class InscriptionController {

    private final InscriptionRepository inscriptionRepo;
    private final ApprenantRepository apprenantRepo;
    private final SessionFormationRepository sessionRepo;

    public InscriptionController(InscriptionRepository inscriptionRepo, ApprenantRepository apprenantRepo,
            SessionFormationRepository sessionRepo) {
        this.inscriptionRepo = inscriptionRepo;
        this.apprenantRepo = apprenantRepo;
        this.sessionRepo = sessionRepo;
    }

    @GetMapping
    public String liste(Model model) {
        model.addAttribute("inscriptions", inscriptionRepo.findAll());
        return "inscriptions/liste";
    }

    @GetMapping("/nouvelle")
    public String form(Model model) {
        model.addAttribute("inscription", new Inscription());
        model.addAttribute("apprenants", apprenantRepo.findAll());
        model.addAttribute("sessions", sessionRepo.findAll());
        return "inscriptions/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Inscription inscription) {
        inscription.setDateInscription(LocalDate.now()); // Date du jour automatique
        inscriptionRepo.save(inscription);
        return "redirect:/inscriptions";
    }
}