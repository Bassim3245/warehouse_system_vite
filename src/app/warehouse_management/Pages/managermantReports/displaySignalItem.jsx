import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import InventoryIcon from "@mui/icons-material/Inventory";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PrintIcon from "@mui/icons-material/Print";
import ViewListIcon from "@mui/icons-material/ViewList";
import TableChartIcon from "@mui/icons-material/TableChart";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from "@mui/icons-material/Description";

import { useReactToPrint } from "react-to-print";
import { exportBalanceSummaryToExcel, exportDetailedDataToExcel } from "../../../../utils/reportUtils/ExcelExportUtils";
import { formatCurrency, FormatDataNumber } from "../../../../utils/formatData";


// ==================== BALANCE SUMMARY VIEW (Simple Table) ====================
const BalanceSummaryView = ({ materials, dataUserById, printRef }) => {
  // Calculate totals
  const totalBalance = materials.reduce((sum, m) => sum + parseFloat(m.balance || 0), 0);

  return (
    <Box ref={printRef} sx={{ p: 2 }}>
      {/* Print Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid #000",
          bgcolor: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
          <InventoryIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          تقرير أرصدة المواد في المخازن
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#000" }}>
          {dataUserById?.Entities_name}
        </Typography>
        <Typography variant="caption" sx={{ color: "#666" }}>
          تاريخ الطباعة: {new Date().toLocaleDateString("ar-IQ")}
        </Typography>
      </Paper>

      {/* Summary Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #000" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#1976d2" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center", width: 50 }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                اسم المادة
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                رمز المادة
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                المخزن
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                المصنع
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                المعمل
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                الرصيد
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                الوحدة
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material, index) => (
              <TableRow
                key={material.id || index}
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "#f5f5f5" },
                  "&:hover": { bgcolor: "#e3f2fd" },
                }}
              >
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {material.name_of_material}
                </TableCell>
                <TableCell>
                  {material.cod_material}
                </TableCell>
                <TableCell>
                  {material.warehouse_name || "-"}
                </TableCell>
                <TableCell>
                  {material.Factories_name || "-"}
                </TableCell>
                <TableCell>
                  {material.Laboratory_name || "-"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip
                    label={FormatDataNumber(material.balance)}
                    color={parseFloat(material.balance) > 0 ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: "bold", minWidth: 60 }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {material.measuring_unit}
                </TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow sx={{ bgcolor: "#e8f5e9" }}>
              <TableCell colSpan={6} sx={{ fontWeight: "bold", textAlign: "left" }}>
                الإجمالي
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <Chip
                  label={FormatDataNumber(totalBalance)}
                  color="primary"
                  sx={{ fontWeight: "bold", minWidth: 60 }}
                />
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#666" }}>
          عدد المواد: {materials.length} | إجمالي الأرصدة: {FormatDataNumber(totalBalance)}
        </Typography>
      </Box>
    </Box>
  );
};

// ==================== BALANCE SUMMARY DIALOG ====================
export const BalanceSummaryDialog = ({ open, onClose, dataItem, dataUserById }) => {
  const printRef = useRef();
  const materials = Array.isArray(dataItem) ? dataItem : [dataItem];

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "تقرير أرصدة المواد",
  });

  if (!materials || materials.length === 0) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: "70vh" },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TableChartIcon />
          <Typography variant="h6">أرصدة المواد في المخازن</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <BalanceSummaryView
          materials={materials}
          dataUserById={dataUserById}
          printRef={printRef}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
        <Button onClick={onClose} variant="outlined">
          إغلاق
        </Button>
        <Button
          onClick={() => exportBalanceSummaryToExcel(materials, dataUserById)}
          variant="contained"
          startIcon={<FileDownloadIcon />}
          color="success"
        >
          تصدير ملخص Excel
        </Button>
        <Button
          onClick={() => exportDetailedDataToExcel(materials, dataUserById)}
          variant="contained"
          startIcon={<DescriptionIcon />}
          color="warning"
        >
          تصدير تفصيلي Excel
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<PrintIcon />}
          color="primary"
        >
          طباعة التقرير
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ==================== DETAILED VIEW COMPONENTS ====================

// Material Info Card Component
const MaterialInfoCard = ({ material }) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #1976d2",
        mb: 2,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
          معلومات المادة
        </Typography>
        <Chip
          label={`الرصيد: ${material.balance} ${material.measuring_unit}`}
          sx={{ bgcolor: "white", color: "#1976d2", fontWeight: "bold" }}
        />
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 , md: 6 }}>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", minWidth: 120 }}>اسم المادة:</Typography>
              <Typography>{material.name_of_material}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", minWidth: 120 }}>رمز المادة:</Typography>
              <Typography>{material.cod_material}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", minWidth: 120 }}>المواصفات:</Typography>
              <Typography>{material.specification || "غير محدد"}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", minWidth: 120 }}>المنشأ:</Typography>
              <Typography>{material.origin || "غير محدد"}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 , md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", minWidth: 80 }}>المخزن:</Typography>
              <Typography>{material.warehouse_name}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", minWidth: 80 }}>المستخدم:</Typography>
              <Typography>{material.user_name}</Typography>
            </Box>
            {material.Factories_name && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "bold", minWidth: 80 }}>المصنع:</Typography>
                <Typography>{material.Factories_name}</Typography>
              </Box>
            )}
            {material.Laboratory_name && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "bold", minWidth: 80 }}>المعمل:</Typography>
                <Typography>{material.Laboratory_name}</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", minWidth: 120 }}>الحد الأدنى:</Typography>
              <Typography>{FormatDataNumber(material.minimum_stock_level)} {material.measuring_unit}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Imports Table Component
const ImportsSection = ({ imports, measuring_unit }) => {
  const [expanded, setExpanded] = useState(false);
  const totalQuantity = imports?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const totalValue = imports?.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0) || 0;

  if (!imports || imports.length === 0) {
    return (
      <Card elevation={0} sx={{ border: "1px solid #388e3c", mb: 2, borderRadius: 2 }}>
        <Box sx={{ bgcolor: "#388e3c", color: "white", p: 1, display: "flex", alignItems: "center" }}>
          <ArrowDownwardIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>سجل الواردات</Typography>
        </Box>
        <CardContent sx={{ textAlign: "center", p: 2 }}>
          <Typography>لا توجد واردات مسجلة</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: "1px solid #388e3c", mb: 2, borderRadius: 2 }}>
      <Box
        sx={{
          bgcolor: "#388e3c",
          color: "white",
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArrowDownwardIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            سجل الواردات ({imports.length} عملية)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip label={`الكمية: ${FormatDataNumber(totalQuantity)} ${measuring_unit}`} size="small" sx={{ bgcolor: "white", color: "#388e3c" }} />
          <Chip label={`القيمة: ${formatCurrency(totalValue)}`} size="small" sx={{ bgcolor: "white", color: "#388e3c" }} />
          <IconButton size="small" sx={{ color: "white" }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#e8f5e9" }}>
                <TableCell sx={{ fontWeight: "bold" }}>رقم المستند</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>تاريخ المستند</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>الجهة المستفيدة</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">الكمية</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">السعر</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">الإجمالي</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">الكمية المتبقية</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {imports.map((item, index) => (
                <TableRow key={item.id || index} sx={{ "&:nth-of-type(odd)": { bgcolor: "#f5f5f5" } }}>
                  <TableCell>{item.document?.number || "-"}</TableCell>
                  <TableCell>{item.document?.date || "-"}</TableCell>
                  <TableCell>{item.document?.beneficiary || "-"}</TableCell>
                  <TableCell align="center">{FormatDataNumber(item.quantity)}</TableCell>
                  <TableCell align="center">{item.price?.toLocaleString()}</TableCell>
                  <TableCell align="center">{formatCurrency(item.quantity * item.price)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={FormatDataNumber(item.remaining_quantity)}
                      size="small"
                      color={item.remaining_quantity > 0 ? "success" : "default"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Card>
  );
};

// Exports Table Component
const ExportsSection = ({ exports, measuring_unit }) => {
  const [expanded, setExpanded] = useState(false);
  const totalQuantity = exports?.reduce((sum, item) => sum + (item.total_quantity || 0), 0) || 0;
  const totalValue = exports?.reduce((sum, item) => sum + (item.total_amount || 0), 0) || 0;

  if (!exports || exports.length === 0) {
    return (
      <Card elevation={0} sx={{ border: "1px solid #d32f2f", mb: 2, borderRadius: 2 }}>
        <Box sx={{ bgcolor: "#d32f2f", color: "white", p: 1, display: "flex", alignItems: "center" }}>
          <ArrowUpwardIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>سجل الصادرات</Typography>
        </Box>
        <CardContent sx={{ textAlign: "center", p: 2 }}>
          <Typography>لا توجد صادرات مسجلة - جميع الكميات متوفرة في المخزن</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: "1px solid #d32f2f", mb: 2, borderRadius: 2 }}>
      <Box
        sx={{
          bgcolor: "#d32f2f",
          color: "white",
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArrowUpwardIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            سجل الصادرات ({exports.length} عملية)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip label={`الكمية: ${FormatDataNumber(totalQuantity)} ${measuring_unit}`} size="small" sx={{ bgcolor: "white", color: "#d32f2f" }} />
          <Chip label={`القيمة: ${formatCurrency(totalValue)}`} size="small" sx={{ bgcolor: "white", color: "#d32f2f" }} />
          <IconButton size="small" sx={{ color: "white" }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#ffebee" }}>
                <TableCell sx={{ fontWeight: "bold" }}>رقم المستند</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>تاريخ المستند</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>الجهة المستفيدة</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">الكمية الإجمالية</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">المبلغ الإجمالي</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ملاحظات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exports.map((item, index) => (
                <TableRow key={item.id || index} sx={{ "&:nth-of-type(odd)": { bgcolor: "#f5f5f5" } }}>
                  <TableCell>{item.document?.number || "-"}</TableCell>
                  <TableCell>{item.document?.date || "-"}</TableCell>
                  <TableCell>{item.document?.beneficiary || "-"}</TableCell>
                  <TableCell align="center">{FormatDataNumber(item.total_quantity)} {measuring_unit}</TableCell>
                  <TableCell align="center">{formatCurrency(item.total_amount)}</TableCell>
                  <TableCell>{item.note || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Card>
  );
};

// Single Material Item Component
const MaterialItem = ({ material, index }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card
      elevation={2}
      sx={{
        mb: 3,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Material Header */}
      <Box
        sx={{
          bgcolor: "#1565c0",
          color: "white",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={index + 1}
            sx={{ bgcolor: "white", color: "#1565c0", fontWeight: "bold", minWidth: 35 }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {material.name_of_material}
          </Typography>
          <Chip
            icon={<WarehouseIcon sx={{ color: "#fff !important" }} />}
            label={material.warehouse_name}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={`الرصيد: ${FormatDataNumber(material.balance)} ${material.measuring_unit}`}
            sx={{ bgcolor: "#4caf50", color: "white", fontWeight: "bold" }}
          />
          <IconButton size="small" sx={{ color: "white" }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Material Info */}
          <MaterialInfoCard material={material} />

          {/* Imports Section */}
          <ImportsSection imports={material.imports} measuring_unit={material.measuring_unit} />

          {/* Exports Section */}
          <ExportsSection exports={material.exports} measuring_unit={material.measuring_unit} />
        </Box>
      </Collapse>
    </Card>
  );
};

// ==================== MAIN COMPONENT ====================
const DisplaySignalItem = ({ dataItem, dataUserById }) => {
  const [viewMode, setViewMode] = useState("detailed"); // "detailed" or "summary"
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);

  // Handle both array and object formats
  const materials = Array.isArray(dataItem) ? dataItem : [dataItem];

  if (!materials || materials.length === 0) {
    return (
      <Box sx={{ m: 2, textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          لا توجد بيانات للعرض
        </Typography>
      </Box>
    );
  }

  // Calculate totals across all materials
  const totalBalance = materials.reduce((sum, m) => sum + parseFloat(m.balance || 0), 0);
  const totalImports = materials.reduce((sum, m) => sum + (m.imports?.length || 0), 0);
  const totalExports = materials.reduce((sum, m) => sum + (m.exports?.length || 0), 0);

  return (
    <Box sx={{ m: 2 }} >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #1976d2",
          bgcolor: "white",
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#1976d2",
              fontWeight: "bold",
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InventoryIcon sx={{ mr: 1, fontSize: 28 }} />
            تقرير المخزون التفصيلي
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#666", fontWeight: "bold" }}>
            {dataUserById?.Entities_name}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* View Mode Toggle & Summary Button */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="detailed">
              <ViewListIcon sx={{ mr: 1 }} />
              عرض تفصيلي
            </ToggleButton>
            <ToggleButton value="summary">
              <TableChartIcon sx={{ mr: 1 }} />
              عرض ملخص
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            color="success"
            startIcon={<PrintIcon />}
            onClick={() => setSummaryDialogOpen(true)}
          >
            طباعة تقرير الأرصدة
          </Button>
        </Box>

        {/* Summary Stats */}
        <Grid container spacing={2} justifyContent="center">
          <Grid>
            <Chip
              icon={<WarehouseIcon />}
              label={`عدد المواد: ${materials.length}`}
              color="primary"
              sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
            />
          </Grid>
          <Grid>
            <Chip
              label={`إجمالي الرصيد: ${FormatDataNumber(totalBalance)} ${materials[0].measuring_unit}`}
              color="success"
              sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
            />
          </Grid>
          <Grid >
            <Chip
              icon={<ArrowDownwardIcon />}
              label={`إجمالي الواردات: ${FormatDataNumber(totalImports)} عملية`}
              sx={{ bgcolor: "#388e3c", color: "white", fontWeight: "bold", fontSize: "0.9rem" }}
            />
          </Grid>
          <Grid >
            <Chip
              icon={<ArrowUpwardIcon />}
              label={`إجمالي الصادرات: ${FormatDataNumber(totalExports)} عملية`}
              sx={{ bgcolor: "#d32f2f", color: "white", fontWeight: "bold", fontSize: "0.9rem" }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Content based on view mode */}
      <Box dir="rtl">
        {viewMode === "detailed" ? (
          // Detailed View - Materials List
          materials.map((material, index) => (
            <MaterialItem key={material.id || index} material={material} index={index} />
          ))
        ) : (
          // Summary View - Simple Table
          <BalanceSummaryView materials={materials} dataUserById={dataUserById} />
        )}

        {/* Balance Summary Dialog for Printing */}
        <BalanceSummaryDialog
          open={summaryDialogOpen}
          onClose={() => setSummaryDialogOpen(false)}
          dataItem={dataItem}
          dataUserById={dataUserById}
        />
      </Box>
    </Box>
  );
};

export default DisplaySignalItem;
