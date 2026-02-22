import { useState, useCallback, useEffect } from "react";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SaveIcon from "@mui/icons-material/Save";
import { useApi } from "../../../hooks/useApi";
import { toast } from "react-toastify";
import layoutStyle from "../../../style/layoutStyle";
import usePermissionUser from "../../../hooks/usePermissionUser";
import { SearchIcon } from "lucide-react";
import { typeDocument } from "../../../constants/arrayFuction";
import CustomDatePicker from "../../../components/reusableComponent/CustomDatePicker";
import dayjs from "dayjs";

const DocumentCount = () => {
  const { get, post, loading } = useApi();
  const [filters, setFilters] = useState({
    entity_id: "",
    year: dayjs(),
    document_type: "",
  });

  const { Entities } = usePermissionUser();
  const [allCounts, setAllCounts] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newCountValue, setNewCountValue] = useState("");

  const fetchAllCounts = useCallback(async () => {
    try {
      const params = {
        entity_id: filters.entity_id,
        year: filters.year ? filters.year.year() : "",
        document_type: filters.document_type,
      };
      const response = await get("/api/warehouse/documentCount", params);
      if (response?.data) {
        setAllCounts(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setAllCounts([]);
      }
    } catch (error) {
      console.error("Error fetching all counts", error);
      setAllCounts([]);
    }
  }, [filters, get]);

  useEffect(() => {
    fetchAllCounts();
  }, [fetchAllCounts]);

  const handleOpenEdit = (record) => {
    setSelectedRecord(record);
    setNewCountValue(record.last_count);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleUpdateCount = async () => {
    if (!selectedRecord) return;
    try {
      const response = await post("/api/warehouse/updateDocumentCount", {
        id: selectedRecord.id,
        last_count: parseInt(newCountValue),
      });
      if (response) {
        toast.success("تم تحديث العداد بنجاح");
        handleCloseEdit();
        fetchAllCounts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التحديث");
    }
  };

  return (
    <Box sx={{ ...layoutStyle, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          إدارة عدادات المستندات
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          عرض وتعديل عدادات المستندات لجميع الجهات والمستودعات.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>الجهة</InputLabel>
              <Select
                value={filters.entity_id}
                label="الجهة"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, entity_id: e.target.value }))
                }
              >
                <MenuItem value="">الكل</MenuItem>
                {Entities.map((ent) => (
                  <MenuItem key={ent.entities_id} value={ent.entities_id}>
                    {ent.Entities_name}
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
                <MenuItem value="">الكل</MenuItem>
                {typeDocument.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <CustomDatePicker
              label="السنة"
              value={filters.year}
              setValue={(v) =>
                setFilters((prev) => ({ ...prev, year: v }))
              }
              format="YYYY"
              haswidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={fetchAllCounts}
              sx={{ height: 56 }}
            >
              بحث / تحديث
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} dir="rtl">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>الجهة</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>المستودع / القسم</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>نوع المستند</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>السنة</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>العداد الحالي</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : allCounts.length > 0 ? (
                allCounts.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.Entities_name || row.entity_id}</TableCell>
                    <TableCell>
                      {row.warehouse_name || row.Laboratory_name || row.Factories_name || "-"}
                    </TableCell>
                    <TableCell>
                      {typeDocument.find((t) => t.value === row.document_type)?.label || row.document_type}
                    </TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary">
                        {row.last_count}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    لا توجد بيانات متاحة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEdit} dir="rtl">
        <DialogTitle sx={{ textAlign: "right", fontWeight: "bold" }}>تعديل عداد المستند</DialogTitle>
        <DialogContent sx={{ minWidth: 300, mt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            الجهة: {selectedRecord?.Entities_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            النوع: {typeDocument.find((t) => t.value === selectedRecord?.document_type)?.label} | السنة: {selectedRecord?.year}
          </Typography>
          <TextField
            fullWidth
            label="العداد الجديد"
            type="number"
            value={newCountValue}
            onChange={(e) => setNewCountValue(e.target.value)}
            sx={{ mt: 2 }}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEdit} color="inherit">إلغاء</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleUpdateCount}
          >
            حفظ التغييرات
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentCount;