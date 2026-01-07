import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "../../../../components/reusableComponent/Loader";
import { BackendUrl } from "../../../../redux/api/axios";
import { Link } from "react-router-dom";
import {
  getFileIcon,
  isImageFile,
} from "../../../../utils/Function";
import { BottomRoot } from "../../../../style/ButtomStyle";
import { toast } from "react-toastify";
import BookingFormUser from "./BookingMaterial";
import { getToken } from "../../../../utils/handelCookie";
import { useTranslation } from "react-i18next";
import UploadBook from "./UploadBookeMaterial";
import moment from "moment";
import { formatDateYearsMonth } from "../../../../utils/formatData";
import usePermissionUser from "../../../../hooks/usePermissionUser";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import debounce from "lodash/debounce";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";import ArrowCircleLeftOutlined from "@mui/icons-material/ArrowCircleLeftOutlined";
const ProductOverview = () => {
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const { dataUserById } =
    usePermissionUser();
  const { id: stagnant_id } = useParams();
  const token = getToken();
  const [dataProduct, setDataProduct] = useState({});
  const [bookingDataM, setBookingDataM] = useState({});
  const [messageDenied, setMessageDenied] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [removeDate, setDateRemove] = useState({});
  const [dayRemove, setDayRemove] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [daysLeft, setDaysLeft] = useState(null);
  const [notificationSent, setNotificationSent] = useState({
    twoDays: false,
    oneDay: false,
  });
  const containerRef = useRef(null);
  const { t } = useTranslation();

  // Debounced resize handler
  const handleResize = debounce(() => {
    if (containerRef.current) {
      console.log(
        "Container resized:",
        containerRef.current.getBoundingClientRect()
      );
    }
  }, 100);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    const currentRef = containerRef.current;
    if (currentRef) resizeObserver.observe(currentRef);
    return () => currentRef && resizeObserver.unobserve(currentRef);
  }, [handleResize]);
  const fetchMainClassData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BackendUrl}/api/getDataStagnantMaterialAllByAndStagnantId/${stagnant_id}`,
        {
          headers: { authorization: token },
        }
      );
      setDataProduct(data?.response);
    } catch (error) {
      console.error(
        "Error fetching main class data:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchBookDataMateriel = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BackendUrl}/api/getDataBookByEntityId?entities_id=${dataUserById?.entity_id}&stagnant_id=${dataProduct?.stagnant_id}`,
        { headers: { authorization: token } }
      );
      setBookingDataM(data?.response);
    } catch (error) {
      console.error(
        "Error fetching book data material:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  const cancelBookDataMateriel = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/cancelRequest/${bookingDataM?.book_id}`,
        {
          headers: { authorization: token },
        }
      );
      if (response) {
        setRefresh((prev) => !prev);
        setBookingDataM({});
        toast.info(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error canceling booking:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios?.get(`${BackendUrl}/api/getDataRemove`);
      setDateRemove(response?.data?.response[0]);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  const fetchDataDeniedMessage = async (book_id) => {
    try {
      if (!book_id) {
        console.warn("Book ID is not available");
        return;
      }
      const response = await axios?.get(
        `${BackendUrl}/api/getDataMessageById/${book_id}`
      );
      setMessageDenied(response?.data?.response[0]);
    } catch (error) {
      console.error(error?.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    if (bookingDataM?.book_id) {
      fetchDataDeniedMessage(bookingDataM?.book_id);
    }
  }, [bookingDataM?.book_id, refresh]);

  useEffect(() => {
    fetchData();
    fetchMainClassData();
  }, []);
  useEffect(() => {
    if (dataProduct?.stagnant_id) fetchBookDataMateriel();
  }, [dataProduct?.stagnant_id]);
  useEffect(() => {
    if (Object.keys(dataProduct).length) fetchBookDataMateriel();
    if (removeDate)
      setDayRemove(
        formatDateYearsMonth(removeDate?.remove_date)?.split("/")[2] || "15"
      );
  }, [dataProduct, refresh]);

  useEffect(() => {
    // Calculate days left based on expiration date
    const calculateDaysLeft = () => {
      const now = moment();
      const expiration = moment(bookingDataM?.expiration_date);
      // Only calculate days left if the item is booked
      if (bookingDataM?.booked) {
        const days = expiration.diff(now, "days");
        setDaysLeft(days);
      } else {
        setDaysLeft(null); // Reset daysLeft if not booked
      }
    };
    calculateDaysLeft();
    const intervalId = setInterval(calculateDaysLeft, 86400000); // Update every day
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [bookingDataM?.expiration_date, bookingDataM?.booked]);

  useEffect(() => {
    // Handle notifications if days left is 2 or 1 and booking is still active
    if (bookingDataM?.booked) {
      if (daysLeft === 2 && !notificationSent?.twoDays) {
        sendNotification();
        alert(`Product "${dataProduct?.name_material}" will expire in 2 days!`);
        setNotificationSent((prev) => ({ ...prev, twoDays: true })); // Mark notification as sent
      }
      if (daysLeft === 1 && !notificationSent?.oneDay) {
        sendNotification();
        alert(`Product "${dataProduct?.name_material}" will expire tomorrow!`);
        setNotificationSent((prev) => ({ ...prev, oneDay: true })); // Mark notification as sent
      }
    } else {
      // Reset notifications if booking is no longer active
      setNotificationSent({ twoDays: false, oneDay: false });
    }
  }, [daysLeft, bookingDataM?.booked, dataProduct?.name_material]);

  const sendNotification = async () => {
    try {
      await axios.post(`${BackendUrl}/api/expirationDateNotification`, {
        message: "This is a notification from the frontend!",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const renderListItem = (label, value, weight) => (
    <li
      className="list-group-item d-flex justify-content-between align-items-center px-0"
      style={{
        background:
          theme?.palette?.mode === "dark"
            ? maintheme?.lightblack
            : maintheme?.paperColor,
        color:
          theme?.palette?.mode === "dark" ? maintheme?.paperColor : "#000000",
        fontWeight: weight ? weight : "",
      }}
    >
      {label}
      <span>{value}</span>
    </li>
  );
  return (
    <Box sx={{ minHeight: '100vh', py: 4, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
      {loading && <Loader />}
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-8">
            <div
              className="card-profile mb-4"
              style={{
                background: theme?.palette?.mode === "dark" ? maintheme?.lightblack : maintheme?.paperColor,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(0,0,0,0.1)',
              }}
            >
              <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{
                  background: maintheme?.iconColor,
                  padding: '1rem 1.5rem',
                }}
              >
                <Button
                  onClick={() => window.history.back(-1)}
                  sx={{
                    color: "white",
                    '&:hover': {
                      transform: 'translateX(-4px)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  <ArrowCircleLeftOutlined className="me-2" />
                  الرجوع الى الخلف
                </Button>
              </div>
              <div className="card-body p-4">
                <div
                  className="main-image mb-4"
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    className="center"
                    src={isImageFile(dataProduct?.images)}
                    alt={dataProduct?.name_material || "Product Image"}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      }
                    }}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                  {dataProduct?.images?.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      {getFileIcon(item?.file_name, "_", "edit")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card-profile mb-4"
              style={{
                background: theme?.palette?.mode === "dark" ? maintheme?.lightblack : maintheme?.paperColor,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(0,0,0,0.1)',
              }}
            >
              <div
                className="card-header py-3"
                dir="rtl"
                style={{
                  background: maintheme?.iconColor,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h5 className="mb-0" style={{ color: "white", fontWeight: 600 }}>
                  {dataProduct?.name_material} معلومات
                </h5>
              </div>
              <div className="card-body p-0">
                <ul
                  className="list-group list-group-flush"
                  dir="rtl"
                  style={{
                    '& li': {
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.02)',
                      }
                    }
                  }}
                >
                  {renderListItem(
                    t("MaterialOverview.Material Name"),
                    dataProduct?.name_material
                  )}
                  {renderListItem(
                    t("MaterialOverview.main Class"),
                    dataProduct?.main_Class_name
                  )}
                  {renderListItem(
                    t("MaterialOverview.sub Class"),
                    dataProduct?.sub_class_name
                  )}
                  {token && (
                    <>
                      {renderListItem(
                        t("MaterialOverview.State of matter"),
                        dataProduct?.state_name
                      )}
                      {renderListItem(
                        t("MaterialOverview.typeMaterial"),
                        dataProduct?.typ_material
                      )}
                      {renderListItem(
                        t("MaterialOverview.purchase date"),

                        formatDateYearsMonth(dataProduct?.puchase_date)
                      )}
                      {renderListItem(
                        t("MaterialOverview.ministry name"),
                        dataProduct?.ministries
                      )}
                      {renderListItem(
                        t("MaterialOverview.entity name"),
                        dataProduct?.Entities_name
                      )}
                      {renderListItem(
                        t("MaterialOverview.Quantity"),
                        dataProduct?.Quantity === 0
                          ? "تم الحجز"
                          : dataProduct?.Quantity
                      )}
                      {renderListItem(
                        t("MaterialOverview.phone Number"),
                        dataProduct?.phone_number,
                        "build"
                      )}
                      {renderListItem(
                        t("MaterialOverview.Address"),
                        dataProduct?.address,
                        "bold"
                      )}
                    </>
                  )}
                </ul>
              </div>
              <Box
                className="productDescription"
                dir="rtl"
                sx={{
                  p: 3,
                  background: theme?.palette?.mode === "dark" ? maintheme?.lightblack : maintheme?.paperColor,
                  color: theme?.palette?.mode === "dark" ? maintheme?.paperColor : "#000000",
                  borderTop: '1px solid',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                }}
              >
                {token && (
                  <>
                    <h4>{t("MaterialOverview.Description")}</h4>
                    <p
                      style={{
                        color:
                          theme?.palette?.mode === "dark"
                            ? maintheme?.paperColor
                            : "#000000",
                      }}
                    >
                      {dataProduct?.description || "لايوجد"}
                    </p>
                  </>
                )}
                {!token && (
                  <>
                    <hr />
                    <Typography>
                      أذا كنت تريد أستكشاف المزيد من المعلومات أو حجز المادة
                      يجب تسجيل الدخول أولا
                      <Link to={"/login"}>تسجيل الدخول</Link>
                    </Typography>
                  </>
                )}
              </Box>
            </div>
            <div className="addtocard">
              {token ? (
                Object.keys(bookingDataM)?.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    {bookingDataM?.booked == 1 && (
                      <BottomRoot
                        className="btn btn-lg btn-block"
                        style={{
                          background: theme.palette.success.main,
                          color: 'white',
                          borderRadius: '12px',
                          padding: '1rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          }
                        }}
                      >
                        تمت الموافقة على الطلب
                      </BottomRoot>
                    )}
                    {!bookingDataM?.booked &&
                      dataUserById?.user_id === bookingDataM.user_id ? (
                      <BottomRoot
                        onClick={cancelBookDataMateriel}
                        className="btn btn-primary btn-lg btn-block"
                      >
                        الغاء الطلب
                      </BottomRoot>
                    ) : (
                      !bookingDataM?.booked && (
                        <BottomRoot className="btn btn-primary btn-lg btn-block">
                          تم الطلب
                        </BottomRoot>
                      )
                    )}
                  </div>
                ) : (
                  <BookingFormUser
                    obsoleteMaterial={dataProduct?.stagnant_id}
                    Quantity={dataProduct?.Quantity}
                    entityName={dataProduct?.Entities_name}
                    entity_id={dataProduct?.Entities_id}
                    user_id={dataProduct?.user_id}
                    setRefresh={setRefresh}
                    dataUserById={dataUserById}
                  />
                )
              ) : null}
              {Object.keys(messageDenied || {}).length === 0 &&
                bookingDataM &&
                Object.keys(bookingDataM || {}).length > 0 ? (
                <div
                  className="card-profile mt-3"
                  style={{
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {!bookingDataM?.booked ? (
                    <Typography>
                      سيتم مراجعة الطلب خلال 24 ساعة من تاريخ تقديم الطلب
                    </Typography>
                  ) : (
                    <>
                      {!bookingDataM?.contacted ? (
                        <>
                          <Typography>
                            لأكمال أجراءات المناقلة يجب الاتصال على الرقم
                            التالي: {dataProduct?.phone_number || "غير متوفر"}
                          </Typography>
                          <Typography>
                            {`في حال عدم التواصل مع الجهة أو مراجعة الدائرة سيتم إلغاء الحجز خلال ${daysLeft} يوم`}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography>
                            تم التواصل يرجى رفق الكتاب الرسمي للمناقلة{" "}
                          </Typography>
                          {bookingDataM?.approved_admin_to_upload_booked && (
                            <UploadBook
                              setRefresh={setRefresh}
                              dataUserById={dataUserById}
                              BookId={bookingDataM?.book_id}
                              bookingDataM={bookingDataM}
                              maintheme={maintheme}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              ) : null}

              {Object.keys(messageDenied || {}).length > 0 ? (
                <div
                  className="card-profile mt-3"
                  style={{
                    background: theme.palette.error.light,
                    color: theme.palette.error.contrastText,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {messageDenied?.message}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};
export default ProductOverview;
