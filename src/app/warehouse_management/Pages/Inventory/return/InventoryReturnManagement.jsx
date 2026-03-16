import { useState, useEffect, useCallback, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../../../redux/api/axios";
import { toast } from "react-toastify";
import InventoryReturnDialog from "./InventoryReturnDialog";
import { useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";
import { DeleteOutlined, Replay } from "@mui/icons-material";
import GridTemplate from "../../../../../components/reusableComponent/GridTemplet";
import { useTranslation } from "react-i18next";
import RefreshButtonData from "../../../../../components/reusableComponent/RefreshButton";
import Loader from "../../../../../components/reusableComponent/Loader";
import { FormatDataNumber, formatDateAr } from "../../../../../utils/formatData";
import DropDownGrid from "../../../../../components/reusableComponent/CustomMennu";
import { DeleteItem, renderMenuItem } from "../../../../../utils/Function";

const InventoryReturnManagement = ({ document, setRefreshButton: setParentRefreshButton }) => {
  const { t } = useTranslation();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const warehouseId = searchParams.get("warehouseId");
  const documentType = searchParams.get("documentType");
  const documentId = searchParams.get("id");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

// ============================== export transaction  ===================

  /* ── Fetch returns for this document ── */
  const fetchReturns = useCallback(async () => {
    if (!warehouseId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/inventory-returns-by-document`,
        { params: { document_id: documentId } },
      );
      const data = response?.data?.data || [];
      setReturns(data);
      setPagination((prev) => ({
        ...prev,
        total: data.length,
        totalPages: Math.ceil(data.length / prev.limit),
      }));
    } catch {
      setReturns([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 0 }));
    } finally {
      setLoading(false);
    }
  }, [documentId, warehouseId]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);
const columns = [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 33 },
      {
      field: "user_name",
      headerName: "اسم المستخدم",
      flex: 1,
    
    },
    {
      field: "name_of_material",
      headerName:"اسم المادة او الصنف",
      flex: 1,
    },
   
    {
      field: "state_name",
      headerName: "الحالة",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: t("الكمية المسترجعة"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.quantity ? FormatDataNumber(params?.row?.quantity) : "---"}
        </div>
      ),
    },
    {
      field: "return_date",
      headerName: t("تاريخ الارجاع"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {formatDateAr(params?.row?.return_date)}
        </div>
      ),
    },
    {
      field: "note",
      headerName: "ملاحظات",
      flex: 1,
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 1,
      renderCell: (params) =>
        <div>
          <DropDownGrid>
            <Divider sx={{ my: 0.5 }} />
            {
              !params.row.is_cancelled && (
                renderMenuItem(
                  "delete",
                  () =>
                    DeleteItem(
                      params.row.inventory_id,
                      setRefreshButton,
                      setAnchorEl,
                      null,
                      "warehouse/deleteImportTransactionData",
                      roles?.show_page_sales?._id,
                      applicationPermission?.warehouseSystem._id
                    ),
                  DeleteOutlined,
                  t("ألغاء الطلب")

                ))}

          </DropDownGrid>
        </div>

    },
  ];
  /* ── Delete a return record ── */
  const handleDelete = useCallback(async (returnId) => {
    if (!window.confirm("هل تريد حذف هذا الارجاع؟ سيتم عكس الكميات.")) return;
    try {
      await axiosInstance.delete(
        `${BackendUrl}/api/warehouse/inventory-return-delete`,
        { params: { id: returnId } },
      );
      toast.success("تم حذف الارجاع وعكس الكميات بنجاح");
      if (setParentRefreshButton) setParentRefreshButton((p) => !p);
      fetchReturns();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء حذف الارجاع",
      );
    }
  }, [fetchReturns, setParentRefreshButton]);

  
  const rows = useMemo(() => {
    return returns.map((item, index) => ({
      index: index + 1,
      ...item,
    }));
  }, [returns]);

  return (
    <Box sx={{ mt: 3 }}>
      {loading && <Loader />}

      <Box
      dir="rtl"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
          px: 1,
        }}
      >
        <InventoryReturnDialog
          warehouseId={warehouseId}
          documentId={documentId}
          documentType={documentType}
          onSuccess={fetchReturns}
        />
        <Replay color="warning" />
        <Typography variant="h6" fontWeight="bold" color="warning.dark">
          {t("الارجاعات المخزنية")}
        </Typography>
      </Box>
      <Divider sx={{ mb: 1, borderColor: "warning.light" }} />
      <GridTemplate
        rows={rows}
        columns={columns}
        btn={<RefreshButtonData onClick={fetchReturns} />}
        page={pagination.page}
        limit={pagination.limit}
        totalItems={pagination.total}
        totalPages={pagination.totalPages}
        setPage={(page) => setPagination((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setPagination((prev) => ({ ...prev, limit }))}
      />
    </Box>
  );
};

export default InventoryReturnManagement;
