package edu.ifsc.reevo.util;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ ElementType.FIELD, ElementType.METHOD, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Invalid password. Must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 6 characters long.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
