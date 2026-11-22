package com.example.gestion_formation.controllers;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.gestion_formation.entities.Inscription;
import com.example.gestion_formation.repositories.ApprenantRepository;
import com.example.gestion_formation.repositories.InscriptionRepository;
import com.example.gestion_formation.repositories.SessionFormationRepository;

@Controller
@RequestMapping("/inscriptions")
public class InscriptionController {

    private final InscriptionRepository inscriptionRepo;
    private final ApprenantRepository apprenantRepo;
    private final SessionFormationRepository sessionRepo;

    public InscriptionController(InscriptionRepository inscriptionRepo,
                                 ApprenantRepository apprenantRepo,
                                 SessionFormationRepository sessionRepo) {
        this.inscriptionRepo = inscriptionRepo;
        this.apprenantRepo = apprenantRepo;
        this.sessionRepo = sessionRepo;
    }

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR','APPRENANT')")
    public String liste(Model model, Principal principal) {
        List<Inscription> inscriptions;
        boolean isApprenant = isRoleApprenant();

        if (isApprenant) {
            inscriptions = inscriptionRepo.findByApprenantEmail(principal.getName());
        } else {
            inscriptions = inscriptionRepo.findAll();
        }

        model.addAttribute("inscriptions", inscriptions);
        return "inscriptions/liste";
    }

    @GetMapping("/nouvelle")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String form(Model model) {
        model.addAttribute("inscription", new Inscription());
        model.addAttribute("apprenants", apprenantRepo.findAll());
        model.addAttribute("sessions", sessionRepo.findAll());
        model.addAttribute("editMode", false);
        return "inscriptions/form";
    }

    @GetMapping("/{id}/edit")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String formEdit(@PathVariable Long id, Model model, RedirectAttributes ra) {
        Inscription inscription = inscriptionRepo.findById(id).orElse(null);
        if (inscription == null) {
            ra.addFlashAttribute("error", "Inscription introuvable");
            return "redirect:/inscriptions";
        }
        model.addAttribute("inscription", inscription);
        model.addAttribute("apprenants", apprenantRepo.findAll());
        model.addAttribute("sessions", sessionRepo.findAll());
        model.addAttribute("editMode", true);
        return "inscriptions/form";
    }

    @PostMapping("/save")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String save(@ModelAttribute Inscription inscription, RedirectAttributes ra) {
        if (inscription.getId() == null) {
            inscription.setDateInscription(LocalDate.now());
        }
        inscriptionRepo.save(inscription);
        ra.addFlashAttribute("success", "Inscription enregistrée avec succès");
        return "redirect:/inscriptions";
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        inscriptionRepo.deleteById(id);
        ra.addFlashAttribute("success", "Inscription supprimée");
        return "redirect:/inscriptions";
    }

    private boolean isRoleApprenant() {
        return org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_APPRENANT"));
    }
}