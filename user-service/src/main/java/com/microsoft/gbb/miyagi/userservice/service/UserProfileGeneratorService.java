package com.microsoft.gbb.miyagi.userservice.service;

import com.microsoft.gbb.miyagi.userservice.entity.Aspirations;
import com.microsoft.gbb.miyagi.userservice.entity.FinancialProfile;
import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Generates fake user profiles
 */
@Slf4j
@Service
@Qualifier("userprofilegenerator")
public class UserProfileGeneratorService {
    private final Faker faker;

    public UserProfileGeneratorService() {
        faker = new Faker();
    }

    /**
     * Generates a fake user profile
     * @return a fake user profile
     */
    public UserProfile generateFakeUserProfile() {
        UserProfile userProfile = new UserProfile();
        userProfile.setFirstName(faker.name().firstName());
        userProfile.setLastName(faker.name().lastName());
        userProfile.setCity(faker.address().city());
        userProfile.setAge(faker.number().numberBetween(18, 65));

        userProfile.setFinancialProfile(generateFakeFinancialProfile());
        userProfile.setAspirations(generateFakeAspirations());

        return userProfile;
    }

    /**
     * Generates a fake financial profile
     * @return a fake financial profile
     */
    private FinancialProfile generateFakeFinancialProfile() {
        FinancialProfile financialProfile = new FinancialProfile();
        financialProfile.setAnnualSalary(faker.number().randomDouble(2, 30_000, 200_000));
        financialProfile.setCurrentAssets(faker.number().randomDouble(2, 10_000, 1_000_000));
        financialProfile.setLiabilities(faker.number().randomDouble(2, 1_000, 500_000));
        financialProfile.setRiskTolerance(faker.options().option("Low", "Medium", "High"));

        return financialProfile;
    }

    /**
     * Generates a fake aspirations profile
     * @return a fake aspirations profile
     */
    private Aspirations generateFakeAspirations() {
        Aspirations aspirations = new Aspirations();
        aspirations.setVacationBucketList(generateRandomCountryList(faker.number().numberBetween(1, 5)));
        aspirations.setHobbies(generateRandomHobbyList(faker.number().numberBetween(1, 5)));
        aspirations.setAnticipatedRetirementAge(faker.number().numberBetween(55, 70));

        return aspirations;
    }

    /**
     * Generates a list of random hobbies
     * @param count the number of strings to generate
     * @return a list of random strings
     */
    private List<String> generateRandomHobbyList(int count) {
        List<String> randomStrings = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            randomStrings.add(faker.hobby().activity());
        }
        return randomStrings;
    }

    /**
     * Generates a list of random countries
     * @param count the number of strings to generate
     * @return a list of random strings
     */
    private List<String> generateRandomCountryList(int count) {
        List<String> randomStrings = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            randomStrings.add(faker.address().country());
        }
        return randomStrings;
    }
}
