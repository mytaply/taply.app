(function () {
  const container = document.getElementById('putlicProfile');
  const template = container.querySelector('.template');
  const searchInput = document.getElementById('searchInput');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageInfo = document.getElementById('pageInfo');

  const spreadsheetId = '1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng';
  const dataSheet = 'appsData';
  const viewSheet = 'VLD';
  const apiKey = 'AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms';

  const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${dataSheet}!A:Z?key=${apiKey}`;
  const viewUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${viewSheet}!A:B?key=${apiKey}`;

  const profilesPerPage = 7;
  let currentPage = 1;
  let allProfiles = [];
  let filteredProfiles = [];
  let viewMap = new Map();

  function extractFileId(url) {
    const match = url.match(/\/d\/([^\/]+)\//);
    return match ? match[1] : null;
  }

  function createProfileCard(row) {
    const clone = template.cloneNode(true);
    clone.classList.remove('template');

    // Image
    clone.querySelectorAll('[data-php-img]').forEach(el => {
      const colIndex = parseInt(el.getAttribute('data-php-img'));
      const value = row[colIndex] || '';
      const fileId = extractFileId(value);
      el.src = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=s200` : 'https://via.placeholder.com/120';
    });

    // Text (supports multiple columns)
    clone.querySelectorAll('[data-php-text]').forEach(el => {
      const attr = el.getAttribute('data-php-text');
      if (attr.includes(' ')) {
        const indexes = attr.split(' ').map(Number);
        const values = indexes.map(i => row[i] || '').filter(Boolean).join(', ');
        el.innerText = values;
      } else {
        const colIndex = parseInt(attr);
        el.innerText = row[colIndex] || '';
      }
    });

    // View count
    clone.querySelectorAll('[data-php-view]').forEach(el => {
      const view = viewMap.get(row[0]) || '0';
      el.innerText = `Views: ${view}`;
    });

    // Link
    const anchors = clone.querySelectorAll('a[href]');
      if (anchors.length > 0 && row[0]) {
        const base = window.location.origin + window.location.pathname;
        anchors.forEach(anchor => {
          anchor.href = `${base}?user=${encodeURIComponent(row[0])}`;
        });
      }

    return clone;
  }

  function renderProfiles(profiles) {
    container.querySelectorAll('.public-view-box:not(.template)').forEach(el => el.remove());

    const start = (currentPage - 1) * profilesPerPage;
    const end = start + profilesPerPage;
    const pageProfiles = profiles.slice(start, end);

    pageProfiles.forEach(row => {
      const card = createProfileCard(row);
      container.appendChild(card);
    });

    const totalPages = Math.ceil(profiles.length / profilesPerPage);
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function handleSearch() {
    const keyword = searchInput.value.trim().toLowerCase();

    filteredProfiles = allProfiles.filter(row => {
      const name = (row[6] || '').toLowerCase();
      const skill1 = (row[7] || '').toLowerCase();
      const skill2 = (row[8] || '').toLowerCase();
      const skill3 = (row[9] || '').toLowerCase();
      return (
        name.includes(keyword) ||
        skill1.includes(keyword) ||
        skill2.includes(keyword) ||
        skill3.includes(keyword)
      );
    });

    currentPage = 1;
    renderProfiles(filteredProfiles);
  }

  // ✅ Updated sorting: purely by descending view count
function applyViewPriority(rows) {
  // Step 1: Sort by view descending
  const sorted = [...rows].sort((a, b) => {
    const vA = parseInt(viewMap.get(a[0]) || '0');
    const vB = parseInt(viewMap.get(b[0]) || '0');
    return vB - vA;
  });

  // Step 2: Pick top one
  const top = sorted[0]; // সবচেয়ে বেশি ভিউওয়ালা

  // Step 3: Shuffle rest
  const others = sorted.slice(1).sort(() => Math.random() - 0.5);

  // Step 4: ৯০% চান্সে top কে প্রথমে রাখো, না হলে পুরোটা random করো
  const chance = Math.random(); // 0 থেকে 1 এর মধ্যে একটি র‍্যান্ডম সংখ্যা
  if (chance < 0.8) {
    return [top, ...others]; // ৯০% চান্সে top উপরে
  } else {
    return [...rows].sort(() => Math.random() - 0.5); // ১০% চান্সে পুরোপুরি এলোমেলো
  }
}


  function setupPaginationListeners() {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderProfiles(filteredProfiles);
      }
    });

    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderProfiles(filteredProfiles);
      }
    });

    searchInput.addEventListener('input', handleSearch);
  }

  // Load data and initialize
  Promise.all([fetch(dataUrl), fetch(viewUrl)])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([dataRes, viewRes]) => {
      if (!dataRes.values || dataRes.values.length < 2) return;

      if (viewRes.values) {
        viewRes.values.forEach(([id, count]) => {
          viewMap.set(id, count);
        });
      }

      const rows = dataRes.values.slice(1);
      allProfiles = applyViewPriority(rows);
      filteredProfiles = allProfiles;

      renderProfiles(filteredProfiles);
      setupPaginationListeners();
    })
    .catch(err => {
      console.error('Error loading data:', err);
    });
})();




window.addEventListener('DOMContentLoaded', () => {
  // ধরো তুমি এখানে async কোনো ডেটা লোড করছো
  document.getElementById('searchBox').style.display = 'none';
  document.getElementById('putlicProfile').style.display = 'none';
  document.getElementById('pagination').style.display = 'none';
  simulateAsyncProcess().then(() => {
    // সব প্রসেস সফলভাবে সম্পূর্ণ হলে skeletonLoader হাইড হবে
    document.getElementById('skeletonLoader').remove();
    document.getElementById('searchBox').style.display = 'flex';
  document.getElementById('putlicProfile').style.display = 'flex';
  document.getElementById('pagination').style.display = 'flex';
  });
});

// এটি একটি সিমুলেশন async ফাংশন
function simulateAsyncProcess() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // এখানে তুমি তোমার আসল API বা ডেটা প্রসেসিং লজিক বসাবে
      resolve();
    }, 500); // ২ সেকেন্ড পরে resolve হবে (ডেমো)
  });
}
