package edu.ifsc.reevo.dto;

import edu.ifsc.reevo.model.helper.Address;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String mission;
    private String logoUrl;
    private String bannerUrl;
    private String website;
    private String email;
    private String phone;
    private Address address;
    private OrganizationStats stats;
    private List<EventSummary> upcomingEvents;
    private List<EventSummary> historicalEvents;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrganizationStats {

        private int totalEvents;
        private int totalVolunteers;
        private int activeEvents;
        private int hoursGenerated;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EventSummary {

        private Long id;
        private String title;
        private String date;
        private String location;
        private String description;
        private Double rating;
        private int hours;
        private int volunteers;
        private int maxVolunteers;
        private String status;
    }
}
