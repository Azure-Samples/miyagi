package com.microsoft.gbb.miyagi.userservice.util;

import org.springframework.web.reactive.function.client.WebClient;

public class TestableSemanticKernelFacade extends SemanticKernelFacade {

    public TestableSemanticKernelFacade(WebClient.Builder webClientBuilder) {
        super(webClientBuilder);
    }
}
