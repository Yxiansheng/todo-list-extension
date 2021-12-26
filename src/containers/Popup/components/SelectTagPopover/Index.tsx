import { useClickAway } from "ahooks";
import { isArray } from "lodash";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ITag } from "types/tag";
import { PopupContext } from "../../PopupContext";

const InitialX = -100;
const InitialY = -100;

interface IProps {}

export interface ISelectTagPopover {
  open: (
    payload: {
      x: number;
      y: number;
      width: number | string;
      checkedTagIds: ITag["id"][];
    },
    callback: (tag: ITag["id"]) => any
  ) => any;
  close: () => any;
}
const set = new WeakSet();

export const SelectTagPopover = forwardRef<ISelectTagPopover, IProps>(
  (props, ref) => {
    const { tags } = useContext(PopupContext);

    const [visible, setVisible] = useState(false);
    const [x, setX] = useState(InitialX);
    const [y, setY] = useState(InitialY);
    const [width, setWidth] = useState<number | string>("auto");
    const [checkedTagIds, setCheckedTagIds] =
      useState<Readonly<ITag["id"][]>>();

    const containerRef = useRef<HTMLDivElement>(null);
    const clickCallbackRef = useRef<(tagId: string) => void>();

    useImperativeHandle(ref, () => ({
      open(payload, callback) {
        setX(payload.x);
        setY(payload.y);
        setWidth(payload.width);
        setVisible(true);
        setCheckedTagIds(payload.checkedTagIds);
        clickCallbackRef.current = callback;
      },
      close,
    }));

    useClickAway(() => {
      if (!visible) return;
      close();
    }, containerRef);

    const checkedTagIdsSet = useMemo(() => {
      const arr = isArray(checkedTagIds) ? checkedTagIds : [];
      return new Set(arr);
    }, [checkedTagIds]);

    function close() {
      setX(InitialX);
      setY(InitialY);
      setVisible(false);
      clickCallbackRef.current = undefined;
    }

    function onTagClick(id: ITag["id"]) {
      if (checkedTagIdsSet.has(id)) return;

      clickCallbackRef.current?.(id);
      close();
    }

    const opacity = visible ? 1 : 0;

    return createPortal(
      <div
        className="w-49 p-2 absolute rounded-md bg-opacity-60 bg-white shadow-2xl"
        style={{ top: y, left: x, opacity, width }}
        ref={containerRef}
      >
        <ul>
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex justify-between cursor-pointer"
              onClick={() => onTagClick(tag.id)}
            >
              {tag.name}
              {checkedTagIdsSet.has(tag.id) && (
                <i
                  className="iconfont icon-yixuanze"
                  style={{ color: "#57c3c2" }}
                ></i>
              )}
            </li>
          ))}
        </ul>
      </div>,
      document.body
    );
  }
);
