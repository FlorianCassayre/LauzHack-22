import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-image-crop/dist/ReactCrop.css';
import { CssBaseline } from '@mui/material';
import { Homepage } from "./components/Homepage";
import { SnackbarProvider } from 'notistack';


function App() {
  return (
      <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <Homepage />
      </SnackbarProvider>
  );
}

export default App;
