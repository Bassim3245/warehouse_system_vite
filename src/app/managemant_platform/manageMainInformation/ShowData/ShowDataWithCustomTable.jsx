import  { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BackendUrl } from '../../../../redux/api/axios';
import { getToken } from '../../../../utils/handelCookie';
import { TableDialog } from '../../../../components/CustomTable/CustomTableExample';
import { CustomTableRow, CustomTableCell, ActionTooltip, ActionsContainer } from '../../../../components/CustomTable/CustomTable';
import ModelEdit from '../editData/editData';
import AllowDelate from '../../../../components/AllowDelete';

/**
 * ShowDataWithCustomTable - A refactored version of ShowDataAndRole using the new CustomTable component
 */
const ShowDataWithCustomTable = ({ label }) => {
  const [dataPermission, setPermissionData] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const { roles, applicationPermission } = useSelector((state) => state.RolesData);
  
  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        axios.get(`${BackendUrl}/api/getRole?checkPermissionUser=${roles?.management_permission?._id}&applicationPermission=${applicationPermission?.materialObsolete?._id}`,{
          headers:{
            authorization: getToken()
          }
        }),
        axios.get(`${BackendUrl}/api/getAllPermissions?checkPermissionUser=${roles?.management_permission?._id}&applicationPermission=${applicationPermission?.materialObsolete?._id}`,{
          headers:{
            authorization: getToken()
          }
        }),
      ]);
      setDataGroup(rolesResponse?.data?.response || []);
      setPermissionData(permissionsResponse?.data || []);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  }, [roles, applicationPermission]);

  // Define headers based on the label
  const getHeaders = () => {
    if (label === "Role") {
      return [
        { id: 'id', label: '#' },
        { id: 'role', label: 'الدور' },
        { id: 'actions', label: 'الإجراءات' }
      ];
    } else if (label === "permissions") {
      return [
        { id: 'id', label: '#' },
        { id: 'permission', label: 'الصلاحيات' },
        { id: 'actions', label: 'الإجراءات' }
      ];
    }
    return [];
  };

  // Define row rendering function
  const renderRow = (item, index) => {
    if (label === "Role") {
      return (
        <CustomTableRow key={item?.id} index={index}>
          <CustomTableCell>{index + 1}</CustomTableCell>
          <CustomTableCell>{item?.group_name}</CustomTableCell>
          <CustomTableCell>
            <ActionsContainer>
              <ActionTooltip title="حذف">
                <AllowDelate
                  delete_id={item?.id}
                  path_delete={"deleteRoleById"}
                  setRefresh={fetchData}
                />
              </ActionTooltip>
              <ActionTooltip title="تعديل">
                <ModelEdit
                  edit_id={item?.id}
                  edit_data={item?.group_name}
                  edit_path="editRole"
                  setRefresh={fetchData}
                  label="Role"
                />
              </ActionTooltip>
            </ActionsContainer>
          </CustomTableCell>
        </CustomTableRow>
      );
    }
    return null;
  };

  // Get table title based on label
  const getTableTitle = () => {
    if (label === "Role") return "الأدوار";
    if (label === "permissions") return "الصلاحيات";
    return "";
  };

  return (
    <TableDialog
      title={getTableTitle()}
      headers={getHeaders()}
      data={label === "Role" ? dataGroup : dataPermission}
      fetchData={fetchData}
      renderRow={renderRow}
    />
  );
};

export default ShowDataWithCustomTable;
