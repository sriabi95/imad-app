
//counter increment reflected in server also

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

//submit name

var submit = document.getElementById('submit-btn');
submit.onclick = function(){
    var request = new XMLHttpRequest();
     request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){      //200 is the successful response
                /*var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();*/
                
                var names = request.responseText;
                names = JSON.parse(names);
                
                var list = '';
                for(var i=0; i<names.length; i++){
                    list = list + '<li>' + names[i] + '</li>';
                }
                var ul = document.getElementById('namelist');
                ul.innerHTML = list;
            }
        } 
     };
    //make a request
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
                
    request.open('GET','http://sriabi95.imad.hasura-app.io/submit-name?name=' + name,true);
    request.send(null);
    
    
};

