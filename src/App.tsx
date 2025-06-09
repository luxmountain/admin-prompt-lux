import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import routes from "./router"; // Import route configuration
import ProtectedRoute from "./ProtectedRoute"; // ProtectedRoute component
import Layout from "@/app/layout";
import { IRoute } from "./types/IRoute";

const renderRoutes = (
  routes: IRoute[],
  parentPath: string = ""
): React.ReactNode[] => {
  return routes.flatMap(
    ({ path, element: Element, protected: isProtected, children }) => {
      const fullPath = `${parentPath}/${path}`.replace(/\/+/g, "/"); // Resolve full path
      
      if (!Element) return [];

      const RouteElement = isProtected ? (
        <ProtectedRoute>
          <Layout>
            <Element />
          </Layout>
        </ProtectedRoute>
      ) : (
        <Element />
      );

      const route = (
        <Route key={fullPath} path={fullPath} element={RouteElement} />
      );

      const childRoutes = children ? renderRoutes(children, fullPath) : [];
      return [route, ...childRoutes];
    }
  );
};

const App: React.FC = () => {
  const allRoutes = renderRoutes(routes);

  return (
    <Router>
      <Routes>
        {allRoutes}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
