package com.microsoft.gbb.miyagi.userservice.service;

import com.microsoft.gbb.miyagi.userservice.entity.Aspirations;
import com.microsoft.gbb.miyagi.userservice.entity.FinancialProfile;
import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;

import java.util.List;

public interface ISyntheticGeneratorService {
    UserProfile generateFakeUserProfile();
    FinancialProfile generateFakeFinancialProfile();
    Aspirations generateFakeAspirations();
    List<String> generateRandomHobbyList(int count);
    List<String> generateRandomCountryList(int count);
}
