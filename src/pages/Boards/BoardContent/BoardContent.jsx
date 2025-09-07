import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { mapOrder } from "~/utils/sorts";
import { arrayMove } from "@dnd-kit/sortable";

import ListColumns from "./ListColumns/ListColumns";

const BoardContent = ({ board }) => {
  // nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả, nhưng vẫn còn bug
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });

  // yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp chỉ click sẽ gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  // nhấn giữ 250ms và dung sai của cảm ứng thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });

  // ưu tiên sử dụng kết hợp sensors Mouse và Touch để có trải nghiệm trên mobile tốt nhất
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // kéo ra bên ngoài => over = null
    if (!over) return;

    if (active.id !== over.id) {
      // old index in orderedColumns
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      // new index in orderedColumns
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      //arrayMove dùng để sắp xếp mảng
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      setOrderedColumns(dndOrderedColumns);
      console.log(event);
    }
  };

  console.log("Render-BoardContent");

  return (
    /* Dnd Area */
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.var.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  );
};

export default BoardContent;
