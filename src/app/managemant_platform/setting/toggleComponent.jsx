

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

/**
 * مكون بطاقة التوكيل الفردية
 * @param {string} label - نص التسمية
 * @param {boolean} checked - حالة التوكيل
 * @param {function} onChange - دالة التغيير
 */
export const ToggleSettingCard = ({ label, checked, onChange }) => {
  return (
    <Grid size={{xs:12, md:6, lg:4}}>
      <Paper
        elevation={0}
        sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}
      >
        <FormControlLabel
          control={
            <Switch checked={checked} onChange={onChange} color="primary" />
          }
          label={
            <Typography variant="body1" fontWeight="medium">
              {label}
            </Typography>
          }
        />
      </Paper>
    </Grid>
  );
};

/**
 * مكون مجموعة إعدادات التوكيل
 * @param {array} settings - مصفوفة الإعدادات
 * @param {object} values - قيم الإعدادات الحالية
 * @param {function} onSettingChange - دالة التغيير
 */
export const ToggleSettingsGroup = ({ settings, values, onSettingChange }) => {
  return (
    <Grid container spacing={3}>
      {settings.map((setting) => (
        <ToggleSettingCard
          key={setting.key}
          label={setting.label}
          checked={values[setting.key] || false}
          onChange={(e) => onSettingChange(setting.key, e.target.checked)}
        />
      ))}
    </Grid>
  );
};

export default ToggleSettingCard;
