/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.pinjam_rpl2.Controller;

import com.mycompany.pinjam_rpl2.Model.ModelPinjam;
import com.mycompany.pinjam_rpl2.Service.PinjamService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class PinjamController {

    @Autowired
    private PinjamService pinjamService;

    public String addPinjam(@RequestBody ModelPinjam pinjam) {
        pinjamService.addPinjam(pinjam);
        return "Pinjaman added successfully";
    }

    public ModelPinjam getPinjam(@PathVariable int id) {
        return pinjamService.getPinjam(id);
    }

    public String updatePinjam(@RequestBody ModelPinjam pinjam) {
        pinjamService.updatePinjam(pinjam);
        return "Pinjaman updated successfully";
    }

    public String deletePinjam(@PathVariable int id) {
        pinjamService.deletePinjam(id);
        return "Pinjaman deleted successfully";
    }

    public List<ModelPinjam> getAllPinjam() {
        return pinjamService.getAllPinjam();
    }
    public String updateStatus(@PathVariable int id, @RequestBody String status) {
        ModelPinjam pinjam = pinjamService.getPinjam(id);
        pinjam.setStatus(status);
        pinjamService.updatePinjam(pinjam);
        return "Status updated successfully";
    }
}
