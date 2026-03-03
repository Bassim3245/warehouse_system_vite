import { useState, useRef, useCallback } from "react";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import useGetDataId from "../../../../hooks/useGetDataId";
import { getUserInformation } from "../../../../utils/handelCookie";

const COLUMNS = [
  { key: "warehouseCode", label: "رمز المخزن" },
  { key: "code", label: "الرقم الرمزي" },
  { key: "materialName", label: "اسم المادة" },
  { key: "origin", label: "المنشأ" },
  { key: "unitMeasuring", label: "وحدة القياس" },
  { key: "specification", label: "المواصفات" },
  { key: "status", label: "الحالة" },
  { key: "balance", label: "الرصيد" },
  { key: "price", label: "السعر" },
  { key: "minimum_stock_level", label: "الحد الأدنى" },
];

export default function OpeningBalanceImport() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileRef = useRef();
  const currentFile = useRef(null);
const { labId, factoryId } = useGetDataId();
const userInfo=getUserInformation()
  // Upload file → backend reads with exceljs → returns JSON rows
  const uploadForPreview = async (file) => {
    setPreviewLoading(true);
    setError("");
    setRows([]);
    setMeta(null);
    setResult(null);
    currentFile.current = file;
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);



    try {
      const res = await axiosInstance(
        "/api/warehouse/preview",
        {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status !== 200) {
        setError(res.data?.message || "فشل تحليل الملف");
        return;
      }
      setRows(res.data.rows);
      setMeta(res.data.meta);
    } catch (err) {
      setError(err.response?.data?.message || "تعذّر الاتصال بالخادم");
    } finally {
      setPreviewLoading(false);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) uploadForPreview(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".xlsx") || f.name.endsWith(".xls")))
      uploadForPreview(f);
  }, []);

  const handleSubmit = async () => {
    if (!currentFile.current) return;
    setSubmitLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", currentFile.current);
        formData.append("lab_id", labId);
    formData.append("factory_id", factoryId); 
    formData.append("user_id", userInfo.user_id);
    formData.append("entity_id", userInfo.entity_id);
    formData.append("ministry_id", userInfo.minister_id);
    // formData.append("entity_id", ...);
    try {
      const res = await axiosInstance(
        "/api/warehouse/all-warehouses",
        {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult({
        success: res.status === 200 || res.status === 201,
        message: res.data.message,
        skipped: res.data.skippedMaterials || [],
        total: res.data.totalProcessed,
      });
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || "تعذّر الاتصال بالخادم",
        skipped: [],
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setRows([]);
    setMeta(null);
    setFileName("");
    setError("");
    setResult(null);
    currentFile.current = null;
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div
      style={{
        fontFamily: "'Cairo','Tajawal',sans-serif",
        direction: "rtl",
        minHeight: "100vh",
        background: "#f0f4f8",
        padding: "32px 24px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: 0 }}
        >
          📦 استيراد الرصيد الافتتاحي — جميع المخازن
        </h1>
        <p style={{ color: "#64748b", marginTop: 6, fontSize: 13 }}>
          ارفع ملف Excel — يتم تحليله بـ <strong>ExcelJS</strong> على الخادم
          وعرض المعاينة قبل الحفظ
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => fileRef.current.click()}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        style={{
          border: `2px dashed ${dragging ? "#2563eb" : previewLoading ? "#f59e0b" : "#94a3b8"}`,
          borderRadius: 12,
          background: dragging ? "#eff6ff" : "#fff",
          padding: "36px 24px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 38, marginBottom: 8 }}>
          {previewLoading ? "⏳" : fileName ? "✅" : "📂"}
        </div>
        {previewLoading ? (
          <p style={{ color: "#d97706", fontWeight: 600, margin: 0 }}>
            جاري تحليل الملف بـ ExcelJS على الخادم...
          </p>
        ) : fileName ? (
          <p style={{ color: "#2563eb", fontWeight: 600, margin: 0 }}>
            {fileName}
          </p>
        ) : (
          <>
            <p style={{ color: "#475569", margin: 0 }}>
              اسحب ملف Excel هنا أو اضغط للاختيار
            </p>
            <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
              .xlsx أو .xls
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div
        style={{
          background: "#fef9c3",
          border: "1px solid #fde047",
          borderRadius: 8,
          padding: "9px 14px",
          fontSize: 13,
          color: "#713f12",
          marginBottom: 20,
        }}
      >
        ⚠️ يجب وجود عمود <strong>رمز المخزن</strong> — إذا لم يكن المخزن موجوداً
        سيتم إنشاؤه تلقائياً
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#991b1b",
            marginBottom: 16,
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Stats */}
      {meta && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {[
            {
              label: "إجمالي الصفوف",
              value: meta.total,
              color: "#1e3a5f",
              bg: "#e0e7ef",
            },
            {
              label: "عدد المخازن",
              value: meta.warehouses.length,
              color: "#0f766e",
              bg: "#ccfbf1",
            },
            {
              label: "بدون رمز مخزن",
              value: meta.missingWarehouse,
              color: meta.missingWarehouse > 0 ? "#b45309" : "#16a34a",
              bg: meta.missingWarehouse > 0 ? "#fef3c7" : "#dcfce7",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                borderRadius: 8,
                padding: "10px 18px",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#475569" }}>{s.label}</div>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: "#64748b" }}>المخازن:</span>
            {meta.warehouses.map((w) => (
              <span
                key={w}
                style={{
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  borderRadius: 20,
                  padding: "2px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "#1e3a5f",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            معاينة البيانات — {rows.length} صف (قُرئت بـ ExcelJS على الخادم)
          </div>
          <div style={{ overflowX: "auto", maxHeight: 400, overflowY: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f1f5f9",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <th style={th}>#</th>
                  {COLUMNS.map((c) => (
                    <th
                      key={c.key}
                      style={{
                        ...th,
                        color:
                          c.key === "warehouseCode" ? "#1d4ed8" : "#334155",
                      }}
                    >
                      {c.key === "warehouseCode" ? "🏭 " : ""}
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      background: !row.warehouseCode
                        ? "#fff7ed"
                        : i % 2 === 0
                          ? "#fff"
                          : "#f8fafc",
                    }}
                  >
                    <td style={td}>{i + 1}</td>
                    {COLUMNS.map((c) => (
                      <td
                        key={c.key}
                        style={{
                          ...td,
                          color:
                            c.key === "warehouseCode" && !row[c.key]
                              ? "#ef4444"
                              : c.key === "warehouseCode"
                                ? "#1d4ed8"
                                : "#334155",
                          fontWeight: c.key === "warehouseCode" ? 700 : 400,
                        }}
                      >
                        {row[c.key] ||
                          (c.key === "warehouseCode" ? "⚠️ مفقود" : "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          style={{
            borderRadius: 10,
            padding: "14px 18px",
            marginBottom: 20,
            background: result.success ? "#dcfce7" : "#fee2e2",
            border: `1px solid ${result.success ? "#86efac" : "#fca5a5"}`,
            color: result.success ? "#166534" : "#991b1b",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            {result.success ? "✅" : "❌"} {result.message}
          </div>
          {result.success && (
            <div style={{ fontSize: 13 }}>
              تمت معالجة <strong>{result.total}</strong> مادة بنجاح
            </div>
          )}
          {result.skipped?.length > 0 && (
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: "pointer", fontSize: 13 }}>
                مواد تم تخطّيها ({result.skipped.length})
              </summary>
              <ul style={{ margin: "6px 0 0 16px", fontSize: 12 }}>
                {result.skipped.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        {(rows.length > 0 || fileName) && (
          <button
            onClick={handleReset}
            style={{
              ...btn,
              background: "#fff",
              color: "#64748b",
              border: "1px solid #cbd5e1",
            }}
          >
            🗑️ مسح
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!rows.length || submitLoading}
          style={{
            ...btn,
            background: rows.length && !submitLoading ? "#1e3a5f" : "#94a3b8",
            color: "#fff",
            cursor: rows.length && !submitLoading ? "pointer" : "not-allowed",
            minWidth: 180,
          }}
        >
          {submitLoading
            ? "⏳ جاري الحفظ..."
            : `🚀 حفظ البيانات (${rows.length - (meta?.missingWarehouse || 0)} صف)`}
        </button>
      </div>
    </div>
  );
}

const th = {
  padding: "10px 12px",
  textAlign: "right",
  fontWeight: 700,
  borderBottom: "2px solid #e2e8f0",
  whiteSpace: "nowrap",
};
const td = {
  padding: "8px 12px",
  borderBottom: "1px solid #f1f5f9",
  whiteSpace: "nowrap",
  maxWidth: 180,
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const btn = {
  padding: "10px 22px",
  borderRadius: 8,
  border: "none",
  fontFamily: "'Cairo',sans-serif",
  fontWeight: 700,
  fontSize: 14,
  transition: "opacity 0.2s",
};
