import { Box, Stack, Typography, CircularProgress, Grid, Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from "@mui/material";
import { useMemo } from "react";
import dayjs from "dayjs";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";

const docTypeLabel = (type) => {
    switch (type) {
        case 'out': return { label: 'صادر', color: 'error' };
        case 'in': return { label: 'وارد', color: 'success' };
        case 'internal_consumption': return { label: 'استهلاك داخلي', color: 'warning' };
        case 'return': return { label: 'مرتجع', color: 'info' };
        default: return { label: 'مستند', color: 'default' };
    }
};

const Step2Content = ({ getPeriodText, fetchingDocs, incompleteDocs, completedDocs, materialSnapshots = [] }) => {
    // Normalize materialSnapshots: Handle nested warehouses structure if present
    const normalizedSnapshots = useMemo(() => {
        if (Array.isArray(materialSnapshots)) return materialSnapshots;
        if (materialSnapshots?.warehouses) {
            return materialSnapshots.warehouses.flatMap(wh => 
                (wh.materials || []).map(mat => ({
                    material_id: mat.material_id,
                    material_code: mat.material_code,
                    material_name: mat.material_name,
                    warehouse_name: wh.warehouse_name,
                    // Try to extract the batch info. In the nested structure, 
                    // closing_balance is the intended snapshotted quantity.
                    remaining_quantity: mat.closing?.closing_balance ?? mat.remaining_quantity,
                    batch_id: mat.batch_id || (Array.isArray(mat.inventory) ? mat.inventory[0]?.batch_id : mat.inventory?.batch_id),
                    import_date: mat.import_date || (Array.isArray(mat.inventory) ? mat.inventory[0]?.import_date : mat.inventory?.import_date)
                }))
            );
        }
        return [];
    }, [materialSnapshots]);

    const totalMaterials = normalizedSnapshots.length;
    const totalCompleted = completedDocs.length;
    const totalIncomplete = incompleteDocs.length;

    return (
        <Box sx={{ p: 2 }} dir="rtl">
            {/* Header & Title */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'primary.50', borderRadius: 2, border: '1px solid', borderColor: 'primary.100' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        <AssignmentIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={700} color="primary.dark">
                            مراجعة بيانات الإغلاق لـ {getPeriodText()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            يرجى مراجعة المستندات والأرصدة قبل إتمام عملية الأرشفة النهائية.
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {fetchingDocs ? (
                <Stack direction="column" alignItems="center" spacing={2} sx={{ py: 8 }}>
                    <CircularProgress size={40} thickness={4} />
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>جاري تحليل السجلات والكميات...</Typography>
                </Stack>
            ) : (
                <Stack spacing={4}>
                    {/* Summary Stats */}
                    <Grid container spacing={2}>
                        {[
                            { label: 'مستندات للأرشفة', value: totalCompleted, color: 'success.main', icon: <CheckCircleIcon /> },
                            { label: 'مستندات للترحيل', value: totalIncomplete, color: 'warning.main', icon: <WarningAmberIcon /> },
                            { label: 'أرصدة مواد للترحيل', value: totalMaterials, color: 'info.main', icon: <InventoryIcon /> }
                        ].map((stat, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="center" sx={{ mb: 1 }}>
                                        <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                                        <Typography variant="caption" fontWeight={600} color="text.secondary">{stat.label}</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={800} color={stat.color}>{stat.value}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Documents Review */}
                    <Grid container spacing={3}>
                        {/* Completed Documents */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, color: 'success.main' }}>
                                <CheckCircleIcon fontSize="small" /> المستندات المكتملة (سيتم أرشفتها)
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300, borderRadius: 2 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'success.50' }}>المستند</TableCell>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'success.50' }}>التاريخ</TableCell>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'success.50' }}>الجهة المستفيدة</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {completedDocs.length > 0 ? completedDocs.map((doc) => {
                                            const type = docTypeLabel(doc.document_type);
                                            return (
                                                <TableRow key={doc.document_id} hover>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Chip label={type.label} color={type.color} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                            <Typography variant="caption" fontWeight={600}>#{doc.document_number}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{dayjs(doc.document_date).format('YYYY/MM/DD')}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>{doc.beneficiary}</TableCell>
                                                </TableRow>
                                            );
                                        }) : (
                                            <TableRow><TableCell colSpan={3} align="center"><Typography variant="caption">لا توجد مستندات مكتملة</Typography></TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* Incomplete Documents */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, color: 'warning.main' }}>
                                <WarningAmberIcon fontSize="small" /> المستندات المعلقة (سوف تُرحّل)
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300, borderRadius: 2 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'warning.50' }}>المستند</TableCell>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'warning.50' }}>السبب</TableCell>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: 'warning.50' }}>المسؤول</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {incompleteDocs.length > 0 ? incompleteDocs.map((doc) => {
                                            const type = docTypeLabel(doc.document_type);
                                            return (
                                                <TableRow key={doc.document_id} hover>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Chip label={type.label} color={type.color} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                            <Typography variant="caption" fontWeight={600}>#{doc.document_number}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem', color: 'error.main' }}>
                                                        {doc.incomplete_inventory_count > 0 ? `${doc.incomplete_inventory_count} مواد غير مدققة` : 'بانتظار الإكمال'}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '0.7rem' }}>
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <PersonIcon sx={{ fontSize: 12 }} />
                                                            {doc.user_name}
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }) : (
                                            <TableRow><TableCell colSpan={3} align="center"><Typography variant="caption">لا توجد مستندات معلقة</Typography></TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>

                    {/* Inventory Balances */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, color: 'info.main' }}>
                            <InventoryIcon fontSize="small" /> أرصدة المواد (الكميات المرحلة للشهر التالي)
                        </Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400, borderRadius: 2 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: 'info.50' }}>كود المادة</TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: 'info.50' }}>اسم المادة</TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: 'info.50' }} align="center">رقم الدفعة (Batch)</TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: 'info.50' }} align="center">تاريخ التوريد</TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: 'info.50', color: 'primary.main' }} align="right">الكمية المرحلة</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {normalizedSnapshots.length > 0 ? normalizedSnapshots.map((item, index) => (
                                        <TableRow key={item.batch_id || index} hover>
                                            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.material_code}</TableCell>
                                            <TableCell sx={{ fontSize: '0.75rem' }}>{item.material_name}</TableCell>
                                            <TableCell align="center">
                                                <Chip label={item.batch_id} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                {dayjs(item.import_date).format('YYYY/MM/DD')}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={800} color="primary.main">
                                                    {Number(item.remaining_quantity).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={5} align="center"><Typography variant="body2" sx={{ py: 2 }}>لا توجد أرصدة مرحلة</Typography></TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Stack>
            )}
        </Box>
    );
};

export default Step2Content;