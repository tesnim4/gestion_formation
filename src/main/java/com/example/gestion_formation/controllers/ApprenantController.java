package com.example.gestion_formation.controllers;

import org.springframework.stereotype.Controller;

import com.example.gestion_formation.entities.Apprenant;
import com.example.gestion_formation.repositories.ApprenantRepository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/apprenants")
public class ApprenantController {

    private final ApprenantRepository apprenantRepo;

    public ApprenantController(ApprenantRepository apprenantRepo) {
        this.apprenantRepo = apprenantRepo;
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
    public String save(@ModelAttribute Apprenant apprenant) {
        apprenantRepo.save(apprenant);
        return "redirect:/apprenants";
    }
}