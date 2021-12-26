import { useEffect, useMemo } from "react";
import { useDynamicList } from "ahooks";
import { ITag } from "types/tag";

export const useTagState = () => {
  const { list: tags, resetList, ...restProps } = useDynamicList<ITag>([]);

  const updateTagsMethods = {
    resetList,
    ...restProps,
  };

  useEffect(() => {
    if (chrome && chrome.storage) {
      chrome.storage.sync.get(["tags"], function (result: any) {
        resetList(result.tags);
      });
    } else if (localStorage) {
      try {
        const result = localStorage.getItem("tags");
        if (!result) return;
        resetList(JSON.parse(result) as ITag[]);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (chrome && chrome.storage) {
      chrome?.storage?.sync.set({
        tags,
      });
    } else if (localStorage) {
      localStorage.setItem("tags", JSON.stringify(tags));
    }
  }, [tags]);

  const tagsMap = useMemo(() => {
    return new Map(tags.map((tag) => [tag.id, tag]));
  }, [tags]);

  return {
    tags,
    tagsMap,
    updateTagsMethods,
  };
};
