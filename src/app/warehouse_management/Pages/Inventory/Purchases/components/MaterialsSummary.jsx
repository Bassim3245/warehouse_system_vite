import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";

const MaterialsSummary = ({
  totalAmount,
  materialsCount,
  handleSaveAllMaterials,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Card
        sx={{
          mt: 3,
          bgcolor: "#ffffff",
          border: "2px solid #1976d2",
          borderRadius: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent
          sx={{
            textAlign: "center",
            py: 3,
            px: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#1976d2",
              fontWeight: "700",
              fontSize: "1.25rem",
              mb: 2,
              letterSpacing: "0.5px",
            }}
          >
            ملخص المواد
          </Typography>

          <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              bgcolor: "#f8f9fa",
              padding: "16px 24px",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#333333",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              عدد المواد:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#1976d2",
                fontWeight: "700",
                fontSize: "1.1rem",
              }}
            >
              {materialsCount} مادة
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#f0f7ff",
              padding: "20px 24px",
              border: "2px solid #1976d2",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1976d2",
                fontWeight: "700",
                fontSize: "1.1rem",
              }}
            >
              الإجمالي الكلي:
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#d32f2f",
                fontWeight: "800",
                fontSize: "1.5rem",
                direction: "ltr",
              }}
            >
              {totalAmount.toLocaleString()} دينار
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          pb: 3,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSaveAllMaterials}
          sx={{
            px: 6,
            py: 2,
            fontSize: "1rem",
            fontWeight: "600",
            borderRadius: 0,
            bgcolor: "#2e7d32",
            color: "#ffffff",
            border: "2px solid #2e7d32",
            minWidth: "200px",
            textTransform: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            "&:hover": {
              bgcolor: "#1b5e20",
              borderColor: "#1b5e20",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            },
            "&:active": {
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            },
          }}
        >
          {t("حفظ جميع المواد")}
        </Button>
      </Box>
    </>
  );
};

export default MaterialsSummary;
