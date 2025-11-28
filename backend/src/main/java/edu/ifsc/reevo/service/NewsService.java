package edu.ifsc.reevo.service;

import edu.ifsc.reevo.model.enums.NewsType;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.Tag;
import edu.ifsc.reevo.model.news.News;
import edu.ifsc.reevo.repository.EventRepository;
import edu.ifsc.reevo.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final EventRepository eventRepository;
    private final UserService userService;

    public List<News> getNewsByUser(Long userId) {
        log.info("PEGANDO TODAS AS NEWS DO TIPO ANNOUNCEMENT");
        List<News> newsList = newsRepository.findByType(NewsType.ANNOUNCEMENT);

        Set<Tag> requiredTags = userService.getTagsByUser(userId);

        log.info("PEGANDO TODAS AS NEWS DE EVENTOS QUE SEJAM DE INTERESSE DO USUÁRIO");
        if (requiredTags != null && !requiredTags.isEmpty()) {
            List<News> eventNews = newsRepository.findEventsByTags(
                    NewsType.EVENT,
                    new ArrayList<>(requiredTags), 
                    (long) requiredTags.size() 
            );

            newsList.addAll(eventNews);
        }

        return newsList;
    }

    public News createNewsEventByOrganization(Long eventId, Long orgId, String[] bodyTitle) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        if (!event.getOrganization().getOrganizationId().equals(orgId)) {
            throw new RuntimeException("Organização não possui permissão para criar notícias deste evento");
        }

        News news = News.builder()
                .title(bodyTitle[0])
                .body(bodyTitle[1])
                .imageUrl(event.getCoverImageUrl())
                .publishDate(LocalDateTime.now())
                .type(NewsType.EVENT)
                .event(event)
                .eventTags(event.getTags())
                .build();

        return newsRepository.save(news);
    }

}