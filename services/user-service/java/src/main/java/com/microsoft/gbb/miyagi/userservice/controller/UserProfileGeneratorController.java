package com.microsoft.gbb.miyagi.userservice.controller;

import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import com.microsoft.gbb.miyagi.userservice.service.FakerGeneratorService;
import com.microsoft.gbb.miyagi.userservice.service.OpenAIGeneratorService;
import org.springframework.beans.factory.annotation.Qualifier;
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
    private final OpenAIGeneratorService openAIGeneratorService;
    private final FakerGeneratorService fakerGeneratorService;

    public UserProfileGeneratorController(@Qualifier("openaigenerator") OpenAIGeneratorService openAIGeneratorService,
                                          @Qualifier("fakergenerator") FakerGeneratorService fakerGeneratorService) {

        this.openAIGeneratorService = openAIGeneratorService;
        this.fakerGeneratorService = fakerGeneratorService;
    }

    /**
     * Generates a new user profile using OpenAI.
     *
     * @return The generated user profile.
     */
    @GetMapping(value = "/generate",
            produces = "application/json")
    public ResponseEntity<UserProfile> generateUserProfile() {
        return ResponseEntity.ok(openAIGeneratorService.generateFakeUserProfile());
    }

    /**
     * Generates a new user profile using faker.
     *
     * @return The generated user profile.
     */
    @GetMapping(value = "/generate/faker",
            produces = "application/json")
    public ResponseEntity<UserProfile> generateUserProfileWithFaker() {
        return ResponseEntity.ok(fakerGeneratorService.generateFakeUserProfile());
    }
}
