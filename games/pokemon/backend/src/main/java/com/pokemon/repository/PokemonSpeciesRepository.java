package com.pokemon.repository;

import com.pokemon.model.PokemonSpecies;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PokemonSpeciesRepository extends JpaRepository<PokemonSpecies, Integer> {
    Page<PokemonSpecies> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<PokemonSpecies> findByNationalDexIdGreaterThanEqual(Integer nationalDexId, Pageable pageable);

    Page<PokemonSpecies> findByNationalDexIdGreaterThanEqualAndNameContainingIgnoreCase(
            Integer nationalDexId, String name, Pageable pageable);
}
