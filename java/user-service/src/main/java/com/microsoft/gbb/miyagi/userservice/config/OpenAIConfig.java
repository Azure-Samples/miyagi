package com.microsoft.gbb.miyagi.userservice.config;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAIConfig {

    @Value("${openai.key}")
    private String openAIKey;

    @Value("${openai.endpoint}")
    private String openAIEndpoint;

    @Value("${openai.model.id}")
    private String openAIModelId;

    @Bean
    public OpenAIClient openAIClient() {
        return new OpenAIClientBuilder()
                .endpoint(openAIEndpoint)
                .credential(new AzureKeyCredential(openAIKey))
                .buildClient();
    }

    public String getOpenAIModelId() {
        return openAIModelId;
    }
}
