package com.pokemon.repository;

import com.pokemon.model.PokedexEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PokedexEntryRepository extends JpaRepository<PokedexEntry, Long> {
    List<PokedexEntry> findByTrainerIdAndShiny(Integer trainerId, Boolean shiny);
    long countByTrainerIdAndCaughtTrue(Integer trainerId);
}
