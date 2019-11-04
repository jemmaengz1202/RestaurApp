import { signInAction, signOutAction, changeTitleAction, changeThemeAction } from './../reducers/general';
import Usuario from "../types/usuario";
import { createContext } from "react";

export interface GeneralState {
  isSignedIn: boolean,
  user?: Usuario,
  title: string,
  theme?: string,
  signIn: (user: Usuario) => void,
  signOut: () => void,
  changeTitle: (title: string) => void,
  changeTheme: (theme: string) => void,
};

export const InitialGeneralState = {
  isSignedIn: false,
  title: 'RestaurApp',
  theme: 'dark',
  signIn: signInAction,
  signOut: signOutAction,
  changeTitle: changeTitleAction,
  changeTheme: changeThemeAction,
};

export const GeneralContext = createContext<GeneralState>(InitialGeneralState);

export const GeneralProvider = GeneralContext.Provider;