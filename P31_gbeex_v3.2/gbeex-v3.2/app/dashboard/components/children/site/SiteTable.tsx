"use client";

import React from "react";
import Table from "@/app/components/table/Table";
import type { Site } from "@/app/types";
import { Column } from "@/app/types/table.types";

const siteColumns: Column<Site>[] = [
  { header: "Site Name", accessor: "siteName" },
  { header: "City", accessor: "city" },
  { header: "Country", accessor: "country" },
];

export default function SiteTable({ data }: { data: Site[] }) {
  return <Table columns={siteColumns} data={data} height="500px" />;
}
