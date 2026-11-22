package com.example.gestion_formation.security;

import com.example.gestion_formation.entities.Role;
import com.example.gestion_formation.entities.Utilisateur;
import com.example.gestion_formation.entities.UtilisateurRole;
import com.example.gestion_formation.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur user = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + username));

        String[] rolesArray = user.getRoles().stream()
                .map(UtilisateurRole::getRole)    
                .map(Role::getNom)                   
                .map(nom -> nom.replace("ROLE_", ""))
                .toArray(String[]::new);

        return User.withUsername(user.getUsername())
                .password(user.getPassword())
                .disabled(!user.isEnabled())
                .roles(rolesArray)
                .build();
    }
}