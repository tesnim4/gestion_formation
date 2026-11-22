package com.example.gestion_formation.controllers;

import com.example.gestion_formation.dto.FormateurDTO;
import com.example.gestion_formation.entities.*;
import com.example.gestion_formation.repositories.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/formateurs")
@PreAuthorize("hasRole('ADMIN')") 
public class FormateurRestController {

    private final FormateurRepository formateurRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    public FormateurRestController(FormateurRepository formateurRepo,
                                   UtilisateurRepository utilisateurRepo,
                                   RoleRepository roleRepo,
                                   PasswordEncoder passwordEncoder) {
        this.formateurRepo = formateurRepo;
        this.utilisateurRepo = utilisateurRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<FormateurDTO> getAll() {
        return formateurRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public FormateurDTO getById(@PathVariable Long id) {
        Formateur f = formateurRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Formateur introuvable avec l'id : " + id));
        return toDTO(f);
    }

    @PostMapping
    public FormateurDTO create(@RequestBody Formateur formateur) {
        Formateur savedFormateur = formateurRepo.save(formateur);

        if (savedFormateur.getEmail() != null && utilisateurRepo.findByUsername(savedFormateur.getEmail()).isEmpty()) {

            Utilisateur user = new Utilisateur();
            user.setUsername(savedFormateur.getEmail());
            user.setPassword(passwordEncoder.encode("123456"));
            user.setEnabled(true);

            Role roleFormateur = roleRepo.findByNom("ROLE_FORMATEUR")
                    .orElseThrow(() -> new RuntimeException("Rôle FORMATEUR introuvable"));

            UtilisateurRole userRole = new UtilisateurRole();
            userRole.setUtilisateur(user);
            userRole.setRole(roleFormateur);
            user.setRoles(List.of(userRole));

            utilisateurRepo.save(user);

            System.out
                    .println(" Compte Formateur créé pour : " + savedFormateur.getEmail() + " / mot de passe: 123456");
        }

        return toDTO(savedFormateur);
    }

    @PutMapping("/{id}")
    public FormateurDTO update(@PathVariable Long id, @RequestBody Formateur updatedFormateur) {
        Formateur f = formateurRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Formateur introuvable avec l'id : " + id));

        f.setCin(updatedFormateur.getCin());
        f.setNom(updatedFormateur.getNom());
        f.setPrenom(updatedFormateur.getPrenom());
        f.setEmail(updatedFormateur.getEmail());
        f.setGrade(updatedFormateur.getGrade());
        f.setFonction(updatedFormateur.getFonction());

        // Si tu as d'autres champs modifiables (comme la date de naissance), ajoute-les
        // ici
        // f.setDateNaissance(updatedFormateur.getDateNaissance());

        Formateur savedFormateur = formateurRepo.save(f);
        return toDTO(savedFormateur);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        formateurRepo.deleteById(id);
    }

    private FormateurDTO toDTO(Formateur f) {
        FormateurDTO d = new FormateurDTO();
        d.setId(f.getId());
        d.setCin(f.getCin());
        d.setNom(f.getNom());
        d.setPrenom(f.getPrenom());
        d.setEmail(f.getEmail());
        d.setDateNaissance(f.getDateNaissance());
        d.setGrade(f.getGrade());
        d.setFonction(f.getFonction());
        d.setDatePremiereFormation(f.getDatePremiereFormation());
        return d;
    }
}