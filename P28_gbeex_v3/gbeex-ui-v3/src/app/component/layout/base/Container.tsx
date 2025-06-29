import React from "react";
import styles from "./Container.module.css";
import Header from "@/app/component/layout/base/header";
import Footer from "@/app/component/layout/base/footer/Footer";
import MainSection from "@/app/component/layout/base/mainsection/MainSection";

const Container = () => {
  return (
    <div className={styles.container}>
      <Header />
      <MainSection />
      <Footer />
    </div>
  );
};

export default Container;
