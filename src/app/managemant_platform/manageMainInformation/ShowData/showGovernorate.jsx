import * as React from "react";
import { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Table from "react-bootstrap/Table";
import { ButtonSave } from "../../../../style/ButtomStyle";
import axios from "axios";
import { BackendUrl } from "../../../../redux/api/axios";
import AllowDelete from "../../../../components/reusableComponent/AllowDelete";
import ModelEdit from "../editData/editData";
import { getToken } from "../../../../utils/handelCookie";
export default function ShowGovernorate() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [governorate, setGovernorate] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [refresh3, setRefresh3] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataGovernorate`,{
        headers:{
          authorization:getToken()
        }
      });
      setGovernorate(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, refresh3]);
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
          <Table
            striped
            bordered
            hover
            dir="rtl"
            variant={theme?.palette?.mode === "dark" ? "dark" : ""}
          >
            <thead>
              <tr>
                <th>أسماء المحافظات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {governorate?.map((item) => (
                <tr key={item?.id}>
                  <td>{item?.governorate_name}</td>
                  <td className="d-flex justify-content-center align-items-center gap-4 ">
                    {/* Uncomment and integrate ModelEdit if needed */}
                    <ModelEdit
                      edit_id={item?.id}
                      edit_data={item?.governorate_name}
                      edit_path="editGovernorate"
                      setOpen={setOpen}
                      label={"Governorate"}
                    />
                    <AllowDelete
                      delete_id={item?.id}
                      path_delete={"deleteGovernorateById"}
                      setRefresh3={setRefresh3}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
