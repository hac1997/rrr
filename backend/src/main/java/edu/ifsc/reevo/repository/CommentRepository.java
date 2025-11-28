package edu.ifsc.reevo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ifsc.reevo.model.news.Comment;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByNewsNewsId(Long newsId); 

    List<Comment> findByUserUserId(Long userId);

    List<Comment> findByParentCommentCommentId(Long commentId);

    List<Comment> findByNewsNewsIdAndParentCommentIsNull(Long newsId);
}