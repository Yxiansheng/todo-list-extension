import { useMemo, useRef, useState } from "react";
import { useDrag, useKeyPress } from "ahooks";
import { ETaskType, TaskTypeMap } from "../../types";
import { SelectTagPopover } from "../SelectTagPopover/Index";
import { ITask } from "types/task";
import { useTagState } from "../../hook/useTagState";
import SvgShanchuSmall from "imgs/icon-shanchu-small.svg";
import { ITag } from "types/tag";
import _ from "lodash";

const ShowTagsChar = "#";

interface IProps {
  data: ITask;
  onChange: (type: ETaskType, key: string, newTask: ITask) => any;
  onRemove: (type: ETaskType, key: string) => any;
  onDragStart: (e: React.DragEvent<Element>, data: ITask) => any;
  onDragEnd: (e: React.DragEvent<Element>, data: ITask) => any;
  onTriggerShowTagsPopover: (ref: HTMLDivElement) => any;
}

export const TaskItem = (props: IProps) => {
  const {
    data,
    onChange,
    onRemove,
    onDragStart,
    onDragEnd,
    onTriggerShowTagsPopover,
  } = props;
  const { id, type, name, tagIds, isNewTask } = data;

  const [editing, setEditing] = useState(isNewTask);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { tagsMap } = useTagState();
  useDrag(data, ref, {
    onDragStart: (e: React.DragEvent<Element>) => onDragStart(e, data),
    onDragEnd: (e: React.DragEvent<Element>) => onDragEnd(e, data),
  });
  useKeyPress("enter", (event: any) => onSave(event.target.value), {
    target: inputRef,
  });

  const typeEnum = useMemo(() => {
    return TaskTypeMap[type];
  }, [type]);

  // 双击任务回调
  function onTaskDoubleClick() {
    setEditing(true);
  }

  function onSave(value: string) {
    if (!editing) return;
    onChange(type, id, {
      ...data,
      name: value,
      isNewTask: false,
    });
    setEditing(false);
  }

  function onInputChange(value: string) {
    if (isNewTask) return;
    if (!value || value[value.length - 1] != ShowTagsChar) return;
    onTriggerShowTagsPopover(ref.current as HTMLDivElement);
  }

  function onBtnRemoveTag(tagId: ITag["id"]) {
    const _tags = tagIds.slice();
    const index = _tags.findIndex((item) => item === tagId);
    if (index < 0) return;

    _tags.splice(index, 1);
    onChange(type, id, {
      ...data,
      tagIds: _tags,
    });
  }

  return (
    <div
      className={`p-2 rounded-md bg-opacity-40 bg-white cursor-pointer border-0`}
      ref={ref}
      // 处理拖拽时带背景的 bug
      style={{ transform: "translate(0, 0)" }}
      onDragOver={(e) => e.preventDefault()}
      onDoubleClick={onTaskDoubleClick}
    >
      {editing ? (
        <input
          autoFocus
          className="w-full appearance-none border-b-2 bg-transparent outline-none text-gray-500"
          ref={inputRef}
          style={{ borderColor: typeEnum.color }}
          defaultValue={name}
          onChange={(e) => onInputChange(e.target.value)}
          onBlur={(e) => onSave(e.target.value)}
        />
      ) : (
        <div className="flex justify-between items-center text-gray-500 group">
          <div>
            <p>{name}</p>
            <div className="space-x-1 cursor-default">
              {tagIds
                ?.filter((tagId) => tagsMap.has(tagId))
                .map((tagId) => (
                  <div
                    key={tagId}
                    className="inline-flex px-1 bg-white bg-opacity-40 text-xs rounded"
                  >
                    {tagsMap.get(tagId)?.name}
                    <img
                      className="transform scale-50 text-gray-500 cursor-pointer"
                      src={SvgShanchuSmall}
                      onClick={() => onBtnRemoveTag(tagId)}
                    />
                  </div>
                ))}
            </div>
          </div>
          <i
            className={
              "iconfont icon-shanchu opacity-0 group-hover:opacity-100 text-white transition-all duration-200 transform text-sm rotate-0 hover:rotate-180"
            }
            style={{
              color: typeEnum.darkColor,
            }}
            onClick={() => onRemove(type, id)}
          ></i>
        </div>
      )}
    </div>
  );
};
