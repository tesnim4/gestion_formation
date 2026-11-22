package com.example.gestion_formation.config;

import com.example.gestion_formation.entities.Utilisateur;
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
    private final PasswordEncoder encoder;

  @Override
public void run(String... args) {
    if (utilisateurRepository.count() == 0) {
        Utilisateur admin = new Utilisateur();
        admin.setUsername("admin@test.com"); 
        admin.setPassword(encoder.encode("admin123"));
        admin.setRoles(List.of("ROLE_ADMIN"));
        
        utilisateurRepository.save(admin);
        
    }
}}