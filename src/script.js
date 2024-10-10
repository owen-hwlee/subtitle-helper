// ========================= BEGIN: Initialize Application =========================

let player;
let interval;
function onYouTubeIframeAPIReady() {
    const { width, height } = playerSize();

    player = new YT.Player("yt-player", {
        height: height.toString(),
        width: width.toString(),
        events: {
            onStateChange: (e) => {
                switch (e.data) {
                    case YT.PlayerState.PLAYING:
                        interval = setInterval(() => {
                            const timestamp = player.getCurrentTime();
                            highlightLine(timestamp);
                        }, 1000);
                        break;

                    // case YT.PlayerState.
                    // TODO: investigate how to detect manual pull or click on time line, then update highlight according to latest timestamp

                    default:
                        if (interval) {
                            clearInterval(interval);
                        }
                }
            },
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const preview = document.getElementById("preview");
    const { width, height } = playerSize();
    preview.style.width = width + "px";
    preview.style.height = height + "px";

    // add warning before closing tab
    window.onbeforeunload = (e) => {
        if (
            document.getElementById("url").value ||
            document.getElementById("subtitle-line").value ||
            document.getElementById("subtitles").value
        ) {
            e.preventDefault();
        }
    };
    
    window.onresize = (e) => {
        const { width, height } = playerSize();
        player.setSize(width, height);
        
        document.getElementById("preview").style.width = width + "px";
    }
});

// ========================= END: Initialize Application =========================

// ========================= BEGIN: Event Listeners =========================

const btnLoadPlayer = () => {
    const inputUrl = document.getElementById("url").value;
    const videoId = parseYouTubeURL(inputUrl);
    player.cueVideoById(videoId);

    if (player.getDuration() >= 6000)
        alert(".lrc files may not support videos exceeding 100 minutes! Proceed with caution.");
};

const btnAddLine = () => {
    const inputLine = document.getElementById("subtitle-line").value.trim();
    if (inputLine === "") return;

    document.getElementById("preview").style.display = "none";

    // perform data append and sorting first
    let subtitles = getSubtitlesList();
    subtitles.push({
        timestamp: player.getCurrentTime(),
        text: inputLine,
    });
    subtitles = subtitles.sort((a, b) => a.timestamp - b.timestamp);

    // rebuilt entire table from scratch
    const table = document.getElementById("subtitles");
    table.innerHTML = "";
    for (const { timestamp, text } of subtitles) {
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.innerHTML = '<input name="timestamp" type="hidden" />'
                    + '<code><label></label></code>&nbsp;&nbsp;&nbsp;'
                    + '<input name="text" />&nbsp;&nbsp;&nbsp;'
                    + '<button>Delete Line</button>';
        cell.getElementsByTagName("input").timestamp.value = timestamp;
        cell.getElementsByTagName("input").text.value = text;
        cell.getElementsByTagName("label")[0].textContent = formatTimestamp(timestamp);
        cell.getElementsByTagName("button")[0].onclick = (e) => {
            row.parentElement.removeChild(row);
        };
    }
};

const btnPreview = (filetype) => {
    if (getSubtitlesList().length === 0) return;
    
    const preview = document.getElementById("preview");
    preview.style.display = "";
    preview.value = generateFileContent(filetype);
};

const btnExport = (filetype) => {
    if (getSubtitlesList().length === 0) return;

    const subtitles = generateFileContent(filetype);
    const link = document.createElement("a");
    const file = new Blob([subtitles], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = `subtitles.${filetype}`;
    link.click();
    URL.revokeObjectURL(link.href);
};

const previewAutoResize = () => {
    const preview = document.getElementById("preview");
    preview.style.height = "auto";
    preview.style.height = preview.scrollHeight + "px";
};

// ========================= END: Event Listeners =========================

// ========================= BEGIN: Helper Functions =========================

const playerSize = () => {
    const width = window.outerWidth < 768 ? Math.floor(window.outerWidth * 0.9) : 720;
    const height = window.outerWidth < 768 ? Math.floor(width * 9 / 16) : 405;
    return { width, height };
};

const parseYouTubeURL = (inputUrl) => {
    const re = /^([A-Za-z0-9_\-]{11})$/;
    if (inputUrl.match(re)) {
        return inputUrl;
    }
    inputUrl = inputUrl.replaceAll("/", " ").replaceAll("?", " ").replaceAll("=", " ").trim();
    const videoId = inputUrl.split(" ").find(s => s.match(re));
    if (videoId) {
        return videoId;
    } else {
        alert("Invalid input");
        throw new Error("Invalid URL");
    }
}

const generateFileContent = (filetype) => {
    let toLine;
    switch (filetype) {
        case "lrc":
            toLine = lrcLine;
            break;
    
        case "srt":
            toLine = srtLine;
            break;
    }

    return getSubtitlesList()
        .map((s, index) => toLine(s.timestamp, s.text, index + 1))
        .join('\n\n')
        .trim();
}

// const srtLine = (timestamp, text, index) => {
//     // SRT is a little bit more complicated, each line timestamp has start and end, unsupported on YouTube UI design
//     return "";
// }

const lrcLine = (timestamp, text, index) => {
    const mm = padNum(minute(timestamp), 2);
    const ss = padNum(second(timestamp), 2);
    const xx = padNum(Math.floor(millisecond(timestamp) / 10), 2);
    return `[${mm}:${ss}:${xx}] ${text}`;
}

const padNum = (num, strLen) => ("0".repeat(strLen) + num.toString()).slice(-strLen);

const hour = (t) => Math.floor(t / 3600);
const minute = (t) => Math.floor((t % 3600) / 60);
const second = (t) => Math.floor(t % 60);
const millisecond = (t) => Math.floor((t % 1) * 1000);

const formatTimestamp = (t) => {
    const hh = padNum(hour(t), 2);
    const mm = padNum(minute(t), 2);
    const ss = padNum(second(t), 2);
    const xxx = padNum(millisecond(t), 3);
    return `${hh}:${mm}:${ss}.${xxx}`;
}

const highlightLine = (timestamp) => {
    // TODO: highlight current timestamp subtitles

};

const getSubtitlesList = () =>
    Array.from(document.getElementById("subtitles").rows)
        .map(row => {
            return {
                timestamp: row.getElementsByTagName("input").timestamp.value,
                text: row.getElementsByTagName("input").text.value,
            };
        });

// ========================= END: Helper Functions =========================
