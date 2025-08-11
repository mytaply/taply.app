
(function() {

    const URL = new URLSearchParams(window.location.search);
  const userId = URL.get('user');
  const profile = document.getElementById('profile');
  if (!userId && profile) {
    profile.remove();
  }
  // Extract the 'id' parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('user');

  const profileDiv = document.getElementById('profile');
  

  if (!id) {
    profileDiv.innerHTML = '';
    return;
  }

  // Replace with your actual spreadsheet ID
  const spreadsheetId = '1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng';
  // Set the sheet name (change if your sheet is named differently)
  const sheetName = 'appsData';
  // Define the range (for example, columns A to D)
  const range = `${sheetName}!A:AZ`;

  // Your provided API key
  const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
  // Build the URL for the Google Sheets API
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  // Fetch data from the Google Sheet
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (!data.values || data.values.length === 0) {
        profileDiv.textContent = 'No data found in the sheet.';
        return;
      }

      // Optionally, skip the header row if your sheet has one:
      // let rows = data.values.slice(1);
      // For this example, we assume there is no header row.
        // Skip header row if present
        const rows = data.values.slice(1);

        let found = false;
        // Loop through each row and check if the first column matches the given ID.
        for (const row of rows) {
          if (row[0] === id) {
            // Populate profile data
            const putlicProfile = document.getElementById('putlicProfile');
            putlicProfile.remove();
            const searchBod = document.getElementById('searchBox');
            searchBod.remove();
            const pagination = document.getElementById('pagination');
            pagination.remove();
            // Update profile picture
            const profilePic = document.querySelectorAll('.profile-image img');

            if (profilePic.length > 0 && row[5]) {
              // Extract the file ID from the full URL in row[5]
              const fullUrl = row[5]; 
              const regex = /\/d\/([^\/]+)\//;
              const match = fullUrl.match(regex);

              if (match && match[1]) {
                const fileId = match[1];
                // Set the src attribute using the extracted file ID
                profilePic[0].src = `https://drive.google.com/thumbnail?id=${fileId}&sz=s800`;
              } else {
                // Fallback to a placeholder if the extraction fails
                profilePic[0].src = "placeholder.jpg";
              }
            }

            // Update name
            document.querySelector('.name').textContent = row[6];
            document.querySelector('.theme').textContent = row[31];
            
            // Update occupation spans
            const occupationSpans = document.querySelectorAll('.occupation span');

            // First occupation
            if (row[7]) {
                occupationSpans[0].textContent = `${row[7]}`;
                occupationSpans[0].style.display = '';
            } else {
                occupationSpans[0].remove();
            }

            // Second occupation
            if (row[8]) {
                occupationSpans[1].textContent = `, ${row[8]}`;
                occupationSpans[1].style.display = '';
            } else {
                occupationSpans[1].remove();
            }

            // Third occupation
            if (row[9]) {
                occupationSpans[2].textContent = `, ${row[9]}`;  // No comma for last item
                occupationSpans[2].style.display = '';
            } else {
                occupationSpans[2].remove();
            }
            
            // Update company
            const companyElement = document.querySelector('.company'); // Note: fixed typo from 'conpany' to 'company'
            const companyData = row[10];
            
            if (companyData) {
                companyElement.innerHTML = `<span><i class="fa-solid fa-briefcase"></i> Owner at</span><span>${companyData}</span>`;
                companyElement.style.display = ''; // Show element
            } else {
                companyElement.remove(); // Hide element
            }

            // Update work
            const workElement = document.querySelector('.work'); // Note: fixed typo from 'conpany' to 'company'
            const workData = row[32];
            
            if (workData) {
              workElement.innerHTML = `<span><i class="fa-solid fa-briefcase"></i> Work at</span><span>${workData}</span>`;
              workElement.style.display = ''; // Show element
            } else {
              workElement.remove(); // Hide element
            }

          // update school, college, univerity
          // Select elements
          const schoolElement = document.querySelector('.school');
          const collegeElement = document.querySelector('.college');
          const universityElement = document.querySelector('.University');

          // Fetch data
          const schoolData = row[35];
          const collegeData = row[36];
          const universityData = row[37];

          // Define icon HTML for each level
          const schoolIcon = '<i class="fa-solid fa-school-flag"></i>';
          const collegeIcon = '<i class="fa-solid fa-graduation-cap"></i>';
          const universityIcon = '<i class="fa-solid fa-diploma"></i>';

          // Helper to update an element with specific icon HTML
          function updateEducation(element, data, isCurrent, iconHTML) {
            if (data) {
              const prefix = isCurrent ? 'Student at' : 'Went to';
              element.innerHTML = `<span>${iconHTML} ${prefix}</span><span>${data}</span>`;
              element.style.display = '';
            } else {
              element.remove();
            }
          }

          // Logic: if universityData exists, it's current; college and school are past
          if (universityData) {
            updateEducation(schoolElement, schoolData, false, schoolIcon);
            updateEducation(collegeElement, collegeData, false, collegeIcon);
            updateEducation(universityElement, universityData, true, universityIcon);
          }
          // If no university but collegeData exists: college is current, school is past
          else if (collegeData) {
            updateEducation(schoolElement, schoolData, false, schoolIcon);
            updateEducation(collegeElement, collegeData, true, collegeIcon);
            updateEducation(universityElement, null, false, universityIcon);
          }
          // Only schoolData exists
          else if (schoolData) {
            updateEducation(schoolElement, schoolData, true, schoolIcon);
            updateEducation(collegeElement, null, false, collegeIcon);
            updateEducation(universityElement, null, false, universityIcon);
          } else {
            // No education data
            updateEducation(schoolElement, null, false, schoolIcon);
            updateEducation(collegeElement, null, false, collegeIcon);
            updateEducation(universityElement, null, false, universityIcon);
          }

            // Update gender
            const genderElement = document.querySelector('.gender'); // Note: fixed typo from 'conpany' to 'company'
            const genderData = row[33];
            
            if (genderData) {
              genderElement.innerHTML = `<span><i class="fa-solid fa-venus-mars"></i></span><span>${genderData}</span>`;
              genderElement.style.display = ''; // Show element
            } else {
              genderElement.remove(); // Hide element
            }
            
            // Update Maritals
            const MaritalsElement = document.querySelector('.Maritals'); // Note: fixed typo from 'conpany' to 'company'
            const MaritalsData = row[34];
            
            if (MaritalsData) {
              MaritalsElement.innerHTML = `<span><i class="fa-solid fa-heart"></i></span><span>${MaritalsData}</span>`;
              MaritalsElement.style.display = ''; // Show element
            } else {
              MaritalsElement.remove(); // Hide element
            }
            
            // Update bio
            document.querySelector('.text-content').textContent = row[30];
            
          // Update contact information
          const contactLinks = document.querySelectorAll('.contact-menu a');

          // Phone 1
          const phone1 = row[12];
          if (phone1) {
              contactLinks[0].href = `tel:${phone1}`;
              contactLinks[0].querySelector('span').textContent = phone1;
              contactLinks[0].style.display = '';
          } else {
              contactLinks[0].remove();
          }

          // Phone 2
          const phone2 = row[11];
          if (phone2) {
              contactLinks[1].href = `tel:${phone2}`;
              contactLinks[1].querySelector('span').textContent = phone2;
              contactLinks[1].style.display = '';
          } else {
              contactLinks[1].remove();
          }

          // Email
          const email = row[13]?.trim(); // Using optional chaining and trim
          if (email) {
              contactLinks[2].href = `mailto:${email}`;
              contactLinks[2].querySelector('span').textContent = email;
              contactLinks[2].style.display = '';
          } else {
              contactLinks[2].remove();
          }

          // Address
          const address = row[14];
          if (address) {
              contactLinks[3].href = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
              contactLinks[3].querySelector('span').textContent = address;
              contactLinks[3].style.display = '';
          } else {
              contactLinks[3].remove();
          }

          //social media
          const socialMediaLinks = document.querySelectorAll('.social-media-row a');
          const socialMediaNone = document.querySelectorAll('.social-media-row li');

          // Facebook
          const facebook = row[15];
          if (facebook) {
              socialMediaLinks[0].href = `${facebook}`;
              socialMediaNone[0].style.display = '';
          } else {
            socialMediaNone[0].remove();
          }

          // instagram
          const instagram = row[16];
          if (instagram) {
              socialMediaLinks[1].href = `${instagram}`;
              socialMediaNone[1].style.display = '';
          } else {
            socialMediaNone[1].remove();
          }

          // website
          const website = row[17];
          if (website) {
              socialMediaLinks[2].href = `${website}`;
              socialMediaNone[2].style.display = '';
          } else {
            socialMediaNone[2].remove();
          }

          // github
          const github = row[18];
          if (github) {
              socialMediaLinks[3].href = `${github}`;
              socialMediaNone[3].style.display = '';
          } else {
            socialMediaNone[3].remove();
          }

          // youtube
          const youtube = row[19];
          if (youtube) {
              socialMediaLinks[4].href = `${youtube}`;
              socialMediaNone[4].style.display = '';
          } else {
            socialMediaNone[4].remove();
          }

          // linkedin
          const linkedin = row[20];
          if (linkedin) {
              socialMediaLinks[5].href = `${linkedin}`;
              socialMediaNone[5].style.display = '';
          } else {
            socialMediaNone[5].remove();
          }

          // twitter
          const twitter = row[21];
          if (twitter) {
              socialMediaLinks[6].href = `${twitter}`;
              socialMediaNone[6].style.display = '';
          } else {
            socialMediaNone[6].remove();
          }

          // whatsapp
          const whatsapp = row[22];
          if (whatsapp) {
              socialMediaLinks[7].href = `${whatsapp}`;
              socialMediaNone[7].style.display = '';
          } else {
            socialMediaNone[7].remove();
          }

          // tiktok
          const tiktok = row[23];
          if (tiktok) {
              socialMediaLinks[8].href = `${tiktok}`;
              socialMediaNone[8].style.display = '';
          } else {
            socialMediaNone[8].remove();
          }

          // twitch
          const twitch = row[24];
          if (twitch) {
              socialMediaLinks[9].href = `${twitch}`;
              socialMediaNone[9].style.display = '';
          } else {
            socialMediaNone[9].remove();
          }

          // pinterest
          const pinterest = row[25];
          if (pinterest) {
              socialMediaLinks[10].href = `${pinterest}`;
              socialMediaNone[10].style.display = '';
          } else {
            socialMediaNone[10].remove();
          }

          // spotify
          const spotify = row[26];
          if (spotify) {
              socialMediaLinks[11].href = `${spotify}`;
              socialMediaNone[11].style.display = '';
          } else {
            socialMediaNone[11].remove();
          }

          // reddit
          const reddit = row[27];
          if (reddit) {
              socialMediaLinks[12].href = `${reddit}`;
              socialMediaNone[12].style.display = '';
          } else {
            socialMediaNone[12].remove();
          }

          // line
          const line = row[28];
          if (line) {
              socialMediaLinks[13].href = `${line}`;
              socialMediaNone[13].style.display = '';
          } else {
            socialMediaNone[13].remove();
          }

          // vk
          const vk = row[29];
          if (vk) {
              socialMediaLinks[14].href = `${vk}`;
              socialMediaNone[14].style.display = '';
          } else {
            socialMediaNone[14].remove();
          }

          //VCard
          const downloadVcfButton = document.getElementById('download-vcf');

          downloadVcfButton.addEventListener('click', function downloadVcfHandler() {
              // Get values from row array
              const firstName = row[6] || '';
              const company = row[10];
              const titles = [row[7], row[8], row[9]].filter(t => t);
              const phone = row[11];
              const email = row[13];
              const address = row[14];
              const website = row[17];

              // Create vCard content
              let vCard = 'BEGIN:VCARD\r\n';
              vCard += 'VERSION:3.0\r\n';
              
              // Name fields
              
              vCard += `FN:${firstName}\r\n`;
              
              // Organization
              if (company) {
                  vCard += `ORG:${company}\r\n`;
              }
              
              // Titles
              if (titles.length > 0) {
                  vCard += `TITLE:${titles.join(' | ')}\r\n`;
              }
              
              // Phone
              if (phone) {
                  vCard += `TEL;TYPE=mobile:${phone}\r\n`;
              }
              
              // Email
              if (email) {
                  vCard += `EMAIL;TYPE=email:${email}\r\n`;
              }
              
              // Address
              if (address) {
                  vCard += `ADR;TYPE=home:;;${address};;;\r\n`;
              }
              
              // Website
              if (website) {
                  vCard += `URL:${website}\r\n`;
              }
              
              vCard += 'END:VCARD';

              // Create Blob and download
              try {
                  const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${firstName.trim() || 'contact'}.vcf`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
              } catch (error) {
                  console.error('Error generating vCard:', error);
                  alert('Failed to download vCard. Please try again.');
              }
          });

            found = true;
            break;
          }
        }

        if (!found) {
          profileDiv.textContent = 'Profile not found for the given ID.';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        profileDiv.textContent = 'Error fetching data.';
      });
})();
// -----------------------------------------------------------theme----------------------------
const validThemes = ['light-theme', 'dark-theme', 'blue-theme', 'amber-night', 'cyberpunk', 'emerald-dark']; // Match your CSS classes
const themeDiv = document.querySelector('.theme');

// Apply theme safely
function applyTheme(themeName) {
  const cleanTheme = themeName.trim().toLowerCase();
  document.body.className = validThemes.includes(cleanTheme) ? cleanTheme : '';
}

// Watch for changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'characterData' || mutation.type === 'childList') {
      applyTheme(themeDiv.textContent);
    }
  });
});

observer.observe(themeDiv, {
  childList: true,
  subtree: true,
  characterData: true
});