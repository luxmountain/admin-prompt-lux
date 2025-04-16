import { DataTable } from "@/components/data-table";

import data from "./data.json";

export default function UserList() {
  return (
    <>
      <DataTable data={data} />
    </>
  );
}
