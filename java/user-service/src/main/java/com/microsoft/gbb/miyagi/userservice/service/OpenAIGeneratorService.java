package com.microsoft.gbb.miyagi.userservice.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.Choice;
import com.azure.ai.openai.models.Completions;
import com.azure.ai.openai.models.CompletionsOptions;
import com.microsoft.gbb.miyagi.userservice.config.OpenAIConfig;
import com.microsoft.gbb.miyagi.userservice.entity.Aspirations;
import com.microsoft.gbb.miyagi.userservice.entity.FinancialProfile;
import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Generates fake user profiles
 */
@Slf4j
@Service
@Qualifier("openaigenerator")
public class OpenAIGeneratorService implements ISyntheticGeneratorService {
    private final OpenAIClient openAIClient;
    private final OpenAIConfig openAIConfig;

    public OpenAIGeneratorService(OpenAIClient openAIClient,
                                  OpenAIConfig openAIConfig) {
        this.openAIClient = openAIClient;
        this.openAIConfig = openAIConfig;
    }

    @Override
    public UserProfile generateFakeUserProfile() {
        UserProfile userProfile = new UserProfile();
        userProfile.setFirstName(getCompletion("Generate a first name"));
        userProfile.setLastName(getCompletion("Generate a last name"));
        userProfile.setCity(getCompletion("Generate a city name"));
        userProfile.setAge(Integer.parseInt(getCompletion("Generate a number between 18 and 65")));

        userProfile.setFinancialProfile(generateFakeFinancialProfile());
        userProfile.setAspirations(generateFakeAspirations());

        return userProfile;
    }

    @Override
    public FinancialProfile generateFakeFinancialProfile() {
        FinancialProfile financialProfile = new FinancialProfile();
        financialProfile.setAnnualSalary(Double.parseDouble(getCompletion("Generate a number between 30000 and 200000")));
        financialProfile.setCurrentAssets(Double.parseDouble(getCompletion("Generate a number between 10000 and 1000000")));
        financialProfile.setLiabilities(Double.parseDouble(getCompletion("Generate a number between 1000 and 500000")));
        financialProfile.setRiskTolerance(getCompletion("Pick one: Low, Medium, High"));

        return financialProfile;
    }

    @Override
    public Aspirations generateFakeAspirations() {
        Aspirations aspirations = new Aspirations();
        aspirations.setVacationBucketList(generateRandomCountryList(5));
        aspirations.setHobbies(generateRandomHobbyList(5));
        aspirations.setAnticipatedRetirementAge(Integer.parseInt(getCompletion("Generate a number between 55 and 70")));

        return aspirations;
    }

    @Override
    public List<String> generateRandomHobbyList(int count) {
        List<String> hobbies = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            hobbies.add(getCompletion("Generate a hobby"));
        }
        return hobbies;
    }

    @Override
    public List<String> generateRandomCountryList(int count) {
        List<String> countries = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            countries.add(getCompletion("Generate a country"));
        }
        return countries;
    }

    private String getCompletion(String prompt) {
        List<String> promptList = new ArrayList<>();
        promptList.add(prompt);

        Completions completions = openAIClient.getCompletions(openAIConfig.getOpenAIModelId(),
                                                              new CompletionsOptions(promptList));

        Choice choice = completions.getChoices().get(0);

        return choice.getText().trim();
    }
}
