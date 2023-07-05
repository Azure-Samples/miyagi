package com.microsoft.gbb.miyagi.userservice.controller;

import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import com.microsoft.gbb.miyagi.userservice.service.FakerGeneratorService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserProfileGeneratorControllerTest {
    @Mock
    private FakerGeneratorService fakerGeneratorService;

    @InjectMocks
    private UserProfileGeneratorController userProfileGeneratorController;

    @Test
    @DisplayName("should return a generated user profile with status code 200")
    void generateUserProfileReturnsGeneratedProfileWithStatusCode200() {
        UserProfile userProfile = new UserProfile();
        when(fakerGeneratorService.generateFakeUserProfile()).thenReturn(userProfile);

        ResponseEntity<UserProfile> responseEntity =
                userProfileGeneratorController.generateUserProfile();

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(userProfile, responseEntity.getBody());
        verify(fakerGeneratorService, times(1)).generateFakeUserProfile();
    }
}