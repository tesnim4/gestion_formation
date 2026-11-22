package com.example.gestion_formation.controllers;

import com.example.gestion_formation.dto.SessionDTO;
import com.example.gestion_formation.entities.SessionFormation;
import com.example.gestion_formation.repositories.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sessions")
public class SessionRestController {

    private final SessionFormationRepository sessionRepo;
    private final ThemeFormationRepository themeRepo;
    private final FormateurRepository formateurRepo;

    public SessionRestController(SessionFormationRepository s,
                                 ThemeFormationRepository t,
                                 FormateurRepository f) {
        this.sessionRepo = s;
        this.themeRepo = t;
        this.formateurRepo = f;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR','APPRENANT')")
    public List<SessionDTO> getAll() {
        return sessionRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public SessionDTO getById(@PathVariable Long id) {
        SessionFormation s = sessionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Session introuvable avec l'id : " + id));
        return toDTO(s);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public SessionDTO create(@RequestBody SessionDTO dto) {
        SessionFormation s = new SessionFormation();
        s.setDescription(dto.getDescription());
        s.setDatebut(dto.getDateDebut());
        s.setDatefin(dto.getDateFin());
        s.setThemeFormation(themeRepo.findById(dto.getThemeId()).orElseThrow());
        if (dto.getFormateurId() != null) {
            s.setFormateur(formateurRepo.findById(dto.getFormateurId()).orElse(null));
        }
        if (dto.getDateDebut() != null && dto.getDateFin() != null
        && !dto.getDateFin().isAfter(dto.getDateDebut())) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "La date de fin doit être postérieure à la date de début.");
}
        return toDTO(sessionRepo.save(s));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public SessionDTO update(@PathVariable Long id, @RequestBody SessionDTO dto) {
        SessionFormation s = sessionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Session introuvable avec l'id : " + id));

        s.setDescription(dto.getDescription());
        s.setDatebut(dto.getDateDebut());
        s.setDatefin(dto.getDateFin());

        if (dto.getThemeId() != null) {
            s.setThemeFormation(themeRepo.findById(dto.getThemeId()).orElse(null));
        }

        if (dto.getFormateurId() != null) {
            s.setFormateur(formateurRepo.findById(dto.getFormateurId()).orElse(null));
        } else {
            s.setFormateur(null); 
        }

        return toDTO(sessionRepo.save(s));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public void delete(@PathVariable Long id) {
        sessionRepo.deleteById(id);
    }

    private SessionDTO toDTO(SessionFormation s) {
        SessionDTO d = new SessionDTO();
        d.setId(s.getId());
        d.setDescription(s.getDescription());
        d.setDateDebut(s.getDatebut());
        d.setDateFin(s.getDatefin());
        if (s.getThemeFormation() != null) {
            d.setThemeId(s.getThemeFormation().getId());
            d.setThemeNom(s.getThemeFormation().getTheme());
        }
        if (s.getFormateur() != null) {
            d.setFormateurId(s.getFormateur().getId());
            d.setFormateurNom(s.getFormateur().getPrenom() + " " + s.getFormateur().getNom());
        }
        return d;
    }
}