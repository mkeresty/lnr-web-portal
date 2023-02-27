import logo from './logo.svg';
import './App.css';
import { CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';



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
