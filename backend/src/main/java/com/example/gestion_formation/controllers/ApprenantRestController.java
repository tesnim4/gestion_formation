package com.example.gestion_formation.controllers;

import com.example.gestion_formation.dto.ApprenantDTO;
import com.example.gestion_formation.entities.*;
import com.example.gestion_formation.repositories.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/apprenants")
public class ApprenantRestController {

    private final ApprenantRepository apprenantRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    public ApprenantRestController(ApprenantRepository apprenantRepo,
                                   UtilisateurRepository utilisateurRepo,
                                   RoleRepository roleRepo,
                                   PasswordEncoder passwordEncoder) {
        this.apprenantRepo = apprenantRepo;
        this.utilisateurRepo = utilisateurRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FORMATEUR')")
    public List<ApprenantDTO> getAll() {
        return apprenantRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") 
    public ApprenantDTO create(@RequestBody Apprenant apprenant) {
        Apprenant savedApprenant = apprenantRepo.save(apprenant);

        if (savedApprenant.getEmail() != null && utilisateurRepo.findByUsername(savedApprenant.getEmail()).isEmpty()) {

            Utilisateur user = new Utilisateur();
            user.setUsername(savedApprenant.getEmail());
            user.setPassword(passwordEncoder.encode("123456"));
            user.setEnabled(true);

            Role roleApprenant = roleRepo.findByNom("ROLE_APPRENANT")
                    .orElseThrow(() -> new RuntimeException("Rôle APPRENANT introuvable"));

            UtilisateurRole userRole = new UtilisateurRole();
            userRole.setUtilisateur(user);
            userRole.setRole(roleApprenant);
            user.setRoles(List.of(userRole));

            utilisateurRepo.save(user);

            System.out
                    .println(" Compte Apprenant créé pour : " + savedApprenant.getEmail() + " / mot de passe: 123456");
        }

        return toDTO(savedApprenant);
    }

    @GetMapping("/{id}")
    public ApprenantDTO getById(@PathVariable Long id) {
        Apprenant apprenant = apprenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable avec l'id : " + id));
        return toDTO(apprenant);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApprenantDTO update(@PathVariable Long id, @RequestBody Apprenant apprenantDetails) {
        Apprenant apprenant = apprenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable avec l'id : " + id));

        apprenant.setCin(apprenantDetails.getCin());
        apprenant.setNom(apprenantDetails.getNom());
        apprenant.setPrenom(apprenantDetails.getPrenom());
        apprenant.setEmail(apprenantDetails.getEmail());
        apprenant.setDateNaissance(apprenantDetails.getDateNaissance());
        apprenant.setNumero(apprenantDetails.getNumero());
        apprenant.setDatePremiereInscription(apprenantDetails.getDatePremiereInscription());

        Apprenant updatedApprenant = apprenantRepo.save(apprenant);
        return toDTO(updatedApprenant);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        apprenantRepo.deleteById(id);
    }

    private ApprenantDTO toDTO(Apprenant a) {
        ApprenantDTO d = new ApprenantDTO();
        d.setId(a.getId());
        d.setCin(a.getCin());
        d.setNom(a.getNom());
        d.setPrenom(a.getPrenom());
        d.setEmail(a.getEmail());
        d.setDateNaissance(a.getDateNaissance());
        d.setNumero(a.getNumero());
        d.setDatePremiereInscription(a.getDatePremiereInscription());
        return d;
    }
}