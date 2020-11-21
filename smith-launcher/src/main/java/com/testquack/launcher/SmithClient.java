package com.testquack.launcher;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface SmithClient {

    @POST("tasks")
    Call<Executables> createLaunch(@Body Executables executables);

}
