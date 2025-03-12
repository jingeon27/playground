import { useSortableArrayObject } from "@/src/hooks/useSortableArrayObject";
import { SortingType } from "@/src/hooks/useTable";
import { act, renderHook } from "@testing-library/react";

type User = {
  id: number;
  name: string;
  age: number;
};

describe("useSortableArrayObject", () => {
  const mockUsers: User[] = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 22 },
    { id: 4, name: "David", age: 28 },
    { id: 5, name: "Eve", age: 26 },
  ];

  const sortingByAge: SortingType<User> = {
    key: "age",
    ascFn: (a, b) => a.age - b.age,
    state: "ASC",
  };

  const sortingByName: SortingType<User> = {
    key: "name",
    ascFn: (a, b) => a.name.localeCompare(b.name),
    state: "ASC",
  };

  it("초기 데이터가 그대로 유지되어야 한다.", () => {
    const { result } = renderHook(() =>
      useSortableArrayObject({ data: mockUsers }),
    );

    expect(result.current.sortData).toEqual(mockUsers);
    expect(result.current.sortingItem).toBeNull();
  });

  it("나이 순 정렬이 오름차순이어야 한다.", () => {
    const { result } = renderHook(() =>
      useSortableArrayObject({ data: mockUsers }),
    );

    act(() => {
      result.current.sortingItemChange(sortingByAge);
    });
    act(() => {
      result.current.handleSortData("ASC");
    });
    console.log(result.current.sortingItem, result.current.sortData);
    expect(result.current.sortData).toEqual([
      { id: 3, name: "Charlie", age: 22 },
      { id: 1, name: "Alice", age: 25 },
      { id: 5, name: "Eve", age: 26 },
      { id: 4, name: "David", age: 28 },
      { id: 2, name: "Bob", age: 30 },
    ]);
  });

  it("이름 순 정렬이 오름차순이어야 한다.", () => {
    const { result } = renderHook(() =>
      useSortableArrayObject({ data: mockUsers }),
    );

    act(() => {
      result.current.sortingItemChange(sortingByName);
    });

    act(() => {
      result.current.handleSortData("ASC");
    });
    console.log(result.current.sortData, "name");

    expect(result.current.sortData).toEqual([
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
      { id: 3, name: "Charlie", age: 22 },
      { id: 4, name: "David", age: 28 },
      { id: 5, name: "Eve", age: 26 },
    ]);
  });

  it("정렬을 초기화할 때 원래 순서로 돌아가야 한다.", () => {
    const { result } = renderHook(() =>
      useSortableArrayObject({ data: mockUsers }),
    );

    act(() => {
      result.current.sortingItemChange(sortingByAge);
    });

    act(() => {
      result.current.handleSortData("ASC");
    });

    act(() => {
      result.current.handleSortData("CLEAR");
    });

    expect(result.current.sortingItem?.state).toEqual("CLEAR");
    expect(result.current.sortData).toEqual(mockUsers);
  });

  it("정렬 방향이 변경되어야 한다.", () => {
    const { result } = renderHook(() =>
      useSortableArrayObject({ data: mockUsers }),
    );

    act(() => {
      result.current.sortingItemChange(sortingByAge);
    });
    act(() => {
      result.current.handleSortData("DESC");
    });

    expect(result.current.sortData).toEqual([
      { id: 2, name: "Bob", age: 30 },
      { id: 4, name: "David", age: 28 },
      { id: 5, name: "Eve", age: 26 },
      { id: 1, name: "Alice", age: 25 },
      { id: 3, name: "Charlie", age: 22 },
    ]);
  });
});
