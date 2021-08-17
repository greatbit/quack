export const navigation = {
  project: (projectID: string) => ({
    testCases: {
      list: () => `/${projectID}/testcases`,
      single: (testCaseID: string) => `/${projectID}/testcases/?testcase=${testCaseID}`,
    },
  }),
};
