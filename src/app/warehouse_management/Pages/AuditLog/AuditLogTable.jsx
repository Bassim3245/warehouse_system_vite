import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AuditLogDetail from './AuditLogDetail';

const AuditLogTable = ({ logs }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionConfig = (action) => {
        const actionLower = action.toLowerCase();
        switch (actionLower) {
            case 'create':
                return { icon: <AddIcon />, label: 'إنشاء', color: 'success' };
            case 'update':
                return { icon: <EditIcon />, label: 'تحديث', color: 'info' };
            case 'delete':
                return { icon: <DeleteIcon />, label: 'حذف', color: 'error' };
            case 'approve':
                return { icon: <CheckCircleIcon />, label: 'موافقة', color: 'success' };
            case 'reject':
                return { icon: <CancelIcon />, label: 'رفض', color: 'error' };
            default:
                return { icon: null, label: action, color: 'default' };
        }
    };

    const getTableNameArabic = (tableName) => {
        const tableNames = {
            'documents': 'المستندات',
            'exports': 'الصرف',
            'monthly_locks': 'إغلاق الأشهر',
            'unlock_requests': 'طلبات التعديل',
            'warehouses': 'المخازن',
            'materials': 'المواد',
            'users': 'المستخدمين'
        };
        return tableNames[tableName] || tableName;
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>الوقت</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>العملية</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>الجدول</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>رقم السجل</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>المستخدم</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>المسؤول</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>الإجراءات</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs?.map((item) => {
                        const actionConfig = getActionConfig(item?.action);
                        return (
                            <TableRow
                                key={item?.id}
                                sx={{
                                    '&:hover': { bgcolor: 'grey.50' },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <TableCell>{formatDate(item?.created_at)}</TableCell>
                                <TableCell>
                                    <Chip
                                        icon={actionConfig.icon}
                                        label={actionConfig.label}
                                        color={actionConfig.color}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{getTableNameArabic(item?.table_name)}</TableCell>
                                <TableCell>#{item?.record_id}</TableCell>
                                <TableCell>{item?.user_name || `مستخدم #${item?.user_id}`}</TableCell>
                                <TableCell>
                                    {item?.admin_id ? (item?.admin_name || `مسؤول #${item?.admin_id}`) : '-'}
                                </TableCell>
                                <TableCell>
                                    <AuditLogDetail item={item} />

                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AuditLogTable;
