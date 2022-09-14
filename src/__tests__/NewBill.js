/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom"
import { screen, waitFor, fireEvent } from "@testing-library/dom"
import userEvent from "@testing-library/user-event";

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes.js";
import { ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";


jest.mock('../app/store', () => mockStore)

describe("Given I am connected as an employee and on NewBill Page", () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()

    window.onNavigate(ROUTES_PATH.NewBill)
  })

  afterAll(() => {      
    console.error.mockRestore()
  })
  
  test("Then the mail icon in vertical layout should be highlighted", async () => {
    await waitFor(() => screen.getByTestId("icon-mail"))
    const mailIcon = screen.getByTestId("icon-mail")
    
    expect(mailIcon.classList.contains("active-icon")).toBe(true)
  })

  test("Then I should be on the NewBill page", () => {

    const submitNewBill  = screen.getByTestId('submitNewBill')

    expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();

    expect(submitNewBill).toBeTruthy();
  })
  
  describe("Given I uplad a file", () => {
    describe("When the file format is not allowed", () => {
      test("Then a not allowed file message should show up", () => {
        const newBill = new NewBill({
          document, onNavigate, store: mockStore, localStorage: window.localStorage
        })
        
        const file = screen.getByTestId("file")
        // INFO -- Liste type fichiers : https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        const testFileData = {
          file: new File(["pdf"], "test.pdf", { type: "application/pdf" })
        }
  
        const handleChangeFile = jest.fn(newBill.handleChangeFile);
        file.addEventListener("change", handleChangeFile);
        userEvent.upload(file, testFileData.file)
          
        const unauthorizedFileMessage = screen.getByTestId("file-error")
        expect(unauthorizedFileMessage.classList.contains("hidden")).not.toBe(true)
      })
    })
    describe("When the file format is allowed", () => {
      test("Then it should update the file input with its name", () => {
        const newBill = new NewBill({
          document, onNavigate, store: mockStore, localStorage: window.localStorage
        })
        
        const file = screen.getByTestId("file")
        // INFO -- Liste type fichiers : https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        const testFileData = {
          file: new File(["img"], "test.png", { type: "image/png" })
        }
  
        const handleChangeFile = jest.fn(newBill.handleChangeFile);
        file.addEventListener("change", handleChangeFile);
        userEvent.upload(file, testFileData.file);
        
        expect(file.files[0].name).toBe("test.png");
      })
    })
  })
  
  
  describe("Given I click the Submit button", () => {
      test("Then the handleSubmit function should be called", () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        window.onNavigate(ROUTES_PATH.NewBill)
        
        const newBill = new NewBill({
          document, onNavigate, store: mockStore, localStorage: window.localStorage
        })

        const formNewBill  = screen.getByTestId('form-new-bill')
        const handleSubmit = jest.fn(newBill.handleSubmit)
        formNewBill.addEventListener("submit", handleSubmit)
        fireEvent.submit(formNewBill)

        expect(handleSubmit).toHaveBeenCalled()
      })
    // test("Then it should create a new bill and redirect to Bills page", () => {
    //   Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    //   window.localStorage.setItem('user', JSON.stringify({
    //     type: 'Employee'
    //   }))

    //   window.onNavigate(ROUTES_PATH.NewBill)
      
    //   const newBill = new NewBill({
    //     document, onNavigate, store: mockStore, localStorage: window.localStorage
    //   })

    //   const testBillData = {
    //     type: "Transports",
    //     name: "Parking Indigo Paris",
    //     date: "2022-09-06",
    //     amount: "25",
    //     vat: "5",
    //     pct: "20",
    //     commentary: "Bill for test",
    //     file: new File(['image'], 'test.png', { type: 'image/png' })
    //   }

    //   const inputType = screen.getByTestId('expense-type')
    //   const inputName = screen.getByTestId('expense-name')
    //   const inputDate = screen.getByTestId('datepicker')
    //   const inputAmmount = screen.getByTestId('amount')
    //   const inputVat = screen.getByTestId('vat')
    //   const inputPct = screen.getByTestId('pct')
    //   const inputComment= screen.getByTestId('commentary')
    //   const inputFile = screen.getByTestId('file')
    //   const submitNewBill  = screen.getByTestId('submitNewBill')

    //   fireEvent.change(inputType, { target: { value: testBillData.type } })
    //   fireEvent.change(inputName, { target: { value: testBillData.name } })
    //   fireEvent.change(inputDate, { target: { value: testBillData.date } })
    //   fireEvent.change(inputAmmount, { target: { value: testBillData.amount } })
    //   fireEvent.change(inputVat, { target: { value: testBillData.vat } })
    //   fireEvent.change(inputPct, { target: { value: testBillData.pct } })
    //   fireEvent.change(inputComment, { target: { value: testBillData.commentary } })
    //   fireEvent.change(inputFile, { target: { value: testBillData.file } })
      
    //   const handleSubmit = jest.fn(newBill.handleSubmit)
    //   submitNewBill.addEventListener("submit", handleSubmit)
    //   fireEvent.submit(submitNewBill)
      
    //   // expect all inputs to be entered
    //   // expect updateBill to be called
    //   expect(handleSubmit).toHaveBeenCalled()
      
      
    // })
  })
})
