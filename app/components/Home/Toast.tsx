export default function Toast({
  toastMessage,
}: {
  toastMessage: string;
}) {
  return (
    <div className="fixed top-24 right-6 z-50 transform transition-all duration-500 ease-out animate-slide-in-right">
      <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-xl p-4 flex items-center space-x-3 max-w-sm">
        <div className="flex-1">
          <p className="text-gray-800 font-medium text-sm">{toastMessage}</p>
          <p className="text-gray-500 text-xs">商品已成功添加</p>
        </div>
      </div>
    </div>
  );
}
