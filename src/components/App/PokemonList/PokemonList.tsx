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
  Skeleton
} from '@mui/material';
import {
  useQuery,
  keepPreviousData,
  useQueryClient
} from '@tanstack/react-query';
import TablePaginationCentered from 'components/TablePaginationCentered/TablePaginationCentered';
import axios, { AxiosResponse } from 'axios';
import pokemonListQuery from './pokemonListQuery';

const endpoint = 'https://beta.pokeapi.co/graphql/v1beta';

export interface PokemonListProps {
  rowsPerPage?: number;
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

const PokemonList = ({ rowsPerPage = 5 }: PokemonListProps) => {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  // TODO: No any?
  const handleChangePage = (event: any | null, newPage: number) => {
    setPage(newPage);
  };

  // TODO: Error handling
  // TODO: incoming data types
  // Get a page of pokemon
  // I really wanted to name this, `catchPokemon`...
  const fetchPokemon = async (
    newPage: number,
    limit: number,
    query: string
  ): Promise<AxiosResponse<any, any>> => {
    const response = await axios.post(endpoint, {
      query,
      variables: {
        limit,
        offset: newPage * limit,
        orderBy: [{ id: 'asc' }]
      }
    });

    return response.data;
  };

  // much thanks:
  // https://tanstack.com/query/latest/docs/framework/react/examples/pagination?from=reactQueryV3
  const { data, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['pokemon', page, rowsPerPage],
    placeholderData: keepPreviousData,
    staleTime: 500000,
    queryFn: async () => {
      const response = await fetchPokemon(page, rowsPerPage, pokemonListQuery);
      return response.data;
    }
  });

  // Prefetch the next page!
  React.useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ['pokemon', page + 1],
        queryFn: () => fetchPokemon(page + 1, rowsPerPage, pokemonListQuery)
      });
    }
  }, [data, isPlaceholderData, page, queryClient]);

  // TODO: Make better.
  // TODO: preloading shadows might be nice here instead
  if (error) return <div>Error: {error.message}</div>;

  const pokemonData = data?.pokemon_v2_pokemon as PokemonListItem[];
  const { count } = data?.pokemon_v2_pokemon_aggregate?.aggregate ?? 0;

  return (
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
              <TableRow key={`placeholder${Math.floor(Math.random() * 1000)}`}>
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
  );
};

export default PokemonList;
