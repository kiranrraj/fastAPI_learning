// src/app/components/tabs/GroupTab.tsx

import styles from "./GroupTab.module.css";

import Card from "../../components/Card";
import ObjectDetails from "../common/objectdetailsUtils";

import ShareIcon from "../../components/icons/ShareIcon";
import OpentabIcon from "../../components/icons/OpentabIcon";
import CloseIcon from "../../components/icons/CloseIcon";

const GroupTab = ({ data }: { data: any }) => {
  const handleShare = (inv: any) => {
    console.log("Share:", inv.investigation_id);
  };

  const openAsTab = (inv: any) => {
    console.log("Open as tab:", inv.investigation_id);
  };

  const removeFromGroup = (inv: any) => {
    console.log("Remove from view:", inv.investigation_id);
  };

  return (
    <div className={styles.grid}>
      {data.investigations?.map((inv: any) => (
        <Card
          key={inv.investigation_id}
          title={inv.name}
          subtitle="Investigation"
          tId={inv["T.id"]}
          tLabel={inv["T.label"]}
          metaBlock={
            <>
              <div>
                <strong>Group ID:</strong> {inv.group_ids}
              </div>
              <div>
                <strong>Investigation ID:</strong> {inv.investigation_id}
              </div>
            </>
          }
          topRight={
            <>
              <button title="Share" onClick={() => handleShare(inv)}>
                <ShareIcon />
              </button>
              <button title="Open as tab" onClick={() => openAsTab(inv)}>
                <OpentabIcon />
              </button>
              <button
                title="Remove from view"
                onClick={() => removeFromGroup(inv)}
              >
                <CloseIcon />
              </button>
            </>
          }
          footer={
            <>
              <div>
                <strong>Created At:</strong>{" "}
                {new Date(inv.created_at).toLocaleString()}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {new Date(inv.updated_at).toLocaleString()}
              </div>
            </>
          }
        >
          <ObjectDetails
            data={inv}
            excludeKeys={[
              "T.id",
              "T.label",
              "id",
              "investigation_id",
              "group_ids",
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
