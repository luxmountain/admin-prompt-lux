import { useState, useMemo, useEffect } from "react";
import { Keyword } from "@/types/Keyword"; // Updated import
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"; // import icons
import { DateRangeFilter } from "../DataRangeFilter";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";

interface DataTableProps {
  data: Keyword[];
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onSave?: (keyword: string) => void;
}

// Ensure columns have the correct types
const columns: { key: keyof Keyword; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "keyword", label: "Keyword" },
  { key: "post_count", label: "Post Count" },
  { key: "created_at", label: "Created At" }, // Added Created At column
];

export function DataTable({ data, onView, onDelete, onEdit, onSave }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Keyword>("post_count");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((keyword) => {
      const searchLower = search.toLowerCase();

      const pinDate = new Date(keyword.created_at);

      const startDate = fromDate
        ? new Date(fromDate.setHours(0, 0, 0, 0))
        : undefined;
      const endDate = toDate
        ? new Date(toDate.setHours(23, 59, 59, 999))
        : undefined;

      const matchesSearch =
        keyword.keyword.toLowerCase().includes(searchLower) ||
        keyword.id.toString().includes(search);

      const matchesDateRange =
        (!startDate || pinDate >= startDate) &&
        (!endDate || pinDate <= endDate);

      return matchesSearch && matchesDateRange;
    });
  }, [search, data, fromDate, toDate]);

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

  const handleSort = (field: keyof Keyword) => {
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

  // Function to format date in dd/mm/yyyy format
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(date).toLocaleDateString("en-GB", options); // 'en-GB' for dd/mm/yyyy format
  };

  return (
    <div className="mx-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <Input
          placeholder="Search by ID, Keyword..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
        {!adding ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-4 w-4" />
            Add Keyword
          </Button>
        ) : (
          <div className="flex gap-2 items-center">
            <Input
              placeholder="New keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="w-[200px]"
            />
            <Button
              size="sm"
              onClick={() => {
                if (newKeyword.trim()) {
                  onSave?.(newKeyword.trim());
                  setNewKeyword("");
                  setAdding(false);
                }
              }}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setNewKeyword("");
                setAdding(false);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
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
            {paginatedData.map((keyword) => (
              <tr key={keyword.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2 border">
                    {column.key === "created_at"
                      ? formatDate(keyword[column.key] as string) // Format date columns
                      : keyword[column.key]}
                  </td>
                ))}
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete?.(keyword.id)}
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
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
