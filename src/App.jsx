import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTheme } from './hooks/useTheme';
import createAppRouter from './routes';

export default function App() {
  const { isDark, toggle } = useTheme();
  const router = createAppRouter(isDark, toggle);

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
