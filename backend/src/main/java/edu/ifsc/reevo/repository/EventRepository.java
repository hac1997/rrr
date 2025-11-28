package edu.ifsc.reevo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.ifsc.reevo.model.events.Event;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByActiveTrue();

    List<Event> findByActiveTrueAndCompletedFalse();

    @Query("SELECT e FROM Event e WHERE e.startDate > CURRENT_TIMESTAMP AND e.active = true AND e.completed = false")
    List<Event> findUpcomingEvents();

    List<Event> findByOrganizationOrganizationId(Long organizationId);
}