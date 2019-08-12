package com.testquack.api;

import com.testquack.api.utils.ObjectMapperFactory;
import io.swagger.jaxrs.config.BeanConfig;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.glassfish.jersey.server.internal.scanning.PackageNamesScanner;
import org.glassfish.jersey.server.spring.scope.RequestContextFilter;

import static java.lang.String.format;

public class Application extends ResourceConfig {

    public Application() {
        register(RequestContextFilter.class);
        register(MultiPartFeature.class);
        register(JacksonFeature.class);
        register(ObjectMapperFactory.class);
        register(RolesAllowedDynamicFeature.class);
        registerFinder(packageScanner(".resources"));
        registerFinder(packageScanner(".security"));
        register(io.swagger.jaxrs.listing.ApiListingResource.class);
        register(io.swagger.jaxrs.listing.SwaggerSerializers.class);

        //Swagger init
        BeanConfig beanConfig = new BeanConfig();
        beanConfig.setVersion("1.0.0");
        beanConfig.setSchemes(new String[]{"http"});
        beanConfig.setHost("localhost:8080");
        beanConfig.setBasePath("/api");
        beanConfig.setResourcePackage("com.testquack.api.resources");
        beanConfig.setScan(true);
    }

    private PackageNamesScanner packageScanner(String path) {
        return new PackageNamesScanner(new String[]{format("%s%s", getClass().getPackage().getName(), path)}, true);
    }
}
