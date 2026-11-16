let margine = 16;
let larghezzaTasto = 88
let altezzaTasto = 34;

async function setup(){
  let altezzaCanvas = windowHeight;
  if (altezzaCanvas < 480) {
    altezzaCanvas = 480;
  }
  createCanvas(windowWidth, altezzaCanvas);
  background(181, 197, 150)
  noStroke();
  textAlign(CENTER, CENTER)

  fill(225, 234, 213);
  rect(margine, margine, larghezzaTasto, altezzaTasto);
  fill(31, 57, 43)
  textSize(14);
  text("Indietro", margine + larghezzaTasto / 2, margine + altezzaTasto / 2);

  let dati = await loadTable("assets/rivers_cerchi.csv", ",", "header");
  let parametri = getURLParams();
  let fiume = dati.findRow(parametri.fiume, "id")

  let centro = width / 2;
  if (fiume) {
    let larghezza = width - 60;
    if (larghezza > 692){
      larghezza = 692;
  }

  let sinistra = centro - larghezza / 2
  let yLunghezza = height / 2 - 60;
  let yPortata = yLunghezza + 100;
  let yBacino = yPortata + 100

    textSize(larghezza / 18 + 9);
    text(fiume.get("name"), centro, yLunghezza - 116)
    textSize(14);
    text("Sbocco · " + fiume.get("outflow"), centro, yLunghezza - 72);

    let lunghezza = float(fiume.get("length"));
    let portata = float(fiume.get("discharge"));
    let area = float(fiume.get("area"))
    let quarto = larghezza / 4;
    let quinto = larghezza / 5;

    barra("Lunghezza", fiume.get("lunghezza_testo") + " km", lunghezza, 8000, 4, sinistra, yLunghezza, larghezza);
    text("2.000", sinistra + quarto, yLunghezza + 30);
    text("4.000", sinistra + quarto * 2, yLunghezza + 30)
    text("6.000", sinistra + quarto * 3, yLunghezza + 30);
    text("8.000", sinistra + larghezza, yLunghezza + 30);

    barra("Portata media", fiume.get("portata_testo") + " m³/s", portata, 40000, 4, sinistra, yPortata, larghezza);
    text("10.000", sinistra + quarto, yPortata + 30);
    text("20.000", sinistra + quarto * 2, yPortata + 30)
    text("30.000", sinistra + quarto * 3, yPortata + 30);
    text("40.000", sinistra + larghezza, yPortata + 30);

    barra("Superficie del bacino", fiume.get("bacino_testo") + " km²", area, 2500000, 5, sinistra, yBacino, larghezza);
    text("500.000", sinistra + quinto, yBacino + 30);
    text("1.000.000", sinistra + quinto * 2, yBacino + 30)
    text("1.500.000", sinistra + quinto * 3, yBacino + 30)
    text("2.000.000", sinistra + quinto * 4, yBacino + 30);
    text("2.500.000", sinistra + larghezza, yBacino + 30);
  } else{
    text("Fiume non trovato", centro, height / 2);
}
}

function barra(etichetta, testoValore, valore, massimo, divisioni, x, y, larghezza) {
  fill(31, 57, 43);
  let centro = x + larghezza / 2;
  textSize(13);
  text(etichetta, centro, y - 40);
  textSize(22)
  text(testoValore, centro, y - 17)

  let misura = map(valore, 0, massimo, 0, larghezza);
  fill(225, 234, 213);
  rect(x, y, larghezza, 12);
  fill(49, 102, 69);
  rect(x, y, misura, 12);
  rect(x + misura - 1, y - 2, 2, 16);

  fill(31, 57, 43);
  textSize(11);
  for (let i = 0; i <= divisioni; i++){
    rect(x + larghezza * i / divisioni - 0.5, y + 12, 1, 7);
}
  text("0", x, y + 30);
}

function mousePressed(){
  if (
    mouseX >= margine && mouseX <= margine + larghezzaTasto &&
    mouseY >= margine && mouseY <= margine + altezzaTasto
  ) {
    window.location.href = "index.html"
}
}
