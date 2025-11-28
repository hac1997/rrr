package edu.ifsc.reevo.model.events;

import edu.ifsc.reevo.model.Organization;
import edu.ifsc.reevo.model.User;
import edu.ifsc.reevo.model.helper.Address;
import edu.ifsc.reevo.model.helper.BaseEntity;
import edu.ifsc.reevo.model.helper.Tag;
import edu.ifsc.reevo.model.news.News;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    private String coverImageUrl;

    @Embedded
    private Address address;

    @Column(nullable = false)
    private int volunteerSlots;

    @Builder.Default
    @Column(nullable = false)
    private int filledSlots = 0;

    @Column(nullable = false)
    private int pointsReward;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean completed = false;

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToMany
    @JoinTable(
            name = "event_volunteers",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> volunteers;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<News> news;

    @ManyToMany
    @JoinTable(
            name = "event_tags",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Benefit> benefits;
}
