package com.microsoft.gbb.miyagi.userservice.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class SemanticKernelFacade {
    @Value("${endpoints.execute-plan}")
    private String executePlanEndpoint;

    @Value("${endpoints.invoke-function}")
    private String invokeFunctionEndpoint;

    @Value("${endpoints.sk-ping}")
    private String pingEndpoint;

    private final WebClient webClient;

    public SemanticKernelFacade(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:7071").build();
    }

    public Mono<String> executePlan(Integer maxSteps) {
        return webClient.method(HttpMethod.POST)
                .uri(uriBuilder -> uriBuilder.path(executePlanEndpoint).build(maxSteps))
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> invokeFunction(String skillName, String functionName) {
        return webClient.method(HttpMethod.POST)
                .uri(uriBuilder -> uriBuilder.path(invokeFunctionEndpoint).build(skillName, functionName))
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> ping() {
        return webClient.method(HttpMethod.GET)
                .uri(pingEndpoint)
                .retrieve()
                .bodyToMono(String.class);
    }
}
