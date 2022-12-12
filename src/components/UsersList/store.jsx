export default function (state, action) {
  switch (action.type) {
    case "setUsers": {
      return {
        ...state,
        users: action.payload,
      };
    }
    case "setTotalPages": {
      return {
        ...state,
        totalPages: action.payload,
      };
    }
    case "setCurrentPage": {
      return {
        ...state,
        currentPage: action.payload,
      };
    }
    case "toggleGlobalCheckbox": {
      return {
        ...state,
        isGlobalCheckboxSelected: action.payload,
      };
    }
  }
}
