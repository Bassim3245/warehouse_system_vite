import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";

import { FormatDataNumber } from "../../../../utils/formatData";
import { getUserInformation } from "../../../../utils/handelCookie";
import { headerTablePrint } from "../../../../style/headerTablePrint";

export default function OfficialSalesInvoice({
  invoiceData,
  totalQuantity,
  totalPrice,
  printRef,
  documentNumber,
  signauterData,
}) {
  const dataUserById = getUserInformation();
  return (
    <div ref={printRef}>
      <Box
        sx={{
          maxWidth: "210mm",
          mx: "auto",
          p: 2,
          fontSize: "12px",
          lineHeight: 1.4,
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
        dir="rtl"
      >
        {/* Official Government Header */}
        <Paper
          elevation={0}
          sx={{
            mb: 2, // تقليل من 5 إلى 2
            p: 2, // تقليل من 4 إلى 2
            border: "2px solid #2c3e50", // تقليل من 3px إلى 2px
            borderRadius: 0,
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
                mb: 0.5, // تقليل من 1 إلى 0.5
                letterSpacing: "0.5px", // تقليل من 1px إلى 0.5px
              }}
            >
              جمهورية العراق
            </Typography>
            <Typography
              sx={{
                fontSize: "14px", // تقليل من 16px إلى 14px
                fontWeight: "600",
                mb: 0.5, // تقليل من 1 إلى 0.5
              }}
            >
              وزارة الصناعة والمعادن
            </Typography>
            <Typography
              sx={{
                fontSize: "12px", // تقليل من 14px إلى 12px
                fontWeight: "600",
                pb: 1, // تقليل من 2 إلى 1
                display: "inline-block",
              }}
            >
              {dataUserById?.Entities_name}
            </Typography>
          </Box>
          {/* Document Information Grid */}
          <Grid container spacing={2} size={{ mt: 1 }}>
            {" "}
            {/* تقليل spacing من 3 إلى 2 ومن mt: 3 إلى 1 */}
            <Grid size={4}>
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
            <Grid size={4}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 1, // تقليل من 2 إلى 1

                  border: "1px solid #2c3e50", // تقليل من 2px إلى 1px

                }}
              >
                <Typography
                  sx={{
                    fontSize: "10px", // تقليل من 12px إلى 10px
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
                  }}
                >
                  {new Date().toLocaleDateString("ar-EG")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 1, // تقليل من 2 إلى 1
                  border: "1px solid #2c3e50", // تقليل من 2px إلى 1px
                }}
              >
                <Typography
                  sx={{
                    fontSize: "10px", // تقليل من 12px إلى 10px
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

        {/* Official Items Table */}
        <Box sx={{ mb: 3 }}>
          <Table
            sx={{
              border: "1px solid black",
              borderRadius: 0,
              "& .MuiTableCell-root": {
                border: "1px solid black",
                padding: "8px 6px",
                fontSize: "11px",
                fontWeight: "500",
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                fontWeight: "bold",
                fontSize: "12px",
                textAlign: "center",
              },

            }}
            dir="rtl"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    ...headerTablePrint,
                  }}
                >
                  التسلسل
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    ...headerTablePrint,
                  }}
                >
                  رمز المادة
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    ...headerTablePrint,
                  }}
                >
                  اسم المادة
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    ...headerTablePrint,
                  }}
                >
                  المواصفات الفنية
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    ...headerTablePrint,
                  }}
                >
                  الكمية
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    ...headerTablePrint,
                  }}
                >
                  الوحدة
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    ...headerTablePrint,
                  }}
                >
                  سعر الوحدة (د.ع)
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    ...headerTablePrint,
                  }}
                >
                  المبلغ الإجمالي (د.ع)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        padding: "4px 6px",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {item?.cod_material || "---"}
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "600",
                      fontSize: "11px",
                    }}
                  >
                    {item?.name_of_material || "غير محدد"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "10px",
                      lineHeight: 1.3,
                    }}
                  >
                    {item?.specification || "غير محدد"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {item?.total_quantity || 0}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "10px",
                    }}
                  >
                    {item?.measuring_unit || "غير محدد"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "600",
                      fontSize: "11px",
                    }}
                  >
                    {item?.price ? FormatDataNumber(item?.price) : "---"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {item?.price && item?.total_quantity
                      ? FormatDataNumber(
                        parseFloat(item?.price) *
                        parseFloat(item?.total_quantity)
                      )
                      : "---"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2,
            border: "2px double #2c3e50",
            borderRadius: 0,
          }}
        >
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
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "10px", // تقليل من 12px إلى 10px
                          color: "#95a5a6",
                        }}
                      >
                        منطقة التوقيع
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "12px", // تقليل من 16px إلى 12px
                        color: "#2c3e50",
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
                        color: "#7f8c8d",
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
              <Grid size>
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
}
