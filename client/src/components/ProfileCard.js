import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { followUser, unfollowUser } from "../services/user";
import styles from "../styles/components/ProfileCard.module.scss";

const ProfileCard = ({
  profile,
  toggleShowFollowing,
  toggleShowFollowers,
  setError,
}) => {
  const { id, name, username, bio } = profile;
  const imgSrc = "/profilePicDefault.svg";

  // keep in state so value updates on follow/unfollow
  const [numFollowedBy, setNumFollowedBy] = useState(
    parseInt(profile.followedByUsers)
  );
  const [followingStatus, setFollowingStatus] = useState(
    profile.currentUserFollows
  );

  const handleFollowUser = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await followUser(id);
      setNumFollowedBy(numFollowedBy + 1);
      setFollowingStatus(!followingStatus);
    } catch (error) {
      setError("Cannot follow user right now");
    }
  };

  const handleUnfollowUser = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await unfollowUser(id);
      setNumFollowedBy(numFollowedBy - 1);
      setFollowingStatus(!followingStatus);
    } catch (error) {
      setError("Cannot unfollow user right now");
    }
  };

  let followAction;

  if (followingStatus === undefined) {
    // on authorized user's own profile
    followAction = null;
  } else if (followingStatus) {
    // authorized user follows this user
    followAction = (
      <button
        type="submit"
        className="btn btn-secondary"
        onClick={handleUnfollowUser}
      >
        unfollow
      </button>
    );
  } else {
    followAction = (
      // authorized user does not follow this user
      <button
        type="submit"
        className="btn btn-primary"
        onClick={handleFollowUser}
      >
        follow
      </button>
    );
  }

  return (
    <article className={`df ${styles.profileCard}`}>
      <img src={imgSrc} alt={`${name}'s avatar`} />
      <div className={`df df-fc df-jc-sb ${styles.userInfo}`}>
        <h2>{name}</h2>
        <p className={styles.username}>{username}</p>
        <p>{bio || <br />}</p>
        <div className={`df df-ai-c ${styles.following}`}>
          <button
            type="button"
            className="btn btn-text"
            disabled={profile.followingUsers === "0"}
            onClick={toggleShowFollowing}
          >
            <strong>{profile.followingUsers || "0"}</strong> following
          </button>
          <FavoriteBorderIcon fontSize="sm" />
          <button
            type="button"
            className="btn btn-text"
            disabled={numFollowedBy === 0}
            onClick={toggleShowFollowers}
          >
            <strong>{numFollowedBy}</strong> followers
          </button>
          {followAction}
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;
