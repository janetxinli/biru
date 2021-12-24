import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import UserOverview from "./UserOverview";
import styles from "../styles/components/UserListPopup.module.scss";

const UserListPopup = ({ title, userList, accessor, toggleVisible }) => (
  <div className={styles.overlay}>
    <article className={styles.userList}>
      <div className="df df-ai-c df-jc-sb">
        <h3>{title}</h3>
        <button type="button" className="btn btn-icon" onClick={toggleVisible}>
          <CloseIcon />
        </button>
      </div>

      {userList.map((u) => (
        <UserOverview
          key={u.id}
          user={{
            username: u[accessor].username,
            name: u[accessor].name,
          }}
        />
      ))}
    </article>
  </div>
);

export default UserListPopup;
