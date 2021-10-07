import { selectorFamily, useRecoilValue } from "recoil";
import { ExistingProject } from "../domain";
import { backendService } from "../services/backend";

export type WithProjectID = {
  projectID: string;
};

export const projectAtom = selectorFamily<ExistingProject | undefined, string>({
  key: "single-project",
  get: projectID => () => backendService.project(projectID).single(),
});

export const useExistingProject = (projectID: string) => useRecoilValue(projectAtom(projectID));
export const attributesSelector = selectorFamily({
  key: "project-attributes",
  get:
    ({ projectID }: WithProjectID) =>
    () =>
      backendService.project(projectID).attributes.list(),
});
