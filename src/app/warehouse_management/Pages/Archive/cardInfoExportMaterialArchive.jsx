import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function CardInfoExportMaterialArchive({ dataItem }) {
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
          معلومات تصدير المواد / الأرشفة
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
                  value={dataItem?.archived_at ? new Date(dataItem.archived_at).toLocaleString() : "-"}
                />
                <InfoRow label="اسم المادة:" value={dataItem?.name_of_material} />
                <InfoRow label="كود المادة:" value={dataItem?.cod_material} />
                <InfoRow label="المخزن:" value={dataItem?.warehouse_name} />
                <InfoRow label="المنشأ:" value={dataItem?.origin} />
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
                تفاصيل التصدير
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <InfoRow
                  label="تاريخ التصدير:"
                  value={dataItem?.export_date ? new Date(dataItem.export_date).toLocaleDateString() : "-"}
                />
                <InfoRow
                  label="الكمية المصدرة:"
                  value={`${dataItem?.total_quantity || 0} ${dataItem?.measuring_unit || ""}`}
                />
                <InfoRow
                  label="المبلغ الإجمالي:"
                  value={`${dataItem?.total_amount || 0} دينار`}
                />
                <InfoRow
                  label="السعر للوحدة:"
                  value={`${dataItem?.price || 0} دينار`}
                />
              
                <InfoRow
                  label="الحد الأدنى:"
                  value={`${dataItem?.minimum_stock_level || 0} ${dataItem?.measuring_unit || ""}`}
                />
                <InfoRow label="المواصفات:" value={dataItem?.specification} />
                <InfoRow label="ملاحظات:" value={dataItem?.note} />
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
