package edu.ifsc.reevo.service;

import edu.ifsc.reevo.dto.DtoRequest.CertificateRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.EventRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.NotificationRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.OrganizationRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.ReportRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.UserRequestDTO;
import edu.ifsc.reevo.model.Notification;
import edu.ifsc.reevo.model.Organization;
import edu.ifsc.reevo.model.Profile;
import edu.ifsc.reevo.model.Report;
import edu.ifsc.reevo.model.User;
import edu.ifsc.reevo.model.enums.UserType;
import edu.ifsc.reevo.model.events.Certificate;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.Tag;
import edu.ifsc.reevo.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class GeneralMapper {

        private final TagRepository tagRepository;

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


    public Event toEvent(EventRequestDTO dto, Organization org) {

        List<Tag> persistentTags = dto.tags().stream()
                .map(t -> tagRepository.findByCode(t.code())
                        .orElseGet(() ->
                                tagRepository.save(
                                        Tag.builder()
                                                .code(t.code())
                                                .label(t.label())
                                                .build()
                                )
                        )
                ).toList();

        return Event.builder()
                .title(dto.title())
                .description(dto.description())
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .coverImageUrl(dto.coverImageUrl())
                .address(dto.address())
                .volunteerSlots(dto.volunteerSlots())
                .filledSlots(dto.filledSlots())
                .pointsReward(dto.pointsReward())
                .organization(org)
                .tags(persistentTags)
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
