import { ChangeEvent, useContext, useEffect, useState } from "react";
import { isEventKey } from "keycode";
import { uniqueId } from "lodash";
import { useDynamicList } from "ahooks";
import { TagItem } from "./components/TagItem";
import { useTagState } from "../../hook/useTagState";
import { ITag } from "types/tag";
import { PopupContext } from "../../PopupContext";

interface IProps extends React.FunctionComponent {}

export const TagList = () => {
  const {
    tags,
    updateTagsMethods: { push, replace, remove },
  } = useContext(PopupContext);
  const [newTagName, setNewTagName] = useState("");

  // 新标签输入框输入回调
  function onChangeNewTagName(e: ChangeEvent<HTMLInputElement>) {
    setNewTagName(e.target.value);
  }

  // 新标签输入框键盘按下回调
  function onNewTagInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // 非回车
    if (!isEventKey(e as unknown as Event, "enter")) return;
    onSaveNewTag();
  }

  function onSaveNewTag() {
    if (!newTagName?.trim()) return;
    push({
      name: newTagName,
      id: uniqueId("tag"),
    });
    setNewTagName("");
  }

  function getTagIndex(id: string) {
    return tags.findIndex((tag) => tag.id === id);
  }

  function onTagChange(value: ITag) {
    const index = getTagIndex(value.id);
    if (index < 0) return;
    replace(index, value);
  }

  function onTagRemove(id: string) {
    const index = getTagIndex(id);
    if (index < 0) return;
    remove(index);
  }

  return (
    <section className="bg-white p-3 rounded-sm text-base text-gray-500">
      <ul className="space-y-3">
        {tags.map((tag) => (
          <TagItem
            key={tag.id}
            data={tag}
            onChange={onTagChange}
            onRemove={onTagRemove}
          />
        ))}
        <li>
          <input
            className="w-full appearance-none border-b-2 bg-transparent outline-none "
            placeholder="请输入"
            value={newTagName}
            onChange={onChangeNewTagName}
            onKeyDown={onNewTagInputKeyDown}
            onBlur={onSaveNewTag}
          />
        </li>
      </ul>
    </section>
  );
};
