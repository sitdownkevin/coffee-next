export function ItemTypeLabel({
  type,
  id,
}: {
  type: "coffee" | "juice" | "tea" | "dessert" | "salad" | "milk" | "snack";
  id: string;
}) {
  const labelMap = {
    coffee: "咖啡",
    juice: "果汁",
    tea: "茶",
    dessert: "甜品",
    salad: "沙拉",
    milk: "牛奶",
    snack: "小食",
  };

  return (
    <div id={id} className="scroll-mt-4">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 p-4 bg-gray-50">
        {labelMap[type]}
      </h3>
    </div>
  );
}
