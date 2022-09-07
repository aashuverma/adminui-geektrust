import React, { useState, useEffect } from "react";
import UserData from "./userData";
import Pagination from "./pagination";
import "./userList.css";
import axios from "axios";
import Header from "./header";

// add the isChecked and isEdited to perfrom action on checkbox and  edit user
const IsCheckEdit = (users) => {
  const IscheckedEdited = users.map((user) => {
    return { ...user, isChecked: false, isEdited: false };
  });

  return IscheckedEdited;
};

const isValidInput = (editObj) => {
  if (editObj.name !== "" && editObj.email !== "" && editObj.role !== "") {
    if (editObj.name.length < 5) {
      alert("Name must be at least 5 characters long");
    } else if (!editObj.email.match(/.+@+.+\.[com|in|org]+$/)) {
      alert("Enter a valid email id. Ex: 'example@xmail.com'");
    } else if (
      editObj.role.toLowerCase() === "member" ||
      editObj.role.toLowerCase() === "admin"
    ) {
      return true;
    } else {
      alert(`Role must be "Admin" or "Member"`);
    }
  } else {
    alert("Input fields must be filled out");
  }
  return false;
};

export default function UserList() {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [userperPage, setUserperPage] = useState(10);
  const [debounceTimer, setDebounceTimer] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [editObj, setEditObject] = useState({});
  const [searchText, setSearchText] = useState("");
  const [editFlag, setEditFlag] = useState(false);
  let persistedUserData;

  //Fetch the given Api
  const fetchApi = async () => {
    try {
      let response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const userData = IsCheckEdit(response.data);
      setUserData(userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("currentPage", JSON.stringify(currentPage));
    } catch (error) {
      console.log();
    }
  };

  //Initially to execute the the fetch Api call
  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line
  }, []);

  // handle restore data by calling the api whenever user clicks on restore button
  const handleRestore = () => {
    fetchApi();
    setIsAllChecked(false);
    setSearchText("");
  };

  //handle page number whenever user clicks on page number

  const handlePageNumber = (number) => {
    if (editObj.isEdited) {
      handleCancelEdited(editObj.id);
    }
    setCurrentPage(number);
    localStorage.setItem("currentPage", JSON.stringify(number));
  };

  //paginatiuon logic to get the 10 users per page
  const indexOfLastUser = currentPage * userperPage;
  const indexOfFirstUser = indexOfLastUser - userperPage;
  const currentUserList = userData.slice(indexOfFirstUser, indexOfLastUser);

  //handle delete user by removing the user from user list
  const handleDelete = (userId) => {
    persistedUserData = JSON.parse(localStorage.getItem("userData"));
    const updatedUserData = persistedUserData.filter(
      (user) => user.id !== userId
    );
    setCurrentPage(JSON.parse(localStorage.getItem("currentPage")));
    setUserData(updatedUserData);
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    setSearchText("");
    setEditFlag(false);
  };

  //handle user edit click and set the clicked user data to individual user object

  const handleIsEdited = (userId) => {
    if (!editFlag) {
      const upadatedUserData = userData.map((user) => {
        if (user.id === userId) {
          setEditObject({ ...user, isEdited: true });
          return { ...user, isEdited: true };
        }
        return user;
      });
      setEditFlag(true);
      setUserData(upadatedUserData);
    }
  };

  //handle save to get edited data saved to the actual user data
  const handleSaveEdited = (userId) => {
    if (isValidInput(editObj)) {
      persistedUserData = JSON.parse(localStorage.getItem("userData"));
      const editedUserData = persistedUserData.map((user) => {
        if (user.id === userId) {
          return { ...editObj, isEdited: false };
        }
        return user;
      });
      setCurrentPage(JSON.parse(localStorage.getItem("currentPage")));
      setUserData(editedUserData);
      localStorage.setItem("userData", JSON.stringify(editedUserData));
      setEditObject({});
      setEditFlag(false);
      alert("Saved successfully");
    }
  };

  //handle cancel to store unEdited data
  const handleCancelEdited = (userId) => {
    const unEditedUserData = userData.map((user) => {
      if (user.id === userId) {
        return { ...user, isEdited: false };
      }
      return user;
    });
    setUserData(unEditedUserData);
    setEditObject({});
    setEditFlag(false);
  };

  //search the input text entered by user
  const searchInputText = (text) => {
    console.log(userData, "??????????");
    if (text.length) {
      const searchedUserData = userData.filter((user) => {
        return (
          user.name.toLowerCase() === text.toLowerCase() ||
          user.name.split(" ")[0].toLowerCase() === text.toLowerCase() ||
          user.name.split(" ")[1].toLowerCase() === text.toLowerCase() ||
          user.email.toLowerCase() === text.toLowerCase() ||
          user.email.split("@")[0].toLowerCase() === text.toLowerCase() ||
          user.role.toLowerCase() === text.toLowerCase()
        );
      });

      if (searchedUserData.length) {
        setCurrentPage(1);
        setUserData(searchedUserData);
      } else {
        alert("No user found");
        setSearchText("");
        setUserData(JSON.parse(localStorage.getItem("userData")));
      }
    } else {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  };

  //debounce search to optimize perfromance

  const debounceSearch = (eventInput, debounceTimeOut) => {
    if (debounceTimer !== 0) {
      clearTimeout(debounceTimer);
    }

    const timerId = setTimeout(
      () => searchInputText(eventInput),
      debounceTimeOut
    );
    setDebounceTimer(timerId);
  };

  //handle input text search using debouncing
  const handleSearch = (inputText) => {
    if (editObj.isEdited === true) {
      alert(
        "Can not search while editing. Please save or cancel the edited changes!"
      );
    } else {
      setSearchText(inputText);
      debounceSearch(inputText, 1000);
    }
  };

  //single checkbox selection to select and unselect the user
  const handleIsCheckedSingle = (userId) => {
    const updateIsChecked = userData.map((user) => {
      if (user.id === userId) {
        return { ...user, isChecked: !user.isChecked };
      }
      return user;
    });

    let checkStatus = true;
    for (let check = indexOfFirstUser; check < indexOfLastUser; check++) {
      if (updateIsChecked[check].isChecked !== true) {
        checkStatus = false;
        break;
      }
    }

    setUserData(updateIsChecked);
    setIsAllChecked(checkStatus);
  };

  //handle selection of all checkboxes
  const handleIsAllChecked = () => {
    setIsAllChecked(!isAllChecked);
    let updateAllIsChecked;
    if (!isAllChecked) {
      updateAllIsChecked = userData.map((user, idx) => {
        if (indexOfFirstUser <= idx && indexOfLastUser > idx) {
          return { ...user, isChecked: true };
        }
        return { ...user, isChecked: false };
      });
    } else {
      updateAllIsChecked = userData.map((user, idx) => {
        if (indexOfFirstUser <= idx && indexOfLastUser > idx) {
          return { ...user, isChecked: false };
        }
        return user;
      });
    }
    setUserData(updateAllIsChecked);
  };

  //delete the all selected checkbox on the displyed page only
  const handleDeleteSeleceted = () => {
    if (editObj.isEdited === true) {
      alert("Plase save or cancel the edited changes!");
    } else {
      const afterDeletedUser = userData.filter((user) => {
        return user.isChecked === false;
      });

      setUserData(afterDeletedUser);
      localStorage.setItem("userData", JSON.stringify(afterDeletedUser));
      setIsAllChecked(false);
    }
  };

  return (
    <div>
      <Header
        handleRestore={handleRestore}
        searchText={searchText}
        handleSearch={handleSearch}
      />
      <div className="tablecontainer">
        <table className="userlist">
          <thead className="tablehead">
            <tr>
              <th>
                <div className="inputCheckcontainer">
                  <input
                    type="checkbox"
                    id="checkAll"
                    // style={{ width: "1.5em", height: "1.5em" }}
                    value={isAllChecked}
                    checked={isAllChecked}
                    onChange={handleIsAllChecked}
                  />
                  <label htmlFor="checkAll"></label>
                </div>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <UserData
              userData={currentUserList}
              handleDelete={handleDelete}
              handleIsEdited={handleIsEdited}
              handleIsCheckedSingle={handleIsCheckedSingle}
              editObj={editObj}
              handleEditObj={setEditObject}
              handleSaveEdited={handleSaveEdited}
              handleCancelEdited={handleCancelEdited}
            />
          </tbody>
        </table>
      </div>
      <div className="selectionrow">
        <button
          type="button"
          className="deletebutton"
          onClick={handleDeleteSeleceted}
        >
          Delete Selected
        </button>
        <Pagination
          userPerPage={userperPage}
          totalUser={userData.length}
          handlePageNumber={handlePageNumber}
        />
        <div>
          {currentPage} of {Math.ceil(userData.length / userperPage)}
        </div>
      </div>
    </div>
  );
}
