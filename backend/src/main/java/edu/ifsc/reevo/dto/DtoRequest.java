package edu.ifsc.reevo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.hibernate.validator.constraints.br.CNPJ;
import org.hibernate.validator.constraints.br.CPF;

import edu.ifsc.reevo.model.enums.NewsType;
import edu.ifsc.reevo.model.enums.ReportType;
import edu.ifsc.reevo.model.enums.UserType;
import edu.ifsc.reevo.model.helper.Address;
import edu.ifsc.reevo.model.helper.Profession;
import edu.ifsc.reevo.model.helper.ProfileMetadata;
import edu.ifsc.reevo.util.ValidPassword;
import edu.ifsc.reevo.util.ValidPhone;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class DtoRequest {

        public record BenefitRequestDTO(
                        @NotBlank @Size(max = 200) String title,
                        @Size(max = 1000) String description,
                        @NotNull Long eventId) {
        }

        public record CertificateRequestDTO(
                        @NotNull @Positive int hours,
                        @NotNull @PastOrPresent LocalDateTime dateCertified,
                        @NotNull Long ownerId,
                        @NotNull Long eventId,
                        @NotNull Long organizationId) {
        }

        public record CommentRequestDTO(
                        @NotBlank @Size(max = 1000) String content,
                        @NotNull Long userId,
                        Long eventId,
                        Long parentCommentId) {
        }

        public record EventRequestDTO(
                        @NotBlank @Size(max = 200) String title,
                        @Size(max = 1000) String description,
                        @NotNull @Future LocalDateTime startDate,
                        @NotNull LocalDateTime endDate,
                        String coverImageUrl,
                        @Valid Address address,
                        @NotNull @Positive int volunteerSlots,
                        @PositiveOrZero int filledSlots,
                        @NotNull @PositiveOrZero int pointsReward,
                        @NotNull Long organizationId,
                        @Valid List<TagRequestDTO> tags) {
        }

        public record EventResponseDTO(
                        Long id,
                        String title,
                        String description,
                        LocalDateTime startDate,
                        LocalDateTime endDate,
                        String coverImageUrl,
                        Address address,
                        int volunteerSlots,
                        int filledSlots,
                        int pointsReward,
                        Long organizationId,
                        List<String> tags) {
        }

        public record TagRequestDTO(
                        @NotBlank String code,
                        String label) {
        }

        public record NewsRequestDTO(
                        @NotBlank @Size(max = 200) String title,
                        @NotBlank @Size(max = 5000) String body,
                        @NotNull NewsType type) {
        }

        public record NotificationRequestDTO(
                        @Size(max = 500) String message,
                        @NotBlank @Size(max = 50) String type,
                        @NotNull Long userId) {
        }

        public record OrganizationRequestDTO(
                        @NotBlank @CNPJ String CNPJ,
                        @NotBlank @ValidPassword String passwordHash,
                        @NotBlank @Size(max = 200) String name,
                        @Size(max = 500) String description,
                        @NotBlank @Email @Size(max = 150) String email,
                        @Size(max = 20) String phone,
                        @Size(max = 200) String website,
                        String logoImageUrl,
                        @Valid Address address) {
        }

        public record ProfileRequestDTO(
                        @Size(max = 500) String profileUrl,
                        @Size(max = 200) String headline,
                        @Size(max = 1000) String bio,
                        String profileImageUrl,
                        Profession profession,
                        @Valid Address address,
                        ProfileMetadata profileMetadata,
                        List<@Size(max = 100) String> skills,
                        List<@Size(max = 500) String> links,
                        Set<Long> tagIds,
                        @NotNull Long userId) {
        }

        public record ReportRequestDTO(
                        @NotNull ReportType type,
                        @NotBlank @Size(max = 500) String description,
                        @Size(max = 500) String adminNotes,
                        @NotNull Long reportedById,
                        Long reportedUserId,
                        Long reportedEventId,
                        Long reportedOrganizationId) {
        }

        public record UserRequestDTO(
                        @NotBlank @CPF String CPF,
                        @NotBlank @Size(max = 100) String firstname,
                        @NotBlank @Size(max = 100) String lastname,
                        @NotBlank @Email @Size(max = 150) String email,
                        @ValidPhone String phone,
                        @NotBlank @ValidPassword String passwordHash,
                        @NotNull UserType userType,
                        @NotNull @Past LocalDate birthDate) {
        }

        public record UserResponseDTO(
                        @NotBlank @CPF String CPF,
                        @NotBlank @Size(max = 100) String firstname,
                        @NotBlank @Size(max = 100) String lastname,
                        @NotBlank @Email @Size(max = 150) String email,
                        @ValidPhone String phone,
                        @NotBlank @ValidPassword String passwordHash,
                        @NotNull UserType userType,
                        @NotNull @Past LocalDate birthDate) {
        }
}
