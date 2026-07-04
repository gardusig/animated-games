package com.pokemon.repository;

import com.pokemon.model.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartyMemberRepository extends JpaRepository<PartyMember, Long> {
    List<PartyMember> findByTrainerIdOrderBySlotAsc(Integer trainerId);
}
