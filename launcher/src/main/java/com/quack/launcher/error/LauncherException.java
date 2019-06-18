package com.quack.launcher.error;

public class LauncherException extends Exception {
    public LauncherException() {
        super();
    }

    public LauncherException(String message) {
        super(message);
    }

    public LauncherException(String message, Throwable cause) {
        super(message, cause);
    }
}
