package com.pokemon.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pokedex_entries")
public class PokedexEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trainer_id", nullable = false)
    private Integer trainerId;

    @Column(name = "species_id", nullable = false)
    private Integer speciesId;

    @Column(nullable = false)
    private Boolean caught = false;

    @Column(nullable = false)
    private Boolean shiny = false;

    @Column(name = "caught_at")
    private Instant caughtAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "species_id", insertable = false, updatable = false)
    private PokemonSpecies species;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getTrainerId() { return trainerId; }
    public void setTrainerId(Integer trainerId) { this.trainerId = trainerId; }
    public Integer getSpeciesId() { return speciesId; }
    public void setSpeciesId(Integer speciesId) { this.speciesId = speciesId; }
    public Boolean getCaught() { return caught; }
    public void setCaught(Boolean caught) { this.caught = caught; }
    public Boolean getShiny() { return shiny; }
    public void setShiny(Boolean shiny) { this.shiny = shiny; }
    public Instant getCaughtAt() { return caughtAt; }
    public void setCaughtAt(Instant caughtAt) { this.caughtAt = caughtAt; }
    public PokemonSpecies getSpecies() { return species; }
    public void setSpecies(PokemonSpecies species) { this.species = species; }
}
