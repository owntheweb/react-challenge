import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
import axios, { AxiosResponse } from 'axios';
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
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState<Pokemon | undefined>();

  const getCachedPokemon = (): Pokemon | undefined => {
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

    const selectedPokemon = allPokemonData.find(
      (pokemon) => pokemon.id === Number(id)
    );

    return selectedPokemon
      ? ({
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
        } as Pokemon)
      : undefined;
  };

  const fetchSinglePokemon = async (
    pokemonId: number,
    query: string
  ): Promise<PokemonAxiosResponseData> => {
    const response: AxiosResponse<PokemonAxiosResponseData> = await axios.post(
      config.apiEndpoint,
      {
        query,
        variables: {
          id: pokemonId
        }
      }
    );

    return response.data;
  };

  useEffect(() => {
    // TODO: This assumes all is great. Add error handling
    const fetchFreshPokemon = async () => {
      const freshPokemonResponse = await fetchSinglePokemon(
        Number(id),
        pokemonViewQuery
      );
      const data = freshPokemonResponse.data.pokemon_v2_pokemon_by_pk;

      setPokemonData({
        name: data.name,
        abilities: data.pokemon_v2_pokemonabilities.map((ability) => ({
          id: ability.id,
          name: ability.pokemon_v2_ability.name,
          effect:
            ability.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].effect
        }))
      });
      setLoading(false);
    };

    // We have all the data needed for this page in cached list data.
    // Note: List data wont exist if visiting this page directly.
    const cachedPokemon = getCachedPokemon();
    if (cachedPokemon) {
      setPokemonData(cachedPokemon);
      setLoading(false);
      return;
    }

    // No cached data, load a fresh pokemon
    // TODO: Cache single pokemon as well with tanstack query?
    fetchFreshPokemon();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && !pokemonData) {
    return (
      <p>
        This mysterious pokemon could not be found. The adventure continues...
      </p>
    );
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
