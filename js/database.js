(function() {
    const profileDiv = document.getElementById('body');
    const spreadsheetId = '1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng';
    const sheetName = 'webData';
    const range = `${sheetName}!A:AB`;
    const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
  
    function extractFileId(url) {
      const regex = /\/d\/([^\/]+)\//;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (!data.values || data.values.length === 0) {
          profileDiv.textContent = 'No data found in the sheet.';
          return;
        }
  
        const rows = data.values.slice(1);
        if (rows.length === 0) {
          profileDiv.textContent = 'No valid data found.';
          return;
        }
  
        const rowData = rows[0];
  
        // Existing handlers
        document.querySelectorAll('[data-text-col]').forEach(element => {
          const colIndex = parseInt(element.getAttribute('data-text-col'));
          if (!isNaN(colIndex) && colIndex < rowData.length) {
            element.textContent = rowData[colIndex];
          }
        });
  
        document.querySelectorAll('[data-image-col]').forEach(element => {
          const colIndex = parseInt(element.getAttribute('data-image-col'));
          if (!isNaN(colIndex) && colIndex < rowData.length && rowData[colIndex]) {
            const fileId = extractFileId(rowData[colIndex]);
            if (fileId) element.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=s800`;
          }
        });
  
        document.querySelectorAll('[data-bgimage-col]').forEach(element => {
          const colIndex = parseInt(element.getAttribute('data-bgimage-col'));
          if (!isNaN(colIndex) && colIndex < rowData.length && rowData[colIndex]) {
            const fileId = extractFileId(rowData[colIndex]);
            if (fileId) element.style.backgroundImage = `url('https://drive.google.com/thumbnail?id=${fileId}&sz=s800')`;
          }
        });
  
        // New href handler
        document.querySelectorAll('[data-href-col]').forEach(element => {
          const colIndex = parseInt(element.getAttribute('data-href-col'));
          if (!isNaN(colIndex) && colIndex < rowData.length && rowData[colIndex]) {
            element.href = rowData[colIndex];
          }
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        profileDiv.textContent = 'Error fetching data.';
      });
  })();