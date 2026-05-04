import { Box, Stack, Typography, CircularProgress, Grid, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import dayjs from "dayjs";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const docTypeLabel = (type) =>
    type === 'out' ? 'صادر' : type === 'in' ? 'وارد' : type === 'internal_consumption' ? 'استهلاك داخلي' : 'مستند';

const Step2Content = ({ getPeriodText, fetchingDocs, incompleteDocs, completedDocs }) => (
    <Box sx={{ p: 1.5 }} dir="rtl">

        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
            <AssignmentIcon sx={{ fontSize: 16, color: 'info.main' }} />
            <Typography variant="subtitle1" fontWeight={500}>
                مراجعة السجلات — {getPeriodText()}
            </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            يمكنك المتابعة حتى لو وجدت مستندات غير مكتملة.
        </Typography>

        {fetchingDocs ? (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 3, justifyContent: 'center' }}>
                <CircularProgress size={18} />
                <Typography variant="caption" color="text.secondary">جاري جلب السجلات...</Typography>
            </Stack>
        ) : (
            <Grid container spacing={1.5}>

                {/* Incomplete */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                        <WarningAmberIcon sx={{ fontSize: 14, color: incompleteDocs.length > 0 ? 'warning.main' : 'success.main' }} />
                        <Typography variant="caption" fontWeight={500}
                            color={incompleteDocs.length > 0 ? 'warning.dark' : 'success.dark'}>
                            {incompleteDocs.length > 0
                                ? `غير مكتملة (${incompleteDocs.length})`
                                : 'جميع المستندات مكتملة'}
                        </Typography>
                    </Stack>

                    {incompleteDocs.length > 0 ? (
                        <Box sx={{
                            border: '0.5px solid', borderColor: 'warning.200',
                            borderRadius: 1, maxHeight: 180, overflow: 'auto'
                        }}>
                            <List dense disablePadding>
                                {incompleteDocs.map((doc, i) => (
                                    <Box key={doc.document_id}>
                                        {i > 0 && <Divider />}
                                        <ListItem sx={{ py: 0.5, px: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 26 }}>
                                                <DescriptionIcon sx={{ fontSize: 13, color: 'warning.main' }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${docTypeLabel(doc.document_type)} #${doc.document_number}`}
                                                secondary={`${dayjs(doc.document_date).format('YYYY/MM/DD')} · ${doc.incomplete_inventory_count} مادة`}
                                                primaryTypographyProps={{ variant: 'caption', fontWeight: 500 }}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                            />
                                        </ListItem>
                                    </Box>
                                ))}
                            </List>
                        </Box>
                    ) : (
                        <Typography variant="caption" color="text.secondary">
                            لا توجد مستندات غير مكتملة.
                        </Typography>
                    )}
                </Grid>

                {/* Completed */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                        <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                        <Typography variant="caption" fontWeight={500} color="success.dark">
                            مكتملة ({completedDocs.length})
                        </Typography>
                    </Stack>

                    {completedDocs.length > 0 ? (
                        <Box sx={{
                            border: '0.5px solid', borderColor: 'success.200',
                            borderRadius: 1, maxHeight: 180, overflow: 'auto'
                        }}>
                            <List dense disablePadding>
                                {completedDocs.map((doc, i) => (
                                    <Box key={doc.document_id}>
                                        {i > 0 && <Divider />}
                                        <ListItem sx={{ py: 0.5, px: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 26 }}>
                                                <CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${docTypeLabel(doc.document_type)} #${doc.document_number}`}
                                                secondary={`${dayjs(doc.document_date).format('YYYY/MM/DD')} · ${doc.warehouse_name}`}
                                                primaryTypographyProps={{ variant: 'caption', fontWeight: 500 }}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                            />
                                        </ListItem>
                                    </Box>
                                ))}
                            </List>
                        </Box>
                    ) : (
                        <Typography variant="caption" color="text.secondary">
                            لا توجد مستندات مكتملة.
                        </Typography>
                    )}
                </Grid>

            </Grid>
        )}
    </Box>
);

export default Step2Content;