import { CircularProgress, IconButton, useTheme } from "@mui/material";
import React, { useState, useCallback, useMemo } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { alpha } from '@mui/material/styles';

export default function UseFullScreen({ setRefreshButton, refreshing }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();

  // Memoize refresh handler to prevent unnecessary re-renders
  const handleRefresh = useCallback(async () => {
    setRefreshButton((prev) => !prev);
  }, [setRefreshButton]);

  // Memoize fullscreen toggle handler
  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  }, [isFullscreen]);

  // Memoize styles to prevent unnecessary re-computations
  const fullscreenButtonStyles = useMemo(() => ({
    backgroundColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.secondary.main, 0.1)
        : alpha(theme.palette.secondary.main, 0.2),
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
    },
    transition: "all 0.2s ease",
  }), [theme.palette.mode, theme.palette.secondary.main]);

  const refreshButtonStyles = useMemo(() => ({
    backgroundColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.primary.main, 0.1)
        : alpha(theme.palette.primary.main, 0.2),
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
    transition: "all 0.2s ease",
  }), [theme.palette.mode, theme.palette.primary.main]);

  // Memoize container styles
  const containerStyles = useMemo(() => ({
    display: "flex",
    gap: 10
  }), []);

  return (
    <div style={containerStyles}>
      <IconButton
        size="large"
        onClick={handleFullscreenToggle}
        sx={fullscreenButtonStyles}
      >
        {isFullscreen ? (
          <FullscreenExitIcon fontSize="small" />
        ) : (
          <FullscreenIcon fontSize="small" />
        )}
      </IconButton>
      <IconButton
        size="large"
        onClick={handleRefresh}
        sx={refreshButtonStyles}
      >
        <RefreshIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
