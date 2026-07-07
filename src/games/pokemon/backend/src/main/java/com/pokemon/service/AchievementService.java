package com.pokemon.service;

import com.pokemon.model.Achievement;
import com.pokemon.repository.AchievementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {
    private final AchievementRepository repository;

    public AchievementService(AchievementRepository repository) {
        this.repository = repository;
    }

    public List<Achievement> listAll() {
        return repository.findAllByOrderByIdAsc();
    }
}
