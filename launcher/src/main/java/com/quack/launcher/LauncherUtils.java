package com.quack.launcher;

import com.quack.beans.Launch;
import com.quack.beans.LaunchTestCase;
import com.quack.beans.LaunchTestCaseTree;

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
