// ==UserScript==
// @name            UIT - Auto Lecture Survey
// @author          Kevin Nitro
// @namespace       https://github.com/KevinNitroG
// @description     Tự động đánh giá khảo sát giảng viên UIT. vui lòng disable script khi không sử dụng, tránh conflict với các khảo sát / link khác của trường
// @license         https://github.com/KevinNitroG/UIT-Auto-Lecturer-Survey/raw/main/LICENSE
// @version         2.3
// @icon            https://github.com/KevinNitroG/UIT-Auto-Lecturer-Survey/raw/main/UIT-logo.png
// @match           http*://student.uit.edu.vn/sinhvien/phieukhaosat
// @match           http*://survey.uit.edu.vn/index.php/survey/index
// @match           http*://survey.uit.edu.vn/index.php/survey/index/sid/*/token/*
// @run-at          document-idle
// @grant           window.close
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @downloadURL     https://github.com/KevinNitroG/UIT-Auto-Lecturer-Survey/raw/main/UITAutoLecturerSurvey.user.js
// @updateURL       https://github.com/KevinNitroG/UIT-Auto-Lecturer-Survey/raw/main/UITAutoLecturerSurvey.user.js
// @supportURL      https://github.com/KevinNitroG/UIT-Auto-Lecturer-Survey/issues
// ==/UserScript==

// ---------- START GLOBAL VARIABLES ----------

// Value for first type questions
const defaultFirstTypeSelectionsArray = [
  '<50%',
  '50-80%',
  '>80%',
  'Không biết chuẩn đầu ra là gì',
  'Dưới 50%',
  'Từ 50 đến dưới 70%',
  'Từ 70 đến dưới 90%',
  'Trên 90%',
];

// Value for second type questions
const defaultSecondTypeSelectionsArray = [
  'answer_cell_00MH01',
  'answer_cell_00MH02',
  'answer_cell_00MH03',
  'answer_cell_00MH04',
];

// Time duration to process each form from homepage (in s)
const defaultProcessingTimeForEachForm = 5;

// Time duration to sleep for each form before continue to the next page or submit form (in ms)
const defaultProcessingTimeBeforeContinueForm = 0;

// ---------- END GLOBAL VARIABLES ----------

// ---------- START HOMEPAGE FUNCTION ----------

// Return position
function UITAutoLecturerSurveyHomePagePosition() {
  return document
    .getElementsByClassName('content')[0]
    .getElementsByTagName('center')[0];
}

// Add paragrah
function UITAutoLecturerSurveyParagraph(headElement) {
  const para = document.createElement('p');
  const node = document.createTextNode(
    '⭐ UIT - Auto Lecturer Survey - Kevin Nitro 💖'
  );
  para.appendChild(node);
  headElement.appendChild(para);
}

// Add option buttons
function UITAutoLecturerSurveyAddButton(
  headElement,
  btnTextContent,
  btnTitle,
  btnCallBack
) {
  const executeButton = document.createElement('button');
  executeButton.textContent = btnTextContent;
  executeButton.style.padding = '0.65rem 1rem';
  executeButton.style.border = 'none';
  executeButton.style.borderRadius = '0.5rem';
  executeButton.style.color = 'white';
  executeButton.style.margin = '0.5rem 0.6rem 1rem 0.6rem';
  executeButton.style.backgroundColor = '#115d9d';
  executeButton.style.transition = 'background-color 0.15s ease';
  executeButton.addEventListener('mouseover', () => {
    executeButton.style.backgroundColor = '#1678cb';
    executeButton.title = btnTitle;
  });
  executeButton.addEventListener('mouseout', () => {
    executeButton.style.backgroundColor = '#115d9d';
    executeButton.title = '';
  });
  executeButton.addEventListener('click', btnCallBack);
  headElement.appendChild(executeButton);
}

// Get URLs of forms in homepage
function UITAutoLecturerSurveyGetURL() {
  // This small script is taken and edited from https://github.com/khanh-moriaty/autosurvey
  const links = Object.values(
    document.getElementsByTagName('table')[0].getElementsByTagName('a')
  );
  let data = [];
  links.forEach((link) => {
    // if (link.innerHTML.match(/.*[Kk]hảo sát( về){0,1}môn học.*/)) {
    if (link.innerHTML.includes('khảo sát về môn học')) {
      data += link;
    }
  });
  return data;
}

