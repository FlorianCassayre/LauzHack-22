import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Button, CssBaseline } from '@mui/material';
import { Homepage } from "./components/Homepage";

function App() {
  return (
      <>
          <CssBaseline />
          <Homepage />
      </>
  );
}

export default App;
