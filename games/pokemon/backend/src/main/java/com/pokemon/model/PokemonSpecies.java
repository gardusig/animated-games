package com.pokemon.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pokemon_species")
public class PokemonSpecies {
    @Id
    @Column(name = "national_dex_id")
    private Integer nationalDexId;

    @Column(nullable = false)
    private String name;

    @Column(name = "type_primary", nullable = false)
    private String typePrimary;

    @Column(name = "type_secondary")
    private String typeSecondary;

    private Short generation;
    private String region;

    @Column(name = "source_game")
    private String sourceGame;

    @Column(name = "sprite_url")
    private String spriteUrl;

    private String description;

    @Column(name = "created_at")
    private Instant createdAt;

    public Integer getNationalDexId() { return nationalDexId; }
    public void setNationalDexId(Integer nationalDexId) { this.nationalDexId = nationalDexId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTypePrimary() { return typePrimary; }
    public void setTypePrimary(String typePrimary) { this.typePrimary = typePrimary; }
    public String getTypeSecondary() { return typeSecondary; }
    public void setTypeSecondary(String typeSecondary) { this.typeSecondary = typeSecondary; }
    public Short getGeneration() { return generation; }
    public void setGeneration(Short generation) { this.generation = generation; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getSourceGame() { return sourceGame; }
    public void setSourceGame(String sourceGame) { this.sourceGame = sourceGame; }
    public String getSpriteUrl() { return spriteUrl; }
    public void setSpriteUrl(String spriteUrl) { this.spriteUrl = spriteUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
