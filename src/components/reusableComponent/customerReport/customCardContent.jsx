import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
export default function CardContent({ totalImportQuantity, totalImportValue }) {
  return (
    <div>
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          borderTop: "2px solid #000",
          border: "1px solid #000",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
              {totalImportQuantity}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
              {totalImportValue}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
