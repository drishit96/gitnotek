import Editor from "rich-markdown-editor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FloatingActionIconButton from "src/Components/FloatingActionIconButton";
import { authService } from "src/services/auth.service";
import { noteService } from "src/services/note.service";
import TokenQueryDialog, {
  TokenQueryDialogProps,
} from "src/Components/TokenQueryDialog";
import { commonService } from "src/services/common.service";

function EditNote({
  setSnackbarMsg,
}: {
  setSnackbarMsg: (message: string) => void;
}) {
  const filePaths = useParams<{ 0: string }>();
  const [folderName, setFolderName] = useState("");
  const [title, setTitle] = useState("untitled");
  const [prevContent, setPrevContent] = useState("");
  const [content, setContent] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [token, setToken] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const askForRepositoryUrl = false;
  const onSuccess = () => {
    saveNote(folderName, title, content);
  };

  const tokenQueryOptions: TokenQueryDialogProps = {
    dialogOpen,
    setDialogOpen,
    token,
    setToken,
    askForRepositoryUrl,
    repositoryUrl,
    setRepositoryUrl,
    onSuccess,
  };

  async function saveNote(folderName: string, title: string, content: string) {
    setSnackbarMsg("Saving note...");
    await noteService.saveNote(folderName, title, content);
    setSnackbarMsg("Note saved successfully");
    window.history.go(-1);
  }

  useEffect(() => {
    (async () => {
      try {
        const remote = await noteService.getRemote();
        setRepositoryUrl(remote ?? "");
      } catch (error) {}
    })();

    if (filePaths[0]) {
      const filePath = filePaths[0];
      let [path, folderPath, fileName] =
        filePath.match(new RegExp("^(.*/)([^/]*)$")) ?? [];

      fileName = fileName ?? filePaths[0].replace(".md", "");
      path = path ?? filePaths[0].replace(".md", "");

      setTitle(fileName?.replace(".md", "") ?? "untitled");
      setFolderName(folderPath ?? "");

      (async () => {
        const note = await noteService.getNoteContent(path.replace(".md", ""));
        setPrevContent(note);
        setContent(note);
      })();
    }
  }, [filePaths]);
  return (
    <>
      <div className="bg-bgColor">
        <div className="p-4">
          <label>
            <b className="text-textColorPrimary">Title</b>
            <input
              className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-textColorPrimary bg-bgColor placeholder-gray-500 border border-focusColor rounded-md py-2 pl-2"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <br />
          <br />
          <b className="text-textColorPrimary">Content</b>
          <Editor
            className="border-solid border-2 border-focusColor rounded-lg"
            value={prevContent}
            dark={commonService.isDarkThemeEnabled()}
            onChange={(value) => {
              setContent(value());
            }}
            uploadImage={async (file) => {
              setSnackbarMsg("Upload image isnt't supported yet");
              return "";
            }}
            onShowToast={(message) => setSnackbarMsg(message)}
          />

          <FloatingActionIconButton
            onClickFn={() => {
              if (repositoryUrl && !authService.isAuthenticated()) {
                setDialogOpen(true);
              } else {
                saveNote(folderName, title, content);
              }
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

          <TokenQueryDialog {...tokenQueryOptions} />
        </div>
      </div>
    </>
  );
}

export default EditNote;