// Execute URLs of forms in homepage
function UITAutoLecturerSurveyExecuteURLs() {
  // GM Variables
  let processingTimeForEachForm = GM_getValue(
    'processingTimeForEachForm',
    defaultProcessingTimeForEachForm
  );

  while (processingTimeForEachForm <= 0) {
    window.alert('Thời gian xử lý mỗi form phải > 0 😐');
    processingTimeForEachForm = window.prompt(
      'Nhập thời gian xử lý mỗi form (second). Nên >= 5 tuỳ vào tốc độ mạng và kết nối server. Nếu quá nhanh, chưa kịp xong form cũ sẽ bị lỗi.',
      '5'
    );
    GM_setValue('processingTimeForEachForm', processingTimeForEachForm);
  }
  processingTimeForEachForm = processingTimeForEachForm * 1000;

  const links = UITAutoLecturerSurveyGetURL();
  if (links.length > 0) {
    links.forEach((link) => {
      setTimeout(() => {
        window.open(link.href, '_blank');
      }, processingTimeForEachForm);
      window.alert('Done các link khảo sát! 😎');
    });
  } else {
    window.alert('Không tìm thấy link khảo sát nào! Hoặc tạo issue nếu lỗi 😐');
  }
}

// ---------- END HOMEPAGE FUNCTIONS ----------

// ---------- START EXECUTE FUNCTION ----------

function UITAutoLecturerSurveyRunScript() {
  // GM Variables
  const firstTypeSelectionsArray = GM_getValue('firstTypeSelectionsArray', [
    defaultFirstTypeSelectionsArray[2] +
      defaultFirstTypeSelectionsArray[6] +
      defaultFirstTypeSelectionsArray[7],
  ]);
  const secondTypeSelectionsArray = GM_getValue(
    'secondTypeSelectionsArray',
    defaultSecondTypeSelectionsArray.slice(3)
  );
  const processingTimeBeforeContinueForm = GM_getValue(
    'processingTimeBeforeContinueForm',
    defaultProcessingTimeBeforeContinueForm
  );

  // Sort array randomly and return array
  function sortArrayRandomly(array) {
    return array.sort(() => {
      return Math.random() - 0.5;
    });
  }

  // Return random index of array
  function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
  }

  // Select first type questions
  const answerLabels = document.querySelectorAll('label.answertext');
  answerLabels.forEach(function (label) {
    const firstTypeSelectionsArrayRandom = sortArrayRandomly(
      firstTypeSelectionsArray
    );
    for (let i = 0; i < firstTypeSelectionsArrayRandom.length; i++) {
      if (label.innerText.trim() === firstTypeSelectionsArrayRandom[i]) {
        label.click();
        break;
      }
    }
  });

  // Select second type questions
  const secondTypeSelectionsClassArray = secondTypeSelectionsArray.map(
    (className) => `.${className}answer-item.radio-item`
  );
  const secondTypeQuestions = document.querySelectorAll(
    '.answers-list.radio-list'
  );
  secondTypeQuestions.forEach((secondTypeQuestion) => {
    const randomElementClass =
      secondTypeSelectionsClassArray[
        randomIndex(secondTypeSelectionsClassArray)
      ];
    const randomElement = secondTypeQuestion.querySelector(randomElementClass);
    if (randomElement) {
      randomElement.click();
    }
  });

  // Sleep before continue to next page / submit form
  setTimeout(() => {}, processingTimeBeforeContinueForm);

  // Continue to next page
  const moveNextBtn = document.querySelector(
    'button[type="submit"][id="movenextbtn"]'
  );
  if (moveNextBtn) {
    moveNextBtn.click();
  }

  // Submit form
  const submitBtn = document.getElementById('movesubmitbtn');
  if (submitBtn) {
    submitBtn.click();
  }

  // Close tab when done
  const doneWindow = document.querySelector('.site-name');
  if (doneWindow.innerText.trim() === 'HOÀN THÀNH KHẢO SÁT') {
    window.close();
  }
}

// ---------- END EXECUTE FUNCTION ----------

// ---------- START GM ----------

