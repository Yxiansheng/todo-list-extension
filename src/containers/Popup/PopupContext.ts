import React from "react";
import { ITag } from "types/tag";

interface IPopupContextValue {
  /**
   * 标签
   */
  tags: ITag[];
  updateTagsMethods: Record<string, (...args: any[]) => any>;
}

/**
 * 创建加工任务页 Context
 */
export const PopupContext = React.createContext<IPopupContextValue>({
  tags: [],
  updateTagsMethods: {},
});
