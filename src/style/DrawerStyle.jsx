

export const toggleButtonSx = (isDark, theme) => ({
  color: theme.palette.text.secondary,
  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
  borderRadius: "10px",
  width: 40,
  height: 40,
});

export const dividerSx = (isDark) => ({
  mx: 2,
  my: 1,
  background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
});

export const moreButtonSx = (open, openPage, isDark) => ({
  minHeight: 48,
  justifyContent: open ? "initial" : "center",
  px: 2,
  borderRadius: "12px",
  backgroundColor: openPage
    ? isDark
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.04)"
    : "transparent",
  "&:hover": {
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.12)"
      : "rgba(0, 0, 0, 0.08)",
    transform: "translateX(2px)",
  },
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
});
// Add these to your existing styles

export const drawerPaperSx = (isDark, drawerWidth) => ({
  width: drawerWidth,
  transition: "width 0.3s ease-in-out",
  backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
  borderRight: `1px solid ${isDark ? "#333" : "#e0e0e0"}`,
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
  // Mobile specific
  "@media (max-width: 900px)": {
    width: drawerWidth || 260,
  },
});

export const drawerHeaderSx = (isDark) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px",
  minHeight: "64px",
  backgroundColor: isDark ? "#252525" : "#f5f5f5",
  // Mobile responsive
  "@media (max-width: 600px)": {
    minHeight: "56px",
    padding: "12px",
  },
});

export const footerBorderSx = (isDark) => ({
  borderTop: `1px solid ${isDark ? "#333" : "#e0e0e0"}`,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  // Mobile responsive
  "@media (max-width: 600px)": {
    padding: "12px",
    gap: "6px",
  },
});

export const homeButtonSx = (isDark, open, theme, rtl) => ({
  justifyContent: open ? "flex-start" : "center",
  padding: open ? "8px 16px" : "8px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: isDark ? "#333" : "#f0f0f0",
  },
  // Mobile responsive
  "@media (max-width: 600px)": {
    fontSize: "0.875rem",
    padding: "6px 12px",
  },
});

export const logoutButtonSx = (open, theme, isDark, rtl) => ({
  justifyContent: open ? "flex-start" : "center",
  padding: open ? "8px 16px" : "8px",
  textTransform: "none",
  borderColor: theme.palette.error.main,
  "&:hover": {
    backgroundColor: isDark
      ? "rgba(211, 47, 47, 0.1)"
      : "rgba(211, 47, 47, 0.05)",
    borderColor: theme.palette.error.dark,
  },
  // Mobile responsive
  "@media (max-width: 600px)": {
    fontSize: "0.875rem",
    padding: "6px 12px",
  },
});
