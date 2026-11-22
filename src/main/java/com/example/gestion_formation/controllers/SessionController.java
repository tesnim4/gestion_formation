package com.example.gestion_formation.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.gestion_formation.entities.SessionFormation;
import com.example.gestion_formation.repositories.FormateurRepository;
import com.example.gestion_formation.repositories.SessionFormationRepository;
import com.example.gestion_formation.repositories.ThemeFormationRepository;
import com.example.gestion_formation.services.SessionFormationService;

@Controller
@RequestMapping("/sessions")
public class SessionController {

    private final SessionFormationRepository sessionRepo;
    private final ThemeFormationRepository themeRepo;
    private final SessionFormationService sessionService;
    private final FormateurRepository formateurRepo;

    public SessionController(SessionFormationRepository sessionRepo,
                             ThemeFormationRepository themeRepo,
                             SessionFormationService sessionService,
                             FormateurRepository formateurRepo) {
        this.sessionRepo = sessionRepo;
        this.themeRepo = themeRepo;
        this.sessionService = sessionService;
        this.formateurRepo = formateurRepo;
    }

   
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR','APPRENANT')")
    public String liste(Model model, Principal principal) {
        List<SessionFormation> sessions;

        boolean isApprenant = principal != null
                && principal.getName() != null
                && isApprenant(principal);

        if (isApprenant) {
            sessions = sessionRepo.findByInscriptionsApprenantEmail(principal.getName());
        } else {
            sessions = sessionRepo.findAll();
        }

        model.addAttribute("sessions", sessions);
        model.addAttribute("isApprenant", isApprenant);
        return "sessions/liste";
    }

    @GetMapping("/nouvelle")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String formNouvelle(Model model) {
        model.addAttribute("session", new SessionFormation());
        model.addAttribute("themes", themeRepo.findAll());
        model.addAttribute("formateurs", formateurRepo.findAll());
        model.addAttribute("editMode", false);
        return "sessions/form";
    }

    @GetMapping("/{id}/edit")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String formEdit(@PathVariable Long id, Model model, RedirectAttributes ra) {
        SessionFormation session = sessionRepo.findById(id).orElse(null);
        if (session == null) {
            ra.addFlashAttribute("error", "Session introuvable");
            return "redirect:/sessions";
        }
        model.addAttribute("session", session);
        model.addAttribute("themes", themeRepo.findAll());
        model.addAttribute("formateurs", formateurRepo.findAll());
        model.addAttribute("editMode", true);
        return "sessions/form";
    }

    @PostMapping("/save")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String save(@ModelAttribute SessionFormation session, RedirectAttributes ra) {
        sessionRepo.save(session);
        ra.addFlashAttribute("success", "Session enregistrée avec succès");
        return "redirect:/sessions";
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        sessionRepo.deleteById(id);
        ra.addFlashAttribute("success", "Session supprimée");
        return "redirect:/sessions";
    }

    @GetMapping("/{id}/stats")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public String statistiques(@PathVariable Long id, Model model) {
        int total = sessionService.nombreTotalApprenantsParSession(id);
        model.addAttribute("totalApprenants", total);
        return "sessions/stats";
    }

    private boolean isApprenant(Principal principal) {
        return sessionRepo.countByApprenantEmail(principal.getName()) >= 0
                && isRoleApprenant(principal);
    }

    private boolean isRoleApprenant(Principal principal) {
        return org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_APPRENANT"));
    }
}