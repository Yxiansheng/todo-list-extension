import { useRef, useState } from "react";
import { ITag } from "types/tag";

interface IProps {
  data: ITag;
  onChange: (value: ITag) => any;
  onRemove: (id: string) => any;
}

export const TagItem = (props: IProps) => {
  const { data, onChange, onRemove } = props;
  const { id, name } = data;

  const inputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);

  function onDoubleClick() {
    if (editing) return;
    setEditing(true);
  }

  function onSave(value: string) {
    if (!editing) return;
    onChange({
      ...data,
      name: value,
    });
    setEditing(false);
  }

  function onTagRemove() {
    onRemove(id);
  }

  return (
    <li
      className="py-1 px-2 rounded bg-opacity-40 text-white"
      style={{ backgroundColor: "#8abcd1" }}
      onDoubleClick={onDoubleClick}
    >
      {editing ? (
        <input
          autoFocus
          className="w-full appearance-none border-b-2 bg-transparent outline-none text-gray-500"
          ref={inputRef}
          style={{ borderColor: "#8abcd1" }}
          defaultValue={name}
          onBlur={(e) => onSave(e.target.value)}
        />
      ) : (
        <div className="flex justify-between items-center text-gray-500 group">
          <span>{name}</span>
          <i
            className={
              "iconfont icon-shanchu opacity-0 group-hover:opacity-100 text-white transition-all duration-200 transform text-sm rotate-0 hover:rotate-180 cursor-pointer"
            }
            style={{
              color: "white",
            }}
            onClick={onTagRemove}
          ></i>
        </div>
      )}
    </li>
  );
};
