import CostumeTable from "../../../../components/reusableComponent/customerReport/customTable";
import {
  tableBodyInvoiceImport,
  tableHeaderInvoiceImport,
  totalImportQuantity,
  totalImportValue,
} from "../../../../constants/materialInfo";
import { getUserInformation } from "../../../../utils/handelCookie";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";


const InvoiceDisplayImport = ({
  invoiceData,
  totalQuantity,
  documentNumber,
  totalPrice,
  printRef,
  signauterData,
}) => {
  const dataUserById = getUserInformation();
  return (
    <div ref={printRef}>
      <Box
        sx={{
          maxWidth: "210mm",
          mx: "auto",
          p: 2, // تقليل من 4 إلى 2
          fontFamily: "'Times New Roman', serif",
          fontSize: "12px", // تقليل من 14px إلى 12px
          lineHeight: 1.4, // تقليل من 1.6 إلى 1.4
          boxShadow: "0 0 10px rgba(0,0,0,0.1)", // تقليل الظل
        }}
        dir="rtl"
      >
        {/* Official Government Header */}
        <Paper
          elevation={0}
          sx={{
            mb: 1, // تقليل من 5 إلى 2
            p: 1, // تقليل من 4 إلى 2
            border: "1px solid #2c3e50", // تقليل من 3px إلى 2px
            borderRadius: 0,
            backgroundColor: "#f8f9fa",
            position: "relative",
          }}
        >
          {/* Government Letterhead */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            {" "}
            {/* تقليل من 4 إلى 2 */}
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
                borderBottom: "1px solid #bdc3c7", // تقليل من 2px إلى 1px
                pb: 1, // تقليل من 2 إلى 1
                display: "inline-block",
              }}
            >
              {dataUserById?.Entities_name}
            </Typography>
          </Box>
          {/* Document Information Grid */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {" "}
            {/* تقليل spacing من 3 إلى 2 ومن mt: 3 إلى 1 */}
            <Grid size={{ xs: 4 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 1, // تقليل من 2 إلى 1
                  border: "1px solid #2c3e50", // تقليل من 2px إلى 1px
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "10px", // تقليل من 12px إلى 10px
                    color: "#7f8c8d",
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
                  border: "1px solid #2c3e50", // تقليل من 2px إلى 1px
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "10px", // تقليل من 12px إلى 10px
                    color: "#7f8c8d",
                    mb: 0.5, // تقليل من 1 إلى 0.5
                    textTransform: "uppercase",
                  }}
                >
                  تاريخ الإصدار
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px", // تقليل من 16px إلى 12px
                    fontWeight: "bold",
                    color: "#2c3e50",
                  }}
                >
                  {new Date().toLocaleDateString("ar-EG")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 1, // تقليل من 2 إلى 1
                  border: "1px solid #2c3e50", // تقليل من 2px إلى 1px
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "10px", // تقليل من 12px إلى 10px
                    color: "#7f8c8d",
                    mb: 0.5, // تقليل من 1 إلى 0.5
                    textTransform: "uppercase",
                  }}
                >
                  وقت الطباعة
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px", // تقليل من 14px إلى 11px
                    fontWeight: "bold",
                    color: "#2c3e50",
                  }}
                >
                  {new Date().toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Box
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 0,
            },
            "& .MuiTypography-h5": {
              color: "white",
              p: 2, // تقليل من 3 إلى 2
              margin: 0,
              fontSize: "16px", // تقليل من 20px إلى 16px
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px", // تقليل من 1px إلى 0.5px
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
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: "50%",
                  padding: "16px",
                  border: "1px solid #2c3e50",
                  verticalAlign: "top",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #bdc3c7",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        عدد البنود:
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #bdc3c7",
                          fontWeight: "bold",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                      >
                        {invoiceData?.length || 0}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #bdc3c7",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        نوع الوصل:
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #bdc3c7",
                          fontWeight: "bold",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                      >
                        واردات مواد
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "8px",

                          border: "1px solid #2c3e50",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        إجمالي الكمية:
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #2c3e50",
                          fontWeight: "bold",
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {totalQuantity || 0}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #2c3e50",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        القيمة الإجمالية:
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #2c3e50",
                          fontWeight: "bold",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        {totalPrice ? totalPrice.toLocaleString("ar-EG") : "0"}{" "}
                        د.ع
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Official Signatures Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 1, // تقليل من 6 إلى 3
            p: 1, // تقليل من 4 إلى 2
            border: "1px solid #2c3e50", // تقليل من 3px double إلى 2px solid
            borderRadius: 0,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              fontSize: "16px", // تقليل من 20px إلى 16px
              textAlign: "center",
              mb: 2, // تقليل من 4 إلى 2
              textTransform: "uppercase",
              letterSpacing: "0.5px", // تقليل من 1px إلى 0.5px
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
        </Paper>
      </Box>
    </div>
  );
};

export default InvoiceDisplayImport;
