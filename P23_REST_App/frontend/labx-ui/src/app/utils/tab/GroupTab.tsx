// src/app/components/tabs/GroupTab.tsx

import Card from "../../components/Card";
import ObjectDetails from "../common/objectdetailsUtils";

const GroupTab = ({ data }: { data: any }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {data.investigations?.map((inv: any) => (
        <Card
          key={inv.investigation_id || inv.id}
          title={inv.name}
          subtitle="Investigation"
          tId={inv["T.id"]}
          tLabel={inv["T.label"]}
          footer={
            <div>
              <div>
                <strong>Created At:</strong>{" "}
                {new Date(inv.created_at).toLocaleString()}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {new Date(inv.updated_at).toLocaleString()}
              </div>
            </div>
          }
        >
          <ObjectDetails
            data={inv}
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
      ))}
    </div>
  );
};

export default GroupTab;