// GM UI to get values and save to GM storage
function UITAutoLecturerSurveyGMUI() {
  console.log('UIT - Auto Lecturer Survey');
  // Function to create H1
  function createH1(H1Lable, fatherElement) {
    const H1Element = document.createElement('h1');
    H1Element.textContent = H1Lable;
    H1Element.style.fontWeight = 'bold';
    H1Element.style.fontSize = 'larger';
    fatherElement.appendChild(H1Element);
  }

  // GM UI container
  const gmUIContainer = document.createElement('div');
  gmUIContainer.style.position = 'fixed';
  gmUIContainer.style.top = '50%';
  gmUIContainer.style.left = '50%';
  gmUIContainer.style.transform = 'translate(-50%, -50%)';
  gmUIContainer.style.backgroundColor = '#fff';
  gmUIContainer.style.padding = '1.25rem';
  gmUIContainer.style.border = '0.2rem solid #115d9d';
  gmUIContainer.style.borderRadius = '0.5rem';
  gmUIContainer.style.zIndex = '9999';
  gmUIContainer.style.height = '25rem';
  gmUIContainer.style.overflow = 'auto';
  // // Add blur effect to elements outside gmUIContainer
  // const body = document.querySelector('body');
  // body.style.filter = 'blur(5px) brightness(0.5)';
  // // Remove blur effect when gmUIContainer is closed
  // gmUIContainer.addEventListener('transitionend', function () {
  //   if (gmUIContainer.style.height === '0px') {
  //     body.style.filter = 'none';
  //   }
  // });

  const gmUIForm = document.createElement('form');
  gmUIForm.style.display = 'flex';
  gmUIForm.style.flexDirection = 'column';

  // First type selections
  createH1('Khảo sát loại 1', gmUIForm);
  const firstTypeTable = document.createElement('table');
  firstTypeTable.style.borderCollapse = 'collapse';
  for (const selection of defaultFirstTypeSelectionsArray) {
    const row = document.createElement('tr');
    const optionCell = document.createElement('td');
    optionCell.textContent = selection;
    row.appendChild(optionCell);
    const checkboxCell = document.createElement('td');
    checkboxCell.style.textAlign = 'right';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'firstTypeSelectionsArray';
    checkbox.value = selection;
    checkbox.checked = GM_getValue('firstTypeSelectionsArray', []).includes(
      selection
    );
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);
    firstTypeTable.appendChild(row);
    checkbox.addEventListener('click', () => {
      checkbox.click();
    });
    checkboxCell.addEventListener('click', () => {
      checkbox.click();
    });
    optionCell.addEventListener('click', () => {
      checkbox.click();
    });
  }
  gmUIForm.appendChild(firstTypeTable);

  // Second type selections
  createH1('Khảo sát loại 2 (Bảng)', gmUIForm);
  const secondTypeTable = document.createElement('table');
  secondTypeTable.style.borderCollapse = 'collapse';
  const secondTypeRow = document.createElement('tr');
  for (const selection of defaultSecondTypeSelectionsArray) {
    const checkboxCell = document.createElement('td');
    checkboxCell.style.textAlign = 'center';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'secondTypeSelectionsArray';
    checkbox.value = selection;
    checkbox.checked = GM_getValue('secondTypeSelectionsArray', []).includes(
      selection
    );
    const label = document.createElement('label');
    label.textContent = selection;
    checkboxCell.appendChild(label);
    checkboxCell.appendChild(checkbox);
    checkbox.addEventListener('click', () => {
      checkbox.click();
    });
    checkboxCell.addEventListener('click', () => {
      checkbox.click();
    });
    secondTypeRow.appendChild(checkboxCell);
  }
  secondTypeTable.appendChild(secondTypeRow);
  gmUIForm.appendChild(secondTypeTable);

  // Processing time for each form
  createH1('Thời gian xử lý giữa các form (seconds)', gmUIForm);

  const processingTimeForEachFormInput = document.createElement('input');
  processingTimeForEachFormInput.type = 'number';
  processingTimeForEachFormInput.name = 'processingTimeForEachForm';
  processingTimeForEachFormInput.value = GM_getValue(
    'processingTimeForEachForm',
    defaultProcessingTimeForEachForm
  );
  processingTimeForEachFormInput.min = 0;
  gmUIForm.appendChild(processingTimeForEachFormInput);

  // Processing time before continue form
  createH1('Thời gian next trang của 1 form (milliseconds)', gmUIForm);

  const processingTimeBeforeContinueFormInput = document.createElement('input');
  processingTimeBeforeContinueFormInput.type = 'number';
  processingTimeBeforeContinueFormInput.name =
    'processingTimeBeforeContinueForm';
  processingTimeBeforeContinueFormInput.value = GM_getValue(
    'processingTimeBeforeContinueForm',
    0
  );
  processingTimeBeforeContinueFormInput.min = 0;
  gmUIForm.appendChild(processingTimeBeforeContinueFormInput);

  // Save button
  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.textContent = 'Save';

  // Cancel button
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';

  // Create table for save and cancel buttons
  const saveAndCancelButtonTable = document.createElement('table');
  saveAndCancelButtonTable.style.verticalAlign = 'middle';
  saveAndCancelButtonTable.style.width = 'fit-content';
  saveAndCancelButtonTable.style.margin = 'auto';
  const saveAndCancelRow = document.createElement('tr');
  const saveCell = document.createElement('td');
  saveCell.appendChild(saveButton);
  const cancelCell = document.createElement('td');
  cancelCell.appendChild(cancelButton);
  saveAndCancelRow.appendChild(cancelCell);
  saveAndCancelRow.appendChild(saveCell);
  saveAndCancelButtonTable.appendChild(saveAndCancelRow);
  gmUIForm.appendChild(saveAndCancelButtonTable);

  // Design lỏ message
  const shitDesignMessage = document.createElement('p');
  shitDesignMessage.textContent = 'Xin lõi khum biet design UI =))';
  gmUIForm.appendChild(shitDesignMessage);

  gmUIContainer.appendChild(gmUIForm);
  document.body.appendChild(gmUIContainer);

  // Save values to GM storage
  gmUIForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstTypeSelectionsArray = Array.from(
      gmUIForm.elements['firstTypeSelectionsArray']
    )
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    GM_setValue('firstTypeSelectionsArray', firstTypeSelectionsArray);

    const secondTypeSelectionsArray = Array.from(
      gmUIForm.elements['secondTypeSelectionsArray']
    )
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    GM_setValue('secondTypeSelectionsArray', secondTypeSelectionsArray);

    GM_setValue(
      'processingTimeForEachForm',
      parseInt(processingTimeForEachFormInput.value)
    );
    GM_setValue(
      'processingTimeBeforeContinueForm',
      parseInt(processingTimeBeforeContinueFormInput.value)
    );

    gmUIContainer.remove();
  });

  // Cancel button functionality
  const cancelGMUI = () => {
    gmUIContainer.remove();
  };

  cancelButton.addEventListener('click', cancelGMUI);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      cancelGMUI();
    }
  });

  setTimeout(() => {
    document.addEventListener('click', (event) => {
      if (!gmUIContainer.contains(event.target)) {
        cancelGMUI();
      }
    });
  }, 100);
}

