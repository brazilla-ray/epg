const Glyph = require("./_data/Glyph");

const displayArea = document.getElementById("glyph-container");

const btnAddL = document.getElementById("addL");
const btnAddR = document.getElementById("addR");

// glyph definitions
const glyphL =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 62" class="glyph">< g data-name="Glyph L"><line x1="4" y1="4" x2="58" y2="58" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/><line x1="4" y1="40" x2="22" y2="58" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/><line x1="40" y1="4" x2="59" y2="22" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/></g ></svg >';

const glyphR =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 62" class="glyph"><g data-name="Glyph R"><line x1="59" y1="4" x2="5" y2="58" fill="#d71920" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/><line x1="59" y1="40" x2="41" y2="58" fill="#d71920" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/><line x1="23" y1="4" x2="4" y2="22" fill="#d71920" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/></g></svg>';

const glyphs = document.getElementsByClassName("glyph");

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function init() {
  const setColor = {
    addColorClass(glyph, color) {
      glyph.classList.add(`${color}-glyph`);
    },
    removeColorClass(glyph) {
      let colorRegEx = /^\w*-glyph/gm;
      let iterator = glyph.classList.values();
      for (let value of iterator) {
        glyph.classList.remove(value.match(colorRegEx));
      }
    },
  };

  let selectedGlyph = "";
  let selectedColor = "";
  let observer = new MutationObserver(function () {
    glyphListener();
  });

  observer.observe(displayArea, {
    subtree: true,
    childList: true,
  });

  function glyphButtons() {
    const glyph = new Glyph();
    // left button
    btnAddL.addEventListener("click", () => {
      //add svg, i.e., html, to '#output'
      displayArea.insertAdjacentHTML("afterbegin", glyph.left);
    });

    // right button
    btnAddR.addEventListener("click", () => {
      //add svg, i.e., html, to '#output'
      displayArea.insertAdjacentHTML("afterbegin", glyph.right);
    });
  }

  function colorButtons() {
    for (let color of colors) {
      let colorBtn = document.getElementById(`${color}Btn`);
      colorBtn.addEventListener("click", () => {
        selectedColor = color;
        setColor.removeColorClass(selectedGlyph);
        setColor.addColorClass(selectedGlyph, selectedColor);
      });
    }
  }

  function glyphListener() {
    for (let glyph of glyphs) {
      glyph.addEventListener("click", () => {
        clearSelection();
        setColor.removeColorClass(glyph);
        glyph.classList.add("glyph-selected");
        selectedGlyph = glyph;
      });
    }
    function clearSelection() {
      for (let glyph of glyphs) {
        glyph.classList.remove("glyph-selected");
        selectedGlyph = "";
      }
    }
  }

  glyphButtons();
  colorButtons();
}

window.addEventListener("load", () => {
  init();
});
