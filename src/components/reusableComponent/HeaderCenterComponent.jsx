import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";

const HeaderCenter = ({ title, isDashboard = false, dir, typeHeader }) => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={800}>
      <Box
        mb={isDashboard ? 2 : 4}
        dir={dir}
        sx={{
          textAlign: "center",
          position: "relative",
          padding: "10px 0",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "4px",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(90deg, #64b5f6 0%, #9575cd 100%)"
                : "linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)",
            borderRadius: "2px",
            transition: "width 0.3s ease",
          },
          "&:hover::after": {
            width: "120px",
          },
        }}
      >
        <Typography
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.main,
            fontWeight: "bold",
            letterSpacing: "0.5px",
            mt: "3px",
            textShadow:
              theme.palette.mode === "dark"
                ? "0 2px 4px rgba(0, 0, 0, 0.5)"
                : "0 1px 2px rgba(0, 0, 0, 0.1)",
            position: "relative",
            display: "inline-block",
            ...(isDashboard && {
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, #64b5f6 0%, #9575cd 100%)"
                  : "linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }),
          }}
          variant={typeHeader ? typeHeader : "h3"}
        >
          {title}
        </Typography>
      </Box>
    </Fade>
  );
};

export default HeaderCenter;
