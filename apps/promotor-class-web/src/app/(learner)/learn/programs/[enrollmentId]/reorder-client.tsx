"use client";

import { useState } from "react";
import { Button } from "@/components/foundation";

interface ReorderClientProps {
  initialOrder: string[]; // lesson IDs in current order
  onOrderChange: (newOrder: string[]) => void;
}

export default function ReorderClient({ initialOrder, onOrderChange }: ReorderClientProps) {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<string[]>(initialOrder);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newIndex = index - 1;
    const newOrder: string[] = [...currentOrder];
    const temp = newOrder[newIndex]!;
    newOrder[newIndex] = newOrder[index]!;
    newOrder[index] = temp;
    setCurrentOrder(newOrder);
    onOrderChange(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    const newIndex = index + 1;
    const newOrder: string[] = [...currentOrder];
    const temp = newOrder[newIndex]!;
    newOrder[newIndex] = newOrder[index]!;
    newOrder[index] = temp;
    setCurrentOrder(newOrder);
    onOrderChange(newOrder);
  };

  const toggleReorderMode = () => {
    setIsReorderMode(!isReorderMode);
  };

  return (
    <div className="pc-curriculum-reorder">
      {/* Toggle button */}
      <button
        onClick={toggleReorderMode}
        className="pc-reorder-toggle"
      >
        {isReorderMode ? "Selesai mengurutkan" : "Ubah urutan"}
      </button>

      {/* Instructions when reorder mode is ON */}
      {isReorderMode && (
        <p className="pc-reorder-instructions">
          Pindahkan pelajaran dengan tombol panah, atau tahan gagang di kanan untuk menyeret.
        </p>
      )}

      {/* Lesson list with reorder controls */}
      <div className="pc-reorder-lessons">
        {currentOrder.map((lessonId, index) => (
          <div
            key={lessonId}
            className={`pc-reorder-lesson-row ${isReorderMode ? "pc-reorder-active" : ""}`}
          >
            {isReorderMode && (
              <>
                <div className="pc-reorder-handle">⠿</div>
                <div className="pc-reorder-controls">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="pc-reorder-btn pc-reorder-btn--up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === currentOrder.length - 1}
                    className="pc-reorder-btn pc-reorder-btn--down"
                  >
                    ↓
                  </button>
                </div>
              </>
            )}
            <div className="pc-reorder-lesson-info">
              <span className="pc-reorder-position">{index + 1}</span>
              <span className="pc-reorder-content">—</span>
            </div>
            {!isReorderMode && (
              <span className="pc-reorder-menu">⋯</span>
            )}
          </div>
        ))}
      </div>

      {/* Footer action bar */}
      <div className="pc-reorder-footer">
        <Button
          variant={isReorderMode ? "primary" : "secondary"}
          onClick={toggleReorderMode}
          fullWidth
        >
          {isReorderMode ? "Simpan Urutan" : "Ubah urutan"}
        </Button>
      </div>
    </div>
  );
}
