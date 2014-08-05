//probably won't support group chat for now

var serverUrl = "http://127.0.0.1:3000";
var chat, input, newInput, button, link, titlebar, groupChat, chatId = null;
function extractUsername(link) {
    return link.substring(link.lastIndexOf("/") + 1);
}

window.onload=function(){
    var interval = setInterval(function(){
        if(!u(document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0]) && !u(document.getElementsByClassName('uiTextareaAutogrow _552m')[0])){//page has rendered
            setup();
            clearInterval(interval);
        }
        // else{//everything's rendered
        //     clearInterval(interval);
        //     finished();//to call once page and random facebook stuff has rendered
        // }
    },100)
}

function finished(){
    console.log('load done');
    getChat("test");
}

function setup(){
    chat = document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0]; //chatbox
    input = chat.getElementsByClassName('uiTextareaAutogrow _552m')[0]; //where text is put
    input.style.display="none";
    newInput = document.createElement('textarea');
    newInput.className="uiTextareaAutogrow _552m";

    newInput.onkeydown = function(event){
        if (event.which == 13) {
            console.log(this.value); //send to db
            this.value = "";
        }
    }

    input.parentElement.appendChild(newInput);//now the new textbox is there

    var x = '<a data-hover="tooltip" aria-label="Toggle off-the-record mode. Red means off the record." class="button" style="background-color:#D91E18;width:16px;height:16px;margin-top:5px;border-radius:16px;" data-ft="{&quot;tn&quot;:&quot;+F&quot;}" role="button" id="secure-toggle"></a>'
    document.getElementsByClassName('mls titlebarButtonWrapper rfloat _ohf')[0].innerHTML = x + document.getElementsByClassName('mls titlebarButtonWrapper rfloat _ohf')[0].innerHTML;

    button = document.getElementById('secure-toggle');
    button.onclick=function(){//kind of works, but also miniminzes chat window
    	switchInputVisibility();
    }

    titlebar = chat.getElementsByClassName('titlebarText')[0];
    groupChat = titlebar.href.indexOf("messages/conversation-id.") > -1 //whether or not it's a group chat
    chatId = extractUsername(titlebar.href).replace("conversation-id.", "");
    link = extractUsername(document.getElementsByClassName('_2dpe _1ayn')[0].href); //gets current user's username
    chatId = [chatId,link].sort().join("");
    console.log(chatId);
    console.log("THE ID");//we need a better, securer way to generate the id
    //var oldScroll = tempscr.scrollTop;
    //var scr = chat.getElementsByClassName('fbNubFlyoutBody scrollable')[0];
    //scr.scrollTop = oldScroll; //scrolls to where it was before the cloning

    // input.onkeydown = function(event) {
    //     if (event.which == 13) {
    //         console.log(this.value); //send to db
    //         this.value = "";
    //     }
    // }

    //document.URL.substring(document.URL.lastIndexOf("/") + 1);forgot what this is actually doing...
    finished();
}

function switchInputVisibility(){
    input.style.display = input.style.display == "none" ? "" : "none";
    newInput.style.display = newInput.style.display == "none" ? "" : "none";
    button.style.backgroundColor = button.style.backgroundColor == "rgb(217, 30, 24)" ? "#26A65B" : "#D91E18";
}//toggles back and forth

function isDefaultInputActive(){
    return input.style.display == "";//tells if the normal facebook input is active or not
}


function getChat(convId) {
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response = xmlhttp.responseText; //to be appended into chat
            console.log(response);
        }
    }
    var url = serverUrl + "/messages?convId=" + convId;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function send(message, convId) { //still need a way to generate the convid effectively
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response = xmlhttp.responseText; //to be appended into chat
        } else if (xmlhttp.status != 200) {
            alert("Message did not send - error")
        }
    }
    var url = serverUrl + "/submit?message=" + message + "&from=" + link + "&convId=" + convId;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function u(a){
    return a===null || a===undefined;
}