import { Box } from "@mui/material";
import { Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { Alert } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Grid } from "@mui/material";
import { AlertTitle } from "@mui/material";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { ListItemText } from "@mui/material";
import { Paper } from "@mui/material";
import dayjs from "dayjs";
import AssignmentIcon from "@mui/icons-material/Assignment"
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description"

const Step2Content = ({ getPeriodText, fetchingDocs, incompleteDocs, completedDocs }) => (
    <Box sx={{ p: 2 }} dir="rtl">
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <AssignmentIcon color="info" />
            <Typography variant="h6" color="text.primary">
                مراجعة السجلات للفترة: {getPeriodText()}
            </Typography>
            </Stack>

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                    يتطلب النظام اكتمال كافة المستندات والقيود للشهر المحدد حتى تتمكن من إجراء عملية الأرشفة والإغلاق لتلك الفترة.
                </Typography>
            </Alert>

            {fetchingDocs ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>جاري جلب السجلات...</Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {/* Incomplete Documents Warning */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {incompleteDocs.length > 0 ? (
                            <Alert severity="warning" sx={{ height: '100%' }}>
                                <AlertTitle>
                                    ⚠️ مستندات غير مكتملة ({incompleteDocs.length})
                                </AlertTitle>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    لا يمكن إتمام الأرشفة بسبب وجود مستندات غير مكتملة. يرجى إكمالها أولاً:
                                </Typography>
                                <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {incompleteDocs.map((doc) => (
                                        <ListItem key={doc.document_id} sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <DescriptionIcon fontSize="small" color="warning" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${doc.document_type === 'out' ? 'صادر' : doc.document_type === 'in' ? 'وارد' : doc.document_type === 'internal_consumption' ? 'استهلاك داخلي' : 'مستند'} #${doc.document_number}`}
                                                secondary={`${dayjs(doc.document_date).format('YYYY/MM/DD')} - ${doc.warehouse_name} (${doc.incomplete_inventory_count} مادة غير مكتملة)`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Alert>
                        ) : (
                            <Alert severity="success" sx={{ height: '100%' }}>
                                <AlertTitle>✅ لا توجد مستندات غير مكتملة</AlertTitle>
                                <Typography variant="body2">
                                    جميع المستندات لهذه الفترة مكتملة ويمكن أرشفتها.
                                </Typography>
                            </Alert>
                        )}
                    </Grid>

                    {/* Completed Documents */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'success.50' }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <CheckCircleIcon color="success" />
                                <Typography variant="subtitle1" fontWeight={600} color="success.dark">
                                    المستندات المكتملة ({completedDocs.length})
                                </Typography>
                            </Stack>
                            {completedDocs.length > 0 ? (
                                <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {completedDocs.map((doc) => (
                                        <ListItem key={doc.document_id} sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <CheckCircleIcon fontSize="small" color="success" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${doc.document_type === 'out' ? 'صادر' : doc.document_type === 'in' ? 'وارد' : doc.document_type === 'internal_consumption' ? 'استهلاك داخلي' : 'مستند'} #${doc.document_number}`}
                                                secondary={`${dayjs(doc.document_date).format('YYYY/MM/DD')} - ${doc.warehouse_name}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    لا توجد مستندات مكتملة لهذه الفترة.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
    export default Step2Content;