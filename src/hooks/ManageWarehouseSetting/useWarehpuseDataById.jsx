import { useGetWarehouseDataByIdQuery } from "../../redux/wharHosueState/WarehouseApi";

export default function useWarehpuseDataById({ warehouseId }) {
    const { data: warehouseDataBYId, isFetching: loading } = useGetWarehouseDataByIdQuery(
        warehouseId,
        { skip: !warehouseId }
    );

    return { warehouseDataBYId, loading };
}
