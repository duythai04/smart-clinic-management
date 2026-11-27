import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Eye, Pencil } from "lucide-react";

interface Props {
  onView: () => void;
  onEdit: () => void;
}

interface Position {
  top: number;
  left: number;
}

export default function UserActionMenu({ onView, onEdit }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    menuRef.current?.querySelector("button")?.focus();

    function handleOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function closeMenu() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [open]);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();

    if (!rect) return;

    const width = 200;
    const height = 100;

    setPosition({
      left: Math.max(
        8,
        Math.min(rect.right - width, window.innerWidth - width - 8),
      ),
      top:
        rect.bottom + height > window.innerHeight
          ? Math.max(8, rect.top - height)
          : rect.bottom + 6,
    });

    setOpen(true);
  }

  function handleAction(action: () => void) {
    setOpen(false);
    buttonRef.current?.focus();
    action();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Thao tác nhân viên"
        aria-expanded={open}
        onClick={toggleMenu}
        className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-800"
      >
        <MoreHorizontal size={20} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: position.top,
              left: position.left,
            }}
            className="fixed z-40 w-[200px] rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl"
          >
            <button
              type="button"
              onClick={() => handleAction(onView)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
            >
              <Eye size={17} />
              Xem chi tiết
            </button>

            <button
              type="button"
              onClick={() => handleAction(onEdit)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
            >
              <Pencil size={17} />
              Chỉnh sửa thông tin
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
