package edu.ifsc.reevo.model;

import edu.ifsc.reevo.model.helper.Address;
import edu.ifsc.reevo.model.helper.BaseEntity;
import edu.ifsc.reevo.model.helper.Profession;
import edu.ifsc.reevo.model.helper.ProfileMetadata;
import edu.ifsc.reevo.model.helper.Tag;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @Column(length = 500)
    private String profileUrl;
    @Column(length = 200)
    private String headline;
    @Column(length = 1000)
    private String bio;
    private String profileImageUrl;
    @Embedded
    private Profession profession;
    @Embedded
    private Address address;
    @Embedded
    private ProfileMetadata profileMetadata;


    @ElementCollection
    @CollectionTable(name = "profile_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill", length = 100)
    private List<String> skills;

    @ElementCollection
    @CollectionTable(name = "profile_links", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "link", length = 500)
    private List<String> links;

    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "profile_tags",
        joinColumns = @JoinColumn(name = "profile_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    
}