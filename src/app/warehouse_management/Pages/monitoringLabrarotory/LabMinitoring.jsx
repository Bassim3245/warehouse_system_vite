import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../../../../components/reusableComponent/Loader";
import { useSearchParams } from "react-router-dom";
import { getAllWarehouse } from "../../../../redux/wharHosueState/WareHouseAction";
import { clearState } from "../../../../redux/Inventiry/InventorySlice";
import { CustomNoRowsOverlay } from "../../../../utils/Function";
import { BackendUrl } from "../../../../redux/api/axios";
import axios from "axios";
import { toast } from "react-toastify";

function LabMinitoring() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [openWarehouseDialog, setOpenWarehouseDialog] = useState(false);
  const token = getToken();
  const dispatch = useDispatch();
  const [paramsQuery] = useSearchParams();
  const { wareHouseData, loading } = useSelector((state) => state.wareHouse);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [InventoryData, setDataInventory] = useState([]);
  const [page, setPage] = useState(0);
  const dataUserById = getUserInformation()

  useEffect(() => {
    const { entity_id } = dataUserById || {};
    const lab_id = paramsQuery?.get("lab_id");
    const factory_id = paramsQuery?.get("factory_id");
    if (entity_id && lab_id) {
      dispatch(getAllWarehouse({ entity_id, lab_id, factory_id }));
    }
  }, [dispatch, dataUserById, paramsQuery]);
  const fetchInventoryData = async (store_id) => {
    const { entity_id, minister_id: minstry_id } = dataUserById || {};
    const lab_id = paramsQuery?.get("lab_id");
    const factory_id = paramsQuery?.get("factory_id");
    if (entity_id && minstry_id) {
      try {
        setIsLoading(true);
        const searchParams = new URLSearchParams();
        if (searchTerm.trim()) {
          searchParams.append("search_term", searchTerm.trim());
        }
        searchParams.append("entity_id", entity_id);
        searchParams.append("warehouse_id", store_id);
        searchParams.append("factory_id", factory_id);
        searchParams.append("lab_id", lab_id);
        searchParams.append("limit", limit);
        searchParams.append("page", page);
        const response = await axios.get(
          `${BackendUrl}/api/warehouse/SearchInventory?${searchParams.toString()}`,
          {
            headers: { authorization: token },
          }
        );
        setDataInventory(response.data.response || []);
        setTotalPages(response?.data?.pagination?.totalPages || 0);
        setTotalItems(response?.data?.pagination?.totalItems || 0);
      } catch (error) {
        setDataInventory([]);
        setTotalPages(0);
        setTotalItems(0);
        toast.error(error.response?.data?.message || "حدث خطأ أثناء البحث");
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedWarehouse) {
        fetchInventoryData(selectedWarehouse.id);
      }
    }, 300); // Debounce delay
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedWarehouse, page, limit]);

  const handleWarehouseClick = (store_id) => {
    setSelectedWarehouse({ id: store_id });
    setOpenWarehouseDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenWarehouseDialog(false);
    setSelectedWarehouse(null);
    dispatch(clearState());
  };
  return (
    <Box sx={{ p: 3 }} dir="rtl">
      {loading && <Loader />}
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        لوحة مراقبة المخازن
      </Typography>
      {Boolean(wareHouseData?.length) ? (
        <Grid container spacing={3}>
          {wareHouseData.map(({ id, name, location, used }) => (
            <Grid size={{ xs: 12, md: 6 }} key={id}>
              <Card
                sx={{
                  p: 2,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                onClick={() => handleWarehouseClick(id)}
              >
                <Typography variant="h6" color="primary">
                  {name}
                </Typography>
                <Typography variant="body1">الموقع: {location}</Typography>
                <Typography variant="body2">
                  النسبة المستخدمة: {used}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <CustomNoRowsOverlay />
      )}

      <Dialog
        open={openWarehouseDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        BackdropProps={{
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(3px)",
          },
        }}
      >
        {selectedWarehouse && (
          <>

            <DialogTitle sx={{ textAlign: "center" }}>
              {selectedWarehouse.name}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="بحث بالاسم أو المواصفات الفنية أو بستخدام الرقم الرمزي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TableContainer dir="rtl">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">اسم المادة</TableCell>
                      <TableCell align="right">نوع المستند</TableCell>

                      <TableCell align="right">الكمية الوالردة أو الصادرة</TableCell>
                      <TableCell align="right">الرصيد</TableCell>
                      <TableCell align="right">الحالة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {InventoryData.length > 0 ? (
                      InventoryData.map((item) => (
                        <TableRow key={item?.id}>
                          <TableCell align="right">
                            {item?.name_of_material}
                          </TableCell>
                          <TableCell align="right">
                            {item?.document_type}
                          </TableCell>
                          <TableCell align="right">
                            {item?.quantity_incoming_outgoing}
                          </TableCell>
                          <TableCell align="right">
                            {item?.balance}
                          </TableCell>
                          <TableCell align="right">
                            {item?.state_name}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <CustomNoRowsOverlay />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
export default LabMinitoring;
