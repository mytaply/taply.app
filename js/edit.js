document.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("loggedInUser");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    showEditSection(user);
  }
});

// ✅ Secure password hashing and comparison
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.querySelector('.logIn-btn').addEventListener('click', async function () {
  const emailInput = document.getElementById('email').value.trim();
  const passwordInput = document.getElementById('password').value.trim();
  const errorMsg = document.querySelector('.error-msg');
  const loginS = document.querySelector('.logIn');
  const editS = document.querySelector('.edit-section');
  const loginBtn = document.querySelector('.logIn-btn');

  if (!emailInput || !passwordInput) {
    errorMsg.style.display = 'block';
    errorMsg.textContent = 'Please enter email and password.';
    return;
  }

  loginBtn.innerText = 'Loading...';

  const sheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
  const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
  const sheetRange = "appsData";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || data.values.length < 2) {
      throw new Error("No data in sheet");
    }

    const [headers, ...rows] = data.values;
    const records = rows.map(row =>
      headers.reduce((obj, key, i) => {
        obj[key] = row[i] || "";
        return obj;
      }, {})
    );

    const hashedInputPassword = await hashPassword(passwordInput);
    const user = records.find(record =>
      record.Email === emailInput && record.Password === hashedInputPassword
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      loginBtn.innerText = 'Log in';
      showEditSection(user);
    } else {
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'Invalid email or password.';
      loginBtn.innerText = 'Log in';
    }
  } catch (error) {
    console.error("Error fetching data from Google Sheets API:", error);
    errorMsg.style.display = 'block';
    errorMsg.textContent = 'An error occurred. Please try again.';
    loginBtn.innerText = 'Log in';
  }
});

// ✅ Enter key press only works in login form
document.getElementById('password').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    document.querySelector('.logIn-btn').click();
  }
});

document.getElementById('logout')?.addEventListener('click', function () {
  localStorage.removeItem("loggedInUser");
  location.reload();
});

function showEditSection(user) {
  const loginS = document.querySelector('.logIn');
  const editS = document.querySelector('.edit-section');
  const errorMsg = document.querySelector('.error-msg');

  if (errorMsg) errorMsg.style.display = 'none';
  if (loginS) loginS.style.display = 'none';
  if (editS) editS.style.display = 'block';

  // Fill user data
  document.querySelector('textarea[name="UserId"]').value = user.UserId || "";
  document.querySelector('textarea[name="Id"]').value = user.Id || "";
  document.querySelector('textarea[name="Name"]').value = user.Name || "";
  document.querySelector('textarea[name="Email"]').value = user.Email || "";
  document.querySelector('textarea[name="Password"]').value = user.Password || "";

  document.getElementById('secondaryMedia').value = user.media || "";
  document.querySelector('textarea[name="view"]').value = user.view || "";
  document.querySelector('textarea[name="like"]').value = user.like || "";
  document.querySelector('textarea[name="dislike"]').value = user.dislike || "";

  document.getElementById('ctName').value = user.ctName || "";
  document.getElementById('ctProfessionOne').value = user.ctProfessionOne || "";
  document.getElementById('ctProfessionTow').value = user.ctProfessionTow || "";
  document.getElementById('ctProfessionThree').value = user.ctProfessionThree || "";
  document.getElementById('ctPhOne').value = user.ctPhOne || "";
  document.getElementById('ctPhTow').value = user.ctPhTow || "";
  document.getElementById('ctEmail').value = user.ctEmail || "";
  document.getElementById('ctAddress').value = user.ctAddress || "";
  document.getElementById('company').value = user.company || "";
  document.getElementById('work').value = user.work || "";
  document.getElementById('school').value = user.school || "";
  document.getElementById('college').value = user.college || "";
  document.getElementById('University').value = user.University || "";
  document.getElementById('gender').value = user.gender || "";
  document.getElementById('Maritals').value = user.Maritals || "";
  document.getElementById('bio').value = user.bio || "";

  let mediaUrl = user.media || "placeholder.jpg";
  if (user.media.includes("drive.google.com")) {
    const regex = /\/d\/([^\/]+)\//;
    const matches = user.media.match(regex);
    if (matches && matches[1]) {
      mediaUrl = `https://drive.google.com/thumbnail?id=${matches[1]}&sz=s800`;
    }
  }
  document.querySelector('.profile-image img').src = mediaUrl;

  const socialIds = [
    'facebook', 'instagram', 'website', 'github', 'youtube', 'linkedin',
    'twitter', 'whatsapp', 'tiktok', 'twitch', 'pinterest', 'spotify',
    'reddit', 'line', 'vk'
  ];

  socialIds.forEach(id => {
    document.getElementById(id).value = user[id] || "";
  });

  toggleVisibilityByValue();
}

