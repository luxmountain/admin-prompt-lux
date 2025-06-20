import { useState, useMemo, useEffect } from "react";
import { Model } from "@/types/Model"; // Updated import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import PaginationControl from "@/app/components/PaginationControl";

interface DataTableProps {
  data: Model[];
  onView?: (mid: number) => void;
  onEdit?: (mid: number) => void;
}

// Ensure columns have the correct types
const columns: { key: keyof Model; label: string }[] = [
  { key: "mid", label: "Model ID" },
  { key: "model_name", label: "Model Name" },
  { key: "model_description", label: "Description" },
  { key: "model_link", label: "Link" },
  { key: "postCount", label: "Post Count" },
];

export function DataTable({ data, onView, onEdit }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Model>("postCount"); // Default sort by Model ID
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/models/create")}
          className="flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Model
        </Button>
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
                    {column.key === "model_link" ? (
                      <a
                        href={model[column.key] as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {model[column.key]}
                      </a>
                    ) : (
                      model[column.key]
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onEdit?.(model.mid)}
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination + Rows per page controls */}
      <PaginationControl
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPages={totalPages}
      />
    </div>
  );
}
