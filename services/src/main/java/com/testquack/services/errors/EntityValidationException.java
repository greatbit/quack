package com.testquack.services.errors;

public class EntityValidationException extends RuntimeException{
    public EntityValidationException() {
    }

    public EntityValidationException(String message) {
        super(message);
    }

    public EntityValidationException(String message, Throwable cause) {
        super(message, cause);
    }

    public EntityValidationException(Throwable cause) {
        super(cause);
    }

    public EntityValidationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}