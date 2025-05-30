import "./App.css";
import { RoutesEnum } from "./configs/router";
import LoginPage from "./pages/login.page";
import URLShortenerForm from "./pages/UrlShortener.page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { isLoggedIn } from "./utils/functions";
import ProtectedRoute, { NaviagateToElement } from "./configs/protectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirection initiale */}
        <Route
          path={RoutesEnum.HOME}
          element={
            <NaviagateToElement
              route1={RoutesEnum.URL_SHORTENER}
              route2={RoutesEnum.LOGIN}
            />
          }
        />

        {/* Public routes */}
        <Route path={RoutesEnum.LOGIN} element={<LoginPage />} />
        <Route path={RoutesEnum.REGISTER} element={<h1>Register</h1>} />

        {/* Protected routes */}
        <Route
          path={RoutesEnum.URL_SHORTENER}
          element={
            <ProtectedRoute>
              <URLShortenerForm />
            </ProtectedRoute>
          }
        />
        <Route
          path={RoutesEnum.DASHBOARD}
          element={
            <ProtectedRoute isAllowed={isLoggedIn()}>
              <h1>Dashboard</h1>
            </ProtectedRoute>
          }
        />

        {/* Not found */}
        <Route path={RoutesEnum.NOT_FOUND} element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
