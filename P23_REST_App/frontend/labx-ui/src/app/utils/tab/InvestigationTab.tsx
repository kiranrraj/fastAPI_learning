// src/app/components/tabs/InvestigationTab.tsx

import Card from "../../components/Card";
import ObjectDetails from "../common/objectdetailsUtils";

interface InvestigationTabProps {
  data: any;
}

const InvestigationTab = ({ data }: InvestigationTabProps) => {
  return (
    <Card title={data.name}>
      <ObjectDetails
        data={data}
        excludeKeys={["T.id", "T.label", "id", "investigation_id", "name"]}
      />
    </Card>
  );
};

export default InvestigationTab;
