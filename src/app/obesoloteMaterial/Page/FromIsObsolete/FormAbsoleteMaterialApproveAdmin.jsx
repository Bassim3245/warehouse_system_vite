import "../style.css";
import FormApproveToRequest from "./ApproveListData.jsx";
import { useTranslation } from "react-i18next";
import usePermissionUser from "../../../../hooks/usePermissionUser";
const FormObsoleteMaterialApproveAdmin = () => {
  const {
    roles,
    applicationPermission,
    dataUserById,
    rtl,
  } = usePermissionUser();
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
