import { useState, useMemo } from "react";
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
} from "@/components/ui/select";
import { DateRangeFilter } from "../DataRangeFilter";
import PaginationControl from "@/app/components/PaginationControl";

interface ReportTableProps {
  data: Report[];
  onView?: (report: Report) => void;
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
  // 🔄 Thay search bằng 2 input riêng
  const [reporterSearch, setReporterSearch] = useState("");
  const [reportedSearch, setReportedSearch] = useState("");

  const [sortBy, setSortBy] = useState<string>("id");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reportTypeFilter, setReportTypeFilter] = useState<
    "all" | "report_user" | "report_post"
  >("all");

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const getValueByPath = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? "";
  };

  const filteredData = useMemo(() => {
    const reporterSearchLower = reporterSearch.toLowerCase();
    const reportedSearchLower = reportedSearch.toLowerCase();

    return data.filter((report) => {
      const matchesReporter =
        report.User_Report_reporter_idToUser.email
          .toLowerCase()
          .includes(reporterSearchLower);

      const matchesReported =
        report.User_Report_reported_user_idToUser.email
          .toLowerCase()
          .includes(reportedSearchLower);

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

      return matchesReporter && matchesReported && matchesType && matchesDate;
    });
  }, [
    reporterSearch,
    reportedSearch,
    data,
    reportTypeFilter,
    fromDate,
    toDate,
  ]);

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
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            placeholder="Search reporter email..."
            value={reporterSearch}
            onChange={(e) => {
              setReporterSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <Input
            placeholder="Search reported email..."
            value={reportedSearch}
            onChange={(e) => {
              setReportedSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
        </div>
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
      </div>

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
                      onClick={() => onView?.(report)}
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
