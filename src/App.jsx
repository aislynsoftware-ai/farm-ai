import { RouterProvider } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import createAppRouter from './routes';

export default function App() {
  const { isDark, toggle } = useTheme();
  const router = createAppRouter(isDark, toggle);

  return <RouterProvider router={router} />;
}
