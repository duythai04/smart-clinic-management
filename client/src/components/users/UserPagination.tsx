import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function UserPagination({
  page,
  size,
  totalPages,
  totalElements,
  loading,
  onPageChange,
}: Props) {
  const start = totalElements === 0 ? 0 : page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  const firstPage = Math.max(0, Math.min(page - 2, totalPages - 5));

  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstPage + index,
  );

  const buttonClass =
    "flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 px-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">
      <p className="text-sm text-slate-500">
        Hiển thị{" "}
        <span className="font-medium text-slate-700">
          {start} - {end}
        </span>{" "}
        trên <span className="font-medium text-slate-700">{totalElements}</span>{" "}
        nhân viên
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={loading || page === 0}
          onClick={() => onPageChange(page - 1)}
          className={buttonClass}
        >
          <ChevronLeft size={17} />
        </button>

        {pages.map((item) => (
          <button
            type="button"
            key={item}
            disabled={loading}
            aria-current={page === item ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
              page === item
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item + 1}
          </button>
        ))}

        <button
          type="button"
          aria-label="Trang tiếp theo"
          disabled={loading || page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={buttonClass}
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
