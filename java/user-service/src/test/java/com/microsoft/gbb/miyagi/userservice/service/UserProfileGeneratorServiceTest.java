package com.microsoft.gbb.miyagi.userservice.service;

import com.microsoft.gbb.miyagi.userservice.entity.Aspirations;
import com.microsoft.gbb.miyagi.userservice.entity.FinancialProfile;
import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class UserProfileGeneratorServiceTest {
    private UserProfileGeneratorService userProfileGeneratorService;

    @BeforeEach
    void setUp() {
        userProfileGeneratorService = new UserProfileGeneratorService();
    }

    @Test
    @DisplayName("should generate a fake user profile with valid data")
    void generateFakeUserProfileWithValidData() {
        UserProfile expectedUserProfile = new UserProfile();
        expectedUserProfile.setFirstName("John");
        expectedUserProfile.setLastName("Doe");
        expectedUserProfile.setCity("New York");
        expectedUserProfile.setAge(30);

        FinancialProfile financialProfile = new FinancialProfile();
        financialProfile.setAnnualSalary(100000);
        financialProfile.setCurrentAssets(500000);
        financialProfile.setLiabilities(100000);
        financialProfile.setRiskTolerance("Low");

        Aspirations aspirations = new Aspirations();
        aspirations.setVacationBucketList(List.of("Hawaii", "Paris", "London"));
        aspirations.setHobbies(List.of("Car", "House", "Vacation", "Health Insurance", "401k"));
        aspirations.setAnticipatedRetirementAge(65);

        expectedUserProfile.setFinancialProfile(financialProfile);
        expectedUserProfile.setAspirations(aspirations);

        UserProfile actualUserProfile = userProfileGeneratorService.generateFakeUserProfile();

        assertEquals(expectedUserProfile.getClass(), actualUserProfile.getClass());
    }
}