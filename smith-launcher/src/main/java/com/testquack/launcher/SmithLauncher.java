package com.testquack.launcher;

import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.testquack.beans.Launch;
import com.testquack.beans.LaunchTestCase;
import com.testquack.beans.LaunchTestCaseTree;
import com.testquack.client.HttpClientBuilder;
import com.testquack.launcher.error.LauncherException;
import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.support.SimpleRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import retrofit2.Response;
import ru.greatbit.plow.contract.Plugin;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

import static java.lang.String.format;

@Plugin(contract = Launcher.class, name = "smith-launcher", title = "Smith Launcher")
public class SmithLauncher extends BaseLauncher<SmithConfig> {

    @Autowired
    LaunchTestcaseProcessor launchTestcaseProcessor;

    @PostConstruct
    private void postInit() throws Exception {
        try {
            SimpleRegistry registry = new SimpleRegistry();
            registry.bind("sqsClient", AmazonSQSClientBuilder.defaultClient());
            registry.bind("launchTestcaseProcessor", launchTestcaseProcessor);

            CamelContext context = new DefaultCamelContext(registry);
            context.addRoutes(new RouteBuilder() {
                public void configure() {
                    from("aws-sqs://smith-results?amazonSQSClient=#sqsClient&delay=5000&maxMessagesPerPoll=5").
                            process("launchTestcaseProcessor");
                }
            });
            context.start();
        } catch (Exception e){
            ///ToDo: log info that sqs is not set for smith
        }

    }

    @Override
    public boolean isToCreateLaunch() {
        return true;
    }

    @Override
    public Launch launch(Launch launch, String projectId, HttpServletRequest request) throws Exception {
        SmithConfig config = getPluginConfig(new SmithConfig(), launch.getLauncherConfig());
        Response<Executables> response = getClient(config, request).
                createLaunch(convertLaunch(launch, projectId)).
                execute();
        if (response.code() != 200) {
            throw new LauncherException(format("Unable to launch Smith, got response code %s", response.code()));
        }

        //ToDo: set external launch url and report url

        return launch;
    }

    private Executables convertLaunch(Launch launch ,String projectId) {
        Executables executables = new Executables();
        executables.setLaunchId(launch.getId());
        executables.setProjectId(projectId);
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
                map(launchTestCase -> convertTestcase(launchTestCase, executables.getProjectId())).
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

    private Executable convertTestcase(LaunchTestCase launchTestCase, String quackProjecId) {
        Executable executable = new Executable();
        executable.setTestcaseUuid(launchTestCase.getUuid());
        executable.setProjectId(quackProjecId);
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
