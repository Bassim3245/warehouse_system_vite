// React and Router imports
import  { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import { getToken } from "../../../../../utils/handelCookie";
import Document from "../Document/Doucument";
import layoutStyle from "../../../../../style/layoutStyle";
import usePermissionUser from "../../../../../hooks/usePermissionUser";
export default function DocumentSales() {
  // Hooks
  const { dataUserById, dataUserLab, wareHouseData } = usePermissionUser();
  const theme = useTheme();
  const token = getToken();
  const location = useLocation();
  const [refreshButton, setRefreshButton] = useState(false);
  return (
    <div style={{ ...layoutStyle }}>
      <Document
        title={"مستندات الصرف"}
        dataUserById={dataUserById}
        refreshButton={refreshButton}
        setRefreshButton={setRefreshButton}
        documentType={"out"}
        theme={theme}
        token={token}
        navigateUrl={"sales-material"}
        navigateLabel="مستند الصرف"
        location={location}
        filedLabel="الحهة المستفيدة"
        dataUserLab={dataUserLab}
        wareHouseData={wareHouseData}
        isExport={true}
      />
    </div>
  );
}
