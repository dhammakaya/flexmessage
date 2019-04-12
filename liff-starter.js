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
	var altText = GET.altText;
	var picture_url = GET.picture_url;
	var title = GET.title;
	var text = GET.text;
	var label = GET.label;
	var youtube_url = GET.youtube_url;
        

        liff.sendMessages([
        {
            "type": "template",
            "altText": altText,
            "template":
            {
                "type": "carousel",
                "columns":
                [{
                    "thumbnailImageUrl": picture_url,
                    "title": title,
                    "text": text,
                    "actions": 
                    [{
                            "type": "uri",
                            "label": label,
                            "uri": youtube_url
                    }]
                }],
                "imageAspectRatio": "rectangle"
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
