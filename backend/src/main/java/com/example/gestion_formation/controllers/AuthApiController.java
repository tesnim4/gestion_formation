package com.example.gestion_formation.controllers;

import com.example.gestion_formation.dto.LoginRequest;
import com.example.gestion_formation.dto.UserInfoDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final AuthenticationManager authenticationManager;

    public AuthApiController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        new HttpSessionSecurityContextRepository()
            .saveContext(SecurityContextHolder.getContext(), request, response);

        UserInfoDTO info = new UserInfoDTO();
        info.setUsername(auth.getName());
        info.setRoles(auth.getAuthorities().stream()
            .map(a -> a.getAuthority())
            .collect(Collectors.toSet()));
        return ResponseEntity.ok(info);
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        UserInfoDTO info = new UserInfoDTO();
        info.setUsername(auth.getName());
        info.setRoles(auth.getAuthorities().stream()
            .map(a -> a.getAuthority())
            .collect(Collectors.toSet()));
        return ResponseEntity.ok(info);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }
}