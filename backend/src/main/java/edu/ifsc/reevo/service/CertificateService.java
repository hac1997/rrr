package edu.ifsc.reevo.service;

import edu.ifsc.reevo.dto.DtoRequest.CertificateRequestDTO;
import edu.ifsc.reevo.model.events.Certificate;
import edu.ifsc.reevo.repository.CertificateRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserService userService;
    private final EventService eventService;
    private final OrganizationService organizationService;
    private final GeneralMapper generalMapper;

    public Certificate generateCertificate(CertificateRequestDTO requestDTO) {
        log.info("GENERATING CERTIFICATE WITH REQUEST :: {}",requestDTO);
        var user = userService.findUserById(requestDTO.ownerId());
        var event = eventService.findByEventId(requestDTO.eventId());
        var org = organizationService.findByOrganizationId(requestDTO.organizationId());
        var certificate = generalMapper.toCertificate(requestDTO, user, event, org);

        return certificateRepository.save(certificate);
    }

    public List<Certificate> getAllCertificates() {
        log.info("GETTING ALL CERTIFICATES");
        return certificateRepository.findAll();
    }

    public Certificate getCertificateById(Long certificateId) {
        log.info("GETTING CERTIFICATE BY ID :: {}",certificateId);
        return this.findCertificateById(certificateId);
    }

    public List<Certificate> getCertificatesByUserId(Long userId) {
        log.info("GETTING CERTIFICATES BY USER ID :: {}",userId);
        return certificateRepository.findByOwnerUserId(userId);
    }

    public List<Certificate> getCertificatesByEventId(Long eventId) {
        log.info("GETTING CERTIFICATES BY EVENT ID :: {}",eventId);
        return certificateRepository.findByEventEventId(eventId);
    }

    private Certificate findCertificateById(Long certificateId) {
        log.info("FINDING CERTIFICATE BY ID :: {}",certificateId);
        return certificateRepository.findById(certificateId)
                .orElseThrow(() -> new EntityNotFoundException("CERTIFICATE NOT FOUND WITH ID :: "+certificateId));
    }
}