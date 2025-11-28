package edu.ifsc.reevo.model;

import edu.ifsc.reevo.model.enums.ReportStatus;
import edu.ifsc.reevo.model.enums.ReportType;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reports")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReportType type;
    @Column(nullable = false, length = 500)
    private String description;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ReportStatus status = ReportStatus.PENDING;
    @Column(length = 500)
    private String adminNotes;


    @ManyToOne
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;

    @ManyToOne
    @JoinColumn(name = "reported_user")
    private User reportedUser;

    @ManyToOne
    @JoinColumn(name = "reported_event")
    private Event reportedEvent;

    @ManyToOne
    @JoinColumn(name = "reported_organization")
    private Organization reportedOrganization;
}