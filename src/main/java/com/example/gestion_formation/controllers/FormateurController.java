package com.example.gestion_formation.controllers;

import com.example.gestion_formation.entities.Formateur;
import com.example.gestion_formation.repositories.FormateurRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/formateurs")
public class FormateurController {

    private final FormateurRepository formateurRepo;

    public FormateurController(FormateurRepository formateurRepo) {
        this.formateurRepo = formateurRepo;
    }

    @GetMapping
    public String liste(Model model) {
        model.addAttribute("formateurs", formateurRepo.findAll());
        return "formateurs/liste";
    }

    @GetMapping("/nouveau")
    public String form(Model model) {
        model.addAttribute("formateur", new Formateur());
        return "formateurs/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Formateur formateur) {
        formateurRepo.save(formateur);
        return "redirect:/formateurs";
    }
}