type Bookmark = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  createdAt: string;
};

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  return (
    <div
      className="border rounded-lg p-4 flex gap-4
  bg-white shadow-sm"
    >
      {bookmark.thumbnail && (
        <img
          src={bookmark.thumbnail}
          alt={bookmark.title ?? ""}
          className="w-24 h-24 object-cover rounded"
        />
      )}
      <div className="flex flex-col gap-1">
        <a
          href={bookmark.url}
          target="_blank"
          className="font-semibold text-blue-600
  hover:underline"
        >
          {bookmark.title ?? bookmark.url}
        </a>
        {bookmark.description && (
          <p
            className="text-sm text-gray-500
  line-clamp-2"
          >
            {bookmark.description}
          </p>
        )}
        <span
          className="text-xs
  text-gray-400"
        >
          {bookmark.url}
        </span>
      </div>
    </div>
  );
}
