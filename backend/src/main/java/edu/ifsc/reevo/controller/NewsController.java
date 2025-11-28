package edu.ifsc.reevo.controller;

import edu.ifsc.reevo.model.news.News;
import edu.ifsc.reevo.service.NewsService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<News>> getNewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(newsService.getNewsByUser(userId));
    }

}