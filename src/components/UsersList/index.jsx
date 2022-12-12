import { useEffect, useMemo, useReducer } from "react";
import usersReducer from "./store";
import http from "@/helpers/http";
import "./styles.scss";

const fields = [
  {
    key: "name",
    text: "Name",
  },
  {
    key: "email",
    text: "Email",
  },
  {
    key: "role",
    text: "Role",
  },
  {
    key: "actions",
    text: "Action",
  },
];

const initialState = {
  currentPage: 0,
  pageSize: 10,
  isGlobalCheckboxSelected: false,
};

const UserList = ({ dataUri, searchText }) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  const { users, pageSize, currentPage, isGlobalCheckboxSelected } = state;

  const allPages = [];
  const searchTextInLowerCase = searchText?.toLowerCase();

  const filteredUsers = users?.filter((user) => {
    for (let i = 0; i < fields?.length; i++) {
      if (user[fields[i].key]?.toLowerCase().includes(searchTextInLowerCase)) {
        return true;
      }
    }
    return false;
  });

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers?.length / pageSize);
  }, [filteredUsers, pageSize]);

  const currentChunk = useMemo(() => {
    if (!filteredUsers) {
      return [];
    }
    return filteredUsers?.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize
    );
  }, [filteredUsers, currentPage]);

  const isCurrentPageTheFirstPage = currentPage === 0;
  const isCurrentPageTheLastPage = currentPage === totalPages - 1;
  const isCheckboxSelected = filteredUsers?.find((user) => user.checked);
  for (let i = 1; i <= totalPages; i++) {
    allPages.push(i);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const users = await http(dataUri);
    setUsers(users);
  }

  function gotoTheFirstPage() {
    dispatch({
      type: "setCurrentPage",
      payload: 0,
    });
    unselectTheSelectedRows();
  }

  function gotoThePreviousPage() {
    dispatch({
      type: "setCurrentPage",
      payload: Math.max(0, currentPage - 1),
    });
    unselectTheSelectedRows();
  }

  function gotoTheNextPage() {
    dispatch({
      type: "setCurrentPage",
      payload: Math.min(currentPage + 1, totalPages - 1),
    });
    unselectTheSelectedRows();
  }

  function gotoTheLastPage() {
    dispatch({
      type: "setCurrentPage",
      payload: totalPages - 1,
    });
    unselectTheSelectedRows();
  }

  function gotoPageNo(page) {
    dispatch({
      type: "setCurrentPage",
      payload: page - 1,
    });
    unselectTheSelectedRows();
  }

  function unselectTheSelectedRows() {
    const newUsers = users.map((user) => ({
      ...user,
      checked: false,
    }));

    setUsers(newUsers);

    dispatch({
      type: "toggleGlobalCheckbox",
      payload: false,
    });
  }

  function handleGlobalCheckboxChange(e) {
    const isChecked = e.target.checked;

    const newUsers = users.map((user, index) => {
      if (
        isChecked &&
        index >= currentPage * 10 &&
        index < (currentPage + 1) * 10
      ) {
        return {
          ...user,
          checked: true,
        };
      } else {
        return { ...user, checked: false };
      }
    });

    setUsers(newUsers);

    dispatch({
      type: "toggleGlobalCheckbox",
      payload: isChecked,
    });
  }

  function handleCheckboxChange(id) {
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          checked: !user.checked,
        };
      }
      return user;
    });

    setUsers(newUsers);
  }

  function handleUserDelete(id) {
    const newUsers = users.filter((user) => user.id !== id);
    setUsers(newUsers);
  }

  function handleUserEdit(id) {
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          isEditing: !user.isEditing,
        };
      }
      return user;
    });

    setUsers(newUsers);
  }

  function deleteSelected() {
    const newUsers = users.filter((user) => !user.checked);
    setUsers(newUsers);

    dispatch({
      type: "toggleGlobalCheckbox",
      payload: false,
    });
  }

  function handleFieldChange(id, field, value) {
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          [field]: value,
        };
      }
      return user;
    });

    setUsers(newUsers);
  }

  function setUsers(newUsers) {
    dispatch({
      type: "setUsers",
      payload: newUsers,
    });
  }

  if (!users) {
    return (
      <div className="progress">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated w-100"
          role="progressbar"
          aria-label="Animated striped example"
        ></div>
      </div>
    );
  }

  return (
    <div className="my-4">
      <table className="users-table">
        <thead>
          <tr>
            <th className="ps-3">
              <input
                type="checkbox"
                checked={isGlobalCheckboxSelected}
                onChange={handleGlobalCheckboxChange}
              />
            </th>
            {fields.map((field) => (
              <th key={field.key}>{field.text}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentChunk.map((user) => (
            <tr key={`row${user.id}`}>
              <td className="ps-3">
                <input
                  type="checkbox"
                  checked={user.checked ?? false}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              {fields.map((field) => (
                <td key={`cell${field.key}${user.id}`}>
                  {field.key === "actions" ? (
                    <>
                      <TrashIcon
                        className="me-4 text-danger"
                        onClick={() => handleUserDelete(user.id)}
                      />
                      <EditIcon
                        className="text-primary"
                        onClick={() => handleUserEdit(user.id)}
                      />
                    </>
                  ) : user.isEditing ? (
                    <input
                      value={user[field.key]}
                      onInput={(e) =>
                        handleFieldChange(user.id, field.key, e.target.value)
                      }
                    />
                  ) : (
                    user[field.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="actions-container my-5">
        <button
          className="delete-all btn btn-danger"
          disabled={!isCheckboxSelected}
          onClick={deleteSelected}
        >
          Delete Selected
        </button>

        <div className="pagination">
          <button
            className="btn btn-primary mx-2"
            disabled={isCurrentPageTheFirstPage}
            onClick={gotoTheFirstPage}
          >
            &lt;&lt;
          </button>
          <button
            className="btn btn-primary mx-2"
            disabled={isCurrentPageTheFirstPage}
            onClick={gotoThePreviousPage}
          >
            &lt;
          </button>
          {allPages.map((page) => (
            <button
              key={`page${page}`}
              className={`btn mx-2 ${
                page - 1 !== currentPage ? "btn-outline-primary" : "btn-primary"
              }`}
              onClick={() => gotoPageNo(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-primary mx-2"
            disabled={isCurrentPageTheLastPage}
            onClick={gotoTheNextPage}
          >
            &gt;
          </button>
          <button
            className="btn btn-primary mx-2"
            disabled={isCurrentPageTheLastPage}
            onClick={gotoTheLastPage}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

function TrashIcon({ className, onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
    >
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
      <path
        fillRule="evenodd"
        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
      />
    </svg>
  );
}

function EditIcon({ className, onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
    >
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
      <path
        fillRule="evenodd"
        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
      />
    </svg>
  );
}

export default UserList;
