'use strict';

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false},
    {id: cuid(), name: 'oranges', checked: false},
    {id: cuid(), name: 'milk', checked: true},
    {id: cuid(), name: 'bread', checked: false}
  ],
  hideCompleted: false
};

function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : 
    ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
          <span class="button-label">edit</span>
          </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item) => generateItemElement(item));
  
  return items.join('');
}


function renderShoppingList(searchValue) {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');

  let list = STORE.items;
  if (searchValue != null) {
    list = list.filter(item => item.name.includes(searchValue));
  }
  
  // set up a copy of the store's items in a local variable that we will reassign to a new
  // version if any filtering of the list occurs
  // let filteredItems = STORE.items;

  // if the `hideCompleted` property is true, then we want to reassign filteredItems to a version
  // where ONLY items with a "checked" property of false are included
  if (STORE.hideCompleted) {
    list = list.filter(item => !item.checked);
  }

  // at this point, all filtering work has been done (or not done, if that's the current settings), so
  // we send our `filteredItems` into our HTML generation function 
  const shoppingListItemsString = generateShoppingItemsString(list);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  console.log('Toggling checked property for item with id ' + itemId);
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}


function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}


// name says it all. responsible for deleting a list item.
function deleteListItem(itemId) {
  console.log(`Deleting item with id  ${itemId} from shopping list`);
  const itemIndex = STORE.items.findIndex(item => item.id === itemId);
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIdFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

// Toggles the STORE.hideCompleted property
function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

// Places an event listener on the checkbox for hiding completed items
function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', () => {
    toggleHideFilter();
    renderShoppingList();
  });
}

/* A. user can type in a search term and the displayed list will be filtered by item names only containing that search term
1. add search item to HTML that takes text input and returns a string of the 'user-input'
2. then search the STORE.items for items that contains (but doesn't necessarily need to be the full
word of) that text 'user-input'
3. return the filtered out STORE.items list to only show items that match the 'user-input'
4. use that filtered STORE.items object list to be utilized through the renderlist: if a user 'submits' text, 
render list will be run using the filtered STORE.items object
5. renderShoppingList()
*/

function searchBar(){
  $('#js-shopping-list-search').submit(function(event) {
    event.preventDefault();
    let searchValue = $(event.currentTarget).find('.js-shopping-list-search-item').val();
    renderShoppingList(searchValue);
  });
}
/*
B. User can edit the title of an item 
1. make the current item editable= add button called edit on click, create input form and clear the current
the list item
3. on submit, change the list item in STORE.items for the one with the closest matching ID
4. render the list 
*/

////actually editing the STORE.items item
function editItem(itemId, editedText){
  STORE.items.find(item => item.id === itemId).name = editedText;
}
// when edit button is clicked, opens prompt window to edit text, and then runs edit item to change STORE
function handleEditItem(){
  console.log('handleEditItem runs');
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    let currentContent = $(event.currentTarget).parent().prev();
    let editedText = prompt('Edit Me', currentContent.text());
    let itemId = getItemIdFromElement(currentContent);
    console.log(itemId);
    if (editedText !== null){
      editItem(itemId, editedText);
      renderShoppingList();
    }
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  searchBar();
  handleEditItem();

}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
