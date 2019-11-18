import React from 'react';
import { AppRouter } from './AppRouter';
import WithTheme from './components/WithTheme';
import { darkTheme } from './themes';
import { GeneralContextContainer } from './components/GeneralContextContainer';
import { ConfirmationServiceProvider } from './components/ConfirmationService';


const App = () => {
  return (
    <GeneralContextContainer>
      <WithTheme theme={darkTheme}>
        <ConfirmationServiceProvider>
          <AppRouter />
        </ConfirmationServiceProvider>
      </WithTheme>
    </GeneralContextContainer>
  );
};

export default App;
