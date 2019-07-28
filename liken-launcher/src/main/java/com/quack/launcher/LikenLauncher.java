package com.quack.launcher;

import com.greatbit.liken.beans.Testcase;
import com.quack.beans.Launch;
import com.quack.client.HttpClientBuilder;
import ru.greatbit.plow.contract.Plugin;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

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
        likenLaunch.setBaseUrlA(config.getUrlA());
        likenLaunch.setBaseUrlB(config.getUrlB());
        likenLaunch.setParamsA(config.getParamsA());
        likenLaunch.setParamsB(config.getParamsB());
        //ToDO - persist launch before launcher execution
        likenLaunch.setExternalId(launch.getId());
        likenLaunch.setName(launch.getName());
        likenLaunch.setTestcases(getTestcases(launch));
        return null;
    }

    private List<Testcase> getTestcases(Launch launch) {
        //ToDo: implement
        return null;
    }

    private LikenClient getClient(LikenLauncherConfig config, HttpServletRequest request) {
        return HttpClientBuilder.builder(config.getApiEndpoint(), config.getTimeout(), request).build().
                create(LikenClient.class);
    }
}
