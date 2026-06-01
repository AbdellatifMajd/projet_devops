import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ user, isAuthenticated, children }) {
  const location = useLocation();

  //Si pas authentifié, rediriger vers login
  if (
    !isAuthenticated &&
    !location.pathname.includes("/auth/login") &&
    !location.pathname.includes("/auth/register")
  ) {
    return <Navigate to="/auth/login" />;
  }

  //Si déjà connecté et essaie d'accéder à login/register
  if (
  isAuthenticated &&
  (location.pathname.includes("/auth/login") ||
    location.pathname.includes("/auth/register"))
) {
  return children;
}


  // protection des routes de l'admin
  if (isAuthenticated && location.pathname.includes("/admin")) {
    if (user?.role !== "admin") {
      return <Navigate to="/unAuth" />;
    }
  }

  return children;
}

export default CheckAuth;
