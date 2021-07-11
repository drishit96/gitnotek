import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

export interface GenericDialogProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  message: string;
  primaryActionText?: string;
  cancelActionText?: string;
  validateFn: () => boolean;
  primaryActionFn: () => void;
  isSubmitFormDialog?: boolean;
  children?: any;
}

export default function GenericDialog({
  isOpen,
  setOpen,
  title,
  message,
  primaryActionText = "OK",
  cancelActionText = "Cancel",
  validateFn,
  primaryActionFn,
  isSubmitFormDialog = false,
  children,
}: GenericDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateFn()) {
      primaryActionFn();
      setOpen(false);
      if (isSubmitFormDialog) {
        window.history.pushState({}, "Gitnotek");
      }
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-20 inset-0 overflow-y-auto"
        initialFocus={children}
        open={isOpen}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <form
              onSubmit={(e) => submitForm(e)}
              className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 inline-block align-bottom bg-bgColorEl1 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 font-semibold text-textColorPrimary"
              >
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-textColorSecondary whitespace-pre-line text-left">
                  {message}
                </p>
              </div>
              {children}
              <div className="bg-bgColorEl1 pt-6 py-3 sm:flex sm:flex-row-reverse">
                <input
                  data-id="dlg-btn-primary"
                  type="submit"
                  value={primaryActionText}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-focusColor focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                />
                <button
                  data-id="dlg-btn-secondary"
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-bgColorEl1 text-base font-medium text-textColorPrimary hover:bg-bgColorEl1 focus:outline-none focus:ring-2 focus:ring-offset-focusColor focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  {cancelActionText}
                </button>
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
