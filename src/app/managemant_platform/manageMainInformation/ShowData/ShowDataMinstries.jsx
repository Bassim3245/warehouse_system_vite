import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { ButtonClearState, ButtonClose } from "../../../../style/ButtomStyle";
import ModelEdit from "../editData/editData";
import AllowDelate from "../../../../components/reusableComponent/AllowDelete";

export default function ShowData(props) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
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
            <Table dir="rtl" aria-label="ministries data table">
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
                    اسم الوزارة
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
                    اجراء
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props?.DataShowInformationMinist?.map((data, index) => (
                  <TableRow
                    key={data?.id}
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
                      {data?.ministries}
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
                        <Tooltip title="حذف" TransitionComponent={Zoom} arrow>
                          <span>
                            <AllowDelate
                              delete_id={data?.id}
                              path_delete={"deleteMinistersById"}
                              setRefresh={props?.setRefresh}
                            />
                          </span>
                        </Tooltip>
                        <Tooltip title="تعديل" TransitionComponent={Zoom} arrow>
                          <span>
                            <ModelEdit
                              edit_id={data?.id}
                              edit_data={data?.ministries}
                              edit_path="EditMinistries"
                              setOpen={setOpen}
                              setRefresh={props?.setRefresh}
                              label="Ministries"
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
    </React.Fragment>
  );
}
