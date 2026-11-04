package com.example.gestion_formation.controllers;

import org.springframework.stereotype.Controller;

import com.example.gestion_formation.entities.SessionFormation;
import com.example.gestion_formation.repositories.SessionFormationRepository;
import com.example.gestion_formation.repositories.ThemeFormationRepository;
import com.example.gestion_formation.services.SessionFormationService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/sessions")
public class SessionController {

    private final SessionFormationRepository sessionRepo;
    private final ThemeFormationRepository themeRepo;
    private final SessionFormationService sessionService;

    public SessionController(SessionFormationRepository sessionRepo, ThemeFormationRepository themeRepo,
            SessionFormationService sessionService) {
        this.sessionRepo = sessionRepo;
        this.themeRepo = themeRepo;
        this.sessionService = sessionService;
    }

    @GetMapping
    public String liste(Model model) {
        model.addAttribute("sessions", sessionRepo.findAll());
        return "sessions/liste"; 
    }

    @GetMapping("/nouvelle")
    public String formNouvelle(Model model) {
        model.addAttribute("session", new SessionFormation());
        model.addAttribute("themes", themeRepo.findAll()); 
        return "sessions/form"; 
    }

    @PostMapping("/save")
    public String save(@ModelAttribute SessionFormation session) {
        sessionRepo.save(session);
        return "redirect:/sessions";
    }

    @GetMapping("/{id}/stats")
    public String statistiques(@PathVariable Long id, Model model) {
        int total = sessionService.nombreTotalApprenantsParSession(id);
        model.addAttribute("totalApprenants", total);
        return "sessions/stats";
    }
}