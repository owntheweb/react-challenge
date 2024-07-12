import React from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

interface PokemonAbility {
  id: number;
  pokemon_v2_ability: {
    name: string;
    pokemon_v2_abilityeffecttexts: {
      effect: string;
      language_id: number;
    }[];
  };
}

interface PokemonListItem {
  id: number;
  name: string;
  pokemon_v2_pokemonabilities: PokemonAbility[];
}

interface PokemonQueryData {
  data: {
    pokemon_v2_pokemon: PokemonListItem[];
    pokemon_v2_pokemon_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

const PokemonView = (): React.ReactNode => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // get cache data for all pages
  const cachedQueries = queryClient.getQueriesData<PokemonQueryData>({
    queryKey: ['pokemonList']
  });

  // combine all cached pages data
  // TODO: This feels messy. Revisit.
  const allPokemonData = cachedQueries.reduce((acc, [, pageData]) => {
    if (pageData && pageData.data && pageData.data.pokemon_v2_pokemon) {
      return [...acc, ...pageData.data.pokemon_v2_pokemon];
    }
    return acc;
  }, [] as PokemonListItem[]);

  if (allPokemonData.length === 0) {
    return (
      <p>
        TODO: A: It is time to make a new query in case someone is accessing
        this page directly.
      </p>
    );
  }

  const selectedPokemon = allPokemonData.find(
    (pokemon) => pokemon.id === Number(id)
  );

  if (!selectedPokemon) {
    return (
      <p>
        TODO: B: It is time to make a new query in case someone is accessing
        this page directly.
      </p>
    );
  }

  return (
    <>
      <p>Selected Pokemon: {selectedPokemon.name}</p>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ability</TableCell>
              <TableCell>Ability Effect</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedPokemon.pokemon_v2_pokemonabilities.map((ability) => (
              <TableRow key={ability.id}>
                <TableCell>{ability.pokemon_v2_ability.name}</TableCell>
                <TableCell>
                  {ability.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0]
                    .effect || 'Effect not found. How mysterious...'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PokemonView;
