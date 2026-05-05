import { useState, useCallback } from "react";
import monthlyCloseService from "../service/warehouse/monthlyCloseService";
import { toast } from "react-toastify";

export const useMonthlyClose = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [materialSnapshots, setMaterialSnapshots] = useState([]);
    const [docs, setDocs] = useState({ completed: [], incomplete: [] });

    /**
     * Fetch documents and material snapshots for Step 2 of the archiving wizard
     */
    const fetchStep2Data = useCallback(async (entityId, year, month, warehouseId) => {
        if (!entityId || !warehouseId) return;
        
        setIsFetching(true);
        try {
            // 1. Fetch documents status
            const docsResponse = await monthlyCloseService.getDocumentToCheckInformation(entityId, year, month, warehouseId);
            const allDocs = docsResponse?.data || [];
            
            const completed = allDocs.filter(doc => doc.is_fully_completed === 1);
            const incomplete = allDocs.filter(doc => doc.is_fully_completed === 0);
            
            setDocs({ completed, incomplete });

            // 2. Fetch material snapshots preview
            const previewResponse = await monthlyCloseService.getMonthlyClosePreview(entityId, year, month, warehouseId);
            const snapshots = previewResponse?.data || [];
            setMaterialSnapshots(snapshots);

            return { completed, incomplete, materialSnapshots: snapshots };
        } catch (error) {
            console.error("Error fetching Step 2 data:", error);
            toast.error("فشل في جلب البيانات المطلوبة للمراجعة");
            return null;
        } finally {
            setIsFetching(false);
        }
    }, []);

    /**
     * Unlock a previously locked month
     */
    const unlockMonth = useCallback(async (lockId, onSuccess) => {
        if (!window.confirm('هل أنت متأكد من فتح هذا الشهر؟')) return;
        
        setIsFetching(true);
        try {
            await monthlyCloseService.deleteMonthlyLockById(lockId);
            toast.success('تم فتح الشهر بنجاح');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error unlocking month:', error);
            toast.error('فشل في فتح الشهر');
        } finally {
            setIsFetching(false);
        }
    }, []);

    return {
        isFetching,
        materialSnapshots,
        docs,
        fetchStep2Data,
        unlockMonth
    };
};
