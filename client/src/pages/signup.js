import React, { useState } from "react";
import { useRouter } from "next/router";
import useForm from "../hooks/form";
import withAuth from "../hocs/withAuth";
import Input from "../components/Input";
import PageError from "../components/PageError";
import { signup } from "../services/auth";
import styles from "../styles/pages/Signup.module.scss";

const Signup = () => {
  const router = useRouter();

  // form field data state
  const { form, handleFieldChange, setFormProperty } = useForm({
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    bio: "",
  });

  // form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    username: null,
    password: null,
    passwordConfirm: null,
    name: null,
  });

  const validateFields = () => {
    // passwords must match
    if (form.password !== form.passwordConfirm) {
      setError("Passwords must match");
    }

    const errors = {
      name: form.name === "" ? "Name is required" : null,
      username: form.username === null ? "Username is required" : null,
      password: form.password === null ? "Password is required" : null,
      passwordConfirm:
        form.passwordConfirm === null ? "Please confirm your password" : null,
    };

    setFormErrors(errors);

    let validity = true;
    for (const v of Object.values(errors)) {
      if (v !== null) {
        validity = false;
        break;
      }
    }

    return validity;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    const valid = validateFields();
    if (!valid) return;

    setLoading(true);

    try {
      await signup(form.username, form.password, form.name, form.bio);
      router.push("/login");
    } catch (e) {
      if (e.response.data.error === "Username taken") {
        setError("Username is already taken");
      } else {
        setError("Unable to sign up. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className={styles.welcome}>Welcome to biru!</h2>
      <form className={styles.signup} onSubmit={handleSignup}>
        {error !== null && (
          <PageError
            message={error}
            closeError={() => setError(null)}
            className={styles.error}
          />
        )}
        <Input
          type="text"
          label="Name"
          htmlFor="name"
          className={styles.name}
          value={form.name}
          onChange={handleFieldChange}
          maxLength={255}
          errorMessage={formErrors.name}
        />
        <Input
          type="text"
          label="Username"
          htmlFor="username"
          className={styles.username}
          value={form.username}
          onChange={handleFieldChange}
          maxLength={32}
          errorMessage={formErrors.username}
        />
        <Input
          type="password"
          label="Password"
          htmlFor="password"
          className={styles.password}
          value={form.password}
          onChange={handleFieldChange}
          autoComplete="new-password"
          maxLength={255}
          errorMessage={formErrors.password}
        />
        <Input
          type="password"
          label="Confirm Password"
          htmlFor="passwordConfirm"
          className={styles.passwordConfirm}
          value={form.passwordConfirm}
          onChange={handleFieldChange}
          autoComplete="new-password"
          maxLength={255}
          errorMessage={formErrors.passwordConfirm}
        />
        <Input
          label="Bio"
          htmlFor="bio"
          className={styles.bio}
          onChange={handleFieldChange}
          infoLabel="optional"
        >
          <textarea
            id="bio"
            value={form.bio}
            onChange={handleFieldChange}
            maxLength={255}
          />
        </Input>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          Sign Up
        </button>
      </form>
    </>
  );
};

export default withAuth(Signup, "/", false);
