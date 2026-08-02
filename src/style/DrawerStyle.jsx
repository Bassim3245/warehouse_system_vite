
export const toggleButtonSx = (isDark, theme) => ({
  color: isDark ? "#a78bfa" : "#6366f1",
  backgroundColor: isDark
    ? "rgba(167, 139, 250, 0.08)"
    : "rgba(99, 102, 241, 0.08)",
  borderRadius: "12px",
  width: 36,
  height: 36,
  transition: "all 0.25s ease",
  "&:hover": {
    backgroundColor: isDark
      ? "rgba(167, 139, 250, 0.16)"
      : "rgba(99, 102, 241, 0.14)",
  },
});

export const dividerSx = (isDark) => ({
  mx: 1.5,
  my: 0.75,
  background: isDark
    ? "rgba(167, 139, 250, 0.12)"
    : "rgba(99, 102, 241, 0.1)",
});

export const moreButtonSx = (open, openPage, isDark) => ({
  minHeight: 44,
  justifyContent: open ? "initial" : "center",
  px: 1.5,
  borderRadius: "12px",
  backgroundColor: openPage
    ? isDark
      ? "rgba(167, 139, 250, 0.12)"
      : "rgba(99, 102, 241, 0.1)"
    : "transparent",
  "&:hover": {
    backgroundColor: isDark
      ? "rgba(167, 139, 250, 0.16)"
      : "rgba(99, 102, 241, 0.08)",
  },
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
});

export const drawerPaperSx = (isDark, drawerWidth) => ({
  width: drawerWidth,
  transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background: isDark
    ? "linear-gradient(180deg, #13101f 0%, #1a1628 100%)"
    : "linear-gradient(180deg, #fafafa 0%, #f4f3ff 100%)",
  borderRight: `1px solid ${isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(99, 102, 241, 0.1)"}`,
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
  "@media (max-width: 900px)": {
    width: drawerWidth || 260,
  },
});

export const drawerHeaderSx = (isDark) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 16px",
  minHeight: "64px",
  background: isDark
    ? "rgba(99, 102, 241, 0.08)"
    : "rgba(99, 102, 241, 0.05)",
  borderBottom: `1px solid ${isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(99, 102, 241, 0.1)"}`,
  "@media (max-width: 600px)": {
    minHeight: "56px",
    padding: "10px 14px",
  },
});

export const footerBorderSx = (isDark) => ({
  borderTop: `1px solid ${isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(99, 102, 241, 0.1)"}`,
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  "@media (max-width: 600px)": {
    padding: "10px",
    gap: "5px",
  },
});

export const homeButtonSx = (isDark, open, theme, rtl) => ({
  justifyContent: open ? "flex-start" : "center",
  padding: open ? "8px 14px" : "8px",
  textTransform: "none",
  borderRadius: "10px",
  color: isDark ? "#a78bfa" : "#6366f1",
  fontSize: "0.875rem",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: isDark
      ? "rgba(167, 139, 250, 0.1)"
      : "rgba(99, 102, 241, 0.08)",
  },
  "@media (max-width: 600px)": {
    fontSize: "0.825rem",
    padding: "6px 10px",
  },
});

export const logoutButtonSx = (open, theme, isDark, rtl) => ({
  justifyContent: open ? "flex-start" : "center",
  padding: open ? "8px 14px" : "8px",
  textTransform: "none",
  borderRadius: "10px",
  fontSize: "0.875rem",
  fontWeight: 500,
  borderColor: isDark
    ? "rgba(248, 113, 113, 0.5)"
    : "rgba(239, 68, 68, 0.5)",
  color: isDark ? "#f87171" : "#ef4444",
  "&:hover": {
    backgroundColor: isDark
      ? "rgba(248, 113, 113, 0.08)"
      : "rgba(239, 68, 68, 0.06)",
    borderColor: isDark ? "#f87171" : "#ef4444",
  },
  "@media (max-width: 600px)": {
    fontSize: "0.825rem",
    padding: "6px 10px",
  },
});
