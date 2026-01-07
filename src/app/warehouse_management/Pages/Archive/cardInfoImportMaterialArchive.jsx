import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function CardInfoImportMaterialArchive({ dataItem }) {
  return (
    <Card elevation={0} sx={{ mb: 3, border: "1px solid #000" }} dir="rtl">
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
          معلومات المختبر / الأرشفة
        </Typography>
      </Box>
      <CardContent sx={{ bgcolor: "white" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
                معلومات أساسية
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <InfoRow label="رقم المختبر:" value={dataItem?.Laboratory_id} />
                <InfoRow
                  label="رقم الأرشيف:"
                  value={dataItem?.archive_document_id}
                />
                <InfoRow
                  label="تاريخ الأرشفة:"
                  value={new Date(dataItem?.archived_at).toLocaleString()}
                />
                <InfoRow label="المستخدم:" value={dataItem?.user_name} />
                <InfoRow label="المخزن:" value={dataItem?.warehouse_name} />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
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
                تفاصيل المخزون
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <InfoRow
                  label="الكمية المتبقية:"
                  value={dataItem?.remaining_quantity}
                />
                <InfoRow
                  label="الحد الأدنى:"
                  value={`${dataItem?.minimum_stock_level} ${dataItem?.measuring_unit}`}
                />
                <InfoRow label="الحالة:" value={dataItem?.state_name} />
                <InfoRow
                  label="تاريخ الإنتاج:"
                  value={new Date(
                    dataItem?.production_date
                  ).toLocaleDateString()}
                />
                <InfoRow
                  label="تاريخ الانتهاء:"
                  value={new Date(dataItem?.expiry_date).toLocaleDateString()}
                />
                <InfoRow
                  label="تاريخ الشراء:"
                  value={new Date(dataItem?.purchase_date).toLocaleDateString()}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px dotted #000",
        pb: 1,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {label}
      </Typography>
      <Typography variant="body2">{value || "-"}</Typography>
    </Box>
  );
}
