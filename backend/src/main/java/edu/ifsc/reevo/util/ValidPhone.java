package edu.ifsc.reevo.util;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Target({ ElementType.FIELD, ElementType.METHOD, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhone {
    String message() default "Invalid phone. Must folow +55 (XX) XXXXX-XXXX";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
