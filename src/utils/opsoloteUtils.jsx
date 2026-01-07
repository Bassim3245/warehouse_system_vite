import Swal from "sweetalert2";
import { axiosInstance } from "../redux/api/axiosConfig";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";

export const handelDeleteAll = async (selectionModel, setRefreshButton, setSelectionModel, setLoading, token, roles, applicationPermission, BackendUrl) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    const result = await swalWithBootstrapButtons.fire({
      title: "هل انت متأكد من الحذف ؟",
      text: " ! لن تتمكن من التراجع عن الحذف",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "حذف",
      cancelButtonText: "لا",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        console.log("test", selectionModel);
        const response = await axiosInstance.post(
          `${BackendUrl}/api/deleteBySelectId`,
          {
            selectionModel,
            checkPermissionUser: roles?.view_data_obsolete?._id,
            applicationPermission: applicationPermission.materialObsolete._id,
          },
          
        );
        if (response) {
          setRefreshButton((prev) => !prev);
          setSelectionModel([]);
        }
        swalWithBootstrapButtons.fire({
          title: "! تم الحذف ",
          text: "تم حذف القيد",
          icon: "success",
        });
      } catch (error) {
        swalWithBootstrapButtons.fire({
          title: "! حدث خطأ",
          text: "حدث خطأ أثناء الحذف",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  export const handleContactedData = (id, url, setRefreshButton, setLoading, token, BackendUrl) => {
    Swal.fire({
      title: "هل تريد الاستمرار؟",
      icon: "question",
      confirmButtonText: "نعم",
      cancelButtonText: "لا",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await axiosInstance.post(
            `${BackendUrl}/api/${url}`,
            { dataId: id },
            {
              headers: {
                authorization: token,
              },
            }
          );
          if (response.data) {
            toast.success(response.data.message);
            setRefreshButton((prev) => !prev);
          }
        } catch (error) {
          console.error("Error updating booked material:", error);
          toast.error("Failed to update booked material");
        } finally {
          setLoading(false);
        }
      }
    });
  };
  export const renderListItem = (label, value, weight = "" ,theme) => (
    <li
      className="list-group-item d-flex justify-content-between align-items-center px-0"
      style={{
        background:
          theme?.palette?.mode === "dark"
            ? theme.palette?.primary?.lightblack
            : theme.palette?.primary?.paperColor,
        color:
          theme?.palette?.mode === "dark" ? theme.palette?.primary?.paperColor : "#000000",
        fontWeight: weight,
      }}
    >
      {label}
      <span>{value}</span>
    </li>
  );
 export const renderListItemArchive = (label, value, icon ,theme) => (
    <Grow in={true} timeout={600} style={{ transformOrigin: 'center right' }}>
      <Grid container spacing={2} className="material-info-item" sx={{
        py: 1.5,
        borderBottom: `1px solid ${theme.palette.mode === "dark" ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: theme.palette.mode === "dark" ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        }
      }}>
        <Grid item xs={5}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
            <Typography variant="body1" fontWeight={600} textAlign="right">
              {label}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1" color={theme?.palette?.mode === "dark" ? "primary.light" : "primary.main"}>
            {value || "غير متوفر"}
          </Typography>
        </Grid>
      </Grid>
    </Grow>
  );