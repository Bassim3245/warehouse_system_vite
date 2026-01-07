import { useSelector } from "react-redux";
import Notification from "../../../../main_page/Notification/Notification";
export default function NotificationObsoletedMaterial() {
  const { roles } = useSelector((state) => state.RolesData);

  return (
    <Notification urlApi="getNotification" permission={roles.management_Nonfiction?._id} category_id={1} />
  );
}
 