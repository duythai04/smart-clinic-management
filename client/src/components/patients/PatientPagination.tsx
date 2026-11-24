import { ChevronLeft, ChevronRight } from "lucide-react";

interface PatientPaginationProps {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function PatientPagination({
  page,
  size,
  totalPages,
  totalElements,
  loading,
  onPageChange,
}: PatientPaginationProps) {
  const start = totalElements === 0 ? 0 : page * size + 1;

  const end = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 p-5">
      <p className="text-sm text-slate-500">
        Hiển thị{" "}
        <span className="font-semibold text-slate-700">
          {start} - {end}
        </span>{" "}
        trên{" "}
        <span className="font-semibold text-slate-700">{totalElements}</span>{" "}
        bệnh nhân
      </p>

      <div className="flex items-center gap-3">
        <button
          aria-label="Trang trước"
          disabled={page === 0 || loading}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-sm font-medium text-slate-600">
          Trang {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </span>

        <button
          aria-label="Trang tiếp theo"
          disabled={page + 1 >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
