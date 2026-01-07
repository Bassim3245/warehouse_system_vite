import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function MainInformationCard({ dataItem }) {
  return (
    <Card elevation={0} sx={{ mb: 3, border: "1px solid #000" }}>
      <Box
        sx={{
          bgcolor: "white",
          color: "#000",
          p: 2,
          textAlign: "center",
          borderBottom: "2px solid #000",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          معلومات المادة الأساسية
        </Typography>
      </Box>
      <CardContent sx={{ bgcolor: "white" }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 2,
                border: "1px solid #000",
                borderRadius: 0,
                bgcolor: "white",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#000",
                  mb: 2,
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                {dataItem?.name_of_material}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px dotted #000",
                    pb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    كود المادة:
                  </Typography>
                  <Typography variant="body2">
                    {dataItem?.cod_material}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px dotted #000",
                    pb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    المنشأ:
                  </Typography>
                  <Typography variant="body2">
                    {dataItem?.origin}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    وحدة القياس:
                  </Typography>
                  <Typography variant="body2">
                    {dataItem?.measuring_unit}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 2,
                border: "1px solid #000",
                borderRadius: 0,
                bgcolor: "white",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#000",
                  mb: 2,
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                معلومات المخزن
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px dotted #000",
                    pb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    اسم المخزن:
                  </Typography>
                  <Typography variant="body2">
                    {dataItem?.warehouse_name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px dotted #000",
                    pb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    المستخدم:
                  </Typography>
                  <Typography variant="body2">
                    {dataItem?.user_name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px dotted #000",
                    pb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    الرصيد الحالي:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {`${dataItem?.balance} ${dataItem?.measuring_unit}`}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    الحد الأدنى للمخزن:
                  </Typography>
                  <Typography variant="body2">
                    {dataItem?.minimum_stock_level}{" "}
                    {dataItem?.measuring_unit}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
