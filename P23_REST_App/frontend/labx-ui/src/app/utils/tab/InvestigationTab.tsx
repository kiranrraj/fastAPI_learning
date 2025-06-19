// src/app/components/tabs/InvestigationTab.tsx

import Card from "../../components/Card";
import ObjectDetails from "../common/objectdetailsUtils";

interface InvestigationTabProps {
  data: any;
}

const InvestigationTab = ({ data }: InvestigationTabProps) => {
  return (
    <Card
      title={data.name}
      subtitle="Investigation"
      tId={data["T.id"]}
      tLabel={data["T.label"]}
      footer={
        <div>
          <div>
            <strong>Created At:</strong>{" "}
            {new Date(data.created_at).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong>{" "}
            {new Date(data.updated_at).toLocaleString()}
          </div>
        </div>
      }
    >
      <ObjectDetails
        data={data}
        excludeKeys={[
          "T.id",
          "T.label",
          "id",
          "investigation_id",
          "name",
          "created_at",
          "updated_at",
        ]}
      />
    </Card>
  );
};

export default InvestigationTab;
