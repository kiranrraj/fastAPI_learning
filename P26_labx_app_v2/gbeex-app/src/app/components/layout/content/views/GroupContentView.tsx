// src/app/components/layout/content/views/GroupContentView.tsx

"use client";

import React from "react";
import { PortletNode } from "@/app/types/common/portlet.types";
import PortletCardListView from "@/app/components/layout/content/views/PortletCardListView";

interface GroupContentViewProps {
  groupNode: PortletNode;
  allNodes: Record<string, PortletNode>;
}

const GroupContentView: React.FC<GroupContentViewProps> = ({
  groupNode,
  allNodes,
}) => {
  const children = (groupNode.childIds ?? [])
    .map((id: string) => allNodes[id])
    .filter((child: PortletNode | undefined): child is PortletNode => !!child);

  return <PortletCardListView title={groupNode.name} items={children} />;
};

export default GroupContentView;
