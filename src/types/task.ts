import { ETaskType } from "../containers/Popup/types/task-type";
import { ITag } from "./tag";

export interface ITask {
  id: string;
  /**
   * 任务名
   */
  name: string;
  /**
   * 任务类型：TODO、DOING、DONE
   */
  type: ETaskType;
  /**
   * 是否正在编辑
   */
  isEditing?: boolean;
  /**
   * 所属标签id
   */
  tagIds: ITag["id"][];
  /**
   * 是否新增标签
   */
  isNewTask: boolean;
}
