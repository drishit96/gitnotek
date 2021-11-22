import { useEffect, useState } from "react";
import { Checkboxes } from "src/pages/NotesView";
import { noteService } from "src/services/note.service";
import NoteListItem, { Note } from "../Components/Note";

const NotesList = ({
  selectionMode,
  directory,
  checkboxes,
  setCheckboxes,
  refreshCount,
}: {
  selectionMode: boolean;
  directory?: string;
  checkboxes: Checkboxes;
  setCheckboxes: (checkboxes: Checkboxes) => void;
  refreshCount: number;
}) => {
  let [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    let isMounted = true;
    noteService.getNotes(directory).then((notesList) => {
      if (isMounted) {
        setNotes(notesList);
        setCheckboxes(
          notesList.reduce(
            (notes, note) => ({
              ...notes,
              [note.id]: {
                name: note.id,
                isFile: note.isFile,
                isChecked: false,
              },
            }),
            {}
          )
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, [directory, setCheckboxes, refreshCount]);

  function handleOnCheckboxChange(event: { target: any }) {
    const name = event.target.name;
    setCheckboxes({
      ...checkboxes,
      [name]: {
        isFile: checkboxes[name].isFile,
        isChecked: !checkboxes[name].isChecked,
      },
    });
  }

  return (
    <>
      {notes.length > 0 ? (
        <div className="border-solid border-2 border-focusColor rounded-lg">
          {notes.map((note) => {
            return (
              <div
                key={note.id}
                className={`flex p-0.5 border-b border-focusColor cursor-pointer overflow-hidden overflow-ellipsis hover:bg-focusColor ${selectionMode ? "animate-fadeInLeft" : "animate-fadeInLeft"}`}
              >
                {selectionMode ? (
                  <div className="flex items-center p-5 animate-fadeInLeft">
                    <input
                      type="checkbox"
                      name={note.id}
                      checked={checkboxes[note.id]?.isChecked}
                      onChange={handleOnCheckboxChange}
                    />
                  </div>
                ) : null}

                <NoteListItem
                  id={note.id}
                  isFile={note.isFile}
                  content={note.content}
                  currentDirectory={directory}
                ></NoteListItem>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default NotesList;
