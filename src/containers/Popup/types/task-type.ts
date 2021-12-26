/**
 * 任务类型
 */
export enum ETaskType {
  "TODO" = "todo",
  "DOING" = "doing",
  "DONE" = "done",
}

export const TaskTypeMap: Record<
  ETaskType,
  { name: string; value: ETaskType; color: string; darkColor: string }
> = {
  [ETaskType.TODO]: {
    name: "Todo",
    value: ETaskType.TODO,
    color: "#f07c82",
    darkColor: "#ed556a",
  },
  [ETaskType.DOING]: {
    name: "Doing",
    value: ETaskType.DOING,
    color: "#f9d27d",
    darkColor: "#feba07",
  },
  [ETaskType.DONE]: {
    name: "Done",
    value: ETaskType.DONE,
    color: "#2f90b9",
    darkColor: "#3b818c",
  },
};
