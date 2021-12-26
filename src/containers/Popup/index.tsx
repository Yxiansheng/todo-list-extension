import { useEffect, useRef, useState } from "react";
import { useDrag, useMouse } from "ahooks";
import { uniqueId } from "lodash";
import { useObjectState } from "../../hooks/index";
import { ETaskType, TaskTypeMap } from "./types";
import { TagList } from "./components/TagList";
import styles from "./index.module.css";
import { Dropdown } from "components/Dropdown";
import { TaskItem } from "./components/TaskItem";
import {
  ISelectTagPopover,
  SelectTagPopover,
} from "./components/SelectTagPopover/Index";
import { ITask } from "types/task";
import { useTagState } from "./hook/useTagState";
import { PopupContext } from "./PopupContext";

const DefaultTasks = {
  [ETaskType.TODO]: [],
  [ETaskType.DOING]: [],
  [ETaskType.DONE]: [],
};

type TUpdateTasks = Partial<Record<ETaskType, ITask[]>>;

const Popup = () => {
  const [dragging, setDragging] = useState<ITask | null>(null);

  const selectTagPopoverRef = useRef<ISelectTagPopover>(null);

  const [tasks, updateTasks] =
    useObjectState<Record<ETaskType, ITask[]>>(DefaultTasks);
  const { tags, updateTagsMethods } = useTagState();

  useEffect(() => {
    if (!chrome) return;
    chrome?.storage?.sync.get(
      ["tasks"],
      function (result: { tasks?: Record<ETaskType, ITask[]> }) {
        const _tasks = result?.tasks || DefaultTasks;
        // 去掉正在编辑的数据
        updateTasks(_tasks);
      }
    );
  }, []);

  useEffect(() => {
    if (!chrome) return;
    chrome?.storage?.sync.set({
      tasks: {
        [ETaskType.TODO]: filterEditingTask(tasks[ETaskType.TODO]),
        [ETaskType.DOING]: filterEditingTask(tasks[ETaskType.DOING]),
        [ETaskType.DONE]: filterEditingTask(tasks[ETaskType.DONE]),
      },
    });
  }, [tasks]);

  function onTaskDragStart(e: React.DragEvent<Element>, data: ITask) {
    const { type, id } = data;
    const _tasks = tasks[type]?.slice() || [];
    const index = _tasks.findIndex((task) => task.id === id);
    if (index < 0) return;
    const target = tasks[type][index];
    setDragging(target);
    _tasks.splice(index, 1);
    setTimeout(() => {
      updateTasks({
        [type]: _tasks,
      } as TUpdateTasks);
    }, 0);
  }

  function onTaskDragEnd(e: React.DragEvent<Element>, data: ITask) {
    setDragging(null);
    e.preventDefault();
  }

  function onTaskDrop(type: ETaskType) {
    if (!dragging) return;
    const _tasks = tasks[type]?.slice() || [];
    _tasks.push({
      ...dragging,
      type,
    });
    updateTasks({
      [type]: _tasks,
    } as TUpdateTasks);
  }

  // 新增任务
  function onAddTask(type: ETaskType) {
    const _tasks = tasks[type]?.slice() || [];
    const newTask: ITask = {
      id: uniqueId("task"),
      name: "",
      isEditing: true,
      type,
      tagIds: [],
      isNewTask: true,
    };
    _tasks.push(newTask);
    updateTasks({
      [type]: _tasks,
    } as TUpdateTasks);
  }

  function onTaskChange(type: ETaskType, id: string, newTask: ITask) {
    const newTasks = tasks[type].slice();
    const index = newTasks.findIndex((task) => task.id === id);
    newTasks[index] = newTask;
    updateTasks({
      [type]: newTasks,
    });
  }

  // 删除任务
  function onTaskRemove(type: ETaskType, id: string) {
    const newTasks = tasks[type].slice() || [];
    const index = newTasks.findIndex((task) => task.id === id);
    if (index < 0) return;
    newTasks.splice(index, 1);
    updateTasks({
      [type]: newTasks,
    });
  }

  // 触发展示标签 Popover
  function onTriggerShowTagsPopover(
    type: ETaskType,
    task: ITask,
    dom: HTMLDivElement
  ) {
    const { x, y, width, height } = dom.getBoundingClientRect();
    selectTagPopoverRef.current?.open(
      {
        x,
        width,
        y: y + height,
        checkedTagIds: task.tagIds,
      },
      (tagId) => {
        const newTasks = tasks[type].slice() || [];
        const index = newTasks.findIndex((item) => item.id === task.id);
        if (index < 0) return;
        const _tagIds = newTasks[index].tagIds.slice();
        _tagIds.push(tagId);
        newTasks[index].tagIds = _tagIds;
        updateTasks({
          [type]: newTasks,
        });
      }
    );
  }

  return (
    <PopupContext.Provider
      value={{
        tags,
        updateTagsMethods,
      }}
    >
      <section
        className="p-4 bg-white rounded-xl shadow-md space-y-3"
        style={{ width: 800 }}
      >
        <div className="flex justify-between text-gray-600">
          <span className="font-bold text-2xl" style={{ color: "#ed556a" }}>
            Todo List
          </span>

          <Dropdown
            trigger={["click"]}
            animation="slide-up"
            overlayClassName="w-52"
            overlay={<TagList />}
          >
            <i
              className="iconfont icon-biaoqian text-3xl cursor-pointer"
              style={{ color: "#1ba784" }}
            ></i>
          </Dropdown>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Object.values(TaskTypeMap).map(
            ({ name, value, color, darkColor }) => (
              <div
                className={`p-6 rounded-xl shadow-md space-y-2 ${styles["wrapper-task"]}`}
                style={{ minHeight: 250, backgroundColor: color }}
                key={value}
                onDrop={() => onTaskDrop(value)}
                onDragEnter={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex justify-between text-xl font-medium text-white">
                  <span>{name}</span>
                  <i
                    className="iconfont icon-tianjia cursor-pointer transition-all duration-200 transform rotate-0 hover:rotate-180"
                    onClick={() => onAddTask(value)}
                  ></i>
                </div>
                <div className="max-h-64 overflow-auto rounded-xl space-y-2">
                  {tasks[value].map((task) => (
                    <TaskItem
                      key={task.id}
                      data={task}
                      onChange={onTaskChange}
                      onRemove={onTaskRemove}
                      onDragStart={onTaskDragStart}
                      onDragEnd={onTaskDragEnd}
                      onTriggerShowTagsPopover={(ref) =>
                        onTriggerShowTagsPopover(value, task, ref)
                      }
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
        <SelectTagPopover ref={selectTagPopoverRef} />
      </section>
    </PopupContext.Provider>
  );
};

export default Popup;

/**
 * 过滤正在编辑的任务列表
 * @param tasks 任务列表
 */
function filterEditingTask(tasks?: ITask[]) {
  return Array.isArray(tasks) ? tasks.filter((task) => !task.isEditing) : [];
}
