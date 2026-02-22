import CostumeTable from "../../../../components/reusableComponent/customerReport/customTable";
import {
  tableBodyInvoiceImport,
  tableHeaderInvoiceImport,
  totalImportQuantity,
  totalImportValue,
} from "../../../../constants/materialInfo";
import { getUserInformation } from "../../../../utils/handelCookie";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { formatDateAr } from "../../../../utils/formatData";

const InvoiceDisplayImport = ({
  invoiceData,
  totalQuantity,
  documentNumber,
  totalPrice,
  printRef,
  signauterData,
  documentInfo,
}) => {
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
          {" "}
          {/* تقليل من 4 إلى 2 */}
          <Box>
            <Typography
              sx={{
                fontSize: "16px", // تقليل من 20px إلى 16px
                fontWeight: "bold",
                color: "#2c3e50",
                mb: 0.5, // تقليل من 1 إلى 0.5
                letterSpacing: "0.5px", // تقليل من 1px إلى 0.5px
              }}
            >
              جمهورية العراق
            </Typography>
            <Typography
              sx={{
                fontSize: "14px", // تقليل من 16px إلى 14px
                color: "#34495e",
                fontWeight: "600",
                mb: 0.5, // تقليل من 1 إلى 0.5
              }}
            >
              وزارة الصناعة والمعادن
            </Typography>
            <Typography
              sx={{
                fontSize: "12px", // تقليل من 14px إلى 12px
                color: "#34495e",
                fontWeight: "600",
                pb: 1, // تقليل من 2 إلى 1
                display: "inline-block",
              }}
            >
              {dataUserById?.Entities_name}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "14px", // تقليل من 16px إلى 14px
                color: "#34495e",
                fontWeight: "bold",
                mb: 0.5, // تقليل من 1 إلى 0.5
              }}
            >
              مستند استلام مخزني
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "14px", // تقليل من 16px إلى 14px
                color: "#34495e",
                fontWeight: "bold",
                mb: 0.5, // تقليل من 1 إلى 0.5
              }}
            >
              نظام ادارة الخزين في المخازن
            </Typography>
          </Box>
        </Box>
        {/* Document Information Grid */}
        <hr />
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {" "}
          {/* تقليل spacing من 3 إلى 2 ومن mt: 3 إلى 1 */}
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1, // تقليل من 2 إلى 1

                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px", // تقليل من 12px إلى 10px
                  mb: 0.5, // تقليل من 1 إلى 0.5
                  textTransform: "uppercase",
                }}
              >
                رقم المستند
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px", // تقليل من 18px إلى 14px
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
                p: 1, // تقليل من 2 إلى 1
                // تقليل من 2px إلى 1px
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px", // تقليل من 12px إلى 10px
                  mb: 0.5, // تقليل من 1 إلى 0.5
                  textTransform: "uppercase",
                }}
              >
                تاريخ المستند
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px", // تقليل من 16px إلى 12px
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {formatDateAr(documentInfo?.document_date)}{" "}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1, // تقليل من 2 إلى 1
                // تقليل من 2px إلى 1px
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px", // تقليل من 12px إلى 10px
                  mb: 0.5, // تقليل من 1 إلى 0.5
                  textTransform: "uppercase",
                }}
              >
                اسم المخزن
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px", // تقليل من 14px إلى 11px
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {documentInfo?.warehouse_name || "---"}
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
                {documentInfo?.account_number || "---"}
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
                {documentInfo?.type_movement || "---"}
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
                {documentInfo?.type_movement_code || "---"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            mb: 2,
            "& .MuiPaper-root": {
              borderRadius: 0,
            },
            "& .MuiTypography-h5": {
              color: "white",
              p: 2, // تقليل من 3 إلى 2
            },
          }}
        >
          <CostumeTable
            tableHeader={tableHeaderInvoiceImport}
            dataItem={invoiceData}
            tableBody={tableBodyInvoiceImport(invoiceData)}
            totalImportQuantity={totalImportQuantity(totalQuantity)}
            totalImportValue={totalImportValue(totalPrice)}
            ColumnKey={"InvoiceImport"}
          />
        </Box>
        {/* Summary Information Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 3 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
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
                واردات مواد
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
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
        <Grid container spacing={2} dir="rtl" sx={{ minHeight: "100px" }}>
          {" "}
          {signauterData && signauterData.length > 0 ? (
            signauterData?.map((item, index) => (
              <Grid size key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      height: "60px", // تقليل من 100px إلى 60px
                      border: "1px solid #2c3e50", // تقليل من 2px إلى 1px
                      borderRadius: 0,
                      mb: 2, // تقليل من 3 إلى 2
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10px", // تقليل من 12px إلى 10px
                        fontStyle: "italic",
                      }}
                    >
                      منطقة التوقيع
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "12px", // تقليل من 16px إلى 12px
                      mb: 1, // تقليل من 2 إلى 1
                      textTransform: "uppercase",
                    }}
                  >
                    {item?.title}
                  </Typography>
                  <Box
                    sx={{
                      textAlign: "right",
                      fontSize: "10px", // تقليل من 12px إلى 10px
                    }}
                  >
                    <Typography sx={{ mb: 0.5 }}>
                      {" "}
                      {/* تقليل من 1 إلى 0.5 */}
                      الاسم: ................................
                    </Typography>
                    <Typography sx={{ mb: 0.5 }}>
                      {" "}
                      {/* تقليل من 1 إلى 0.5 */}
                      التاريخ: ................................
                    </Typography>
                    <Typography>
                      الختم: ................................
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))
          ) : null}
        </Grid>
      </Box>
    </div>
  );
};

export default InvoiceDisplayImport;
