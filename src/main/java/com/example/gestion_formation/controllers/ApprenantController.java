package com.example.gestion_formation.controllers;

import com.example.gestion_formation.entities.Apprenant;
import com.example.gestion_formation.entities.Utilisateur;
import com.example.gestion_formation.repositories.ApprenantRepository;
import com.example.gestion_formation.repositories.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/apprenants")
public class ApprenantController {

    private final ApprenantRepository apprenantRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    public ApprenantController(ApprenantRepository apprenantRepo, 
                               UtilisateurRepository utilisateurRepo,
                               PasswordEncoder passwordEncoder) {
        this.apprenantRepo = apprenantRepo;
        this.utilisateurRepo = utilisateurRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public String liste(Model model) {
        model.addAttribute("apprenants", apprenantRepo.findAll());
        return "apprenants/liste";
    }

    @GetMapping("/nouveau")
    public String form(Model model) {
        model.addAttribute("apprenant", new Apprenant());
        return "apprenants/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Apprenant apprenant, RedirectAttributes ra) {
        apprenantRepo.save(apprenant);

        if (apprenant.getEmail() != null && !apprenant.getEmail().isEmpty()) {
            if (utilisateurRepo.findByUsername(apprenant.getEmail()).isEmpty()) {
                Utilisateur user = new Utilisateur();
                user.setUsername(apprenant.getEmail()); 
                user.setPassword(passwordEncoder.encode("123456")); 
                user.setRoles(List.of("ROLE_APPRENANT"));
                
                utilisateurRepo.save(user);
                ra.addFlashAttribute("success", "Apprenant ajouté ! Compte créé ");
            } else {
                ra.addFlashAttribute("success", "Apprenant mis à jour.");
            }
        } else {
            ra.addFlashAttribute("error", "Erreur : L'email est obligatoire pour créer un compte.");
        }

        return "redirect:/apprenants";
    }
}