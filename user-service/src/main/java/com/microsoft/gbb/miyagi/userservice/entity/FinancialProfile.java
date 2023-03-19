package com.microsoft.gbb.miyagi.userservice.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

/**
 * Represents a user profile with basic information, financial profile, and aspirations.
 */
@Getter
@Setter
@ToString
@Entity
@Table(name = "financial_profile")
public class FinancialProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "financial_profile_id", nullable = false)
    private long financialProfileId;
    private double annualSalary;
    private double currentAssets;
    private double liabilities;
    private String riskTolerance;

}
