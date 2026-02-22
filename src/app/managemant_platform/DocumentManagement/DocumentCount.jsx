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
import SaveIcon from "@mui/icons-material/Save";
import { useApi } from "../../../hooks/useApi";
import { toast } from "react-toastify";
import layoutStyle from "../../../style/layoutStyle";
import usePermissionUser from "../../../hooks/usePermissionUser";
import { SearchIcon } from "lucide-react";
import { typeDocument } from "../../../constants/arrayFuction";
const DocumentCount = () => {
  const { get, post, loading } = useApi();
  const [filters, setFilters] = useState({
    entity_id: "",
    warehouse_id: "",
    year: new Date().getFullYear(),
    document_type: "in",
    factory_id: "",
    lab_id: "",
  });

  const { Entities } = usePermissionUser();

  const [currentCount, setCurrentCount] = useState(null);
  const [newCount, setNewCount] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [data, setData] = useState({});
  // Fetch warehouses when entity changes
  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!filters.entity_id) {
        setWarehouses([]);
        setDocuments([]);
        setHasFetched(false);
        return;
      }
      try {
        const response = await get(
          "/api/warehouse/getWarehouseDataByEntity_id",
          { entity_id: filters.entity_id },
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

  const handleFetchCount = useCallback(async () => {
    if (!filters.entity_id || !filters.warehouse_id) {
      toast.warning("يرجى اختيار الجهة والمستودع");
      return;
    }
    try {
      const response = await get("/api/warehouse/documentCount", filters);
      if (response && response.data) {
        setData(response.data);
        setCurrentCount(response.data.last_count);
        setNewCount(response.data.last_count);
      } else {
        setCurrentCount(0);
        setNewCount(0);
        toast.info("لا يوجد عداد مسجل لهذه المعايير، سيتم البدء من 0");
      }
    } catch (error) {
      setCurrentCount(0);
      setNewCount(0);
      toast.info("لا يوجد عداد مسجل لهذه المعايير");
    }
  }, [filters, get]);
  useEffect(() => {
    handleFetchCount();
  }, [
    filters.entity_id,
    filters.warehouse_id,
    filters.year,
    filters.document_type,
  ]);
  const handleUpdateCount = useCallback(async () => {
    try {
      console.log("currentCount", currentCount);
      const response = await post("/api/warehouse/updateDocumentCount", {
        id: data.id,
        last_count: parseInt(newCount),
      });

      if (response) {
        toast.success("تم تحديث العداد بنجاح");
        setCurrentCount(newCount);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التحديث");
    }
  }, [filters, newCount, post]);

  return (
    <Box sx={{ ...layoutStyle, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          إدارة عدادات المستندات
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          يمكنك عرض وتعديل العداد الحالي للمستندات حسب السنة ونوع المستند.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>الجهة</InputLabel>
              <Select
                value={filters.entity_id}
                label="الجهة"
                onChange={(e) =>
                  setFilters({ entity_id: e.target.value, warehouse_id: "" })
                }
              >
                {Entities.map((ent) => (
                  <MenuItem key={ent.entities_id} value={ent.entities_id}>
                    {ent.Entities_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
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
                {warehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
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

          <Grid size={{ xs: 12, md: 4 }}>
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
              onClick={handleFetchCount}
              disabled={loading || !filters.warehouse_id}
              sx={{ height: 56 }}
            >
              بحث
            </Button>
          </Grid>
        </Grid>

        {currentCount !== null && (
          <Box sx={{ mt: 6 }}>
            <Divider sx={{ mb: 4 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  bgcolor: "primary.light",
                  borderRadius: 2,
                  color: "white",
                  width: "100%",
                  maxWidth: 300,
                }}
              >
                <Typography variant="subtitle1">العداد الحالي</Typography>
                <Typography variant="h2" fontWeight="bold">
                  {currentCount}
                </Typography>
              </Box>

              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ maxWidth: 400 }}
              >
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="العداد الجديد"
                    type="number"
                    value={newCount}
                    onChange={(e) => setNewCount(e.target.value)}
                    variant="filled"
                    helperText="تنبيه: تغيير العداد سيؤثر على ترقيم المستندات الجديدة"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleUpdateCount}
                    disabled={loading || newCount === ""}
                    sx={{ height: 56 }}
                  >
                    تحديث العداد
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DocumentCount;
