import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Close from "@mui/icons-material/Close";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import DoneOutline from "@mui/icons-material/DoneOutline";
import WhereToVote from "@mui/icons-material/WhereToVote";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Header from "../../../../components/reusableComponent/HeaderComponent.jsx";
import GridTemplate from "../../../../components/reusableComponent/GridTemplet.jsx";
import DropDownGrid from "../../../../components/reusableComponent/CustomMennu.jsx";
import Loader from "../../../../components/reusableComponent/Loader.jsx";
import { getToken } from "../../../../utils/handelCookie.jsx";
import BookedForm from "./bookedForm.jsx";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { DeleteItem, renderMenuItem } from "../../../../utils/Function.jsx";
import moment from "moment";
import InformationMaterialBooked from "./InformationMaterialBooked.jsx";
import { useApi } from "../../../../hooks/useApi";
import UseFullScreen from "../../../../hooks/useFullScreen";
import { formatDate } from "../../../../utils/formatData";
import useUserPermissions from "../../../../hooks/genaral/useUserPermissions";
import layoutStyle from "../../../../style/layoutStyle";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import useUserData from "../../../../hooks/genaral/useUserData.jsx";
const BookObsoleteMaterial = () => {
  const { roles, applicationPermission } =
    useUserPermissions();

  const { dataUserById, rtl } = useUserData()
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dataBook, setDataBookObsolete] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { t } = useTranslation();
  const [refreshButton, setRefreshButton] = useState(false);
  const token = getToken();
  const [daysLeftMap, setDaysLeftMap] = useState({});
  const { loading: apiLoading, fetchData } = useApi();

  const fetchDataByProjectId = useCallback(async () => {
    if (!dataUserById?.entity_id) return;

    setLoading(true);
    try {
      await fetchData({
        endpoint: "/api/getDataBook",
        method: "GET",
        params: {
          entity_id: dataUserById?.entity_id,
          page,
          limit,
          checkPermissionUser: roles?.management_order_entity?._id,
          applicationPermission: applicationPermission?.materialObsolete._id,
        },
        onSuccess: (data) => {
          if (data) {
            setDataBookObsolete(data.response);
            setTotalPages(data.pagination?.totalPages || 0);
            setTotalItems(data.pagination?.totalItems || 0);
          }
        },
        onError: (err) => {
          console.error("Error fetching booked data:", err);
          setDataBookObsolete([]);
          setTotalPages(0);
          setTotalItems(0);
        },
      });
    } catch (error) {
      console.error("Error in fetchDataByProjectId:", error);
      setDataBookObsolete([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [
    fetchData,
    dataUserById?.entity_id,
    page,
    limit,
    roles?.management_order_entity?._id,
    applicationPermission.materialObsolete._id,
  ]);

  useEffect(() => {
    if (dataUserById?.entity_id) {
      fetchDataByProjectId();
    }
  }, [fetchDataByProjectId, dataUserById?.entity_id, refreshButton]);
  const calculateDaysLeftForItems = () => {
    const now = moment();
    const updatedDaysLeftMap = {};

    dataBook?.forEach((item) => {
      const expiration = moment(item.expiration_date);
      const daysLeft = expiration.diff(now, "days");
      updatedDaysLeftMap[item.book_id] = daysLeft;
      if (daysLeft === 2) {
        alert(
          `المادة "${item?.name_material}" التي تم حجزها من قبل "${item?.Entities_name}" يتبقى يومان على انتهاء صلاحيتها!`
        );
      } else if (daysLeft === 1) {
        alert(
          `المادة "${item.name_material}" التي تم حجزها من قبل "${item.Entities_name}" ستنتهي صلاحيتها غدًا!`
        );
      }
    });
    setDaysLeftMap(updatedDaysLeftMap);
  };
  useEffect(() => {
    calculateDaysLeftForItems();
    const intervalId = setInterval(calculateDaysLeftForItems, 86400000);
    return () => clearInterval(intervalId);
  }, [dataBook]);
  const handleContactedData = (id) => {
    Swal.fire({
      title: "هل تريد الاستمرار؟",
      icon: "question",
      confirmButtonText: "نعم",
      cancelButtonText: "لا",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await axiosInstance.post(
            `/api/Contacted`,
            { dataId: id },
            {
              headers: {
                authorization: token,
              },
            }
          );
          if (response.data) {
            toast.success(response.data.message);
            setRefreshButton((prev) => !prev);
          }
        } catch (error) {
          console.error("Error updating booked material:", error);
          toast.error("Failed to update booked material");
        } finally {
          setLoading(false);
        }
      }
    });
  };
  const handleDateExpire = (expirationDate) => {
    const now = moment();
    const expiration = moment(expirationDate);
    return expiration.diff(now, "days");
  };
  const rows = dataBook?.map((item, index) => ({
    index: index + 1,
    ...item,
    dateExpire: handleDateExpire(item.expiration_date),
  }));
  const columns = [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 33 },
    {
      field: "ministries",
      headerName: t("MaterialOverview.ministry name"),
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "Entities_name",
      headerName: t("MaterialOverview.entity name"),
      minWidth: "150px",
      maxWidth: "175px",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "name_material",
      headerName: t("MaterialOverview.Material Name"),
      minWidth: "150px",
      maxWidth: "175px",
      headerAlign: "center",
      flex: 1.4,
    },
    {
      field: "quantity",
      headerName: t("MaterialOverview.Quantity booked"),
      minWidth: "150px",
      maxWidth: "175px",
      headerAlign: "center",
      flex: 0.9,
    },
    {
      field: "phone_number",
      minWidth: "150px",
      maxWidth: "175px",
      headerName: t("MaterialOverview.phone Number"),
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "dataRequest",
      minWidth: "150px",
      maxWidth: "175px",
      headerName: t("Stagnant.order date"),
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {formatDate(params?.row?.created_book_at)}
        </div>
      ),
    },
    {
      field: "contacted",
      headerName: t("MaterialOverview.Communication status"),
      flex: 0.7,
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {params?.row?.contacted ? (
            <DoneOutline color="success" />
          ) : (
            <Close color="error" />
          )}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.8,
      renderCell: (params) => (
        <div>
          <DropDownGrid>
            <Divider sx={{ my: 0.5 }} />
            {renderMenuItem(
              "delete",
              () =>
                DeleteItem(
                  params.row.book_id,
                  setRefreshButton,
                  null,
                  token,
                  "deleteBookById",
                  roles?.management_order_entity?._id,
                  applicationPermission.materialObsolete._id
                ),
              DeleteOutlined,
              "ألغاء الطلب"
            )}
            {renderMenuItem(
              "contacted entity",
              () => handleContactedData(params.row.book_id),
              WhereToVote,
              "تم التواصل"
            )}
            <Divider />
            {params?.row?.contacted === 1 && (
              <BookedForm
                BookId={params?.row?.book_id}
                obsoleteMaterial={params?.row?.material_id}
                entity_Buy_id={params?.row?.entity_Buy_id}
                entity_Buy_name={params?.row?.Entities_name}
                file_name={params?.row?.file_name}
                setRefreshButton={setRefreshButton}
                dataUserById={dataUserById}
              />
            )}
            <Divider />
            <InformationMaterialBooked materialInfo={params?.row} />
          </DropDownGrid>
        </div>
      ),
    },
  ];

  return (
    <Box dir={rtl?.dir} sx={{ ...layoutStyle }}>
      {loading && <Loader />}

      <Header title={t("layout.Order management")} dir={rtl?.dir} />
      <div className="mb-2">
        <UseFullScreen
          setRefreshButton={setRefreshButton}
          refreshing={refreshButton}
        />
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <GridTemplate
          rows={rows}
          columns={columns}
          setLimit={setLimit}
          setPage={setPage}
          page={page}
          limit={limit}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      </Box>
    </Box>
  );
};

export default BookObsoleteMaterial;
