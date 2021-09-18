import { WithID } from "../domain";

const listToLookup = <T extends WithID>(list: T[]) => {
  const res: Record<string, T> = {};
  for (const item of list) {
    res[item.id] = item;
  }
  return res;
};

export default listToLookup;
