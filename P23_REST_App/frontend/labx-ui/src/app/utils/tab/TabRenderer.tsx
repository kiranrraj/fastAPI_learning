// src/app/components/tabs/TabRenderer.tsx
import { Tab } from "../../types/tabTypes";
import DashboardTab from "./DashboardTab";
import GroupTab from "./GroupTab";
import InvestigationTab from "./InvestigationTab";

const TabRenderer = ({ tab }: { tab: Tab }) => {
  switch (tab.type) {
    case "dashboard":
      return <DashboardTab data={tab.content} />;
    case "group":
      return (
        <GroupTab data={{ name: tab.title, investigations: tab.content }} />
      );
    case "investigation":
      return <InvestigationTab data={tab.content} />;
    default:
      return <div>Unknown tab type: {tab.type}</div>;
  }
};

export default TabRenderer;
