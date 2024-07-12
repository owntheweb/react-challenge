import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Skeleton,
  ThemeProvider
} from '@mui/material';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import TablePaginationCentered from 'components/TablePaginationCentered/TablePaginationCentered';
import axios, { AxiosResponse } from 'axios';
import pokemonListQuery from './pokemonListQuery';
import { pokemonBlueLinkTableTheme } from '../pokemonBlueTheme';

const endpoint = 'https://beta.pokeapi.co/graphql/v1beta';

export interface PokemonListProps {
  rowsPerPage?: number;
  loadSize?: number;
}

export interface PokemonAbilityEffect {
  language_id: number;
  effect: string;
}

// TODO: Maybe there's a way to flatten this in the query itself?
export interface PokemonAbility {
  id: number;
  pokemon_v2_ability: {
    name: string;
  };
}

// TODO: I wonder if I can rename properties in graphql query?
// pokemon_v2_pokemonabilities -> abilities
export interface PokemonListItem {
  id: number;
  name: string;
  pokemon_v2_pokemonabilities: PokemonAbility[];
}

const PokemonList = ({ rowsPerPage = 5, loadSize = 100 }: PokemonListProps) => {
  const [page, setPage] = useState(0);

  // TODO: No any?
  const handleChangePage = (event: any | null, newPage: number) => {
    setPage(newPage);
  };

  // TODO: Error handling
  // Get a page of pokemon
  // I really wanted to name this, `catchPokemon`...
  const fetchPokemon = async (
    loadPage: number,
    limit: number,
    query: string
  ): Promise<AxiosResponse<any, any>> => {
    const response = await axios.post(endpoint, {
      query,
      variables: {
        limit,
        offset: loadPage * limit,
        orderBy: [{ id: 'asc' }]
      }
    });

    return response.data;
  };

  const loadPage = Math.floor((page * rowsPerPage) / loadSize);

  // much thanks:
  // https://tanstack.com/query/latest/docs/framework/react/examples/pagination?from=reactQueryV3
  const { data, error, isFetching } = useQuery({
    queryKey: ['pokemonList', loadPage, loadSize],
    placeholderData: keepPreviousData,
    staleTime: 60 * 60 * 1000, // 1 hour
    queryFn: () => fetchPokemon(loadPage, loadSize, pokemonListQuery)
  });

  if (error) return <div>Error: {error.message}</div>;

  // Paging math hurts my brain, thanks:
  // https://stackoverflow.com/questions/68106002/convert-startindex-endindex-to-pagenumber-pagesize
  const loadedPokemonData = data?.data?.pokemon_v2_pokemon as PokemonListItem[];
  const startIndex = (page * rowsPerPage) % loadSize;
  const pokemonData =
    loadedPokemonData?.slice(startIndex, startIndex + rowsPerPage) ?? [];
  const { count } = data?.data?.pokemon_v2_pokemon_aggregate?.aggregate ?? 0;

  return (
    <ThemeProvider theme={pokemonBlueLinkTableTheme}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pokemon Name</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isFetching &&
              [...Array(rowsPerPage)].map(() => (
                <TableRow
                  key={`placeholder${Math.floor(Math.random() * 1000)}`}
                >
                  <TableCell>
                    <Skeleton
                      sx={{
                        margin: '16px',
                        width: `${50 + Math.random() * 100}px`
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}

            {!isFetching &&
              pokemonData.map((listItem) => (
                <TableRow key={listItem.name} hover>
                  <TableCell>
                    <RouterLink to={`/pokemon/${listItem.id}`}>
                      {listItem.name}
                    </RouterLink>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component='div'
          count={count ?? 1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          ActionsComponent={TablePaginationCentered}
          labelDisplayedRows={() => ''}
        />
      </TableContainer>
    </ThemeProvider>
  );
};

export default PokemonList;
