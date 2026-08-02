import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Alert } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useTheme } from '@mui/material/styles';

const UserGuid = () => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(145deg, rgba(25, 118, 210, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)'
                    : 'linear-gradient(145deg, rgba(25, 118, 210, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
                border: '1px solid',
                borderColor: 'primary.main',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)'
                }}>
                    <HelpOutlineIcon />
                </Box>
                <Box>
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                        كيفية الأرشفة - دليل الاستخدام
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        اتبع الخطوات التالية لضمان إغلاق محاسبي صحيح ودقيق
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {[
                    {
                        icon: <FilterAltIcon />,
                        title: "أولاً: تصفية البيانات",
                        desc: "اختر المخزن المطلوب من القائمة أدناه لعرض سجلات الإغلاق السابقة أو لبدء عملية جديدة لهذا المخزن.",
                        color: "#1976d2"
                    },
                    {
                        icon: <ArchiveIcon />,
                        title: "ثانياً: بدء الأرشفة",
                        desc: "اضغط على زر 'أرشفة نهائية' لفتح نافذة الجرد الشهري، واختر السنة والشهر المطلوب إغلاقهما.",
                        color: "#2e7d32"
                    },
                    {
                        icon: <AssessmentIcon />,
                        title: "ثالثاً: مراجعة السجلات",
                        desc: "سيقوم النظام بفحص جميع المستندات؛ يجب التأكد من اكتمال كافة القيود لكي تتمكن من إتمام عملية الأرشفة بنجاح.",
                        color: "#ed6c02"
                    },
                    {
                        icon: <DoneAllIcon />,
                        title: "رابعاً: التأكيد النهائي",
                        desc: "بعد المراجعة، أكد عملية الأرشفة. سيتم قفل الشهر ومنع أي تعديلات إضافية على مستندات تلك الفترة.",
                        color: "#9c27b0"
                    }
                ].map((step, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box sx={{
                            height: '100%',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: step.color,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 4px 12px ${step.color}15`
                            }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <Box sx={{ color: step.color }}>{step.icon}</Box>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                    {step.title}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                {step.desc}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Alert
                severity="info"
                icon={<InfoIcon fontSize="inherit" />}
                sx={{ mt: 3, borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}
            >
                <Typography variant="caption" fontWeight={600}>
                    ملاحظة هامة: الأرشفة عملية نهائية. بمجرد إغلاق الشهر، لا يمكن تعديل المستندات التابعة له إلا عن طريق طلب 'فتح الشهر' من قبل المسؤول.
                </Typography>
            </Alert>
        </Paper>
    );
};

export default UserGuid;
