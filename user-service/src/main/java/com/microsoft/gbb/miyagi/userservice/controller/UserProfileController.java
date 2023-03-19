package com.microsoft.gbb.miyagi.userservice.controller;

import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import com.microsoft.gbb.miyagi.userservice.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing user profiles.
 */
@RestController
@RequestMapping("/api/v1/userprofile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    /**
     * Creates a new user profile.
     *
     * @param user The user profile to create.
     * @return The created user profile.
     */
    @PostMapping(value = "/",
            consumes = "application/json",
            produces = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    @CrossOrigin(origins = "*")
    public ResponseEntity<UserProfile> createNewCustomer(@RequestBody @Valid UserProfile user) {
        return ResponseEntity.ok(userProfileService.createUserProfile(user));
    }

    /**
     * Retrieves a user profile by its ID.
     *
     * @param id The ID of the user profile.
     * @return The user profile if found, or null if not found.
     */
    @GetMapping("/{id}")
    public UserProfile getUserProfileById(@PathVariable long id) {
        return userProfileService.getUserProfileById(id);
    }

    /**
     * Updates an existing user profile.
     *
     * @param userProfile The updated user profile.
     * @return The updated user profile if successful, or null if the profile is not found.
     */
    @PutMapping
    public UserProfile updateUserProfile(@RequestBody UserProfile userProfile) {
        return userProfileService.updateUserProfile(userProfile);
    }

    /**
     * Deletes a user profile by its ID.
     *
     * @param id The ID of the user profile.
     * @return true if the user profile was successfully deleted, false otherwise.
     */
    @DeleteMapping("/{id}")
    public boolean deleteUserProfile(@PathVariable long id) {
        return userProfileService.deleteUserProfile(id);
    }

    /**
     * Lists all user profiles.
     *
     * @return A list of all user profiles.
     */
    @GetMapping
    public List<UserProfile> listUserProfiles() {
        return userProfileService.listUserProfiles();
    }
}