function toggleVisibilityByValue() {
  const ids = [
    'facebook', 'instagram', 'website', 'github', 'youtube', 'linkedin',
    'twitter', 'whatsapp', 'tiktok', 'twitch', 'pinterest', 'spotify',
    'reddit', 'line', 'vk'
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const box = el.closest('.social-links-box');
      if (box) {
        box.style.display = el.value.trim() ? 'block' : 'none';
      }
    }
  });
}


/*-------------------------Toggle Password Visibility-------------------------*/
  // TOGGLE PASSWORD VISIBILITY FOR ALL FIELDS WITH THE "toggle-password" CLASS
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === "password") {
          input.type = "text";
          button.textContent = "Hide";
        } else {
          input.type = "password";
          button.textContent = "Show";
        }
      }
    });
  });
/*-------------------------preview img-------------------------*/
  document.getElementById('media').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      // When the file is loaded, update the img src with the result
      reader.onload = function (e) {
        document.getElementById('preview').src = e.target.result;
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  });
/*------------------------------Add event listener to the button------------------------------*/
document.getElementById('add-profession-input').addEventListener('click', () => {
  // Get all the hidden textareas
  const textAreas = ['occ-display-edit-tow', 'occ-display-edit-three'];
  
  for (let id of textAreas) {
    const textArea = document.getElementById(id);
    // Show the first hidden textarea
    if (textArea.style.display === 'none') {
      textArea.style.display = 'flex';
      break;
    }
  }
});
document.getElementById('delete-profession-input').addEventListener('click', () => {
  const deleteCtpThree = document.getElementById('occ-display-edit-three');
  const deleteCtpTow = document.getElementById('occ-display-edit-tow');
  const threeValue = document.getElementById('display-ctp-three');
  const towValue = document.getElementById('display-ctp-tow');

  if (deleteCtpThree.style.display === 'flex') {
    deleteCtpThree.value = '';
    deleteCtpThree.style.display = 'none';
    threeValue.innerText ='';
  } else {
    deleteCtpTow.value = '';
    deleteCtpTow.style.display = 'none';
    towValue.innerText = '';
  }
});

//-------------------------------------------------------theme selection\
const themeRadios = document.querySelectorAll('input[name="theme"]');
const themeClasses = ['light-theme', 'dark-theme', 'blue-theme', 'amber-night', 'cyberpunk', 'emerald-dark'];

// Function to update the theme
function changeTheme(selectedTheme) {
  // Remove all theme classes
  document.body.classList.remove(...themeClasses);
  // Add the selected theme class
  document.body.classList.add(selectedTheme);
  // Save the selection in local storage
  localStorage.setItem('selectedTheme', selectedTheme);
}

// Attach an event listener to each radio button
themeRadios.forEach(radio => {
  radio.addEventListener('change', (event) => {
    if (event.target.checked) {
      changeTheme(event.target.value);
    }
  });
});

// On page load, check local storage for a saved theme
const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme && themeClasses.includes(savedTheme)) {
  changeTheme(savedTheme);
  // Update the corresponding radio button to be checked
  const savedRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
  if (savedRadio) {
    savedRadio.checked = true;
  }
}

