import {
  applyDiscounts,
  buyOneGetOneFree,
  Discount,
  fixedDiscount,
  percentageDiscount,
} from "../util/discount";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  count: number;
};

const products: Product[] = [
  { id: 1, name: "노트북", price: 1500000, count: 1 },
  { id: 2, name: "키보드", price: 200000, count: 2 },
];

const discountOptions = [
  { label: "10% 할인", value: percentageDiscount(10) },
  { label: "50,000원 할인", value: fixedDiscount(50000) },
  { label: "1+1 할인", value: buyOneGetOneFree(2) },
] as const;

export default function Cart() {
  const [selectedDiscounts, setSelectedDiscounts] = useState<{
    [key: number]: Discount[];
  }>({});

  const toggleDiscount = (productId: number, discount: Discount) => {
    setSelectedDiscounts((prev) => {
      const discounts = prev[productId] || [];
      const newDiscounts = discounts.includes(discount)
        ? discounts.filter((d) => d !== discount)
        : [...discounts, discount];
      return { ...prev, [productId]: newDiscounts };
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">🛒 장바구니</h2>
      {products.map((product) => {
        const finalPrice = applyDiscounts(selectedDiscounts[product.id] || [])(
          product.price,
        );
        return (
          <div key={product.id} className="mb-4 p-3 border rounded-md">
            <h3 className="font-semibold">{product.name}</h3>
            <p>기본 가격: {product.price.toLocaleString()}원</p>
            <p>최종 가격: {finalPrice.toLocaleString()}원</p>

            <div className="mt-2">
              <p className="text-sm font-semibold">할인 적용:</p>
              {discountOptions.map(({ label, value }) => (
                <label key={label} className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={selectedDiscounts[product.id]?.includes(value)}
                    onChange={() => toggleDiscount(product.id, value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
