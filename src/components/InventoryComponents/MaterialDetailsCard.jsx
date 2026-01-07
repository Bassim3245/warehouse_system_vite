import { useTranslation } from "react-i18next";
import { formatDateYearsMonth } from "../../utils/formatData";
const MaterialDetailsCard = ({ inventory }) => {
  const { t } = useTranslation();
  return (
    <div className="detailsCardBody">
      <div className="detailsCard" style={{ margin: "10px" }}>
        <div className="detailsCardBody">
          {/* First Row */}
          <div className="detailsRowGroup">
            <div className="detailsRow">
              <span className="detailsLabel">{t("رمز المادة")}</span>
              <span className="detailsValue">
                {inventory?.cod_material || "---"}
              </span>
            </div>
            <div className="detailsRow">
              <span className="detailsLabel">{t("أسم المادة")}</span>
              <span className="detailsValue">
                {inventory?.name_of_material || "---"}
              </span>
            </div>
          </div>
          <hr />
          {/* Second Row */}
          <div className="detailsRowGroup">
            <div className="detailsRow">
              <span className="detailsLabel">{t("المخزن")}</span>
              <span className="detailsValue">
                {inventory?.warehouse_name || "---"}
              </span>
            </div>
            <div className="detailsRow">
              <span className="detailsLabel">{t("وحدة القياس")}</span>
              <span className="detailsValue">
                {inventory?.measuring_unit || "---"}
              </span>
            </div>
            <div className="detailsRow">
              <span className="detailsLabel">{t("المواصفات الفنية")}</span>
              <span className="detailsValue">
                {inventory?.specification || "---"}
              </span>
            </div>
          </div>
          <hr />
          <div className="detailsRowGroup">
            <div className="detailsRow">
              <span className="detailsLabel">{t("المنشأ")}</span>
              <span className="detailsValue">{inventory?.origin || "---"}</span>
            </div>
            <div className="detailsRow">
              <span className="detailsLabel">{t("الرصيد")}</span>
              <span className="detailsValue">
                {inventory?.balance || "---"}
              </span>
            </div>
            <div className="detailsRow">
              <span className="detailsLabel">{t("الحد الادنى للمخزون")}</span>
              <span className="detailsValue">
                {inventory?.minimum_stock_level || "---"}
              </span>
            </div>
          </div>
          <hr />
          {/* Third Row */}
          <div className="detailsRowGroup">
            <div className="detailsRow">
              <span className="detailsLabel">{t("تاريخ  أنتاج المادة ")}</span>
              <span className="detailsValue">
                {formatDateYearsMonth(inventory?.production_date) || "---"}
              </span>
            </div>
            <div className="detailsRow">
              <span className="detailsLabel">{t("تاريخ  أدخال المادة ")}</span>
              <span className="detailsValue">
                {formatDateYearsMonth(inventory?.expiry_date) || "---"}
              </span>
            </div>
          </div>
          {/* Fourth Row */}
          <div className="detailsRowGroup">
            <div className="detailsRow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MaterialDetailsCard;
