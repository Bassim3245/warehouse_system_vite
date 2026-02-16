import CostumeTable from "../../../../components/reusableComponent/customerReport/customTable";
import {
  tableBodyInvoiceExport,
  tableHeaderInvoiceExport,
  totalExportQuantity,
  totalExportValue,
} from "../../../../constants/materialInfo";
import { getUserInformation } from "../../../../utils/handelCookie";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { formatDateAr } from "../../../../utils/formatData";

export default function OfficialSalesInvoice({
  invoiceData,
  totalQuantity,
  totalPrice,
  printRef,
  documentNumber,
  signauterData,
  document,
}) {

  const dataUserById = getUserInformation();
  
  return (
    <div ref={printRef}>
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 8mm;
          }
        }
      `}</style>
      <Box
        sx={{
          maxWidth: "297mm",
          mx: "auto",
          p: 2,
          border: "1px solid #bdc3c7",
        }}
        dir="rtl"
      >
        {/* Official Government Header */}

        {/* Government Letterhead */}
        <Box
          sx={{
            textAlign: "center",
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#2c3e50",
                mb: 0.5,
                letterSpacing: "0.5px",
              }}
            >
              جمهورية العراق
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#34495e",
                fontWeight: "600",
                mb: 0.5,
              }}
            >
              وزارة الصناعة والمعادن
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#34495e",
                fontWeight: "600",
                pb: 1,
                display: "inline-block",
              }}
            >
              {dataUserById?.Entities_name}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#34495e",
                fontWeight: "bold",
                mb: 0.5,
              }}
            >
              مستند صرف مخزني
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#34495e",
                fontWeight: "bold",
                mb: 0.5,
              }}
            >
              نظام ادارة الخزين في المخازن
            </Typography>
          </Box>
        </Box>
        {/* Document Information Grid */}
        <hr />
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                رقم المستند
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#e74c3c",
                }}
              >
                {documentNumber || "---"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                تاريخ المستند
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {formatDateAr(document?.document_date)}{" "}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                اسم المخزن
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {document?.warehouse_name || "---"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Document Additional Info - Account Number, Type Movement */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                رقم الحساب
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {document?.account_number || "---"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                نوع الحركة
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {document?.type_movement || "---"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                رمز الحركة
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {document?.type_movement_code || "---"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 0,
            },
            "& .MuiTypography-h5": {
              color: "white",
              p: 2,
            },
          }}
        >
          <CostumeTable
            tableHeader={tableHeaderInvoiceExport}
            dataItem={invoiceData}
            tableBody={tableBodyInvoiceExport(invoiceData)}
            totalImportQuantity={totalExportQuantity(totalQuantity)}
            totalImportValue={totalExportValue(totalPrice)}
            ColumnKey={"InvoiceExport"}
          />
        </Box>
        {/* Summary Information Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 3 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                border: "1px solid #bdc3c7",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  fontWeight: "bold",
                }}
              >
                عدد البنود
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {invoiceData?.length || 0}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                border: "1px solid #bdc3c7",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  fontWeight: "bold",
                }}
              >
                نوع الوصل
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                صادرات مواد
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                border: "1px solid #bdc3c7",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  fontWeight: "bold",
                }}
              >
                إجمالي الكمية
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {totalQuantity || 0}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                border: "1px solid #bdc3c7",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  mb: 0.5,
                  fontWeight: "bold",
                }}
              >
                القيمة الإجمالية
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {totalPrice ? totalPrice.toLocaleString("ar-EG") : "0"} د.ع
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          التوقيعات والاعتماد الرسمي
        </Typography>

        <Grid container spacing={2} dir="rtl">
          {" "}
          {signauterData && signauterData.length > 0 ? (
            signauterData?.map((item, index) => (
              <Grid size key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      height: "60px",
                      border: "1px solid #2c3e50",
                      borderRadius: 0,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontStyle: "italic",
                      }}
                    >
                      منطقة التوقيع
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "12px",
                      mb: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {item?.title}
                  </Typography>
                  <Box
                    sx={{
                      textAlign: "right",
                      fontSize: "10px",
                    }}
                  >
                    <Typography sx={{ mb: 0.5 }}>
                      {" "}
                      الاسم: ................................
                    </Typography>
                    <Typography sx={{ mb: 0.5 }}>
                      {" "}
                      التاريخ: ................................
                    </Typography>
                    <Typography>
                      الختم: ................................
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "12px", color: "#2c3e50" }}>
                  لا توجد توقيعات مسجلة
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  );
}
