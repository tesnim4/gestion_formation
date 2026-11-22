package com.example.gestion_formation.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}