import * as React from "react";
import { useState, Fragment } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import axios from "axios";
import { BackendUrl } from "../../../../redux/api/axios";
import ModelEdit from "../editData/editData";
import AllowDelate from "../../../../components/reusableComponent/AllowDelete";
import { getToken } from "../../../../utils/handelCookie";
import { useTranslation } from "react-i18next";
import Loader from "../../../../components/reusableComponent/Loader";
import { ButtonClose, ButtonSave } from "../../../../style/ButtomStyle";
import { StyledImage } from "../../../../style/generalStyle";

export default function MainClassList() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [dataMainClass, setDataMainClass] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [refresh2, setRefresh] = useState(false);
  const [refresh3, setRefresh3] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const token = getToken();
  const fetchMainClassData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataMainClass`, {
        headers: {
          authorization: token,
        },
      });
      setDataMainClass(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchMainClassData();
  }, [open, refresh2, refresh3]);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {isLoading && <Loader />}
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
                  theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
              }}
            >
              <Table dir="rtl" aria-label="main class table">
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
                      اسم الصنف الرئيسي
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
                      الصورة
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
                      الاجراءات
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataMainClass?.map((item, index) => (
                    <TableRow
                      key={item?.mainClass_id}
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
                        {item?.main_Class_name}
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "12px 16px" }}>
                        <StyledImage
                          src={`${BackendUrl}/uploads/${item?.file_name}`}
                          alt=""
                        />
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
                          <Tooltip
                            title="تعديل"
                            TransitionComponent={Zoom}
                            arrow
                          >
                            <span>
                              <ModelEdit
                                edit_id={item?.mainClass_id}
                                edit_data={item?.main_Class_name}
                                edit_path="editMainClass"
                                setOpen={setOpen}
                                dataMainClass={dataMainClass}
                                ministries_id={item?.ministries_id}
                                label="mainClass"
                                labelFelid={t("mainClass")}
                                imageName={item?.file_name}
                                image_id={item?.id}
                                setRefresh3={setRefresh3}
                              />
                            </span>
                          </Tooltip>
                          <Tooltip
                            title="حذف"
                            TransitionComponent={Zoom}
                            arrow
                          >
                            <span>
                              <AllowDelate
                                delete_id={item?.mainClass_id}
                                path_delete={"deleteByIdMainClass"}
                                setRefresh={setRefresh}
                                setOpen={setOpen}
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
    </>
  );
}
