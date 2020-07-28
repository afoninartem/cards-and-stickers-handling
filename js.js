const list = [];
const shops = [];
let cardSum = 0, stickerSum = 0; //perhabs I should set it to onchange function

const checkShopName = (name) => {
  console.log(typeof name, name)
  const namePart = name.match(/(_)\w+/g);
  console.log(namePart)
}

const checkData = (row) => {
  const card = row[8]||0, sticker = row[9]||0;
  if (+card > 0 || +sticker > 0) {
    cardSum += +card;
    stickerSum += +sticker;
    console.log(`${checkShopName(row[1])};${card};${sticker}`);
    return list.push(`${row[1]};${card};${sticker}`);
  }
}

document.getElementById('shops').onchange = function () {
  let file = this.files[0];
  let reader = new FileReader();
  reader.onload = function (progressEvent) {
    let salons = this.result.split('\n');
    salons.forEach(salon => {
      salon = salon.split(';');
      if (salon[0].includes('_')) shops.push(salon[0]);
    });
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
  }
  reader.readAsText(file, 'windows-1251');
}

document.querySelector('#download').onclick = function () {
  let csv = `Салон;Визитки;Наклейки\n`;
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