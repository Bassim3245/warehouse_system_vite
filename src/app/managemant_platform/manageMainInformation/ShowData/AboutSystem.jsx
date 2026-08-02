import * as React from "react";
import { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { ButtonSave } from "../../../../style/ButtomStyle";
import axios from "axios";
import { BackendUrl } from "../../../../redux/api/axios";
import AllowDelete from "../../../../components/reusableComponent/AllowDelete";
import ModelEdit from "../editData/editAboutSystem";
import { getToken } from "../../../../utils/handelCookie";

export default function ShowDataAboutSystem() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [aboutSystem, setAboutSystem] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [refresh, setRefresh] = useState(false);
  const containerRef = React.useRef(null);


  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    const currentRef = containerRef.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, [handleResize]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataAbout`, {
        headers: { authorization: getToken() },
      });
      setAboutSystem(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  React.useEffect(() => {
    fetchAboutData();
  }, [open, refresh]);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <ButtonSave onClick={handleClickOpen}>البيانات المدرجة</ButtonSave>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
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
            <Table dir="rtl" aria-label="about system table">
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
                    العنوان
                  </TableCell>
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
                    النص
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
                {aboutSystem?.map((item, index) => (
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
                    <TableCell align="right">{item?.title}</TableCell>
                    <TableCell align="right">{item?.text}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <ModelEdit setRefresh={setRefresh} aboutSystem={item} />
                        <AllowDelete
                          delete_id={item?.id}
                          path_delete={"deleteAboutById"}
                          setRefresh={setRefresh}
                          setOpen={setOpen}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            غلق
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
