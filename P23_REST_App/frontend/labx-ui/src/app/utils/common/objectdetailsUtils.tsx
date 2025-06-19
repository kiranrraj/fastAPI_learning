// src\app\utils\common\objectdetailsUtils.tsx

interface ObjectDetailsProps {
  data: Record<string, any>;
  excludeKeys?: string[];
}

const ObjectDetails = ({ data, excludeKeys = [] }: ObjectDetailsProps) => {
  return (
    <ul>
      {Object.entries(data).map(([key, value]) => {
        if (excludeKeys.includes(key)) return null;

        const label = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const formatted =
          typeof value === "string" && value.match(/^202\d-/)
            ? new Date(value).toLocaleString()
            : String(value);

        return (
          <li key={key}>
            <strong>{label}:</strong> {formatted}
          </li>
        );
      })}
    </ul>
  );
};

export default ObjectDetails;
