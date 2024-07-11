import { createTheme } from '@mui/material/styles';

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
          display: 'flex',
          padding: '0',
          '& a': {
            textDecoration: 'none',
            color: '#000',
            padding: '16px',
            flexGrow: 1
          }
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

export default pokemonBlueTheme;
