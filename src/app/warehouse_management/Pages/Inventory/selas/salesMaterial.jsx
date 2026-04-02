// SalesMaterial.js - Optimized Version
import { useRef, useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../../../components/reusableComponent/Loader";

import SalesTable from "./components/salesTable";
import SalesTotal from "./components/salesTotal";
import PrintSales from "../../invoice/PrintSalesInvoice";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import { usePermissionsStructure } from "../../../../../hooks/useStructureCompany";
import ExportManagement from "./components/ExportManagement";
import { SalesFormPopup } from "./components/SalesFormPopup";
import UseFullScreen from "../../../../../hooks/useFullScreen";

import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import { getToken } from "../../../../../utils/handelCookie";
import { BackendUrl } from "../../../../../redux/api/axios";
import layoutStyle from "../../../../../style/layoutStyle";
import { useSearchParams } from "react-router-dom";
import { useExportData } from "../../../../../hooks/invantory/export/useExport";

const SalesMaterial = () => {
  const { rtl } = useSelector((state) => state?.language);
  const [salesList, setSalesList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [distributedMovements, setDistributedMovements] = useState([]);
  const [searchParams] = useSearchParams();

  const isInternalTransfer = useMemo(
    () => searchParams.get("documentType") === "internal_consumption",
    [searchParams]
  );

  // Load export data
  const {
    selectedMaterial,
    formData,
    handleInputChange,
    handleMaterialSelect,
    handleClearForm,
    materialMovements,
    setFormData,
    document,
    setSelectedMaterial,
    dataUserById,
    dataUserLab,
    loading,
    dataUserFactory,
    warehouseDataBYId,
    refreshButton,
    setRefreshButton,
  } = useExportData({ searchParams });

  const { has_lab, has_factory, has_warehouse } = usePermissionsStructure();
  const [priceMethod, setPriceMethod] = useState("fifo"); // "fifo" or "manual"

  const materialPopupRef = useRef();

  // -----------------------------------------------------
  // Add new sale item
  // -----------------------------------------------------
  const handleAddToSalesList = useCallback(() => {
    if (
      !selectedMaterial ||
      !formData.quantity ||
      (!isInternalTransfer && !formData.price)
    ) {
      toast.warning(
        !isInternalTransfer
          ? "يرجى تحديد المادة والكمية والسعر"
          : "يرجى تحديد المادة والكمية"
      );
      return;
    }

    if (selectedMaterial.quantity < formData.quantity) {
      toast.error(
        `الكمية المتوفرة (${selectedMaterial.quantity}) أقل من الكمية المطلوبة`
      );
      return;
    }

    const isDuplicate = salesList.some(
      (item) =>
        item.material.material_id === selectedMaterial.material_id &&
        item.inventory_id === formData.inventory_id &&
        item.price === formData.price
    );

    if (isDuplicate) {
      toast.error("هذه المادة مضافة سابقًا بنفس المخزن والسعر");
      return;
    }

    const priceValue =
      formData.price !== undefined &&
        formData.price !== null &&
        formData.price !== ""
        ? parseFloat(formData.price)
        : 0;

    const newSaleItem = {
      id: Date.now(),
      material: selectedMaterial,
      quantity: formData.quantity,
      price: isInternalTransfer ? null : formData.price,
      total: parseFloat(formData.quantity) * priceValue,
      description: formData.description,
      inventory_id: formData.inventory_id,
      distribution_details: formData.distribution_details || [],
      selected_movements: formData.selected_movements || [],
      work_order_number: formData.work_order_number,
    };

    setSalesList((prev) => [...prev, newSaleItem]);
    handleClearForm();
    setDistributedMovements([]);
  }, [
    selectedMaterial,
    formData,
    salesList,
    handleClearForm,
    isInternalTransfer,
  ]);

  // -----------------------------------------------------
  // Remove sale item
  // -----------------------------------------------------
  const handleRemoveSaleItem = useCallback((id) => {
    setSalesList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // -----------------------------------------------------
  // Save sales invoice
  // -----------------------------------------------------
  const handleSaveSalesInvoice = useCallback(async () => {
    if (salesList.length === 0) {
      toast.warning("لا توجد مواد في فاتورة المبيعات");
      return;
    }

    setLoadingData(true);

    try {
      let factoryId = null;

      if (has_factory && !has_lab && has_warehouse) {
        factoryId = dataUserFactory?.factory_id || null;
      } else if (has_factory && has_lab && has_warehouse) {
        factoryId = dataUserLab?.factory_id || null;
      } else if (has_lab && has_warehouse && !has_factory) {
        factoryId = null;
      } else {
        factoryId = has_factory ? dataUserFactory?.factory_id : null;
      }

      const salesToSend = salesList.flatMap((saleItem) => {
        if (
          saleItem.distribution_details &&
          saleItem.distribution_details.length > 0
        ) {
          return [
            {
              material_id: saleItem.material.id,
              warehouse_id: has_warehouse
                ? searchParams.get("warehouseId")
                : null,
              price: isInternalTransfer
                ? null
                : saleItem.price
                  ? parseFloat(saleItem.price)
                  : null,
              notes: saleItem.description?.trim() || null,
              entity_id: dataUserById?.entity_id,
              user_id: dataUserById?.user_id,
              lab_id: has_lab ? dataUserLab?.lab_id : null,
              factory_id: factoryId,
              document_id: searchParams.get("id"),
              inventory_id: saleItem.inventory_id,
              totalQuantity: saleItem.quantity,
              docmentType: searchParams.get("documentType"),
              price_method: priceMethod,
              isInternalTransfer,
              work_order_number: saleItem.work_order_number,
              temp_quantity: saleItem.distribution_details.map((d) => ({
                inventory_id: d.inventory_id,
                allocated_quantity: d.allocated_quantity,
                price: d.price,
                total_price:
                  parseFloat(d.allocated_quantity) * parseFloat(d.price),
              })),
            },
          ];
        }
      });
      console.log("salesToSend", salesToSend)

      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/inventoryExportInformationAsLoop`,
        {
          sales: salesToSend,
          total_amount: salesList.reduce((sum, item) => sum + item.total, 0),
          has_distribution: salesList.some(
            (item) =>
              item.distribution_details && item.distribution_details.length > 0
          ),
        },
        { headers: { authorization: getToken() } }
      );

      if (response) {
        setRefreshButton((p) => !p);
        toast.success(response.data.message);
        setSalesList([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoadingData(false);
    }
  }, [
    salesList,
    dataUserFactory,
    dataUserLab,
    dataUserById,
    has_factory,
    has_lab,
    has_warehouse,
    isInternalTransfer,
    setRefreshButton,
    searchParams,
  ]);

  // -----------------------------------------------------
  // Total Amount (optimized)
  // -----------------------------------------------------
  const totalSalesAmount = useMemo(
    () => salesList.reduce((sum, item) => sum + item.total, 0),
    [salesList]
  );

  return (
    <Box sx={{ ...layoutStyle }} dir={rtl?.dir}>
      {(loadingData || loading) && <Loader />}

      <Header
        title={`صرف المواد ${isInternalTransfer ? " داخلي" : ""}`}
        dir={"rtl"}
      />

      <div className="d-flex gap-2">
        <PrintSales
          document_id={searchParams.get("id")}
          document={document}
          document_type={searchParams.get("documentType")}
        />

        {!document?.is_complete && (
          <SalesFormPopup
            formData={formData}
            materialMovements={materialMovements}
            handleInputChange={handleInputChange}
            handleAddToSalesList={handleAddToSalesList}
            setFormData={setFormData}
            materialPopupRef={materialPopupRef}
            distributedMovements={distributedMovements}
            setDistributedMovements={setDistributedMovements}
            setSelectedMaterial={setSelectedMaterial}
            selectedMaterial={selectedMaterial}
            handleMaterialSelect={handleMaterialSelect}
            rtl={rtl?.dir}
            warehouseDataBYId={warehouseDataBYId}
            searchParams={searchParams}
            priceMethod={priceMethod}
            setPriceMethod={setPriceMethod}
          />
        )}

        <UseFullScreen
          setRefreshButton={setRefreshButton}
          refreshing={refreshButton}
        />
      </div>

      {salesList.length > 0 && (
        <>
          <SalesTable
            salesList={salesList}
            handleRemoveSaleItem={handleRemoveSaleItem}
          />

          <SalesTotal
            totalAmount={totalSalesAmount}
            itemCount={salesList.length}
            onSave={handleSaveSalesInvoice}
          />
        </>
      )}

      <ExportManagement
        documentId={searchParams.get("id")}
        refreshButton={refreshButton}
        setRefreshButton={setRefreshButton}
        document={document}
        isInternalTransfer={isInternalTransfer}

      />
    </Box>
  );
};

export default SalesMaterial;
