// src/app/page.tsx

"use client";

import { dir } from "console";
import React from "react";
import Container from "./component/layout/base/Container";
// import AppContainer from "@/app/components/layout/base/AppContainer"; // Import your root layout component

/**
 * HomePage
 * This is the main landing page of our app. It renders the AppContainer component, which includes:
 * - Header, Main Section [Sidebar, Content Area], Footer
 * This is the core of your Single Page Application.
 * The output is passed to children place holdern in layout.tsx
 */
const HomePage: React.FC = () => {
  return <Container />;
};

export default HomePage;
