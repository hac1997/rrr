package edu.ifsc.reevo.controller;

import edu.ifsc.reevo.dto.DtoRequest.EventRequestDTO;
import edu.ifsc.reevo.model.events.Event;
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
    public ResponseEntity<Event> addEvent(@Valid @RequestBody EventRequestDTO requestDTO) {
        return ResponseEntity.ok(eventService.addEvent(requestDTO));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequestDTO requestDTO) {
        return ResponseEntity.ok(eventService.updateEvent(requestDTO, eventId));
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