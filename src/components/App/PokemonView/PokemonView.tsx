import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

export interface PokemonAbility {
  name: string;
  url: string;
}

const PokemonView = (): React.ReactNode => {
  return (
    <>
      <p>Selected Pokemon: Pokemonhere</p>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ability</TableCell>
              <TableCell>Ability Effect</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow key='REPLACE' hover>
              <TableCell>Soon</TableCell>
              <TableCell>Soon</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PokemonView;
