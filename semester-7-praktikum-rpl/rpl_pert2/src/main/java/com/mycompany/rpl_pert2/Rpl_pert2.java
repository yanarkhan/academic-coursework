/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.rpl_pert2;

/**
 *
 * @author arkhan
 */
public class Rpl_pert2 {

    public static void main(String[] args) {
        User user = new User();
        user.login();
        user.logout();
        
        System.out.println("----- Seller ------");
        
        Seller seller = new Seller();
        seller.login();
        seller.addProduct("Nasi Gorengg, Rawrrrrr");
        seller.logout();
        
        System.out.println("----- Buyer ------");
        
        Buyer buyer = new Buyer();
        buyer.login();
        buyer.logout();
        
        System.out.println("----- Admin ------");
        
        Admin admin = new Admin();
        admin.login();
        admin.manageUser();
        admin.logout();
    }
}
