package com.quack.beans;

import javax.xml.bind.annotation.XmlElement;
import java.util.HashMap;
import java.util.Map;

public class LauncherConfig extends LauncherConfigBase {
    @XmlElement(required = true)
    private final Map<String, String> properties = new HashMap<>();

    @Override
    public Object createNewInstance() {
        return new LauncherConfig();
    }

    public Map<String, String> getProperties() {
        return properties;
    }
}
