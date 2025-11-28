package edu.ifsc.reevo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ifsc.reevo.model.news.Like;

@Repository
public interface EventLikeRepository extends JpaRepository<Like, Long> {
}