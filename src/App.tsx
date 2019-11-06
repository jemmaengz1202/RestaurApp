import React from 'react';
import { AppRouter } from './AppRouter';
import WithTheme from './components/WithTheme';
import { darkTheme } from './themes';
import { GeneralContextContainer } from './components/GeneralContextContainer';


const App = () => {
  return (
    <GeneralContextContainer>
      <WithTheme theme={darkTheme}>
        <AppRouter />
      </WithTheme>
    </GeneralContextContainer>
  );
};

export default App;
