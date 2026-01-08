import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

// IMPORTANT:
// Offline Safe Mode is DEFAULT.
// Moralis is only enabled when VITE_ENABLE_MORALIS === "true".
const ENABLE_MORALIS = import.meta.env.VITE_ENABLE_MORALIS === "true";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1cac1d" },
    neutral: { main: "#f8f9f9" },
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        text: { fontWeight: 600, textTransform: "inherit" },
        contained: { fontWeight: 700, textTransform: "inherit", borderRadius: 25 },
      },
    },
  },
});

const POLLING_INTERVAL = 12000;

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

// Lazy Moralis wrapper so we do not import Moralis packages unless enabled.
function MaybeMoralis({ children }) {
  if (!ENABLE_MORALIS) return children;

  // Dynamically require ONLY when enabled (avoids outbound calls / init during offline mode)
  // eslint-disable-next-line global-require
  const { MoralisProvider } = require("react-moralis");
  // eslint-disable-next-line global-require
  const { MoralisDappProvider } = require("./providers/MoralisDappProvider/MoralisDappProvider");

  const APP_ID = import.meta.env.VITE_MORALIS_APP_ID || "DYFU90AwvC6Ktjxrr31VdJNhAV5UadWBr97duwex";
  const SERVER_URL =
    import.meta.env.VITE_MORALIS_SERVER_URL || "https://gq7x7ofh7pyg.usemoralis.com:2053/server";

  return (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <MoralisDappProvider>{children}</MoralisDappProvider>
    </MoralisProvider>
  );
}

const Application = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MaybeMoralis>
          <App />
        </MaybeMoralis>
      </ThemeProvider>
    </Web3ReactProvider>
  );
};

// React 17 entrypoint (no react-dom/client, no createRoot)
ReactDOM.render(<Application />, document.getElementById("root"));
