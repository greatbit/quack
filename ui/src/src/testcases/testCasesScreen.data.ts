import { selectorFamily } from "recoil";
import { backendService } from "../services/backend";

export type WithProjectID = {
  projectID: string;
};

export const attributesSelector = selectorFamily({
  key: "project-attributes",
  get:
    ({ projectID }: WithProjectID) =>
    () =>
      backendService.project(projectID).attributes.list(),
});
