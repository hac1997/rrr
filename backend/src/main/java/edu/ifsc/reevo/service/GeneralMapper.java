package edu.ifsc.reevo.service;

import edu.ifsc.reevo.dto.DtoRequest.CertificateRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.EventRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.NotificationRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.OrganizationRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.ReportRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.UserRequestDTO;
import edu.ifsc.reevo.model.*;
import edu.ifsc.reevo.model.enums.UserType;
import edu.ifsc.reevo.model.events.Certificate;
import edu.ifsc.reevo.model.events.Event;

import org.springframework.stereotype.Service;


@Service
public class GeneralMapper {

    public User toUser(UserRequestDTO requestDTO, Profile profile) {
        return User.builder()
                .CPF(requestDTO.CPF())
                .firstname(requestDTO.firstname())
                .lastname(requestDTO.lastname())
                .email(requestDTO.email())
                .userType(UserType.VOLUNTEER)
                .birthDate(requestDTO.birthDate())
                .phone(requestDTO.phone())
                .passwordHash(requestDTO.passwordHash())
                .profile(profile)
                .build();
    }

    public Organization toOrganization(OrganizationRequestDTO requestDTO) {
        return Organization.builder()
                .CNPJ(requestDTO.CNPJ())
                .passwordHash(requestDTO.passwordHash())
                .address(requestDTO.address())
                .email(requestDTO.email())
                .description(requestDTO.description())
                .logoImageUrl(requestDTO.logoImageUrl())
                .name(requestDTO.name())
                .phone(requestDTO.phone())
                .website(requestDTO.website())
                .build();
    }

    public Event toEvent(EventRequestDTO requestDTO, Organization organization) {
        return Event.builder()
                .title(requestDTO.title())
                .description(requestDTO.description())
                .startDate(requestDTO.startDate())
                .endDate(requestDTO.endDate())
                .coverImageUrl(requestDTO.coverImageUrl())
                .address(requestDTO.address())
                .volunteerSlots(requestDTO.volunteerSlots())
                .filledSlots(requestDTO.filledSlots())
                .pointsReward(requestDTO.pointsReward())
                .organization(organization)
                .tags(requestDTO.tags())
                .build();
    }

    public Report toReport(ReportRequestDTO requestDTO) {
        return Report.builder()
                .type(requestDTO.type())
                .description(requestDTO.description())
                .build();
    }

    public Notification toNotification(NotificationRequestDTO requestDTO, User user) {
        return Notification.builder()
                .message(requestDTO.message())
                .type(requestDTO.type())
                .user(user)
                .build();
    }

    public Certificate toCertificate(CertificateRequestDTO requestDTO, User owner, Event event, Organization org) {
        return Certificate.builder()
                .hours(requestDTO.hours())
                .event(event)
                .owner(owner)
                .organization(org)
                .build();
    }
}
