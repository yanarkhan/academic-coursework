/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.pinjam_rpl2.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="pinjam")
public class ModelPinjam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="nama", nullable=false, length=100)
    private String nama;

    @Column(name="jumlah", nullable=false)
    private double jumlah;

    @Column(name="bunga", nullable=false)
    private double bunga;

    @Column(name="waktu", nullable=false)
    private int waktu;

    @Column(name="status", nullable=false, length=30)
    private String status;

    public ModelPinjam() {
    }

    public ModelPinjam(int id, String nama, double jumlah, double bunga, int waktu, String status) {
        this.id = id;
        this.nama = nama;
        this.jumlah = jumlah;
        this.bunga = bunga;
        this.waktu = waktu;
        this.status = status;
    }

    // Getter Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public double getJumlah() {
        return jumlah;
    }

    public void setJumlah(double jumlah) {
        this.jumlah = jumlah;
    }

    public double getBunga() {
        return bunga;
    }

    public void setBunga(double bunga) {
        this.bunga = bunga;
    }

    public int getWaktu() {
        return waktu;
    }

    public void setWaktu(int waktu) {
        this.waktu = waktu;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public double getBiayaBulanan() {
        double totalBunga = jumlah * (bunga / 100);
        double totalBayar = jumlah + totalBunga;
        return totalBayar / waktu;
    }

}
