import React, { useEffect, useState } from "react";
import FloatingActionIconButton from "../Components/FloatingActionIconButton";
import { authService } from "../services/auth.service";
import Notes from "../Components/NotesList";
import { Link, useParams } from "react-router-dom";
import Chip from "src/Components/Chip";
import SecondaryIconButton from "../Components/SecondaryIconButton";
import { noteService } from "src/services/note.service";
import TokenQueryDialog, {
  TokenQueryDialogProps,
} from "src/Components/TokenQueryDialog";
import SelectionModeIcon from "src/Icons/SelectionMode";
import DeleteIcon from "src/Icons/Delete";
import NewFolderIcon from "src/Icons/NewFolder";
import NewFolderNameDialog, {
  NewFolderNameDialogProps,
} from "src/Components/NewFolderNameDialog";
import ImportIcon from "src/Icons/Import";
import Breadcrumb from "src/Components/Breadcrumb";

export interface Checkboxes {
  [key: string]: { isFile: boolean; isChecked: boolean };
}

async function setRemote(
  setSyncStatus: React.Dispatch<React.SetStateAction<string>>
) {
  setSyncStatus("Syncing...");
  if (await noteService.commitAndPush("Initial commit")) {
    setSyncStatus("Synced");
  } else {
    setSyncStatus("Not synced");
  }
}

