package com.pokemon.model;

import jakarta.persistence.*;

@Entity
@Table(name = "party_members")
public class PartyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trainer_id", nullable = false)
    private Integer trainerId;

    @Column(name = "species_id", nullable = false)
    private Integer speciesId;

    @Column(nullable = false)
    private Short slot;

    private String nickname;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "species_id", insertable = false, updatable = false)
    private PokemonSpecies species;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getTrainerId() { return trainerId; }
    public void setTrainerId(Integer trainerId) { this.trainerId = trainerId; }
    public Integer getSpeciesId() { return speciesId; }
    public void setSpeciesId(Integer speciesId) { this.speciesId = speciesId; }
    public Short getSlot() { return slot; }
    public void setSlot(Short slot) { this.slot = slot; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public PokemonSpecies getSpecies() { return species; }
    public void setSpecies(PokemonSpecies species) { this.species = species; }
}
