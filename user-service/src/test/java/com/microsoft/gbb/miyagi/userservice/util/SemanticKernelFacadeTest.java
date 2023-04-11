package com.microsoft.gbb.miyagi.userservice.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.net.URI;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SemanticKernelFacadeTest {

    @InjectMocks
    private TestableSemanticKernelFacade semanticKernelFacade;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @BeforeEach
    public void setUp() {
        when(webClientBuilder.baseUrl(any(String.class))).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);
        when(requestHeadersUriSpec.uri((URI) any())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
    }

    @Test
    public void testExecutePlan() {
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just("executePlan response"));
        Mono<String> result = semanticKernelFacade.executePlan(5);

        StepVerifier.create(result)
                .expectNext("executePlan response")
                .verifyComplete();
    }

    @Test
    public void testInvokeFunction() {
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just("invokeFunction response"));
        Mono<String> result = semanticKernelFacade.invokeFunction("skillName", "functionName");

        StepVerifier.create(result)
                .expectNext("invokeFunction response")
                .verifyComplete();
    }

    @Test
    public void testPing() {
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just("ping response"));
        Mono<String> result = semanticKernelFacade.ping();

        StepVerifier.create(result)
                .expectNext("ping response")
                .verifyComplete();
    }
}
