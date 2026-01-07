import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";

import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BackendUrl } from "../../../../redux/api/axios";
import { ButtonClose, ButtonSave, ButtonTheme } from "../../../../style/ButtomStyle";
import { getFileIcon } from "../../../../utils/Function";
import { getToken } from "../../../../utils/handelCookie";
import ModelEdit from "../editData/editData";
import AllowDelate from "../../../../components/reusableComponent/AllowDelete";
import { toast } from "react-toastify";

const UserGuidList = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [userGuid, setUserGuid] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [refresh2, setRefresh] = useState(false);
  const [refresh3, setRefresh3] = useState(false);
  const [active, setIsActive] = useState({}); // Store active status as an object

  const { t } = useTranslation();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const token = getToken();

  const fetchUserGuid = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataUserGuid`, {
        headers: {
          authorization: token,
        },
      });
      setUserGuid(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchUserGuid();
  }, [open, refresh2, refresh3]);
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    // Initialize active checkboxes based on show_guide status
    const initialActiveState = userGuid?.reduce((acc, item) => {
      if (item?.is_show) {
        acc[item?.id] = true;
      } else {
        acc[item?.id] = false;
      }
      return acc;
    }, {});
    setIsActive(initialActiveState);
  }, [userGuid]);

  const handleCheckboxChange = (id) => (event) => {
    const updatedStatus = event.target.checked;
    setIsActive((prevState) => ({
      ...prevState,
      [id]: updatedStatus,
    }));
  };
  const EditAccessTOfile = async () => {
    try {
      const accessData = Object?.entries(active)?.map(([id, status]) => ({
        id,
        show_guide: status ? 1 : 0, // Convert boolean to 1 (true) or 0 (false)
      }));

      const response = await axios.post(
        `${BackendUrl}/api/EditAccessTOfile`,
        { data: accessData }, // Send the updated data
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (response.status === 200) {
        toast(response?.data?.message);
        setRefresh((prev) => !prev); // Trigger re-fetch if needed
        handleClose();
      }
    } catch (error) {
      console.error("Error updating access:", error?.response?.data?.message);
    }
  };
  return (
    <Fragment>
      <ButtonSave onClick={handleClickOpen}>
        البيانات المدرجة
      </ButtonSave>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            minWidth: '80vw',
          }
        }}
      >
        <DialogContent>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              backgroundColor: theme?.palette?.mode === "dark" ? "#1e1e1e" : "#fff",
            }}
          >
            <Table
              striped
              bordered
              hover
              dir="rtl"
              variant={`${theme?.palette?.mode === "dark" ? "dark" : ""}`}
            >
              <thead>
                <tr style={{
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(25, 118, 210, 0.05)",
                }}>
                  <th style={{
                    fontWeight: 'bold',
                    color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                    padding: '12px 16px',
                  }}>#</th>
                  <th style={{
                    fontWeight: 'bold',
                    color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                    padding: '12px 16px',
                  }}>الوصف</th>
                  <th style={{
                    fontWeight: 'bold',
                    color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                    padding: '12px 16px',
                  }}>الملفات</th>
                  <th style={{
                    fontWeight: 'bold',
                    color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                    padding: '12px 16px',
                  }}>{t("Action")}</th>
                  <th style={{
                    fontWeight: 'bold',
                    color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                    padding: '12px 16px',
                  }}>حق الوصول</th>
                </tr>
              </thead>
              <tbody>
                {userGuid?.map((item, index) => (
                  <tr
                    key={item?.id}
                    style={{
                      transition: "background-color 0.3s",
                      backgroundColor: index % 2 === 0
                        ? (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)")
                        : "transparent"
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                    <td style={{ padding: '12px 16px' }}>{item?.description}</td>
                    <td style={{ padding: '12px 16px' }}>{getFileIcon(item?.file_name, "", "edit")}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="تعديل" TransitionComponent={Zoom} arrow>
                          <span>
                            <ModelEdit
                              edit_id={item?.id}
                              edit_data={item?.description}
                              edit_path="editUserGuid"
                              setOpen={setOpen}
                              dataMainClass={userGuid}
                              ministries_id={item?.id}
                              label="mainClass"
                              labelFelid={t("الوصف")}
                              imageName={item?.file_name}
                              image_id={item?.id}
                              setRefresh3={setRefresh3}
                            />
                          </span>
                        </Tooltip>
                        <Tooltip title="حذف" TransitionComponent={Zoom} arrow>
                          <span>
                            <AllowDelate
                              delete_id={item?.id}
                              path_delete={"deleteUserGuidById"}
                              setRefresh={setRefresh}
                              setOpen={setOpen}
                            />
                          </span>
                        </Tooltip>
                      </Box>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <FormGroup>
                        <FormControlLabel
                          key={item?.id}
                          control={
                            <Checkbox
                              checked={active[item?.id] || false} // If the item ID exists in active, checkbox will be checked
                              onChange={handleCheckboxChange(item?.id)}
                              sx={{
                                color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                                '&.Mui-checked': {
                                  color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                                },
                              }}
                            />
                          }
                          label={item?.label}
                        />
                      </FormGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
          <ButtonClose
            onClick={handleClose}
            variant="contained"
          >
            غلق
          </ButtonClose>
          <ButtonTheme
            onClick={EditAccessTOfile}
            variant="contained"
            color="primary"
          >
            حفظ التغييرات
          </ButtonTheme>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default UserGuidList;
