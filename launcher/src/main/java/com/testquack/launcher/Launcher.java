package com.testquack.launcher;

import com.testquack.beans.Launch;
import com.testquack.beans.LauncherConfig;
import com.testquack.beans.LauncherConfigDescriptor;

import javax.servlet.http.HttpServletRequest;

public interface Launcher<Config> {
    public LauncherConfigDescriptor getConfigDescriptor();

    public Config getPluginConfig(Config destination, LauncherConfig config);

    public String getLauncherId();

    public String getLauncherName();

    public boolean isToCreateLaunch();

    public Launch launch(Launch launch, String projectId, HttpServletRequest request) throws Exception;
}
