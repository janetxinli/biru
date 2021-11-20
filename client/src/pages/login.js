import React, { useState } from "react";
import { useRouter } from "next/router";
import { extractToken } from "../utils/extractToken";
import { useForm } from "../hooks/form";
import { login } from "../services/auth";

const Login = () => {
  const router = useRouter();

  const { form, handleFieldChange } = useForm({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.username, form.password);
      router.push("/");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label htmlFor="username">
          <p className="df df-jc-sb df-ai-c">Username</p>
          <input
            id="username"
            type="text"
            value={form.username}
            onChange={handleFieldChange}
          />
        </label>
        <label htmlFor="password">
          <p className="df df-jc-sb df-ai-c">Password</p>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={handleFieldChange}
          />
        </label>
        <button
          className="btn btn-primary"
          type="submit"
          onClick={handleLogin}
          disabled={loading}
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps = (ctx) => {
  const token = extractToken(ctx);

  // redirect to index if user is logged in
  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Login;
