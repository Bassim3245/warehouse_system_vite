import DashboardInformation from "./dashbordInformation";
import { getUserInformation } from "../../../../utils/handelCookie";

function DashboardEntity() {
  const  dataUserById  = getUserInformation();
  return (
    <div className="mt-3">
      <DashboardInformation
        headerText={`أحصائيات ${dataUserById?.Entities_name}  `}
        reportEntity={true}
        entity_id={dataUserById?.entity_id}
      />
    </div>
  );
}

export default DashboardEntity;
