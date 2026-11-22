package com.example.gestion_formation.controllers;

import com.example.gestion_formation.entities.Apprenant;
import com.example.gestion_formation.entities.Role;
import com.example.gestion_formation.entities.Utilisateur;
import com.example.gestion_formation.entities.UtilisateurRole;
import com.example.gestion_formation.repositories.ApprenantRepository;
import com.example.gestion_formation.repositories.RoleRepository;
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
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    public ApprenantController(ApprenantRepository apprenantRepo, UtilisateurRepository utilisateurRepo,
                               RoleRepository roleRepo, PasswordEncoder passwordEncoder) {
        this.apprenantRepo = apprenantRepo;
        this.utilisateurRepo = utilisateurRepo;
        this.roleRepo = roleRepo;
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
                
                Role roleApprenant = roleRepo.findByNom("ROLE_APPRENANT")
                        .orElseThrow(() -> new RuntimeException("Erreur: Rôle APPRENANT introuvable"));
                
                UtilisateurRole userRole = new UtilisateurRole();
                userRole.setUtilisateur(user);
                userRole.setRole(roleApprenant);
                
                user.setRoles(List.of(userRole));
                
                utilisateurRepo.save(user);
                ra.addFlashAttribute("success", "Apprenant ajouté ! Compte créé (Mot de passe par défaut: 123456).");
            } else {
                ra.addFlashAttribute("success", "Apprenant mis à jour.");
            }
        } else {
            ra.addFlashAttribute("error", "Erreur : L'email est obligatoire pour créer un compte.");
        }

        return "redirect:/apprenants";
    }
}