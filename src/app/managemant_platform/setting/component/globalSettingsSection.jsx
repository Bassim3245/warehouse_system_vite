import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { ToggleSettingsGroup } from "../toggleComponent";
import { ButtonTheme } from "../../../../style/ButtomStyle";

/**
 * مكون قسم الإعدادات العامة
 */
const GlobalSettingsSection = ({
  settings,
  settingsConfig,
  onSettingChange,
  onSubmit,
}) => {
  return (
    <Card sx={{ mb: 4, borderRadius: 2 }}>
      <CardContent>
        <ButtonTheme onClick={onSubmit}>حفظ الاعدادات</ButtonTheme>
        <Divider sx={{ mb: 3 }} />
        <ToggleSettingsGroup
          settings={settingsConfig}
          values={settings}
          onSettingChange={onSettingChange}
        />
      </CardContent>
    </Card>
  );
};

export default GlobalSettingsSection;