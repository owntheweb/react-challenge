import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from '@mui/material';
import TablePaginationCentered from 'components/TablePaginationCentered/TablePaginationCentered';

export interface PokemonListProps {
  rowsPerPage?: number;
}

export interface PokemonListItem {
  name: string;
  url: string;

  // ...
  // Note: non-exhaustive interface, see here for full list of available props:
  // https://pokeapi.co/docs/v2#pokemon-section
}

const PokemonList = ({ rowsPerPage = 5 }: PokemonListProps) => {
  const mockData: PokemonListItem[] = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    {
      'name': 'ivysaur',
      'url': 'https://pokeapi.co/api/v2/pokemon/2/'
    },
    {
      'name': 'venusaur',
      'url': 'https://pokeapi.co/api/v2/pokemon/3/'
    },
    {
      'name': 'charmander',
      'url': 'https://pokeapi.co/api/v2/pokemon/4/'
    },
    {
      'name': 'charmeleon',
      'url': 'https://pokeapi.co/api/v2/pokemon/5/'
    },
    {
      'name': 'charizard',
      'url': 'https://pokeapi.co/api/v2/pokemon/6/'
    },
    {
      'name': 'squirtle',
      'url': 'https://pokeapi.co/api/v2/pokemon/7/'
    },
    {
      'name': 'wartortle',
      'url': 'https://pokeapi.co/api/v2/pokemon/8/'
    },
    {
      'name': 'blastoise',
      'url': 'https://pokeapi.co/api/v2/pokemon/9/'
    },
    {
      'name': 'caterpie',
      'url': 'https://pokeapi.co/api/v2/pokemon/10/'
    }
  ];

  const [page] = useState(0);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pokemon Name</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {mockData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((listItem) => (
              <TableRow key={listItem.name}>
                <TableCell>{listItem.name}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <TablePagination
        component='div'
        count={mockData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={() => {}}
        rowsPerPageOptions={[]}
        ActionsComponent={TablePaginationCentered}
        sx={{ display: 'flex', justifyContent: 'center' }}
        labelDisplayedRows={() => ''}
      />
    </TableContainer>
  );
};

export default PokemonList;
