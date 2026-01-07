// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";

// MUI Icons
import SecurityIcon from "@mui/icons-material/Security";
import BusinessIcon from "@mui/icons-material/Business";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";

/**
 * مكون بطاقة الصلاحيات
 */
const PermissionCard = ({
  config,
  permissions,
  onPermissionToggle,
  onAddPermission,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <SecurityIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6">{config.title}</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onAddPermission(config.type)}
            size="small"
          >
            إضافة صلاحية
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Alert severity="info" sx={{ mb: 3 }}>
          {config.infoText}
        </Alert>

        <List>
          {permissions.map((permission) => (
            <ListItem
              key={permission.companyId}
              divider
              sx={{
                bgcolor: "background.paper",
                mb: 1,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Box display="flex" alignItems="center">
                      <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        {permission.companyName}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      flexWrap="wrap"
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={permission[config.accessField]}
                            onChange={() =>
                              onPermissionToggle(
                                permission.companyId,
                                config.accessField,
                                config.type
                              )
                            }
                            color="primary"
                          />
                        }
                        label={config.accessLabel}
                      />
                      {permission[config.accessField] ? (
                        <Chip
                          icon={<VisibilityIcon />}
                          label="يمكن الوصول"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<VisibilityOffIcon />}
                          label="مقيد"
                          color="error"
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>
                }
                secondary={
                  <Box mt={1} display="flex" gap={3} flexWrap="wrap">
                    <Typography variant="body2" color="text.secondary">
                      {config.availableLabel}:
                      <Chip
                        label={permission[config.accessibleField].length}
                        size="small"
                        sx={{ ml: 1 }}
                        color="success"
                        variant="outlined"
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {config.restrictedLabel}:
                      <Chip
                        label={permission[config.restrictedField].length}
                        size="small"
                        sx={{ ml: 1 }}
                        color="error"
                        variant="outlined"
                      />
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PermissionCard;