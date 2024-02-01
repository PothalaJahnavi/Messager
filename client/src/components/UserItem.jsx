import React from "react";
import { RxAvatar } from "react-icons/rx";
const UserItem = ({ user, handleFunction }) => {
  return (
    <div
      className="card p-2 mt-2 user-card rounded"
      style={{
        cursor: "pointer",
        backgroundColor: "aliceblue",
        border: "none",
      }}
      onClick={handleFunction}
    >
      <div className="d-flex flex-row align-items-center">
        <div className="avatar justify-content-center">
          <RxAvatar size={50} />
        </div>
        <div className="ml-3">
          <h6 className="mt-2 mb-0">{user.name}</h6>
          <p className="mb-0">
            <b>Email:</b> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
