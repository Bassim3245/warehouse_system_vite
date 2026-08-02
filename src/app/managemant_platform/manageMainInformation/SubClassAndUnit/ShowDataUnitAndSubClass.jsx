import * as React from "react";
import { useState, Fragment } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import DialogContent from "@mui/material/DialogContent";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ModelEdit from "./editDataSubandMeasuring.jsx";
import { BackendUrl } from "../../../../redux/api/axios.jsx";
import axios from "axios";
import { getToken } from "../../../../utils/handelCookie.jsx";
import AllowDelete from "../../../../components/reusableComponent/AllowDelete.jsx";
import { ButtonClose, ButtonSave } from "../../../../style/ButtomStyle.jsx";

export default function ShowDataSubAndUnit({ setOpen1 }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [dataSubClass, setDataSubClass] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const token = getToken();
  const fetchSubClassData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataSubClass`, {
        headers: {
          authorization: token,
        },
      });
      setDataSubClass(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  React.useEffect(() => {
    fetchSubClassData();
  }, [open, refresh]);

  return (
    <Fragment>
      <ButtonSave onClick={handleClickOpen}>البيانات المدرجة</ButtonSave>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            minWidth: "80vw",
          },
        }}
      >
        <DialogContent>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor:
                theme?.palette?.mode === "dark" ? "#1e1e1e" : "#fff",
            }}
          >
            <Table dir="rtl" aria-label="sub class data table">
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
                      padding: "12px 16px",
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      padding: "12px 16px",
                    }}
                  >
                    أسم الصنف الخاص
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      padding: "12px 16px",
                    }}
                  >
                    الإجراءات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataSubClass?.map((item, index) => (
                  <TableRow
                    key={item?.subClass_id}
                    hover
                    sx={{
                      transition: "background-color 0.3s",
                      backgroundColor:
                        index % 2 === 0
                          ? theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)"
                          : "transparent",
                    }}
                  >
                    <TableCell align="right" sx={{ padding: "12px 16px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: "12px 16px" }}>
                      {item?.sub_class_name}
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "12px 16px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Tooltip title="تعديل" TransitionComponent={Zoom} arrow>
                          <span>
                            <ModelEdit
                              label="subClass"
                              edit_path={"editSubClass"}
                              edit_id={item?.subClass_id}
                              edit_value={item?.sub_class_name}
                              edit_select={item?.mainClass_id}
                              dataMainClass={dataSubClass}
                              setOpen1={setOpen1}
                              setRefresh={setRefresh}
                            />
                          </span>
                        </Tooltip>
                        <Tooltip title="حذف" TransitionComponent={Zoom} arrow>
                          <span>
                            <AllowDelete
                              delete_id={item?.subClass_id}
                              path_delete={"deleteByIdSubClass"}
                              setRefresh={setRefresh}
                            />
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <ButtonClose
            autoFocus
            onClick={handleClose}
            variant="contained"
            color="error"
          >
            غلق
          </ButtonClose>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
