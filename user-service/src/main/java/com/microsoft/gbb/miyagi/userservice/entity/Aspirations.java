package com.microsoft.gbb.miyagi.userservice.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

/**
 * Represents a user profile with basic information, financial profile, and aspirations.
 */
@Getter
@Setter
@ToString
@Entity
@Table(name = "aspirations")
public class Aspirations {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "financial_profile_id", nullable = false)
    private long aspirationsId;
    @ElementCollection
    private List<String> vacationBucketList;
    @ElementCollection
    private List<String> perks;
    private int anticipatedRetirementAge;

}
