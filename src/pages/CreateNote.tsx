import Editor from "rich-markdown-editor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FloatingActionIconButton from "src/Components/FloatingActionIconButton";
import { noteService } from "src/services/note.service";
import { commonService } from "src/services/common.service";

function CreateNote({
  setShowBackButton,
  setSnackbarMsg,
}: {
  setShowBackButton: (showBackButton: boolean) => void;
  setSnackbarMsg: (message: string) => void;
}) {
  const filePath = useParams<{ 0: string }>()[0];
  const [folderPath, setFolderPath] = useState("");
  const [title, setTitle] = useState("untitled");
  const [content, setContent] = useState("");

  async function saveNote(
    folderPath: string,
    title: string,
    content: string,
    askedForPassword = false
  ) {
    setSnackbarMsg("Saving note...");
    await noteService.saveNote(folderPath, title, content);
    setSnackbarMsg("Note saved successfully");
    window.history.go(askedForPassword ? -2 : -1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 83) {
      event.preventDefault();
      saveNote(folderPath, title, content);
    }
  }

  useEffect(() => {
    setTitle("untitled");
    setFolderPath(filePath);
    setContent("");
  }, [filePath]);

  useEffect(() => {
    setShowBackButton(true);
  }, [setShowBackButton]);

  return (
    <>
      <div className="p-4" onKeyDown={handleKeyDown}>
        <label>
          <b className="text-textColorPrimary">Title</b>
          <input
            className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-textColorPrimary bg-bgColor placeholder-gray-500 border border-focusColor rounded-md py-2 pl-2"
            type="text"
            data-id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <br />
        <b className="text-textColorPrimary">Content</b>
        <Editor
          className="border-solid border-2 border-focusColor rounded-lg"
          defaultValue=""
          dark={commonService.isDarkThemeEnabled()}
          onChange={(value) => {
            setContent(value());
          }}
          // uploadImage={async (file) => {
          //   console.log(file);
          //   const reader = new FileReader();
          //   reader.readAsArrayBuffer(file);
          //   reader.onloadstart = function () {
          //     setSnackbarMsg("Uploading image...");
          //   };
          //   reader.onloadend = async function () {
          //     if (reader.result) {
          //       await noteService.saveImage(file.name, reader.result);
          //       // await noteService.fetchImageUrl(file.name);
          //       setSnackbarMsg("Image uploaded successfully");
          //     }
          //   };
          //   return "";
          // }}
          onShowToast={(message) => setSnackbarMsg(message)}
        />

        <FloatingActionIconButton
          id="btn-saveNote"
          onClickFn={() => {
            saveNote(folderPath, title, content);
          }}
          text="Save note"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </FloatingActionIconButton>
      </div>
    </>
  );
}

export default CreateNote;
