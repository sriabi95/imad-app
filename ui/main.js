/*console.log('Loaded!');
//change the text of main_text div
var element = document.getElementById("main_text");
element.innerHTML = "New Value";

//move the image
var img = document.getElementById("abi");
var marginLeft = 0;

function moveRight (){
    marginLeft = marginLeft + 1;
    img.style.marginLeft = marginLeft + "px";
}

img.onclick = function(){
    var interval = setInterval(moveRight, 100);
//    img.style.marginLeft = '100px';
};*/

/*var counter = 0;
var button = document.getElementById('counter');

button.onclick = function(){
   //make a request to the counter endpoint
   
   //capture the response and store it in a variable
   
   //render the variable in the correct span
   counter = counter + 1;
   var span = document.getElementById('count');
   span.innerHTML = counter.toString();
};*/

var button = document.getElementById('counter');

button.onclick = function(){
//create a request object
     var request = new XMLHttpRequest();
     request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status == 200){
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        } 
     };
    //make a request
    request.open('GET','http://sriabi95.imad.hasura-app.io/counter',true);
    request.send(null);
};

var nameInput = document.getElementById('name');
var name = nameInput.value;
var submit = document.getElementbyId('submit_button');
submit.onclick = function(){
    var names = ['name1','name2','name3','name4'];
    var list = '';
    for(var i=0; i<names.length; i++){
        list <= '<li>' + names[i] + '</li>';
    }
    var ul = document.getElementbyId('namelist');
    ul.innerHTML = list;
};

