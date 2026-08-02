import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { getToken, getUserInformation } from "../../../../utils/handelCookie";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../../../../components/reusableComponent/Loader";
import { useSearchParams } from "react-router-dom";
import { CustomNoRowsOverlay } from "../../../../utils/Function";
import { BackendUrl } from "../../../../redux/api/axios";
import axios from "axios";

// Import RTK Query hook
import { useGetAllWarehouseQuery } from "../../../../redux/wharHosueState/WarehouseApi";

function LabMinitoring() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [openWarehouseDialog, setOpenWarehouseDialog] = useState(false);
  const token = getToken();
  const [paramsQuery] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [InventoryData, setDataInventory] = useState([]);
  const [page, setPage] = useState(0);
  const dataUserById = getUserInformation();

  const entity_id = dataUserById?.entity_id;
  const lab_id = paramsQuery?.get("lab_id");
  const factory_id = paramsQuery?.get("factory_id");

  const shouldFetch = !!entity_id && !!lab_id;

  const { data: wareHouseData = [], isFetching: loading } = useGetAllWarehouseQuery(
    { entity_id, lab_id, factory_id },
    { skip: !shouldFetch }
  );

  const fetchInventoryData = async (store_id) => {
    const { entity_id, minister_id: minstry_id } = dataUserById || {};
    const lab_id = paramsQuery?.get("lab_id");
    const factory_id = paramsQuery?.get("factory_id");
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${BackendUrl}/api/warehouse/inventoryGetData?entity_id=${entity_id}&warehouse_id=${store_id}&lab_id=${lab_id}&factory_id=${factory_id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setDataInventory(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 0);
      setTotalItems(res.data.pagination?.totalItems || 0);
    } catch (error) {
      console.error(error);
      setDataInventory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWarehouses = useMemo(() => {
    return wareHouseData.filter((warehouse) =>
      warehouse.Warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [wareHouseData, searchTerm]);

  return (
    <Box sx={{ p: 3, direction: "rtl" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        مراقبة مخازن المختبر
      </Typography>

      <TextField
        placeholder="بحث عن مخزن..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, width: "300px" }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={3}>
          {filteredWarehouses.map((warehouse) => (
            <Grid item xs={12} sm={6} md={4} key={warehouse.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6 },
                  transition: "0.3s",
                }}
                onClick={() => {
                  setSelectedWarehouse(warehouse);
                  fetchInventoryData(warehouse.id);
                  setOpenWarehouseDialog(true);
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {warehouse.Warehouse_name}
                  </Typography>
                  <Typography color="textSecondary" sx={{ mt: 1 }}>
                    الموقع: {warehouse.location || "غير محدد"}
                  </Typography>
                  <Typography color="textSecondary">
                    أمين المخزن: {warehouse.user_name || "غير محدد"}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openWarehouseDialog}
        onClose={() => setOpenWarehouseDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          تفاصيل مخزن: {selectedWarehouse?.Warehouse_name}
        </DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">اسم المادة</TableCell>
                    <TableCell align="right">الكمية</TableCell>
                    <TableCell align="right">الوحدة</TableCell>
                    <TableCell align="right">تاريخ الصلاحية</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {InventoryData.length > 0 ? (
                    InventoryData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell align="right">{item.Material_name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.Unit_name}</TableCell>
                        <TableCell align="right">
                          {item.expiry_date
                            ? new Date(item.expiry_date).toLocaleDateString("ar-EG")
                            : "غير محدد"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <CustomNoRowsOverlay />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default LabMinitoring;
