package com.example.gestion_formation.config;

import com.example.gestion_formation.entities.Role;
import com.example.gestion_formation.entities.Utilisateur;
import com.example.gestion_formation.entities.UtilisateurRole;
import com.example.gestion_formation.repositories.RoleRepository;
import com.example.gestion_formation.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByNom("ROLE_ADMIN").orElseGet(() -> {
            Role r = new Role(); r.setNom("ROLE_ADMIN"); return roleRepository.save(r);
        });
        Role formateurRole = roleRepository.findByNom("ROLE_FORMATEUR").orElseGet(() -> {
            Role r = new Role(); r.setNom("ROLE_FORMATEUR"); return roleRepository.save(r);
        });
        Role apprenantRole = roleRepository.findByNom("ROLE_APPRENANT").orElseGet(() -> {
            Role r = new Role(); r.setNom("ROLE_APPRENANT"); return roleRepository.save(r);
        });

        if (utilisateurRepository.count() == 0) {
            Utilisateur admin = new Utilisateur();
            admin.setUsername("admin@test.com"); 
            admin.setPassword(encoder.encode("admin123"));
            
            UtilisateurRole adminLink = new UtilisateurRole();
            adminLink.setUtilisateur(admin);
            adminLink.setRole(adminRole);
            
            admin.setRoles(List.of(adminLink)); 
            
            utilisateurRepository.save(admin);
            
        }
    }
}