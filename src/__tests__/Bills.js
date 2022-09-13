/**
 * @jest-environment jsdom
 */

// import {screen, waitFor} from "@testing-library/dom"
import "@testing-library/jest-dom"
import { screen, waitFor } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"

import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import { ROUTES } from "../constants/routes.js";
import { ROUTES_PATH} from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

// INFO -- jest.mock() = Permet de tester sans toucher à l'API (et donc créer des tests lents et fragiles)
jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      // INFO -- La méthode statique Object.defineProperty() permet de définir une nouvelle propriété ou de modifier une propriété existante, directement sur un objet. La méthode renvoie l'objet modifié.
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // INFO -- La méthode setItem() de l'interface Storage, lorsque lui sont passées le duo clé-valeur, les ajoute à l'emplacement de stockage, sinon elle met à jour la valeur si la clé existe déjà.
      // INFO -- La méthode JSON.stringify() convertit une valeur JavaScript en chaîne JSON. Optionnellement, elle peut remplacer des valeurs ou spécifier les propriétés à inclure si un tableau de propriétés a été fourni.
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      
      // expect(windowIcon).toHaveClass('active-icon')
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
      

    })
    test("Then bills should be ordered from earliest to latest", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const billsContainer = new Bills({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      let result = await billsContainer.getBills()
      let dates = result.map(bill => Date.parse(bill.date))
      // document.body.innerHTML = BillsUI({ data: bills })
      // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I click on the new bill button", ()=> {
    test("Then it should open the employee new bill page", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const billsContainer = new Bills({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })
      document.body.innerHTML = BillsUI({ data: bills })
     
      // Récupération du bouton "New "
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const newBillButton = screen.getByTestId("btn-new-bill");

      // INFO -- jest.fn() Fonctions simulées
      // Récupèration de la fonction handleClickNewBill
      const handleClickNewBillButton = jest.fn(billsContainer.handleClickNewBill);

      // INFO -- user-event is a companion library for Testing Library that simulates user interactions by dispatching the events that would happen if the interaction took place in a browser.
      // Ajout event listener et simulation du click
      newBillButton.addEventListener("click", handleClickNewBillButton);
      userEvent.click(newBillButton);

      //INFO -- Utilisez .toHaveBeenCalledWith pour vous assurer qu'une fonction simulée a été appelée avec des arguments spécifiques. Les arguments sont vérifiés avec le même algorithme que celui de .toEqual.
      expect(handleClickNewBillButton).toHaveBeenCalled();
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
      
    });
  })

  describe("When I click on an eye icon", () => {
    test("Then it should open the bill modal", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const billsContainer = new Bills({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })
      
      document.body.innerHTML = BillsUI({ data: bills })
      
      // on récupère les boutons eyes
      const eyeIcons = screen.getAllByTestId("icon-eye")[0];
      // on récupère la fonction qui ouvre la modale
      const handleClickEye = jest.fn(() =>
        billsContainer.handleClickIconEye(eyeIcons)
      );
      // Simulation du click
      eyeIcons.addEventListener("click", handleClickEye);
      userEvent.click(eyeIcons);
      // vérification
      expect(handleClickEye).toHaveBeenCalled();
      const modal = screen.getByTestId("modaleFile");
      expect(modal).toBeTruthy();
    });
  });
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      // 
      const pageTitle = await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(pageTitle).toBeTruthy()
      // const contentPending  = await screen.getByText("En attente (1)")
      // expect(contentPending).toBeTruthy()
      // const contentRefused  = await screen.getByText("Refusé (2)")
      // expect(contentRefused).toBeTruthy()
      // expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
    })
  })
  describe("When an error occurs on API", () => {
    // INFO -- beforeEach() est exécuté avant chaque test
    beforeEach(() => {
      // INFO -- jest.spyOn(object, methodName) = fonction simulée. Crée une fonction simulée similaire à jest.fn mais qui surveille également les appels à objet[methodName]. Retourne une fonction simulée de Jest.
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })

    test("fetches bills from an API and fails with 404 message error", async () => {
      // INFO - mockImplementationOnce() = Permete de recréer un comportement complexe d'une fonction simulée, de sorte que plusieurs appels de fonction produisent des résultats différents
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await waitFor(() => screen.getByText(/Erreur 404/))
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  
})
