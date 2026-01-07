import  { useEffect, useState } from "react";
import "./about.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import imageCompany from "../../../../assets/image/DSC02984.JPG";
import image2 from "../../../../assets/image/8.jpg";
import image3 from "../../../../assets/image/1.jpg";
import Header from "../../../../components/reusableComponent/HeaderComponent";

function AboutPage() {
  const [direction, setDirection] = useState("rtl");
  const { t } = useTranslation();

  // Initialize AOS and direction setting
  useEffect(() => {
    AOS.init();
    setDirection(localStorage.getItem("language") || "rtl");
  }, []);

  return (
    <div id="about" className="about" dir={direction}>
      <div className="container">
        <div className="content-wrapper">
          <div
            className="col-lg-6 content"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Header title={t("About")} typeHeader="h3" />
            <p className="fst-italic">{t("AboutText")}</p>
            <ul>
              <li>
                <i className="bi bi-check-circle" /> {t("AboutText2")}
              </li>
            </ul>
          </div>
          <div
            className="col-lg-6 about-images"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="row gy-4">
              <div className="col-lg-6">
                <img src={imageCompany} className="img-fluid" alt="Company" />
              </div>
              <div className="col-lg-6">
                <div className="displayImageAbout">
                  <img src={image2} className="img-fluid" alt="About Image 2" />
                  <img src={image3} className="img-fluid" alt="About Image 3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
