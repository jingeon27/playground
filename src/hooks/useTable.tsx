import { ElementOf } from "../util/elementOf";
import { useSortableTable } from "./useSortableTable";
import DescIcon from "@/public/assets/icon/icon-state_down.svg";
import ClearIcon from "@/public/assets/icon/icon-state_none.svg";
import AscIcon from "@/public/assets/icon/icon-state_up.svg";
import clsx from "clsx";
import { ReactNode } from "react";

export type SortingStateType = "CLEAR" | "DESC" | "ASC";

const IconMap: Record<SortingStateType, ReactNode> = {
  ASC: <AscIcon />,
  DESC: <DescIcon />,
  CLEAR: <ClearIcon />,
};

const nextActionMap: Record<SortingStateType, SortingStateType> = {
  ASC: "CLEAR",
  CLEAR: "DESC",
  DESC: "ASC",
};

export interface SortingType<T> {
  key: string;
  state: SortingStateType;
  ascFn: (a: T, b: T) => number;
}
export interface ColumnType<T> {
  header?: string;
  sorting?: Omit<SortingType<T>, "state">;
  body: (_: { data: T }) => ReactNode;
  size: number;
}

interface UseTableOption<T extends Array<any>> {
  data: T;
  columns: ColumnType<ElementOf<T>>[];
  sortableItem?: Omit<ReturnType<typeof useSortableTable<T>>, "sortData">;
}

export function useTable<T extends Array<any>>({
  data,
  columns,
  sortableItem,
}: UseTableOption<T>) {
  // 컴포넌트 내부에서 제어하면 unControlledComponent이기에 외부에서 control 되지 않는다는 의미로 unControlled로 명명
  const unControlledSortItem = useSortableTable({ data });

  const { sortData, handleSortData, sortingItem, sortingItemChange } =
    sortableItem ? { sortData: data, ...sortableItem } : unControlledSortItem;

  return {
    tHeader: columns.map(({ header, sorting, size }, idx) => (
      <div
        key={idx}
        className={clsx("flex justify-between", sorting && "cursor-pointer")}
        style={{ width: size }}
        onClick={() => {
          if (sorting) {
            const state =
              sortingItem?.key === sorting.key ? sortingItem.state : "CLEAR";
            handleSortData(nextActionMap[state], sorting.ascFn);
            sortingItemChange({ ...sorting, state: nextActionMap[state] });
          }
        }}
      >
        {header}
        {sorting &&
          IconMap[
            sortingItem?.key === sorting.key ? sortingItem.state : "CLEAR"
          ]}
      </div>
    )),
    tBody: sortData.map((v, rootIndex) =>
      columns.map(({ body: Comp, size }, idx) => (
        <div
          key={`${idx}-${rootIndex}`}
          className="h-full"
          style={{ width: size }}
        >
          <Comp data={v} />
        </div>
      )),
    ),
  };
}
