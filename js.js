const list = [];
const shops = JSON.parse(localStorage.getItem('lastShopsInfo')) || [];
let cardSum = 0, stickerSum = 0;

const createPreview = () => {
  const printBlock = document.querySelector('.print-block');
  printBlock.style.display = 'grid';
  const hiddenButton = document.querySelector('.hidden__button');
  hiddenButton.style.display = 'flex';
  list.sort();
  list.forEach(elem => {
    const arr = elem.split(';');
    const shopName = document.createElement('div');
    shopName.classList.add('shop-name');
    shopName.textContent = arr[0];
    printBlock.appendChild(shopName);
    const shopCards = document.createElement('div');
    shopCards.classList.add('quantity');
    shopCards.textContent = arr[1];
    printBlock.appendChild(shopCards);
    const shopStickers = document.createElement('div');
    shopStickers.classList.add('quantity');
    shopStickers.textContent = arr[2];
    printBlock.appendChild(shopStickers);
  });
  const summ = document.createElement('div');
  summ.classList.add('title');
  summ.textContent = `ИТОГО`;
  printBlock.appendChild(summ);
  const summCards = document.createElement('div');
  summCards.classList.add('title');
  summCards.textContent = cardSum;
  printBlock.appendChild(summCards);
  const summStickers = document.createElement('div');
  summStickers.classList.add('title');
  summStickers.textContent = stickerSum;
  printBlock.appendChild(summStickers);
}

const checkShopName = (name) => {
  const namePart = name.match(/_.+/g);
  shops.forEach((elem, i) => {
    if (elem.includes(namePart)) name = shops[i];
  });
  return name;
}

const checkData = (row) => {
  const card = row[8] || 0, sticker = row[9] || 0;
  if (+card > 0 || +sticker > 0) {
    cardSum += +card;
    stickerSum += +sticker;
    return list.push(`${checkShopName(row[1])};${card};${sticker}`);
  }
}

const whatDayIsItToday = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;
  return `${day}.${month}.${year}`;
}

const updateInfo = () => {
  localStorage.setItem(`fullDate`, JSON.stringify(whatDayIsItToday()));
  return whatDayIsItToday();
}

const getLastInfo = () => {
  const last = JSON.parse(localStorage.getItem('fullDate'));
  return last;
}

const outputInfo = (correctDate) => {
  document.querySelector('.last-info').textContent = `Последняя загрузка актуальных названий салонов производилась ${correctDate}.`
}

outputInfo(getLastInfo());

document.getElementById('shops').onchange = function () {
  let file = this.files[0];
  let reader = new FileReader();
  reader.onload = function (progressEvent) {
    let salons = this.result.split('\n');
    salons.forEach(salon => {
      salon = salon.split(';');
      if (salon[0].includes('_')) shops.push(salon[0]);
    });
    localStorage.setItem(`lastShopsInfo`, JSON.stringify(shops));
    // const update = updateInfo();
    outputInfo(updateInfo());
  }
  reader.readAsText(file, 'windows-1251');
}

document.getElementById('list').onchange = function () {
  let file = this.files[0];
  let reader = new FileReader();
  reader.onload = function (progressEvent) {
    let rows = this.result.split('\n');
    Array.from(rows).forEach((row) => {
      row = Array.from(row.split(';'));
      const str = checkData(row);
    });
    createPreview();
  }
  reader.readAsText(file, 'windows-1251');
}

document.querySelector('#download').onclick = function () {
  if (document.querySelector('#list').value !== '') {
    let csv = `Салон;Визитки;Наклейки\n`;
    list.sort();
    list.forEach(el => {
      csv += el;
      csv += `\n`;
    });
    csv += `ИТОГО:;${cardSum};${stickerSum}`;
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI("\uFEFF" + csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Отгрузка визиток и наклеек.csv';
    hiddenElement.click();
  }
}

