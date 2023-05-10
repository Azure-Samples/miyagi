package com.microsoft.gbb.miyagi.userservice.controller;

import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import com.microsoft.gbb.miyagi.userservice.service.UserProfileService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileControllerTest {

    @Mock
    private UserProfileService userProfileService;

    @InjectMocks
    private UserProfileController userProfileController;

    @Test
    @DisplayName("should throw an exception when the id is not found")
    void getUserProfileByIdWhenIdNotFoundThenThrowException() {
        when(userProfileService.getUserProfileById(anyLong()))
                .thenThrow(new RuntimeException("User profile not found"));
        assertThrows(
                RuntimeException.class,
                () -> userProfileController.getUserProfileById(1L));
    }

    @Test
    @DisplayName("should return the user profile when the id is valid")
    void getUserProfileByIdWhenIdIsValid() {
        UserProfile userProfile = new UserProfile();
        userProfile.setUserId(1L);
        when(userProfileService.getUserProfileById(anyLong())).thenReturn(userProfile);

        UserProfile actualUserProfile = userProfileController.getUserProfileById(1L);

        assertEquals(userProfile, actualUserProfile);
    }
}