package com.example.gestion_formation.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.gestion_formation.entities.ThemeFormation;
import com.example.gestion_formation.repositories.ThemeFormationRepository;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/themes")
public class ThemeController {

    private final ThemeFormationRepository themeRepo;

    public ThemeController(ThemeFormationRepository themeRepo) {
        this.themeRepo = themeRepo;
    }

    @GetMapping
    public String liste(Model model) {
        model.addAttribute("themes", themeRepo.findAll());
        return "themes/liste"; // Vue: themes/liste.html
    }

    @GetMapping("/nouveau")
    public String form(Model model) {
        model.addAttribute("theme", new ThemeFormation());
        return "themes/form"; // Vue: themes/form.html
    }

    @PostMapping("/save")
    public String save(@ModelAttribute ThemeFormation theme) {
        themeRepo.save(theme);
        return "redirect:/themes";
    }
}