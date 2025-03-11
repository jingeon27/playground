import { useSortableTable } from "@/src/hooks/useSortableTable";
import { SortingType } from "@/src/hooks/useTable";
import { renderHook } from "@testing-library/react";

type User = {
  id: number;
  name: string;
  age: number;
};

describe("`useSortableTable`", () => {
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
    ascFn: (a: User, b: User) => a.name.localeCompare(b.name),
    state: "ASC",
  };

  renderHook(() =>
    useSortableTable({
      data: mockUsers,
    }),
  );
});
