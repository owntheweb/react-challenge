import React, { useState } from 'react';
import config from 'components/config';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
import TablePaginationCentered from 'components/TablePaginationCentered';
import axios from 'axios';
import formatPokemonApiName from 'utils/formatPokemonApiName';
import pokemonListQuery from './pokemonListQuery';
import { pokemonBlueLinkTableTheme } from '../pokemonBlueTheme';
import { PokemonListItem } from './model/PokemonQueryData';

export interface PokemonListProps {
  rowsPerPage?: number;
  loadSize?: number;
}

const PokemonList = ({ rowsPerPage = 5, loadSize = 100 }: PokemonListProps) => {
  const location = useLocation();
  const [page, setPage] = useState(() => {
    const savedPage = location.state?.page;
    return savedPage !== undefined ? savedPage : 0;
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Get a page of pokemon
  // I really wanted to name this, `catchPokemon`...
  const fetchPokemon = async (
    loadPage: number,
    limit: number,
    query: string
  ) => {
    try {
      const response = await axios.post(config.apiEndpoint, {
        query,
        variables: {
          limit,
          offset: loadPage * limit,
          orderBy: [{ id: 'asc' }]
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw new Error('Unexpected fetchPokemon error. Tell an adult!');
    }
  };

  // Calculate the current data load page (not the page the user sees).
  // Example: User is viewing page 3 in the table. Data is still
  // loading from the first loaded set of 100 results. This is saving
  // on number of requests to the API while allowing the user to
  // more quickly page through pokemon 5 at a time, loading the next
  // data load page of 100 at list page 21.
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
                    <RouterLink to={`/pokemon/${listItem.id}`} state={{ page }}>
                      {formatPokemonApiName(listItem.name)}
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
