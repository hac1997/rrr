package edu.ifsc.reevo.model;

import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.Address;
import edu.ifsc.reevo.model.helper.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.br.CNPJ;

import java.util.List;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long organizationId;

    @CNPJ @Column(nullable = false, length = 14)
    private String CNPJ;
    @Column(nullable = false, length = 255)
    private String passwordHash;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(length = 500)
    private String description;
    @Column(nullable = false, length = 150)
    private String email;
    @Column(length = 20)
    private String phone;
    @Column(length = 200)
    private String website;
    private String logoImageUrl;
    @Embedded
    private Address address;

    @Builder.Default
    @Column(nullable = false)
    private boolean verified = false;
    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;


    @ManyToMany
    @JoinTable(
        name = "user_organizations",
        joinColumns = @JoinColumn(name = "organization_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private List<Event> events;
}