package com.example.gestion_formation.controllers;

import com.example.gestion_formation.dto.ThemeDTO;
import com.example.gestion_formation.entities.ThemeFormation;
import com.example.gestion_formation.repositories.ThemeFormationRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/themes")
public class ThemeRestController {

    private final ThemeFormationRepository repo;

    public ThemeRestController(ThemeFormationRepository repo) { this.repo = repo; }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FORMATEUR')")
    public List<ThemeDTO> getAll() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ThemeDTO create(@RequestBody ThemeFormation theme) {
        return toDTO(repo.save(theme));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ThemeDTO update(@PathVariable Long id, @RequestBody ThemeFormation updated) {
        ThemeFormation t = repo.findById(id).orElseThrow();
        t.setTheme(updated.getTheme());
        t.setMotsCles(updated.getMotsCles());
        return toDTO(repo.save(t));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    private ThemeDTO toDTO(ThemeFormation t) {
        ThemeDTO d = new ThemeDTO();
        d.setId(t.getId());
        d.setTheme(t.getTheme());
        d.setMotsCles(t.getMotsCles());
        return d;
    }
}