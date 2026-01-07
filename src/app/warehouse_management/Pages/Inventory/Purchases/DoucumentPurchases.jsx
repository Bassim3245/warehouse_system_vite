// React and Router imports
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { getToken } from "../../../../../utils/handelCookie";
import Document from "../Document/Doucument";
import usePermissionUser from "../../../../../hooks/usePermissionUser";
import layoutStyle from "../../../../../style/layoutStyle";
export default function DocumentPurchase() {
  // Hooks
  const { dataUserById, dataUserLab } = usePermissionUser();
  const { t } = useTranslation();
  const theme = useTheme();
  const token = getToken();
  // State management
  const [refreshButton, setRefreshButton] = useState(false);
  // حالات جديدة لإدارة المستندات
  const [documentMaterials, setDocumentMaterials] = useState([]);

  // Event handlers
  return (
    <div style={{ ...layoutStyle }}>
      <Document
        title={t(" مستندات الاستلام")}
        dataUserById={dataUserById}
        documentMaterials={documentMaterials}
        setDocumentMaterials={setDocumentMaterials}
        refreshButton={refreshButton}
        setRefreshButton={setRefreshButton}
        documentType={"in"}
        theme={theme}
        token={token}
        navigateUrl={"purchases-material"}
        navigateLabel="مستند الاستلام"
        filedLabel="المجهز"
        dataUserLab={dataUserLab}
        isExport={false}
      />
    </div>
  );
}
