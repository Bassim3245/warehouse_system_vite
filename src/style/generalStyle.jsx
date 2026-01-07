
import styled from "styled-components";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
export const FileContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
  position: "relative",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

export const FileImage = styled("img")(({ type }) => ({
  width: type === "pdf" ? "80px" : "200px",
  maxWidth: "100%",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: "10px 0",
  transition: "all 0.3s ease",
}));

export const DownloadButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "5px",
  right: "5px",
  color: "#1e6a99",
  backgroundColor: "rgba(235, 235, 235, 0.9)",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#1e6a99",
    color: "#ffffff",
    transform: "scale(1.1)",
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  textAlign: "center",
  "&.header": {
    backgroundColor: "#1e6a99",
    color: "#fff",
    fontSize: "1rem",
  },
  "&.headerDark": {
    backgroundColor: "#e3f2fd",
    color: "#1e6a99",
    fontSize: "1rem",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f5f5f5",
  },
  "&:hover": {
    backgroundColor: "#eeeeee",
  },
}));
export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: "#1e6a99",
  margin: "20px 0",
  fontWeight: "bold",
  borderBottom: "2px solid #1e6a99",
  paddingBottom: "8px",
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "3",
  height: "100%",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  overflow: "hidden",
  position: "relative",

}));
// Using img instead of Box for the image
export const StyledImage = styled("img")(({ theme }) => ({
  width: 200,
  height: 200,
  objectFit: "contain",
  borderRadius: "8px",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));