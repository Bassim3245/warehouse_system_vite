import * as React from "react";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Table from "react-bootstrap/Table";
import AllowDelete from "../../../../components/reusableComponent/AllowDelete";
import ModelEdit from "../editData/editData";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import axios from "axios";
import { BottomRoot } from "../../../../style/ButtomStyle";
export default function ShowRemoveDate({ BackendUrl }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [DateRemove, setDateRemove] = useState([]);
  const [refresh3, setRefresh3] = useState(false);
  const { t } = useTranslation();
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataRemove`);
      setDateRemove(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  React.useEffect(() => {
    if (open) {
      console.log();
      fetchData();
    }
  }, [open, refresh3]);

  const renderFormContent = () => (
    <Table
      striped
      bordered
      hover
      dir="rtl"
      variant={theme?.palette?.mode === "dark" ? "dark" : ""}
    >
      <thead>
        <tr>
          <th>المدة الزمنية ألغاء الحجز</th>
          <th>الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {DateRemove.length > 0 &&
          DateRemove?.map((item) => (
            <tr key={item?.id}>
              <td>
                {" "}
                {item?.remove_date}
                <span>يوم</span>{" "}
              </td>
              <td className="d-flex justify-content-center align-items-center gap-4 ">
                <ModelEdit
                  edit_id={item?.id}
                  edit_data={item?.remove_date}
                  edit_path="EditRemoveDateName"
                  setOpen={setOpen}
                  label={"Governorate"}
                />
                <AllowDelete
                  delete_id={item?.id}
                  path_delete={"deleteDateRemoveById"}
                  setRefresh3={setRefresh3}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );

  const renderFormActions = () => (
    <>
      <BottomRoot onClick={() => setOpen(false)}>{t("close")}</BottomRoot>
      {/* <BottomSend type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? t("loading") : t("saveChange")}
        </BottomSend> */}
    </>
  );

  return (
    <div>
      <MenuItem onClick={() => setOpen(true)} disableRipple>
        <span className="ms-2">{t("البيانات المدرجة")}</span>
      </MenuItem>
      <PopupForm
        title={t("امدة الزمنية للحذف")}
        open={open}
        onClose={() => setOpen(false)} // Correct closing behavior
        setOpen={setOpen}
        width="50%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
