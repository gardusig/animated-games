package com.pokemon.controller;

import com.pokemon.model.PartyMember;
import com.pokemon.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/team")
@CrossOrigin(origins = "*")
public class TeamController {
    private final TeamService service;

    public TeamController(TeamService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTeam(
            @RequestParam(defaultValue = "1") int trainerId) {
        List<PartyMember> members = service.getTeam(trainerId);
        Map<String, Object> body = new HashMap<>();
        body.put("trainerId", trainerId);
        body.put("members", members);
        body.put("maxSlots", 6);
        return ResponseEntity.ok(body);
    }
}
