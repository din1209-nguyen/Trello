import { useState, useEffect } from "react";
import { cloneDeep, isEqual } from "lodash";
import Box from "@mui/material/Box";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { mapOrder } from "~/utils/sorts";
import { arrayMove } from "@dnd-kit/sortable";
import ListColumns from "./ListColumns/ListColumns";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

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

  // cùng 1 thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState([]);
  const [activeDragItemData, setActiveDragItemData] = useState([]);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  // tìm Column theo CardId
  const findColumnByCardId = (cardId) => {
    // nên dùng c.card thay vì c.cardOrderIds bởi vì ở bước handleDragOver sẽ làm dữ liệu cho cards hoàn chính trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns?.find((column) =>
      column?.cards?.map((card) => card?._id)?.includes(cardId)
    );
  };

  // Trigger khi bắt đầu hành động kéo (drag) 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
  };

  // Trigger khi hành động đang kéo (dragging) 1 phần tử
  const handleDragOver = (event) => {
    // nếu kéo column sẽ không làm gì
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    const { active, over } = event;
    // cần đảm bảo nếu không tồn tại active over (khi kéo ra khỏi phạm vi container thì không làm gì tránh crash trang)
    if (!active || !over) return;

    const activeColumn = findColumnByCardId(active.id);
    const overColumn = findColumnByCardId(over.id);

    // nếu không tồn tại 1 trong 2 column thì kết thúc, tránh crash trang web
    if (!activeColumn || !overColumn || activeColumn._id === overColumn._id)
      return;

    // khi kéo trong Column sẽ không làm gì, chỉ xử lí lúc đang kéo
    setOrderedColumns((prevColumns) => {
      // tìm vị trí (index) của overCard trong Column đích (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === over.id
      );

      // logic tính toán cardIndex mới (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thủ viện
      const isBeLowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBeLowOverItem ? 1 : 0;

      const newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      // clone mảng OrderedColumn cũ ra một cái mới để xử ý data rồi return - cập nhật lại OrderedColumn mới
      const nextColumns = cloneDeep(prevColumns);

      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        // xóa card ở Column active (cũng có thể hiểu là column cũ, khi kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== active.id
        );
        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }

      if (nextOverColumn) {
        // kiểm tra card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== active.id
        );

        // thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          active.data.current
        );

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }
      return nextColumns;
    });
  };

  // Trigger khi kết thúc hành động kéo 1 phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
    }

    const { active, over } = event;

    // cần đảm bảo nếu không tồn tại active over (khi kéo ra khỏi phạm vi container thì không làm gì tránh crash trang)
    if (!active || !over) return;

    if (active.id !== over.id) {
      // old index in orderedColumns
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      // new index in orderedColumns
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      //arrayMove dùng để sắp xếp mảng
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      setOrderedColumns(dndOrderedColumns);
    }
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    /* Dnd Area */
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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

        {/* hành động giữ chỗ khi kéo */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ? (
            <Column column={activeDragItemData} />
          ) : (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
