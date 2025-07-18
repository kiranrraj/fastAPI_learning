// components/table/table.types.ts

export interface Column<T> {
    header: string
    accessor: keyof T
}
