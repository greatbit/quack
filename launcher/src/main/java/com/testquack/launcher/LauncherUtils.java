package com.testquack.launcher;

import com.testquack.beans.Launch;
import com.testquack.beans.LaunchTestCase;
import com.testquack.beans.LaunchTestCaseTree;

import java.util.List;

public class LauncherUtils {

    public static List<LaunchTestCase> getTestCasesPlainList(Launch launch) {
        return getTestCasesPlainList(launch.getTestCaseTree());
    }

    private static List<LaunchTestCase> getTestCasesPlainList(LaunchTestCaseTree head) {
        List<LaunchTestCase> plainTestCases = head.getTestCases();
        head.getChildren().forEach(child -> plainTestCases.addAll(getTestCasesPlainList(child)));
        return plainTestCases;
    }
}
