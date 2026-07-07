package com.pokemon.service;

import com.pokemon.model.PokedexEntry;
import com.pokemon.repository.PokedexEntryRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PokedexService {
    private final PokedexEntryRepository repository;

    public PokedexService(PokedexEntryRepository repository) {
        this.repository = repository;
    }

    public List<PokedexEntry> listForTrainer(int trainerId, boolean shinyOnly) {
        if (shinyOnly) {
            return repository.findByTrainerIdAndShiny(trainerId, true);
        }
        return repository.findByTrainerIdAndShiny(trainerId, false);
    }

    public Map<String, Object> stats(int trainerId) {
        long caught = repository.countByTrainerIdAndCaughtTrue(trainerId);
        Map<String, Object> stats = new HashMap<>();
        stats.put("trainerId", trainerId);
        stats.put("caught", caught);
        return stats;
    }
}
