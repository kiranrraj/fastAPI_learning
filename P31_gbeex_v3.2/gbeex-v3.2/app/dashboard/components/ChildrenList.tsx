// ChildrenList.tsx
import React from "react";
import { Site, Subject } from "@/app/types";

export default function ChildrenList({
  children,
}: {
  children: (Site | Subject)[];
}) {
  return (
    <div>
      {children.map((child) =>
        "siteId" in child ? (
          <div key={child.siteId}>
            <strong>Site:</strong> {child.siteName}
          </div>
        ) : (
          <div key={child.subjectId}>
            <strong>Subject:</strong> {child.subjectId}
          </div>
        )
      )}
    </div>
  );
}
