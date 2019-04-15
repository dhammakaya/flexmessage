window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};

var GET = {};
var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++) {
if (query[i] === "") // check for trailing & with no param
  continue;
  var param = query[i].split("=");
  GET[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
}

function initializeApp(data) {
    document.getElementById('languagefield').textContent = data.language;
    document.getElementById('viewtypefield').textContent = data.context.viewType;
    document.getElementById('useridfield').textContent = data.context.userId;
    document.getElementById('utouidfield').textContent = data.context.utouId;
    document.getElementById('roomidfield').textContent = data.context.roomId;
    document.getElementById('groupidfield').textContent = data.context.groupId;

    // openWindow call
    document.getElementById('openwindowbutton').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://photoofdays.blogspot.com'
        });
    });

    // closeWindow call
    document.getElementById('closewindowbutton').addEventListener('click', function () {
        liff.closeWindow();
    });

    // sendMessages call
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
	var altText = GET['altText'];
	var FlexImage = GET['FlexImage'];
	var FlexHeader = GET['FlexHeader'];
	var FlexText = GET['FlexText'];
	var FlexLabel = GET['FlexLabel'];
	var FlexLink = GET['FlexLink'];
	var cContents = Box_ImageCenter(FlexHeader, FlexImage, FlexText, FlexLabel, FlexLink, 'md', 'xl');
        liff.sendMessages([
	{
	  "type": "flex",
	  "altText": altText,
	  "contents": 
	  {
	    "type": "carousel",
	    "contents": cContents
	  }
	}
        ]).then(function () {
            // window.alert("Message sent");
            liff.closeWindow();
        }).catch(function (error) {
            window.alert("Error sending message: " + error);
        });
    });

    // get access token
    document.getElementById('getaccesstoken').addEventListener('click', function () {
        const accessToken = liff.getAccessToken();
        document.getElementById('accesstokenfield').textContent = accessToken;
        toggleAccessToken();
    });

    // get profile call
    document.getElementById('getprofilebutton').addEventListener('click', function () {
        liff.getProfile().then(function (profile) {
            document.getElementById('useridprofilefield').textContent = profile.userId;
            document.getElementById('displaynamefield').textContent = profile.displayName;

            const profilePictureDiv = document.getElementById('profilepicturediv');
            if (profilePictureDiv.firstElementChild) {
                profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
            }
            const img = document.createElement('img');
            img.src = profile.pictureUrl;
            img.alt = "Profile Picture";
            profilePictureDiv.appendChild(img);

            document.getElementById('statusmessagefield').textContent = profile.statusMessage;
            toggleProfileData();
        }).catch(function (error) {
            window.alert("Error getting profile: " + error);
        });
    });
}

function toggleAccessToken() {
    toggleElement('accesstokendata');
}

function toggleProfileData() {
    toggleElement('profileinfo');
}

function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = "none";
    } else {
        elem.style.display = "block";
    }
}

function Box_ImageCenter(FlexHeader, FlexImage, FlexText, FlexLabel, FlexLink, HeaderSize, BodySize) {
    return {
        "type": "bubble",
        "header":{
            "type": "box",
            "layout": "vertical",
            "contents": [{
                "type": "text",
                "text": FlexHeader,
                "weight": "bold",
                "color": "#0061ff",
                "size": HeaderSize,
                "align": "center"
            }]
        },
        "hero": {
            "type": "image",
            "url": FlexImage,
            "size": "full",
            "aspectRatio": "4:3"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [{
                "type": "text",
                "text": FlexText,
                "size": BodySize,
                "color": "#1A4876"
            }]
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [{
                "type": "button",
                "margin": "xl",
                "action": {
                    "type": "uri",
                    "label": FlexLabel,
                    "uri": FlexLink
                },
                "style": "primary"
            }]
        }
    };
}
