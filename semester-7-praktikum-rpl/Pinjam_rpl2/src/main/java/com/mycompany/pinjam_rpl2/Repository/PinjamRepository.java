/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.mycompany.pinjam_rpl2.Repository;

import com.mycompany.pinjam_rpl2.Model.ModelPinjam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PinjamRepository extends JpaRepository<ModelPinjam, Integer> {
    
}

