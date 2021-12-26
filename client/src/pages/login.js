import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useForm from "../hooks/form";
import { login } from "../services/auth";
import { useAuth } from "../context/auth";
import withAuth from "../hocs/withAuth";
import Input from "../components/Input";
import PageError from "../components/PageError";
import styles from "../styles/pages/Login.module.scss";

const Login = () => {
  const { loginUser } = useAuth();
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
      const res = await login(form.username, form.password);
      loginUser(res.data.user);
      router.push("/");
    } catch (e) {
      setError(e.response.data.error || "Unable to log in. Please try again");
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
        <PageError
          message={error}
          closeError={() => setError(null)}
          className={styles.error}
        />
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
          <a href="/signup">Sign up here.</a>
        </Link>
      </p>
    </form>
  );
};

export default withAuth(Login, "/", false);
