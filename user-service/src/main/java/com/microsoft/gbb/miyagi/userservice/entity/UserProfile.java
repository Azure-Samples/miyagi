package com.microsoft.gbb.miyagi.userservice.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import jakarta.persistence.*;

/**
 * Represents a user profile with basic information, financial profile, and aspirations.
 */
@Getter
@Setter
@ToString
@Entity
@Table(name = "user")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id", nullable = false)
    private long userId;
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "city")
    private String city;

    @Column(name = "age")
    private int age;
    @OneToOne
    @JoinColumn(name = "financial_profile_id")
    private FinancialProfile financialProfile;
    @OneToOne
    @JoinColumn(name = "aspirations_financial_profile_id")
    private Aspirations aspirations;

}
