let data = [];
let nowArea;

// 指定DOM
const result = document.querySelector('#searchResult-text'); // 資料數量
const select = document.querySelector('.regionSearch'); // 選單
const list = document.querySelector('.ticketCard-area'); // 景點區域
const ticketName = document.querySelector('.ticketName'); // 套票名稱
const ticketImgUrl = document.querySelector('.ticketImgUrl'); // 圖片網址
const ticketRegion = document.querySelector('.ticketRegion'); // 景點地區
const ticketPrice = document.querySelector('.ticketPrice'); // 套票金額
const ticketNum = document.querySelector('.ticketNum'); // 套票組數
const ticketRate = document.querySelector('.ticketRate'); // 套票星級
const ticketDescription = document.querySelector('.ticketDescription'); //套票描述
const addTicketBtn = document.querySelector('.addTicket-btn'); // 新增套票按鈕
const form = document.querySelector('.addTicket-form'); // 表單

// 載入API資料並初始化
function init() {
  axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json')
    .then(function (res) {
      data = res.data;
      renderList(data);
      renderOption(data);
      renderC3();
    });
}
init();

// 更新網頁內容
function renderList(data) {
  let str = '';
  data.forEach(function (item, index) {

    let content =
      `
      <li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#"><img src="${item.imgUrl}" alt=""></a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
        <div>
        <h3>
        <a href="#" class="ticketCard-name">${item.name}</a>
      </h3>
          <p class="ticketCard-description">${item.description}</p>
        </div>
          <div class="ticketCard-info">
            <div class="ticketCard-num">
              <p><span><i class="fas fa-exclamation-circle"></i></span>剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組</p>
            </div>
            <p class="ticketCard-price">TWD <span id="ticketCard-price">${item.price}</span></p>
          </div>
       </div>
      </li>
    `
    str += content;
  })
  list.innerHTML = str;
  result.textContent = `本次搜尋共 ${data.length} 筆資料`;

}

// 新增C3
function renderC3() {
  let totalObj = {}; // {高雄: 1, 台北: 1, 台中: 1}
  data.forEach(function (item, index) {
    if (totalObj[item.area] === undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
  })

  let newData = [];
  let area = Object.keys(totalObj); // ["高雄", "台北", "台中"]
  [area[0], area[1], area[2]] = [area[1], area[2], area[0]]; // 重組陣列中資料順序
  area.forEach(function (item, index) {
    let ary = [];
    ary.push(item, totalObj[item]);
    newData.push(ary);

  })

  const chart = c3.generate({
    bindto: ".chart",
    data: {
      columns: newData,
      type: 'donut',
      colors: {
        "台北": "#26BFC7",
        "台中": "#5151D3",
        "高雄": "#E68618"
      }
    },
    donut: {
      title: "套票地區比重"
    }
  });
}

// 渲染option
function renderOption(data) {
  let dataList = [];

  data.forEach(function (item, index) {
    if (dataList.indexOf(item.area) === -1) {
      dataList.push(item.area);
    }
  })

  dataList.forEach(function (item, index) {
    let option = document.createElement('option');
    option.setAttribute('value', item);
    option.textContent = item;
    select.appendChild(option);
  })
}

// 切換地區並顯示該地區資料
function onchange(e) {
  nowArea = e.target.value;
  filterArea(nowArea);
}

// 篩選地區
function filterArea(nowArea) {
  let currentData = [];
  data.forEach(function (item, index) {
    if (nowArea === '全部地區') {
      renderList(data);
    } else if (nowArea == item.area) {
      currentData.push(item);   // 將符合的地區加到新的陣列中
      renderList(currentData);
    }
  })
}

// 新增套票
function addTicket() {
  let obj = {};
  obj.id = Date.now();  // 回傳對應於當下時間的數值
  obj.name = ticketName.value;
  obj.imgUrl = ticketImgUrl.value;
  obj.area = ticketRegion.value;
  obj.description = ticketDescription.value;
  obj.group = parseInt(ticketNum.value);
  obj.price = parseInt(ticketPrice.value);
  obj.rate = parseInt(ticketRate.value);


  if (ticketName.value == '' || ticketImgUrl.value == '' || ticketRegion.value == '' || ticketDescription.value == '' ||
    ticketNum.value == '' || ticketPrice.value == '' || ticketRate.value == '') {
    alert('有欄位尚未填寫');
    form.reset(); // 清除所有表單內容
    return;
  } else {
    form.reset(); // 清除所有表單內容
  }
  data.push(obj);
  renderC3();
  nowArea = select.value; // 去判斷目前select目前字串的值在去抓取該值的資料
  filterArea(nowArea);
}

// 監聽
select.addEventListener('change', onchange);
addTicketBtn.addEventListener('click', addTicket);
