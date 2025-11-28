package edu.ifsc.reevo.model.helper;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class ProfileMetadata {

    @Column(nullable = true)
    private boolean publicProfile = true;
    @Column(nullable = false)
    private Integer points = 0;
    @Column(nullable = false)
    private Integer level = 1;
    @Column(nullable = false)
    private Integer completedEvents = 0;
    @Column(nullable = false)
    private Integer totalVolunteerHours = 0;
    @Column(nullable = false)
    private Integer streakDays = 0;
}
