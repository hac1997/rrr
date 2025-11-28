package edu.ifsc.reevo.repository;

import edu.ifsc.reevo.model.enums.NewsType;
import edu.ifsc.reevo.model.helper.Tag;
import edu.ifsc.reevo.model.news.News;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    List<News> findByType(NewsType type);

    @Query("SELECT n FROM News n ORDER BY n.createdAt DESC")
    List<News> findTopNews(Pageable pageable);

    @Query("""
            SELECT n FROM News n
            JOIN n.eventTags t
            WHERE n.type = :type
            AND t IN :tags
            GROUP BY n
            HAVING COUNT(DISTINCT t) = :tagCount
            """)
    List<News> findEventsByTags(@Param("type") NewsType type,
            @Param("tags") List<Tag> tags,
            @Param("tagCount") long tagCount);
}