// ------------------------------------------------------------save-----------------------------------------------------//
const scriptURL = "https://script.google.com/macros/s/AKfycbzUW6H0JhuG4bIqV6Mm3hSw2QN2VL2tLDCZgZ1cnQ9NRm8dnGMWuKIWYjP7ELtCaZMI9Q/exec";
const form = document.forms["submit-to-google-sheet"];
const fileInput = document.getElementById("media");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Handle the file upload
    const fileInput = document.getElementById("media");
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        // Size validation here, only less than 2MB allowed
        if (file.size > 2 * 1024 * 1024 * 1024 * 1024) {
            swal("Error", "File size should be less than 4MB.", "error");
            return;
        }

        reader.onload = async function () {
            formData.append("media", reader.result.split(",")[1]); // Append base64 data
            await submitForm(formData);
        };

        reader.readAsDataURL(file);
    } else {
        // No file uploaded
        await submitForm(formData);
    }
});

async function submitForm(formData) {
    const submitButton = document.querySelector("button[type='submit']");
    const idValue = document.getElementById('Id')?.value; // Ensure ID exists
    submitButton.disabled = true;
    submitButton.innerText = "Loading...";

    try {
        // Submit the form data to the Google Sheet
        const response = await fetch(scriptURL, { method: "POST", body: formData });

        // Show success message and then redirect
        swal("Done", "Data will be updated within 0 - 60 second.", "success")
            .then(() => {
                const base = window.location.origin;
                window.location.href = `${base}/profile/?user=${encodeURIComponent(idValue)}`;
            });

        // Reset the form fields
        document.querySelector("form").reset();
    } catch (error) {
        swal("Error", "Something went wrong. Please try again!", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = "save";
    }
}

// --------------------------------------social media add function 
document.addEventListener("DOMContentLoaded", () => {
  const popover = document.getElementById("popover");
  const overlay = document.getElementById("overlay");
  const addBtn = document.getElementById("add-social-btn");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const socialSelect = document.getElementById("social-select");
  const socialUrl = document.getElementById("social-url");

  const textareas = document.querySelectorAll(".social-links-box textarea");

  // Show the popover and overlay
  function showPopover() {
    popover.style.display = "block";
    overlay.style.display = "block";
  }

  // Hide the popover and overlay
  function hidePopover() {
    popover.style.display = "none";
    overlay.style.display = "none";
    socialSelect.selectedIndex = 0;
    socialUrl.value = "";
  }

  // Show/hide a textarea container based on value
  function toggleVisibility(textarea) {
    const container = textarea.closest(".social-links-box");
    if (container) {
      container.style.display = textarea.value.trim() !== "" ? "block" : "none";
    }
  }

  // Save input to selected textarea
  function saveSocialLink() {
    const selectedId = socialSelect.value;
    const url = socialUrl.value.trim();

    if (!selectedId || !url) {
      alert("Please select a platform and enter a URL.");
      return;
    }

    const textarea = document.getElementById(selectedId);
    if (textarea) {
      textarea.value = url;
      toggleVisibility(textarea);
    }

    hidePopover();
  }

  // Setup listeners on all textareas for live hide/show
  textareas.forEach(textarea => {
    toggleVisibility(textarea); // initial check
    textarea.addEventListener("input", () => toggleVisibility(textarea));
  });

  // Event bindings
  addBtn.addEventListener("click", showPopover);
  saveBtn.addEventListener("click", saveSocialLink);
  cancelBtn.addEventListener("click", hidePopover);
  overlay.addEventListener("click", hidePopover);
});

document.addEventListener('click', function(e) {
  if (e.target.closest('.del-social-media')) {
    const container = e.target.closest('.social-links-box');
    const textarea = container.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.dispatchEvent(new Event('input')); // <-- Trigger visibility toggle
    }
  }
});



window.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById("media");
  const textarea = document.getElementById("secondaryMedia");
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0 && textarea) {
      textarea.remove(); // Completely remove textarea from the DOM
    }
  });
});