package edu.ifsc.reevo.service;

import edu.ifsc.reevo.dto.DtoRequest;
import edu.ifsc.reevo.dto.DtoRequest.OrganizationRequestDTO;
import edu.ifsc.reevo.model.Organization;
import edu.ifsc.reevo.repository.OrganizationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import edu.ifsc.reevo.dto.OrganizationResponseDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserService userService;
    private final GeneralMapper generalMapper;

    public Organization addOrganization(OrganizationRequestDTO requestDTO) {
        log.info("ADDING ORGANIZATION BY REQUEST :: {}", requestDTO);
        var org = generalMapper.toOrganization(requestDTO);
        return organizationRepository.save(org);
    }

    @Transactional
    public Organization updateOrganization(DtoRequest.OrganizationRequestDTO requestDTO) {
        log.info("UPDATING ORGANIZATION WITH CNPJ :: {}", requestDTO.CNPJ());
        var organization = this.findByCNPJ(requestDTO.CNPJ());

        organization.setCNPJ(requestDTO.CNPJ());
        organization.setPasswordHash(requestDTO.passwordHash());
        organization.setName(requestDTO.name());
        organization.setDescription(requestDTO.description());
        organization.setEmail(requestDTO.email());
        organization.setPhone(requestDTO.phone());
        organization.setWebsite(requestDTO.website());
        organization.setLogoImageUrl(requestDTO.logoImageUrl());
        organization.setAddress(requestDTO.address());

        return organization;
    }

    @Transactional
    public Organization addOrRemoveMemberToOrganization(Long memberId, String CNPJ) {
        log.info("ADDING MEMBER WITH ID :: {} :: TO ORG CNPJ :: ", memberId, CNPJ);
        var org = this.findByCNPJ(CNPJ);
        var member = userService.findUserById(memberId);
        if (org.getMembers().contains(member)) {
            org.getMembers().remove(member);
        } else {
            org.getMembers().add(member);
        }

        return org;
    }

    public void deactivatingOrganization(Long orgId) {
        log.info("DEACTIVATING ORG BY ID :: {}", orgId);
        var org = this.findByOrganizationId(orgId);
        org.setActive(false);
        organizationRepository.save(org);
    }

    public List<Organization> getAllOrganizations() {
        log.info("GETTING ALL ORGANIZATIONS");
        return organizationRepository.findAll();
    }

    public Organization getOrganizationById(Long orgId) {
        log.info("GETTING ORGANIZATION BY ID :: {}", orgId);
        return this.findByOrganizationId(orgId);
    }

    public OrganizationResponseDTO getOrganizationResponseById(Long orgId) {
        Organization org = getOrganizationById(orgId);

        List<OrganizationResponseDTO.EventSummary> historicalEvents = org.getEvents().stream()
                .filter(e -> e.isCompleted() || e.getEndDate().isBefore(LocalDateTime.now()))
                .map(e -> OrganizationResponseDTO.EventSummary.builder()
                .id(e.getEventId())
                .title(e.getTitle())
                .date(e.getStartDate().toString())
                .location(e.getAddress() != null ? e.getAddress().getCity() + ", " + e.getAddress().getState() : "Online")
                .description(e.getDescription())
                .rating(5.0) // Placeholder rating
                .hours(e.getPointsReward())
                .volunteers(e.getFilledSlots())
                .maxVolunteers(e.getVolunteerSlots())
                .build())
                .collect(Collectors.toList());

        List<OrganizationResponseDTO.EventSummary> upcomingEvents = org.getEvents().stream()
                .filter(e -> !e.isCompleted() && e.getEndDate().isAfter(LocalDateTime.now()))
                .map(e -> OrganizationResponseDTO.EventSummary.builder()
                .id(e.getEventId())
                .title(e.getTitle())
                .date(e.getStartDate().toString())
                .location(e.getAddress() != null ? e.getAddress().getCity() + ", " + e.getAddress().getState() : "Online")
                .description(e.getDescription())
                .rating(null)
                .hours(e.getPointsReward())
                .volunteers(e.getFilledSlots())
                .maxVolunteers(e.getVolunteerSlots())
                .build())
                .collect(Collectors.toList());

        OrganizationResponseDTO.OrganizationStats stats = OrganizationResponseDTO.OrganizationStats.builder()
                .totalEvents(org.getEvents().size())
                .totalVolunteers(org.getEvents().stream().mapToInt(e -> e.getFilledSlots()).sum())
                .activeEvents((int) org.getEvents().stream().filter(e -> !e.isCompleted() && e.getEndDate().isAfter(LocalDateTime.now())).count())
                .hoursGenerated(org.getEvents().stream().mapToInt(e -> e.getPointsReward() * e.getFilledSlots()).sum())
                .build();

        return OrganizationResponseDTO.builder()
                .id(org.getOrganizationId())
                .name(org.getName())
                .description(org.getDescription())
                .mission(org.getDescription()) // Assuming mission is same as description for now
                .logoUrl(org.getLogoImageUrl())
                .stats(stats)
                .upcomingEvents(upcomingEvents)
                .historicalEvents(historicalEvents)
                .build();
    }

    public List<Organization> getActiveOrganizations() {
        log.info("GETTING ACTIVE ORGANIZATIONS");
        return organizationRepository.findByActiveTrue();
    }

    protected Organization findByOrganizationId(Long orgId) {
        log.info("FINDING ORG BY ID :: {}", orgId);
        return organizationRepository.findById(orgId)
                .orElseThrow(() -> new EntityNotFoundException("ORG NOT FOUND WITH ID :: " + orgId));
    }

    public Organization findByCNPJ(String CNPJ) {
        log.info("FINDING ORG BY CNPJ :: {}", CNPJ);
        return organizationRepository.findOrganizationByCNPJ(CNPJ)
                .orElseThrow(() -> new EntityNotFoundException("ORG NOT FOUND WITH CNPJ :: " + CNPJ));
    }
}
