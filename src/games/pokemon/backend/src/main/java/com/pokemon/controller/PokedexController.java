package com.pokemon.controller;

import com.pokemon.model.PokedexEntry;
import com.pokemon.service.PokedexService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pokedex")
@CrossOrigin(origins = "*")
public class PokedexController {
    private final PokedexService service;

    public PokedexController(PokedexService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") int trainerId,
            @RequestParam(defaultValue = "false") boolean shiny) {
        List<PokedexEntry> entries = service.listForTrainer(trainerId, shiny);
        Map<String, Object> body = new HashMap<>();
        body.put("trainerId", trainerId);
        body.put("shiny", shiny);
        body.put("entries", entries);
        body.put("stats", service.stats(trainerId));
        return ResponseEntity.ok(body);
    }
}
