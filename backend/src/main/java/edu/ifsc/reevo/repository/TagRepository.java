package edu.ifsc.reevo.repository;

import edu.ifsc.reevo.model.helper.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByCode(String code);
}