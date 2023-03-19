package com.microsoft.gbb.miyagi.userservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;

// TODO: Add TestContainer to perform integration tests
@SpringBootTest
public class UserServiceApplicationTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    public void contextLoads() {
        assertNotNull(applicationContext, "Application context should not be null");
    }
}