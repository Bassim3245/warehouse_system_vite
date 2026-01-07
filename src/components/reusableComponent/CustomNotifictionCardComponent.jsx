import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import { formatDateYearsMonth } from "../../utils/formatData";
import { Done, Notifications } from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";
import { getToken } from "../../utils/handelCookie";
import { BackendUrl } from "../../redux/api/axios";

const NotificationCard = (props) => {
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const navigate = useNavigate();
  
  const handlePath = async () => {
    try {
      const response = await axios.post(
        `${BackendUrl}/api/EditNotificationById`,
        {dataId:props?.notificationId},
        { headers: { authorization: getToken() } }
      );
      if (response) {
        navigate(`${props?.path}`);
      }
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  };
  
  // Format timestamp to be more readable
  const formattedTime = props?.created_at ? formatDateYearsMonth(props?.created_at) : "";
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        width: props?.width ? props.width : "100%",
        borderRadius: 1,
        padding: 1.5,
        transition: "all 0.2s ease",
        '&:hover': {
          backgroundColor: props?.isRead ? '#f5f5f5' : '#f0f7ff',
        },
        backgroundColor: props?.isRead ? '#f8f8f8' : '#fff',
        boxShadow: props?.isRead ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
      onClick={handlePath}
    >
      <Avatar
        sx={{
          bgcolor: props?.isRead ? '#e0e0e0' : maintheme?.secondaryColor || '#1976d2',
          width: 40,
          height: 40,
          mr: 2
        }}
      >
        <Notifications fontSize="small" />
      </Avatar>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography
            sx={{
              fontWeight: props?.isRead ? 400 : 600,
              fontSize: "0.95rem",
              color: props?.isRead ? 'text.secondary' : 'text.primary',
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {props?.title || ""}
          </Typography>
          
          <Chip
            size="small"
            label={formattedTime}
            sx={{
              height: 20,
              fontSize: '0.7rem',
              ml: 1,
              bgcolor: props?.isRead ? '#e0e0e0' : '#e3f2fd',
              color: props?.isRead ? 'text.secondary' : maintheme?.secondaryColor || '#1976d2',
            }}
          />
        </Box>
        
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: "0.85rem",
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}
        >
          {props?.body || "لا يوجد إشعارات"}
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
          <IconButton
            size="small"
            sx={{
              color: props?.isRead ? '#9e9e9e' : maintheme?.secondaryColor || '#1976d2',
              p: 0.5,
            }}
          >
            {props?.isRead ? 
              <Done fontSize="small" /> : 
              <ReplyIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationCard;
