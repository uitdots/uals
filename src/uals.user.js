// ==UserScript==
// @name            UIT - Auto Lecture Survey (UALS)
// @version         3.0.0
// @author          Kevin Nitro
// @namespace       https://github.com/KevinNitroG
// @description     Userscript tự động khảo sát môn học UIT. Khuyến nghị disable script khi không sử dụng, tránh conflict với các khảo sát / link khác của trường.
// @downloadURL     https://github.com/KevinNitroG/UIT-Auto-Lecture-Survey/raw/main/src/uals.user.js
// @updateURL       https://github.com/KevinNitroG/UIT-Auto-Lecture-Survey/raw/main/src/uals.user.js
// @supportURL      https://github.com/KevinNitroG/UIT-Auto-Lecture-Survey/issues
// @license         https://github.com/KevinNitroG/UIT-Auto-Lecture-Survey/raw/main/LICENSE
// @icon            https://github.com/KevinNitroG/UIT-Auto-Lecture-Survey/raw/main/assets/images/UIT-logo.png
// @run-at          document-idle
// @match           http*://student.uit.edu.vn/sinhvien/phieukhaosat
// @match           http*://survey.uit.edu.vn/index.php/survey/index
// @match           http*://survey.uit.edu.vn/index.php/survey/index/sid/*/token/*
// @grant           GM_addValueChangeListener
// @grant           GM_removeValueChangeListener
// @grant           GM_addStyle
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_notification
// @grant           GM_openInTab
// @grant           GM_setValue
// @grant           window.close
// ==/UserScript==

