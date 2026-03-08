import { Archive, Calendar, CheckCircle } from "lucide-react";
import { Box, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Divider } from "@mui/material";
import { Paper } from "@mui/material";
import { Warehouse } from "lucide-react";

const Step3Content = ({ selectedWarehouse, handleWarehouseChange, memoWarehouseOptions, getPeriodText, completedDocs }) => (
    <Box sx={{ p: 2 }} dir="rtl">
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Archive color="success" />
            <Typography variant="h6" color="text.primary">
                تأكيد الأرشفة النهائية
            </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                يرجى تحديد المخزن إذا كنت ترغب في حصر الأرشفة بمخزن معين، أو اتركه فارغاً لتشمل الأرشفة جميع المخازن التابعة لك.
            </Typography>

            {/* Warehouse Selection */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Autocomplete
                        fullWidth
                        options={memoWarehouseOptions}
                        getOptionLabel={(option) => option?.name || ""}
                        value={selectedWarehouse}
                        onChange={handleWarehouseChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="اختر المخزن (اختياري)"
                                placeholder="اختر مخزن للتصفية أو اتركه فارغ لأرشفة الكل..."
                                size="small"
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box
                                key={option.id}
                                component="li"
                                {...props}
                                sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
                            >
                                <Warehouse sx={{ color: "primary.main", fontSize: 18 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                        {option.name}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        noOptionsText="لا توجد مخازن"
                    />
                </Grid>
            </Grid>

            {/* Summary */}
            <Divider sx={{ my: 3 }} />

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
                            <Calendar color="primary" sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">الفترة</Typography>
                            <Typography variant="subtitle1" fontWeight={600}>{getPeriodText()}</Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                            <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
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