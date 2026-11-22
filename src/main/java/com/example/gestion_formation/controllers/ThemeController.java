package com.example.gestion_formation.controllers;

import org.springframework.stereotype.Controller;

import com.example.gestion_formation.entities.ThemeFormation;
import com.example.gestion_formation.repositories.ThemeFormationRepository;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
        return "themes/liste"; 
    }

    @GetMapping("/nouveau")
    public String form(Model model) {
        model.addAttribute("theme", new ThemeFormation());
        return "themes/form";
    }

    @GetMapping("/{id}/edit")
    public String edit(@PathVariable Long id, Model model, RedirectAttributes ra) {
    ThemeFormation t = themeRepo.findById(id).orElse(null);
    if (t == null) {
        ra.addFlashAttribute("error", "Thème introuvable");
        return "redirect:/themes";
    }
    model.addAttribute("theme", t);  
    return "themes/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute ThemeFormation theme) {
        themeRepo.save(theme);
        return "redirect:/themes";
    }

    @PostMapping("/{id}/delete")
    public String supprimer(@PathVariable Long id, RedirectAttributes ra) {
        try {
            if (!themeRepo.existsById(id)) {
                ra.addFlashAttribute("error", "Thème introuvable (id=" + id + ")");
            } else {
                themeRepo.deleteById(id);
                ra.addFlashAttribute("success", "Thème supprimé ✔");
            }
        } catch (Exception e) {
            ra.addFlashAttribute("error",
                    "Suppression impossible : ce thème est peut-être utilisé ailleurs.");
        }
        return "redirect:/themes";
    }
}