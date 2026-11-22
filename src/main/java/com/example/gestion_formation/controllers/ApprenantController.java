
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

    public ApprenantController(ApprenantRepository apprenantRepo,
            UtilisateurRepository utilisateurRepo,
            RoleRepository roleRepo,
            PasswordEncoder passwordEncoder) {
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

    @GetMapping("/{id}/edit")
    public String edit(@PathVariable Long id, Model model, RedirectAttributes ra) {
        Apprenant a = apprenantRepo.findById(id).orElse(null);
        if (a == null) {
            ra.addFlashAttribute("error", "Apprenant introuvable.");
            return "redirect:/apprenants";
        }
        model.addAttribute("apprenant", a);
        return "apprenants/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Apprenant apprenant, RedirectAttributes ra) {

        boolean isNew = (apprenant.getId() == null);

        if (apprenant.getEmail() == null || apprenant.getEmail().isBlank()) {
            ra.addFlashAttribute("error", "L'email est obligatoire pour créer un compte.");
            return "redirect:/apprenants";
        }

        String ancienEmail = null;
        if (!isNew) {
            ancienEmail = apprenantRepo.findById(apprenant.getId())
                    .map(Apprenant::getEmail)
                    .orElse(null);
        }

        apprenantRepo.save(apprenant);

        if (isNew) {
            if (utilisateurRepo.findByUsername(apprenant.getEmail()).isEmpty()) {
                Utilisateur user = new Utilisateur();
                user.setUsername(apprenant.getEmail());
                user.setPassword(passwordEncoder.encode("123456"));

                Role roleApprenant = roleRepo.findByNom("ROLE_APPRENANT")
                        .orElseThrow(() -> new RuntimeException("Rôle APPRENANT introuvable"));

                UtilisateurRole userRole = new UtilisateurRole();
                userRole.setUtilisateur(user);
                userRole.setRole(roleApprenant);

                user.setRoles(List.of(userRole));

                utilisateurRepo.save(user);
                ra.addFlashAttribute("success",
                        "Apprenant ajouté ! Compte créé avec succès.");
            } else {
                ra.addFlashAttribute("success",
                        "Apprenant ajouté (compte utilisateur existant réutilisé).");
            }
        } else {
            if (ancienEmail != null && !ancienEmail.equals(apprenant.getEmail())) {
                final String oldEmail = ancienEmail;
                utilisateurRepo.findByUsername(oldEmail).ifPresent(u -> {
                    u.setUsername(apprenant.getEmail());
                    utilisateurRepo.save(u);
                });
            }
            ra.addFlashAttribute("success", "Apprenant modifié avec succès.");
        }

        return "redirect:/apprenants";
    }

    @PostMapping("/{id}/delete")
    public String supprimer(@PathVariable Long id, RedirectAttributes ra) {
        try {
            Apprenant a = apprenantRepo.findById(id).orElse(null);
            if (a == null) {
                ra.addFlashAttribute("error", "Apprenant introuvable.");
                return "redirect:/apprenants";
            }

            String email = a.getEmail();

            apprenantRepo.delete(a);

            if (email != null && !email.isBlank()) {
                utilisateurRepo.findByUsername(email).ifPresent(utilisateurRepo::delete);
            }

            ra.addFlashAttribute("success", "Apprenant supprimé ✔");

        } catch (Exception e) {
            ra.addFlashAttribute("error",
                    "Suppression impossible : cet apprenant est lié à d'autres données "
                            + "(inscriptions, sessions, ...).");
        }

        return "redirect:/apprenants";
    }
}
