const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in ls
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();



//Item Controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id,name,calories){
      this.id = id
      this.name = name
      this.calories = calories
  }

  //Data Structure
  const data = {
    items : StorageCtrl.getItemsFromStorage(),
    //[
      // { id:0, name: 'Milk',calories: 30},
      // { id:1, name: 'Leche',calories: 35}
    //],
    currentItem : null,
    totalCalories: 0
  }




  //Public Methods
return{
  getItems : function(){
    return data.items
  },
  addItem : function(name, calories){
    //Generate ID
    let ID
    if(data.items.length > 0){
      ID = data.items[data.items.length-1].id + 1 //pairnei to teleutai index tou pinaka kai pros8etei ena

    }else{
      ID = 0
    }
    //Calorie to number

     calories = parseInt(calories)

     //Create a new Item
     //call the Constructor
     newItem = new Item(ID, name, calories)

     data.items.push(newItem)

     return newItem
  },
  getTotalCalories: function(){
    let total = 0
    data.items.forEach(function(item){
      total += item.calories
    })
    //Set total calories in data stracture
    data.totalCalories = total
    return data.totalCalories
  },
  getItemByID : function(id){
    let found = null

    //Loop through items in order to find the id that i asked
    data.items.forEach(function(item){
      if(item.id === id ){
        found = item
      }
    })
    return found
  },
  updateItem : function(name, calories){
    //Calories to number
    calories = parseInt(calories)

    let found = null

    //Loop through items in order to find the id that i asked
    data.items.forEach(function(item){
      if(item.id === data.currentItem.id ){
        item.name = name
        item.calories = calories
        found = item
      }
    })
    return found
  },
  setCurrentItem : function(item){
    data.currentItem =item
  },
  getCurrentItem : function(){
    return data.currentItem
  },
  deleteItem: function(id){
        // Get ids
        const ids = data.items.map(function(item){
          return item.id;
        });

        // Get index
        const index = ids.indexOf(id);

        // Remove item
        data.items.splice(index, 1);
  },
  clearAllItems: function(){
     data.items = [];
   },



  logData: function(){
    return data
  }
}
})()






// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    listItems: '#item-list li',
    clearBtn: '.clear-btn'


  }

  // Public methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name : document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem : function(item){
      //Show the list

      document.querySelector(UISelectors.itemList).style.display= 'block'
      //Create li element

      const li = document.createElement('li')
      //Add Class
      li.className = 'collection-item'
      //Add id
      li.id = `item-${item.id}`
      //Add HTML
      li.innerHTML = `  <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`
        // Insert list items
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItem : function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems)
          console.log(listItems)
      //Turn Node list into an array

      listItems = Array.from(listItems)

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id')

        if(itemID === `item-${item.id}`){
            document.querySelector(`#${itemID}`).innerHTML=`
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            `
        }
      })

    },
    deleteListItem: function(id){
    const itemID = `#item-${id}`;
    const item = document.querySelector(itemID);
    item.remove();
  },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value =''
      document.querySelector(UISelectors.itemCaloriesInput).value =''
    },
    addItemToForm : function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
      document.querySelector(UISelectors.itemCaloriesInput).value =ItemCtrl.getCurrentItem().calories

      UICtrl.showEditState()
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },

    hideList : function(){
      document.querySelector(UISelectors.itemList).style.display= 'none'
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },
    clearEditState : function(){
      UICtrl.clearInput()
      document.querySelector(UISelectors.addBtn).style.display= 'inline'
      document.querySelector(UISelectors.updateBtn).style.display= 'none'
      document.querySelector(UISelectors.deleteBtn).style.display= 'none'
      document.querySelector(UISelectors.backBtn).style.display= 'none'
    },
    showEditState : function(){

      document.querySelector(UISelectors.addBtn).style.display= 'none'
      document.querySelector(UISelectors.updateBtn).style.display= 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display= 'inline'
      document.querySelector(UISelectors.backBtn).style.display= 'inline'
    },

    getSelectors: function(){
      return UISelectors;
    }
  }
})();



// App Controller
const App = (function(ItemCtrl, StorageCtrl,  UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();



    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit); //den grafw UICtrl.getSelectors to exw kanei ana8esh mia grammh panw

    //Disable Submit on enter

    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault()
        return false
      }
    })
    //Edit icon click event

    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick)

    //Updte Item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit)


    //Back btn Event
   document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)

   // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)


     // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);


  }

  // Add item submit
  const itemAddSubmit = function(e){
    //Get inputs from UI Controller
    const input = UICtrl.getItemInput()

    //Check
    if(input.name !== '' && input.calories !== ''){

        //Add Item
        const newItem = ItemCtrl.addItem(input.name, input.calories)
        //Add Item to UI list
        UICtrl.addListItem(newItem)

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        //Add totalCalories to Ui
        UICtrl.showTotalCalories(totalCalories)


        //Store in localStorage
        StorageCtrl.storeItem(newItem)

        //clear the input fields
        UICtrl.clearInput()

    }

    e.preventDefault();
  }


      //Click edit item
      const itemEditClick = function(e){
        e.preventDefault();
        if(e.target.classList.contains('edit-item')){
          //get id of the clicked item from the li (item-0,item-1)
          const listId = e.target.parentNode.parentNode.id //result = item-0
          //Break into an array

          const listIdArr = listId.split('-')

          console.log(listIdArr)

          //Get the actual id
          const id  = parseInt(listIdArr[1])

          //Get items
          const itemToEdit = ItemCtrl.getItemByID(id)

          //Set current Item

          ItemCtrl.setCurrentItem(itemToEdit)

          //Add item to form
          UICtrl.addItemToForm()

        }
      }


//Update item

const itemUpdateSubmit = function(e){
  e.preventDefault();
  //Get Item Input
   const input = UICtrl.getItemInput()

   //Update Item
   const updatedItem = ItemCtrl.updateItem(input.name , input.calories)
   //Update UI
   UICtrl.updateListItem(updatedItem)

   //Get total calories
   const totalCalories = ItemCtrl.getTotalCalories()
   //Add totalCalories to Ui
   UICtrl.showTotalCalories(totalCalories)

   // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

   //clear the input fields
   UICtrl.clearEditState()


}

const itemDeleteSubmit = function(e){
  e.preventDefault();
  // Get current item
   const currentItem = ItemCtrl.getCurrentItem();

   // Delete from data structure
   ItemCtrl.deleteItem(currentItem.id);

   // Delete from UI
   UICtrl.deleteListItem(currentItem.id);

   // Get total calories
   const totalCalories = ItemCtrl.getTotalCalories();
   // Add total calories to UI
   UICtrl.showTotalCalories(totalCalories);

   // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

   UICtrl.clearEditState();
}

// Clear items event
  const clearAllItemsClick = function(){
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from local storage
    StorageCtrl.clearItemsFromStorage();

    // Clear from local storage
    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UICtrl.hideList();

  }

  // Public methods
  return {
    init: function(){
      //Clear Edit State
      UICtrl.clearEditState()
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      //Check if any items
      if(items.length ===0){
            UICtrl.hideList()
      }else{
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories()
      //Add totalCalories to Ui
      UICtrl.showTotalCalories(totalCalories)

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl,  UICtrl);

// Initialize App
App.init();
