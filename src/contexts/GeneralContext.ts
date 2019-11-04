import Usuario from "../types/usuario";
import { createContext } from "react";

export interface GeneralState {
  isSignedIn: boolean,
  user?: Usuario,
  title: string,
  theme?: string,
  signIn?: (user: Usuario) => void,
  signOut?: () => void,
  changeTitle?: (title: string) => void,
  changeTheme?: (theme: string) => void,
};

export const InitialGeneralState = {
  isSignedIn: false,
  title: 'RestaurApp',
  theme: 'dark',
};

export const GeneralContext = createContext<GeneralState>(InitialGeneralState);

export const GeneralProvider = GeneralContext.Provider;