// Add GM UI style
GM_addStyle(`
  input[type="checkbox"] {
    margin-right: 5px;
  }
  h1 {
    margin-bottom: 5px;
  }
  button {
    margin-top: 10px;
  }
`);

// Check if GM storage is empty
function UITAutoLecturerSurveyGMStorageIsEmpty() {
  return (
    GM_getValue('firstTypeSelectionsArray', []).length === 0 &&
    GM_getValue('secondTypeSelectionsArray', []).length === 0 &&
    GM_getValue('processingTimeForEachForm', '') === '' &&
    GM_getValue('processingTimeBeforeContinueForm', '') === ''
  );
}

// ---------- END GM ----------

// ---------- START SUB0MAIN FUNCTIONS ----------

function UITAutoLecturerSurveyAtHomePage() {
  const headElement = UITAutoLecturerSurveyHomePagePosition();
  UITAutoLecturerSurveyParagraph(headElement);
  UITAutoLecturerSurveyAddButton(
    headElement,
    'Auto Lecturer Survey',
    'Tự động làm các form khảo sát giảng viên trên trang này',
    UITAutoLecturerSurveyExecuteURLs
  );
  UITAutoLecturerSurveyAddButton(
    headElement,
    'Variables Setting',
    'Chỉnh variables UIT - Auto Lecturer Survey',
    UITAutoLecturerSurveyGMUI
  );
  if (UITAutoLecturerSurveyGMStorageIsEmpty()) {
    window.alert(
      'UIT - Auto Lecturer Survey\nTuỳ chọn option trước rồi tính nhen 😇'
    );
    UITAutoLecturerSurveyGMUI();
  }
}

// ---------- START MAIN FUNCTION ----------

(function UITAutoLecturerSurveyMain() {
  'use strict';
  GM_registerMenuCommand('Variables Setting', UITAutoLecturerSurveyGMUI, {
    title: 'Variables setting for UIT - Auto Lecturer Survey',
  });
  if (window.location.pathname === '/sinhvien/phieukhaosat') {
    UITAutoLecturerSurveyAtHomePage();
  } else {
    UITAutoLecturerSurveyRunScript();
  }
})();

// ---------- END MAIN FUNCTION ----------
