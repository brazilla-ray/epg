import Glyph from "Glyph";
// const Glyph = require("./_data/Glyph");

const displayArea = document.getElementById("glyph-container");

const btnAddL = document.getElementById("addL");
const btnAddR = document.getElementById("addR");

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
    // add with "J" key
    window.addEventListener("keydown", (event) => {
      if (event.code == "KeyJ") {
        displayArea.insertAdjacentHTML("afterbegin", glyph.left);
      }
    });

    // right button
    btnAddR.addEventListener("click", () => {
      //add svg, i.e., html, to '#output'
      displayArea.insertAdjacentHTML("afterbegin", glyph.right);
    });
    // add with "K" key
    window.addEventListener("keydown", (event) => {
      if (event.code == "KeyK") {
        displayArea.insertAdjacentHTML("afterbegin", glyph.right);
      }
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

  window.addEventListener("keydown", (event) => {
    console.log(`pressed: ${event.key}: code: ${event.code}`);
  });

  glyphButtons();
  colorButtons();
}

window.addEventListener("load", () => {
  init();
});
