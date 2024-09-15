import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import AboutMe from "./components/AboutMe";
import "./App.css";
import NavBar from "./components/NavBar";
import MonsterChess from "./components/MonsterChess";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, amber } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: red[900],
    },
    secondary: {
      main: amber[500],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/monster" element={<MonsterChess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NavBar>
      </BrowserRouter>
    </ThemeProvider>
    // <header>
    //   <MonsterChess />
    // </header>
  );
}

export default App;
