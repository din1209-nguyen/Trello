import { useState, useEffect, useCallback, useRef } from "react";
import { cloneDeep, isEmpty } from "lodash";
import Box from "@mui/material/Box";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
} from "@dnd-kit/core";
import { mapOrder } from "~/utils/sorts";
import { arrayMove } from "@dnd-kit/sortable";
import { pointerWithin } from "@dnd-kit/core";
import ListColumns from "./ListColumns/ListColumns";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { generatePlaceholderCard } from "~/utils/fomatters";

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

  const [activeDragItemId, setActiveDragItemId] = useState(null);
  // cùng 1 thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  // activeDragItemData dùng để hiển thị phần nào đang bị kéo để làm nền mờ
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  // oldColumnWhenDraggingCard dùng để lưu giá trị cũ trước khi kéo
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null);
  // điểm va chạm cuối cùng trước đó (xử lý thuật toán va chạm)
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  // tìm Column theo CardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) => column.cards.some((card) => card._id === cardId));
  };

  // cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (active, over, activeColumn, overColumn) => {
    setOrderedColumns((prevColumns) => {
      // tìm vị trí (index) của overCard trong Column đích (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === over.id);

      // logic tính toán cardIndex mới (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thủ viện
      const isBeLowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBeLowOverItem ? 1 : 0;

      const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

      // clone mảng OrderedColumn cũ ra một cái mới để xử ý data rồi return - cập nhật lại OrderedColumn mới
      const nextColumns = cloneDeep(prevColumns);

      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id);
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id);

      if (nextActiveColumn) {
        // xóa card ở Column active (cũng có thể hiểu là column cũ, khi kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== active.id);

        // thêm Placeholder Card nếu Column rỗng: bị kéo hết Card đi, không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards.push(generatePlaceholderCard(nextActiveColumn));
        }

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id);
      }

      if (nextOverColumn) {
        // kiểm tra card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        // nextOverColumn.cards = nextOverColumn.cards.filter(
        //   (card) => card._id !== active.id
        // );

        // thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, active.data.current);

        // xoá Placeholder Card nếu nó đang tồn tại (chuyển qua Column trống)
        if (nextOverColumn?.cards?.length === 2) {
          nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard);
        }

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id);
      }
      console.log("card cuoi cung", nextColumns);
      return nextColumns;
    });
  };

  // Trigger khi bắt đầu hành động kéo (drag) 1 phần tử
  const handleDragStart = (event) => {
    console.log(event?.active?.id);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    // nếu khi bắt đầu kéo card mới thực hiện hành động set giá trị
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
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

    // khi kéo trong Column sẽ không làm gì, chỉ xử lí lúc đang kéo
    if (!activeColumn || !overColumn) return;

    // nếu không tồn tại 1 trong 2 column thì kết thúc, tránh crash trang web
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(active, over, activeColumn, overColumn);
    }
  };

  // Trigger khi kết thúc hành động kéo 1 phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // cần đảm bảo nếu không tồn tại active over (khi kéo ra khỏi phạm vi container thì không làm gì tránh crash trang)
    if (!active || !over) return;

    // xử lí kéo thả Card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const activeColumn = findColumnByCardId(active.id);
      const overColumn = findColumnByCardId(over.id);

      // hành động kéo thả card giữa 2 column khác nhau
      if (!activeColumn || !overColumn) return;

      // phải dùng tới oldColumnWhenDraggingCard (set vào state từ bước handleDragStart) chứ không phải activeData trong scope hadleDragEnd vì sau khi đi qua onDragOver tới đây thì state của card đã bị cập nhật một lần rồi
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // mặc dù active over cùng 1 Column nhưng hàm chỉ chuyển đổi thứ tự của 2 Card
        // khi di chuyển Card qua Column khác, chỉ cập nhật lần đầu tiên khi được kéo qua, còn khi di chuyên trong Column sẽ không cập nên, nên phải có bước cập nhật lại
        moveCardBetweenDifferentColumns(active, over, activeColumn, overColumn);
      } else {
        // hành động kéo thả Card trong cùng Column

        // old index in orderedColumns
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((c) => c._id === activeDragItemId);
        // new index in orderedColumns
        const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === over.id);

        // dùng arrayMove vì kéo card trong 1 Column tương tự với logic kéo Column
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex);
        setOrderedColumns((prevColumns) => {
          // clone mảng OrderedColumn cũ ra một cái mới để xử ý data rồi return - cập nhật lại OrderedColumn mới
          const nextColumns = cloneDeep(prevColumns);

          // tìm tới Column mà chúng ta đang thả
          const targetColumn = nextColumns.find((column) => column._id === overColumn._id);

          // cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);

          // trả về state mới chuẩn vị trí
          return nextColumns;
        });
      }
    }

    // xử lí kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // nếu vị trí sau khi kéo khác với vị trí ban đâu
      if (active.id !== over.id) {
        // old index in orderedColumns
        const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id);
        // new index in orderedColumns
        const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id);
        //arrayMove dùng để sắp xếp mảng
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex);
        setOrderedColumns(dndOrderedColumns);
      }
    }
    // phải đưa về giá trị ban đầu
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  // Drop Animation
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  // Custom thuật toán phát hiện va chạm tối ưu cho việc kéo thả Card
  // args : các đối số trong Component
  // const collisionDetectionStrategy = useCallback(
  //   (args) => {
  //     if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
  //       return closestCorners({ ...args });
  //     }
  //     // tìm các điểm va nhau, giao nhau - intersection với con trỏ
  //     const pointerIntersections = pointerWithin(args);
  //     // fix triệt để bug flickering của thư viện Dnd-kit trong trường hợp sau:
  //     // kéo Card có image cover lớn và kéo ra phía khu vực kéo thả => không làm gì cả, return tránh xử lí bên dưới và tối ưu
  //     if (!pointerIntersections?.length) return;

  //     // tìm overId đầu tiên trong mảng intersections ở trên
  //     let overId = getFirstCollision(pointerIntersections, "id");

  //     if (overId) {
  //       // nếu Over nó là Column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm dựa vào thuật toán phát hiện va chạm closetCenter hoặc closetCorners đều được. Tuy nhiên dùng closetCorners sẽ mượt hơn
  //       const checkColumn = orderedColumns.find((column) => column._id === overId);

  //       if (checkColumn) {
  //         // console.log("overId before", overId);
  //         overId = closestCorners({
  //           ...args,
  //           droppableContainers: args.droppableContainers.filter((container) => {
  //             return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id);
  //           }),
  //         })[0]?.id;
  //         // console.log("overId after", overId);
  //       }

  //       lastOverId.current = overId;
  //       return [{ id: overId }];
  //     }
  //     // không có overId (nằm ngoài) thì sẽ lấy OverId cũ trước đó
  //     return lastOverId.current ? [{ id: lastOverId.current }] : [];
  //   },
  //   // HandleDragStart bắt đầu trước collisionDetectionStrategy, cho nên khi không có dependency thì ban đầu ACTIVE_DRAG_ITEM_TYPE sẽ NULL nên không hoạt động, nêu bắt buộc phải có dependency để cập nhật lại trạng thái của ACTIVE_DRAG_ITEM_TYPE là NULL (trước khi Start) - COLUMN (kéo Column) - CARD (kéo Card)
  //   [activeDragItemType, orderedColumns]
  // );
  const collisionDetectionStrategy = useCallback((args) => {
    // tìm các điểm va nhau, giao nhau - intersection với con trỏ
    const pointerIntersections = pointerWithin(args);
    // fix triệt để bug flickering của thư viện Dnd-kit trong trường hợp sau:
    //     // kéo Card có image cover lớn và kéo ra phía khu vực kéo thả => không làm gì cả, return tránh xử lí bên dưới và tối ưu
    if (!pointerIntersections?.length) return;
    return closestCorners({ ...args });
  }, []);

  return (
    /* Dnd Area */
    <DndContext
      // Cảm biến (tránh click vào sẽ kích hoạt)
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu không có thì card với cover lớn sẽ không kéo qua Column được vì lúc này nó đang bị confict giữa Card và Column), cho nên dùng closestCorners thay vì closetCenter
      // collisionDetection={closetCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "#34495e" : "#1976d2"),
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
