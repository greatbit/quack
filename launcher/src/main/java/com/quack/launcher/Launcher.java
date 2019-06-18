package com.quack.launcher;

import com.quack.beans.Launch;
import com.quack.beans.LauncherConfig;
import com.quack.beans.LauncherConfigDescriptor;

import javax.servlet.http.HttpServletRequest;

public interface Launcher<Config> {
    public LauncherConfigDescriptor getConfigDescriptor();

    public Config getPluginConfig(Config destination, LauncherConfig config);

    public String getLauncherId();

    public String getLauncherName();

    public boolean isToCreateLaunch();

    public Launch launch(Launch launch, String projectId, HttpServletRequest request) throws Exception;
}
