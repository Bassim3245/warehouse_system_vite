// components/SalesTable.js - تصميم رسمي
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";


const SalesTable = ({ salesList, handleRemoveSaleItem }) => {
  return (
    <Paper
      sx={{
        p: 0,
        mt: 1,
        borderRadius: 0,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: "#f8f9fa",
          borderBottom: "2px solid #1976d2",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1976d2",
            fontWeight: "700",
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
          }}
        >
          المواد المضافة للفاتورة
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#666666",
            mt: 1,
            fontWeight: "500",
          }}
        >
          عدد المواد: {salesList.length} مادة
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#f5f5f5",
                borderBottom: "2px solid #1976d2",
              }}
            >
              <TableCell
                sx={{
                  color: "#1976d2",
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  padding: "16px 12px",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                رمز المادة
              </TableCell>
              <TableCell
                sx={{
                  color: "#1976d2",
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  padding: "16px 12px",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                اسم المادة
              </TableCell>
              <TableCell
                sx={{
                  color: "#1976d2",
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  padding: "16px 12px",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                الكمية
              </TableCell>
              <TableCell
                sx={{
                  color: "#1976d2",
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  padding: "16px 12px",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                السعر
              </TableCell>
              <TableCell
                sx={{
                  color: "#1976d2",
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  padding: "16px 12px",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                الإجمالي
              </TableCell>
              <TableCell
                sx={{
                  color: "#1976d2",
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  padding: "16px 12px",
                }}
              >
                إجراء
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesList.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{
                  bgcolor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                  borderBottom: "1px solid #e0e0e0",
                  "&:hover": {
                    bgcolor: "#f0f7ff",
                    transition: "background-color 0.2s ease",
                  },
                }}
              >
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: "12px",
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-block",
                      padding: "4px 8px",
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      borderRadius: "4px",
                      border: "1px solid #1976d2",
                    }}
                  >
                    {item.material.cod_material}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: "12px",
                    borderRight: "1px solid #e0e0e0",
                    maxWidth: 200,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: "break-word",
                      color: "#333333",
                      fontWeight: "500",
                    }}
                  >
                    {item.material.name_of_material}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: "12px",
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "600",
                      color: "#2e7d32",
                      fontSize: "0.875rem",
                    }}
                  >
                    {parseFloat(item.quantity).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: "12px",
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1976d2",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                  >
                    {parseFloat(item.price).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#666666",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    دينار
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: "12px",
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#d32f2f",
                      fontWeight: "700",
                      fontSize: "0.875rem",
                    }}
                  >
                    {item.total.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#666666",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    دينار
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: "12px",
                  }}
                >
                  <IconButton
                    onClick={() => handleRemoveSaleItem(item.id)}
                    size="small"
                    sx={{
                      color: "#d32f2f",
                      border: "1px solid #d32f2f",
                      borderRadius: "4px",
                      padding: "4px",
                      "&:hover": {
                        bgcolor: "#d32f2f",
                        color: "white",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {salesList.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "#666666",
          }}
        >
          <Typography variant="body2">لا توجد مواد مضافة للفاتورة</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SalesTable;
