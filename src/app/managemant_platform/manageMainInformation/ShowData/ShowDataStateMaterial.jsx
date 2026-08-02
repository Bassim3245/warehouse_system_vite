import * as React from "react";
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
import { ButtonClearState } from "../../../../style/ButtomStyle";
import ModelEdit from "../editData/editData";
import AllowDelate from "../../../../components/reusableComponent/AllowDelete";
import { useDispatch, useSelector } from "react-redux";
import { getDataStateName } from "../../../../redux/StateMartrialState/stateMatrialAction";

export default function ShowData({ refresh, setRefresh }) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { stateMaterial } = useSelector((state) => state.StateMaterial);

  React.useEffect(() => {
    dispatch(getDataStateName());
  }, [dispatch, refresh]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonClearState variant="outlined" onClick={handleClickOpen}>
        ألبيانات المدرجة
      </ButtonClearState>
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
            <Table dir="rtl" aria-label="state material table">
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
                    }}
                  >
                    اسم الحالة
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
                    اجراء
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateMaterial?.map((data, index) => (
                  <TableRow
                    key={data?.id}
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
                    <TableCell align="right">{index + 1}</TableCell>
                    <TableCell align="right">{data?.state_name}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <AllowDelate
                          delete_id={data?.id}
                          path_delete={"deleteStatusById"}
                          setRefresh={setRefresh}
                        />
                        <ModelEdit
                          edit_id={data?.id}
                          edit_data={data?.state_name}
                          edit_path="EditStateName"
                          setOpen={setOpen}
                          setRefresh={setRefresh}
                          label="Ministries"
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
    </React.Fragment>
  );
}
