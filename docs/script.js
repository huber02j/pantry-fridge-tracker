document.getElementById('pantryInputForm').addEventListener('submit', saveFood);

function saveFood(e) {
  var foodGroup = document.getElementById('foodGroupInput').value;
  var foodDesc = document.getElementById('pantryItemInput').value;
  var foodQuantity = document.getElementById('pantryQuantityInput').value;
  var expirationDate = document.getElementById('expirationInput').value;
  var foodId = Math.random();
  var foodStatus = 'Full';

  var food = {
    id: foodId,
    name: foodDesc,
    quantity: foodQuantity,
    group: foodGroup,
    status: foodStatus,
    expiration: expirationDate
  }

  if (localStorage.getItem('foods') == null) {
    var foods = [];
    foods.push(food);
    localStorage.setItem('foods', JSON.stringify(foods));
  } else {
    var foods = JSON.parse(localStorage.getItem('foods'));
    var previous = false;
    for (let oldFood of foods) {
      if (oldFood.name == food.name && oldFood.group == food.group) {
        oldFood.quantity = Number(oldFood.quantity) + Number(food.quantity);
        oldFood.status = "Full";
        if(food.expiration){
          oldFood.expiration = (oldFood.expiration > food.expiration) ? oldFood.expiration : food.expiration;
        }
        previous = true;
      }
    }
    if (!previous){
      foods.push(food);
    }
    localStorage.setItem('foods', JSON.stringify(foods));
  }

  document.getElementById('pantryInputForm').reset();

  updateGroceryList()
  fetchPantry();

  e.preventDefault();
}

function setStatusLow(id) {
  var foods = JSON.parse(localStorage.getItem('foods'));

  for (var i = 0; i < foods.length; i++) {
    if (foods[i].id == id) {
      foods[i].status = 'Low';
      
    }
  }

  localStorage.setItem('foods', JSON.stringify(foods));

  fetchPantry();
}

function decrementQuantity(id) {
  var foods = JSON.parse(localStorage.getItem('foods'));

  for (var i = 0; i < foods.length; i++) {
    if (foods[i].id == id) {
      foods[i].quantity -= 1;
      
    }
  }

  localStorage.setItem('foods', JSON.stringify(foods));

  fetchPantry();
}

function deleteFood(id) {
  var foods = JSON.parse(localStorage.getItem('foods'));

  for (var i = 0; i < foods.length; i++) {
    if (foods[i].id == id) {
      foods.splice(i, 1);
    }
  }

  localStorage.setItem('foods', JSON.stringify(foods));

  fetchPantry();
}

function removeFromList(id){
  var div = document.getElementById(id);
  div.parentNode.removeChild(div);
  
}

function updateGroceryList() {
  var foods = JSON.parse(localStorage.getItem('foods'));
  var groceryList = document.getElementById('groceryList');
  groceryList.innerHTML = '';
  
  for (var food of foods){
    groceryList.innerHTML += '<ul id="'+ food.id +'">' + food.name + ' -- Buy On:' + food.expiration + '<button class="noprint" style="float:right;" onclick="removeFromList(\''+food.id+'\')\">Remove</button></ul>'
  }
}

function fetchPantry() {
  var foods = JSON.parse(localStorage.getItem('foods'));
  var pantryList = document.getElementById('pantryList');
  var fridgeList = document.getElementById('fridgeList');

  pantryList.innerHTML = '';
  fridgeList.innerHTML = '';


  for (var i = 0; i < foods.length; i++) {
    var id = foods[i].id;
    var name = foods[i].name;
    var quantity = foods[i].quantity;
    var group = foods[i].group;
    var status = foods[i].status;
    var exp = foods[i].expiration;
    
    var statusHtml = (status == "Low") ? '<p><span class="status label label-danger">' + status + '</span></p>' : '<p><span class="status label label-info">' + status + '</span></p>';
    var newHtml =             '<div class="well">'+
                              '<h4>Group: ' + group + '</h4>'+
                              '<h6>Food ID: ' + id + '</h6>'+
                              statusHtml +
                              '<h3>' + name + '</h3>'+
                              '<p><span class="glyphicon glyphicon-plus-sign"></span> ' + quantity + '</p>'+
                              '<p><span class="glyphicon glyphicon-calendar"></span> Expiration Date: <br>' + exp + '</p>'+
                              '<a href="#" onclick="setStatusLow(\''+id+'\')" class="btn btn-warning">Low</a> '+
                              '<a href="#" onclick="deleteFood(\''+id+'\')" class="btn btn-danger">Delete</a>'+
                              '<a href="#" onclick="decrementQuantity(\''+id+'\')" class="btn btn-primary">Decrement Quantity</a>';
    if (group == "Pantry"){
      pantryList.innerHTML += newHtml;
    } else {
      fridgeList.innerHTML += newHtml;
    }
  }
}