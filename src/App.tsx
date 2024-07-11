import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

const queryClient = new QueryClient();

const App = (): React.ReactNode => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>POKEMONS!!</div>
    </QueryClientProvider>
  );
};

export default App;
