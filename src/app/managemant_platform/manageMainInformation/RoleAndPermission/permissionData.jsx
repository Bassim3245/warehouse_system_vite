import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import ShowDataUnitAndRole from "./ShowDataAndRole";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import { getToken } from "../../../../utils/handelCookie";
function PermissionData({ BackendUrl, roles, applicationPermission }) {
  const [permissionName, setpermissionName] = useState("");
  const [dataPermission, setPermissionData] = useState([]);
  const [dataApplicationPermission, setDataApplicationPermission] = useState(
    []
  );
  const [groupSelect, setGroupSelect] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${BackendUrl}/api/setPermission`,
        {
          permissionName: permissionName,
          application_id: groupSelect,
          checkPermissionUser: roles?.management_permission?._id,
          applicationPermission: applicationPermission?.materialObsolete?._id,
        },
        {
          headers: {
            authorization: getToken(),
          },
        }
      );
      toast(response?.data?.message);
      setpermissionName("");
      setGroupSelect("");
    } catch (error) {
      if (error?.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("An error occurred while processing your request.");
      }
    }
  };
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [permissionsResponse, applicationPermissionResponse] =
        await Promise.all([
          axios.get(
            `${BackendUrl}/api/getAllAppAndSubPermission?checkPermissionUser=${roles?.management_permission?._id}&applicationPermission=${applicationPermission?.materialObsolete?._id}`,
            {
              headers: {
                authorization: getToken(),
              },
            }
          ),
          axios.get(`${BackendUrl}/api/getDataApplicationPermission`, {
            headers: {
              authorization: getToken(),
            },
          }),
        ]);
      setPermissionData(permissionsResponse?.data || []);
      setDataApplicationPermission(
        applicationPermissionResponse?.data?.response || []
      );
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    console.log("dataApplicationPermission", dataApplicationPermission);
    fetchData();
  }, [fetchData, roles, applicationPermission]);
  const theme = useTheme();
  return (
    <div className="">
      <Header title="أدخال الصلاحيات" />
      <form onSubmit={handleSubmit}>
        <input
          data-bs-theme={theme.palette.mode === "dark" ? "dark" : ""}
          type="text"
          style={{ direction: "rtl" }}
          className="form-control p-10 rad-6 mb-3"
          placeholder=" كتابة الصلاحية"
          value={permissionName}
          onChange={(e) => setpermissionName(e?.target?.value)}
          required
        />
        <TextField
          id="outlined-select-currency"
          select
          fullWidth
          label="اختر المجموعة"
          helperText="اختر المجموعة"
          value={groupSelect}
          onChange={(e) => {
            setGroupSelect(e?.target?.value);
          }}
        >
          {dataApplicationPermission?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name_applications}
            </MenuItem>
          ))}
        </TextField>
        <div
          className="mt-3"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ButtonTheme className="me-3" onClick={handleSubmit}>
            حفظ المعلومات
          </ButtonTheme>
          <ShowDataUnitAndRole
            themeMode={theme}
            label={"permissions"}
            open={open}
            setOpen={setOpen}
            roles={roles}
            applicationPermission={applicationPermission}
            BackendUrl={BackendUrl}
            dataPermission={dataPermission}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}

export default PermissionData;
