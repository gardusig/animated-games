package com.pokemon.controller;

import com.pokemon.model.Achievement;
import com.pokemon.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/achievements")
@CrossOrigin(origins = "*")
public class AchievementController {
    private final AchievementService service;

    public AchievementController(AchievementService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Achievement>> list() {
        return ResponseEntity.ok(service.listAll());
    }
}
