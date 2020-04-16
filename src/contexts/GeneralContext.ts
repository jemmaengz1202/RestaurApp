import {
  signInAction,
  signOutAction,
  changeTitleAction,
  changeThemeAction,
  changeSearchAction,
  openSnackbarAction,
  closeSnackbarAction,
} from "./../reducers/general";
import Usuario from "../types/usuario";
import { createContext } from "react";

export type snackbarVariant = "success" | "warning" | "error" | "info";

export interface GeneralState {
  isSignedIn: boolean;
  user?: Usuario;
  title: string;
  theme?: string;
  search?: string;
  snackbarMessage?: string;
  snackbarOpen?: boolean;
  snackbarVariant?: snackbarVariant;
  openSnackbar: (message: string, variant?: snackbarVariant) => void;
  closeSnackbar: () => void;
  signIn: (user: Usuario) => void;
  signOut: () => void;
  changeTitle: (title: string) => void;
  changeTheme: (theme: string) => void;
  changeSearch: (search: string) => void;
}

export const InitialGeneralState = {
  isSignedIn: false,
  title: "RestaurApp",
  theme: "dark",
  snackbarOpen: false,
  signIn: signInAction,
  signOut: signOutAction,
  changeTitle: changeTitleAction,
  changeTheme: changeThemeAction,
  changeSearch: changeSearchAction,
  openSnackbar: openSnackbarAction,
  closeSnackbar: closeSnackbarAction,
};

export const GeneralContext = createContext<GeneralState>(InitialGeneralState);

export const GeneralProvider = GeneralContext.Provider;
