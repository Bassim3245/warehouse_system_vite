import  { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";

function PageNotFound() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Calculate parallax effect based on mouse position
  const calcParallax = (depth = 10) => {
    const x = (window.innerWidth / 2 - mousePosition.x) / depth;
    const y = (window.innerHeight / 2 - mousePosition.y) / depth;
    return { x, y };
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #1a237e 0%, #311b92 100%)",
        position: "relative"
      }}
    >
      {/* Animated background elements */}
      {[...Array(20)].map((_, index) => (
        <Box
          key={index}
          component={motion.div}
          sx={{
            position: "absolute",
            width: Math.random() * 100 + 20,
            height: Math.random() * 100 + 20,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            filter: "blur(3px)",
            zIndex: 0
          }}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            transition: {
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }
          }}
        />
      ))}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ zIndex: 1, textAlign: "center" }}
      >
        <Grid container spacing={4} direction="column" alignItems="center">
          {/* 404 Text with parallax effect */}
          <Grid item>
            <motion.div
              style={{ position: "relative" }}
              animate={{ x: calcParallax(20).x, y: calcParallax(20).y }}
            >
              <Typography
                variant="h1"
                component={motion.h1}
                variants={itemVariants}
                sx={{
                  fontSize: { xs: "8rem", md: "12rem" },
                  fontWeight: 900,
                  color: "#fff",
                  textShadow: "0 10px 20px rgba(0,0,0,0.2), 0 0 0 #fff, 0 0 10px #6200ea, 0 0 20px #6200ea",
                  position: "relative",
                  display: "inline-block",
                  m: 0
                }}
              >
                404
              </Typography>

              {/* Shadow/Glitch effect */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "8rem", md: "12rem" },
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.1)",
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  zIndex: -1,
                  m: 0
                }}
              >
                404
              </Typography>
            </motion.div>
          </Grid>

          {/* Error message */}
          <Grid item>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h4"
                sx={{
                  color: "#fff",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1
                }}
              >
                <ErrorOutlineIcon fontSize="large" />
                الصفحة غير موجودة
              </Typography>
            </motion.div>
          </Grid>

          {/* Subtitle */}
          <Grid item>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  maxWidth: "600px",
                  mb: 4
                }}
              >
                عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها
              </Typography>
            </motion.div>
          </Grid>

          {/* Action button */}
          <Grid item>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/")}
                startIcon={<HomeIcon />}
                sx={{
                  background: "linear-gradient(45deg, #6200ea 30%, #3f51b5 90%)",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  boxShadow: "0 8px 16px rgba(98, 0, 234, 0.3)",
                  '&:hover': {
                    boxShadow: "0 12px 20px rgba(98, 0, 234, 0.4)",
                  }
                }}
              >
                العودة للصفحة الرئيسية
              </Button>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
}

export default PageNotFound;
