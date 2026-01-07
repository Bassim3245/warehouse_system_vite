import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { getDataStateName } from "../../../../../redux/StateMartrialState/stateMatrialAction";
import { IoCloudDownloadOutline } from "react-icons/io5";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import axios from "axios";
import { BackendUrl } from "../../../../../redux/api/axios";
import { ButtonClearState } from "../../../../../style/ButtomStyle";
import { getToken } from "../../../../../utils/handelCookie";

export default function ExcelTemplate({
  dataMainClass,
  dataSubClass,
  dataUnitMeasuring,
}) {
  const { stateMaterial } = useSelector((state) => state?.StateMaterial);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const labels = [
    "التصنيف الرئيسي", // Main Class
    "الصنف الفرعي", // Sub-Class
    "نوع المادة", // Material Type
    "أسم المادة", // Material Name
    "حالة المادة", // Material Status
    "وحدة القياس", // Unit Measuring
    "ملاحظات", // Notes
    "تاريخ شراء المادة", // Purchase Date
    "صورة المادة", // Material Image
    "الكمية", // Quantity
  ];

  useEffect(() => {
    dispatch(getDataStateName());
  }, [dispatch]);

  const typeMaterialArray = useMemo(
    () => ["مادة راكدة", "مادة بطيئة الحركة"],
    []
  );

  const applyDataValidation = (cell, options, required = true) => {
    cell.dataValidation = {
      type: "list",
      allowBlank: !required,
      formulae: [`"${options.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Invalid Selection",
      error: "Please select a value from the dropdown.",
      editable: false,
    };
  };

  const exportToExcel = async () => {
    const fileName = "templateExcel.xlsx";
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Template");

      worksheet.addRow(labels).eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "EEEEEE" },
        };
        worksheet.getColumn(colNumber).width = 25;
      });

      const mainClassOptions =
        dataMainClass?.map((item) =>
          item?.main_Class_name?.replace(/,/g, "")
        ) || ["No Data Available"];
      const subClassOptions =
        dataSubClass?.map((item) =>
          item?.sub_class_name?.replace(/,/g, "")
        ) || ["No Data Available"];
      const dataUnitMeasuringOptions =
        dataUnitMeasuring?.map((item) =>
          item?.measuring_unit?.replace(/,/g, "")
        ) || ["No Data Available"];
      const stateMaterialOptions =
        stateMaterial?.map((item) =>
          item?.state_name?.replace(/,/g, "")
        ) || ["No Data Available"];

      const dropdownRange = 100;
      for (let i = 2; i <= dropdownRange; i++) {
        applyDataValidation(worksheet.getCell(`A${i}`), mainClassOptions);
        applyDataValidation(worksheet.getCell(`B${i}`), subClassOptions);
        applyDataValidation(worksheet.getCell(`C${i}`), typeMaterialArray);
        applyDataValidation(worksheet.getCell(`E${i}`), stateMaterialOptions);
        applyDataValidation(
          worksheet.getCell(`F${i}`),
          dataUnitMeasuringOptions,
          false
        );

        const dateCell = worksheet.getCell(`H${i}`);
        dateCell.numFmt = "yyyy-mm-dd";
        dateCell.value = "yyyy-mm-dd";

        worksheet.getCell(`I${i}`).dataValidation = {
          type: "custom",
          formulae: ["ISBLANK(I2)"],
          showErrorMessage: true,
          errorTitle: "Invalid Input",
          error: "Only images can be inserted.",
        };
        worksheet.getCell(`J${i}`).dataValidation = {
          type: "decimal",
          operator: "greaterThanOrEqual",
          formulae: [0],
          showErrorMessage: true,
          errorTitle: "خطأ في الإدخال",
          error: "يرجى إدخال رقم صحيح أكبر من أو يساوي 0",
          allowBlank: true,
        };
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const excelData = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      saveAs(excelData, fileName);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert(t("An error occurred while exporting the Excel file."));
    }
  };

  const handelGetTemplateFileExcel = async () => {
    try {
      // Display a loading message or spinner
      console.log("Downloading template...");

      // Make the request to the backend API
      const response = await axios.get(`${BackendUrl}/api/getTemplateFileExcel`, {
        headers: {
          authorization: getToken(),

        },
        responseType: "blob", // Ensure the response is treated as a binary file
      });

      // Create a blob from the response data
      const blob = new Blob([response?.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "templateExcel.xlsx"; // Name of the downloaded file
      document.body.appendChild(link);
      link.click();

      // Clean up the link element
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Optionally, provide feedback to the user
      console.log("Template downloaded successfully!");
    } catch (error) {
      console.error("Error downloading template:", error);

      // Optionally, display a user-friendly message
      // alert("Failed to download the template. Please try again.");
    }
  };

  return (
    <div>
      <Box>
        <div className="row d-flex justify-content-center my-4">
          <div className="col-md-8">
            <div className="d-flex justify-content-center">
              <Button onClick={exportToExcel} sx={{ padding: 0, margin: "0px" }}>
                <div className="maincontent ">
                  <div className="file-upload-wrapper">
                    <div className="box-fileupload">
                      <IoCloudDownloadOutline
                        style={{
                          fontSize: "120px",
                          fontWeight: "bold",
                          color: "rgba(30, 106, 153, 0.7)",
                        }}
                      />
                      <p className="box-fileupload__lable">
                        تنزيل قالب File Excel
                      </p>
                    </div>
                    <div className="error-wrapper" />
                    <div className="image-previwe" />
                  </div>
                </div>
              </Button>
            </div>
            <Typography
              sx={{
                textAlign: "center",
                marginTop: 2,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              إذا قمت بتنزيل القالب بالفعل، يرجى المتابعة إلى الخطوة التالية.
            </Typography>

          </div>
          <ButtonClearState onClick={handelGetTemplateFileExcel}>
            الحصول على القالب
          </ButtonClearState>
        </div>
      </Box>
    </div>
  );
}
