package com.microsoft.gbb.miyagi.userservice.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SemanticKernelFacadeTest {
    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.Builder webClientBuilder;

    @InjectMocks
    private SemanticKernelFacade semanticKernelFacade;

    @Test
    @DisplayName("Should return pong when the ping method is called")
    void pingReturnsPong() {
        String expectedResponse = "pong";
        WebClient.RequestHeadersUriSpec requestHeadersUriSpec =
                mock(WebClient.RequestHeadersUriSpec.class);
        WebClient.RequestHeadersSpec requestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);

        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);

        // Add this line to make sure that baseUrl(String) returns the webClientBuilder instance
        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);

        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(expectedResponse));

        Mono<String> result = semanticKernelFacade.ping();

        assertEquals(expectedResponse, result.block());
        verify(webClient).method(HttpMethod.GET);
        verify(requestHeadersUriSpec).uri(anyString());
        verify(requestHeadersSpec).retrieve();
        verify(responseSpec).bodyToMono(String.class);
    }
}
