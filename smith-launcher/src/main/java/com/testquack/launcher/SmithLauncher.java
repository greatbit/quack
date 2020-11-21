package com.testquack.launcher;

import com.testquack.beans.Launch;
import com.testquack.beans.LaunchTestCase;
import com.testquack.beans.LaunchTestCaseTree;
import com.testquack.client.HttpClientBuilder;
import com.testquack.launcher.error.LauncherException;
import retrofit2.Response;
import ru.greatbit.plow.contract.Plugin;

import javax.servlet.http.HttpServletRequest;

import java.util.Map;

import static java.lang.String.format;

@Plugin(contract = Launcher.class, name = "smith-launcher", title = "Smith Launcher")
public class SmithLauncher extends BaseLauncher<SmithConfig> {

    @Override
    public boolean isToCreateLaunch() {
        return true;
    }

    @Override
    public Launch launch(Launch launch, String projectId, HttpServletRequest request) throws Exception {
        SmithConfig config = getPluginConfig(new SmithConfig(), launch.getLauncherConfig());
        Response<Executables> response = getClient(config, request).
                createLaunch(convertLaunch(launch)).
                execute();
        if (response.code() != 200) {
            throw new LauncherException(format("Unable to launch Smith, got response code %s", response.code()));
        }
        //ToDo: set external launch url and report url

        return launch;
    }

    private Executables convertLaunch(Launch launch) {
        Executables executables = new Executables();
        executables.setLaunchId(launch.getId());
        fillTestcasesFromTree(launch.getTestCaseTree(), executables);
        return executables;
    }

    private SmithClient getClient(SmithConfig config, HttpServletRequest request) {
        return HttpClientBuilder.builder(config.getApiEndpoint(), config.getTimeout(), request).build().
                create(SmithClient.class);
    }

    private void fillTestcasesFromTree(LaunchTestCaseTree tree, Executables  executables){
        tree.getTestCases().stream().
                filter(this::isTestcaseValid).
                map(this::convertTestcase).
                forEach(executable -> executables.getExecutables().add(executable));
        for (LaunchTestCaseTree child : tree.getChildren()) {
            fillTestcasesFromTree(child, executables);
        }
    }

    private boolean isTestcaseValid(LaunchTestCase launchTestCase) {
        Map<String, Object> metadata = launchTestCase.getMetaData();
        return !metadata.isEmpty() &&
                metadata.get("groupId") != null &&
                metadata.get("artifactId") != null &&
                metadata.get("version") != null &&
                metadata.get("class") != null;
    }

    private Executable convertTestcase(LaunchTestCase launchTestCase) {
        Executable executable = new Executable();
        executable.setTestcaseUuid(launchTestCase.getUuid());
        Map<String, String> metadata = executable.getMetadata();
        Map<String, Object> launchMetadata = launchTestCase.getMetaData();
        metadata.put("projectId", launchMetadata.get("groupId").toString());
        metadata.put("artifactId", launchMetadata.get("artifactId").toString());
        metadata.put("version", launchMetadata.get("version").toString());


        String classNameStr = launchMetadata.get("class").toString();
        String packageName = classNameStr.substring(0, classNameStr.lastIndexOf("."));
        metadata.put("package", packageName);

        metadata.put("class", classNameStr.replace(packageName + ".", ""));

        if (launchTestCase.getMetaData().get("method") != null){
            metadata.put("method", launchMetadata.get("method").toString());
        }
        return executable;
    }
}
