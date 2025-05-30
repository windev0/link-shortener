// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { RoutesEnum } from "./router";
import { isLoggedIn } from "../utils/functions";

interface ProtectedRouteProps {
  isAllowed?: boolean;
  redirectTo?: string;
  children: React.ReactNode;
}
interface ElementsProps {
  route1: string;
  route2: string;
}

export default function ProtectedRoute({
  redirectTo = RoutesEnum.LOGIN,
  children,
}: ProtectedRouteProps) {
  const isAllowed = isLoggedIn();
  console.log(isAllowed, "isAllowed in ProtectedRoute");
  return isAllowed ? <>{children}</> : <Navigate to={redirectTo} replace />;
}

export function NaviagateToElement({ route1, route2 }: ElementsProps) {
  const isAllowed = isLoggedIn();
  console.log(isAllowed, "isAllowed in NaviagateToElement");
  return <Navigate to={isAllowed ? route1 : route2} replace />;
}
