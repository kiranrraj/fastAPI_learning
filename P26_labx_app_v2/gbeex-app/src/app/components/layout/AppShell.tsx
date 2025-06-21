// src/app/components/layout/AppShell.tsx
import React from "react";
import Container from "@/app/components/layout/Container";
import Header from "@/app/components/layout/header/Header";
import Footer from "@/app/components/layout/Footer";
import MainArea from "@/app/components/layout/MainArea";
import styles from "@/app/components/styles/AppShell.module.css";
const AppShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Container className={styles.appShell}>
      <Header />
      <MainArea>{children}</MainArea>
      <Footer />
    </Container>
  );
};

export default React.memo(AppShell);
