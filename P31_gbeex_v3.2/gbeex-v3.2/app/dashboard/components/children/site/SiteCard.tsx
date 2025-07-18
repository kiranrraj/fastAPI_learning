"use client";

import React from "react";
import type { Site } from "@/app/types";

export default function SiteCard({ site }: { site: Site }) {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: 0 }}>{site.siteName}</h3>
      <p style={{ margin: "0.5rem 0 0" }}>
        {site.city}, {site.country}
      </p>
    </div>
  );
}
