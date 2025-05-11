import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { Toaster } from '@/components/ui/toaster'; // or replace with `sonner`

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* your app components */}

      
    </QueryClientProvider>
  );
}

export default App;
