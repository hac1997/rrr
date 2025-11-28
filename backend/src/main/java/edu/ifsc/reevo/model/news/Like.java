package edu.ifsc.reevo.model.news;

import edu.ifsc.reevo.model.User;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "event_id"}))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Like extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}
