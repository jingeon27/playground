import {
  Active,
  DndContext,
  DragOverlay,
  DraggableSyntheticListeners,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
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

export function DndDragSlotItem (props: PropsWithChildren) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);
  return <Slot {...props} ref={ref} {...attributes} {...listeners} />;
};

interface SlotProps extends UseSortableArguments {
  children?: React.ReactNode;
  handle?: boolean;
  asChild?: boolean;
  notOverlay?: boolean;
  dragoverStyle?: CSSProperties;
}

export function DndDragSlot(props: SlotProps) {
  const { children, notOverlay, handle, asChild, dragoverStyle, ...restProps } =
    props;
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
          zIndex: notOverlay &&isDragging ? 100 : undefined,
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

export function DndSortableOverlay  ({ children }: PropsWithChildren) {
  return createPortal(
    <DragOverlay
      dropAnimation={dropAnimationConfig}
      style={{ WebkitBoxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.12)" }}
    >
      {children}
    </DragOverlay>,
    document.body,
  );
};

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
    () => items?.findIndex(({ id }) => id === active?.id),
    [active, items],
  );

  const activeItem = useMemo(()=>items?.[activeItemIndex],[activeItemIndex,items])

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
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);
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
