import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/auth";

// redirect based on authentication status
const withAuth = (
  WrappedComponent,
  redirectPath = "/login",
  expectedStatus = true
) => {
  const AuthRedirectWrapper = (props) => {
    const router = useRouter();
    const { authenticated } = useAuth();

    if (authenticated !== expectedStatus) {
      router.push(redirectPath);
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthRedirectWrapper;
};

export default withAuth;
