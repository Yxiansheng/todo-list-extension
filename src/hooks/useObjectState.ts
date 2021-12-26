import { useReducer, useMemo } from "react";

interface ResetAction<T> {
  type: "reset";
  payload?: T;
}
interface DeleteAction {
  type: "delete";
  payload: string[];
}
interface UpdateAction<T> {
  type: "update";
  payload: Partial<T>;
  callback?: (currentState: T) => void;
}

export interface ObjectStateUtils<T> {
  reset: (obj?: T) => void;
  del: (keys: string[]) => void;
}

/**
 * 指令类型
 */
type Action<T = unknown> = ResetAction<T> | DeleteAction | UpdateAction<T>;

/**
 * 判断函数
 * @param value
 */
function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

/**
 * 对象类型状态hook，多用于对象类型的state
 * @param initObj 初始对象数据
 */
export const useObjectState = <T extends Record<string, any>>(
  initObj: T | (() => T)
): [T, typeof update, ObjectStateUtils<T>] => {
  const initState = useMemo(
    () => (isFunction(initObj) ? initObj() : initObj),
    []
  );
  const reducer = (state: T, action: Action<T>): T => {
    switch (action.type) {
      case "reset": {
        const resetObj = action.payload || initState;
        return {
          ...resetObj,
        };
      }
      case "delete": {
        const deleteKeys = action.payload;
        const deleteKeyMap: Record<string, boolean> = {};
        deleteKeys.forEach((key) => (deleteKeyMap[key] = true));
        const newState: Record<string, unknown> = {};
        let isUpdate = false;
        Object.keys(state).forEach((key) => {
          if (deleteKeyMap[key]) {
            isUpdate = true;
            return;
          }
          newState[key] = state[key];
        });

        return isUpdate ? (newState as T) : state;
      }
      case "update": {
        const newState = {
          ...state,
          ...action.payload,
        };
        action.callback && action.callback(newState);
        return newState;
      }
      default:
        throw new Error();
    }
  };

  const [objState, dispatch] = useReducer(reducer, initState);

  const update = (obj: Partial<T>, callback?: (currentState: T) => void) => {
    dispatch({
      type: "update",
      payload: obj,
      callback,
    });
  };

  const reset = (obj?: T) => {
    dispatch({
      type: "reset",
      payload: obj,
    });
  };

  const del = (keys: string[]) => {
    dispatch({
      type: "delete",
      payload: keys,
    });
  };

  return [objState, update, { reset, del }];
};
