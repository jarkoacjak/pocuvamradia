// Konfigurácia rádií (streamy a logá)
const stations = {
    expres: {
        name: "Rádio Expres",
        stream: "https://stream.expres.sk/128.mp3",
        logo: "https://www.expres.sk/apple-touch-icon.png"
    },
    fun: {
        name: "Fun Rádio",
        stream: "https://stream.funradio.sk/128.mp3",
        logo: "https://www.funradio.sk/images/logo.png"
    },
    vlna: {
        name: "Rádio Vlna",
        stream: "https://stream.radiovlna.sk/128.mp3",
        logo: "https://www.radiovlna.sk/images/logo.png"
    }
};

let currentStation = "expres";
let isPlaying = false;
let player = null;

// HTML elementy, ktoré JS ovláda
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const logoContainer = document.getElementById('logo-container');
const radioLogo = document.getElementById('radio-logo');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');

// Funkcia na inicializáciu Icecast prehrávača pre metadáta zo streamu
function initIcecastPlayer() {
    // Ak už nejaký prehrávač beží, zastavíme ho
    if (player) {
        player.stop();
    }

    const st = stations[currentStation];
    radioLogo.src = st.logo;
    songTitle.innerText = "Načítavam prúd...";
    artistName.innerText = st.name;

    // Dynamicky načítame Icecast knižnicu, ak ešte nie je načítaná
    if (typeof IcecastMetadataPlayer === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/icecast-metadata-player@1.17.2/dist/icecast-metadata-player.production.min.js";
        script.onload = () => createPlayerInstance(st.stream);
        document.head.appendChild(script);
    } else {
        createPlayerInstance(st.stream);
    }
}

function createPlayerInstance(streamUrl) {
    player = new IcecastMetadataPlayer(streamUrl, {
        onMetadata: (metadata) => {
            if (metadata && metadata.StreamTitle) {
                // Stream väčšinou vracia text v tvare "Interpret - Pesnička"
                const parts = metadata.StreamTitle.split(' - ');
                if (parts.length > 1) {
                    artistName.innerText = parts[0].trim();
                    songTitle.innerText = parts.slice(1).join(' - ').trim();
                } else {
                    songTitle.innerText = metadata.StreamTitle;
                    artistName.innerText = stations[currentStation].name;
                }
            }
        },
        audioElement: document.getElementById('audio-player'),
        icyDetection: true
    });

    // Ak rádio hralo pred z
