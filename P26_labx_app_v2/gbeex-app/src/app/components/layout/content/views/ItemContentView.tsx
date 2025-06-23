// src/app/components/layout/content/views/ItemContentView.tsx

"use client";

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import PortletCardListView from "@/app/components/layout/content/views/PortletCardListView";

interface ItemContentViewProps {
  itemNode: PortletNode;
}

const ItemContentView: React.FC<ItemContentViewProps> = ({ itemNode }) => {
  // Wrap the single item in an array to reuse PortletCardListView
  return <PortletCardListView title={itemNode.name} items={[itemNode]} />;
};

export default ItemContentView;
