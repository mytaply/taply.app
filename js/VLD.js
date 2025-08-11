const spreadsheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng"; 
    const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms"; 
    const sheetName = "VLD"; 
    const webAppUrl = "https://script.google.com/macros/s/AKfycbzTnqPpumBz4cmgLgdsMqTcSD4cbcOYsnpaQkjdZF8cdXkuq4FdPALc_MAc_bAeKXLK6g/exec"; 

    const columnAMIndex = 1; // Column B = 2th column (index 1)

    async function fetchSheetData() { 
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`; 
      const res = await fetch(url); 
      const data = await res.json(); 
      return data.values; 
    } 

    async function sendToWebApp(profileId, newValue) { 
      const formData = new URLSearchParams(); 
      formData.append("id", profileId); 
      formData.append("value", newValue); 

      const res = await fetch(webAppUrl, { 
        method: "POST", 
        body: formData, 
      }); 

      return res.text(); 
    } 

    async function init() { 
      const params = new URLSearchParams(window.location.search); 
      const profileId = params.get("user"); 

      const profileEl = document.getElementById("profileId"); 
      const inputEl = document.getElementById("viewInput"); 
      const statusEl = document.getElementById("status"); 

      if (!profileId) { 
        profileEl.innerText = "Missing ?id"; 
        statusEl.innerText = "No ID in URL";
        return; 
      } 

      profileEl.innerText = profileId; 

      const localKey = `viewed_${profileId}`;

      try { 
        const sheetData = await fetchSheetData(); 

        let matchedRowIndex = -1; 
        for (let i = 1; i < sheetData.length; i++) { 
          if (sheetData[i][0] === profileId) { 
            matchedRowIndex = i; 
            break; 
          } 
        } 

        if (matchedRowIndex === -1) { 
          statusEl.innerText = "ID not found in sheet"; 
          return; 
        } 

        const currentValue = parseInt(sheetData[matchedRowIndex][columnAMIndex] || "0", 10); 

        // Check if already viewed on this device
        if (localStorage.getItem(localKey)) {
          inputEl.value = currentValue;
          statusEl.innerText = "Already viewed on this device.";
        } else {
          const newValue = currentValue + 1;
          inputEl.value = newValue;

          const result = await sendToWebApp(profileId, newValue);
          statusEl.innerText = result;

          // Mark this profile as viewed
          localStorage.setItem(localKey, "true");
        }
      } catch (err) { 
        console.error(err); 
        statusEl.innerText = "Error fetching or updating data."; 
      } 
    } 

    init(); 