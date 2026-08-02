import  { useCallback, useEffect } from 'react';
import { fetchDataUserEntityId } from '../redux/userSlice/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInformation } from '../utils/handelCookie';

const useGenInformationUserByEntityId = () => {
    const dispatch = useDispatch();
    const { dataUsers } = useSelector((state) => state.user);
    const informationUser = getUserInformation()
    const dispatchFactoryLabWarehouseData = useCallback(() => {
        const entityId = informationUser?.entity_id;
        if (!entityId) return;
        dispatch(fetchDataUserEntityId(entityId));
    }, [dispatch]);
    useEffect(() => {
        dispatchFactoryLabWarehouseData();
    }, [
        dispatchFactoryLabWarehouseData,
    ]);
    return {
        dataUsers,
    }
}

export default useGenInformationUserByEntityId;
