package com.example.gestion_formation.controllers;

import com.example.gestion_formation.entities.SessionFormation;
import com.example.gestion_formation.repositories.ThemeFormationRepository;
import com.example.gestion_formation.services.SessionFormationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/recherche")
public class RechercheController {

    private final SessionFormationService sessionService;
    private final ThemeFormationRepository themeRepo;

    public RechercheController(SessionFormationService sessionService, ThemeFormationRepository themeRepo) {
        this.sessionService = sessionService;
        this.themeRepo = themeRepo;
    }
    @GetMapping
    public String form(Model model) {
        model.addAttribute("themes", themeRepo.findAll());
        return "recherche/form";
    }

    @PostMapping
    public String resultats(
            @RequestParam String theme,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            Model model) {

        List<SessionFormation> sessionsParTheme = sessionService.rechercherParTheme(theme);

        List<SessionFormation> resultats = sessionService.rechercherParDates(du, au);

        List<SessionFormation> resultatsFinaux = sessionsParTheme.stream()
                .filter(s -> resultats.contains(s))
                .toList();

        model.addAttribute("resultats", resultatsFinaux);
        model.addAttribute("themes", themeRepo.findAll());
        return "recherche/form";
    }
}
