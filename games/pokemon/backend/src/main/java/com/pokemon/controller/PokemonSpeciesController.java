package com.pokemon.controller;

import com.pokemon.dto.PaginationResponse;
import com.pokemon.model.PokemonSpecies;
import com.pokemon.service.PokemonSpeciesService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/species")
@CrossOrigin(origins = "*")
public class PokemonSpeciesController {
    private final PokemonSpeciesService service;

    public PokemonSpeciesController(PokemonSpeciesService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "24") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer firstDex) {
        int calculatedPage = 1;
        Integer startDex = null;
        if (firstDex != null && firstDex > 0) {
            startDex = firstDex;
        } else if (page != null && page > 0) {
            calculatedPage = page;
        }

        Page<PokemonSpecies> result = service.list(calculatedPage, limit, search, startDex);
        PaginationResponse pagination = new PaginationResponse(
                calculatedPage,
                limit,
                result.getTotalElements(),
                result.getTotalPages()
        );

        Map<String, Object> body = new HashMap<>();
        body.put("species", result.getContent());
        body.put("pagination", pagination);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PokemonSpecies> get(@PathVariable int id) {
        Optional<PokemonSpecies> species = service.findById(id);
        return species.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
