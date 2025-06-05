import type { Item } from "~/types/item";
import type { ItemInCart } from "~/types/item";
import ItemList from "~/components/ItemList";
import ItemDetail from "~/components/ItemDetail";

export default function Main({
  items,
  itemSelected,
  handleSelect,
  handleAddToCart,
  isMobileDetailOpen,
  handleCloseMobileDetail,
}: {
  items: Item[];
  itemSelected: Item | null;
  handleSelect: (item: Item) => void;
  handleAddToCart: (itemInCart: ItemInCart) => void;
  isMobileDetailOpen: boolean;
  handleCloseMobileDetail: () => void;
}) {
  return (
    <main className="flex-1 flex overflow-hidden relative">
      {/* 桌面端：两列布局 */}
      <div className="hidden md:flex w-full">
        {/* 左列：商品列表 */}
        <div className="w-1/2 min-w-[320px] max-w-[500px]">
          <ItemList
            items={items}
            itemSelected={itemSelected || null}
            handleSelect={handleSelect}
          />
        </div>

        {/* 右列：商品详情 */}
        <div className="flex-1 min-w-[400px]">
          <ItemDetail item={itemSelected} addItemToCart={handleAddToCart} />
        </div>
      </div>

      {/* 移动端：单列布局 */}
      <div className="md:hidden flex flex-col w-full h-full relative">
        {/* 主界面：商品列表 */}
        <div
          className={`flex-1 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isMobileDetailOpen ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <ItemList
            items={items}
            itemSelected={itemSelected || null}
            handleSelect={handleSelect}
          />
        </div>

        {/* 商品详情页面 */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-white z-30 transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileDetailOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* 详情页面头部 */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-3 shadow-sm flex-shrink-0">
            <button
              onClick={handleCloseMobileDetail}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <span className="text-xl text-gray-600">←</span>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">商品详情</h2>
          </div>

          {/* 详情内容 */}
          <div className="flex-1 overflow-y-auto">
            <ItemDetail
              item={itemSelected}
              addItemToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
