import React, { useState } from "react";
import PageError from "../components/PageError";
import Input from "../components/Input";
import UserOverview from "../components/UserOverview";
import withAuth from "../hocs/withAuth";
import { searchUsers } from "../services/user";
import styles from "../styles/pages/Search.module.scss";

const Search = () => {
  const [query, setQuery] = useState("");
  const [userList, setUserList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await searchUsers(query);
      setUserList(res.data.payload);
    } catch (err) {
      setError("Cannot search users right now");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setQuery("");
    setUserList(null);
  };

  let content;
  if (query === "") {
    content = null;
  } else if (userList) {
    if (!userList.length) {
      content = <p>No users match your search</p>;
    } else {
      content = userList.map((u) => <UserOverview key={u.username} user={u} />);
    }
  }

  return (
    <>
      <h2 className="text-center">Search Users</h2>
      {error !== null && (
        <PageError message={error} closeError={() => setError(null)} />
      )}
      <form
        className={`df df-ai-c df-jc-s ${styles.searchForm}`}
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          htmlFor="searchUsers"
          value={query}
          handleChange={handleQueryChange}
          placeholder="Search by username"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || query === ""}
        >
          Search
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClear}
        >
          Clear
        </button>
      </form>
      <section className={styles.results}>{content}</section>
    </>
  );
};

export default withAuth(Search);
