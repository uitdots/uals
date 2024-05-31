# ✨ UIT - AUTO LECTURER SURVEY ✨

<pre align="center">
██╗   ██╗███████╗███████╗██████╗ ███████╗ ██████╗██████╗ ██╗██████╗ ████████╗
██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗██║██╔══██╗╚══██╔══╝
██║   ██║███████╗█████╗  ██████╔╝███████╗██║     ██████╔╝██║██████╔╝   ██║   
██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║██║     ██╔══██╗██║██╔═══╝    ██║   
╚██████╔╝███████║███████╗██║  ██║███████║╚██████╗██║  ██║██║██║        ██║   
 ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   
<strong>UIT - AUTO LECTURER SURVEY</strong> <em>(UALS)</em>
Tự động khảo sát giảng viên <em>(khảo sát môn học)</em> cho sinh viên trường UIT
</pre>

[![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/KevinNitroG/UIT-Auto-Lecturer-Survey?style=for-the-badge&color=CAEDFF)](../../commits/main)
![GitHub issues](https://img.shields.io/github/issues-raw/KevinNitroG/UIT-Auto-Lecturer-Survey?style=for-the-badge&color=ffadad)
![GitHub closed issues](https://img.shields.io/github/issues-closed/KevinNitroG/UIT-Auto-Lecturer-Survey?style=for-the-badge&color=%23ffc6ff)
![GitHub repo size](https://img.shields.io/github/repo-size/KevinNitroG/UIT-Auto-Lecturer-Survey?style=for-the-badge&color=D8B4F8)
[![GitHub contributors](https://img.shields.io/github/contributors/KevinNitroG/UIT-Auto-Lecturer-Survey?style=for-the-badge&color=FBF0B2)](../../graphs/contributors)
[![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/KevinNitroG/UIT-Auto-Lecturer-Survey?style=for-the-badge)](https://www.codefactor.io/repository/github/kevinnitrog/uit-auto-lecturer-survey)
[![wakatime](https://wakatime.com/badge/github/KevinNitroG/UIT-Auto-Lecturer-Survey.svg?style=for-the-badge)](https://wakatime.com/badge/github/KevinNitroG/UIT-Auto-Lecturer-Survey)

[![DeepSource](https://app.deepsource.com/gh/KevinNitroG/UIT-Auto-Lecturer-Survey.svg/?label=active+issues&show_trend=true&token=af8s5K2DNJnNqcemAWM_beFG)](https://app.deepsource.com/gh/KevinNitroG/UIT-Auto-Lecturer-Survey/)
[![DeepSource](https://app.deepsource.com/gh/KevinNitroG/UIT-Auto-Lecturer-Survey.svg/?label=resolved+issues&show_trend=true&token=af8s5K2DNJnNqcemAWM_beFG)](https://app.deepsource.com/gh/KevinNitroG/UIT-Auto-Lecturer-Survey/)

> [!IMPORTANT]
>
> Cần lắm người đập đi xây lại hộ. Chính tôi còn không biết tôi viết cái gì 😐
>
> Tôi không biết code JS

---

## 📃 TABLE OF CONTENTS

- [✨ UIT - AUTO LECTURER SURVEY ✨](#-uit---auto-lecturer-survey-)
  - [📃 TABLE OF CONTENTS](#-table-of-contents)
  - [🎆 CHỨC NĂNG](#-chức-năng)
  - [🥂 DEMO](#-demo)
    - [🖼️ Image](#️-image)
    - [🎬 Video](#-video)
  - [🪴 HƯỚNG DẪN](#-hướng-dẫn)
    - [1️⃣ Cài đặt extension Tampermonkey](#1️⃣-cài-đặt-extension-tampermonkey)
    - [2️⃣ Cài script](#2️⃣-cài-script)
    - [3️⃣ Ấn khảo sát](#3️⃣-ấn-khảo-sát)
    - [4️⃣ Tắt script khi không sử dụng](#4️⃣-tắt-script-khi-không-sử-dụng)
  - [📒 TODO](#-todo)
  - [📝 LICENSE](#-license)
  - [⭐ STAR GRAPH](#-star-graph)

---

## 🎆 CHỨC NĂNG

- Nút tự động làm khảo sát tại [HOMEPAGE](https://student.uit.edu.vn/sinhvien/phieukhaosat)
- Nút setting để tuỳ chỉnh option tự động chọn
- Chọn random cho khảo sát loại 1
  > [Option loại 1](/UITAutoLecturerSurvey.user.js#L26)
- Chọn random đánh giá 1 → 4 cho khảo sát loại 2
  > [Option loại 2](/UITAutoLecturerSurvey.user.js#L38)
- Tự động ấn tiếp tục, hoàn thành khảo sát, đóng tab khi hoàn thành

---

## 🥂 DEMO

### 🖼️ Image

- Home Page
  ![Home Page Demo Image](assets/Image/HomePage.png)
- Home Page - Setting
  ![Home Page - Setting Demo Image](assets/Image/HomePage-Setting.png)

### 🎬 Video

Chưa có ní ơi

---

## 🪴 HƯỚNG DẪN

### 1️⃣ Cài đặt extension Tampermonkey

- [![Chrome](https://img.shields.io/badge/Chrome-ffc6ff?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [![Microsoft Edge](https://img.shields.io/badge/Edge-a0c4ff?style=for-the-badge&logo=microsoftedge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
- [![Safari](https://img.shields.io/badge/Safari-bdb2ff?style=for-the-badge&logo=safari&logoColor=white)](https://apps.apple.com/us/app/tampermonkey/id1482490089)
- [![Firefox](https://img.shields.io/badge/Firefox-%23ffd6a5?style=for-the-badge&logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [![Opera](https://img.shields.io/badge/Opera-ffadad?style=for-the-badge&logo=opera&logoColor=white)](https://addons.opera.com/en/extensions/details/tampermonkey-beta/)

### 2️⃣ Cài script

[![UIT Lecturer Survey](https://img.shields.io/badge/UIT_Auto_Lecturer_Survey-Tampermonkey-a0c4ff?style=for-the-badge)](../../raw/main/UITAutoLecturerSurvey.user.js)

### 3️⃣ Ấn khảo sát

1. Vào trang khảo sát _(1 trong 2 link)_
   - https://link.uit.edu.vn/khaosatmh
   - https://student.uit.edu.vn/sinhvien/phieukhaosat
2. 2 kiểu:
   - Ấn `Auto Lecturer Survey` để tự động làm hết khảo sát
   - Ấn từng link khảo sát để làm

> [!NOTE]
>
> Khuyến khích config variable như lày
>
> ![sample-variable-config](./assets/Image/sample-variables-setup.png)
>
> Nếu muốn tự làm khảo sát thì cần tắt userscript hoặc tắt extension Tampermonkey trước

### 4️⃣ Tắt script khi không sử dụng

- `Tampermonkey` _(Extension settings)_ > `Dashboard` > `UIT - Auto Lecturer Survey` > Gạt tắt

> [!CAUTION]
>
> Vì không rõ các link khảo sát sẽ giống nhau hay không nên thôi tốt nhất tắt khi không sử dụng. Chỉ bật khi làm khảo sát giảng viên thôi 😇

---

## 📒 TODO

- [ ] Split first type question
- [ ] Có cách nào tự động tiếp tục khảo sát tiếp theo sau khi hoàn thành khảo sát, ngoài việc đặt thời gian cụ thể?

---

## 📝 LICENSE

[![License: MIT](https://img.shields.io/badge/License-MIT-9bf6ff?style=for-the-badge)](./LICENSE)

---

## ⭐ STAR GRAPH

<a href="https://star-history.com/#KevinNitroG/UIT-Auto-Lecturer-Survey&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=KevinNitroG/UIT-Auto-Lecturer-Survey&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=KevinNitroG/UIT-Auto-Lecturer-Survey&type=Timeline" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=KevinNitroG/UIT-Auto-Lecturer-Survey&type=Timeline" />
  </picture>
</a>
