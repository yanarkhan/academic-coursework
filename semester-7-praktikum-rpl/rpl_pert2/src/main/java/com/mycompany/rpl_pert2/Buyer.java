/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.rpl_pert2;

/**
 *
 * @author arkhan
 */
public class Buyer extends User{
    @Override
    public void login() {
        System.out.println("Buyer melakukan Login");
    }
    
    @Override
    public void logout() {
        System.out.println("Buyer melakukan Logout");
    }
    
}
