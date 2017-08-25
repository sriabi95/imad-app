console.log('Loaded!');
//change the text of main_text div
var element = document.getElementById("main_text");
element.innerHTML = "New Value";

//move the image
var img = document.getElementById("abi");
var marginLeft = 0;

function moveRight (){
    marginLeft = marginLeft + 1;
    img.style.marginLeft = marginLeft + "px";
};

img.onclick = function(){
    var interval = setInterval(moveRight, 100);
//    img.style.marginLeft = '100px';
};