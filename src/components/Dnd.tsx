import { Active, DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
    SortableContext,
    UseSortableArguments,
    rectSortingStrategy,
    sortableKeyboardCoordinates,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "@radix-ui/react-slot";
import React, { CSSProperties, PropsWithChildren, ReactNode, createContext, useContext, useId, useMemo, useState } from "react";

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

export const DndDragSlotItem = (props: PropsWithChildren) => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);
  return <Slot {...props} ref={ref} {...attributes} {...listeners} />;
};

interface Props extends UseSortableArguments {
  children?: React.ReactNode;
  handle?: boolean;
  asChild?: boolean;
  notOverlay?: boolean;
  dragoverStyle?: CSSProperties; 
}


export const DndDragSlot = (props: Props) => {
  const { children, notOverlay, handle, asChild, dragoverStyle, ...restProps } = props;
  const { setNodeRef, transition, setActivatorNodeRef, attributes, listeners, isDragging, transform } =
    useSortable(restProps);

  const Comp = asChild ? Slot : "div";

  return (
    <SortableItemContext.Provider value={{ attributes, listeners, ref: setActivatorNodeRef }}>
      <Comp
        ref={setNodeRef}
        style={{
          width: "100%",
          opacity: notOverlay ? undefined : isDragging ? 0.6 : undefined,
          transform: CSS.Translate.toString(transform),
          transition,
          zIndex: notOverlay ? (isDragging ? 100 : undefined) : undefined,
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
};

type BaseItem = { id: string | number };

interface DndDraggableListProps<T extends BaseItem>{
  items: T[];
  setItems: (items: T[], activeItem?: T, overIndex?: number, activeIndex?: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  handle?: boolean;
  children?:ReactNode;
  className?: string;
}

export function DndDraggableList<T extends BaseItem>({
  items,
  setItems,
  renderItem,
  handle = true,
  children,
  className,
}:DndDraggableListProps<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(() => items?.find((item) => item.id === active?.id), [active, items]);
  const activeItemIndex = useMemo(() => items?.findIndex(({ id }) => id === active?.id), [active, items]);

  const keyboardSensor = useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates });
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
      }}
      onDragCancel={() => {

      }}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div
          className={className}
        >
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
    </DndContext>
  );
};
