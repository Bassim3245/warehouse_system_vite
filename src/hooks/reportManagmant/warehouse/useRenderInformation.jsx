import { Typography } from "@mui/material";
import { CheckboxItem } from "../../../style/reportStyle";
import { useMemo, useCallback } from "react";

export default function useRenderInformation({
    selectedInfo,
    onInfoCheckboxChange,
    theme,
    t,
    labData,
    factoryData,
    filteredLabs,
    wareHouseData,

}) {

    // Memoize filtered warehouses
    const filteredWarehouses = useMemo(() => {
        if (!selectedInfo?.labs || selectedInfo.labs.length === 0) {
            return wareHouseData || [];
        }
        return (
            wareHouseData?.filter((warehouse) =>
                selectedInfo.labs?.includes(warehouse?.laboratory_id)
            ) || []
        );
    }, [wareHouseData, selectedInfo?.labs]);



    // Memoize handlers
    const handleFactoryChange = useCallback(
        (factoryId, name) => {
            onInfoCheckboxChange("factories", factoryId, name);

            const isFactorySelected = selectedInfo?.factories.includes(factoryId);
            if (!isFactorySelected) {
                const updatedLabs = selectedInfo?.labs.filter((labId) => {
                    const lab = labData?.find((l) => l.id === labId);
                    return (
                        lab &&
                        selectedInfo.factories.concat([factoryId]).includes(lab.factory_id)
                    );
                });

                const updatedWarehouses = selectedInfo?.warehouses.filter(
                    (warehouseId) => {
                        const warehouse = wareHouseData?.find((w) => w.id === warehouseId);
                        return warehouse && updatedLabs.includes(warehouse.lab_id);
                    }
                );

                if (updatedLabs.length !== selectedInfo.labs.length) {
                    selectedInfo.labs.forEach((labId) => {
                        if (!updatedLabs.includes(labId)) {
                            onInfoCheckboxChange("labs", labId);
                        }
                    });
                }

                if (updatedWarehouses.length !== selectedInfo.warehouses.length) {
                    selectedInfo.warehouses.forEach((warehouseId) => {
                        if (!updatedWarehouses.includes(warehouseId)) {
                            onInfoCheckboxChange("warehouses", warehouseId);
                        }
                    });
                }
            }
        },
        [selectedInfo, labData, wareHouseData, onInfoCheckboxChange]
    );

    const handleLabChange = useCallback(
        (labId, name) => {
            onInfoCheckboxChange("labs", labId, name);

            const isLabSelected = selectedInfo.labs.includes(labId);
            if (!isLabSelected) {
                const updatedWarehouses = selectedInfo.warehouses.filter(
                    (warehouseId) => {
                        const warehouse = wareHouseData?.find((w) => w.id === warehouseId);
                        return (
                            warehouse &&
                            selectedInfo.labs.concat([labId]).includes(warehouse.lab_id)
                        );
                    }
                );

                if (updatedWarehouses.length !== selectedInfo.warehouses.length) {
                    selectedInfo.warehouses.forEach((warehouseId) => {
                        if (!updatedWarehouses.includes(warehouseId)) {
                            onInfoCheckboxChange("warehouses", warehouseId);
                        }
                    });
                }
            }
        },
        [selectedInfo, wareHouseData, onInfoCheckboxChange]
    );
    // Render warehouse checkboxes
    const renderWarehouses = useMemo(() => {
        if (filteredWarehouses?.length === 0) {
            return (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: 2, py: 1 }}
                >
                    {selectedInfo.labs.length === 0
                        ? t("يرجى اختيار معمل أولاً لعرض المخازن المتاحة")
                        : t("لا توجد مخازن متاحة للمعامل المحددة")}
                </Typography>
            );
        }

        return filteredWarehouses.map((warehouse) => (
            <CheckboxItem
                key={warehouse.id}
                item={{ name: warehouse?.name }}
                checked={selectedInfo?.warehouses.some((item) =>
                    typeof item === "object"
                        ? item.id === warehouse?.id
                        : item === warehouse?.id
                )}
                onChange={() =>
                    onInfoCheckboxChange("warehouses", warehouse?.id, warehouse?.name)
                }
                color={theme.palette.info}
            />
        ));
    }, [
        filteredWarehouses,
        selectedInfo,
        onInfoCheckboxChange,
        theme,
        t,
    ]);

    // Render lab checkboxes
    const renderLabs = useMemo(() => {
        if (labData.length === 0) {
            return (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: 2, py: 1 }}
                >
                    {selectedInfo.factories.length === 0
                        ? t("يرجى اختيار مصنع أولاً لعرض المعامل المتاحة")
                        : t("لا توجد معامل متاحة للمصانع المحددة")}
                </Typography>
            );
        }

        return labData.map((lab) => (
            <CheckboxItem
                key={lab.id}
                item={{ name: lab?.Laboratory_name }}
                checked={selectedInfo.labs.includes(lab.id)}
                onChange={() => handleLabChange(lab?.id, lab?.Laboratory_name)}
                color={theme.palette.success}
            />
        ));
    }, [filteredLabs, selectedInfo.labs, handleLabChange, theme, t]);

    // Render factory checkboxes
    const renderFactories = useMemo(
        () =>
            factoryData?.map((factory) => (
                <CheckboxItem
                    key={factory.factory_id}
                    item={{ name: factory?.Factories_name }}
                    checked={selectedInfo?.factories.includes(factory?.factory_id)}
                    onChange={() =>
                        handleFactoryChange(factory?.factory_id, factory?.Factories_name)
                    }
                    color={theme.palette.warning}
                />
            )),
        [factoryData, selectedInfo?.factories, handleFactoryChange, theme]
    );
    return {
        renderWarehouses,
        renderLabs,
        renderFactories,
    }
}
