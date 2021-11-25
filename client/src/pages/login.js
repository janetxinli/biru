import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { extractToken } from "../utils/extractToken";
import useForm from "../hooks/form";
import { login } from "../services/auth";
import Input from "../components/Input";
import styles from "../styles/pages/Login.module.scss";

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
    <form className={`df df-fc df-ai-s df-jc-c ${styles.login}`}>
      <h2>Login</h2>
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
        onClick={handleLogin}
        disabled={loading}
      >
        Log In
      </button>
      <p className={styles.signup}>
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
