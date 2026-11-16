let myTable;
let larghezza;
let altezza;
let margine = 18;
let inizioGriglia = 176;
let colonne = 9;
let passoX;
let passoY;
let diametroPiccolo;
let diametroMedio;
let diametroGrande;
let diametroMassimo;
let cliccato = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  myTable = await loadTable("assets/rivers_cerchi.csv", ",", "header");
  larghezza = windowWidth;
  altezza = windowHeight;

  if (larghezza < 360){
    margine = 12;
   }
  if (larghezza < 780){
    inizioGriglia = 250;
  }
  let altezzaGriglia = altezza - inizioGriglia - 6
  if (larghezza < altezzaGriglia * 0.67) {
    colonne = 6;
  } else if (larghezza < altezzaGriglia) {
    colonne = 8;
  } else if (larghezza > altezzaGriglia * 1.5){
    colonne = 12;
    }

  let righe = 0;
  for (let numRiga = 0; numRiga < myTable.getRowCount(); numRiga = numRiga + colonne) {
    righe = righe + 1;
   }
  passoX = (larghezza - 4) / colonne;
  passoY = altezzaGriglia / righe

  diametroMassimo = passoX;
  if (passoY < passoX) {
    diametroMassimo = passoY;
  }
  diametroMassimo = diametroMassimo - 2
  if (diametroMassimo > 110){
    diametroMassimo = 110;
  }
  diametroPiccolo = diametroMassimo * 0.62;
  diametroMedio = diametroMassimo * 0.74;
  diametroGrande = diametroMassimo * 0.86;
  }

function draw() {
  background(181, 197, 150)
  noStroke();

  disegnaLegende();

  let x = 2 + passoX / 2;
  let y = inizioGriglia + passoY / 2
  let fiumeAttivo = -1

  for (let riga = 0; riga < myTable.getRowCount(); riga++){
    let lunghezza = myTable.getNum(riga, "length");
    let portata = myTable.getNum(riga, "discharge");

    let diametro = diametroPiccolo;
    if (lunghezza >= 3000){
      diametro = diametroMassimo;
    } else if (lunghezza >= 2000){
      diametro = diametroGrande;
    } else if (lunghezza >= 1000) {
      diametro = diametroMedio;
      }

    colorePortata(portata)
    circle(x, y, diametro);

    let nome = myTable.getString(riga, "nome_riga_1");
    let offset = myTable.getNum(riga, "offset_1");
    let secondaRiga = myTable.getString(riga, "nome_riga_2")
    let offsetSecondaRiga = myTable.getNum(riga, "offset_2")
    let spazio = diametro - 4;
    if (diametro === diametroPiccolo) {
      spazio = diametro - 1;
      }
    if (offset * 2 < spazio && offsetSecondaRiga * 2 < spazio) {
      if (portata >= 12000) {
        fill(243, 249, 252);
      } else {
        fill(16, 35, 49);
      }
      if (secondaRiga === ""){
        text(nome, x - offset, y + 4)
      } else {
        text(nome, x - offset, y - 3);
        text(secondaRiga, x - offsetSecondaRiga, y + 11)
      }
      }

    let dx = mouseX - x;
    let dy = mouseY - y;
    let raggio = diametro / 2;
    if (dx * dx + dy * dy < raggio * raggio) {
      fiumeAttivo = riga;
    }

    if ((riga + 1) % colonne === 0) {
      x = 2 + passoX / 2;
      y = y + passoY;
    } else {
      x = x + passoX;
    }
    }

  if (fiumeAttivo >= 0) {
    if (cliccato) {
      let id = myTable.getString(fiumeAttivo, "id");
      window.location.href = "detail.html?fiume=" + id;
    }
    let paesi = myTable.getString(fiumeAttivo, "paesi_popup");
    let larghezzaPopup = myTable.getNum(fiumeAttivo, "larghezza_popup");
    let altezzaPopup = myTable.getNum(fiumeAttivo, "altezza_popup") - 16;
    x = mouseX + 12;
    y = mouseY + 12;
    if (x + larghezzaPopup > larghezza - 10){
      x = mouseX - larghezzaPopup - 12;
    }
    if (x < 10) {
      x = 10;
    }
    if (y + altezzaPopup > altezza - 10) {
      y = mouseY - altezzaPopup - 12;
    }
    fill(31, 57, 43)
    rect(x, y, larghezzaPopup, altezzaPopup)
    fill(243, 249, 236);
    text(paesi, x + 12, y + 19);
  }
  cliccato = false;
  }

