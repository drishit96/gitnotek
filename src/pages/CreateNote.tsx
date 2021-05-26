import EasyMDE from "easymde";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FloatingActionIconButton from "src/Components/FloatingActionIconButton";
import { authService } from "src/services/auth.service";
import { noteService } from "src/services/note.service";
import TokenQueryDialog, {
  TokenQueryDialogProps,
} from "src/Components/TokenQueryDialog";
import hljs from "highlight.js";

function CreateNote({
  setSnackbarMsg,
}: {
  setSnackbarMsg: (message: string) => void;
}) {
  const filePath = useParams<{ 0: string }>()[0];
  const [editor, setEditor] = useState<EasyMDE>();
  const [folderPath, setFolderPath] = useState("");
  const [title, setTitle] = useState("untitled");
  const nodeEditorRef = useRef<HTMLTextAreaElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [token, setToken] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const askForRepositoryUrl = false;
  const onSuccess = () => {
    saveNote(folderPath, title, editor!);
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

  async function saveNote(folderPath: string, title: string, editor: EasyMDE) {
    setSnackbarMsg("Saving note...");
    await noteService.saveNote(folderPath, title, editor.value());
    setSnackbarMsg("Note saved successfully");
    window.history.go(-1);
  }

  useEffect(() => {
    noteService.getRemote().then((remote) => {
      setRepositoryUrl(remote ?? "");
    });

    if (!editor) {
      setTitle("untitled");
      setFolderPath(filePath);

      const noteEditor = nodeEditorRef.current;
      setEditor(
        new EasyMDE({
          element: noteEditor!,
          spellChecker: false,
          previewClass: ["prose", "editor-bg"],
          sideBySideFullscreen: false,
          renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
            hljs: hljs,
            // sanitizerFunction: function (renderedHTML) {
            //   return DOMPurify.sanitize(renderedHTML, { ALLOWED_TAGS: ["b"] });
            // },
          },
          shortcuts: {
            drawTable: "Cmd-Alt-T",
          },
          showIcons: ["code", "table"],
        })
      );
    } else {
      editor.value("");
      if (!editor.isSideBySideActive()) {
        EasyMDE.toggleSideBySide(editor!);
      }
    }
  }, [editor, filePath]);
  return (
    <>
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
        <textarea className="bg-bgColor" ref={nodeEditorRef}></textarea>

        <FloatingActionIconButton
          onClickFn={() => {
            if (repositoryUrl && !authService.isAuthenticated()) {
              setDialogOpen(true);
            } else {
              saveNote(folderPath, title, editor!);
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
    </>
  );
}

export default CreateNote;
