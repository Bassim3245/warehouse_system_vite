import Loader from "../../components/reusableComponent/Loader";
import { memo, Suspense } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export const CustomTabPanel = memo(({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`main-info-tabpanel-${index}`}
      aria-labelledby={`main-info-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
});
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export function a11yProps(index) {
  return {
    id: `main-info-tab-${index}`,
    "aria-controls": `main-info-tabpanel-${index}`,
  };
}

// Memoized Modern component wrapper
export const ModernComponentWrapper = memo(({ title, children, theme }) => {
  return (
    <Card elevation={2}>
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </CardContent>
    </Card>
  );
});
ModernComponentWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  theme: PropTypes.object.isRequired,
};
CustomTabPanel.displayName = "CustomTabPanel";

ModernComponentWrapper.displayName = "ModernComponentWrapper";
