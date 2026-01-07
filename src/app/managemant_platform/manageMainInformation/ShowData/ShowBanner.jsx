import * as React from "react";
import { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import Table from "react-bootstrap/Table";
import { ButtonSave } from "../../../../style/ButtomStyle";
import axios from "axios";
import { BackendUrl } from "../../../../redux/api/axios";
import ModelEdit from "../editData/editData";
import AllowDelate from "../../../../components/reusableComponent/AllowDelete";
import { getToken } from "../../../../utils/handelCookie";
import Loader from "../../../../components/reusableComponent/Loader";
export default function ShowDataBanner() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [bannerData, setBannerData] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const fetchBannerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BackendUrl}/api/getDataBanner`, {
        headers: {
          authorization: getToken(),
        },
      });
      setBannerData(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchBannerData();
  }, [open, refresh]);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {isLoading && <Loader />}
      <Fragment>
        <ButtonSave onClick={handleClickOpen}> البيانات المدرجة</ButtonSave>
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
              variant={`${theme?.palette?.mode === "dark" ? "dark" : ""}`}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>العنوان</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bannerData?.map((item, index) => (
                  <tr key={item?.id}>
                    <td>{index + 1}</td>
                    <td>{item?.title}</td>
                    <td>{item?.description_banner}</td>
                    <td className="d-flex justify-content-center align-items-center gap-4 ">
                      <ModelEdit
                        edit_id={item?.id}
                        edit_data={item?.title}
                        edit_path="EditBannerName"
                        setOpen={setOpen}
                        edit_data2={item?.description_banner}
                        label="editBanner"
                        setRefresh={setRefresh}
                      />
                      <AllowDelate
                        delete_id={item?.id}
                        path_delete={"deleteBannerById"}
                        setRefresh={setRefresh}
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
    </>
  );
}
