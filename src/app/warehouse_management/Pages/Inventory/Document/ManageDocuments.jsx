import { useMemo, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Document from "./Doucument";
import usePermissionUser from "../../../../../hooks/usePermissionUser";
import { getToken } from "../../../../../utils/handelCookie";
import { useTranslation } from "react-i18next";
import layoutStyle from "../../../../../style/layoutStyle";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { typeDocument } from "../../../../../constants/arrayFuction";
import {
  ArrowDown,
  ArrowUp,
  Undo2,
  FileText,
} from "lucide-react";

// ─── Type-specific configuration ─────────────────────────────────────────────
const docTypeConfig = {
  in: {
    icon: <ArrowDown size={18} />,
    isExport: false,
    navigateUrl: "purchases-material",
    filedLabel: "المجهز",
    title: "مستندات الوارد",
  },
  internal_consumption: {
    icon: <FileText size={18} />,
    isExport: true,
    navigateUrl: "sales-material",
    filedLabel: "الجهة المستفيدة",
    title: "مستندات الصرف الداخلي",
  },
  out: {
    icon: <ArrowUp size={18} />,
    isExport: true,
    navigateUrl: "sales-material",
    filedLabel: "الجهة المستفيدة",
    title: "مستندات الصادر",
  },
  return: {
    icon: <Undo2 size={18} />,
    isExport: false,
    navigateUrl: "purchases-material",
    filedLabel: "الجهة الراجعة",
    title: "مستندات الارجاع",
  },
};

export default function ManageDocuments() {
  // Build the tab list from the shared typeDocument constant

  const theme = useTheme();
  
  const tabs = useMemo(
    () =>
      typeDocument.map((dt) => ({
        ...dt,
        ...(docTypeConfig[dt.value] ?? {
          icon: <FileText size={18} />,
          isExport: false,
          navigateUrl: "purchases-material",
          filedLabel: "الجهة",
          title: dt.label,
        }),
      })),
    []
  );

  const [tabValue, setTabValue] = useState(() => {
    const saved = localStorage.getItem("selectedInventoryDocumentType");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const index = tabs.findIndex((t) => t.value === parsed.value);
        return index !== -1 ? index : 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });

  const { dataUserById, dataUserLab } = usePermissionUser();
  const { t } = useTranslation();
  const token = getToken();
  const [refreshButton, setRefreshButton] = useState(false);

  const activeTab = tabs[tabValue];
  return (
    <Box sx={{ ...layoutStyle }}>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.02)",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, v) => {
            setTabValue(v);
            const selectedTab = tabs[v];
            localStorage.setItem(
              "selectedInventoryDocumentType",
              JSON.stringify({ value: selectedTab.value, label: selectedTab.label })
            );
          }}
          aria-label="document types tabs"
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            "& .MuiTab-root": {
              py: 1.5,
              fontSize: "0.875rem",
              fontWeight: 600,
              gap: 0.75,
              flexDirection: "row",
              minHeight: 48,
            },
          }}
        >
          {tabs?.map((tab) => (
            <Tab key={tab.value} icon={tab.icon} label={t(tab.label)} />
          ))}
        </Tabs>
      </Paper>

      {activeTab && (
        <Document
          key={activeTab.value}
          title={t(activeTab.title)}
          documentType={activeTab.value}
          documentTypeLabel={activeTab.label}
          navigateUrl={activeTab.navigateUrl}
          isExport={activeTab.isExport}
          filedLabel={t(activeTab.filedLabel)}
          dataUserById={dataUserById}
          dataUserLab={dataUserLab}
          token={token}
          refreshButton={refreshButton}
          setRefreshButton={setRefreshButton}
        />
      )}
    </Box>
  );
}
