export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode palette
          primary: {
            main: "#1e6a99",
            MainColor: "#14B8A6",
            light: "#2c5aa0",
            dark: "#002984",
            contrastText: "#ffffff",
            colorblack: "#000000",
            lightblack: "#333333",
            colorWhite: "#ffffff",
            paperColor: "#ffffff",
          },
          backgroundColorTheme: {
            backgroundColorLight: "#ffff",
            backgroundColorDark: "#0000",
            backgroundColor: "#FAFAFA",
          },
          secondary: {
            main: "#f50057",
            light: "#ff4081",
            dark: "#c51162",
            contrastText: "#ffffff",
          },
          error: {
            main: "#f44336",
            light: "#e57373",
            dark: "#d32f2f",
          },
          warning: {
            main: "#ff9800",
            light: "#ffb74d",
            dark: "#f57c00",
          },
          info: {
            main: "#2196f3",
            light: "#64b5f6",
            dark: "#1976d2",
          },
          success: {
            main: "#4caf50",
            light: "#81c784",
            dark: "#388e3c",
          },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
          text: {
            primary: "#333333",
            secondary: "#666666",
            disabled: "#999999",
          },
          divider: "rgba(0, 0, 0, 0.12)",
        }
      : {
          // Dark mode palette
          primary: {
            main: "#7986cb",
            light: "#9fa8da",
            dark: "#5c6bc0",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#ff4081",
            light: "#ff79b0",
            dark: "#c60055",
            contrastText: "#ffffff",
          },
          error: {
            main: "#f44336",
            light: "#e57373",
            dark: "#d32f2f",
          },
          warning: {
            main: "#ffa726",
            light: "#ffb74d",
            dark: "#f57c00",
          },
          info: {
            main: "#29b6f6",
            light: "#4fc3f7",
            dark: "#0288d1",
          },
          success: {
            main: "#66bb6a",
            light: "#81c784",
            dark: "#388e3c",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          text: {
            primary: "#ffffff",
            secondary: "#b0b0b0",
            disabled: "#6c6c6c",
          },
          divider: "rgba(255, 255, 255, 0.12)",
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow:
              mode === "light"
                ? "0 2px 8px rgba(0,0,0,0.1)"
                : "0 2px 8px rgba(0,0,0,0.5)",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: mode === "light" ? "#3949ab" : "#8c9eff",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow:
            mode === "light"
              ? "0 2px 10px rgba(0,0,0,0.05)"
              : "0 2px 10px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            mode === "light"
              ? "0 2px 10px rgba(0,0,0,0.05)"
              : "0 2px 10px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            backgroundColor:
              mode === "light"
                ? "rgba(63, 81, 181, 0.12)"
                : "rgba(121, 134, 203, 0.12)",
            "&:hover": {
              backgroundColor:
                mode === "light"
                  ? "rgba(63, 81, 181, 0.18)"
                  : "rgba(121, 134, 203, 0.18)",
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: "hidden",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === "light" ? "#333" : "#f5f5f5",
          color: mode === "light" ? "#fff" : "#333",
          fontSize: "0.75rem",
          boxShadow:
            mode === "light"
              ? "0 2px 10px rgba(0,0,0,0.2)"
              : "0 2px 10px rgba(0,0,0,0.5)",
          borderRadius: 4,
          padding: "8px 12px",
        },
      },
    },
    // ✅ MOVED INSIDE components object
    MuiDialog: {
      defaultProps: {
        BackdropProps: {
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(3px)",
          },
        },
      },
    },
  },
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  direction: "ltr",
});
