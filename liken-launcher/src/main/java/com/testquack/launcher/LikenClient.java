package com.testquack.launcher;

import com.testquack.liken.beans.Launch;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface LikenClient {

    @POST("launch")
    Call<Launch> createLaunch(@Body Launch launch);
}
