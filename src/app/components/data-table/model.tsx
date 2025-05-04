import { useState, useMemo, useEffect } from "react";
import { Model } from "@/types/Model"; // Updated import
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"; // import icons

interface DataTableProps {
  data: Model[];
  onView?: (mid: number) => void;
  onDelete?: (mid: number) => void;
}

// Ensure columns have the correct types
const columns: { key: keyof Model; label: string }[] = [
  { key: "mid", label: "Model ID" },
  { key: "model_name", label: "Model Name" },
  { key: "model_description", label: "Description" },
  { key: "postCount", label: "Post Count" },
];

export function DataTable({
  data,
  onView,
  onDelete,
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Model>("mid"); // Default sort by Model ID
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    return data.filter((model) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        model.model_name?.toLowerCase().includes(searchLower) ||
        model.model_description?.toLowerCase().includes(searchLower) ||
        model.mid.toString().includes(search);

      return matchesSearch;
    });
  }, [search, data]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortAsc]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (field: keyof Model) => {
    if (field === sortBy) {
      setSortAsc(!sortAsc); // toggle sorting direction if the same column is clicked
    } else {
      setSortBy(field);
      setSortAsc(true); // default to ascending when switching columns
    }
  };

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredData.length, rowsPerPage, page]);

  return (
    <div className="mx-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <Input
          placeholder="Search by Model ID, Name, Description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-hidden rounded-lg shadow-md border">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-2 border cursor-pointer"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex">
                    {column.label}
                    {sortBy === column.key && (
                      <span className="ml-2 grid place-items-center">
                        {sortAsc ? (
                          <ArrowUpIcon className="h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((model) => (
              <tr key={model.mid} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2 border">
                    {column.key === "model_description"
                      ? model[column.key].slice(0, 50) + "..." // truncate description
                      : model[column.key]}
                  </td>
                ))}
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(model.mid)}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete?.(model.mid)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination + Rows per page controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            defaultValue={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setPage(1); // reset to first page when page size changes
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Page {page} of {totalPages}
          </span>
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
