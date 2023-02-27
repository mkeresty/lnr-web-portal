import logo from './logo.svg';
import './App.css';
import { CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Button from '@mui/material/Button';
import { minify } from 'csso';
import { ethers } from 'ethers';
// import { lnr } from './utils/lnr-ethers-1.1.0'
// import { lnrWeb } from './utils/lnr-web-0.1.5'
import LNR from './utils/lnr-ethers-1.1.0'
import LNR_WEB from './utils/lnr-web-0.1.5'


const theme = createTheme({
  palette: {
      primary: {
          main: "#a89be1",
          contrastText: "#ffffff",
      },
      secondary: {
          main: "#ffffff",
          contrastText: "#ffffff",
      },
      success: {
        main: "#9afa92",
        contrastText: "ffffff"
      },
  },
});


function App() {







  return (
    <ThemeProvider theme={theme}>
      <Navbar />
    <div className="App">
    <iframe id="chain_frame" className="frame">
    
    </iframe>
    </div>
    </ThemeProvider>
  );
}

export default App;
