package edu.ifsc.reevo.model.news;

import java.time.LocalDateTime;
import java.util.List;

import edu.ifsc.reevo.model.enums.NewsType;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.BaseEntity;
import edu.ifsc.reevo.model.helper.Tag;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "news")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class News extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long newsId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime publishDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NewsType type;

    @ManyToMany
    @JoinTable(
            name = "news_tags",
            joinColumns = @JoinColumn(name = "news_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> eventTags;

    @OneToMany(mappedBy = "news", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
}
