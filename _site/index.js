const displayArea = document.getElementById("glyph-container");

// adding glyphs to display area

// glyph definitions
const glyphL =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 62" class="glyph"><g data-name="Glyph L"><line x1="4" y1="4" x2="58" y2="58" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/><line x1="4" y1="40" x2="22" y2="58" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/><line x1="40" y1="4" x2="59" y2="22" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/></g></svg>';

const glyphR =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 62" class="glyph"><g data-name="Glyph R"><line x1="59" y1="4" x2="5" y2="58" fill="#d71920" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/><line x1="59" y1="40" x2="41" y2="58" fill="#d71920" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/><line x1="23" y1="4" x2="4" y2="22" fill="#d71920" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/></g></svg>';

// glyph controls
const btnAddL = document.getElementById("addL");
const btnAddR = document.getElementById("addR");
const glyphs = document.getElementsByClassName("glyph");

function updateGlyphCount() {
  let glyphObj = Object.keys(glyphs);
  if (glyphObj.length > 6) {
    console.log('over')
  };
  console.log(typeof glyphObj);
}

// left button
btnAddL.addEventListener("click", function () {
  //add svg, i.e., html, to '#output'
  displayArea.insertAdjacentHTML("afterbegin", glyphL);
  updateGlyphCount();
  let activeElem = "";
});

// right button
btnAddR.addEventListener("click", function () {
  //add svg, i.e., html, to '#output'
  displayArea.insertAdjacentHTML("afterbegin", glyphR);
  updateGlyphCount();
  let activeElem = "";
});

// set listener
function setListener(elem) {
  elem.addEventListener("click", function () {
    for (let glyph of glyphs) {
      glyph.classList.remove("glyph-selected");
    }
    removeColorClass(elem);
    elem.classList.add("glyph-selected");
    activeElem = elem;
  });
}

function init() {
  for (let glyph of glyphs) {
    // sets listener on each glyph
    setListener(glyph);
  }
}

var observer = new MutationObserver(function (mutations) {
  init();
});

observer.observe(displayArea, {
  subtree: true,
  childList: true
});

// color pickers
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function removeColorClass(elem) {
  let colorRegEx = /(?!Glyph)[a-z]*Glyph/gm;
  let iterator = elem.classList.values();
  for (let value of iterator) {
    elem.classList.remove(value.match(colorRegEx));
  }
}

for (let color of colors) {
  let colorBtn = document.getElementById(`${color}Btn`);
  colorBtn.addEventListener("click", function () {
    // make this a function?
    removeColorClass(activeElem);
    activeElem.classList.add(`${color}Glyph`);
  });
}
