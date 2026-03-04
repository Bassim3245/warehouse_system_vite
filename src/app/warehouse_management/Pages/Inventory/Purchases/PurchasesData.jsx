import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Loader from "../../../../../components/reusableComponent/Loader";
import { useImportData } from "../../../../../hooks/invantory/useImport";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import MaterialsListSection from "./components/MaterialsListSection";
import { PurchasesFormPopup } from "./components/PurchasesFormPopup";
import ImportManagement from "./components/ImportManagement";
import { toast } from "react-toastify";
import { usePermissionsStructure } from "../../../../../hooks/useStructureCompany";
import UseFullScreen from "../../../../../hooks/useFullScreen";
import { PrintPurchases } from "../../invoice/PrintInfoPurchInvoice";
import usePermissionUser from "../../../../../hooks/usePermissionUser";
import { BackendUrl } from "../../../../../redux/api/axios";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import { getToken } from "../../../../../utils/handelCookie";
import layoutStyle from "../../../../../style/layoutStyle";
import { useSearchParams } from "react-router-dom";

const PurchasesData = () => {
  const { rtl } = useSelector((state) => state?.language);
  const printRef = React.useRef();
  const [searchParams] = useSearchParams();

  // -----------------------------
  // Import Hooks and Data
  // -----------------------------
  const {
    selectedMaterial,
    formData,
    stateMaterial,
    handleInputChange,
    handleDateChange,
    handleMaterialSelect,
    handleClearForm,
    invoiceData,
    refreshButton,
    document,
    setRefreshButton,
    setSelectedMaterial,
    dataUserFactory,
    warehouseDataBYId,
  } = useImportData({ searchParams });

  const [materialsList, setMaterialsList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const { dataUserById, dataUserLab } = usePermissionUser();
  const { has_lab, has_factory, has_warehouse } = usePermissionsStructure();

  // -----------------------------
  // Memoized Total Values
  // -----------------------------
  const totalQuantity = useMemo(
    () =>
      invoiceData.reduce(
        (sum, item) => sum + parseFloat(item.quantity || 0),
        0
      ),
    [invoiceData]
  );

  const totalPrice = useMemo(
    () =>
      invoiceData.reduce((sum, item) => {
        const price = item.price ? parseFloat(item.price) : 0;
        const quantity = parseFloat(item.quantity || 0);
        return sum + price * quantity;
      }, 0),
    [invoiceData]
  );

  const totalAmount = useMemo(
    () => materialsList.reduce((sum, item) => sum + (item.total || 0), 0),
    [materialsList]
  );

  const invoiceDate = useMemo(
    () => (invoiceData.length > 0 ? invoiceData[0].purchase_date : new Date()),
    [invoiceData]
  );

  const documentNumber = useMemo(
    () =>
      invoiceData.length > 0 ? invoiceData[0].document_number : "غير متوفر",
    [invoiceData]
  );

  // -----------------------------
  // Add Material To List
  // -----------------------------
  const handleAddMaterialToList = useCallback((selectedMaterial, formData) => {
    if (!selectedMaterial || !formData.quantity) return;

    const price = formData.price ? parseFloat(formData.price) : 0;
    const quantity = parseFloat(formData.quantity);

    const newMaterial = {
      id: Date.now(),
      material: selectedMaterial,
      quantity: formData.quantity,
      price: formData.price || null,
      total: price * quantity,
      description: formData.description,
      expiry_date: formData.expiry_date,
      purchase_date: formData.purchase_date,
      production_date: formData.production_date,
      state_id: formData.state_id,
      note: formData.note,
      check_number: formData.check_number,
      inspection_number: formData.inspection_number,
      inspection_date: formData.inspection_date,
      has_inspection: formData.has_inspection,
    };

    setMaterialsList((prev) => [...prev, newMaterial]);
  }, []);

  const handleRemoveMaterial = useCallback((id) => {
    setMaterialsList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleAddToList = useCallback(() => {
    handleAddMaterialToList(selectedMaterial, formData);
    handleClearForm();
  }, [selectedMaterial, formData, handleAddMaterialToList, handleClearForm]);

  // -----------------------------
  // Save All Materials
  // -----------------------------
  const handleSaveAllMaterials = useCallback(async () => {
    if (materialsList.length === 0) {
      toast.warning("لا توجد مواد لحفظها");
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

      const materialsToSend = materialsList.map((materialItem) => {
        const quantity = parseFloat(materialItem?.quantity) || 0;
        const price = materialItem?.price
          ? parseFloat(materialItem?.price)
          : null;
        return {
          material_id: materialItem?.material?.id,
          quantity,
          price,
          total_price: price !== null ? quantity * price : null,
          expiry_date: materialItem?.expiry_date,
          purchase_date: materialItem?.purchase_date,
          production_date: materialItem?.production_date,
          state_id: materialItem?.state_id,
          note: materialItem?.note, 
          check_number: materialItem?.check_number,
          inspection_number: materialItem?.inspection_number,
          inspection_date: materialItem?.inspection_date,
          has_inspection: materialItem?.has_inspection,
        };
      });

      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/inventoryImportDataInformation`,
        {
          materials: materialsToSend,
          document_id: searchParams.get("id"),
          user_id: dataUserById?.user_id,
          lab_id: has_lab ? dataUserLab?.lab_id : null,
          factory_id: factoryId,
          warehouse_id: has_warehouse ? searchParams.get("warehouseId") : null,
          ministry_id: dataUserById?.minister_id,
          entity_id: dataUserById?.entity_id,
        },
        { headers: { authorization: getToken() } }
      );

      if (response?.data) {
        setRefreshButton((prev) => !prev);
        toast.success(response?.data.message || "تم حفظ المواد بنجاح");
        setMaterialsList([]);
      }
    } catch (error) {
      console.error("Error Save Materials:", error);
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء حفظ المواد");
    } finally {
      setLoadingData(false);
    }
  }, [
    materialsList,
    has_factory,
    has_lab,
    has_warehouse,
    dataUserById,
    dataUserLab,
    dataUserFactory,
    searchParams,
    setRefreshButton,
  ]);

  return (
    <Box sx={{ ...layoutStyle }} dir={rtl?.dir}>
      {loadingData && <Loader />}

      <Header
        title={`تعزيز  المواد - ${warehouseDataBYId?.name}`}
        dir={rtl?.dir}
      />

      <div className=" d-flex gap-1 mb-2">
        <PrintPurchases
          invoiceData={invoiceData}
          documentNumber={documentNumber}
          invoiceDate={invoiceDate}
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          totalAmount={totalAmount}
          document_id={searchParams.get("id")}
          documentInfo={document}
        />

        {!document?.is_complete && (
          <PurchasesFormPopup
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            stateMaterial={stateMaterial}
            handleImportSubmit={handleAddToList}
            selectedMaterial={selectedMaterial}
            handleMaterialSelect={handleMaterialSelect}
            rtl={rtl.dir}
            setSelectedMaterial={setSelectedMaterial}
            warehouseDataBYId={warehouseDataBYId}
            searchParams={searchParams}
          />
        )}

        <UseFullScreen
          setRefreshButton={setRefreshButton}
          refreshing={refreshButton}
        />
      </div>

      <Grid container spacing={3}>
        <MaterialsListSection
          materialsList={materialsList}
          handleRemoveMaterial={handleRemoveMaterial}
          handleSaveAllMaterials={handleSaveAllMaterials}
          has_factory={has_factory}
          has_lab={has_lab}
          has_warehouse={has_warehouse}
        />
      </Grid>

      <ImportManagement
        documentId={searchParams.get("id")}
        invoiceData={invoiceData}
        documentNumber={documentNumber}
        invoiceDate={invoiceDate}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        totalAmount={totalAmount}
        printRef={printRef}
        refreshButton={refreshButton}
        setRefreshButton={setRefreshButton}
        loading={loadingData}
        document={document}
      />
    </Box>
  );
};

export default React.memo(PurchasesData);
