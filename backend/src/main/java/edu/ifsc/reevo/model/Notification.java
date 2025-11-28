package edu.ifsc.reevo.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @Column(length = 500)
    private String message;
    @Column(nullable = false, length = 50)
    private String type;
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime sentAt;
    @Builder.Default
    @Column(nullable = false)
    private boolean read = false;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}