package com.testquack.services.errors;

public class OrganizationNotSetException extends RuntimeException {
    public OrganizationNotSetException() {
        super();
    }

    public OrganizationNotSetException(String message) {
        super(message);
    }

    public OrganizationNotSetException(String message, Throwable cause) {
        super(message, cause);
    }
}
