package com.microsoft.gbb.miyagi.userservice.service;


import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;

import java.util.List;

/**
 * Interface to define CRUD operations for managing user profiles.
 */
public interface UserProfileService {
    /**
     * Creates a new user profile.
     *
     * @param userProfile The user profile object containing the user's information.
     * @return The created user profile with its assigned ID.
     */
    UserProfile createUserProfile(UserProfile userProfile);

    /**
     * Retrieves a user profile by its ID.
     *
     * @param id The unique identifier of the user profile.
     * @return The user profile if found, or null if not found.
     */
    UserProfile getUserProfileById(long id);

    /**
     * Updates an existing user profile.
     *
     * @param userProfile The user profile object containing the updated user information.
     * @return The updated user profile if successful, or null if the profile is not found.
     */
    UserProfile updateUserProfile(UserProfile userProfile);

    /**
     * Deletes a user profile by its ID.
     *
     * @param id The unique identifier of the user profile.
     * @return true if the user profile was successfully deleted, false otherwise.
     */
    boolean deleteUserProfile(long id);

    /**
     * Lists all user profiles.
     *
     * @return A list of all user profiles.
     */
    List<UserProfile> listUserProfiles();
}

