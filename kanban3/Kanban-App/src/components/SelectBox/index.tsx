import { Dispatch, SetStateAction, useState } from "react";
import "./style.css";
import { BiChevronUp, BiChevronDown } from "react-icons/bi";
import { AppState, IBoard, IColumn, ITask } from "types";
import { addTask, appData, deleteTask } from "redux/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
interface Props {
  selectedColumn: string;
  setSelectedColumn: Dispatch<SetStateAction<string>>;
  tasks?: ITask;
  handleClose?: () => void;
}

export default function Index({
  selectedColumn,
  setSelectedColumn,
  tasks,
}: Props) {
  const dispatch = useDispatch();
  const data: AppState = useSelector(appData);
  const active: IBoard = data.active;
  const [isOpen, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (title: string) => {
    setSelectedColumn(title);
    if (tasks?.status !== title && tasks !== undefined) {
      const updatedTasks = {
        ...tasks,
        id: uuidv4(),
        status: title,
      };
      dispatch(addTask({ updatedTasks, position: 0 }));
      dispatch(deleteTask(tasks));
    }
  };

  return (
    <div className="dropdown mt-2">
      <div
        className={`dropdown-header dark:bg-secondary-dark relative ${
          isOpen && "border-[1px] border-primary"
        }`}
        onClick={toggleDropdown}
      >
        <p className="text-sm">
          {" "}
          {selectedColumn ? selectedColumn : active.columns[0]?.name}
        </p>
        {isOpen ? (
          <BiChevronDown className={`icon ${isOpen && "open"}`} />
        ) : (
          <BiChevronUp className={`icon ${isOpen && "open"}`} />
        )}
        {isOpen && (
          <div className={`dropdown-body bg-offwhite dark:bg-secondary-dark `}>
            {active.columns.map((item: IColumn, i: number) => (
              <div
                className={`dropdown-item text-sm px-4 py-2.5 hover:text-primary cursor-pointer ${
                  i < 2 && "border-b-[1px] border-gray/20"
                }`}
                onClick={(e) =>
                  handleItemClick(
                    String(e.currentTarget.getAttribute("data-title"))
                  )
                }
                key={item.id}
                data-title={item.name}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
