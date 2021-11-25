import React, { useState } from "react";
import { useRouter } from "next/router";
import useForm from "../hooks/form";
import { signup } from "../services/auth";
import Input from "../components/Input";
import PageError from "../components/PageError";
import styles from "../styles/pages/Signup.module.scss";

const Signup = () => {
  const { form, handleFieldChange } = useForm({
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    username: false,
    password: false,
    passwordConfirm: false,
    name: false,
  });

  const router = useRouter();

  const validateFields = () => {
    // check for required fields
    let valid = true;

    if (
      !form.username ||
      !form.password ||
      !form.passwordConfirm ||
      !form.name
    ) {
      valid = false;
    }

    // passwords must match
    if (form.password !== form.passwordConfirm) {
      valid = false;
      setError("Passwords must match");
    }

    setFormErrors({
      name: form.name === "",
      username: form.username === "",
      password: form.password === "",
      passwordConfirm: form.passwordConfirm === "",
    });

    return valid;
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
      {error !== null && (
        <PageError message={error} closeError={() => setError(null)} />
      )}
      <form className={styles.signup} onSubmit={handleSignup}>
        <Input
          type="text"
          label="Name"
          htmlFor="name"
          className={styles.name}
          value={form.name}
          onChange={handleFieldChange}
          maxLength={255}
          error={formErrors.name}
          errorMessage="Name is required"
        />
        <Input
          type="text"
          label="Username"
          htmlFor="username"
          className={styles.username}
          value={form.username}
          onChange={handleFieldChange}
          maxLength={32}
          error={formErrors.username}
          errorMessage="Username is required"
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
          error={formErrors.password}
          errorMessage="Password is required"
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
          error={formErrors.passwordConfirm}
          errorMessage="Please confirm your password"
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
          ></textarea>
        </Input>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          Sign Up
        </button>
      </form>
    </>
  );
};

export default Signup;
