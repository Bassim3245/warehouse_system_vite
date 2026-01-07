import { useState, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import {useTheme} from "@mui/material/styles";import { useTranslation } from "react-i18next";
import Print from "@mui/icons-material/Print";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";

import { BottomRoot, ButtonTheme } from "../../../../style/ButtomStyle";
import { useReactToPrint } from "react-to-print";
import { formatDateYearsMonth } from "../../../../utils/formatData";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { BackendUrFile } from "../../../../redux/api/axios";
import Logo from "../../../../components/Layout/logo";
import "./PrintPdfInformation.css";
export default function PrintPdInformation({ dataMaterial }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const componentRef = useRef();
  const theme = useTheme();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Material_Report_${dataMaterial?.code_material || "Archive"
      }_${new Date().toISOString().split("T")[0]}`,
    onAfterPrint: () => console.log("Print completed successfully"),
  });

  const materialDetails = useMemo(
    () => [
      { label: "أسم المادة", value: dataMaterial?.name_material },
      { label: "رمز المادة", value: dataMaterial?.code_material },
      { label: "التصنيف الرئيسي", value: dataMaterial?.main_Class_name },
      { label: "حالة المادة", value: dataMaterial?.state_name },
      { label: "نوع المادة", value: dataMaterial?.typ_material },
      {
        label: "تاريخ الشراء",
        value: formatDateYearsMonth(dataMaterial?.puchase_date),
      },
      { label: "أسم الوزارة المسلمة", value: dataMaterial?.ministry_name_from },
      { label: "أسم الجهة المسلمة", value: dataMaterial?.entity_name_from },
      { label: "أسم الوزارة المستلمة", value: dataMaterial?.ministry_name_buy },
      { label: "أسم الجهة المستلمة", value: dataMaterial?.entity_name_buy },
      { label: "الكمية المسلمة", value: dataMaterial?.Quantity_buy },
      { label: "رقم الهاتف", value: dataMaterial?.phone_number },
      { label: "العنوان", value: dataMaterial?.governorate_name },
      { label: "الوصف", value: dataMaterial?.description },
    ],
    [dataMaterial]
  );

  const renderFormContent = () => (
    <Box
      sx={{
        margin: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
      dir="rtl"
    >
      <div className="mt-4">
        <div ref={componentRef} className="print-content print-document">
          <div className="official-header">
            <div className="header-flex">
              <img src={Logo} alt="Organization Logo" className="header-logo" />
              <div className="header-text">
                <h2 className="organization-name">وزارة الصناعة والمعادن</h2>
                <h3 className="department-name">قسم إدارة المخزون</h3>
              </div>
              <div className="document-id">
                <div className="barcode"></div>
                <div className="reference-number">
                  رقم المرجع: {new Date().getFullYear()}-
                  {String(Math.floor(Math.random() * 10000)).padStart(4, "0")}
                </div>
              </div>
            </div>
            <Divider className="header-divider" />
            <h1 className="document-title">معلومات المادة الراكدة</h1>
          </div>

          <div className="watermark">وثيقة رسمية</div>

          <div className="document-section">
            <h3 className="section-title">معلومات المادة الأساسية</h3>
            <ul className="material-details">
              {materialDetails.slice(0, 5).map((detail, index) => (
                <li key={index} className="detail-item">
                  <span className="detail-label">{detail.label}:</span>
                  <span className="detail-value">{detail.value || "-"}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="document-section">
            <h3 className="section-title">معلومات النقل والتسليم</h3>
            <ul className="material-details">
              {materialDetails.slice(5, 11).map((detail, index) => (
                <li key={index} className="detail-item">
                  <span className="detail-label">{detail.label}:</span>
                  <span className="detail-value">{detail.value || "-"}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="document-section">
            <h3 className="section-title">معلومات إضافية</h3>
            <ul className="material-details">
              {materialDetails.slice(11).map((detail, index) => (
                <li key={index} className="detail-item">
                  <span className="detail-label">{detail.label}:</span>
                  <span className="detail-value">{detail.value || "-"}</span>
                </li>
              ))}
            </ul>
          </div>

          {dataMaterial?.images?.length > 0 && (
            <div className="document-section images-section">
              <h3 className="section-title">صور المادة</h3>
              <div className="image-grid">
                {dataMaterial?.images?.map((image, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={`${BackendUrFile}/${image?.file_name}`}
                      alt={`Material view ${index + 1}`}
                    />
                    <div className="image-caption">صورة {index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="document-footer">
            <div className="signatures">
              <div className="signature-block">
                <p className="signature-title">مدير القسم:</p>
                <div className="signature-line"></div>
                <p className="signature-name">الاسم: ________________</p>
              </div>

              <div className="signature-block">
                <p className="signature-title">مسؤول المخزن:</p>
                <div className="signature-line"></div>
                <p className="signature-name">الاسم: ________________</p>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="date">
                تاريخ الإصدار: {new Date().toLocaleDateString("ar-IQ")}
              </p>
              <div className="official-stamp">ختم رسمي</div>
              <p className="page-number">صفحة 1 من 1</p>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );

  const renderFormActions = () => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <BottomRoot
        onClick={() => setOpen(false)}
        sx={{
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {t("close")}
      </BottomRoot>
      <ButtonTheme
        type="button"
        onClick={handlePrint}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
            transform: "translateY(-2px)",
          },
        }}
      >
        <PictureAsPdf fontSize="small" />
        {t("طباعة")}
      </ButtonTheme>
    </Box>
  );

  return (
    <div>
      <Tooltip title={t("طباعة معلومات المادة")} arrow placement="top">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.main,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              transform: "scale(1.1)",
            },
          }}
        >
          <Print style={{ fontSize: "2.5rem" }} />
        </IconButton>
      </Tooltip>
      <PopupForm
        title={t("طباعة معلومات المادة")}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="90%"
        maxWidth="1000px"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
