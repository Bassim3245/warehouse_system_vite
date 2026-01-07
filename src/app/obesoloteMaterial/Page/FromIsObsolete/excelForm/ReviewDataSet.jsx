import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";

import { useSelector } from "react-redux";
import { Save } from "@mui/icons-material";
import { CustomNoRowsOverlay } from "../../../../../utils/Function";
import { ButtonTheme } from "../../../../../style/ButtomStyle";
import HeaderCenter from "../../../../../components/reusableComponent/HeaderCenterComponent";
import ModuleEdit from "./formEditMatrialInformationExcel";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "../../../../../redux/api/axios";
import { getToken } from "../../../../../utils/handelCookie";

function ReviewDataSet({
  dataFileExcel,
  dataMainClass,
  dataUnitMeasuring,
  materialInfo,
  setDataFileExcel,
  setRefresh,
  dataUserById,
  setSaveData
}) {
  const { rtl } = useSelector((state) => state.language);
  const { maintheme } = useSelector((state) => state.ThemeData);
  const [imageUrls, setImageUrls] = useState({});
  const [refreshImage, setRefreshImage] = useState(false);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      let message = "";
      if (dataFileExcel && dataFileExcel.length > 0) {
        message += " ملاحظة : أذا  لم يتم حفظ البيانات سوف يتم حذفها.";
      }
      event.preventDefault();
      event.returnValue = message; // For most browsers
      return message; // For some older browsers
    };
    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dataFileExcel]);
  const tableHeaders = [
    "ت",
    "أسم المادة",
    "حالة المادة",
    "وحدة القياس",
    "الكمية",
    "الصنف الرئيسي",
    "الصنف الفرعي",
    "نوع المادة",
    "الوصف",
    "صورة المادة",
    "إجراء",
  ];
  // Ensure unique IDs for items
  useEffect(() => {
    if (dataFileExcel?.length > 0) {
      const updatedData = dataFileExcel.map((item, index) => ({
        ...item,
        id: item?.id || `material_${Date.now()}_${index}`,
      }));
      setDataFileExcel(updatedData);
    }
  }, [dataFileExcel, setDataFileExcel]);
  // Manage image URLs
  useEffect(() => {
    const newImageUrls = {};
    dataFileExcel?.forEach((item) => {
      if (item.materialImage instanceof File) {
        newImageUrls[item.id] = URL.createObjectURL(item.materialImage);
      } else if (typeof item.materialImage === "string") {
        newImageUrls[item.id] = item.materialImage;
      }
    });

    setImageUrls(newImageUrls);

    return () => {
      Object.values(newImageUrls).forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [refreshImage]);
  const handleUpdateData = (updatedItem) => {
    const updatedData = dataFileExcel?.map((item) =>
      item?.id === updatedItem?.id ? updatedItem : item
    );
    setDataFileExcel(updatedData);
  };
  // Match names with IDs and prepare data for submission
  const handleSubmit = async () => {
    try {
      // Prepare an array to hold the formatted data
      const formattedDataArray = dataFileExcel?.map((item) => {
        const itemData = { ...item }; // Create a copy of the item
        return {
          nameMartials: itemData?.materialName, // Use the actual data
          status_martials: itemData?.materialStatus,
          measuring_unit: itemData?.unitMeasuring,
          ministry_id: dataUserById?.minister_id,
          entity_id: dataUserById?.entity_id,
          Quantity: itemData?.quantity,
          sub_class: itemData?.subClass,
          main_class: itemData?.mainClass,
          user_id: dataUserById?.user_id,
          typMartials: itemData?.materialType,
          description: itemData?.notes,
          purchaseDate: itemData?.purchaseDate,
          id: itemData?.id,
        };
      });

      // Use FormData to handle file uploads
      const formData = new FormData();
      formData.append("data", JSON.stringify(formattedDataArray));
      // Append images separately
      dataFileExcel?.forEach((item, index) => {
        if (item.materialImage) {
          formData.append(`files[${item.id}]`, item.materialImage);
        }
      });
      // Send the formatted data to the backend
      const response = await axios.post(
        `${BackendUrl}/api/insertMultipleData`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authorization: getToken(),
          },
        }
      );
      // Show success message and refresh if needed
      if (response) {
        setSaveData(true);
        toast.success(response?.data?.message);
        response?.data?.existingMaterials?.forEach((item) =>
          toast?.error(`${item}`)
        );
      }
      if (setRefresh) {
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      // Log the error and show failure message
      toast.error(error?.response?.data?.message || error?.response?.data?.error);
      // toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Show confirmation dialog
      const message = "Are you sure you want to leave? You will be logged out.";
      event.preventDefault();
      event.returnValue = message; // For most browsers
      return message; // For some older browsers
    };
    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [window.location.reload]);
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <HeaderCenter title={"مراجعة البيانات المدخلة"} typeHeader={"h4"} />
      <Box dir={rtl?.dir === "rtl" ? "rtl" : "ltr"}>
        <ButtonTheme onClick={handleSubmit}>
          <Save /> <span>حفظ</span>
        </ButtonTheme>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 440, backgroundColor: maintheme?.paperColor }}
      >
        <Table stickyHeader aria-label="obsolete materials table">
          <TableHead>
            <TableRow>
              {tableHeaders?.map((item, index) => (
                <TableCell
                  key={index}
                  align={rtl?.dir === "rtl" ? "right" : "left"}
                  sx={{
                    backgroundColor: maintheme?.tableHeaderBg,
                    color: maintheme?.tableHeaderColor,
                    fontWeight: "bold",
                  }}
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataFileExcel?.length > 0 ? (
              dataFileExcel.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: maintheme?.tableRowOdd,
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: maintheme?.tableRowEven,
                    },
                    "&:hover": {
                      backgroundColor: maintheme?.tableRowHover,
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {index + 1}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {row?.materialName}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {row?.materialStatus}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {row?.unitMeasuring}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {row?.quantity}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {row?.mainClass}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {row?.subClass}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {row?.materialType}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {row?.notes}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    {imageUrls[row?.id] ? (
                      <img
                        src={imageUrls[row?.id]}
                        alt={row?.materialName}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      "لا توجد صورة"
                    )}
                  </TableCell>
                  <TableCell align={rtl?.dir === "rtl" ? "right" : "left"}>
                    <ModuleEdit
                      item={row}
                      setRefreshImage={setRefreshImage}
                      dataMainClass={dataMainClass}
                      dataUnitMeasuring={dataUnitMeasuring}
                      materialInfo={materialInfo}
                      onUpdateData={handleUpdateData}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeaders.length} align="center">
                  <CustomNoRowsOverlay />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ReviewDataSet;
