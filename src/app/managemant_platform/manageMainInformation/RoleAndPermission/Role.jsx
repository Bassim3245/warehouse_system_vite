import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import {useTheme } from "@mui/material/styles";
import ShowDataUnitAndRole from "./ShowDataAndRole";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import { getToken } from "../../../../utils/handelCookie";
import { TextField } from "@mui/material";
function RoleSystem({BackendUrl,roles , applicationPermission}) {
  const [RoleName, setRoleName] = useState("");
  const [dataGroup, setDataGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${BackendUrl}/api/setRole`,
        {
          RoleName: RoleName,
          // applicationPermission:applicationPermission?.materialObsolete?._id,
          checkPermissionUser:roles?.management_permission?._id
        },
        {
          headers: {
            authorization: getToken(),
          },
        }
      );
      toast(response?.data?.message);
      setRoleName("");
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
      const [rolesResponse] = await Promise.all([
        axios.get(`${BackendUrl}/api/getRole?checkPermissionUser=${roles?.management_permission?._id}&applicationPermission=${applicationPermission?.materialObsolete?._id}`,{
          headers:{
            authorization:getToken()
          }
        }),
      ]);
      setDataGroup(rolesResponse?.data?.response || []);
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
 
  const theme = useTheme();
  return (
    <div className="">
      <Header title="تحديد مستخدم النظام"/>
      <form onSubmit={handleSubmit}>
         <TextField
            label={"أسم المجموعة"}
            fullWidth
            value={RoleName}
            required
            readOnly={false}
            onChange={(e) => {
              setRoleName(e.target.value);
            }}
            onClearClick={() => {
              setRoleName("");
            }}
          />
        <div className="mt-3" style={{ display:"flex",justifyContent:"center" ,gap:"10px"}}>
          <ButtonTheme className="me-3" onClick={handleSubmit}>
            حفظ المعلومات 
          </ButtonTheme>
          <ShowDataUnitAndRole themeMode={theme} label={"Role"} token={getToken} open={open} setOpen={setOpen} loading={loading} dataGroup={dataGroup} />
        </div>
      </form>
    </div>
  );
}

export default RoleSystem;
