package com.testquack.services.errors;

public class EntityAccessDeniedException extends RuntimeException {
    public EntityAccessDeniedException() {
    }

    public EntityAccessDeniedException(String message) {
        super(message);
    }

    public EntityAccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }

    public EntityAccessDeniedException(Throwable cause) {
        super(cause);
    }

    public EntityAccessDeniedException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}