import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, keyframes } from "@mui/material/styles";

// animation
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const blueColor = "#1976d2";

// Styled components
const LoaderContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  backdropFilter: "blur(1px)",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.7)"
      : "rgba(255, 255, 255, 0.7)",
  transition: "all 0.3s ease",
}));

const LoaderContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

function Loader() {
  return (
    <LoaderContainer>
      <LoaderContent>
        <CircularProgress
          size={70}
          thickness={5}
          sx={{
            color: blueColor,
          }}
        />
      </LoaderContent>
    </LoaderContainer>
  );
}

export default Loader;
