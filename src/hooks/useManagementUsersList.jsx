import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getRoleAndUserId } from "../redux/RoleSlice/rolAction.jsx";
import { getToken } from "../utils/handelCookie.jsx";
import { renderMenuItem } from "../utils/Function.jsx";
import { BackendUrl } from "../redux/api/axios.jsx";
import { entityUserColumnGrid, userColumnGrid } from "../utils/ColumnsGridData";
import { axiosInstance } from "../redux/api/axiosConfig";

const useManagementUsersList = (props) => {
  const {
    dataUser,
    setRefreshButton,
    setDelete,
    pathLink,
    Ministries,
    Entities,
    roles,
    applicationPermission,
    rtl,
    permissionData,
    dataUserById = {},
  } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const token = getToken();

  /** ---------------- STATES ---------------- */
  const [activeStatuses, setActiveStatuses] = useState({});
  const [DataGovernorate, setGovernorate] = useState([]);
  const [DataJobTitle, setJobTitle] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [DataApplicationPermission, setDataApplicationPermission] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [FilterDataUserSearch, setFilterDataUser] = useState([]);
  const [UsersDataRow, setUserDataRow] = useState([]);

  /** ---------------- INITIAL FETCH ---------------- */

  const dispatchRoleUserId = useCallback(() => {
    dispatch(getRoleAndUserId(token));
  }, [token, dispatch]);

  useEffect(() => {
    dispatchRoleUserId();
  }, [dispatchRoleUserId]);

  /** GET ROLES */
  const fetchRoles = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${BackendUrl}/api/getRole`);
      setDataGroup(res?.data?.response || []);
    } catch (err) {
      console.error(err?.response?.data?.message);
    }
  }, []);

  /** GET APP PERMISSION */
  const fetchPermissions = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${BackendUrl}/api/getDataApplicationPermission`);
      setDataApplicationPermission(res?.data?.response || []);
    } catch (err) {
      console.error(err?.response?.data?.message);
    }
  }, []);

  /** GET GOVERNORATE */
  const getGovernorate = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${BackendUrl}/api/getDataGovernorate`);
      setGovernorate(res?.data?.response || []);
    } catch (err) {
      console.error(err?.response?.data?.message);
    }
  }, []);

  /** GET JOB TITLE */
  const getJobTitle = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${BackendUrl}/api/getDataJobTitle`);
      setJobTitle(res?.data?.response || []);
    } catch (err) {
      console.error(err?.response?.data?.message);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    getJobTitle();
    getGovernorate();
  }, [fetchRoles, fetchPermissions, getJobTitle, getGovernorate]);

  /** ---------------- TOGGLE STATUS ---------------- */

  const handleToggle = useCallback(
    async (params, toggleType) => {
      const { row } = params;

      let stateKey =
        toggleType === "account_used"
          ? row.active_id
          : `${row.active_id}_user_active`;

      const current =
        activeStatuses[stateKey] ??
        (toggleType === "account_used"
          ? Boolean(row.is_account_used)
          : Boolean(row.is_active));

      const newValue = !current;

      let requestData = {
        user_id: row.user_id,
        dataId: row.active_id,
        isAdmin: toggleType === "account_used",
        is_account_used:
          toggleType === "account_used"
            ? newValue
            : Boolean(row.is_account_used),
        is_active:
          toggleType === "user_active"
            ? newValue
            : Boolean(row.is_active),
      };

      try {
        const res = await axios.post(`${BackendUrl}/api/ActiveAccount`, requestData, {
          headers: { authorization: token },
        });

        if (res.status === 200) {
          toast.success(res.data.message || "Updated Successfully");

          setActiveStatuses((prev) => ({
            ...prev,
            [stateKey]: newValue,
          }));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update");
      }
    },
    [activeStatuses, token]
  );

  /** ---------------- FILTER DATA ---------------- */

  useEffect(() => {
    setUserDataRow(
      FilterDataUserSearch.length > 0 ? FilterDataUserSearch : dataUser
    );
  }, [FilterDataUserSearch, dataUser]);

  /** ---------------- NAVIGATION ---------------- */

  const AddPermission = useCallback(
    (user_id) => navigate(`${pathLink}/${user_id}`),
    [navigate, pathLink]
  );

  /** ---------------- MEMOIZED COLUMNS ---------------- */

  const userColumns = useMemo(
    () =>
      userColumnGrid({
        t,
        token,
        setRefreshButton,
        DataGovernorate,
        DataJobTitle,
        dataGroup,
        setAnchorEl,
        setDelete,
        handleToggle,
        activeStatuses,
        AddPermission,
        renderMenuItem,
        applicationPermission,
        roles,
        DataApplicationPermission,
        rtl,
        Ministries,
        Entities,
      }),
    [
      t,
      token,
      setRefreshButton,
      DataGovernorate,
      DataJobTitle,
      dataGroup,
      setAnchorEl,
      setDelete,
      handleToggle,
      activeStatuses,
      AddPermission,
      applicationPermission,
      roles,
      DataApplicationPermission,
      rtl,
      Ministries,
      Entities,
    ]
  );

  const entityUserColumns = useMemo(
    () =>
      entityUserColumnGrid({
        t,
        token,
        setRefreshButton,
        DataGovernorate,
        DataJobTitle,
        dataGroup,
        setAnchorEl,
        setDelete,
        handleToggle,
        activeStatuses,
        AddPermission,
        renderMenuItem,
        applicationPermission,
        roles,
        DataApplicationPermission,
        rtl,
        dataUserById,
      }),
    [
      t,
      token,
      setRefreshButton,
      DataGovernorate,
      DataJobTitle,
      dataGroup,
      setAnchorEl,
      setDelete,
      handleToggle,
      activeStatuses,
      AddPermission,
      applicationPermission,
      roles,
      DataApplicationPermission,
      rtl,
      dataUserById,
    ]
  );

  /** ---------------- MEMOIZED ROWS ---------------- */

  const rows = useMemo(
    () =>
      UsersDataRow?.map((item, idx) => ({
        index: idx + 1,
        ...item,
      })),
    [UsersDataRow]
  );

  /** ---------------- RETURN ---------------- */

  return {
    activeStatuses,
    DataGovernorate,
    DataJobTitle,
    dataGroup,
    anchorEl,
    setAnchorEl,
    FilterDataUserSearch,
    setFilterDataUser,
    UsersDataRow,
    DataApplicationPermission,
    entityUserColumns,
    userColumns,
    Ministries,
    Entities,
    roles,
    applicationPermission,
    rtl,
    handleToggle,
    AddPermission,
    setRefreshButton,
    rows,
    t,
    permissionData,
  };
};

export default useManagementUsersList;
