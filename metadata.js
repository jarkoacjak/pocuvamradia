// 1. NASTAVENIE ZDROJOV (Kde má JS hľadať textové informácie)
const stations = {
    expres: {
        name: "Rádio Expres",
        stream: "https://stream.expres.sk/128.mp3",
        logo: "https://www.expres.sk/apple-touch-icon.png",
        apiUrl: "https://api.expres.sk/v1/songs/current", // <--- Odtiaľto JS ťahá text
        parse: (data) => ({ title: data?.song?.title, artist: data?.song?.artist })
    },
    // ... ďalšie rádiá
};

// 2. FUNKCIA NA ZÍSKANIE METADÁT (Beží priamo v prehliadači na GitHube)
async function fetchMetadata() {
    const st = stations[currentStation];
    try {
        // JS pošle požiadavku na server rádia
        const response = await fetch(st.apiUrl);
        if (!response.ok) throw new Error();
        
        // Server vráti dáta v tvare JSON (text)
        const data = await response.json();
        const track = st.parse(data);

        // Ak JS nájde názov a interpreta, prepíše text v HTML
        if (track.title && track.artist) {
            document.getElementById('song-title').innerText = track.title;
            document.getElementById('artist-name').innerText = track.artist;
        } else {
            document.getElementById('song-title').innerText = "Živé vysielanie";
        }
    } catch (error) {
        // Záložný plán, ak rádio neodpovedá alebo blokuje prístup
        document.getElementById('song-title').innerText = "Práve hrá";
        document.getElementById('artist-name').innerText = st.name;
    }
}

// 3. AUTOMATICKÉ SPÚŠŤANIE
// Keď používateľ klikne na PLAY, JS spustí funkciu fetchMetadata() 
// a následne ju opakuje každých 10 sekúnd (10000 milisekúnd), aby zachytil novú pesničku
metaInterval = setInterval(fetchMetadata, 10000);

