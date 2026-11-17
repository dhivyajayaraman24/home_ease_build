import type { FilterModel } from "./FormField";
import type { TagModel } from "./Tag";

export type Align = "left" | "center" | "right";

export interface DataTableColumn {
  key: string;
  header: string;
  align: Align;
}

export interface DataTableCell {
  columnKey: string;
  value: string;
  tag?: TagModel;
}

export interface DataTableRow {
  id: string;
  cells: DataTableCell[];
}

export interface ToolbarAction {
  id: string;
  label: string;
  icon?: string;
  intent?: "primary" | "secondary" | "danger";
}

export interface ToolbarModel {
  title?: string;
  actions: ToolbarAction[];
  filters: FilterModel[];
}

export interface DataTableModel {
  component: "DataTable";
  caption: string;
  columns: DataTableColumn[];
  rows: DataTableRow[];
  toolbar?: ToolbarModel;
  emptyState: string;
}

export function createToolbar(input: Partial<ToolbarModel> = {}): ToolbarModel {
  return {
    title: input.title,
    actions: input.actions ?? [],
    filters: input.filters ?? []
  };
}

export function createDataTable(input: Omit<DataTableModel, "component" | "emptyState"> & {
  emptyState?: string;
}): DataTableModel {
  return {
    component: "DataTable",
    caption: input.caption,
    columns: input.columns,
    rows: input.rows,
    toolbar: input.toolbar,
    emptyState: input.emptyState ?? "No records to show yet."
  };
}
