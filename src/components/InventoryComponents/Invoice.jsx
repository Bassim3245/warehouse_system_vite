import { Box, Typography } from "@mui/material";

export const InfoCard = ({ label, value, accent }) => (
    <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#ffffff" }}>
        <Typography variant="body2" sx={{ fontSize: "11px", mb: 0.5, textTransform: "uppercase", color: "#555" }}>
            {label}
        </Typography>
        <Typography
            variant="body2"
            sx={{
                fontSize: accent ? "14px" : "12px",
                fontWeight: "bold",
                color: accent ? "#e74c3c" : "#2c3e50",
            }}
        >
            {value || "---"}
        </Typography>
    </Box>
);

