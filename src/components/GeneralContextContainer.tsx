import React, { ReactNode, useCallback, useReducer } from 'react';
import { GeneralProvider, InitialGeneralState } from '../contexts/GeneralContext';
import { changeThemeAction, changeTitleAction, generalReducer, signInAction, signOutAction, changeSearchAction } from '../reducers/general';
import Usuario from '../types/usuario';

type GeneralContextContainerProps = {
  children: ReactNode,
};

export const GeneralContextContainer = ({ children }: GeneralContextContainerProps) => {
  const [state, dispatch] = useReducer(generalReducer, InitialGeneralState);

  const signIn = useCallback((user: Usuario) => {
    dispatch(signInAction(user));
  }, []);

  const signOut = useCallback(() => {
    dispatch(signOutAction());
  }, []);

  const changeTitle = useCallback((title: string) => {
    dispatch(changeTitleAction(title));
  }, []);

  const changeTheme = useCallback(() => {
    dispatch(changeThemeAction());
  }, []);

  const changeSearch = useCallback((search: string) => {
    dispatch(changeSearchAction(search));
  }, []);

  return (
    <GeneralProvider 
      value={{ ...state, signIn, signOut, changeTitle, changeTheme, changeSearch }}>
        { children }
    </GeneralProvider>
  );
};