function NotesView({
  setShowBackButton,
  setSnackbarMsg,
}: {
  setShowBackButton: (showBackButton: boolean) => void;
  setSnackbarMsg: (message: string) => void;
}) {
  const path = useParams<{ 0: string }>()[0];
  const [syncStatus, setSyncStatus] = useState("Not synced");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [token, setToken] = useState("");
  const [isTokenRequired, setIsTokenRequired] = useState(true);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [branchName, setBranchName] = useState("main");
  const [userName, setUserName] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [checkboxes, setCheckboxes] = useState<Checkboxes>({});
  let [refreshCount, setRefreshCount] = useState(0);
  const [folderName, setFolderName] = useState("");
  const [folderNameDialogOpen, setFolderNameDialogOpen] = useState(false);
  const [tokenQueryContext, setTokenQueryContext] = useState("SYNC");
  const askForRepositoryUrl = true;

  const onNameSetSuccess = async () => {
    try {
      await noteService.createFolder(path, folderName);
      setRefreshCount(refreshCount + 1);
    } catch (error) {
      if (error.message === "INVALID") {
        console.log("Folder name cannot be empty");
      } else if (error.message === "EEXIST") {
        console.log("Folder already exists");
      } else if (error.message === "ENOENT") {
        console.log("Folder could not be created");
      }
    }
  };

  const tokenQueryOptions: TokenQueryDialogProps = {
    dialogOpen,
    setDialogOpen,
    token,
    setToken,
    isTokenRequired,
    setIsTokenRequired,
    askForRepositoryUrl,
    repositoryUrl,
    setRepositoryUrl,
    branchName,
    setBranchName,
    userName,
    setUserName,
    onSuccess: () => {
      try {
        if (tokenQueryContext === "SYNC") {
          setRemote(setSyncStatus);
        } else if (tokenQueryContext === "IMPORT") {
          setSyncStatus("Syncing...");
          noteService
            .cloneRepository(
              repositoryUrl,
              userName,
              branchName,
              isTokenRequired
            )
            .then(() => setSyncStatus("Synced"))
            .then(() => setRefreshCount(refreshCount + 1));
        } else {
          throw new Error("Invalid context for token query");
        }
      } catch (error) {
        console.log(error);
      }
    },
  };

  const newFolderNameDialogOptions: NewFolderNameDialogProps = {
    folderNameDialogOpen,
    setFolderNameDialogOpen,
    folderName,
    setFolderName,
    onNameSetSuccess,
  };

  useEffect(() => {
    setShowBackButton(!!path);
  }, [setShowBackButton, path]);

  useEffect(() => {
    noteService.isRemoteSet().then((isRemoteSet) => {
      setSyncStatus(isRemoteSet ? "Synced" : "Not synced");

      //Pull latest changes if last pull was taken more than 5 minutes ago
      if (
        window.navigator.onLine &&
        isRemoteSet &&
        noteService.getLastSync() < Date.now() - 300000
      ) {
        setSyncStatus("Syncing...");
        setSnackbarMsg("Syncing notes, please wait...");
        noteService
          .syncNotesWithRemote()
          .then(() => {
            noteService.setLastSync(Date.now());
            setSyncStatus("Synced");
            setSnackbarMsg("Notes synced successfully");
            setRefreshCount((refreshCount) => refreshCount + 1);
          })
          .catch(() => {
            setSyncStatus("Not synced");
            setSnackbarMsg("Sync failed. Please clear app data and try again");
          });
      }
    });
  }, [setSnackbarMsg]);

  async function deleteNotes(checkboxes: Checkboxes, path: string) {
    let filesToDelete = [];
    for (let key in checkboxes) {
      if (checkboxes[key].isChecked) {
        filesToDelete.push({ isFile: checkboxes[key].isFile, name: key });
      }
    }
    if (filesToDelete.length > 0) setSnackbarMsg("Deleting notes...");
    const deletedCount = await noteService.deleteNotes(filesToDelete, path);
    if (deletedCount > 0) setSnackbarMsg("Deleted notes successfully");
    setRefreshCount(refreshCount + 1);
  }

  return (
    <main className="p-4">
      <h1 className="pt-2 text-2xl text-center text-textColorPrimary">
        Your Notes
      </h1>
      <br />
      <div className="flex m-auto max-w-screen-lg">
        <SecondaryIconButton
          id="btn-selectionMode"
          text={selectionMode ? "Exit selection mode" : "Enter selection mode"}
          onClickFn={() => {
            setSelectionMode(!selectionMode);
          }}
        >
          <SelectionModeIcon />
        </SecondaryIconButton>

        {selectionMode ? (
          <SecondaryIconButton
            id="btn-delete"
            text="Delete"
            onClickFn={() => deleteNotes(checkboxes, path)}
          >
            <DeleteIcon />
          </SecondaryIconButton>
        ) : null}

        <SecondaryIconButton
          id="btn-newFolder"
          text="New folder"
          onClickFn={() => setFolderNameDialogOpen(true)}
        >
          <NewFolderIcon />
        </SecondaryIconButton>

        <SecondaryIconButton
          id="btn-importNotes"
          text="Import notes"
          onClickFn={() => {
            setTokenQueryContext("IMPORT");
            setDialogOpen(true);
          }}
        >
          <ImportIcon />
        </SecondaryIconButton>

        <div className="flex m-1 ml-auto">
          <Chip
            text={syncStatus}
            color={syncStatus === "Synced" ? "green" : "red"}
            onClickFn={() => {
              if (syncStatus !== "Synced") {
                if (!authService.isAuthenticated()) {
                  setTokenQueryContext("SYNC");
                  setDialogOpen(true);
                } else {
                  setRemote(setSyncStatus);
                }
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={syncStatus === "Synced" ? "#008000" : "#B91C1C"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </Chip>
        </div>
      </div>

      <br />

      <div className="flex flex-col m-auto max-w-screen-lg min-h-screen">
        <Breadcrumb path={path} />
        <Notes
          selectionMode={selectionMode}
          directory={path}
          checkboxes={checkboxes}
          setCheckboxes={setCheckboxes}
          refreshCount={refreshCount}
        />
      </div>

      <Link data-id="btn-createNote" to={`/create-note/${path}`}>
        <FloatingActionIconButton id="btn-createNote-inner" text="Create note">
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </FloatingActionIconButton>
      </Link>
      <TokenQueryDialog {...tokenQueryOptions} />
      <NewFolderNameDialog {...newFolderNameDialogOptions} />
    </main>
  );
}

export default NotesView;
