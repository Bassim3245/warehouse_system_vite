import ArrowCircleLeftOutlined from "@mui/icons-material/ArrowCircleLeftOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import DateRangeOutlined from "@mui/icons-material/DateRangeOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";

import Loader from "../../../../components/reusableComponent/Loader";
import { BackendUrl } from "../../../../redux/api/axios";
import { Link } from "react-router-dom";
import { getFileIcon } from "../../../../utils/Function";
import { getToken } from "../../../../utils/handelCookie";
import HeaderCenter from "../../../../components/reusableComponent/HeaderCenterComponent";
import PrintPdInformation from "./PrintPdfInformation";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { renderListItemArchive } from "../../../../utils/opsoloteUtils";
import { formatDateYearsMonth } from "../../../../utils/formatData";

const InformationMaterialArchive = () => {
  const { id: archiveId } = useParams();
  const token = getToken();
  const [dataMaterial, setDataMaterial] = useState({});
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fetchMainClassData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `${BackendUrl}/api/getDataArchiveById/${archiveId}`,
        {
          headers: { authorization: token },
        }
      );
      setDataMaterial(data?.response);
    } catch (error) {
      console.error(
        "Error fetching main class data:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMainClassData();
  }, []);
  return (
    <Box sx={{ py: 4 }}>
      {loading && <Loader />}
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              background:
                theme.palette.mode === "dark"
                  ? theme?.palette?.primary?.lightblack
                  : theme?.palette?.primary?.paperColor,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 4px 20px rgba(0, 0, 0, 0.5)"
                  : "0 4px 20px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              mb: 4,
            }}
          >
            {/* Header with back button and gradient background */}
            <Box
              sx={{
                p: 2,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, rgba(66, 66, 66, 0.9), rgba(33, 33, 33, 0.9))"
                    : `linear-gradient(45deg, ${theme.palette?.primary.main}, ${theme.palette?.primary.main}cc)`,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={() => window.history.back(-1)}
                sx={{
                  color: "white",
                  borderRadius: 8,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={<ArrowCircleLeftOutlined />}
              >
                الرجوع الى الخلف
              </Button>
              <Box>
                <PrintPdInformation dataMaterial={dataMaterial} />
              </Box>
            </Box>

            {/* Material header with icon */}
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "primary.dark"
                        : theme.palette?.primary?.main,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  <CategoryOutlined fontSize="large" />
                </Avatar>
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {dataMaterial?.name_material || "معلومات المادة"}
              </Typography>

              {dataMaterial?.code_material && (
                <Chip
                  label={`رمز المادة: ${dataMaterial?.code_material}`}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {dataMaterial?.file_check && (
                  <Box sx={{ textAlign: "center", mx: 1 }}>
                    {getFileIcon(dataMaterial?.file_check, "_", "edit")}
                  </Box>
                )}
                {dataMaterial?.file_check_buy && (
                  <Box sx={{ textAlign: "center", mx: 1 }}>
                    {getFileIcon(dataMaterial?.file_check_buy, "_", "edit")}
                  </Box>
                )}
              </Box>

              {/* Material images section */}
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                >
                  كتاب المناقلة الرسمي
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {dataMaterial?.images?.map((item, index) => (
                    <Fade in={true} timeout={300 + index * 100} key={index}>
                      <Box
                        sx={{
                          p: 1,
                          border: "1px solid",
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.1)",
                          borderRadius: 1,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.03)",
                            boxShadow:
                              theme.palette.mode === "dark"
                                ? "0 4px 8px rgba(0, 0, 0, 0.3)"
                                : "0 4px 8px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        {getFileIcon(item?.file_name, "_", "edit")}
                      </Box>
                    </Fade>
                  ))}
                </Box>
              </Box>

              <HeaderCenter
                title={dataMaterial?.name_material || "معلومات المادة"}
                subTitle={dataMaterial?.code_material || ""}
              />
            </Box>

            <Divider />

            {/* Material information */}
            <Box sx={{ p: 3 }}>
              <Box dir="rtl">
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  textAlign="right"
                  sx={{
                    mb: 3,
                    color:
                      theme.palette.mode === "dark"
                        ? "primary.light"
                        : "primary.main",
                    borderRight: `4px solid ${theme.palette.primary.main}`,
                    pr: 2,
                  }}
                >
                  معلومات المادة
                </Typography>

                <Box sx={{ mb: 3 }}>
                  {renderListItemArchive(
                    "أسم المادة",
                    dataMaterial?.name_material,
                    <DescriptionOutlined fontSize="small" color="primary" />,
                    theme
                  )}
                  {renderListItemArchive(
                    "رمز المادة",
                    dataMaterial?.code_material,
                    <InfoOutlined fontSize="small" color="primary" />,
                    theme
                  )}
                  {renderListItemArchive(
                    "التصنيف الرئيسي",
                    dataMaterial?.main_Class_name,
                    <CategoryOutlined fontSize="small" color="primary" />,
                    theme
                  )}
                  {renderListItemArchive(
                    "التصنيف الفرعي",
                    dataMaterial?.sub_class_name,
                    <CategoryOutlined fontSize="small" color="primary" />,
                    theme
                  )}

                  {token && (
                    <>
                      {renderListItemArchive(
                        "حالة المادة",
                        dataMaterial?.state_name,
                        <InfoOutlined fontSize="small" color="primary" />,
                        theme
                      )}
                      {renderListItemArchive(
                        "نوع المادة",
                        dataMaterial?.typ_material,
                        <InfoOutlined fontSize="small" color="primary" />,
                        theme
                      )}
                      {renderListItemArchive(
                        "تاريخ الشراء",
                        formatDateYearsMonth(dataMaterial?.puchase_date),
                        <DateRangeOutlined fontSize="small" color="primary" />,
                        theme
                      )}
                      <Divider sx={{ my: 2 }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        textAlign="right"
                        sx={{
                          mb: 2,
                          color:
                            theme.palette.mode === "dark"
                              ? "primary.light"
                              : "primary.main",
                          borderRight: `4px solid ${theme.palette.primary.main}`,
                          pr: 2,
                        }}
                      >
                        معلومات التسليم والاستلام
                      </Typography>

                      {renderListItemArchive(
                        "اسم الوزارة المسلمة",
                        dataMaterial?.ministry_name_from,
                        <LocalShippingOutlined
                          fontSize="small"
                          color="primary"
                        />,
                        theme
                      )}
                      {renderListItemArchive(
                        "أسم الجهة المسلمة",
                        dataMaterial?.entity_name_from,
                        <LocalShippingOutlined
                          fontSize="small"
                          color="primary"
                        />,
                        theme
                      )}
                      {renderListItemArchive(
                        "أسم الوزارة المستلمة",
                        dataMaterial?.ministry_name_buy,
                        <LocalShippingOutlined
                          fontSize="small"
                          color="primary"
                        />,
                        theme
                      )}
                      {renderListItemArchive(
                        "أسم الجهة المستلمة",
                        dataMaterial?.entity_name_buy,
                        <LocalShippingOutlined
                          fontSize="small"
                          color="primary"
                        />,
                        theme
                      )}
                      {renderListItemArchive(
                        "الكمية المسلمة",
                        dataMaterial?.Quantity_buy,
                        <InfoOutlined fontSize="small" color="primary" />,
                        theme
                      )}
                      {renderListItemArchive(
                        "رقم الهاتف",
                        dataMaterial?.phone_number,
                        <PhoneOutlined fontSize="small" color="primary" />,
                        theme
                      )}
                      {renderListItemArchive(
                        "العنوان",
                        dataMaterial?.governorate_name,
                        <LocationOnOutlined fontSize="small" color="primary" />,
                        theme
                      )}
                    </>
                  )}
                </Box>
                {token && dataMaterial?.description && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      borderRadius: 2,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        mb: 2,
                        color:
                          theme.palette.mode === "dark"
                            ? "primary.light"
                            : "primary.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <DescriptionOutlined /> وصف المادة
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.paperColor
                            : "#000000",
                        lineHeight: 1.8,
                      }}
                    >
                      {dataMaterial?.description || "لا يوجد وصف متاح"}
                    </Typography>
                  </Box>
                )}

                {!token && (
                  <Fade in={true} timeout={1000}>
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 4,
                        p: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        textAlign="center"
                      >
                        معلومات إضافية
                      </Typography>
                      <Typography
                        variant="body1"
                        textAlign="center"
                        sx={{ mb: 2 }}
                      >
                        إذا كنت تريد استكشاف المزيد من المعلومات أو حجز المادة
                        يجب تسجيل الدخول أولاً
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          component={Link}
                          to="/login"
                          variant="contained"
                          color="primary"
                          sx={{
                            borderRadius: 8,
                            px: 4,
                            py: 1,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          تسجيل الدخول
                        </Button>
                      </Box>
                    </Paper>
                  </Fade>
                )}
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};
export default InformationMaterialArchive;
