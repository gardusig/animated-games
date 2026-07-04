package com.pokemon.service;

import com.pokemon.model.PartyMember;
import com.pokemon.repository.PartyMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {
    private final PartyMemberRepository repository;

    public TeamService(PartyMemberRepository repository) {
        this.repository = repository;
    }

    public List<PartyMember> getTeam(int trainerId) {
        return repository.findByTrainerIdOrderBySlotAsc(trainerId);
    }
}
