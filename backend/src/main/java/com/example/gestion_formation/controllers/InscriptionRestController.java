package com.example.gestion_formation.controllers;

import com.example.gestion_formation.dto.InscriptionDTO;
import com.example.gestion_formation.entities.*;
import com.example.gestion_formation.repositories.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionRestController {

    private final InscriptionRepository inscriptionRepo;
    private final ApprenantRepository apprenantRepo;
    private final SessionFormationRepository sessionRepo;

    public InscriptionRestController(InscriptionRepository i,
                                     ApprenantRepository a,
                                     SessionFormationRepository s) {
        this.inscriptionRepo = i;
        this.apprenantRepo = a;
        this.sessionRepo = s;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR','APPRENANT')")
    public List<InscriptionDTO> getAll(Authentication auth) {
        boolean isApprenant = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_APPRENANT"));

        List<Inscription> list = isApprenant
                ? inscriptionRepo.findByApprenantEmail(auth.getName()) // à ajouter dans le repository
                : inscriptionRepo.findAll();

        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public InscriptionDTO getById(@PathVariable Long id) {
        Inscription i = inscriptionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription introuvable avec l'id : " + id));
        return toDTO(i);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public InscriptionDTO create(@RequestBody InscriptionDTO dto) {
        Inscription i = new Inscription();
        i.setDateInscription(LocalDate.now());
        i.setApprenant(apprenantRepo.findById(dto.getApprenantId()).orElseThrow());
        i.setSessionFormation(sessionRepo.findById(dto.getSessionId()).orElseThrow());
        return toDTO(inscriptionRepo.save(i));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public InscriptionDTO update(@PathVariable Long id, @RequestBody InscriptionDTO dto) {
        Inscription i = inscriptionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription introuvable avec l'id : " + id));

        // On met à jour l'apprenant et la session (on garde la date d'inscription
        // d'origine)
        i.setApprenant(apprenantRepo.findById(dto.getApprenantId()).orElseThrow());
        i.setSessionFormation(sessionRepo.findById(dto.getSessionId()).orElseThrow());

        return toDTO(inscriptionRepo.save(i));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public void delete(@PathVariable Long id) { inscriptionRepo.deleteById(id); }

    private InscriptionDTO toDTO(Inscription i) {
        InscriptionDTO d = new InscriptionDTO();
        d.setId(i.getId());
        d.setDateInscription(i.getDateInscription());
        d.setApprenantId(i.getApprenant().getId());
        d.setApprenantNomComplet(i.getApprenant().getPrenom() + " " + i.getApprenant().getNom());
        d.setSessionId(i.getSessionFormation().getId());
        d.setSessionDescription(i.getSessionFormation().getDescription());
        return d;
    }
}