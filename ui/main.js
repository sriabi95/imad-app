console.log('Loaded!');
//change the text of main_text div
var element = document.getElementById("main_text");
element.innerHTML = "New Value";

//move the image
var img = document.getElementById("abi");
img.onclick = function(){
    img.style.marginLeft = '100px';
};