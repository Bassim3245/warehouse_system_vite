import React, { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HeaderCenter from "../../../../components/reusableComponent/HeaderCenterComponent";
import Loader from "../../../../components/reusableComponent/Loader";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModelEdit from "../editData/editData";
import { CheckCircleIcon } from "lucide-react";
import { Cancel } from "@mui/icons-material";

export default function ShowDataUnitAndRole({
  label,
  open,
  setOpen,
  loading,
  dataPermission = [],
  dataGroup = [],
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openRow, setOpenRow] = useState(null);
  const handleSetPermission = (id) => navigate(`SetPermissionToGroup/${id}`);
  const getTableTitle = () => {
    if (label === "Role") return "الأدوار";
    if (label === "permissions") return "الصلاحيات";
    return "";
  };
  const renderRows = () => {
    if (label === "Role") {
      return dataGroup?.map((item, index) => (
        <TableRow
          key={item?.id}
          sx={{
            transition: "background-color 0.3s",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
            },
            "&:nth-of-type(odd)": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
            },
          }}
        >
          <TableCell align="center">{index + 1}</TableCell>
          <TableCell align="center">{item?.label}</TableCell>
          <TableCell align="center">{item?.group_name}</TableCell>
          <TableCell align="center">
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              <Tooltip title="حذف" TransitionComponent={Zoom} arrow>
                <IconButton
                  color="error"
                  size="small"
                  sx={{
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="تعديل" TransitionComponent={Zoom} arrow>
                <IconButton
                  color="primary"
                  size="small"
                  sx={{
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="اضافة صلاحيات" TransitionComponent={Zoom} arrow>
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => handleSetPermission(item?.id)}
                  sx={{
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        </TableRow>
      ));
    }
    if (label === "permissions") {
      return dataPermission?.map((item, index) => {
        const isOpen = openRow === item?.application_id;
        return (
          <React.Fragment key={item?.application_id}>
            <TableRow
              sx={{
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                },
                "&:nth-of-type(odd)": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                },
              }}
            >
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell align="center">{item?.name_applications}</TableCell>
              <TableCell align="center">
                <Tooltip title="تعديل" TransitionComponent={Zoom} arrow>
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() =>
                    setOpenRow(isOpen ? null : item.application_id)
                  }
                >
                  {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} sx={{ p: 0, border: 0 }}>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      الصلاحيات
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {item?.permissions?.map((perm) => (
                          <TableRow key={perm?.id}>
                            <TableCell align="center">
                              {perm?.permission_name}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip
                                title="تعديل الصلاحية"
                                TransitionComponent={Zoom}
                                arrow
                              >
                                {/* <IconButton
                                  color="primary"
                                  size="small"
                                  // onClick={() => handleEditPermission(perm)}
                                  sx={{
                                    transition: "transform 0.2s",
                                    "&:hover": { transform: "scale(1.1)" },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton> */}
                                <ModelEdit
                                  edit_id={perm?.id}
                                  edit_data={perm?.permission_name}
                                  edit_path="editPermission"
                                  setOpen={setOpen}
                                  label={"editPermission"}
                                />
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      });
    }
    if (label === "CompanyStructure") {
      // Helper function to render boolean values with icons
      const renderBooleanCell = (value) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
          ) : (
            <Cancel sx={{ color: "error.main", fontSize: 20 }} />
          )}
        </Box>
      );

      return dataGroup?.map((item, index) => (
        <TableRow
          key={item?.id || index}
          sx={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
              transform: "translateY(-1px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 2px 8px rgba(255, 255, 255, 0.1)"
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
            },
            "&:nth-of-type(odd)": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
            },
          }}
        >
          {/* Row Number */}
          <TableCell
            align="center"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              minWidth: 60,
            }}
          >
            {index + 1}
          </TableCell>

          {/* Structure Type */}
          <TableCell
            align="center"
            sx={{
              fontWeight: 500,
              minWidth: 120,
            }}
          >
            <Chip
              label={item?.structure_type || "غير محدد"}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)",
              }}
            />
          </TableCell>

          {/* Has Factory */}
          <TableCell align="center" sx={{ minWidth: 80 }}>
            {renderBooleanCell(item?.has_factory)}
          </TableCell>

          {/* Has Lab */}
          <TableCell align="center" sx={{ minWidth: 80 }}>
            {renderBooleanCell(item?.has_lab)}
          </TableCell>

          {/* Has Warehouse */}
          <TableCell align="center" sx={{ minWidth: 80 }}>
            {renderBooleanCell(item?.has_warehouse)}
          </TableCell>

          {/* Entity Name */}
          <TableCell
            align="center"
            sx={{
              fontWeight: 500,
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Tooltip title={item?.Entities_name || "غير محدد"} arrow>
              <Typography variant="body2">
                {item?.Entities_name || "غير محدد"}
              </Typography>
            </Tooltip>
          </TableCell>

          {/* Action Buttons */}
          <TableCell align="center" sx={{ minWidth: 160 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 0.5,
                flexWrap: "wrap",
              }}
            >
              <ModelEdit
                edit_id={item?.id}
                edit_data={item?.Entities_name}
                edit_path="editEntities"
                setOpen={setOpen}
                ministries_id={item?.ministries_id}
                label="Entities"
              />
            </Box>
          </TableCell>
        </TableRow>
      ));
    }
    return null;
  };

  return (
    <Fragment>
      {loading && <Loader />}
      <Button variant="outlined" onClick={handleClickOpen}>
        البيانات المدرجة
      </Button>
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
        BackdropProps={{
          style: {
            background:
              theme.components.MuiDialog.defaultProps.BackdropProps.style.background,
            backdropFilter:
              theme.components.MuiDialog.defaultProps.BackdropProps.style.backdropFilter,
          },
        }}
      >
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <HeaderCenter title={getTableTitle()} typeHeader="h5" />
          </Box>
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
            <Table dir="rtl">
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
                    align="center"
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
                  {label === "Role" ? (
                    <>
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
                        label
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
                        group_value
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
                        action
                      </TableCell>
                    </>
                  ) : label === "permissions" ? (
                    <>
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
                        permissions
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
                        action
                      </TableCell>
                    </>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>{renderRows()}</TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            sx={{
              borderRadius: "8px",
              minWidth: "100px",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
