import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@emotion/react';
import PokemonList from './PokemonList/PokemonList';
import { pokemonBlueTheme } from './pokemonBlueTheme';
import PokemonView from './PokemonList/PokemonView/PokemonView';

const queryClient = new QueryClient();

const App = (): React.ReactNode => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={pokemonBlueTheme}>
        <Router>
          <Routes>
            <Route path='/' element={<PokemonList />} />
            <Route path='/pokemon/:id' element={<PokemonView />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
