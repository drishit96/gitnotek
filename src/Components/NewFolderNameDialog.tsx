import GenericDialog from "src/Components/GenericDialog";

export interface NewFolderNameDialogProps {
  folderNameDialogOpen: boolean;
  setFolderNameDialogOpen: (open: boolean) => void;
  folderName: string;
  setFolderName: (folderName: string) => void;
  onNameSetSuccess: () => void;
}

export default function NewFolderNameDialog({
  folderNameDialogOpen,
  setFolderNameDialogOpen,
  folderName,
  setFolderName,
  onNameSetSuccess,
}: NewFolderNameDialogProps) {
  return (
    <GenericDialog
      isOpen={folderNameDialogOpen}
      setOpen={setFolderNameDialogOpen}
      title="Enter new folder name"
      message=""
      showActions={true}
      validateFn={() => {
        return true;
      }}
      primaryActionFn={async () => {
        onNameSetSuccess();
      }}
    >
      <div className="flex flex-col mt-4 mb-3">
        <label>
          <input
            className="focus:border-gray-400 focus:ring-1 focus:ring-gray-300 focus:outline-none w-full text-sm text-textColorPrimary bg-bgColor placeholder-gray-500 border border-gray-300 rounded-md py-2 pl-2"
            type="text"
            id="folderName"
            data-id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </label>
      </div>
    </GenericDialog>
  );
}
