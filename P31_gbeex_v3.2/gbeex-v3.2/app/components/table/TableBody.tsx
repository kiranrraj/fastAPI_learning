// components/table/TableBody.tsx
import React from "react";
import styles from "./TableBody.module.css";
import { Column } from "@/app/types/table.types";

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  visible: Set<keyof T>;
}

export default function TableBody<T>({ data, columns, visible }: Props<T>) {
  return (
    <tbody>
      {data.map((row, i) => (
        <tr key={i} className={styles.row}>
          {columns.map(
            (col) =>
              visible.has(col.accessor) && (
                <td key={String(col.accessor)} className={styles.cell}>
                  {String(row[col.accessor] ?? "")}
                </td>
              )
          )}
        </tr>
      ))}
    </tbody>
  );
}
