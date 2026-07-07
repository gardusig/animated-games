package com.pokemon.controller;

import com.pokemon.service.PokemonSpeciesService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PokemonSpeciesController.class)
class PokemonSpeciesControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PokemonSpeciesService service;

    @Test
    void listSpecies() throws Exception {
        when(service.list(anyInt(), anyInt(), isNull())).thenReturn(new PageImpl<>(List.of()));
        mockMvc.perform(get("/species"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.species").isArray());
    }
}
