import { useState, useMemo, useEffect } from "react";
import { Pin } from "@/types/Pin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { DateRangeFilter } from "@/app/components/DataRangeFilter";
import PaginationControl from "@/app/components/PaginationControl";

interface PinTableProps {
  data: Pin[];
  onView?: (pid: number) => void;
  onDelete?: (pid: number) => void;
}

const columns: { key: keyof Pin; label: string }[] = [
  { key: "pid", label: "ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "imageUrl", label: "Image" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comments" },
  { key: "seen", label: "Views" },
  { key: "savedPost", label: "Saved" },
  { key: "createdAt", label: "Created At" },
];

export function PinTable({ data, onView, onDelete }: PinTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Pin>("pid");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const sortableColumns: (keyof Pin)[] = [
    "pid",
    "likes",
    "comments",
    "seen",
    "savedPost",
    "createdAt",
  ];

  const filteredData = useMemo(() => {
    return data.filter((pin) => {
      const searchTerm = search.toLowerCase();
      const pinDate = new Date(pin.createdAt);

      const startDate = fromDate
        ? new Date(fromDate.setHours(0, 0, 0, 0))
        : undefined;
      const endDate = toDate
        ? new Date(toDate.setHours(23, 59, 59, 999))
        : undefined;

      const matchesSearch =
        pin.title.toLowerCase().includes(searchTerm) ||
        pin.pid.toString().includes(searchTerm) ||
        pin.description.toLowerCase().includes(searchTerm);

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

  const handleSort = (field: keyof Pin) => {
    if (field === sortBy) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
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
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by ID, Title, Description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        {/* Date Range Filters */}
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
      </div>

      <div className="overflow-hidden rounded-lg shadow-md border">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              {columns.map((column) => {
                const isSortable = sortableColumns.includes(column.key);
                return (
                  <th
                    key={column.key}
                    className={`px-4 py-2 border ${
                      isSortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => isSortable && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {isSortable && sortBy === column.key && (
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
                );
              })}
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((pin) => (
              <tr key={pin.pid} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2 border">
                    {column.key === "createdAt" ? (
                      <div className="line-clamp-6 break-words">
                        {(() => {
                          const date = new Date(pin.createdAt);
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()}
                      </div>
                    ) : column.key === "imageUrl" ? (
                      <img
                        src={pin.imageUrl}
                        alt="pin"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="line-clamp-6 break-words">
                        {String(pin[column.key])}
                      </div>
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(pin.pid)}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete?.(pin.pid)}
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

      {/* Pagination Controls */}
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
