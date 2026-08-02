import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Archive } from "lucide-react";
import { Warehouse } from "lucide-react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const Step3Content = ({ getPeriodText, completedDocs, selectedWarehouse }) => (
    <Box sx={{ p: 1.5 }} dir="rtl">

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <Archive size={16} color="var(--mui-palette-success-main, #2e7d32)" />
            <Typography variant="subtitle1" fontWeight={500}>
                تأكيد الأرشفة النهائية
            </Typography>
        </Stack>

        {/* Info note */}
        <Box sx={{
            display: 'flex', alignItems: 'flex-start', gap: 1,
            bgcolor: 'info.50', borderRadius: 1,
            px: 1.5, py: 1, mb: 1.5
        }}>
            <InfoOutlinedIcon sx={{ fontSize: 15, color: 'info.main', mt: '2px', flexShrink: 0 }} />
            <Typography variant="caption" color="info.main">
                سيتم ترحيل الأرصدة للشهر القادم تلقائياً بعد الأرشفة.
            </Typography>
        </Box>

        {/* Summary rows */}

            <Stack direction="row" justifyContent="space-between" alignItems="center"
                sx={{ px: 1.5, py: 1, borderBottom: '0.5px solid', borderColor: 'divider' }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Warehouse size={14} color="var(--mui-palette-text-secondary, #666)" />
                    <Typography variant="caption" color="text.secondary">المخزن</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={500}>
                    {selectedWarehouse?.name || "غير محدد"}
                </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center"
                sx={{ px: 1.5, py: 1, borderBottom: '0.5px solid', borderColor: 'divider' }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">الفترة</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={500}>
                    {getPeriodText()}
                </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center"
                sx={{ px: 1.5, py: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 14, color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary">سيتم أرشفته</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={500} color="success.main">
                    {completedDocs.length} مستند مكتمل
                </Typography>
            </Stack>

    </Box>
);

export default Step3Content;