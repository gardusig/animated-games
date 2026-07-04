package com.pokemon.service;

import com.pokemon.model.PokemonSpecies;
import com.pokemon.repository.PokemonSpeciesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PokemonSpeciesService {
    private final PokemonSpeciesRepository repository;

    public PokemonSpeciesService(PokemonSpeciesRepository repository) {
        this.repository = repository;
    }

    public Page<PokemonSpecies> list(int page, int limit, String search, Integer firstDex) {
        int safePage = Math.max(page, 1);
        int safeLimit = Math.max(limit, 1);
        PageRequest pr = PageRequest.of(
                safePage - 1,
                safeLimit,
                Sort.by("nationalDexId").ascending()
        );

        boolean hasSearch = search != null && !search.isBlank();
        boolean hasFirstDex = firstDex != null && firstDex > 0;

        if (hasFirstDex && hasSearch) {
            return repository.findByNationalDexIdGreaterThanEqualAndNameContainingIgnoreCase(
                    firstDex, search.trim(), pr);
        }
        if (hasFirstDex) {
            return repository.findByNationalDexIdGreaterThanEqual(firstDex, pr);
        }
        if (hasSearch) {
            return repository.findByNameContainingIgnoreCase(search.trim(), pr);
        }
        return repository.findAll(pr);
    }

    public Optional<PokemonSpecies> findById(int id) {
        return repository.findById(id);
    }
}
