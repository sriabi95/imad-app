


//submit username and password

var submit = document.getElementById('submit-btn');
submit.onclick = function(){
    var request = new XMLHttpRequest();
     request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){

                if(request.status === 200){
                    console.log("user logged in");
                   alert('logged in successfully'); 
                }
                else if(request.status === 403){
                   alert('username/password is incorrect'); 
                }
                else if(request.status === 500){
                   alert('something went wrong on the server');
                }

        } 
     };
    //make a request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    /*request.open('GET','http://sriabi95.imad.hasura-app.io/submit-name?name=' + name,true);
    request.send(null);*/
    request.open('POST','http://sriabi95.imad.hasura-app.io/login',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username : username, password : password}));
    
    
};

