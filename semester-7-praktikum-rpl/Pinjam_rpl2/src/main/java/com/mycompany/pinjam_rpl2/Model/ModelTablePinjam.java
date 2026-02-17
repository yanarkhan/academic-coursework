/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.pinjam_rpl2.Model;

import java.text.DecimalFormat;
import java.util.List;
import javax.swing.table.AbstractTableModel;

public class ModelTablePinjam extends AbstractTableModel {

    private List<ModelPinjam> pinjamList;
    private String[] columnNames = {"ID", "Nama", "Jumlah", "Bunga (%)", "Waktu (bulan)", "Biaya Bulanan", "Status"};

    // Decimal formatter agar angka tidak tampil scientific notation (E)
    private DecimalFormat dfJumlah = new DecimalFormat("#,###"); 
    private DecimalFormat dfBunga = new DecimalFormat("#.##");   // misalnya 5.0 -> 5

    public ModelTablePinjam(List<ModelPinjam> pinjamList) {
        this.pinjamList = pinjamList;
    }

    @Override
    public int getRowCount() {
        return pinjamList.size();
    }

    @Override
    public int getColumnCount() {
        return columnNames.length;
    }

    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        ModelPinjam p = pinjamList.get(rowIndex);

        switch (columnIndex) {
            case 0:
                return p.getId();
            case 1:
                return p.getNama();
            case 2:
                return dfJumlah.format(p.getJumlah());   // Format jumlah
            case 3:
                return dfBunga.format(p.getBunga());     // Format bunga
            case 4:
                return p.getWaktu();
            case 5:
                return dfJumlah.format(p.getBiayaBulanan());
            case 6:
                return p.getStatus();

            default:
                return null;
        }
    }

    @Override
    public String getColumnName(int column) {
        return columnNames[column];
    }

    @Override
    public boolean isCellEditable(int rowIndex, int columnIndex) {
        return false;
    }

    public void setPinjamList(List<ModelPinjam> pinjamList) {
        this.pinjamList = pinjamList;
        fireTableDataChanged();
    }
}
