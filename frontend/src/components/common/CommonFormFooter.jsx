import { Link, useLocation } from "react-router";

function CommonFormFooter() {
  const location = useLocation();
  return (
    <div>
      <p className="mt-6 text-center text-gray-400">
        Don't have an account?
        {location.pathname.includes("/auth/login") ? (
          <Link
            to="/auth/register"
            className="text-gray-900 font-semibold hover:underline underline-offset-2 ml-1"
          >
            Sign up
          </Link>
        ) : (
          <Link
            to="/auth/login"
            className="text-gray-900 font-semibold hover:underline underline-offset-2 ml-1"
          >
            Sign in
          </Link>
        )}
      </p>
    </div>
  );
}

export default CommonFormFooter;
