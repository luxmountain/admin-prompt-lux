import { useState, useMemo, useEffect } from "react";
import { Tag } from "@/types/Tag"; // Updated import for tags
import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import PaginationControl from "@/app/components/PaginationControl";

interface DataTableProps {
  data: Tag[]; // Use Tag type
  onEdit?: (tid: number) => void;
  onDelete?: (tid: number) => void;
}

const columns: { key: keyof Tag; label: string }[] = [
  { key: "tid", label: "Tag ID" },
  { key: "tag_content", label: "Tag Content" },
  { key: "tag_description", label: "Description" },
  { key: "postCount", label: "Post Count" },
];

export function DataTable({ data, onEdit, onDelete }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Tag>("postCount"); // Default sort by Tag ID
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const filteredData = useMemo(() => {
    return data.filter((tag) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        tag.tag_content?.toLowerCase().includes(searchLower) ||
        tag.tag_description?.toLowerCase().includes(searchLower) ||
        tag.tid.toString().includes(search);

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

  const handleSort = (field: keyof Tag) => {
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
          placeholder="Search by Tag ID, Name, Description..."
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
          onClick={() => navigate("/tags/create")}
          className="flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Tag
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
            {paginatedData.map((tag) => (
              <tr key={tag.tid} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2 border">
                    {tag[column.key]}
                  </td>
                ))}
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onEdit?.(tag.tid)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete?.(tag.tid)}
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
