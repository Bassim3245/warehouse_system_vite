import { Archive, Calendar, CheckCircle } from "lucide-react";
import { Box, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Divider } from "@mui/material";
import { Paper } from "@mui/material";
import { Warehouse } from "lucide-react";

const Step3Content = ({ getPeriodText, completedDocs, selectedWarehouse }) => (
    <Box sx={{ p: 2 }} dir="rtl">
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Archive color="success" />
            <Typography variant="h6" color="text.primary">
                تأكيد الأرشفة النهائية
            </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            تمت مراجعة جميع السجلات للفترة المحددة. سيتم الآن إجراء الأرشفة النهائية للمستندات المكتملة. 
            يرجى التأكد من صحة البيانات قبل الضغط على "أرشفة نهائية".
        </Typography>

        {/* Selected Details Summary */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
             <Grid size={{ xs: 12 }}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50', borderColor: 'primary.200' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Warehouse size={18} style={{ color: '#1976d2' }} />
                        <Typography variant="body2" fontWeight={600}>
                            المخزن المختار: {selectedWarehouse?.name || "الكل"}
                        </Typography>
                    </Stack>
                </Paper>
             </Grid>
        </Grid>

        {/* Summary */}
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                bgcolor: 'grey.50',
                border: '2px solid',
                borderColor: 'primary.200'
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📊 ملخص الأرشفة
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                        <Calendar color="#1976d2" size={32} style={{ marginBottom: '8px' }} />
                        <Typography variant="body2" color="text.secondary">الفترة</Typography>
                        <Typography variant="subtitle1" fontWeight={600}>{getPeriodText()}</Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                        <CheckCircle color="#2e7d32" size={32} style={{ marginBottom: '8px' }} />
                        <Typography variant="body2" color="text.secondary">سيتم أرشفته</Typography>
                        <Typography variant="h5" fontWeight={600} color="success.main">
                            {completedDocs.length}
                        </Typography>
                        <Typography variant="caption">مستند مكتمل</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    </Box>
);



    export default Step3Content;