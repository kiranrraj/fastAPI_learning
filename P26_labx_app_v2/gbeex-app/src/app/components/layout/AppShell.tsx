// src/app/components/layout/AppShell.tsx
"use client";

import React, { useEffect, useState } from "react";
import Container from "./Container";
import Header from "./header/Header";
import Footer from "./Footer";
import MainArea from "./MainArea";
import AppLoader from "../ui/AppLoader";
import styles from "@/app/components/styles/AppShell.module.css";

const AppShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 400); // adjustable
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <AppLoader />;

  return (
    <Container className={styles.appShell}>
      <Header />
      <MainArea />
      <Footer />
    </Container>
  );
};

export default React.memo(AppShell);
