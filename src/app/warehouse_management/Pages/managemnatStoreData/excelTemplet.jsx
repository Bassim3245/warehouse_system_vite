import { useState } from "react";
import FileExcelComponent from "../../../../components/excelFormCmponent/HandelExcell";
import logo from "../../../../assets/image/1671635909.png";
import Instructions from "../../../../components/excelFormCmponent/Instructions";
import ExcelTemplate from "../../../../components/excelFormCmponent/excelTempletData";
import ExcelUpload from "../../../../components/excelFormCmponent/ExcelUpload";
import ReviewDataSet from "../../../../components/excelFormCmponent/ReviewDataSet";
import InfoIcon from "@mui/icons-material/Info";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PreviewIcon from "@mui/icons-material/Preview";
export const iconsInventory = {
  1: <InfoIcon />,
  2: <FileDownloadIcon />,
  3: <UploadFileIcon />,
  4: <PreviewIcon />,
};
export default function FileExcelTemplate({
  dataMainClass,
  dataSubClass,
  dataUnitMeasuring,
  // materialInfoData,
  dataUserById,
  wareHouseData,
  dataUserLab,
  warehouseId,

}) {
  const [dataFileExcel, setDataFileExcel] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const steps = [
    "المواد الراكدة",
    "الحصول على قالب file excel",
    "رفع file excel",
    "مراجعة البيانات قبل الحفظ بقاعدة البيانات",
  ];


  const dataSteps = [
    <Instructions />,
    <ExcelTemplate
      dataUserById={dataUserById}
      dataSubClass={dataSubClass}
      dataMainClass={dataMainClass}
      dataUnitMeasuring={dataUnitMeasuring}
      wareHouseData={wareHouseData}
      dataUserLab={dataUserLab}
    />,
    <ExcelUpload
      setDataFileExcel={setDataFileExcel}
      setActiveStep={setActiveStep}
      setRefresh={setRefresh}
      refresh={refresh}
      dataUserLab={dataUserLab}
    />,
    <ReviewDataSet
      dataFileExcel={dataFileExcel}
      dataUserById={dataUserById}
      dataSubClass={dataSubClass}
      dataMainClass={dataMainClass}
      dataUnitMeasuring={dataUnitMeasuring}
      setDataFileExcel={setDataFileExcel}
      setRefresh={setRefresh}
      setSaveData={setSaveData}
      warehouseId={warehouseId}
      dataUserLab={dataUserLab}
    />,
  ];
  return (
    <>
      <FileExcelComponent
        title="رفع المواد من خلال ملف Excel"
        logo={logo}
        dataMainClass={dataMainClass}
        dataSubClass={dataSubClass}
        dataUnitMeasuring={dataUnitMeasuring}
        dataUserById={dataUserById}
        wareHouseData={wareHouseData}
        dataUserLab={dataUserLab}
        warehouseId={warehouseId}
        buttonText="رفع مواد المخزون من Excel"
        dialogTitle="نظام إدارة المخزون"
        steps={steps}
        dataSteps={dataSteps}
        icons={iconsInventory}
      />
    </>
  );
}
