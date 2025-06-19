// src/app/components/tabs/GroupTab.tsx

import Card from "../../components/Card";
import ObjectDetails from "../common/objectdetailsUtils";

interface GroupTabProps {
  data: any;
}

const GroupTab = ({ data }: GroupTabProps) => {
  return (
    <div>
      <h2>{data.name}</h2>
      <div>
        {data.investigations?.map((inv: any) => (
          <Card key={inv.investigation_id || inv.id} title={inv.name}>
            <ObjectDetails
              data={inv}
              excludeKeys={[
                "T.id",
                "T.label",
                "id",
                "investigation_id",
                "name",
              ]}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupTab;
