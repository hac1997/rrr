package edu.ifsc.reevo.model.events;

import edu.ifsc.reevo.model.helper.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "benefits")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Benefit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long benefitId;

    @Column(nullable = false, length = 200)
    private String title;
    @Column(length = 1000)
    private String description;


    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}