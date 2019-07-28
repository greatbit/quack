package com.quack.launcher;

import com.greatbit.liken.beans.Testcase;
import com.quack.beans.Launch;
import com.quack.beans.LaunchTestCase;
import com.quack.beans.Property;
import com.quack.client.HttpClientBuilder;
import ru.greatbit.plow.contract.Plugin;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;

@Plugin(contract = Launcher.class, name = "liken-launcher", title = "Liken Launcher")
public class LikenLauncher extends BaseLauncher<LikenLauncherConfig> {

    @Override
    public Launch launch(Launch launch, String projectId, HttpServletRequest request) throws Exception {
        LikenLauncherConfig config = getPluginConfig(new LikenLauncherConfig(), launch.getLauncherConfig());
        com.greatbit.liken.beans.Launch likenLaunch = convert(config, launch);
        getClient(config, request).createLaunch(likenLaunch).execute().body();
        return launch;
    }

    private com.greatbit.liken.beans.Launch convert(LikenLauncherConfig config, Launch launch) {
        com.greatbit.liken.beans.Launch likenLaunch = new com.greatbit.liken.beans.Launch();
        likenLaunch.setParamsA(config.getParamsA());
        likenLaunch.setParamsB(config.getParamsB());
        likenLaunch.setPrefixA(config.getPrefixA());
        likenLaunch.setPrefixB(config.getPrefixB());
        likenLaunch.setExternalId(launch.getId());
        likenLaunch.setName(launch.getName());
        Set<String> placeholders = Stream.of(
                ofNullable(config.getPlaceholders()).orElseGet(String::new).split(",")).
                map(String::trim).
                collect(Collectors.toSet());
        likenLaunch.setTestcases(getTestcases(placeholders, config, launch));
        return null;
    }

    private List<Testcase> getTestcases(Set<String> placeholders, LikenLauncherConfig config, Launch launch) {
        return LauncherUtils.getTestCasesPlainList(launch).stream().
                flatMap(launchTestCase -> convert(placeholders, config, launchTestCase)).collect(toList());
    }

    private Stream<Testcase> convert(Set<String> placeholders, LikenLauncherConfig config, LaunchTestCase launchTestCase) {
        return launchTestCase.getProperties().stream().
                filter(property -> placeholders.stream().anyMatch(property.getValue()::contains)).
                map(property ->
                        new Testcase().
                                withDescription(launchTestCase.getDescription()).
                                withId(launchTestCase.getId()).
                                withName(launchTestCase.getName()).
                                withUrlA(replaceUrl(property, config.getUrlA(), placeholders)).
                                withUrlB(replaceUrl(property, config.getUrlB(), placeholders)).
                                withUuid(launchTestCase.getUuid())
                );
    }

    private String replaceUrl(Property property, String newValue, Set<String> placeholders) {
        String replacedValue = property.getValue();
        for (String placeholder : placeholders) {
            replacedValue = replacedValue.replace(placeholder, newValue);
        }
        return replacedValue;
    }

    private LikenClient getClient(LikenLauncherConfig config, HttpServletRequest request) {
        return HttpClientBuilder.builder(config.getApiEndpoint(), config.getTimeout(), request).build().
                create(LikenClient.class);
    }
}
