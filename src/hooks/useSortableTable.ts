import { ElementOf } from "../util/elementOf";
import { SortingStateType, SortingType } from "./useTable";
import { useEffect, useState } from "react";

export const useSortableTable = <T extends Array<any>>({
  data,
  initialSortingItem = null,
}: {
  data: T;
  initialSortingItem?: SortingType<ElementOf<T>> | null;
}) => {
  const [sortingItem, setSortingItem] = useState(initialSortingItem);

  const replicaData = [...data] as T;
  const [sortData, setSortData] = useState(replicaData);

  const dataSortToState =
    (state: SortingStateType, ascFn = sortingItem?.ascFn) =>
    (curData: T = replicaData) =>
      ascFn
        ? {
            ASC: curData.sort((a, b) => ascFn(a, b)),
            DESC: curData.sort((a, b) => ascFn(b, a)),
            CLEAR: replicaData,
          }[state]
        : curData;

  const handleSortData = (...args: Parameters<typeof dataSortToState>) =>
    setSortData(dataSortToState(...args));

  const sortingItemChange = (v: SortingType<ElementOf<T>>) => setSortingItem(v);

  useEffect(() => {
    setSortData(dataSortToState(sortingItem?.state ?? "CLEAR")(replicaData));
  }, [data]);

  return { handleSortData, sortData, sortingItemChange, sortingItem };
};
