package com.example.gestion_formation.controllers;

import com.example.gestion_formation.entities.Formateur;
import com.example.gestion_formation.entities.Role;
import com.example.gestion_formation.entities.Utilisateur;
import com.example.gestion_formation.repositories.FormateurRepository;
import com.example.gestion_formation.repositories.RoleRepository;
import com.example.gestion_formation.repositories.UtilisateurRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/formateurs")
@PreAuthorize("hasRole('ADMIN')") 
public class FormateurController {

    private final FormateurRepository formateurRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    public FormateurController(FormateurRepository formateurRepo, 
                               UtilisateurRepository utilisateurRepo,
                               RoleRepository roleRepo,
                               PasswordEncoder passwordEncoder) {
        this.formateurRepo = formateurRepo;
        this.utilisateurRepo = utilisateurRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public String liste(Model model) {
        model.addAttribute("formateurs", formateurRepo.findAll());
        return "formateurs/liste";
    }

    @GetMapping("/nouveau")
    public String formNouveau(Model model) {
        model.addAttribute("formateur", new Formateur());
        return "formateurs/form";
    }

    @GetMapping("/{id}/edit")
    public String formEdit(@PathVariable Long id, Model model, RedirectAttributes ra) {
        Formateur formateur = formateurRepo.findById(id).orElse(null);
        if (formateur == null) {
            ra.addFlashAttribute("error", "Formateur introuvable");
            return "redirect:/formateurs";
        }
        model.addAttribute("formateur", formateur);
        return "formateurs/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Formateur formateur, RedirectAttributes ra) {
        formateurRepo.save(formateur);

        if (formateur.getEmail() != null && !formateur.getEmail().isEmpty()) {
            if (utilisateurRepo.findByUsername(formateur.getEmail()).isEmpty()) {
                Utilisateur user = new Utilisateur();
                user.setUsername(formateur.getEmail());
                user.setPassword(passwordEncoder.encode("123456"));
                
                Role roleFormateur = roleRepo.findByNom("ROLE_FORMATEUR")
                        .orElseThrow(() -> new RuntimeException("Erreur: Rôle FORMATEUR introuvable"));
                
                user.setRoles(List.of(roleFormateur));
                
                utilisateurRepo.save(user);
                ra.addFlashAttribute("success", "Formateur ajouté ! Compte créé .");
            } else {
                ra.addFlashAttribute("success", "Formateur mis à jour.");
            }
        } else {
            ra.addFlashAttribute("error", "Erreur : L'email est obligatoire.");
        }

        return "redirect:/formateurs";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        formateurRepo.deleteById(id);
        ra.addFlashAttribute("success", "Formateur supprimé avec succès");
        return "redirect:/formateurs";
    }
}