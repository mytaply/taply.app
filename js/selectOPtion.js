// Utility to wire up a textarea with an edit modal
function initEditModal({
  textareaId,
  labelSelector,
  modalId,
  inputId,
  saveBtnId,
  cancelBtnId
}) {
  const textarea = document.getElementById(textareaId);
  const label = document.querySelector(labelSelector);
  const modal = document.getElementById(modalId);
  const input = document.getElementById(inputId);
  const saveBtn = document.getElementById(saveBtnId);
  const cancelBtn = document.getElementById(cancelBtnId);

  function openModal() {
    input.value = textarea.value;
    modal.classList.add('active');
    input.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  saveBtn.addEventListener('click', () => {
    textarea.value = input.value.trim();
    closeModal();
  });

  cancelBtn.addEventListener('click', closeModal);
  textarea.addEventListener('click', openModal);
  label.addEventListener('click', openModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
}

// Example initializations—ensure your HTML elements use these IDs/classes
initEditModal({
  textareaId: 'ctName',
  labelSelector: '.edit-icon-name',    // e.g. <span class="edit-icon-name">✏️</span>
  modalId: 'name-modal',
  inputId: 'nameInput',
  saveBtnId: 'saveNameBtn',
  cancelBtnId: 'cancelNameBtn'
});

initEditModal({
  textareaId: 'company',
  labelSelector: '.edit-icon-company', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'company-modal',
  inputId: 'companyInput',
  saveBtnId: 'saveCompanyBtn',
  cancelBtnId: 'cancelCompanyBtn'
});

initEditModal({
  textareaId: 'ctProfessionOne',
  labelSelector: '.edit-icon-skillOne', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'skillOne-modal',
  inputId: 'skillOneInput',
  saveBtnId: 'saveSkillOneBtn',
  cancelBtnId: 'cancelSkillOneBtn'
});

initEditModal({
  textareaId: 'ctProfessionTow',
  labelSelector: '.edit-icon-skillTow', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'skillTow-modal',
  inputId: 'skillTowInput',
  saveBtnId: 'saveSkillTowBtn',
  cancelBtnId: 'cancelSkillTowBtn'
});

initEditModal({
  textareaId: 'ctProfessionThree',
  labelSelector: '.edit-icon-skillThree', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'skillThree-modal',
  inputId: 'skillThreeInput',
  saveBtnId: 'saveSkillThreeBtn',
  cancelBtnId: 'cancelSkillThreeBtn'
});

initEditModal({
  textareaId: 'work',
  labelSelector: '.edit-icon-work', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'work-modal',
  inputId: 'workInput',
  saveBtnId: 'saveWorkBtn',
  cancelBtnId: 'cancelWorkBtn'
});

initEditModal({
  textareaId: 'school',
  labelSelector: '.edit-icon-school', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'school-modal',
  inputId: 'schoolInput',
  saveBtnId: 'saveSchoolBtn',
  cancelBtnId: 'cancelSchoolBtn'
});

initEditModal({
  textareaId: 'college',
  labelSelector: '.edit-icon-college', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'college-modal',
  inputId: 'collegeInput',
  saveBtnId: 'saveCollegeBtn',
  cancelBtnId: 'cancelCollegeBtn'
});

initEditModal({
  textareaId: 'University',
  labelSelector: '.edit-icon-University', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'University-modal',
  inputId: 'UniversityInput',
  saveBtnId: 'saveUniversityBtn',
  cancelBtnId: 'cancelUniversityBtn'
});

initEditModal({
  textareaId: 'ctPhOne',
  labelSelector: '.edit-icon-ctPhOne', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'numberOne-modal',
  inputId: 'numberOneInput',
  saveBtnId: 'saveNumberBtn',
  cancelBtnId: 'cancelNumberBtn'
});

initEditModal({
  textareaId: 'ctPhTow',
  labelSelector: '.edit-icon-ctPhTow', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'numberTow-modal',
  inputId: 'numberTowInput',
  saveBtnId: 'saveNumberTowBtn',
  cancelBtnId: 'cancelNumberTowBtn'
});

initEditModal({
  textareaId: 'ctEmail',
  labelSelector: '.edit-icon-ctEmail', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'ctEmail-modal',
  inputId: 'ctEmailInput',
  saveBtnId: 'saveEmailBtn',
  cancelBtnId: 'cancelEmailBtn'
});

initEditModal({
  textareaId: 'ctAddress',
  labelSelector: '.edit-icon-ctAddress', // e.g. <span class="edit-icon-company">✏️</span>
  modalId: 'ctAddress-modal',
  inputId: 'ctAddressInput',
  saveBtnId: 'savectAddressBtn',
  cancelBtnId: 'cancelctAddressBtn'
});


function showGenderOptions() {
    document.getElementById('gender-options').style.display = 'block';
}

function selectGender(value) {
    document.getElementById('gender').value = value;
    document.getElementById('gender-options').style.display = 'none';
}

// Hide dropdown if clicked outside
document.addEventListener('click', function(event) {
    const genderBox = document.getElementById('gender');
    const optionsBox = document.getElementById('gender-options');
    if (!genderBox.contains(event.target) && !optionsBox.contains(event.target)) {
        optionsBox.style.display = 'none';
    }
});




function showMaritalsOptions() {
    document.getElementById('Maritals-options').style.display = 'block';
}

function selectMaritals(value) {
    document.getElementById('Maritals').value = value;
    document.getElementById('Maritals-options').style.display = 'none';
}

// Hide dropdown if clicked outside
document.addEventListener('click', function(event) {
    const maritalsBox = document.getElementById('Maritals');
    const maritalsOptionsBox = document.getElementById('Maritals-options');
    if (!maritalsBox.contains(event.target) && !maritalsOptionsBox.contains(event.target)) {
        maritalsOptionsBox.style.display = 'none';
    }
});