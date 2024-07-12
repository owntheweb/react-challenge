import { createTheme } from '@mui/material/styles';

// main theme for the pokemon light blue table theme
const pokemonBlueTheme = createTheme({
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#adcdf7',
          fontWeight: 'normal',
          borderBottom: 'none',
          fontSize: '1rem'
        },
        body: {
          borderBottom: 'none',
          fontSize: '1rem',
          display: 'flex'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#f8f8f8'
          },
          '&:nth-of-type(even)': {
            backgroundColor: '#ffffff'
          },
          '&:hover': {
            backgroundColor: '#adcdf7'
          }
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          backgroundColor: '#deebfd',
          fontSize: '1rem',
          display: 'flex',
          justifyContent: 'center'
        }
      }
    }
  }
});

// Sub-theme used for the link table that needs padding removed
// with link styles applied
const pokemonBlueLinkTableTheme = createTheme(pokemonBlueTheme, {
  components: {
    MuiTableCell: {
      styleOverrides: {
        body: {
          padding: '0',
          '& a': {
            textDecoration: 'none',
            color: '#000',
            padding: '16px',
            flexGrow: 1
          }
        }
      }
    }
  }
});

export { pokemonBlueTheme, pokemonBlueLinkTableTheme };
