import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Save from "@mui/icons-material/Save";

import { useSelector } from "react-redux";
import { CustomNoRowsOverlay } from "../../../../utils/Function";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import HeaderCenter from "../../../../components/reusableComponent/HeaderCenterComponent";
import { toast } from "react-toastify";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { BackendUrl } from "../../../../redux/api/axios";
import { getToken } from "../../../../utils/handelCookie";
import { arrayDataInventory } from "../../../../constants/arrayFuction";
import useGetDataId from "../../../../hooks/useGetDataId";

/* ---------------------------------------------------------
   Optimized Memoized Row Component
--------------------------------------------------------- */
const ReviewTableRow = React.memo(function ReviewTableRow({ row, index, rtl }) {
  return (
    <TableRow>
      <TableCell align={rtl ? "right" : "left"}>{index + 1}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>{row?.code}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>{row?.materialName}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>{row?.origin}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>{row?.unitMeasuring}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>{row?.specification}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>{row?.status}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>{row?.balance}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>{row?.price}</TableCell>
      <TableCell align={rtl ? "right" : "left"}>
        {row?.minimum_stock_level}
      </TableCell>
    </TableRow>
  );
});

/* ---------------------------------------------------------
   Main Component
--------------------------------------------------------- */
function ReviewDataSet({
  dataFileExcel,
  setRefresh,
  dataUserById,
  setSaveData,
  warehouseId,
}) {
  const { rtl } = useSelector((state) => state.language);

  const { labId, factoryId } = useGetDataId();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const labels = useMemo(() => ["ت", ...arrayDataInventory], []);
  const tableHeaders = useMemo(() => arrayDataInventory, []);

  /* ---------------------------------------------------------
     Submit Handler (optimized)
  --------------------------------------------------------- */
  const handleSubmit = useCallback(async () => {
    if (!dataFileExcel?.length) {
      toast.warning("لا توجد بيانات للحفظ");
      return;
    }


    try {
      const formattedDataArray = dataFileExcel.map((item) => ({
        code: item?.code,
        nameMartials: item?.materialName,
        origin: item?.origin,
        status_martials: item?.materialStatus,
        measuring_unit: item?.unitMeasuring,
        specification: item?.specification,
        ministry_id: dataUserById?.minister_id,
        entity_id: dataUserById?.entity_id,
        user_id: dataUserById?.user_id,
        balance: item?.balance,
        price: item?.price,
        minimum_stock_level: item?.minimum_stock_level,
        status: item?.status,
        warehouseId,
        lab_id: labId,
        factory_id: factoryId,
      }));

      const formData = new FormData();
      formData.append("data", JSON.stringify(formattedDataArray));

      const response = await axios.post(
        `${BackendUrl}/api/warehouse/registerOpeningBalance`,
        formData,
        {
          headers: {
            authorization: getToken(),
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        toast.success(response.data.message || `تم حفظ ${formattedDataArray.length} عنصر بنجاح!`);
        response?.data?.existingMaterials?.forEach((item) =>
          toast.error(`${item}`)
        );
        setSaveData(true);

      }


    } catch (error) {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dataFileExcel,
    dataUserById,
    labId,
    factoryId,
    warehouseId,
    setRefresh,
    setSaveData,
  ]);

  /* ---------------------------------------------------------
     Before unload warning
  --------------------------------------------------------- */
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <HeaderCenter title={"مراجعة البيانات المدخلة"} typeHeader={"h4"} />

      <Box dir={rtl?.dir === "rtl" ? "rtl" : "ltr"}>
        <ButtonTheme onClick={handleSubmit} disabled={isSubmitting}>
          <Save /> <span>حفظ</span>
        </ButtonTheme>
      </Box>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {labels.map((item, index) => (
                <TableCell
                  key={index}
                  align={rtl?.dir === "rtl" ? "right" : "left"}
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {dataFileExcel?.length > 0 ? (
              dataFileExcel.map((row, index) => (
                <ReviewTableRow
                  key={index}
                  row={row}
                  index={index}
                  rtl={rtl?.dir === "rtl"}
                />
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

export default React.memo(ReviewDataSet);
