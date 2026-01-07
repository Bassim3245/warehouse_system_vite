import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Header = ({
  title,
  subTitle = "",
  isDashboard = false,
  dir,
  typeHeader,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          mt: isSmallScreen ? "12px" : "20px",
          mb: isSmallScreen ? "10px" : "16px",
          position: "relative",
          textAlign: dir === "rtl" ? "right" : "left",
          px: isSmallScreen ? 1 : 0,
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-8px",
            left: dir === "rtl" ? "auto" : "0",
            right: dir === "rtl" ? "0" : "auto",
            width: isSmallScreen ? "40px" : "60px",
            height: "4px",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(90deg, #64b5f6 0%, #9575cd 100%)"
                : "linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)",
            borderRadius: "2px",
            transition: "width 0.3s ease",
          },
          "&:hover::after": {
            width: isSmallScreen ? "60px" : "100px",
          },
        }}
        dir={dir}
      >
        <Typography
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.main,
            fontWeight: "bold",
            letterSpacing: "0.5px",
            textShadow:
              theme.palette.mode === "dark"
                ? "0 2px 4px rgba(0, 0, 0, 0.5)"
                : "0 1px 2px rgba(0, 0, 0, 0.1)",
            position: "relative",
            display: "inline-block",
            fontSize: isSmallScreen
              ? "1rem"
              : isMediumScreen
              ? "1.2rem"
              : "1.2rem",
            ...(isDashboard && {
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, #64b5f6 0%, #9575cd 100%)"
                  : "linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }),
          }}
          variant={typeHeader || "h5"}
        >
          {title}
        </Typography>

        {subTitle && (
          <Typography
            variant="body1"
            sx={{
              mt: 0.5,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[400]
                  : theme.palette.grey[700],
              fontSize: isSmallScreen ? "0.85rem" : "0.95rem",
              maxWidth: isSmallScreen ? "100%" : "80%",
              opacity: 0.9,
              lineHeight: 1.4,
            }}
          >
            {subTitle}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default Header;
