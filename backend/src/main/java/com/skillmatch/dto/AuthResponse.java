package com.skillmatch.dto;

import com.skillmatch.model.User;

public class AuthResponse {
    private boolean authenticated;
    private String token; // Token or session identifier
    private String message;
    private User user;

    public AuthResponse() {
    }

    public AuthResponse(boolean authenticated, String token, String message, User user) {
        this.authenticated = authenticated;
        this.token = token;
        this.message = message;
        this.user = user;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
