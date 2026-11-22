package com.example.gestion_formation.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserInfoDTO {
    private String username;
    private Set<String> roles;
}