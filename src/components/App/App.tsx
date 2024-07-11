import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@emotion/react';
import PokemonList from './PokemonList/PokemonList';
import pokemonBlueTheme from './pokemonBlueTheme';

const queryClient = new QueryClient();

const App = (): React.ReactNode => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={pokemonBlueTheme}>
        <PokemonList />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
