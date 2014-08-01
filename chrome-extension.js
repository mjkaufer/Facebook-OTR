//probably won't support group chat for now


function extractUsername = function(link){
	return link.substring(link.lastIndexOf("/")+1);
}

//currently only effects first chatbox
document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0].id = "mjkaufer2cool"

var tempchat = document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0];

var tempscr = chat.getElementsByClassName('fbNubFlyoutBody scrollable')[0];

var oldScroll = tempscr.scrollTop;

var el = document.getElementById('mjkaufer2cool'), elClone = el.cloneNode(true);

el.parentNode.replaceChild(elClone, el);//gets rid of fb's events so hitting enter doesn't send the message to fb

var chat = document.getElementsByClassName('fbNubFlyout fbDockChatTabFlyout uiContextualLayerParent')[0];//chatbox

var titlebar = chat.getElementsByClassName('titlebarText')[0];
var groupChat = titlebar.href.indexOf("messages/conversation-id.") > -1//whether or not it's a group chat
var chatid = extractUsername(titlebar.href).replace("conversation-id.","");

var scr = chat.getElementsByClassName('fbNubFlyoutBody scrollable')[0];

scr.scrollTop = oldScroll;//scrolls to where it was before the cloning

var input = chat.getElementsByClassName('uiTextareaAutogrow _552m')[0];//where text is put


input.onkeydown=function(event){

	if(event.which==13){
	console.log(this.value);//send to db
	this.value="";
	}

}



var link = extractUsername(document.getElementsByClassName('_2dpe _1ayn')[0].href);//gets current user's username

document.URL.substring(document.URL.lastIndexOf("/")+1)