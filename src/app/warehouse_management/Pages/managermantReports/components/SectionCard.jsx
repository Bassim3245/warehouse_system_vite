import { alpha, Box, Paper, Typography } from "@mui/material";

const SectionCard = ({ icon, title, subtitle, accentColor, children, theme }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      overflow: "hidden",
      mb: 3,
      transition: "box-shadow 0.2s",
      "&:hover": {
        boxShadow: `0 4px 20px ${alpha(accentColor, 0.1)}`,
      },
    }}
  >
    {/* Card Header */}
    <Box
      sx={{
        px: 3,
        py: 2,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: alpha(accentColor, 0.04),
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(accentColor, 0.12),
          color: accentColor,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    {/* Card Body */}
    <Box sx={{ px: 3, py: 2.5 }}>{children}</Box>
  </Paper>
);
export default SectionCard;