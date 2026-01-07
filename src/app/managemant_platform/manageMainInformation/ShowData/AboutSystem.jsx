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
import ModelEdit from "../editData/editAboutSystem";
import { debounce } from "@mui/material";
import { getToken } from "../../../../utils/handelCookie";
export default function ShowDataAboutSystem() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [aboutSystem, setAboutSystem] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [refresh, setRefresh] = useState(false);
  const containerRef = React.useRef(null);
  const handleResize = debounce(() => {
    if (containerRef.current) {
      console.log(
        "Container resized:",
        containerRef.current.getBoundingClientRect()
      );
    }
  }, 100); // Adjust the debounce time as needed

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
          <Table
            striped
            bordered
            hover
            dir="rtl"
            variant={theme?.palette?.mode === "dark" ? "dark" : ""}
          >
            <thead>
              <tr>
                <th>العنوان</th>
                <th> النص </th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {aboutSystem?.map((item) => (
                <tr key={item?.id}>
                  <td>{item?.title}</td>
                  <td>{item?.text}</td>
                  <td className="d-flex justify-content-center align-items-center gap-4 ">
                    {/* Uncomment and integrate ModelEdit if needed */}
                    <ModelEdit setRefresh={setRefresh} aboutSystem={item} />
                    <AllowDelete
                      delete_id={item?.id}
                      path_delete={"deleteAboutById"}
                      setRefresh={setRefresh}
                      setOpen={setOpen}
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
