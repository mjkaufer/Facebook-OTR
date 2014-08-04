//probably won't support group chat for now
var serverUrl = "http://127.0.0.1:3000";

function extractUsername(link) {
    return link.substring(link.lastIndexOf("/") + 1);
}

//currently only effects first chatbox
document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0].id = "mjkaufer2cool"

var tempchat = document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0];

var tempscr = tempchat.getElementsByClassName('fbNubFlyoutBody scrollable')[0];

/*var el = document.getElementById('mjkaufer2cool'),
    elClone = el.cloneNode(true);

el.parentNode.replaceChild(elClone, el); //gets rid of fb's events so hitting enter doesn't send the message to fb

var chat = document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0];*/
//^SIMPLY APPEND A NEW TEXTAREA WITH THE SAME CLASS AND HAVE THE OLD ONE HIDDEN TO MAKE AN EASY WAY TO SWITCH BACK AND FORTH

var chat = document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0]; //chatbox
var input = chat.getElementsByClassName('uiTextareaAutogrow _552m')[0]; //where text is put
input.style.display="none";
var newInput = document.createElement('textarea');
newInput.className="uiTextareaAutogrow _552m";

newInput.onkeydown = function(event){
    if (event.which == 13) {
        console.log(this.value); //send to db
        this.value = "";
    }
}

input.parentElement.appendChild(newInput);//now the new textbox is there

var x = '<a data-hover="tooltip" aria-label="Toggle off-the-record mode. Red means off the record." class="button" style="background-color:#D91E18;width:16px;height:16px;margin-top:5px;border-radius:16px;" data-ft="{&quot;tn&quot;:&quot;+F&quot;}" role="button" id="secure-toggle"></a>'
document.getElementsByClassName('mls titlebarButtonWrapper rfloat _ohf')[0].innerHTML = x + document.getElementsByClassName('mls titlebarButtonWrapper rfloat _ohf')[0].innerHTML
var button = document.getElementById('secure-toggle');
button.onclick=function(){//kind of works, but also miniminzes chat window
	switchInputVisibility();
}

function switchInputVisibility(){
	input.style.display = input.style.display == "none" ? "" : "none";
	newInput.style.display = newInput.style.display == "none" ? "" : "none";
	button.style.backgroundColor = button.style.backgroundColor == "rgb(217, 30, 24)" ? "#26A65B" : "#D91E18";
}//toggles back and forth

function isDefaultInputActive(){
	return input.style.display == "";//tells if the normal facebook input is active or not
}

var titlebar = chat.getElementsByClassName('titlebarText')[0];
var groupChat = titlebar.href.indexOf("messages/conversation-id.") > -1 //whether or not it's a group chat
var chatid = extractUsername(titlebar.href).replace("conversation-id.", "");
//var oldScroll = tempscr.scrollTop;
//var scr = chat.getElementsByClassName('fbNubFlyoutBody scrollable')[0];
//scr.scrollTop = oldScroll; //scrolls to where it was before the cloning

// input.onkeydown = function(event) {
//     if (event.which == 13) {
//         console.log(this.value); //send to db
//         this.value = "";
//     }
// }

var link = extractUsername(document.getElementsByClassName('_2dpe _1ayn')[0].href); //gets current user's username

document.URL.substring(document.URL.lastIndexOf("/") + 1)

function getChat(convId) {
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response = xmlhttp.responseText; //to be appended into chat
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
