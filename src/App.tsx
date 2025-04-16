import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Import your theme
import routes from './router'; // Import route configuration
import ProtectedRoute from './ProtectedRoute'; // ProtectedRoute component

const renderRoutes = (routes: any[], parentPath: string = ''): React.ReactNode[] => {
  return routes.flatMap(({ path, element: Element, protected: isProtected, label, icon, children }) => {
    const fullPath = `${parentPath}/${path}`.replace(/\/+/g, '/'); // Resolve full path

    const RouteElement = isProtected
      ? <ProtectedRoute component={Element} label={label} icon={icon} />
      : <Element />;

    const route = <Route key={fullPath} path={fullPath} element={RouteElement} />;

    const childRoutes = children ? renderRoutes(children, fullPath) : [];
    return [route, ...childRoutes];
  });
};

const App: React.FC = () => {
  const allRoutes = renderRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {allRoutes}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
