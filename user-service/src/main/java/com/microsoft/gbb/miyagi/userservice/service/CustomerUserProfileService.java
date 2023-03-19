package com.microsoft.gbb.miyagi.userservice.service;

import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import com.microsoft.gbb.miyagi.userservice.messaging.TopicProducer;
import com.microsoft.gbb.miyagi.userservice.repository.UserProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of the user profile service
 */
@Slf4j
@Service
@Transactional
@Qualifier("customeruserprofile")
public class CustomerUserProfileService implements UserProfileService {
    private final TopicProducer topicProducer;
    private final UserProfileRepository userProfileRepository;

    public CustomerUserProfileService(TopicProducer topicProducer,
                                      UserProfileRepository userProfileRepository) {
        this.topicProducer = topicProducer;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public UserProfile createUserProfile(UserProfile userProfile) {
        // TODO: Implement validation logic for creating a new user profile
        userProfileRepository.save(userProfile);
        topicProducer.send(userProfile);
        return userProfile;
    }

    @Override
    public UserProfile getUserProfileById(long id) {
        return userProfileRepository.getReferenceById(id);
    }

    @Override
    public UserProfile updateUserProfile(UserProfile userProfile) {
        // TODO: Implement validation logic for updating a user profile
        userProfileRepository.save(userProfile);
        return userProfile;
    }

    @Override
    public boolean deleteUserProfile(long id) {
        // TODO: Implement logic for deleting a user profile
        userProfileRepository.deleteById(id);
        return true;
    }

    @Override
    public List<UserProfile> listUserProfiles() {
        return userProfileRepository.findAll();
    }

}
