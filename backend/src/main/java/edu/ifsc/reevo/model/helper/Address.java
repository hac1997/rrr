package edu.ifsc.reevo.model.helper;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Column(length = 150)
    private String street;
    @Column(length = 100)
    @NotNull
    private String city;
    @Column(length = 2)
    @NotNull
    private String state;
    @Column(length = 10)
    @NotNull
    private String zipCode;
}
