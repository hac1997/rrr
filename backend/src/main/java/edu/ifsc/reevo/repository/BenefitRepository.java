package edu.ifsc.reevo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ifsc.reevo.model.events.Benefit;

@Repository
public interface BenefitRepository extends JpaRepository<Benefit, Long> {
}