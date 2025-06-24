// src/app/components/layout/content/views/ItemContentView.tsx

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";

/**
 * Props for ItemContentView
 */
interface ItemContentViewProps {
  itemNode: PortletNode;
}

/**
 * Renders the content for a single item node.
 * You can extend this with dynamic components later (e.g., maps, tables).
 */
const ItemContentView: React.FC<ItemContentViewProps> = ({ itemNode }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{itemNode.name}</h2>
      <p className="text-sm text-gray-600">
        Type: {itemNode.portletType || "unknown"}
      </p>

      <div className="mt-4 p-4 border rounded bg-gray-50">
        {/* Placeholder for visualization */}
        <p>
          Render content of type:{" "}
          <strong>{itemNode.portletType || "N/A"}</strong>
        </p>
        <p>This is where the actual table/map/chart will render.</p>
      </div>
    </div>
  );
};

export default ItemContentView;
