import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { followUser, unfollowUser, editUser } from "../services/user";
import useForm from "../hooks/form";
import ImageCropAndUpload from "./ImageCropAndUpload";
import Input from "./Input";
import styles from "../styles/components/ProfileCard.module.scss";

const ProfileCard = ({
  profile,
  toggleShowFollowing,
  toggleShowFollowers,
  setError,
}) => {
  const { id } = profile;
  const defaultImg = "/profilePicDefault.svg";

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // following info
  // keep in state so value updates on follow/unfollow/edit
  const [profileData, setProfileData] = useState({
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    imageUrl: profile.imageUrl,
  });
  const [numFollowedBy, setNumFollowedBy] = useState(
    parseInt(profile.followedByUsers)
  );
  const [followingStatus, setFollowingStatus] = useState(
    profile.currentUserFollows
  );

  // form values
  const { form, handleFieldChange, setFormProperty } = useForm({
    name: profile.name,
    bio: profile.bio,
    imageUrl: profile.imageUrl,
  });
  const [formErrors, setFormErrors] = useState({
    name: null,
    imageUrl: null,
  });

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

  const toggleEditMode = (e) => {
    e.preventDefault();
    setEditMode(!editMode);
  };

  // buttons
  let action;
  if (followingStatus === undefined) {
    // on authorized user's own profile
    action = (
      <button
        type="submit"
        className="btn btn-primary"
        onClick={toggleEditMode}
      >
        edit
      </button>
    );
  } else if (followingStatus) {
    // authorized user follows this user
    action = (
      <button
        type="submit"
        className="btn btn-secondary"
        onClick={handleUnfollowUser}
      >
        unfollow
      </button>
    );
  } else {
    action = (
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

  // editing
  const setImage = (url) => {
    setFormProperty("imageUrl", url);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (form.name === "") {
      setFormErrors({ ...formErrors, name: "Required" });
      return;
    }

    setLoading(true);

    try {
      const res = await editUser(id, form.imageUrl, form.name, form.bio);
      setProfileData(res.data.payload);
      setEditMode(!editMode);
    } catch (e) {
      setError("Unable to edit user details. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <>
      {editMode ? (
        <ImageCropAndUpload
          onComplete={setImage}
          className={styles.profileImg}
          errorMessage={formErrors.imageUrl}
          setError={(e) => setFormErrors({ ...formErrors, imageUrl: e })}
          initialImage={form.imageUrl}
          placeholder="/profilePicDefault.svg"
        />
      ) : (
        <img
          src={profileData.imageUrl || defaultImg}
          className={styles.profileImg}
          alt={`${profileData.name}'s avatar`}
        />
      )}
      <div className={`df df-fc ${styles.userInfo}`}>
        {editMode ? (
          <>
            <Input
              type="text"
              label="Name"
              htmlFor="name"
              value={form.name}
              maxLength={255}
              handleChange={handleFieldChange}
              errorMessage={formErrors.name}
            />
            <Input
              label="Bio"
              htmlFor="bio"
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
          </>
        ) : (
          <>
            <h2>{profileData.name}</h2>
            <p className={styles.username}>{profileData.username}</p>
            <p>{profileData.bio || <br />}</p>
          </>
        )}
        {editMode ? (
          <div className={`df ${styles.padItems}`}>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleEdit}
              disabled={loading}
            >
              save
            </button>
            <button
              type="submit"
              className="btn btn-secondary"
              onClick={toggleEditMode}
            >
              cancel
            </button>
          </div>
        ) : (
          <div className={`df df-ai-c df-jc-sb ${styles.details}`}>
            <div className={`df df-ai-c ${styles.padItems}`}>
              <button
                type="button"
                className="btn btn-text"
                disabled={profile.followingUsers === 0}
                onClick={toggleShowFollowing}
              >
                <strong>{profile.followingUsers || 0}</strong> following
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
            </div>
            {action}
          </div>
        )}
      </div>
    </>
  );

  if (editMode) {
    return <form className={`df ${styles.profileCard}`}>{content}</form>;
  }

  return <article className={`df ${styles.profileCard}`}>{content}</article>;
};

export default ProfileCard;