(function () {
  'use strict';

  const SELECTIONS = {
    first: {
      question: 'Tỷ lệ thời gian Anh/Chị lên lớp đối với môn học này',
      rawQuestions: [
        '*Tỷ lệ thời gian Anh/Chị lên lớp đối với môn học này\n',
        '* Tỷ lệ thời gian Anh/Chị lên lớp đối với môn học này\n',
      ],
      answers: [
        { label: '<50%', selector: 'ul:nth-child(1) input' },
        { label: '50-80%', selector: 'ul:nth-child(2) input' },
        { label: '>80%', selector: 'ul:nth-child(3) input' },
      ],
    },
    second: {
      question:
        'Anh chị tự đánh giá đạt được bao nhiêu % chuẩn đầu ra của môn học này',
      rawQuestions: [
        '*Anh chị tự đánh giá đạt được bao nhiêu % chuẩn đầu ra của môn học này:\n',
      ],
      answers: [
        {
          label: 'Không biết chuẩn đầu ra là gì',
          selector: 'ul:nth-child(1) li:nth-child(1) input',
        },
        {
          label: 'Dưới 50%',
          selector: 'ul:nth-child(1) li:nth-child(2) input',
        },
        {
          label: 'Từ 50 đến dưới 70%',
          selector: 'ul:nth-child(1) li:nth-child(3) input',
        },
        {
          label: 'Từ 70 đến dưới 90%',
          selector: 'ul:nth-child(2) li:nth-child(1) input',
        },
        {
          label: 'Trên 90%',
          selector: 'ul:nth-child(2) li:nth-child(2) input',
        },
      ],
    },
    third: {
      question: 'Đánh giá về hoạt động giảng dạy trực tuyến của Giảng viên',
      container:
        'table[summary="Đánh giá về hoạt động giảng dạy trực tuyến của Giảng viên - an array type question"] .answers-list.radio-list',
      answers: [
        { selector: '.answer_cell_00MH01.answer-item.radio-item' },
        { selector: '.answer_cell_00MH02.answer-item.radio-item' },
        { selector: '.answer_cell_00MH03.answer-item.radio-item' },
        { selector: '.answer_cell_00MH04.answer-item.radio-item' },
      ],
    },
  };

  const CONTINUE_BUTTON_SELECTOR = 'button[type="submit"][id="movenextbtn"]';
  const SUBMIT_BUTTON_SELECT = '#movesubmitbtn';

  const GM_BROADCAST_KEY_NAME = 'broadcast';
  const WINDOW_DONE_TITLE = 'HOÀN THÀNH KHẢO SÁT';

  const STYLE = `
    #uals__container {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .uals__btn-container {
      align-items: center;
      display: flex;
      justify-content: center;
    }

    .uals__btn {
      background-color: #115d9d;
      border-radius: 0.5rem;
      border: none;
      color: white;
      margin: 0.4rem 0.3rem;
      padding: 0.4rem 0.5rem;
      transition: background-color 0.3s ease-in-out;
    }

    .uals__btn:hover {
      background-color: #1678cb;
    }

    #uals__menu-container {
      display: none;
      overflow: hidden;
      transition: height 0.5s;
    }

    .uals__menu-container--show {
      display: inline-block !important;
      height: auto;
    }

    .uals__run-btn--unavailable, .uals__run-btn--unavailable:hover {
      cursor: default;
      filter: brightness(70%);
    }

    .uals__run-btn--running {
      background-color: red !important;
    }

    .uals__please_star {
      align-items: center;
      display: flex;
      justify-content: center;
    }

    .uals__form-select {
      align-items: center;
      display: flex;
      flex-direction: row;
    }

    .uals__form-select>label {
      margin: 0 0.5rem 0 0;
      padding: 0 0.5rem 0 0.5rem;
      vertical-align: middle;
    }
  `;

  // NOTE: Some of methods can be marked as static but I'm too tired to try and check if it works or not

  function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  class Model {
    #firstOpts;
    #secondOpts;
    #thirdOpts;
    static #firstOptsKey = 'userFirstOpts';
    static #secondOptsKey = 'usersecondOpts';
    static #thirdOptsKey = 'userthirdOpts';

    constructor() {
      this.#firstOpts = GM_getValue(Model.#firstOptsKey, []);
      this.#secondOpts = GM_getValue(Model.#secondOptsKey, []);
      this.#thirdOpts = GM_getValue(Model.#thirdOptsKey, []);
    }

    addStyles() {
      GM_addStyle(STYLE);
    }

    setUserOpts(userOpts) {
      this.#firstOpts = userOpts.firstOpts;
      this.#secondOpts = userOpts.secondOpts;
      this.#thirdOpts = userOpts.thirdOpts;
    }

    getUserOpts() {
      return {
        firstOpts: this.#firstOpts,
        secondOpts: this.#secondOpts,
        thirdOpts: this.#thirdOpts,
      };
    }

    saveUserOpts() {
      GM_setValue(Model.#firstOptsKey, this.#firstOpts);
      GM_setValue(Model.#secondOptsKey, this.#secondOpts);
      GM_setValue(Model.#thirdOptsKey, this.#thirdOpts);
    }

    static deleteUserOpts() {
      const keys = GM_listValues();
      for (const key of keys) {
        GM_deleteValue(key);
      }
    }

    checkUserOptsExist() {
      if (
        this.#firstOpts.length === 0 ||
        this.#secondOpts.length === 0 ||
        this.#thirdOpts.length === 0
      ) {
        GM_notification({
          text: 'Bạn cần thiết lập các tuỳ chọn 🥵',
          title: 'UALS',
          tag: 'uals-require_config',
          timeout: 3000,
        });
        return false;
      }
      return true;
    }
  }

  class BroadcastSvc {
    #id;

    constructor(callback) {
      this.#id = GM_addValueChangeListener(GM_BROADCAST_KEY_NAME, callback);
    }

    removeReceiveMsgListener() {
      GM_deleteValue(GM_BROADCAST_KEY_NAME);
      GM_removeValueChangeListener(this.#id);
    }

    static sendDone() {
      GM_setValue(GM_BROADCAST_KEY_NAME, BroadcastSvc._genRandomVal());
    }

    static _genRandomVal() {
      const min = Number.MIN_SAFE_INTEGER; // -9007199254740991
      const max = Number.MAX_SAFE_INTEGER; //  9007199254740991
      let val;
      do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (val === GM_getValue(GM_BROADCAST_KEY_NAME, null));
      return val;
    }
  }

  class DoSurvey {
    #answerTables;
    firstOpt;
    secondOpt;
    #thirdOpts;

    constructor() {
      const { firstOpts, secondOpts, thirdOpts } = new Model().getUserOpts();
      this.firstOpt = getRandomElement(firstOpts);
      this.secondOpt = getRandomElement(secondOpts);
      this.#thirdOpts = thirdOpts;
      this.#answerTables = [
        ...document.querySelectorAll('table.question-wrapper'),
      ];
      this._run();
    }

    _continueOnWelcome() {
      const welcomeTable = document.querySelector('table.welcome-table');
      if (!welcomeTable) {
        return;
      }
      this._continue();
    }

    _firstTypeRun() {
      const table = this.#answerTables.find((table) =>
        SELECTIONS.first.rawQuestions.some(
          (q) => q === table.querySelector('tr').innerText,
        ),
      );
      if (!table) {
        return;
      }
      table
        .querySelector(SELECTIONS.first.answers[this.firstOpt].selector)
        .click();
      return;
    }

    _secondTypeRun() {
      const table = this.#answerTables.find((table) =>
        SELECTIONS.second.rawQuestions.some(
          (q) => q === table.querySelector('tr').innerText,
        ),
      );
      if (!table) {
        return;
      }
      table
        .querySelector(SELECTIONS.second.answers[this.secondOpt].selector)
        .click();
    }

    _thirdTypeRun() {
      const questions = document.querySelectorAll(SELECTIONS.third.container);
      if (questions.length === 0) {
        return;
      }
      questions.forEach((question) =>
        question
          .querySelector(
            SELECTIONS.third.answers[getRandomElement(this.#thirdOpts)]
              .selector,
          )
          .click(),
      );
    }

    _continue() {
      (
        document.querySelector(CONTINUE_BUTTON_SELECTOR) ??
        document.querySelector(SUBMIT_BUTTON_SELECT)
      ).click();
    }

    _done() {
      if (
        document.querySelector('.site-name')?.innerText.trim() ===
        WINDOW_DONE_TITLE
      ) {
        BroadcastSvc.sendDone();
        window.close();
      }
    }

    _run() {
      this._continueOnWelcome();
      this._done();
      this._firstTypeRun();
      this._secondTypeRun();
      this._thirdTypeRun();
      this._continue();
    }
  }

  class AutoRun {
    #broadCast;
    #surveys;
    #current;

    constructor(surveys) {
      this.#surveys = surveys;
      this.#current = 0;
      window.addEventListener('beforeunload', this._confirmCloseTab);
      this.#broadCast = new BroadcastSvc(() => this._iterateSurvey());
      this._run();
    }

    _iterateSurvey() {
      this.#current++;
      if (this.#current < this.#surveys.length) {
        this._run();
      } else {
        window.removeEventListener('beforeunload', this._confirmCloseTab);
        GM_notification({
          text: 'Đã hoàn thành xong tất cả các khảo sát 😇',
          title: 'UALS',
          tag: 'uals-auto_survey_done',
          timeout: 3000,
        });
        this.#broadCast.removeReceiveMsgListener();
        location.reload();
      }
    }

    _run() {
      GM_openInTab(this.#surveys[this.#current], {
        active: false,
      });
    }

    _confirmCloseTab(e) {
      e.preventDefault();
      e.returnValue = '';
    }
  }

  class ViewRunAuto {
    #surveyList;
    #autoRun;

    constructor(surveyList) {
      this.#surveyList = surveyList;
      this.#autoRun = null;
    }

    _startBtnHTML() {
      return `
        <button class="uals__btn" id="uals__run-btn">
          Run Auto
        </button>
      `;
    }

    _stopBtnHTML() {
      return `
        <button class="uals__btn uals__run-btn--running" id="uals__run-btn">
          Stop Auto
        </button>
      `;
    }

    _unavailableBtnHTML() {
      return `
        <button class="uals__btn uals__run-btn--unavailable" id="uals__run-btn" disabled>
          No Survey
        </button>
      `;
    }

    btnHTML() {
      return this.#surveyList.length === 0
        ? this._unavailableBtnHTML()
        : this._startBtnHTML();
    }

    addHandler() {
      document.querySelector('#uals__run-btn').addEventListener('click', () => {
        if (this.#autoRun) {
          GM_notification({
            text: 'Bạn đã dùng Auto Run rồi. Hãy refresh trang để refresh',
            title: 'UALS',
            tag: 'uals-already_auto_run',
            timeout: 3000,
          });
          return;
        }
        this.#autoRun = new AutoRun(this.#surveyList);
      });
    }
  }

  class ViewConfig {
    #model;

    constructor(model) {
      this.#model = model;
    }

    btnHTML() {
      return `
        <button class="uals__btn" id="uals__config-btn">
          Config
        </button>
      `;
    }

    _pleaseStarHTML() {
      return `
        <p class="uals__please_star">👆 Cho mình xin 1 star repo dới 👆</p>
      `;
    }

    _saveConfigBtnHTML() {
      return `
        <button class="uals__btn" id="uals__save-config-btn">
          Save
        </button>
      `;
    }

    _resetConfigBtnHTML() {
      return `
        <button class="uals__btn" id="uals__reset-config-btn">
          Reset
        </button>
      `;
    }

    configMenuHTML() {
      return `
        <div id="uals__menu-container">
          <section class="uals__question-section">
            <h3 id="uals__menu-header">${SELECTIONS.first.question}</h3>
            <form class="uals__form-select" id="uals__select-1">
              ${SELECTIONS.first.answers
                .map(
                  (opt, index) =>
                    `
                    <input type="checkbox" name="uals__select-1-${index}" id="uals__select-1-${index}" value="${index}">
                    <label for="uals__select-1-${index}">${opt.label}</label>
                  `,
                )
                .join('')}
            </form>
          </section>
          <section class="uals__question-section">
            <h3 id="uals__menu-header">${SELECTIONS.second.question}</h3>
            <form class="uals__form-select" id="uals__select-2">
              ${SELECTIONS.second.answers
                .map(
                  (opt, index) =>
                    `
                  <input type="checkbox" name="uals__select-2-${index}" id="uals__select-2-${index}" value="${index}" />
                  <label for="uals__select-2-${index}">${opt.label}</label>
                `,
                )
                .join('')}
            </form>
          </section>
          <section class="uals__question-section">
            <h3 id="uals__menu-header">
              ${SELECTIONS.third.question}
            </h3>
            <form class="uals__form-select" id="uals__select-3">
              ${SELECTIONS.third.answers
                .map((_, index) => {
                  return `
                  <input type="checkbox" name="uals__select-3-${index}" id="uals__select-3-${index}" value="${index}" />
                  <label for="uals__select-3-${index}">Mức ${index + 1}</label>
                `;
                })
                .join('')}
            </form>
          </section>
          <div class="uals__btn-container">
            ${this._resetConfigBtnHTML()}
            ${this._saveConfigBtnHTML()}
          </div>
        </div>
      `;
    }

    toggleConfigMenu() {
      document
        .querySelector('#uals__menu-container')
        .classList.toggle('uals__menu-container--show');
    }

    tickOptsToPage() {
      Object.values(this.#model.getUserOpts()).forEach(
        (opts, selectionIndex) => {
          if (!opts) {
            return;
          }
          opts.forEach((opt) =>
            document
              .querySelector(`#uals__select-${selectionIndex + 1}-${opt}`)
              .click(),
          );
        },
      );
    }

    _fetchUserOptsFromPage() {
      function getSelections(CSSSelector) {
        const element = document.querySelector(CSSSelector);
        const formData = new FormData(element);
        return Object.values(Object.fromEntries([...formData])).map((val) =>
          parseInt(val),
        );
      }
      return {
        firstOpts: getSelections('#uals__select-1'),
        secondOpts: getSelections('#uals__select-2'),
        thirdOpts: getSelections('#uals__select-3'),
      };
    }

    _saveUserOptsHandler(handler) {
      handler.addEventListener('click', () => {
        const userOpts = this._fetchUserOptsFromPage();
        this.#model.setUserOpts(userOpts);
        this.#model.saveUserOpts();
        this.toggleConfigMenu();
      });
    }

    _resetUserOptsHandler(handler) {
      handler.addEventListener('click', () => {
        Model.deleteUserOpts();
        location.reload();
      });
    }

    addHandlers() {
      const configBtn = document.querySelector('#uals__config-btn');
      configBtn.addEventListener('click', this.toggleConfigMenu);
      this._saveUserOptsHandler(
        document.querySelector('#uals__save-config-btn'),
      );
      this._resetUserOptsHandler(
        document.querySelector('#uals__reset-config-btn'),
      );
    }
  }

  class View {
    #container;
    #model;
    #viewRunAuto;
    #viewConfig;

    constructor() {
      this.#container = this._getContainer();
      this.#model = new Model();
      this.#viewRunAuto = new ViewRunAuto(this._getSurveyURLs());
      this.#viewConfig = new ViewConfig(this.#model);
      this.#model.addStyles();
      this._render();
      this._addHandlers();
      if (!this.#model.checkUserOptsExist()) {
        this.#viewConfig.toggleConfigMenu();
      }
    }

    _getSurveyURLs() {
      const urls = [...document.querySelectorAll('table a')];
      return urls
        .filter((url) => url.innerHTML.includes('khảo sát về môn học'))
        .map((url) => url.getAttribute('href'));
    }

    _getContainer() {
      const html = `
        <div id="uals__container">
        </div>
      `;
      const position = document.querySelector('#content .content');
      position.insertAdjacentHTML('afterbegin', html);
      const container = position.querySelector('#uals__container');
      return container;
    }

    _insertElement(element) {
      this.#container.insertAdjacentHTML('beforeend', element);
    }

    _headerHTML() {
      return `
        <h2 align="center" style="margin: auto;">
          <a href="https://github.com/KevinNitroG/UIT-Auto-Lecture-Survey" target="_blank">
            UIT - Auto Lecture Survey
          </a>
        </h2>
      `;
    }

    _renderConfigMenu() {
      this._insertElement(this.#viewConfig.configMenuHTML());
    }

    _render() {
      this._insertElement(this._headerHTML());
      const btnContainer = `
        <div class="uals__btn-container">
          ${this.#viewConfig.btnHTML()}
          ${this.#viewRunAuto.btnHTML()}
        </div>
      `;
      this._insertElement(btnContainer);
      this._insertElement(this.#viewConfig.configMenuHTML());
      this.#viewConfig.tickOptsToPage();
    }

    _addHandlers() {
      this.#viewConfig.addHandlers();
      this.#viewRunAuto.addHandler();
    }
  }

  class Controller {
    #view;

    constructor() {
      this.#view = new View();
      this.#view;
    }
  }

  function init() {
    if (window.location.pathname === '/sinhvien/phieukhaosat') {
      new Controller();
    } else {
      new DoSurvey();
    }
  }

  try {
    init();
  } catch (e) {
    console.error(e);
    Model.deleteUserOpts();
    console.log(
      `Error occurs. Deleted UserScript's storage. Reloading website`,
    );
    GM_notification({
      text: 'Có lỗi, UALS tự động xoá storage của UALS và reload',
      title: 'UALS',
      tag: 'uals-error-reload',
      timeout: 3000,
    });
    location.reload();
  }
})();
