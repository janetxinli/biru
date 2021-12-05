import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { extractToken } from "../utils/extractToken";
import useForm from "../hooks/form";
import { login } from "../services/auth";
import Input from "../components/Input";
import PageError from "../components/PageError";
import styles from "../styles/pages/Login.module.scss";

const Login = () => {
  const router = useRouter();

  const { form, handleFieldChange } = useForm({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(form.username, form.password);
      router.push("/");
    } catch (e) {
      setError(e.response.data.error || "Unable to log in. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={`df df-fc df-ai-s df-jc-c ${styles.login}`}
      onSubmit={handleLogin}
    >
      <h2>Login</h2>
      {error !== null && (
        <PageError message={error} closeError={() => setError(null)} className={styles.error} />
      )}
      <Input
        type="text"
        label="Username"
        htmlFor="username"
        value={form.username}
        onChange={handleFieldChange}
      />
      <Input
        type="password"
        label="Password"
        htmlFor="password"
        value={form.password}
        onChange={handleFieldChange}
      />
      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading || form.username === "" || form.password === ""}
      >
        Log In
      </button>
      <p className="text-center">
        New to biru?{" "}
        <Link href="/signup">
          <a>Sign up here.</a>
        </Link>
      </p>
    </form>
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
