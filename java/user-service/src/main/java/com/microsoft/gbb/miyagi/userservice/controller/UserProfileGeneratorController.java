package com.microsoft.gbb.miyagi.userservice.controller;

import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import com.microsoft.gbb.miyagi.userservice.service.UserProfileGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * REST controller for generating user profiles.
 */
@RestController
@RequestMapping("/api/v1/userprofile")
public class UserProfileGeneratorController {
    private final UserProfileGeneratorService userProfileGeneratorService;

    public UserProfileGeneratorController(UserProfileGeneratorService userProfileGeneratorService) {
        this.userProfileGeneratorService = userProfileGeneratorService;
    }

    /**
     * Generates a new user profile.
     *
     * @return The generated user profile.
     */
    @GetMapping(value = "/generate",
            produces = "application/json")
    public ResponseEntity<UserProfile> generateUserProfile() {
        return ResponseEntity.ok(userProfileGeneratorService.generateFakeUserProfile());
    }
}
