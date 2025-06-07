export function ModeToggle({
  interactionMode,
  setInteractionMode,
}: {
  interactionMode: "chat" | "text";
  setInteractionMode: (interactionMode: "chat" | "text") => void;
}) {
  return (
    <div className="flex justify-end p-2 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center bg-gray-200 rounded-full p-1">
        <button
          onClick={() => setInteractionMode("chat")}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1 ${
            interactionMode === "chat"
              ? "bg-white text-blue-600 shadow"
              : "bg-transparent text-gray-500 hover:bg-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
            <path
              fillRule="evenodd"
              d="M10 18a7 7 0 007-7h-2a5 5 0 01-5 5v2zM3 11a7 7 0 007 7v-2a5 5 0 01-5-5H3z"
              clipRule="evenodd"
            />
            <path d="M10 18a7 7 0 007-7h-2a5 5 0 01-5 5v2zM3 11a7 7 0 007 7v-2a5 5 0 01-5-5H3z" />
          </svg>
          语音
        </button>
        <button
          onClick={() => setInteractionMode("text")}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1 ${
            interactionMode === "text"
              ? "bg-white text-blue-600 shadow"
              : "bg-transparent text-gray-500 hover:bg-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm0 2h12v8H4V7z"
              clipRule="evenodd"
            />
            <path d="M6 9h8v2H6V9z" />
          </svg>
          文本
        </button>
      </div>
    </div>
  );
}
