
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { BackendUrl } from "../../../redux/api/axios";
import { useState, useMemo, useCallback, memo } from "react";
import { hasPermission } from "../../../utils/Function";
import layoutStyle from "../../../style/layoutStyle";
import usePermissionUser from "../../../hooks/usePermissionUser";
import {
  a11yProps,
  CustomTabPanel,
  ModernComponentWrapper,
} from "../../../components/MnagerMainInformation/MainSetting";

import Minstries from "./IsertData/InsertMinstries";
import MainClass from "./IsertData/MainClass";
import StatMaterial from "./IsertData/InsertStatMaterial";
import Banner from "./IsertData/Banner";
import Governorate from "./IsertData/Governorate";
import AboutSystem from "./IsertData/AboutSystem";
import UnitMeasuring from "../manageMainInformation/IsertData/UnitMeasuring";
import SubClass from "./SubClassAndUnit/SubClass";
import JobTitle from "./IsertData/JopTitile";
import RemoveDate from "./IsertData/RemoveDate";
import UserGuid from "./IsertData/userGuid";
import PermissionData from "./RoleAndPermission/permissionData";
import RoleSystem from "./RoleAndPermission/Role";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Fade from "@mui/material/Fade";

function MainInformation() {
  const { rtl } = useSelector((state) => state?.language);
  const { permissionData, roles, applicationPermission } = usePermissionUser();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation();
  // Memoized tab change handler
  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  // Memoized management permission check
  const hasManagementPermission = useMemo(
    () => hasPermission(roles?.management_permission?._id, permissionData),
    [roles?.management_permission?._id, permissionData]
  );

  // Memoized section groups configuration
  const sectionGroups = useMemo(() => {
    const groups = [
      {
        title: "التصنيفات",
        component: (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModernComponentWrapper title="الفئة الرئيسية" theme={theme}>
                <MainClass theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModernComponentWrapper title="الفئة الفرعية" theme={theme}>
                <SubClass theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
          </Grid>
        ),
        permissionKey: null,
      },
      {
        title: "المؤسسات والجهات",
        component: (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <ModernComponentWrapper title={t("Institutions")} theme={theme}>
                <Minstries theme={theme} t={t} />
              </ModernComponentWrapper>
            </Grid>

          </Grid>
        ),
        permissionKey: null,
      },
      {
        title: "المحافظات والمناطق",
        component: (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <ModernComponentWrapper
                title={t("mainIformation.Governors")}
                theme={theme}
              >
                <Governorate theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
          </Grid>
        ),
        permissionKey: null,
      },
      {
        title: "المواد والقياسات",
        component: (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModernComponentWrapper title="معلومات المادة" theme={theme}>
                <StatMaterial theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModernComponentWrapper
                title={t("Stagnant.measuringUnit")}
                theme={theme}
              >
                <UnitMeasuring />
              </ModernComponentWrapper>
            </Grid>
          </Grid>
        ),
        permissionKey: null,
      },
      {
        title: "معلومات النظام",
        component: (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ModernComponentWrapper
                title={t("mainIformation.SystemInformation")}
                theme={theme}
              >
                <AboutSystem theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ModernComponentWrapper title="الإعلانات" theme={theme}>
                <Banner theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ModernComponentWrapper title="دليل الاستخدام" theme={theme}>
                <UserGuid theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
          </Grid>
        ),
        permissionKey: null,
      },
      {
        title: "إدارة النظام",
        component: (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModernComponentWrapper title="العناوين الوظيفية" theme={theme}>
                <JobTitle theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModernComponentWrapper title="تاريخ حذف الحجز" theme={theme}>
                <RemoveDate theme={theme} t={t} BackendUrl={BackendUrl} />
              </ModernComponentWrapper>
            </Grid>
          </Grid>
        ),
        permissionKey: null,
      },
    ];

    // Add permission-based sections conditionally
    if (hasManagementPermission) {
      groups.push({
        title: "الصلاحيات والأدوار",
        component: (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModernComponentWrapper title="النظام الوظيفي" theme={theme}>
                <RoleSystem
                  theme={theme}
                  t={t}
                  BackendUrl={BackendUrl}
                  roles={roles}
                  applicationPermission={applicationPermission}
                />
              </ModernComponentWrapper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModernComponentWrapper title="إعدادات الصلاحيات" theme={theme}>
                <PermissionData
                  theme={theme}
                  t={t}
                  BackendUrl={BackendUrl}
                  roles={roles}
                  applicationPermission={applicationPermission}
                />
              </ModernComponentWrapper>
            </Grid>
          </Grid>
        ),
        permissionKey: roles?.management_permission?._id,
      });
    }

    return groups;
  }, [theme, t, roles, applicationPermission, hasManagementPermission]);

  // Memoized filtered tabs
  const filteredTabs = useMemo(
    () =>
      sectionGroups.filter((tab) =>
        tab.permissionKey
          ? hasPermission(tab.permissionKey, permissionData)
          : true
      ),
    [sectionGroups, permissionData]
  );

  // Memoized tabs styles
  const tabsStyles = useMemo(
    () => ({
      "& .MuiTabs-indicator": {
        backgroundColor: theme.palette.primary.main,
        height: 3,
        borderRadius: "3px 3px 0 0",
      },
      "& .MuiTab-root": {
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "0.95rem",
        minWidth: "auto",
        padding: "16px 20px",
        transition: "all 0.3s",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          color: theme.palette.primary.main,
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
      "& .Mui-selected": {
        color: `${theme.palette.primary.main} !important`,
        "&::after": {
          width: "80%",
          backgroundColor: theme.palette.primary.main,
        },
      },
    }),
    [theme.palette.primary.main]
  );

  return (
    <div style={layoutStyle}>
      <Paper dir={rtl?.dir}>
        <Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="main information tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={tabsStyles}
          >
            {filteredTabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.title}
                {...a11yProps(index)}
                sx={{
                  fontWeight: tabValue === index ? "bold" : "normal",
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box>
          {filteredTabs.map((tab, index) => (
            <CustomTabPanel value={tabValue} index={index} key={index}>
              <Fade in={tabValue === index} timeout={500}>
                <div>{tab.component}</div>
              </Fade>
            </CustomTabPanel>
          ))}
        </Box>
      </Paper>
    </div>
  );
}

export default memo(MainInformation);