function mousePressed() {
  cliccato = true;
}

  function colorePortata(portata){
  if (portata < 1000) {
    fill(213, 231, 240);
   } else if (portata < 5000) {
    fill(157, 197, 222);
   } else if (portata < 12000) {
    fill(103, 156, 194);
  } else {
    fill(49, 96, 138);
  }
  }

  function disegnaLegende() {
  let larghezzaLegenda = larghezza - margine * 2;
  let x = margine;
  let yCerchi = 201;
  let yValori = inizioGriglia - 25;

  fill(31, 57, 43);
  text("FIUMI A CONFRONTO", margine, 24);
  text("LUNGHEZZA (km)", margine, 46)
  if (larghezza >= 780){
    larghezzaLegenda = (larghezzaLegenda - 24) / 2;
    x = larghezza / 2 + 12;
    yCerchi = 115;
    text("PORTATA MEDIA (m³/s)", x, 46);
   } else {
    text("PORTATA MEDIA (m³/s)", x, 180);
  }

  let spazio = (larghezzaLegenda - diametroPiccolo - diametroMedio - diametroGrande - diametroMassimo) / 3;
  if (spazio > 18 && diametroMedio >= 54){
    spazio = 18;
  }
  let x1 = margine + diametroPiccolo / 2;
  let x2 = x1 + (diametroPiccolo + diametroMedio) / 2 + spazio
  let x3 = x2 + (diametroMedio + diametroGrande) / 2 + spazio
  let x4 = x3 + (diametroGrande + diametroMassimo) / 2 + spazio;

  fill(131, 158, 107);
  circle(x1, 83, diametroPiccolo);
  circle(x2, 83, diametroMedio);
  circle(x3, 83, diametroGrande);
  circle(x4, 83, diametroMassimo);
  fill(31, 57, 43);
  text("0–999", x1 - 17.5, 151);
  text("km", x1 - 8, 165);
  text("1 000–1 999", x2 - 34.5, 151);
  text("km", x2 - 8, 165);
  text("2 000–2 999", x3 - 34.5, 151);
  text("km", x3 - 8, 165);
  text("3 000+", x4 - 19, 151);
  text("km", x4 - 8, 165);

  let passo = larghezzaLegenda / 4;
  if (passo > 84) {
    passo = 84;
  }
  let diametroPortata = diametroPiccolo - 2;
  if (diametroPortata > 26){
    diametroPortata = 26;
   }
  x1 = x + passo / 2
  x2 = x1 + passo;
  x3 = x2 + passo;
  x4 = x3 + passo;

  colorePortata(0);
  circle(x1, yCerchi, diametroPortata);
  colorePortata(1000);
  circle(x2, yCerchi, diametroPortata);
  colorePortata(5000);
  circle(x3, yCerchi, diametroPortata)
  colorePortata(12000);
  circle(x4, yCerchi, diametroPortata);
  fill(31, 57, 43);
  text("0–999", x1 - 17.5, yValori);
  text("m³/s", x1 - 11.5, yValori + 14);
  text("1 000–4 999", x2 - 34.5, yValori)
  text("m³/s", x2 - 11.5, yValori + 14);
  text("5 000–11 999", x3 - 38, yValori);
  text("m³/s", x3 - 11.5, yValori + 14);
  text("12 000+", x4 - 22.5, yValori);
  text("m³/s", x4 - 11.5, yValori + 14);

  fill(141, 165, 116);
  rect(margine, inizioGriglia - 8, larghezza - margine * 2, 1)
  }
