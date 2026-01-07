import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";import Skeleton from "@mui/material/Skeleton";
import Grow from "@mui/material/Grow";
import { alpha } from "@mui/material/styles";
import { ResponsivePie } from "@nivo/pie";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const Card = ({ image, title, subTitle, increase, data, scheme, countDataReport, color }) => {
  const theme = useTheme();

  // Custom color handling
  const cardColor = color || theme.palette.primary.main;
  const cardColorLight = theme.palette.mode === "light"
    ? alpha(cardColor, 0.08)
    : alpha(cardColor, 0.15);
  const cardBorderColor = theme.palette.mode === "light"
    ? alpha(cardColor, 0.2)
    : alpha(cardColor, 0.3);

  return (
    <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={600}>
      <Paper
        elevation={0}
        component={motion.div}
        whileHover={{ y: -5 }}
        sx={{
          height: "100%",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          background: theme.palette.mode === "light"
            ? "white"
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          border: `1px solid ${cardBorderColor}`,
          "&:hover": {
            boxShadow: `0 10px 25px ${alpha(cardColor, 0.15)}`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "5px",
            background: `linear-gradient(to bottom, ${cardColor}, ${alpha(cardColor, 0.6)})`,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            right: 0,
            top: 0,
            height: "5px",
            width: "30%",
            background: `linear-gradient(to left, ${cardColor}, ${alpha(cardColor, 0.2)})`,
            borderRadius: "0 0 0 5px"
          }
        }}
      >
        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box
              sx={{
                background: `linear-gradient(135deg, ${cardColorLight}, ${alpha(cardColor, 0.05)})`,
                borderRadius: "12px",
                p: 1.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: `0 4px 8px ${alpha(cardColor, 0.1)}`,
                border: `1px solid ${alpha(cardColor, 0.15)}`,
              }}
            >
              <motion.img
                src={image}
                alt="icon"
                width={"40px"}
                height={"40px"}
                style={{
                  objectFit: "contain",
                  filter: `drop-shadow(0 2px 3px ${alpha(cardColor, 0.3)})`
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Box>

            <Box height={"70px"} width={"70px"}>
              <ResponsivePie
                data={data}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                innerRadius={0.7}
                colors={{
                  scheme: scheme,
                }}
                enableArcLabels={false}
                enableArcLinkLabels={false}
                padAngle={0.7}
                cornerRadius={4}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                animate={true}
                motionConfig="gentle"
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                defs={[
                  {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                  },
                  {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                  },
                  {
                    id: 'gradient',
                    type: 'linearGradient',
                    colors: [
                      { offset: 0, color: 'inherit' },
                      { offset: 100, color: 'inherit', opacity: 0.7 }
                    ]
                  }
                ]}
                fill={[
                  { match: { id: 'ruby' }, id: 'gradient' },
                  { match: { id: 'c' }, id: 'dots' },
                  { match: { id: 'go' }, id: 'dots' },
                  { match: { id: 'python' }, id: 'gradient' },
                  { match: { id: 'scala' }, id: 'lines' },
                  { match: { id: 'lisp' }, id: 'lines' },
                  { match: { id: 'elixir' }, id: 'gradient' },
                  { match: { id: 'javascript' }, id: 'gradient' }
                ]}
                theme={{
                  textColor: theme.palette.text.primary,
                  fontSize: 11,
                  tooltip: {
                    container: {
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      fontSize: 12,
                      boxShadow: theme.shadows[3],
                      borderRadius: 2,
                    },
                  },
                }}
              />
            </Box>
          </Stack>

          {title && (
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500
              }}
            >
              {title}
            </Typography>
          )}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: theme.palette.text.primary,
              minHeight: "40px",
              lineHeight: 1.4
            }}
          >
            {subTitle}
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {countDataReport !== undefined ? (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: cardColor,
                  textShadow: `0 2px 4px ${alpha(cardColor, 0.25)}`,
                  background: `linear-gradient(to right, ${cardColor}, ${alpha(cardColor, 0.8)})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <CountUp end={countDataReport} duration={2.5} separator="," />
              </Typography>
            ) : (
              <Skeleton variant="text" width={80} height={40} />
            )}

            {increase && (
              <Box
                sx={{
                  background: theme.palette.success.light,
                  color: theme.palette.success.dark,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,200,83,0.2)",
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  backdropFilter: "blur(4px)"
                }}
              >
                {increase}
              </Box>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Grow>
  );
};

export default Card;
