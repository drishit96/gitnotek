import { Link } from "react-router-dom";

export interface Note {
  id: string;
  isFile: boolean;
  content: string;
  currentDirectory?: string;
}

const NoteListItem = ({ id, isFile, content, currentDirectory }: Note) => {
  return (
    <>
      <Link
        className="w-full"
        to={
          isFile
            ? `/notes/${currentDirectory ? `${currentDirectory}/` : ""}${id}`
            : `/workspace/${
                currentDirectory ? `${currentDirectory}/` : ""
              }${id}`
        }
      >
        <div className="flex  p-4">
          {isFile ? (
            <svg
              className="mx-2"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#E5F2E5"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9l-7-7z" />
              <path d="M13 3v6h6" />
            </svg>
          ) : (
            <svg
              className="mx-2"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#FFFFCC"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
          <p className="text-textColorPrimary">{content}</p>
        </div>
      </Link>
    </>
  );
};

export default NoteListItem;
