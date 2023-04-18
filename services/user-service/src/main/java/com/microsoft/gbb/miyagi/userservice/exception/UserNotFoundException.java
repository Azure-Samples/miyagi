package com.microsoft.gbb.miyagi.userservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * User not found exception.
 */
public class UserNotFoundException extends ResponseStatusException {
    /**
     * Instantiates a new User not found exception.
     *
     * @param message the message
     */
    public UserNotFoundException(String message){
        super(HttpStatus.BAD_REQUEST, message);
    }
}
