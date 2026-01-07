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
import Table from "react-bootstrap/Table";
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
            <Table
              striped
              bordered
              hover
              dir="rtl"
              variant={theme?.palette?.mode === "dark" ? "dark" : ""}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(25, 118, 210, 0.05)",
                  }}
                >
                  <th
                    style={{
                      fontWeight: "bold",
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      padding: "12px 16px",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      fontWeight: "bold",
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      padding: "12px 16px",
                    }}
                  >
                    أسم الصنف الخاص
                  </th>
                  <th
                    style={{
                      fontWeight: "bold",
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      padding: "12px 16px",
                    }}
                  >
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataSubClass?.map((item, index) => (
                  <tr
                    key={item?.subClass_id}
                    style={{
                      transition: "background-color 0.3s",
                      backgroundColor:
                        index % 2 === 0
                          ? theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)"
                          : "transparent",
                    }}
                    className="hover-row"
                  >
                    <td style={{ padding: "12px 16px" }}>{index + 1}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {item?.sub_class_name}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
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
