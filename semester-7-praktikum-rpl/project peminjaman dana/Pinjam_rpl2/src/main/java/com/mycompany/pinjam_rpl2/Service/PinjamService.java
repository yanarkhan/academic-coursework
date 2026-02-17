/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.pinjam_rpl2.Service;

import com.mycompany.pinjam_rpl2.Model.ModelPinjam;
import com.mycompany.pinjam_rpl2.Repository.PinjamRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PinjamService {

    @Autowired
    private PinjamRepository repository;

    public void addPinjam(ModelPinjam pinjam) {
        repository.save(pinjam);
    }

    public ModelPinjam getPinjam(int id) {
        return repository.findById(id).orElse(null);
    }

    public void updatePinjam(ModelPinjam pinjam) {
        repository.save(pinjam);
    }

    public void deletePinjam(int id) {
        repository.deleteById(id);
    }

    public List<ModelPinjam> getAllPinjam() {
        return repository.findAll();
    }
}
