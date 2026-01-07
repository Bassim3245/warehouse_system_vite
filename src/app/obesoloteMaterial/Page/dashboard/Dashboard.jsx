import DashboardInformation from "./dashbordInformation";
import { getUserInformation } from "../../../../utils/handelCookie";
const Dashboard = () => {
  const dataUserById = getUserInformation();
  return (
    <div className="mt-3 ">
      <DashboardInformation
        headerText={"الإحصائيات العامة"}
        reportEntity={false}
        entity_id={dataUserById?.entity_id}
      />
    </div>
  );
};

export default Dashboard;
