import { useState } from "react";
import GenericDialog from "src/Components/GenericDialog";
import { authService } from "src/services/auth.service";
import { noteService } from "src/services/note.service";

export interface TokenQueryDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  isTokenRequired: boolean;
  setIsTokenRequired: (token: boolean) => void;
  askForRepositoryUrl: boolean;
  repositoryUrl: string;
  setRepositoryUrl: (url: string) => void;
  branchName?: string;
  setBranchName?: (name: string) => void;
  userName?: string;
  setUserName?: (name: string) => void;
  onSuccess: () => void;
}

export default function TokenQueryDialog({
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
  onSuccess,
}: TokenQueryDialogProps) {
  const [isUrlValid, setIsUrlValid] = useState(!!repositoryUrl);
  return (
    <GenericDialog
      isOpen={dialogOpen}
      setOpen={setDialogOpen}
      title="Connect to your git hosting service"
      message="To save your notes to your preferred git hosting service, please enter the personal access token using which the app can authenticate itself"
      validateFn={() => {
        return (
          (!askForRepositoryUrl || (isUrlValid && !!userName)) &&
          (!isTokenRequired || !!token)
        );
      }}
      primaryActionFn={async () => {
        authService.setActko(token);
        await noteService.setRemote(repositoryUrl);
        onSuccess();
      }}
      isSubmitFormDialog={true}
    >
      <div className="flex flex-col mt-4 mb-3">
        {askForRepositoryUrl ? (
          <>
            <label>
              <p className="text-textColorPrimary">Repository URL</p>
              <input
                className="focus:border-gray-400 focus:ring-1 focus:ring-gray-300 focus:outline-none w-full text-sm text-textColorPrimary bg-bgColor placeholder-gray-500 border border-gray-300 rounded-md py-2 pl-2"
                type="url"
                id="repositoryUrl"
                value={repositoryUrl}
                onChange={(e) => {
                  setRepositoryUrl(e.target.value);
                  setIsUrlValid(e.target.validity.valid);
                }}
              />
            </label>
            <br />

            <label>
              <p className="text-textColorPrimary">Branch</p>
              <input
                className="focus:border-gray-400 focus:ring-1 focus:ring-gray-300 focus:outline-none w-full text-sm text-textColorPrimary bg-bgColor placeholder-gray-500 border border-gray-300 rounded-md py-2 pl-2"
                type="text"
                id="branchName"
                value={branchName}
                onChange={(e) => {
                  setBranchName && setBranchName(e.target.value);
                }}
              />
            </label>
            <br />

            <label>
              <p className="text-textColorPrimary">Username</p>
              <input
                className="focus:border-gray-400 focus:ring-1 focus:ring-gray-300 focus:outline-none w-full text-sm text-textColorPrimary bg-bgColor placeholder-gray-500 border border-gray-300 rounded-md py-2 pl-2"
                type="text"
                id="username"
                value={userName}
                onChange={(e) => {
                  setUserName && setUserName(e.target.value);
                }}
              />
            </label>
            <br />
          </>
        ) : null}

        <label>
          <p className="text-textColorPrimary">Personal access token</p>
          <input
            className="focus:border-gray-400 focus:ring-1 focus:ring-gray-300 focus:outline-none w-full text-sm text-textColorPrimary bg-bgColor placeholder-gray-500 border border-gray-300 rounded-md py-2 pl-2 disabled:opacity-50"
            type="password"
            id="token"
            disabled={!isTokenRequired}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </label>

        <span className="mt-3">
          <input
            id="tokenNotRequiredCheckbox"
            type="checkbox"
            checked={!isTokenRequired}
            onChange={(_event: { target: any }) => {
              setIsTokenRequired(!isTokenRequired);
            }}
          />
          <label
            htmlFor="tokenNotRequiredCheckbox"
            className="ml-1 text-sm text-textColorPrimary"
          >
            Token not required as it is a public repository
          </label>
        </span>
      </div>
    </GenericDialog>
  );
}
