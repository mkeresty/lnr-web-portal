import logo from './logo.svg';
import './App.css';
import { CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import { Route, Routes, Navigate } from "react-router-dom"
import Main from './Main';
import { BrowserRouter } from "react-router-dom"

const theme = createTheme({
  palette: {
      primary: {
          main: "#1f1f1f",
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
      <BrowserRouter>
      <Navbar />
      <div className="App">
      <Routes>

        <Route path="/og/:id" element={<Main />}/>
        <Route path="/" element={<Navigate to="/og/lnrforever.og" replace />} />
      </Routes>     
    <iframe id="chain_frame" className="frame">
    </iframe>
    local

    </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
