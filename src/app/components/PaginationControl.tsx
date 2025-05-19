import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PaginationControlProps {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  totalPages: number;
}

export default function PaginationControl({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalPages,
}: PaginationControlProps) {
  const [jumpPage, setJumpPage] = useState("");

  const visiblePages = () => {
    const range: (number | "...")[] = [];
    const maxVisible = 2;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    range.push(1);
    if (page > maxVisible + 2) range.push("...");
    for (
      let i = Math.max(2, page - maxVisible);
      i <= Math.min(totalPages - 1, page + maxVisible);
      i++
    ) {
      range.push(i);
    }
    if (page < totalPages - maxVisible - 1) range.push("...");
    range.push(totalPages);

    return range;
  };

  const handleJump = () => {
    const num = parseInt(jumpPage);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setPage(num);
      setJumpPage("");
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      {/* Hàng đầu tiên: Rows per page và Pagination */}
      <div className="flex justify-between items-center gap-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {visiblePages().map((p, i) =>
              p === "..." ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <span className="px-2 text-gray-500">...</span>
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={page === p}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="flex items-center gap-2 absolute left-4">
        <span className="whitespace-nowrap">Rows per page:</span>
        <Select
          defaultValue={rowsPerPage.toString()}
          onValueChange={(value) => {
            setRowsPerPage(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end items-center right-4 absolute gap-2">
        <span>Go to page:</span>
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJump()}
          className="w-20"
        />
      </div>
    </div>
  );
}
