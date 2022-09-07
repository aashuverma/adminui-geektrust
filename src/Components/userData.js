import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "./userData.css";

const UserData = ({
  userData,
  handleDelete,
  handleIsEdited,
  handleIsCheckedSingle,
  editObj,
  handleEditObj,
  handleSaveEdited,
  handleCancelEdited,
}) => {
  return userData.map((user) => {
    return (
      <tr
        key={user.id}
        style={{
          height: "44px",
          backgroundColor: user.isChecked ? "#f0f0f5" : "",
        }}
      >
        {user.isEdited ? (
          <>
            <td>
              <div className="inputCheckcontainer">
                <input
                  type="checkbox"
                  id={`edit-checkbox${user.id}`}
                  style={{ width: "16px", height: "16px" }}
                  className="checkboxinput"
                />
                <label htmlFor={`edit-checkbox${user.id}`}></label>
              </div>
            </td>
            <td>
              <input
                type="text"
                value={editObj.name}
                onChange={(event) =>
                  handleEditObj({ ...editObj, name: event.target.value })
                }
                placeholder="Enter your name"
                className="editname"
              />
            </td>
            <td>
              <input
                type="email"
                value={editObj.email}
                onChange={(event) =>
                  handleEditObj({ ...editObj, email: event.target.value })
                }
                placeholder="Enter your email"
                className="editemail"
              />
            </td>
            <td>
              <input
                type="text"
                value={editObj.role}
                onChange={(event) =>
                  handleEditObj({ ...editObj, role: event.target.value })
                }
                placeholder="Enter your role"
                className="editrole"
              />
            </td>
            <td>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button
                  type="button"
                  className="savebutton"
                  onClick={() => handleSaveEdited(user.id)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cancelbutton"
                  onClick={() => handleCancelEdited(user.id)}
                >
                  Cancel
                </button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td>
              <div className="inputCheckcontainer">
                <input
                  type="checkbox"
                  id={`checkbox${user.id}`}
                  className="checkbox"
                  value={user.isChecked}
                  checked={user.isChecked}
                  onChange={() => handleIsCheckedSingle(user.id)}
                />
                <label htmlFor={`checkbox${user.id}`}></label>
              </div>
            </td>
            <td style={{ textTransform: "capitalize" }}>{user.name}</td>
            <td>{user.email}</td>
            <td style={{ textTransform: "capitalize" }}>{user.role}</td>
            <td className="mobileaction">
              <EditOutlinedIcon
                sx={{ cursor: "pointer" }}
                onClick={() => handleIsEdited(user.id)}
              />
              <DeleteOutlineIcon
                variant="outlined"
                sx={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDelete(user.id)}
              />
            </td>
          </>
        )}
      </tr>
    );
  });
};

export default UserData;
