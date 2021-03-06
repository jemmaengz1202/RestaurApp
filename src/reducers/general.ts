import { GeneralState, snackbarVariant } from "./../contexts/GeneralContext";
import Usuario from "../types/usuario";

export const generalReducer = (
  state: GeneralState,
  action: any
): GeneralState => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        isSignedIn: true,
        user: action.payload.user,
      };
    case "SIGN_OUT":
      return {
        ...state,
        isSignedIn: false,
        user: undefined,
      };
    case "CHANGE_TITLE":
      return {
        ...state,
        title: action.payload.title,
      };
    case "CHANGE_THEME":
      const theme = state.theme === "dark" ? "light" : "dark";
      return {
        ...state,
        theme,
      };
    case "CHANGE_SEARCH":
      return {
        ...state,
        search: action.payload.search,
      };
    case "OPEN_SNACKBAR":
      return {
        ...state,
        snackbarMessage: action.payload.message,
        snackbarVariant: action.payload.variant,
        snackbarOpen: true,
      };
    case "CLOSE_SNACKBAR":
      return {
        ...state,
        snackbarMessage: "",
        snackbarOpen: false,
      };
  }
  return state;
};

export const signInAction = (user: Usuario) => {
  return {
    type: "SIGN_IN",
    payload: {
      user,
    },
  };
};

export const signOutAction = () => {
  return {
    type: "SIGN_OUT",
  };
};

export const changeTitleAction = (title: string) => {
  return {
    type: "CHANGE_TITLE",
    payload: {
      title,
    },
  };
};

export const changeThemeAction = () => {
  return {
    type: "CHANGE_THEME",
  };
};

export const changeSearchAction = (search: string) => {
  return {
    type: "CHANGE_SEARCH",
    payload: {
      search,
    },
  };
};

export const openSnackbarAction = (
  message: string,
  variant: snackbarVariant = "success"
) => {
  return {
    type: "OPEN_SNACKBAR",
    payload: {
      message,
      variant,
    },
  };
};

export const closeSnackbarAction = () => {
  return {
    type: "CLOSE_SNACKBAR",
  };
};
