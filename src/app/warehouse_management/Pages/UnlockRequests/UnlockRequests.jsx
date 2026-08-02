import { useState } from 'react';

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Badge from "@mui/material/Badge"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';


const UnlockRequests = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [myRequests, setMyRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);

  



    // const handleCancelRequest = async (requestId) => {
    //     if (!window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
    //         return;
    //     }

    //     try {
    //         await cancelUnlockRequest(requestId);
    //         toast.success('تم إلغاء الطلب بنجاح');
    //         fetchRequests();
    //     } catch (error) {
    //         console.error('Error canceling request:', error);
    //         toast.error('فشل في إلغاء الطلب');
    //     }
    // };

    // const handleApprove = (request) => {
    //     setSelectedRequest(request);
    //     setShowApprovalPanel(true);
    // };

    // const handleApprovalComplete = () => {
    //     setShowApprovalPanel(false);
    //     setSelectedRequest(null);
    //     fetchRequests();
    // };

    const requests = activeTab === 0 ? myRequests : pendingRequests;
    const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EditIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={600}>
                            طلبات التعديل
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setShowRequestForm(true)}
                    >
                        طلب جديد
                    </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    إدارة طلبات الموافقة على تعديل المستندات المغلقة
                </Typography>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="طلباتي" />
                    <Tab
                        label={
                            <Badge badgeContent={pendingCount} color="error">
                                الطلبات المعلقة
                            </Badge>
                        }
                    />
                </Tabs>
            </Paper>

            {/* Content */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : requests.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center' }}>
                    <EditIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        لا توجد طلبات
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {activeTab === 0
                            ? 'لم تقم بإنشاء أي طلبات بعد'
                            : 'لا توجد طلبات معلقة للموافقة'
                        }
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* {requests.map(request => (
                        <RequestCard
                            key={request.id}
                            request={request}
                            onCancel={handleCancelRequest}
                            onApprove={handleApprove}
                            showActions={activeTab === 1}
                        />
                    ))} */}
                </Box>
            )}
{/* 
            {showRequestForm && (
                <RequestUnlockForm
                    onClose={() => setShowRequestForm(false)}
                    onSuccess={() => {
                        setShowRequestForm(false);
                        fetchRequests();
                    }}
                />
            )}

            {showApprovalPanel && selectedRequest && (
                <ApprovalPanel
                    request={selectedRequest}
                    onClose={() => setShowApprovalPanel(false)}
                    onComplete={handleApprovalComplete}
                />
            )} */}
        </Box>
    );
};

export default UnlockRequests;
