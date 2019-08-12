package com.testquack.launcher;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface ConfigItem {
    String title() default "";

    String[] defaultValues() default {};

    boolean restricted() default false;

    boolean multi() default false;

    boolean password() default false;
}
