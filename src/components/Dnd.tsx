import { compareId } from "../util/compareId";
import { isStringId } from "../util/isStringId";
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DraggableSyntheticListeners,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  UseSortableArguments,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "@radix-ui/react-slot";
import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;

  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function DndDragSlotItem(props: PropsWithChildren) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);
  return <Slot {...props} ref={ref} {...attributes} {...listeners} />;
}

interface SlotProps extends UseSortableArguments {
  children?: React.ReactNode;
  handle?: boolean;
  asChild?: boolean;
  notOverlay?: boolean;
  dragoverStyle?: CSSProperties;
}

export function DndDragSlot({
  children,
  notOverlay,
  handle,
  asChild,
  dragoverStyle,
  ...restProps
}: SlotProps) {
  const {
    setNodeRef,
    transition,
    setActivatorNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
  } = useSortable(restProps);

  const Comp = asChild ? Slot : "div";

  return (
    <SortableItemContext.Provider
      value={{ attributes, listeners, ref: setActivatorNodeRef }}
    >
      <Comp
        ref={setNodeRef}
        style={{
          width: "100%",
          opacity: !notOverlay && isDragging ? 0.6 : undefined,
          transform: CSS.Translate.toString(transform),
          transition,
          zIndex: notOverlay && isDragging ? 100 : undefined,
          cursor: handle ? undefined : "grab",
          ...(isDragging && dragoverStyle ? dragoverStyle : {}),
        }}
        {...attributes}
        {...(!handle ? listeners : undefined)}
      >
        {children}
      </Comp>
    </SortableItemContext.Provider>
  );
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export function DndSortableOverlay({ children }: PropsWithChildren) {
  return createPortal(
    <DragOverlay
      dropAnimation={dropAnimationConfig}
      style={{ WebkitBoxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.12)" }}
    >
      {children}
    </DragOverlay>,
    document.body,
  );
}

type BaseItem = { id: string | number };

interface DndDraggableListProps<T extends BaseItem> {
  items: T[];
  setItems: (
    items: T[],
    activeItem?: T,
    overIndex?: number,
    activeIndex?: number,
  ) => void;
  renderItem: (item: T, index: number) => ReactNode;
  handle?: boolean;
  children?: ReactNode;
  className?: string;
}

export function DndDraggableList<T extends BaseItem>({
  items,
  setItems,
  renderItem,
  handle = true,
  children,
  className,
}: DndDraggableListProps<T>) {
  const [active, setActive] = useState<Active | null>(null);

  const activeItemIndex = useMemo(
    () => items?.findIndex(compareId(active?.id)),
    [active, items],
  );

  const activeItem = useMemo(
    () => items?.[activeItemIndex],
    [activeItemIndex, items],
  );

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    keyboardSensor,
  );
  const id = useId();

  return (
    <DndContext
      id={id}
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(compareId(active.id));
          const overIndex = items.findIndex(compareId(over.id));
          setItems(
            arrayMove(items, activeIndex, overIndex),
            items[activeIndex],
            overIndex,
            activeIndex,
          );
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => {
            const renderItemNode = renderItem(item, index);

            if (!renderItemNode) return null;

            return (
              <DndDragSlot id={item.id} key={item.id} handle={handle}>
                {renderItemNode}
              </DndDragSlot>
            );
          })}
          {children}
        </div>
      </SortableContext>
      {activeItem && (
        <DndSortableOverlay>
          {renderItem(activeItem, activeItemIndex)}
        </DndSortableOverlay>
      )}
    </DndContext>
  );
}

export function GridItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-24 h-24 flex items-center justify-center border rounded-lg bg-blue-500 text-white cursor-grab active:cursor-grabbing"
    >
      {id}
    </div>
  );
}

export function DndGrid() {
  const [items, setItems] = useState(
    Array.from({ length: 9 }, (_, i) => `Item ${i + 1}`),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over === null) return;
    if (!(isStringId(over) && isStringId(active))) return;
    if (active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-3 gap-4 p-4">
          {items.map((id) => (
            <GridItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
