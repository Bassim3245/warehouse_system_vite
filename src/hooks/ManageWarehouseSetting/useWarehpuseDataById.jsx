import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getWarehouseDataById } from "../../redux/wharHosueState/WareHouseAction";

export default function useWarehpuseDataById({ warehouseId }) {
    const { warehouseDataBYId } = useSelector((state) => state?.wareHouse);
    const dispatch = useDispatch();
    useEffect(() => {
        if (warehouseId) {
            dispatch(getWarehouseDataById(warehouseId));
        }
    }, [dispatch, warehouseId]);
    return { warehouseDataBYId }
}
