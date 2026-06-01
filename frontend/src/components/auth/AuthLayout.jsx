import { Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
  const location = useLocation();

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex w-1/2 h-screen">
        {location.pathname.includes("/auth/register") ? (
          <img
            src="/images/1.jpeg"
            alt="Logo"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/images/2.jpeg"
            alt="Logo"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
