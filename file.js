

console.log("Content script installed");

// window.onload = function() {
//     console.log("Loaded");
//     const input = document.getElementsByClassName("gig-tfa-code-textbox"[0]);
//     input.value = "0000";
// };

    

    // chrome.runtime.sendMessage({ action: "getAuthToken" }, (response) => {
    //     const token = response.token;
    //     console.log("Received token in content script:", token);
    //     loadMessage(token);
    // });

    async function loadMessage(token) {

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    
        const mfaCode = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=from:info@communications.aeroplan.com subject:Verification code to access your account ', {
            method: 'GET',
            headers: headers
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((document) => {
            //console.log("Message List......", document);
            if (document.messages.length > 0) {
                const messageUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${document.messages[0].id}?format=full`
                return fetch(messageUrl, {
                    method: 'GET',
                    headers: headers,
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }).then((message) => {
                    // Look for a message that's less than 60 seconds old
                    //console.log("Most Recent Message......", message);
                    if (new Date() - new Date(parseFloat(message.internalDate)) < (60000)) {
                        if (message.snippet.length > 0) {
                            return message.snippet.match(/\b\d{6}\b/)
                        }
                    }
                    return new Error("No MFA Code Found");
                })
            }
        }).then((code) => {
            console.info("mfaCode = " + code);
        }).catch((error) => {
            console.log("Error", error.message);
            return -1
        })    
    };
