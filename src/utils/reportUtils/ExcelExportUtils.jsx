import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ==================== SUMMARY EXPORT (Balance Only) ====================
export const exportBalanceSummaryToExcel = async (materials, dataUserById) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Warehouse Management System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("أرصدة المواد", {
        properties: { tabColor: { argb: "1976d2" } },
        views: [{ rightToLeft: true }],
    });

    // Set column widths
    worksheet.columns = [
        { header: "#", key: "index", width: 8 },
        { header: "اسم المادة", key: "name", width: 35 },
        { header: "رمز المادة", key: "code", width: 15 },
        { header: "المخزن", key: "warehouse", width: 20 },
        { header: "المصنع", key: "factory", width: 20 },
        { header: "المعمل", key: "lab", width: 20 },
        { header: "الرصيد", key: "balance", width: 12 },
        { header: "الوحدة", key: "unit", width: 12 },
    ];

    // Add title row
    worksheet.insertRow(1, []);
    worksheet.mergeCells("A1:H1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "تقرير أرصدة المواد في المخازن";
    titleCell.font = { size: 18, bold: true, color: { argb: "FFFFFF" } };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1976d2" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 35;

    // Add entity name row
    worksheet.insertRow(2, []);
    worksheet.mergeCells("A2:H2");
    const entityCell = worksheet.getCell("A2");
    entityCell.value = dataUserById?.Entities_name || "";
    entityCell.font = { size: 14, bold: true, color: { argb: "333333" } };
    entityCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E3F2FD" } };
    entityCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(2).height = 25;

    // Add date row
    worksheet.insertRow(3, []);
    worksheet.mergeCells("A3:H3");
    const dateCell = worksheet.getCell("A3");
    dateCell.value = `تاريخ التقرير: ${new Date().toLocaleDateString("ar-IQ")}`;
    dateCell.font = { size: 11, color: { argb: "666666" } };
    dateCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(3).height = 20;

    // Empty row
    worksheet.insertRow(4, []);

    // Style header row (now at row 5)
    const headerRow = worksheet.getRow(5);
    headerRow.values = ["#", "اسم المادة", "رمز المادة", "المخزن", "المصنع", "المعمل", "الرصيد", "الوحدة"];
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 12 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1976d2" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
        };
    });

    // Add data rows
    let totalBalance = 0;
    materials.forEach((material, index) => {
        const row = worksheet.addRow({
            index: index + 1,
            name: material.name_of_material,
            code: material.cod_material,
            warehouse: material.warehouse_name || "-",
            factory: material.Factories_name || "-",
            lab: material.Laboratory_name || "-",
            balance: parseFloat(material.balance) || 0,
            unit: material.measuring_unit,
        });

        totalBalance += parseFloat(material.balance) || 0;

        // Style data rows
        const isOdd = index % 2 === 0;
        row.eachCell((cell, colNumber) => {
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin", color: { argb: "CCCCCC" } },
                left: { style: "thin", color: { argb: "CCCCCC" } },
                bottom: { style: "thin", color: { argb: "CCCCCC" } },
                right: { style: "thin", color: { argb: "CCCCCC" } },
            };
            if (isOdd) {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F5F5F5" } };
            }
            if (colNumber === 7) {
                cell.font = { bold: true, color: { argb: parseFloat(material.balance) > 0 ? "388E3C" : "D32F2F" } };
            }
        });
        row.height = 22;
    });

    // Add total row
    const totalRowIndex = materials.length + 6;
    const totalRow = worksheet.addRow({
        index: "",
        name: "الإجمالي",
        code: "",
        warehouse: "",
        factory: "",
        lab: "",
        balance: totalBalance,
        unit: "",
    });
    totalRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "388E3C" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "medium", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "medium", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
        };
    });
    totalRow.height = 28;

    // Add footer info
    worksheet.addRow([]);
    worksheet.mergeCells(`A${totalRowIndex + 2}:H${totalRowIndex + 2}`);
    const footerCell = worksheet.getCell(`A${totalRowIndex + 2}`);
    footerCell.value = `عدد المواد: ${materials.length} | إجمالي الأرصدة: ${totalBalance}`;
    footerCell.font = { size: 10, color: { argb: "666666" }, italic: true };
    footerCell.alignment = { horizontal: "center" };

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = `تقرير_أرصدة_المواد_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fileName);
};

// ==================== DETAILED EXPORT (All Data with Imports/Exports) ====================
export const exportDetailedDataToExcel = async (materials, dataUserById) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Warehouse Management System";
    workbook.created = new Date();

    // Helper function to style headers
    const styleHeader = (row, color = "1976d2") => {
        row.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                right: { style: "thin", color: { argb: "000000" } },
            };
        });
        row.height = 22;
    };

    // Helper function to style data rows
    const styleDataRow = (row, isOdd) => {
        row.eachCell((cell) => {
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin", color: { argb: "DDDDDD" } },
                left: { style: "thin", color: { argb: "DDDDDD" } },
                bottom: { style: "thin", color: { argb: "DDDDDD" } },
                right: { style: "thin", color: { argb: "DDDDDD" } },
            };
            if (isOdd) {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F9F9F9" } };
            }
        });
        row.height = 20;
    };

    // ===================== SHEET 1: Materials Summary =====================
    const summarySheet = workbook.addWorksheet("ملخص المواد", {
        properties: { tabColor: { argb: "1976d2" } },
        views: [{ rightToLeft: true }],
    });

    summarySheet.columns = [
        { width: 8 }, { width: 30 }, { width: 15 }, { width: 20 },
        { width: 18 }, { width: 18 }, { width: 12 }, { width: 12 },
        { width: 15 }, { width: 15 },
    ];

    // Title
    summarySheet.mergeCells("A1:J1");
    const titleCell = summarySheet.getCell("A1");
    titleCell.value = "تقرير المخزون التفصيلي - ملخص المواد";
    titleCell.font = { size: 18, bold: true, color: { argb: "FFFFFF" } };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1976d2" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    summarySheet.getRow(1).height = 35;

    // Entity & Date
    summarySheet.mergeCells("A2:J2");
    summarySheet.getCell("A2").value = dataUserById?.Entities_name || "";
    summarySheet.getCell("A2").font = { size: 12, bold: true };
    summarySheet.getCell("A2").alignment = { horizontal: "center" };

    summarySheet.mergeCells("A3:J3");
    summarySheet.getCell("A3").value = `تاريخ التقرير: ${new Date().toLocaleDateString("ar-IQ")}`;
    summarySheet.getCell("A3").font = { size: 10, color: { argb: "666666" } };
    summarySheet.getCell("A3").alignment = { horizontal: "center" };

    // Headers
    const summaryHeaders = summarySheet.addRow([
        "#", "اسم المادة", "رمز المادة", "المخزن", "المصنع", "المعمل",
        "الرصيد", "الوحدة", "عدد الواردات", "عدد الصادرات"
    ]);
    styleHeader(summaryHeaders);

    // Data
    let totalBalance = 0;
    materials.forEach((material, index) => {
        const row = summarySheet.addRow([
            index + 1,
            material.name_of_material,
            material.cod_material,
            material.warehouse_name || "-",
            material.Factories_name || "-",
            material.Laboratory_name || "-",
            parseFloat(material.balance) || 0,
            material.measuring_unit,
            material.imports?.length || 0,
            material.exports?.length || 0,
        ]);
        styleDataRow(row, index % 2 === 0);
        totalBalance += parseFloat(material.balance) || 0;
    });

    // Total row
    const totalRow = summarySheet.addRow([
        "", "الإجمالي", "", "", "", "", totalBalance, "", "", ""
    ]);
    totalRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "388E3C" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
    });
    totalRow.height = 25;

    // ===================== SHEET 2: All Imports =====================
    const importsSheet = workbook.addWorksheet("سجل الواردات", {
        properties: { tabColor: { argb: "388E3C" } },
        views: [{ rightToLeft: true }],
    });

    importsSheet.columns = [
        { width: 8 }, { width: 25 }, { width: 12 }, { width: 18 },
        { width: 12 }, { width: 20 }, { width: 12 }, { width: 12 },
        { width: 15 }, { width: 15 }, { width: 12 },
    ];

    // Title
    importsSheet.mergeCells("A1:K1");
    const importsTitleCell = importsSheet.getCell("A1");
    importsTitleCell.value = "سجل جميع الواردات";
    importsTitleCell.font = { size: 18, bold: true, color: { argb: "FFFFFF" } };
    importsTitleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "388E3C" } };
    importsTitleCell.alignment = { horizontal: "center", vertical: "middle" };
    importsSheet.getRow(1).height = 35;

    // Headers
    const importsHeaders = importsSheet.addRow([
        "#", "اسم المادة", "رقم المستند", "تاريخ المستند",
        "تاريخ الشراء", "الجهة المستفيدة", "الكمية", "السعر",
        "الإجمالي", "الكمية المتبقية", "المخزن"
    ]);
    styleHeader(importsHeaders, "388E3C");

    // Data
    let importIndex = 0;
    let totalImportQty = 0;
    let totalImportValue = 0;

    materials.forEach((material) => {
        if (material.imports && material.imports.length > 0) {
            material.imports.forEach((imp) => {
                importIndex++;
                const qty = parseFloat(imp.quantity) || 0;
                const price = parseFloat(imp.price) || 0;
                const total = qty * price;
                totalImportQty += qty;
                totalImportValue += total;

                const row = importsSheet.addRow([
                    importIndex,
                    material.name_of_material,
                    imp.document?.number || "-",
                    imp.document?.date || "-",
                    imp.purchase_date || "-",
                    imp.document?.beneficiary || "-",
                    qty,
                    price,
                    total,
                    imp.remaining_quantity || 0,
                    material.warehouse_name || "-",
                ]);
                styleDataRow(row, importIndex % 2 === 0);
            });
        }
    });

    // Total row for imports
    const importsTotalRow = importsSheet.addRow([
        "", "الإجمالي", "", "", "", "", totalImportQty, "", totalImportValue, "", ""
    ]);
    importsTotalRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "2E7D32" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
    });
    importsTotalRow.height = 25;

    // ===================== SHEET 3: All Exports =====================
    const exportsSheet = workbook.addWorksheet("سجل الصادرات", {
        properties: { tabColor: { argb: "D32F2F" } },
        views: [{ rightToLeft: true }],
    });

    exportsSheet.columns = [
        { width: 8 }, { width: 25 }, { width: 12 }, { width: 18 },
        { width: 15 }, { width: 20 }, { width: 12 }, { width: 15 },
        { width: 25 }, { width: 18 },
    ];

    // Title
    exportsSheet.mergeCells("A1:J1");
    const exportsTitleCell = exportsSheet.getCell("A1");
    exportsTitleCell.value = "سجل جميع الصادرات";
    exportsTitleCell.font = { size: 18, bold: true, color: { argb: "FFFFFF" } };
    exportsTitleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D32F2F" } };
    exportsTitleCell.alignment = { horizontal: "center", vertical: "middle" };
    exportsSheet.getRow(1).height = 35;

    // Headers
    const exportsHeaders = exportsSheet.addRow([
        "#", "اسم المادة", "رقم المستند", "تاريخ المستند",
        "تاريخ الصرف", "الجهة المستفيدة", "الكمية الإجمالية", "المبلغ الإجمالي",
        "ملاحظات", "المخزن"
    ]);
    styleHeader(exportsHeaders, "D32F2F");

    // Data
    let exportIndex = 0;
    let totalExportQty = 0;
    let totalExportValue = 0;

    materials.forEach((material) => {
        if (material.exports && material.exports.length > 0) {
            material.exports.forEach((exp) => {
                exportIndex++;
                const qty = parseFloat(exp.total_quantity) || 0;
                const amount = parseFloat(exp.total_amount) || 0;
                totalExportQty += qty;
                totalExportValue += amount;

                const row = exportsSheet.addRow([
                    exportIndex,
                    material.name_of_material,
                    exp.document?.number || "-",
                    exp.document?.date || "-",
                    exp.export_date || "-",
                    exp.document?.beneficiary || "-",
                    qty,
                    amount,
                    exp.note || "-",
                    material.warehouse_name || "-",
                ]);
                styleDataRow(row, exportIndex % 2 === 0);
            });
        }
    });

    // Total row for exports
    const exportsTotalRow = exportsSheet.addRow([
        "", "الإجمالي", "", "", "", "", totalExportQty, totalExportValue, "", ""
    ]);
    exportsTotalRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "C62828" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
    });
    exportsTotalRow.height = 25;

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = `تقرير_المخزون_التفصيلي_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fileName);
};

// Export both functions
export default {
    exportBalanceSummaryToExcel,
    exportDetailedDataToExcel,
};
