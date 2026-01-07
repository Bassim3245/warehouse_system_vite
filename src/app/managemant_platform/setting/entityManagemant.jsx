import  { useState, useEffect, useCallback, useMemo } from "react";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";

// MUI Icons (Tree-shaken per icon)
import ViewIcon from "@mui/icons-material/Visibility";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// Components
import Header from "../../../components/reusableComponent/HeaderComponent";
import EntityModel from "./Model/entityModel";

// Redux actions  
import { getDataMinistries } from "../../../redux/MinistriesState/MinistresAction";
import { getDataEntities } from "../../../redux/EntitiesState/EntitiesAction";

// Utils
import { getToken } from "../../../utils/handelCookie";
import layoutStyle from "../../../style/layoutStyle";

const EntityManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const token = getToken();

  // Redux Selectors
  const { Ministries } = useSelector((state) => state.Ministries);
  const { Entities } = useSelector((state) => state.Entities);
  const { rtl } = useSelector((state) => state?.language);

  const [refresh, setRefresh] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  /** -----------------------
   * Load Ministries + Entities
   ------------------------ */
  useEffect(() => {
    dispatch(getDataMinistries());
    dispatch(getDataEntities(token));
  }, [dispatch, token]);

  /** -----------------------
   * Memoized helper
   ------------------------ */
  const getCompanyTypeLabel = useCallback((type) => {
    const mapping = {
      production: "شركة انتاجية",
      commercial: "شركة تجارية",
      service: "شركة خدمية",
      multi_branch: "شركة + مصنع + معمل + مخزن",
    };
    return mapping[type] || type;
  }, []);

  /** -----------------------
   * Toggle expanded card
   ------------------------ */
  const handleExpandClick = useCallback((companyId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  }, []);

  /** -----------------------
   * View Company
   ------------------------ */
  const handleViewCompany = useCallback(
    (companyId) => navigate(`entity-details/${companyId}`),
    [navigate]
  );

  /** -----------------------
   * Delete Company
   ------------------------ */
  const handleDeleteCompany = useCallback(async (companyId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الشركة؟")) return;

    try {
      // TODO: Perform Delete API Request
      toast.success("تم حذف الشركة بنجاح");
      setRefresh((p) => !p);
    } catch (e) {
      toast.error("فشل حذف الشركة");
    }
  }, []);

  /** -----------------------
   * Memoize card list (VERY IMPORTANT)
   ------------------------ */
  const renderedCards = useMemo(
    () =>
      Entities?.map((company) => {
        const isExpanded = expandedCards[company.entities_id];

        return (
          <Grid size={{xs:12, md:6, lg:4}} key={company.entities_id}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                {/* Header */}
                <Box display="flex" alignItems="center" mb={2}>
                  <BusinessIcon
                    sx={{ color: "primary.main", mr: 1, fontSize: 28 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {company.Entities_name}
                  </Typography>
                </Box>

                {/* Information */}
                <Box mb={2}>
                  {company.name_en && (
                    <Typography variant="body2" color="text.secondary">
                      {company.name_en}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary">
                    <strong>الكود:</strong> {company.code}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>النوع:</strong> {getCompanyTypeLabel(company.type)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>الوزارة:</strong> {company.ministries}
                  </Typography>
                </Box>

                {/* Contact */}
                <Box mb={2}>
                  {company.phone && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", gap: 0.5 }}
                    >
                      <strong>📱 الهاتف:</strong>
                      <a href={`tel:${company.phone}`}>{company.phone}</a>
                    </Typography>
                  )}

                  {company.email && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", gap: 0.5 }}
                    >
                      <strong>✉️ البريد:</strong>
                      <a
                        href={`mailto:${company.email}`}
                        style={{ color: "#1976d2" }}
                      >
                        {company.email}
                      </a>
                    </Typography>
                  )}
                </Box>

                {/* Expandable Section */}
                {(company.address || company.description) && (
                  <>
                    <Box
                      onClick={() => handleExpandClick(company.entities_id)}
                      sx={{
                        py: 0.5,
                        cursor: "pointer",
                        textAlign: "center",
                        ":hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="primary">
                        {isExpanded ? "إخفاء التفاصيل" : "عرض المزيد"}
                      </Typography>
                      <ExpandMoreIcon
                        sx={{
                          ml: 0.5,
                          transition: "0.3s",
                          transform: isExpanded ? "rotate(180deg)" : "",
                        }}
                        fontSize="small"
                      />
                    </Box>

                    <Collapse in={isExpanded} unmountOnExit>
                      <Box
                        sx={{
                          p: 2,
                          mt: 1,
                          backgroundColor: "rgba(0,0,0,0.02)",
                          borderRadius: 1,
                        }}
                      >
                        {company.address && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>📍 العنوان:</strong> {company.address}
                          </Typography>
                        )}

                        {company.website && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>🌐 الموقع:</strong>{" "}
                            <a href={company.website} target="_blank">
                              {company.website}
                            </a>
                          </Typography>
                        )}

                        {company.description && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>📝 الوصف:</strong> {company.description}
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Footer */}
                <Box display="flex" justifyContent="space-between">
                  <Chip
                    label={company.is_active ? "نشط" : "غير نشط"}
                    color={company.is_active ? "success" : "default"}
                    size="small"
                  />
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleViewCompany(company.entities_id)}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>

                    <EntityModel
                      Ministries={Ministries}
                      Entities={Entities}
                      t={t}
                      refresh={refresh}
                      setRefresh={setRefresh}
                      rtl={rtl}
                      isEdit={true}
                      company={company}
                    />

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        handleDeleteCompany(company.entities_id)
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      }),
    [Entities, expandedCards, handleExpandClick, handleViewCompany, handleDeleteCompany, getCompanyTypeLabel]
  );

  return (
    <Box sx={{ ...layoutStyle }} dir={rtl?.dir}>
      <Header title={t("أدارة الشركات او الجهات")} dir={rtl?.dir} />

      <Box sx={{ mb: 2 }}>
        <EntityModel
          Ministries={Ministries}
          Entities={Entities}
          t={t}
          refresh={refresh}
          setRefresh={setRefresh}
          rtl={rtl}
          isEdit={false}
        />
      </Box>

      <Grid container spacing={3}>{renderedCards}</Grid>
    </Box>
  );
};

export default EntityManagement;
