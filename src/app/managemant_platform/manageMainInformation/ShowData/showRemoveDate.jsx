import * as React from "react";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import AllowDelete from "../../../../components/reusableComponent/AllowDelete";
import ModelEdit from "../editData/editData";
import { useTranslation } from "react-i18next";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import axios from "axios";
import { BottomRoot } from "../../../../style/ButtomStyle";

export default function ShowRemoveDate({ BackendUrl }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [DateRemove, setDateRemove] = useState([]);
  const [refresh3, setRefresh3] = useState(false);
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataRemove`);
      setDateRemove(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, refresh3]);

  const renderFormContent = () => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        backgroundColor:
          theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
      }}
    >
      <Table dir="rtl" aria-label="remove date table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(25, 118, 210, 0.05)",
            }}
          >
            <TableCell
              align="right"
              sx={{
                fontWeight: "bold",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
              }}
            >
              المدة الزمنية ألغاء الحجز
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
              }}
            >
              الإجراءات
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DateRemove.length > 0 &&
            DateRemove?.map((item, index) => (
              <TableRow
                key={item?.id}
                hover
                sx={{
                  backgroundColor:
                    index % 2 === 0
                      ? theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)"
                      : "transparent",
                }}
              >
                <TableCell align="right">
                  {item?.remove_date}
                  <span style={{ marginRight: "4px" }}>يوم</span>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <ModelEdit
                      edit_id={item?.id}
                      edit_data={item?.remove_date}
                      edit_path="EditRemoveDateName"
                      setOpen={setOpen}
                      label={"Governorate"}
                    />
                    <AllowDelete
                      delete_id={item?.id}
                      path_delete={"deleteDateRemoveById"}
                      setRefresh3={setRefresh3}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderFormActions = () => (
    <>
      <BottomRoot onClick={() => setOpen(false)}>{t("close")}</BottomRoot>
    </>
  );

  return (
    <div>
      <MenuItem onClick={() => setOpen(true)} disableRipple>
        <span className="ms-2">{t("البيانات المدرجة")}</span>
      </MenuItem>
      <PopupForm
        title={t("امدة الزمنية للحذف")}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="50%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
