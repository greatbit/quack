package com.testquack.launcher;

import com.testquack.beans.Launch;
import ru.greatbit.plow.contract.Plugin;

import javax.servlet.http.HttpServletRequest;
import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import static java.lang.String.format;
import static org.springframework.util.StringUtils.isEmpty;

@Plugin(contract = Launcher.class, name = "request-launcher", title = "Request Launcher")
public class RequestLaucnher extends BaseLauncher<RequestLauncherConfig> {

    @Override
    public Launch launch(Launch launch, String projectId, HttpServletRequest request) throws Exception {
        send(getPluginConfig(new RequestLauncherConfig(), launch.getLauncherConfig()));
        return null;
    }

    @Override
    public boolean isToCreateLaunch() {
        return false;
    }

    private void send(RequestLauncherConfig config) throws Exception {
        URL obj = new URL(config.getEndpoint());
        HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
        setHeaders(config, connection);
        connection.setReadTimeout(config.getTimeout());
        connection.setConnectTimeout(config.getTimeout());

        if ("GET".equals(config.getRequestType())) {
            sendGet(config, connection);
        } else {
            sendPost(config, connection);
        }
    }

    private void sendGet(RequestLauncherConfig config, HttpURLConnection connection) throws Exception {
        connection.setRequestMethod("GET");
        int responseCode = connection.getResponseCode();
        if (responseCode != 200 && responseCode != 201) {
            throw new Exception(format("Unable to send GET request to %s, got response %s", config.getEndpoint(), responseCode));
        }
    }

    private void sendPost(RequestLauncherConfig config, HttpURLConnection con) throws Exception {
        con.setRequestMethod(config.getRequestType());
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        if (config.getRequestBody() != null) {
            wr.writeBytes(config.getRequestBody());
        }
        wr.flush();
        wr.close();

        int responseCode = con.getResponseCode();
        if (responseCode != 200 && responseCode != 201) {
            throw new Exception(format("Unable to send %s request to %s, got response %s", config.getRequestType(),
                    config.getEndpoint(), responseCode));
        }
    }

    private void setHeaders(RequestLauncherConfig config, HttpURLConnection con) {
        if (isEmpty(config.getRequestHeaders())) {
            return;
        }
        for (String headerRow : config.getRequestHeaders().split(";")) {
            String[] header = headerRow.split("=");
            if (header.length == 2) {
                con.setRequestProperty(header[0], header[1]);
            }
        }
    }
}
