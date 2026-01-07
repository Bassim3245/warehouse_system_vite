import  { useState } from 'react';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

import { useTheme , alpha} from "@mui/material/styles";
import { motion } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';

const MainHeaderForPages = ({
  title,
  description,
  rtl,
  onRefresh,
  menuItems = [],
  lastUpdated,
  isFullscreen,
  onFullscreenToggle,
  accentColor,
  elevation = 0,
  sx = {},
  showLastUpdated = true,
  showDivider = true,
  showDescription = true,
}) => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Use provided accent color or default to theme primary
  const headerAccentColor = accentColor || (theme.palette.mode === "light" ? theme.palette.primary.dark : theme.palette.primary.light);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = async () => {
    if (onRefresh && typeof onRefresh === 'function') {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  // Format current date if lastUpdated is not provided
  const formattedDate = lastUpdated || new Date().toLocaleDateString('ar-EG', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={elevation}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
          position: "relative",
          mb: 3,
          borderLeft: `4px solid ${headerAccentColor}`,
          background: theme.palette.mode === "light" 
            ? "white"
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          ...sx
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              color: headerAccentColor,
              position: "relative",
              display: "inline-block",
              "&:after": {
                content: '""',
                position: "absolute",
                width: "30%",
                height: "3px",
                bottom: "-8px",
                left: rtl?.dir === "rtl" ? "auto" : 0,
                right: rtl?.dir === "rtl" ? 0 : "auto",
                background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${alpha(theme.palette.secondary.main, 0.2)})`,
                borderRadius: "10px"
              }
            }}
          >
            {title || "لوحة التحكم"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {onRefresh && (
              <Tooltip title="تحديث البيانات">
                <IconButton 
                  size="small" 
                  onClick={handleRefresh}
                  sx={{ 
                    backgroundColor: theme.palette.mode === "light" ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.2),
                    color: theme.palette.primary.main,
                    "&:hover": { backgroundColor: theme.palette.primary.main, color: "white" },
                    transition: "all 0.2s ease"
                  }}
                >
                  {refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}
            {onFullscreenToggle && (
              <Tooltip title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}>
                <IconButton 
                  size="small" 
                  onClick={onFullscreenToggle}
                  sx={{ 
                    backgroundColor: theme.palette.mode === "light" ? alpha(theme.palette.secondary.main, 0.1) : alpha(theme.palette.secondary.main, 0.2),
                    color: theme.palette.secondary.main,
                    "&:hover": { backgroundColor: theme.palette.secondary.main, color: "white" },
                    transition: "all 0.2s ease"
                  }}
                >
                  {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}
            {menuItems && menuItems.length > 0 && (
              <>
                <Tooltip title="الإعدادات">
                  <IconButton 
                    size="small"
                    onClick={handleMenuClick}
                    sx={{ 
                      backgroundColor: theme.palette.mode === "light" ? alpha(theme.palette.info.main, 0.1) : alpha(theme.palette.info.main, 0.2),
                      color: theme.palette.info.main,
                      "&:hover": { backgroundColor: theme.palette.info.main, color: "white" },
                      transition: "all 0.2s ease"
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  {menuItems.map((item, index) => (
                    <MenuItem key={index} onClick={() => {
                      handleMenuClose();
                      if (item.onClick && typeof item.onClick === 'function') {
                        item.onClick();
                      }
                    }}>
                      {item.icon && (
                        <Box component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </Box>
                      )}
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Box>
        {showDescription && description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        {showDivider && (
          <Divider sx={{ mb: 2, background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.05)})` }} />
        )}
        {showLastUpdated && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <SettingsIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
            آخر تحديث: {formattedDate}
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
};

export default MainHeaderForPages;
