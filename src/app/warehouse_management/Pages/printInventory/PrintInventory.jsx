import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import LocalPrintshopOutlined from "@mui/icons-material/LocalPrintshopOutlined";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { toast } from "react-toastify";
import { getToken } from "../../../../utils/handelCookie";
import { BackendUrl } from "../../../../redux/api/axios";
import { StyledTableCell, StyledTableRow } from "../../../../style/generalStyle";
import {
  FormatDataNumber,
  formatDateAr,
} from "../../../../utils/formatData";
import { cellStyles, InfoRow, TableHeader } from "./utils";
import useUserPermissions from "../../../../hooks/genaral/useUserPermissions";
import { useGetWarehouseDataByIdQuery } from "../../../../redux/wharHosueState/WarehouseApi";

const PrintInventory = () => {
  const [searchParams] = useSearchParams();
  const componentRef = useRef();
  const [dataMaterials, setDataMaterials] = useState([]);
  const [filterDocument, setFilterDocument] = useState("in");
  const [loading, setLoading] = useState(false);
  const [refreshButton, setRefreshButton] = useState(false);

  const store_id = searchParams.get("store_id");
  const { data: warehouseDataBYId } = useGetWarehouseDataByIdQuery(
    store_id,
    { skip: !store_id }
  );
  const token = getToken();
  const { dataUserById } = useUserPermissions();

  const fetchInventoryData = async () => {
    if (!dataUserById?.entity_id || !store_id) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        entity_id: dataUserById.entity_id,
        warehouse_id: store_id,
        document_type: filterDocument,
      });

      const response = await axios.get(
        `${BackendUrl}/api/warehouse/inventoryGetData?${params.toString()}`,
        { headers: { authorization: token } }
      );
      setDataMaterials(response?.data?.data || []);
    } catch (error) {
      setDataMaterials([]);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء البحث");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [refreshButton, filterDocument]);

  // Removed old useEffect for getWarehouseDataById since it's now handled by the query hook

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve, reject) => {
        if (!componentRef.current || !dataMaterials?.length) {
          reject("No content to print");
          return;
        }
        document.body.classList.add("printing");
        setTimeout(resolve, 100);
      });
    },
    onAfterPrint: () => document.body.classList.remove("printing"),
    onPrintError: (error) => {
      console.error("Print failed:", error);
      toast.error("فشل الطباعة. يرجى المحاولة مرة أخرى");
    },
    pageStyle: `
      @page {
        size: landscape !important;
        margin: 4mm !important;
      }
      @media print {
        body { direction: rtl !important; }
      }
    `,
  });
  return (
    <Box sx={{ m: 3, direction: "rtl" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={handlePrint}
          disabled={loading || !dataMaterials?.length}
          startIcon={<LocalPrintshopOutlined />}
        >
          طباعة الجرد
        </Button>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>نوع المستند</InputLabel>
          <Select
            value={filterDocument}
            onChange={(e) => setFilterDocument(e.target.value)}
            label="نوع المستند"
          >
            <MenuItem value="in">مستند وارد</MenuItem>
            <MenuItem value="out">مستند صادر</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => setRefreshButton(!refreshButton)}>
          تحديث
        </Button>
      </Box>
      {/* منطقة الطباعة */}
      <Box
        ref={componentRef}
        sx={{
          p: 2,
          backgroundColor: "#fff",
          borderRadius: 1,
          boxShadow: 1,
          direction: "rtl",
          "@media print": {
            p: 0,
            m: 0,
            boxShadow: "none",
            backgroundColor: "white !important",
          },
        }}
      >
        {/* الهيدر المتوازن */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
            mb: 2,
            borderBottom: "2px solid #eee",
            "@media print": {
              borderBottom: "2px solid #000",
            },
          }}
        >
          {/* المعلومات اليسرى */}
          <Box sx={{ flex: 1 }}>
            <InfoRow label="الشركة" value={dataUserById?.Entities_name} />
            <InfoRow label="المصنع" value={warehouseDataBYId?.Factories_name} />
          </Box>

          {/* العنوان الوسطي */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1976d2",
                fontFamily: "Times New Roman, sans-serif !important",
                mb: 1,
              }}
            >
              استمارة نظام الموجودات المخزنية
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#666",
                fontFamily: "Times New Roman, sans-serif !important",
              }}
            >
              {new Date().toLocaleDateString("ar-EG")}
            </Typography>
          </Box>

          {/* المعلومات اليمنى */}
          <Box sx={{ flex: 1, textAlign: "right" }}>
            <InfoRow label="المعمل" value={warehouseDataBYId?.Laboratory_name} />
            <InfoRow label="المخزن" value={warehouseDataBYId?.name} />
          </Box>
        </Box>

        {/* الجدول */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !dataMaterials?.length ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography color="text.secondary">لا توجد بيانات متاحة</Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              border: "1px solid #eee",
              "@media print": {
                border: "none",
                overflow: "visible",
              },
            }}
          >
            <Table sx={{ width: "100%", direction: "rtl" }}>
              <TableHeader filterDocument={filterDocument} />
              <TableBody>
                {dataMaterials?.map((item, index) => (
                  <StyledTableRow
                    key={item?.id || index}

                  >
                    <StyledTableCell sx={cellStyles} align="right">
                      {item?.cod_material}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="right">
                      {item?.name_of_material}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.measuring_unit}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.document_number}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {formatDateAr(item?.document_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.document_type}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.quantity}
                    </StyledTableCell>

                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.balance}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="right">
                      {item?.specification}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {formatDateAr(item?.production_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {formatDateAr(item?.expiration_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="right">
                      {item?.origin}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {formatDateAr(item?.purchase_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.price}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {FormatDataNumber(item?.price * item?.quantity)}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.minimum_stock_level}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.state_name}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default PrintInventory;
