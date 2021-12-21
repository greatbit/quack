package com.testquack.api.errors;

public class LicenseCapacityReachedException extends RuntimeException{
    public LicenseCapacityReachedException() {
        super();
    }

    public LicenseCapacityReachedException(String message) {
        super(message);
    }

    public LicenseCapacityReachedException(String message, Throwable cause) {
        super(message, cause);
    }

    public LicenseCapacityReachedException(Throwable cause) {
        super(cause);
    }
}
