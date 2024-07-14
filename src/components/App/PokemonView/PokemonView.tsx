import React from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import BackLink from 'components/BackLink';
import formatPokemonApiName from 'utils/formatPokemonApiName';
import config from 'components/config';
import axios from 'axios';
import {
  PokemonListItem,
  PokemonQueryData,
  PokemonAbility as ResponsePokemonAbility
} from '../PokemonList/model/PokemonQueryData';
import pokemonViewQuery from './pokemonViewQuery';

interface PokemonAbility {
  id: number;
  name: string;
  effect: string;
}

interface Pokemon {
  name: string;
  abilities: PokemonAbility[];
}

interface PokemonAxiosResponseData {
  data: {
    pokemon_v2_pokemon_by_pk: {
      id: number;
      name: string;
      pokemon_v2_pokemonabilities: ResponsePokemonAbility[];
    };
  };
}

const PokemonView = (): React.ReactNode => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // When cache data is not available, fetch a pokemon
  const fetchSinglePokemon = async (pokemonId: number): Promise<Pokemon> => {
    const response = await axios.post<PokemonAxiosResponseData>(
      config.apiEndpoint,
      {
        query: pokemonViewQuery,
        variables: { id: pokemonId }
      }
    );

    const data = response.data.data.pokemon_v2_pokemon_by_pk;
    return {
      name: data.name,
      abilities: data.pokemon_v2_pokemonabilities.map((ability) => ({
        id: ability.id,
        name: ability.pokemon_v2_ability.name,
        effect:
          ability.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].effect
      }))
    };
  };

  // useQuery to set initial state from paged cache or fetch
  // a single pokemon and cache that as well.
  // Note: If this page grew while the paged data did not, I
  // see making use of the cached paged data if available still
  // to place a temporary page title here at least while loading the
  // rest of the content. While I catch up on Tanstack/React
  // Query, I'm super curious how the team would handle this! :D
  const {
    data: pokemonData,
    isLoading,
    error
  } = useQuery<Pokemon>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchSinglePokemon(Number(id)),
    staleTime: 60 * 60 * 1000, // 1 hour
    initialData: () => {
      const cachedQueries = queryClient.getQueriesData<PokemonQueryData>({
        queryKey: ['pokemonList']
      });
      const allPokemonData = cachedQueries.reduce((acc, [, pageData]) => {
        if (pageData?.data?.pokemon_v2_pokemon) {
          return [...acc, ...pageData.data.pokemon_v2_pokemon];
        }
        return acc;
      }, [] as PokemonListItem[]);

      const selectedPokemon = allPokemonData.find(
        (pokemon) => pokemon.id === Number(id)
      );

      if (selectedPokemon) {
        return {
          name: selectedPokemon.name,
          abilities: selectedPokemon.pokemon_v2_pokemonabilities.map(
            (ability) => ({
              id: ability.id,
              name: ability.pokemon_v2_ability.name,
              effect:
                ability.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0]
                  .effect
            })
          )
        };
      }

      return undefined;
    }
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isLoading && !pokemonData) {
    return (
      <p>
        This mysterious pokemon could not be found. The adventure continues...
      </p>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!pokemonData) {
    return <p>Something went wrong. Tell an adult!</p>;
  }

  return (
    <>
      <p>Selected Pokemon: {formatPokemonApiName(pokemonData.name)}</p>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ability</TableCell>
              <TableCell>Ability Effect</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pokemonData.abilities.map((ability) => (
              <TableRow key={ability.id}>
                <TableCell>{formatPokemonApiName(ability.name)}</TableCell>
                <TableCell>{ability.effect}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BackLink to='/' text='Back to list view' />
    </>
  );
};

export default PokemonView;
