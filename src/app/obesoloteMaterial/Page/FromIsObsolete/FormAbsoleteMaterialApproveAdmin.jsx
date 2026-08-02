import "../style.css";
import FormApproveToRequest from "./ApproveListData.jsx";
import { useTranslation } from "react-i18next";
import useUserPermissions from "../../../../hooks/genaral/useUserPermissions";
import useUserData from "../../../../hooks/genaral/useUserData.jsx";
const FormObsoleteMaterialApproveAdmin = () => {
  const {
    roles,
    applicationPermission,
  } = useUserPermissions();
    const { dataUserById, rtl } = useUserData()
  
  const { t } = useTranslation()
  return (
    <>
      <FormApproveToRequest
        urlFetcHData={"getDataStagnantMaterialsApproveAdmin"}
        pathApprove={"ApproveAdminMaterial"}
        title={t("Approval of material upload requests by the authorized person")}
        technicalSupport={false}
        approve_to_request={roles?.approve_admin_to_request._id}
        roles={roles}
        applicationPermission={applicationPermission}
        dataUserById={dataUserById}
        rtl={rtl}
      />
    </>
  );
};
export default FormObsoleteMaterialApproveAdmin;
