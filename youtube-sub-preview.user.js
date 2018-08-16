// ==UserScript==
// @name         YouTube Subtitle Preview
// @namespace    https://github.com/ayancey/YoutubeSubtitlePreview
// @version      0.1
// @description  Know if a video has subtitles before you click.
// @author       Alex Yancey
// @match        ://www.youtube.com/*
// @grant        none
// ==/UserScript==

// Replace this with your target language (ISO language code)
let TARGET_LANGUAGE = "en";

// Check if youtube videos in thumbnails have subtitles in target language. If they do, add a little indicator at the top left of the thumbnail.
function youtube_subtitle_check() {
    // Get a list of all video thumbnails
    document.querySelectorAll("a.ytd-thumbnail").forEach(function (thumbnail) {
        // Get YT video id for testing
        let video_id = thumbnail.parentElement.querySelector("a#thumbnail").getAttribute("href").split("/watch?v=")[1].split("&")[0];

        // Make sure we only check once
        if (thumbnail.getAttribute("subtitle_tested") == "true") {
            return;
        }
        thumbnail.setAttribute("subtitle_tested", "true");

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let text = xhttp.responseText;
                if (text.includes('lang_code="' + TARGET_LANGUAGE + '"')) {
                    // Sorry, this is ugly. I'm not good with JavaScript.
                    let new_element = document.createElement("div");
                    new_element.style.width = "15px";
                    new_element.style.backgroundColor = "white";
                    new_element.style.zIndex = "1000";
                    new_element.style.position = "absolute";
                    new_element.style.borderRadius = "8px";
                    new_element.style.padding = "2px";
                    new_element.style.textAlign = "center";
                    new_element.style.left = "2px";
                    new_element.style.top = "2px";
                    new_element.style.userSelect = "none";
                    new_element.innerHTML = TARGET_LANGUAGE.toUpperCase();
                    thumbnail.appendChild(new_element);
                }
            }
        };
        xhttp.open("GET", "https://video.google.com/timedtext?type=list&v=" + video_id, true);
        xhttp.send();
    });
}

// Run on page load and every 3 seconds
youtube_subtitle_check();
setInterval(youtube_subtitle_check, 3000);
