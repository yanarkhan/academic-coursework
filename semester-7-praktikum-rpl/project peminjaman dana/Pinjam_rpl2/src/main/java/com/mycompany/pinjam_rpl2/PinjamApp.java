/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.pinjam_rpl2;

import com.mycompany.pinjam_rpl2.Controller.PinjamController;
import com.mycompany.pinjam_rpl2.Service.PinjamService;
import com.mycompany.pinjam_rpl2.View.PinjamView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class PinjamApp implements ApplicationRunner {

    @Autowired
    private PinjamService pinjamService;

    public static void main(String[] args) {

        System.setProperty("java.awt.headless", "false");

        ApplicationContext context = SpringApplication.run(PinjamApp.class, args);

        // ambil controller dari Spring
        PinjamController controller = context.getBean(PinjamController.class);

        // kirimkan ke View
        PinjamView view = new PinjamView(controller);
        view.setVisible(true);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // kosongkan saja, tidak wajib digunakan
    }
}

