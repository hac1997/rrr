package edu.ifsc.reevo.service;

import edu.ifsc.reevo.dto.DtoRequest;
import edu.ifsc.reevo.dto.DtoRequest.EventRequestDTO;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final OrganizationService organizationService;
    private final GeneralMapper generalMapper;

    public Event addEvent(EventRequestDTO requestDTO) {
        log.info("ADDING EVENT BY REQUEST :: {}",requestDTO);
        if (requestDTO.startDate().isAfter(requestDTO.endDate())) {
            throw new IllegalArgumentException("START DATE CANNOT BE AFTER END DATE");
        }
        var org = organizationService.findByOrganizationId(requestDTO.organizationId());
        var event = generalMapper.toEvent(requestDTO, org);

        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(DtoRequest.EventRequestDTO requestDTO, Long eventId) {
        log.info("UPDATING EVENT WITH ID :: {}", eventId);
        if (requestDTO.startDate().isAfter(requestDTO.endDate())) {
            throw new IllegalArgumentException("START DATE CANNOT BE AFTER END DATE");
        }
        var event = this.findByEventId(eventId);
        if (!event.getOrganization().getOrganizationId().equals(requestDTO.organizationId())) {
            throw new IllegalArgumentException("CANNOT CHANGE ORGANIZATION OF EVENT");
        }

        event.setTitle(requestDTO.title());
        event.setDescription(requestDTO.description());
        event.setStartDate(requestDTO.startDate());
        event.setEndDate(requestDTO.endDate());
        event.setCoverImageUrl(requestDTO.coverImageUrl());
        event.setAddress(requestDTO.address());
        event.setVolunteerSlots(requestDTO.volunteerSlots());
        event.setFilledSlots(requestDTO.filledSlots());
        event.setPointsReward(requestDTO.pointsReward());
        event.setTags(requestDTO.tags());

        return event;
    }

    public void deactivatingEvent(Long eventId) {
        log.info("DEACTIVATING EVENT BY ID :: {}",eventId);
        var event = this.findByEventId(eventId);
        event.setActive(false);
        eventRepository.save(event);
    }

    public void completeEvent(Long eventId) {
        log.info("COMPLETING EVENT BY ID :: {}",eventId);
        var event = this.findByEventId(eventId);
        event.setCompleted(true);
        eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        log.info("GETTING ALL EVENTS");
        return eventRepository.findAll();
    }

    public Event getEventById(Long eventId) {
        log.info("GETTING EVENT BY ID :: {}",eventId);
        return this.findByEventId(eventId);
    }

    public List<Event> getAllActiveEvents() {
        log.info("GETTING ALL ACTIVE EVENTS");
        return eventRepository.findByActiveTrueAndCompletedFalse();
    }

    public List<Event> getActiveEvents() {
        log.info("GETTING ACTIVE EVENTS");
        return eventRepository.findByActiveTrue();
    }

    public List<Event> getEventsByOrganization(Long organizationId) {
        log.info("GETTING EVENTS BY ORGANIZATION ID :: {}",organizationId);
        return eventRepository.findByOrganizationOrganizationId(organizationId);
    }

    public List<Event> getUpcomingEvents() {
        log.info("GETTING UPCOMING EVENTS");
        return eventRepository.findUpcomingEvents();
    }

    protected Event findByEventId(Long eventId) {
        log.info("FINDING EVENT BY ID :: {}",eventId);
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("EVENT NOT FOUND WITH ID :: "+eventId));
    }
}