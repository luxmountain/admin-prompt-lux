import { useState, useMemo, useEffect } from "react";
import { Report } from "@/types/Report";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import Select
import { DateRangeFilter } from "../DataRangeFilter"; // Ensure correct path to DateRangeFilter

interface ReportTableProps {
  data: Report[];
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const columns: { key: keyof Report | string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "reason", label: "Reason" },
  { key: "User_Report_reporter_idToUser.email", label: "Reporter" },
  { key: "Post.image_url", label: "Image" },
  { key: "User_Report_reported_user_idToUser.email", label: "Reported User" },
  { key: "created_at", label: "Created At" },
  { key: "type", label: "Type of Report" },
];

export function ReportTable({ data, onView, onDelete }: ReportTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reportTypeFilter, setReportTypeFilter] = useState<
    "all" | "report_user" | "report_post"
  >("all"); // Thêm filter

  // Date Range filter state
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const getValueByPath = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? "";
  };

  const filteredData = useMemo(() => {
    const searchLower = search.toLowerCase();
    return data.filter((report) => {
      const matchesSearch =
        report.reason.toLowerCase().includes(searchLower) ||
        report.User_Report_reporter_idToUser.email
          .toLowerCase()
          .includes(searchLower) ||
        report.User_Report_reported_user_idToUser.email
          .toLowerCase()
          .includes(searchLower);

      const matchesType =
        reportTypeFilter === "all" ||
        (reportTypeFilter === "report_post" &&
          getValueByPath(report, "Post.image_url")) ||
        (reportTypeFilter === "report_user" &&
          !getValueByPath(report, "Post.image_url"));

      const reportDate = new Date(report.created_at);
      const startDate = fromDate
        ? new Date(fromDate.setHours(0, 0, 0, 0))
        : undefined;
      const endDate = toDate
        ? new Date(toDate.setHours(23, 59, 59, 999))
        : undefined;
      const matchesDate =
        (!startDate || reportDate >= startDate) &&
        (!endDate || reportDate <= endDate);

      return matchesSearch && matchesType && matchesDate;
    });
  }, [search, data, reportTypeFilter, fromDate, toDate]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = getValueByPath(a, sortBy);
      const bValue = getValueByPath(b, sortBy);

      if (aValue < bValue) return sortAsc ? -1 : 1;
      if (aValue > bValue) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortAsc]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (field: string) => {
    if (field === sortBy) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="mx-4 space-y-4">
      <div className="flex justify-between items-center">
        {/* Tìm kiếm */}
        <Input
          placeholder="Search reports..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        {/* Date Range Filter */}
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
      </div>
      {/* Select Box lọc loại báo cáo */}
      <div className="flex items-center gap-2">
        <span>Report Type:</span>
        <Select
          value={reportTypeFilter}
          onValueChange={(value) => {
            setReportTypeFilter(value as "all" | "report_user" | "report_post");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="report_post">Post</SelectItem>
            <SelectItem value="report_user">User</SelectItem>
          </SelectContent>
        </Select>
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
            {paginatedData.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2 border">
                    {column.key === "created_at" ? (
                      new Date(
                        getValueByPath(report, column.key)
                      ).toLocaleDateString("vi-VN")
                    ) : column.key === "Post.image_url" ? (
                      getValueByPath(report, column.key) ? (
                        <img
                          src={getValueByPath(report, column.key)}
                          alt="Post"
                          className="h-16 w-24 object-cover rounded"
                        />
                      ) : null
                    ) : column.key === "type" ? (
                      getValueByPath(report, "Post.image_url") ? (
                        "Post"
                      ) : (
                        "User"
                      )
                    ) : (
                      getValueByPath(report, column.key)
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(report.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete?.(report.id)}
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
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
