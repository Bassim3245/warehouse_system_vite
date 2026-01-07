import "../style.css";
import FormApproveToRequest from "./ApproveListData.jsx";
import { useTranslation } from "react-i18next";
import usePermissionUser from "../../../../hooks/usePermissionUser";
const FormObsoleteMaterialApproveAdmin = () => {
  const { roles, applicationPermission, dataUserById, rtl } =
    usePermissionUser();
  const { t } = useTranslation();
  return (
    <>
      <FormApproveToRequest
        urlFetcHData={"getDataStagnantMaterialsApproveSuperAdminRoot"}
        pathApprove={"ApproveSuperAdminMaterial"}
        title={t(
          "Approval of material upload requests by the platform administrators"
        )}
        approve_to_request={roles?.approve_Super_admin_root_to_request?._id}
        technicalSupport={true}
        roles={roles}
        applicationPermission={applicationPermission}
        dataUserById={dataUserById}
        rtl={rtl}
      />
    </>
  );
};
export default FormObsoleteMaterialApproveAdmin;
