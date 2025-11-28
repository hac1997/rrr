package edu.ifsc.reevo.model;

import edu.ifsc.reevo.model.enums.UserType;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @CPF @Column(nullable = false, length = 11)
    private String CPF;
    @Column(nullable = false, length = 100)
    private String firstname;
    @Column(nullable = false, length = 100)
    private String lastname;
    @Column(nullable = false, unique = true, length = 150)
    private String email;
    @Column(length = 20)
    private String phone;
    @Column(nullable = false, length = 255)
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserType userType;
    @Column(nullable = false)
    private LocalDate birthDate;

    @Builder.Default
    @Column(nullable = false)
    private boolean emailVerified = false;
    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;


    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Profile profile;

    @ManyToMany(mappedBy = "members")
    private List<Organization> organizations;
    
    @ManyToMany(mappedBy = "volunteers")
    private List<Event> events;

    @OneToMany(mappedBy = "reportedBy")
    private List<Report> reportsMade;

    @OneToMany(mappedBy = "reportedUser")
    private List<Report> reportsReceived;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Notification> notifications;

}