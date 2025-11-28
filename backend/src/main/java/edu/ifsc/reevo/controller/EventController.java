package edu.ifsc.reevo.controller;

import edu.ifsc.reevo.dto.DtoRequest.EventRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.EventResponseDTO;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.Tag;
import edu.ifsc.reevo.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllActiveEvents() {
        return ResponseEntity.ok(eventService.getAllActiveEvents());
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Event> getEventById(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getEventById(eventId));
    }

    @PostMapping
    public ResponseEntity<EventResponseDTO> addEvent(@Valid @RequestBody EventRequestDTO requestDTO) {

        var event = eventService.addEvent(requestDTO);

        var dto = new EventResponseDTO(
                event.getEventId(),
                event.getTitle(),
                event.getDescription(),
                event.getStartDate(),
                event.getEndDate(),
                event.getCoverImageUrl(),
                event.getAddress(),
                event.getVolunteerSlots(),
                event.getFilledSlots(),
                event.getPointsReward(),
                event.getOrganization().getOrganizationId(),
                event.getTags().stream().map(Tag::getCode).toList());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponseDTO> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequestDTO requestDTO) {
        var event = eventService.updateEvent(requestDTO, eventId);

        var dto = new EventResponseDTO(
                event.getEventId(),
                event.getTitle(),
                event.getDescription(),
                event.getStartDate(),
                event.getEndDate(),
                event.getCoverImageUrl(),
                event.getAddress(),
                event.getVolunteerSlots(),
                event.getFilledSlots(),
                event.getPointsReward(),
                event.getOrganization().getOrganizationId(),
                event.getTags().stream().map(Tag::getCode).toList());

        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{eventId}/deactivate")
    public ResponseEntity<Void> deactivateEvent(@PathVariable Long eventId) {
        eventService.deactivatingEvent(eventId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{eventId}/complete")
    public ResponseEntity<Void> completeEvent(@PathVariable Long eventId) {
        eventService.completeEvent(eventId);
        return ResponseEntity.ok().build();
    }

}