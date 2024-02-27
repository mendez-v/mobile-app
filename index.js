import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://shopping-cart-34f59-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


const $ = selector => document.getElementById(selector)
const inputField = $("input-field"),
      addBtn = $("add-btn"),
      shoppingListEl = $("shopping-list")


let inputValue = ""
addBtn.addEventListener("click", () => {
  inputValue = inputField.value

  if (inputValue.length < 1) {
    console.log("Enter product")
    inputField.focus()
  } else {
    push(shoppingListInDB, inputValue)
  
    clearInput()
  }

})

onValue(shoppingListInDB, function(snapshot) {
  if (snapshot.exists()) {
    let itemsArr = Object.entries(snapshot.val())

    clearShoppingListEl()

    for (let i = 0; i < itemsArr.length; i++) {
      let currentItem = itemsArr[i]

      appendItemToShoppingListEl(currentItem)
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet"
  }
})

function appendItemToShoppingListEl(item) {
  let itemID = item[0]
  let itemValue = item[1]

  let LI = document.createElement("LI")
  LI.textContent = itemValue

  LI.addEventListener("click", () => {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

    remove(exactLocationOfItemInDB)
  })

  shoppingListEl.append(LI)
}


function clearInput() {
  inputField.value = ""
  inputField.focus()
}
function clearShoppingListEl() {
  shoppingListEl.innerHTML = ""
}