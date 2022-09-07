/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee and on NewBill Page", () => {
  describe("When I updload a file", () => {
    test("Then it should be an allowed file: jpg, jpeg, png", () => {
      // expect isFileAuthorized to be true
      
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
  
  describe("When I click on submit after filling all data", () => {
    test("Then it should create a new bill", () => {
      // expect all inputs to be entered
      // expect updateBill to be called
      
      
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})
