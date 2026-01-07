import { DataGrid } from "@mui/x-data-grid";
import { styled, alpha } from "@mui/material/styles";
import { color } from "framer-motion";

/**
 * StyledDataGrid - A professionally styled DataGrid component
 * Modern, customized DataGrid with enhanced visual styling and responsive behavior
 */
const StyledDataGrid = styled(DataGrid, {
  shouldForwardProp: (prop) =>
    !["rowCount", "containerHasDirection", "direction", "gridTheme"].includes(
      prop
    ),
})(({ theme, rowCount, direction, gridTheme }) => {
  const mainColor = gridTheme?.mainColor || theme.palette.primary.main;
  const isDark = theme?.palette?.mode === "dark";

  return {
    // ========== Base Styling ==========
    backgroundColor: isDark
      ? alpha(theme.palette.background.paper, 0.8)
      : theme.palette.background.paper,
    width: "100%",
    height: "auto",
    border: "none",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    overflow: "hidden",

    // ========== Row States ==========
    "& .highlighted-row-ended": {
      backgroundColor: alpha(theme.palette.success.light, 0.2),
      "&:hover": {
        backgroundColor: alpha(theme.palette.success.light, 0.3),
      },
    },
    "& .highlighted-row-CompleteProject": {
      backgroundColor: alpha(theme.palette.success.main, 0.2),
      "&:hover": {
        backgroundColor: alpha(theme.palette.success.main, 0.3),
      },
    },
    "& .highlighted-row-odd": {
      backgroundColor: alpha(theme.palette.warning.light, 0.1),
      "&:hover": {
        backgroundColor: alpha(theme.palette.warning.light, 0.2),
      },
    },
    "& .highlighted-row-expired": {
      backgroundColor: alpha(theme.palette.error.light, 0.2),
      "&:hover": {
        backgroundColor: alpha(theme.palette.error.light, 0.3),
      },
    },
    "& .highlighted-row-near-expiration": {
      backgroundColor: alpha(theme.palette.warning.light, 0.2),
      "&:hover": {
        backgroundColor: alpha(theme.palette.warning.light, 0.3),
      },
    },
    "& .highlighted-row-even": {
      backgroundColor: isDark
        ? alpha(theme.palette.common.white, 0.05)
        : alpha(theme.palette.primary.light, 0.05),
      "&:hover": {
        backgroundColor: isDark
          ? alpha(theme.palette.common.white, 0.08)
          : alpha(theme.palette.primary.light, 0.1),
      },
    },
    "& .highlighted-row-copy": {
      backgroundColor: alpha(theme.palette.info.light, 0.1),
      "&:hover": {
        backgroundColor: alpha(theme.palette.info.light, 0.2),
      },
    },

    // ========== Header Styling ==========
    "& .MuiDataGrid-columnHeader": {
      padding: "0 16px",
      backgroundColor: mainColor,
      minHeight: "60px",
      maxHeight: "60px",
      transition: "background-color 0.2s ease",
      "&:hover": {
        backgroundColor: alpha(mainColor, 0.9),
      },
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 600,
      fontSize: "14px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      direction: "rtl",
    },

    "& .MuiDataGrid-columnHeaderTitleContainerContent, & .MuiDataGrid-columnHeaderTitleContainerContent div, & .MuiDataGrid-columnHeaderTitleContainerContent span, & .MuiDataGrid-columnHeaderTitleContainerContent p":
    {
      fontFamily: "Cairo, sans-serif",
      textAlign: direction === "rtl" ? "right" : "left",
      color: theme.palette.getContrastText(mainColor),
      fontWeight: 600,
    },

    // ========== Cell Styling ==========
    "& .MuiDataGrid-cell": {
      minHeight: "60px",
      padding: "8px 16px",
      border: "none",
      outline: "none",
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
      transition: "background-color 0.2s ease",
    },

    "& .MuiDataGrid-row": {
      maxHeight: "none",
      position: "relative",
      transition: "background-color 0.15s ease",
      "&:hover": {
        backgroundColor: isDark
          ? alpha(theme.palette.action.hover, 0.1)
          : alpha(theme.palette.action.hover, 0.05),
      },
      "&:last-child .MuiDataGrid-cell": {
        borderBottom: "none",
      },
    },

    "& .MuiDataGrid-cellContent, & .MuiDataGrid-cellContent div, & .MuiDataGrid-cellContent span, & .MuiDataGrid-cellContent p":
    {
      fontFamily: "Cairo, sans-serif",
      textAlign: direction === "rtl" ? "right" : "left",
      wordWrap: "break-word",
      whiteSpace: "break-spaces",
      padding: "4px",
      textOverflow: "ellipsis",
      fontSize: "14px",
      color: theme.palette.text.primary,
    },

    // ========== Remove Unnecessary Elements ==========
    "& .MuiDataGrid-columnSeparator": {
      display: "none",

    },

    "& .MuiDataGrid-menuIcon, & .MuiDataGrid-iconButtonContainer": {
      // display: "
      color:"white !important"

    },

    // ========== Scrollbar Styling ==========
    "& .MuiDataGrid-virtualScroller::-webkit-scrollbar ": {
      height: "8px",
      width: "8px",
    },

    "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
      backgroundColor: alpha(theme.palette.primary.main, 0.6),
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
      },
    },

    "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
      backgroundColor: alpha(theme.palette.grey[300], 0.3),
      borderRadius: "4px",
    },

    // ========== Empty State ==========
    "& .MuiDataGrid-virtualScrollerContent": {
      height: !rowCount ? "398px" : "auto",
    },

    "& .MuiDataGrid-overlay": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      backgroundColor: isDark
        ? alpha(theme.palette.background.paper, 0.7)
        : alpha(theme.palette.background.paper, 0.5),
      backdropFilter: "blur(4px)",
      zIndex: 10,
    },

    // ========== Checkbox Styling ==========
    "& .MuiCheckbox-root": {
      color: theme.palette.primary.main,
      "& svg": {
        fill: theme.palette.primary.main,
      },
    },

    // ========== Footer Styling ==========
    "& .MuiDataGrid-footerContainer": {
      borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
      backgroundColor: isDark
        ? alpha(theme.palette.background.paper, 0.9)
        : alpha(theme.palette.grey[50], 0.9),
    },

    // ========== Pagination Styling ==========
    "& .MuiTablePagination-root": {
      color: theme.palette.text.primary,
    },

    "& .MuiTablePagination-selectIcon": {
      color: theme.palette.primary.main,
    },

    // ========== Toolbar Styling ==========
    "& .MuiDataGrid-toolbarContainer": {
      padding: "8px 16px",
      backgroundColor: isDark
        ? alpha(theme.palette.background.paper, 0.9)
        : alpha(theme.palette.grey[50], 0.9),
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
    },

    // ========== Mobile Responsiveness ==========
    [theme.breakpoints.down("sm")]: {
      borderRadius: 0,
      boxShadow: "none",
      height: "calc(100vh - 120px)",

      "& .MuiDataGrid-main": {
        overflowX: "auto",
      },

      "& .MuiDataGrid-columnHeader": {
        minHeight: "45px",
        maxHeight: "45px",
        padding: "0 8px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        minWidth: "80px !important",
      },

      "& .MuiDataGrid-columnHeaderTitle": {
        fontSize: "12px",
        fontWeight: 500,
      },

      "& .MuiDataGrid-columnHeaderTitleContainerContent, & .MuiDataGrid-columnHeaderTitleContainerContent div, & .MuiDataGrid-columnHeaderTitleContainerContent span, & .MuiDataGrid-columnHeaderTitleContainerContent p":
      {
        fontWeight: 500,
      },

      "& .MuiDataGrid-cell": {
        minHeight: "45px",
        padding: "4px 8px",
        fontSize: "12px",
      },

      "& .MuiDataGrid-row": {
        minHeight: "45px",
        "&:active": {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      },

      "& .MuiDataGrid-cellContent, & .MuiDataGrid-cellContent div, & .MuiDataGrid-cellContent span, & .MuiDataGrid-cellContent p":
      {
        fontSize: "12px",
        padding: "1px",
        whiteSpace: "nowrap",
        lineHeight: 1.2,
      },

      "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
        height: "4px",
        width: "4px",
      },

      "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
        borderRadius: "2px",
      },

      "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
        borderRadius: "2px",
      },

      "& .MuiDataGrid-virtualScroller": {
        overflowX: "auto",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      },

      "& .MuiDataGrid-virtualScrollerContent": {
        height: !rowCount ? "200px" : "auto",
      },

      "& .MuiDataGrid-overlay": {
        fontSize: "14px",
        padding: "20px",
      },

      "& .MuiCheckbox-root": {
        padding: "6px",
        "& svg": {
          fontSize: "1.2rem",
        },
      },

      "& .MuiDataGrid-footerContainer": {
        padding: "8px 4px",
        minHeight: "45px",
      },

      "& .MuiTablePagination-root": {
        fontSize: "12px",
        "& .MuiTablePagination-toolbar": {
          minHeight: "40px",
          padding: "0 8px",
        },
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
        {
          fontSize: "12px",
        },
      },

      "& .MuiTablePagination-actions": {
        "& .MuiIconButton-root": {
          padding: "4px",
          "& svg": {
            fontSize: "1.2rem",
          },
        },
      },

      "& .MuiDataGrid-toolbarContainer": {
        padding: "6px 8px",
        flexWrap: "wrap",
        minHeight: "40px",
      },

      "& .MuiDataGrid-cell:focus": {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: "-1px",
      },

      "& .MuiDataGrid-columnHeaders": {
        borderBottom: `2px solid ${mainColor}`,
      },

      "& .MuiDataGrid-toolbarContainer .MuiDataGrid-toolbarDensitySelector": {
        display: "none",
      },
    },

    // ========== Tablet Adjustments ==========
    [theme.breakpoints.down("md")]: {
      "& .MuiDataGrid-columnHeader": {
        minHeight: "50px",
        maxHeight: "50px",
        padding: "0 12px",
      },

      "& .MuiDataGrid-columnHeaderTitle": {
        fontSize: "13px",
      },

      "& .MuiDataGrid-cell": {
        minHeight: "50px",
        padding: "6px 12px",
      },

      "& .MuiDataGrid-cellContent, & .MuiDataGrid-cellContent div, & .MuiDataGrid-cellContent span, & .MuiDataGrid-cellContent p":
      {
        fontSize: "13px",
        padding: "2px",
      },
    },

    [theme.breakpoints.between("sm", "md")]: {
      "& .MuiDataGrid-cell": {
        minHeight: "55px",
        padding: "6px 14px",
      },
      "& .MuiDataGrid-columnHeader": {
        minHeight: "55px",
        maxHeight: "55px",
        padding: "0 14px",
      },
    },

    // ========== Large Screen Optimizations ==========
    [theme.breakpoints.up("lg")]: {
      "& .MuiDataGrid-cell": {
        minHeight: "65px",
        padding: "10px 18px",
      },
      "& .MuiDataGrid-columnHeader": {
        minHeight: "65px",
        maxHeight: "65px",
        padding: "0 18px",
      },
    },
  };
});

export default StyledDataGrid;