import { DataTable } from "@/components/data-table";

import data from "./data.json";

export default function Report() {
  return (
    <>
      <DataTable data={data} />
    </>
  );
}
