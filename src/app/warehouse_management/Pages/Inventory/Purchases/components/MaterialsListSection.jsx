import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useTranslation } from "react-i18next";
import MaterialsSummary from "./MaterialsSummary";
import MaterialsListTable from "./MaterialsListTable";
const MaterialsListSection = ({
  materialsList,
  handleRemoveMaterial,
  handleSaveAllMaterials,
  has_factory,
  has_lab,
  has_warehouse,
}) => {
  const { t } = useTranslation();
  const totalAmount = materialsList.reduce((sum, item) => sum + item.total, 0);

  if (materialsList.length === 0) {
    return null;
  }

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <AddIcon sx={{ mr: 1 }} />
          {t("المواد المضافة للمستند")} ({materialsList.length})
        </Typography>

        <MaterialsListTable
          materialsList={materialsList}
          handleRemoveMaterial={handleRemoveMaterial}
        />

        <MaterialsSummary
          totalAmount={totalAmount}
          materialsCount={materialsList.length}
          handleSaveAllMaterials={handleSaveAllMaterials}
          has_factory={has_factory}
          has_lab={has_lab}
          has_warehouse={has_warehouse}
        />
      </Paper>
    </Grid>
  );
};

export default MaterialsListSection;
