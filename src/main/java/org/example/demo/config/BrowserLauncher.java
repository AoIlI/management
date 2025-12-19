package org.example.demo.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.net.URI;

@Component
public class BrowserLauncher implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) {

        try {
            // Windows
            Runtime.getRuntime().exec(
                    "cmd /c start http://localhost:8082/"
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

