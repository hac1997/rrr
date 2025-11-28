package edu.ifsc.reevo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ifsc.reevo.model.events.Certificate;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByOwnerUserId(Long userId);

    List<Certificate> findByEventEventId(Long eventId);
}