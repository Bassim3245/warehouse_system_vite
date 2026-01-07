import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Suspense,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ButtonTheme } from "../../../../../style/ButtomStyle";
import { BackendUrl } from "../../../../../redux/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import LocalPrintshopOutlined from "@mui/icons-material/LocalPrintshopOutlined";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../../../../redux/LanguageState";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import {
  getToken,
  getUserInformation,
} from "../../../../../utils/handelCookie";
import "../../../../../style/DetailsCard.css";
import { useReactToPrint } from "react-to-print";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../../../components/reusableComponent/Loader";
import { getDataStateName } from "../../../../../redux/StateMartrialState/stateMatrialAction";
import { getDataUserWithWareHouseDataById } from "../../../../../redux/getDataProjectById/getActions";
import { usePermissionsStructure } from "../../../../../hooks/useStructureCompany";
import MaterialDetailsCard from "../../../../../components/InventoryComponents/MaterialDetailsCard";
import MaterialMovementsTable from "../../../../../components/InventoryComponents/MaterialMovementsTable";
function MaterialMovement() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paramsQuery] = useSearchParams();
  const token = getToken();
  const dataUserById = getUserInformation();

  const { hierarchyConfig } = usePermissionsStructure();
  const { dataUserLab } = useSelector((state) => state?.dataHandelUserAction);
  const { stateMaterial } = useSelector((state) => state?.StateMaterial);

  const [refreshButton, setRefreshButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState({});
  const [materialMovements, setMaterialMovements] = useState([]);
  const [error, setError] = useState(null);

  const materialId = useMemo(
    () => paramsQuery.get("material_id"),
    [paramsQuery]
  );

  /* ----------------------------------------------
     Load Basic State Names + Language Once
  ---------------------------------------------- */
  useEffect(() => {
    dispatch(getDataStateName());
    dispatch(setLanguage());
  }, [dispatch]);

  /* ----------------------------------------------
     Load User / Warehouse Data Once
  ---------------------------------------------- */
  useEffect(() => {
    if (dataUserById?.user_id && dataUserById?.entity_id) {
      dispatch(
        getDataUserWithWareHouseDataById({
          user_id: dataUserById.user_id,
          entity_id: dataUserById.entity_id,
        })
      );
    }
  }, [dataUserById, dispatch]);

  /* ----------------------------------------------
     Fetch Material Details + Movements
  ---------------------------------------------- */
  useEffect(() => {
    if (!materialId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [inventoryRes, movementsRes] = await Promise.all([
          axiosInstance.get(
            `${BackendUrl}/api/warehouse/storGetDataById/${materialId}`,
            { headers: { authorization: token } }
          ),

          axiosInstance.get(
            `${BackendUrl}/api/warehouse/materialMovements/${materialId}`,
            { headers: { authorization: token } }
          ),
        ]);

        setInventory(inventoryRes?.data?.data || {});
        setMaterialMovements(movementsRes?.data?.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [materialId, refreshButton]);

  /* ----------------------------------------------
     Navigation
  ---------------------------------------------- */
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /* ----------------------------------------------
     PRINT
  ---------------------------------------------- */
  const detailsCardRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => detailsCardRef.current,
    onAfterPrint: () => document.body.classList.remove("printing"),
    onPrintError: () => toast.error("فشل الطباعة، حاول مرة أخرى"),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: landscape;
        margin: 1mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
  });

  /* ----------------------------------------------
     Open Movement Page
  ---------------------------------------------- */
  const openMovement = useCallback(
    (movement_id, url) => {
      navigate(
        `${url}?movement_material_id=${movement_id}&material_id=${materialId}`
      );
    },
    [navigate, materialId]
  );

  /* ----------------------------------------------
     Clear Movement Data
  ---------------------------------------------- */
  const handleClearData = useCallback(() => {
    setInventory({});
    setMaterialMovements([]);
  }, []);

  return (
    <div className="w-100">
      <ToastContainer />
      {loading && <Loader />}

      {/* HEADER BUTTONS */}
      <div className="pb-3 d-flex justify-content-between m-2">
        <ButtonTheme onClick={handleBack} startIcon={<ArrowBack />}>
          {t("رجوع")}
        </ButtonTheme>

        <ButtonTheme
          onClick={handlePrint}
          startIcon={<LocalPrintshopOutlined />}
        >
          {t("طباعة التفاصيل")}
        </ButtonTheme>
      </div>

      {/* PAGE CONTENT */}
      <div className="p-3 rad-10">
        <Box className="d-flex justify-content-end">
          <Header title={t("معلومات المادة")} />
        </Box>
        <Box ref={detailsCardRef} dir="rtl">
          <Suspense fallback={<Loader />}>
            <MaterialDetailsCard inventory={inventory} />
          </Suspense>
        </Box>
        <div dir="rtl">
          <Suspense fallback={<Loader />}>
            <MaterialMovementsTable
              materialMovements={materialMovements}
              paramsQuery={paramsQuery}
              openMovement={openMovement}
              stateMaterial={stateMaterial}
              dataUserLab={dataUserLab}
              dataUserById={dataUserById}
              hierarchyConfig={hierarchyConfig}
              refreshButton={refreshButton}
              setRefreshButton={setRefreshButton}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MaterialMovement);
