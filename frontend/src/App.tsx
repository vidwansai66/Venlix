import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { DemoProvider } from './contexts/DemoContext';

function App() {
  return (
    <DemoProvider>
      <RouterProvider router={router} />
    </DemoProvider>
  );
}

export default App;
