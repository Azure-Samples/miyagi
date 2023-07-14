package com.microsoft.gbb.miyagi.userservice.messaging;

import com.microsoft.gbb.miyagi.userservice.entity.UserProfile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TopicProducer {

    @Value("${spring.kafka.topic.name}")
    private String topicName;

    private final KafkaTemplate<String, UserProfile> kafkaTemplate;

    public TopicProducer(KafkaTemplate<String, UserProfile> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(UserProfile userProfile){
        log.info("Payload: {}", userProfile);
        kafkaTemplate.send(topicName, userProfile);
    }

}
