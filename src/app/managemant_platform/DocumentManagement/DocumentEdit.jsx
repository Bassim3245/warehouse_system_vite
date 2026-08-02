import { useState, useCallback, useEffect, useMemo } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import { useApi } from "../../../hooks/useApi";
import { toast } from "react-toastify";
import layoutStyle from "../../../style/layoutStyle";
import { typeDocument } from "../../../constants/arrayFuction";
import useEntities from "../../../hooks/genaral/useEntities";

const DOC_TYPE_LABELS = {
  in: { label: "وارد", color: "success" },
  out: { label: "صادر", color: "error" },
  internal_consumption: { label: "استهلاك داخلي", color: "warning" },
};

const DocumentEdit = () => {
  const { get, post, loading } = useApi();
  const { Entities } = useEntities();

  const [filters, setFilters] = useState({
    entity_id: "",
    warehouse_id: "",
    document_type: "",
  });

  // Client-side year filter (separate from API filters)
  const [selectedYear, setSelectedYear] = useState("");

  const [warehouses, setWarehouses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editData, setEditData] = useState({
    document_date: "",
    beneficiary: "",
    total_amount: 0,
    document_number: "",
    description: "",
  });

  // Extract unique years from fetched documents
  const availableYears = useMemo(() => {
    const years = documents
      .map((doc) =>
        doc.document_date ? new Date(doc.document_date).getFullYear() : null
      )
      .filter(Boolean);
    return [...new Set(years)].sort((a, b) => b - a); // descending
  }, [documents]);

  // Apply year filter to documents for display
  const filteredDocuments = useMemo(() => {
    if (!selectedYear) return documents;
    return documents.filter(
      (doc) =>
        doc.document_date &&
        new Date(doc.document_date).getFullYear() === Number(selectedYear)
    );
  }, [documents, selectedYear]);

  // Reset year filter when new search is done
  const resetYearFilter = () => setSelectedYear("");

  // Fetch warehouses when entity changes
  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!filters.entity_id) {
        setWarehouses([]);
        setDocuments([]);
        setHasFetched(false);
        resetYearFilter();
        return;
      }
      try {
        const response = await get(
          "/api/warehouse/getWarehouseDataByEntity_id",
          { entity_id: filters.entity_id }
        );
        if (response?.data) setWarehouses(response.data);
        else setWarehouses([]);
      } catch (error) {
        console.error("Error fetching warehouses", error);
        setWarehouses([]);
      }
    };
    fetchWarehouses();
  }, [filters.entity_id, get]);

  const handleSearch = useCallback(async () => {
    if (!filters.warehouse_id) {
      toast.warning("يرجى اختيار المستودع أولاً");
      return;
    }
    try {
      const response = await get(
        `/api/warehouse/documentGetDataByWarehouseAndDocumentType`,
        {
          document_type: filters.document_type,
          warehouse_id: filters.warehouse_id,
        }
      );
      if (response?.data) {
        setDocuments(response.data);
      } else {
        setDocuments([]);
      }
      resetYearFilter(); // clear year filter on each new search
      setHasFetched(true);
    } catch (error) {
      setDocuments([]);
      setHasFetched(true);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء البحث");
    }
  }, [filters.warehouse_id, filters.document_type, get]);

  const handleOpenEdit = (doc) => {
    setSelectedDoc(doc);
    setEditData({
      document_date: doc.document_date ? doc.document_date.split("T")[0] : "",
      beneficiary: doc.beneficiary || "",
      total_amount: doc.total_amount || 0,
      description: doc.description || "",
      document_number: doc.document_number || "",
    });
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedDoc(null);
  };

  const handleUpdate = useCallback(async () => {
    if (!selectedDoc) return;
    try {
      const response = await post("/api/warehouse/documentEdit", {
        ...editData,
        document_number: selectedDoc.document_number,
        documentId: selectedDoc.id,
      });
      if (response) {
        toast.success("تم تحديث المستند بنجاح");
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === selectedDoc.id ? { ...d, ...editData } : d
          )
        );
        handleCloseEdit();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التحديث");
    }
  }, [selectedDoc, editData, post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const safeEntities = Entities || [];
  const safeWarehouses = warehouses || [];

  return (
    <Box sx={{ ...layoutStyle, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          تعديل معلومات المستند
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          اختر الجهة والمستودع لعرض المستندات المتاحة وتعديلها.
        </Typography>

        {/* API Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>الجهة</InputLabel>
              <Select
                value={filters.entity_id}
                label="الجهة"
                onChange={(e) =>
                  setFilters({
                    entity_id: e.target.value,
                    warehouse_id: "",
                    document_type: "",
                  })
                }
              >
                {safeEntities.map((ent) => (
                  <MenuItem key={ent.entities_id} value={ent.entities_id}>
                    {ent.Entities_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth disabled={!filters.entity_id}>
              <InputLabel>المستودع</InputLabel>
              <Select
                value={filters.warehouse_id}
                label="المستودع"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    warehouse_id: e.target.value,
                  }))
                }
              >
                {safeWarehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>نوع المستند</InputLabel>
              <Select
                value={filters.document_type}
                label="نوع المستند"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    document_type: e.target.value,
                  }))
                }
              >
                {typeDocument.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
              onClick={handleSearch}
              disabled={loading || !filters.warehouse_id}
              sx={{ height: 56 }}
            >
              بحث
            </Button>
          </Grid>
        </Grid>

        {/* Documents Table */}
        {hasFetched && (
          <>
            <Divider sx={{ mb: 3 }} />

            {/* Table header row: title + year filter */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                المستندات{" "}
                <Typography component="span" color="text.secondary" variant="body1">
                  ({filteredDocuments.length}
                  {selectedYear ? ` من ${documents.length}` : ""} مستند)
                </Typography>
              </Typography>

              {/* Year Filter — only shown after fetch and when years exist */}
              {availableYears.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>تصفية بالسنة</InputLabel>
                  <Select
                    value={selectedYear}
                    label="تصفية بالسنة"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>كل السنوات</em>
                    </MenuItem>
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>

            {filteredDocuments.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={6}>
                {selectedYear
                  ? `لا توجد مستندات للسنة ${selectedYear}`
                  : "لا توجد مستندات لهذا المستودع"}
              </Typography>
            ) : (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                <Table size="small" sx={{ minWidth: 950 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.main" }}>
                      {[
                        "#",
                        "رقم المستند",
                        "النوع",
                        "التاريخ",
                        "المستفيد",
                        "المبلغ",
                        "المستودع",
                        "بواسطة",
                        "الإتمام",
                        "تعديل",
                      ].map((h) => (
                        <TableCell
                          key={h}
                          align="center"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            py: 1.5,
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDocuments.map((doc, index) => {
                      const typeInfo = DOC_TYPE_LABELS[doc.document_type] || {
                        label: doc.document_type,
                        color: "default",
                      };
                      return (
                        <TableRow
                          key={doc.id}
                          hover
                          sx={{
                            "&:nth-of-type(even)": { bgcolor: "grey.50" },
                          }}
                        >
                          <TableCell align="center" sx={{ color: "text.secondary" }}>
                            {index + 1}
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            {doc.document_number}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={typeInfo.label}
                              color={typeInfo.color}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                            {doc.document_date
                              ? new Date(doc.document_date).toLocaleDateString("ar-IQ")
                              : "-"}
                          </TableCell>
                          <TableCell align="center">
                            {doc.beneficiary || "-"}
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                            {doc.total_amount != null
                              ? Number(doc.total_amount).toLocaleString("ar-IQ")
                              : "-"}
                          </TableCell>
                          <TableCell align="center">{doc.warehouse_name}</TableCell>
                          <TableCell align="center">{doc.user_name}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={doc.is_complete ? "مكتمل" : "قيد التنفيذ"}
                              color={doc.is_complete ? "success" : "warning"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="تعديل المستند">
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleOpenEdit(doc)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ fontWeight: "bold", borderBottom: "1px solid", borderColor: "divider" }}
        >
          تعديل المستند رقم ({selectedDoc?.document_number})
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="تاريخ المستند"
                type="date"
                name="document_date"
                value={editData.document_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="المستفيد"
                name="beneficiary"
                value={editData.beneficiary}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="المبلغ الإجمالي"
                name="total_amount"
                type="number"
                value={editData.total_amount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="رقم المستند"
                name="document_number"
                type="number"
                value={editData.document_number}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="السنة"
                value={
                  editData.document_date
                    ? new Date(editData.document_date).getFullYear()
                    : ""
                }
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="الوصف / الملاحظات"
                name="description"
                multiline
                rows={3}
                value={editData.description}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  معلومات غير قابلة للتعديل:
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">
                      <strong>المستودع:</strong> {selectedDoc?.warehouse_name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">
                      <strong>بواسطة:</strong> {selectedDoc?.user_name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">
                      <strong>النوع:</strong>{" "}
                      {DOC_TYPE_LABELS[selectedDoc?.document_type]?.label ||
                        selectedDoc?.document_type}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseEdit} color="inherit" variant="outlined">
            إلغاء
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            onClick={handleUpdate}
            disabled={loading}
          >
            حفظ التعديلات
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentEdit;