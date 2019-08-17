package com.testquack.launcher;

import com.testquack.liken.beans.Testcase;
import com.testquack.beans.Launch;
import com.testquack.beans.LaunchTestCase;
import com.testquack.beans.Property;
import com.testquack.client.HttpClientBuilder;
import com.testquack.launcher.error.LauncherException;
import org.springframework.beans.factory.annotation.Value;
import retrofit2.Response;
import ru.greatbit.plow.contract.Plugin;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.lang.String.format;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;
import static ru.greatbit.utils.string.StringUtils.emptyIfNull;

@Plugin(contract = Launcher.class, name = "liken-launcher", title = "Liken Launcher")
public class LikenLauncher extends BaseLauncher<LikenLauncherConfig> {

    @Value("${quack.api.endpoint}")
    String quackApiEndpoint;

    @Value("${quack.ui.url}")
    String quackUiEndpoint;

    private final String PROJECT_ID_META_KEY = "projectId";

    @Override
    public Launch launch(Launch launch, String projectId, HttpServletRequest request) throws Exception {
        LikenLauncherConfig config = getPluginConfig(new LikenLauncherConfig(), launch.getLauncherConfig());
        com.testquack.liken.beans.Launch likenLaunch = convert(config, launch, projectId);
        Response<com.testquack.liken.beans.Launch> response = getClient(config, request).createLaunch(likenLaunch).execute();
        if (response.code() != 200) {
            throw new LauncherException(format("Unable to launch Liken, got response code %s", response.code()));
        }
        likenLaunch = response.body();
        launch.getLauncherConfig().setExternalLaunchUrl(
                format("%s/launch/%s", config.getFrontendEndpoint(), likenLaunch.getId())
        );
        launch.getLauncherConfig().setExternalLaunchId(likenLaunch.getId());

        return launch;
    }

    private com.testquack.liken.beans.Launch convert(LikenLauncherConfig config, Launch launch, String projectId) {
        //ToDo: add created by and a backlink to original launch
        com.testquack.liken.beans.Launch likenLaunch = new com.testquack.liken.beans.Launch();
        likenLaunch.setParamsA(config.getParamsA());
        likenLaunch.setParamsB(config.getParamsB());
        likenLaunch.setPrefixA(config.getPrefixA());
        likenLaunch.setPrefixB(config.getPrefixB());
        likenLaunch.setExternalId(launch.getId());
        likenLaunch.setName(launch.getName());
        likenLaunch.getMetadata().put(PROJECT_ID_META_KEY, projectId);
        likenLaunch.setExternalUrl(format("%s/%s/launch/%s", quackUiEndpoint, projectId, launch.getId()));
        Set<String> placeholders = Stream.of(
                ofNullable(config.getPlaceholders()).orElseGet(String::new).split(",")).
                map(String::trim).
                collect(Collectors.toSet());
        likenLaunch.setTestcases(getTestcases(placeholders, config, launch, projectId));
        return likenLaunch;
    }

    private List<Testcase> getTestcases(Set<String> placeholders, LikenLauncherConfig config, Launch launch, String projectId) {
        return LauncherUtils.getTestCasesPlainList(launch).stream().
                flatMap(launchTestCase -> convert(placeholders, config, launch, launchTestCase, projectId)).collect(toList());
    }

    private Stream<Testcase> convert(Set<String> placeholders, LikenLauncherConfig config, Launch launch, LaunchTestCase launchTestCase, String projectId) {
        return launchTestCase.getProperties().stream().
                filter(property -> placeholders.stream().anyMatch(property.getValue()::contains)).
                map(property ->
                        new Testcase().
                                withDescription(launchTestCase.getDescription()).
                                withId(launchTestCase.getId()).
                                withName(launchTestCase.getName()).
                                withUrlA(replaceUrl(property, config.getUrlA(), placeholders, config.getPrefixA(), config.getParamsA())).
                                withUrlB(replaceUrl(property, config.getUrlB(), placeholders, config.getPrefixB(), config.getParamsB())).
                                withExternalUuid(launchTestCase.getUuid()).
                                withExternalUrl(format("%s/%s/launch/%s/%s", quackUiEndpoint, projectId, launch.getId(), launchTestCase.getId()))
                );
    }

    private String replaceUrl(Property property, String newValue, Set<String> placeholders, String prefix, String params) {
        String replacedValue = property.getValue();
        for (String placeholder : placeholders) {
            replacedValue = replacedValue.replace(placeholder, newValue);
        }
        return emptyIfNull(prefix) + replacedValue + emptyIfNull(params);
    }

    private LikenClient getClient(LikenLauncherConfig config, HttpServletRequest request) {
        return HttpClientBuilder.builder(config.getApiEndpoint(), config.getTimeout(), request).build().
                create(LikenClient.class);
    }
}
