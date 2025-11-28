package edu.ifsc.reevo.model.events;

import edu.ifsc.reevo.model.Organization;
import edu.ifsc.reevo.model.User;
import edu.ifsc.reevo.model.helper.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certificate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long certificateId;

    @Column(nullable = false)
    private int hours;
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCertified;


    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
}