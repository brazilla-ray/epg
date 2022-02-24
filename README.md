Imagine you have a dog. You'd like the dog to raise their paw and touch your hand whenever you say "shake". You'll have to teach the dog this behavior, but with enough patience (and treats!), eventually the dog will learn. You have now taught your dog (the target) to listen for a command (the event) and raise its paw (the action).

That's essentially what an event listener in Javascript is. Instead of all that training though, we just have to use `addEventListener()`. This little bit of ~~magic~~ code lets us add all sorts of interactivity to web pages.

I wanted to practice using event handlers, so I built a little app that adds SVG glyphs to the screen. Once added, the color of the glyphs can be changed by selecting one and clicking on a button. Not particularly useful, maybe, but kind of fun.

Here's how I did it (after much revision).

| ![glyph consisting of three diagonal lines tilting to the right](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5lpq3iwizvucbw3dvcw6.png) |     | ![glyph consisting of three diagonal lines tilting to the left](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uwnxge5dkasfg395ytr3.png) |
| :-------------------------------------------------------------------------------------------------------------------------------------------------: | --- | :------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                       glyphR                                                                        |     |                                                                       glyphL                                                                       |

## the HTML 
The HTML is pretty straightforward, so I'll just run through it quickly. CSS is important to the way the app works, but it's not the main focus of this post, so I'm going to skip over most of it. You can find it on the project's [github](https://github.com/w0whitaker/epg/blob/main/_site/style.css) page.
### display area
The first thing we need is a place to display the glyphs once they get added.
```html
<section id="output">
  <div id="glyph-container"></div>
</section>
```
This is just an empty div for now, but once we add glyphs, it will get filled with `<svg>` elements.
```html
<div id="glyph-container">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 62" class="glyph">...</svg>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 62" class="glyph">...</svg>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 62" class="glyph">...</svg>
  <!-- etc. -->
</div>
```
Because I wanted the display area to be present visually with or without any glyphs, I gave it a fixed size and some other styling in the CSS.
```css
#output {
  width: 400px;
  min-height: 425px;
  padding: 20px;
  background-color: #0f0f0f;
  border-radius: 5%;
  margin: 10px auto;
}
```
### buttons
Next up are some buttons to add glyphs and eventually change their color.
#### for adding glyphs
```html
<div id="add-buttons">
  <button id="addL">
    <svg>...</svg>
  </button>
  <button id="addR">
    <svg>...</svg>
</div>
<div id="color-pickers">
  <button id="redBtn"></button>
  <button id="orangeBtn"></button>
  <button id="yellowBtn"></button>
  <!-- etc. --> 
</div>
```
Nothing too special here, except that I use IDs so that I'll be able to reference the buttons easily in the Javascript. Note that for the "add" buttons, I'm using an SVG of the relevant glyph as the content of the button. While that will indicate visually what the button does, it won't do much for people using screen readers. In practice, there should be something to describe what the button does that a screen reader will pick up.[^1]

[^1]: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#accessibility_concerns) has a bit about buttons and accessibility, and there's a good [article](https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/#basic-alternative-descriptions-using-the-svg-tag) by [Carrie Fisher](https://cariefisher.com/) on [Smashing Magazine](https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/) that goes over some options for making SVGs more accessible.

## the Javascript

### definitions
To start with, I'm going to define a few things by declaring some variables. These use `const` because I don't want the values to change.
```javascript
const btnAddL = document.getElementById("addL");
const btnAddR = document.getElementById("addR");

const displayArea = document.getElementById("glyph-container");

const glyphs = document.getElementsByClassName("glyph");

// glyph definitions
const glyphL =
  '<svg class="glyph">...</svg>';

const glyphR =
  '<svg class="glyph">...</svg>';

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
```
I use `document.getElementById()` to reference the "add" buttons and the `<div>` that will act as the display area for the glyphs. Because there will be more than one glyph on the screen, I can't use an ID, so I'm using `document.getElementsByClassName()`. This is going to have some implications later on.

Next, I declare a couple of variables for the glyphs themselves, which will be the (long, messy) SVG code.

Finally, I create an array that will hold the colors that will be used. You may have noticed that I didn't declare variables for the color buttons; I'll be doing that later and using the colors in this array to name them.

### the `init` function
Most of the code for the app's behavior will be wrapped in a function, which can then be called once the page has loaded.
```javascript
function init() {
  // app functionality will go in here
}

window.addEventListener('load', () => {
  init();
});
```
It would also be possible to add this event listener to the `document` object, and listen for the `'DOMContentLoaded'` event, which fires as soon as the HTML is loaded. The `'load'` event, on the other hand, waits until _all_ of the page's resources have loaded. Given that this is a pretty minimal app, perhaps it doesn't make much difference which one is used. I've opted to use the `'load'` event, figuring that if for some reason the CSS were delayed, for example, it wouldn't make much sense for the user to start clicking things.
### event listeners on buttons
There are two sets of buttons that will need event listeners, those that add glyphs to the screen and those that pick a color.
#### for adding glyphs
Adding the glyphs to begin with is pretty straightforward. Earlier, I declared variables which create a reference to the appropriate button. Each of the two "add" buttons gets an event listener, which is set up to respond to a `'click'` event. Every time one of those two buttons is clicked, a function that adds a glyph to the `displayArea` using `insertAdjacentHTML()` will run.
```javascript
function glyphButtons() {
  // left button
  btnAddL.addEventListener('click', () => {
    //add svg, i.e., html, to '#output'
    displayArea.insertAdjacentHTML('afterbegin', glyphL);
  });

  // right button
  btnAddR.addEventListener('click', () => {
    //add svg, i.e., html, to '#output'
    displayArea.insertAdjacentHTML('afterbegin', glyphR);
  });
}
```
The first argument [`insertAdjacentHTML()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML) takes tells it where to put the HTML in relation to the element specified; in this case, it will be placed just after the opening `<div>` tag of the `displayArea`.
#### for changing colors
Setting up event listeners on the buttons that pick the colors is going to follow the same pattern as with the "add" buttons.
```javascript
function colorButtons() {
  for (let color of colors) {
    let colorBtn = document.getElementById(`${color}Btn`);
    colorBtn.addEventListener('click', () => {
      // we'll come back to this...
    });
  }
}
```
There are a couple of important differences, however. Each of the color buttons will reuse the event listener code, with only the name of the color changing. So rather than repeat that code over and over, I'm looping over the `colors` array from earlier and taking advantage of string interpolation to insert each value into the argument for `getElementById()`.

The actual code for the event listener is going to be a little more complicated than it was for the "add" buttons, so I'm going to pause here and take a look at what the Javascript looks like at this point.
#### our code so far
```javascript
const btnAddL = document.getElementById("addL");
const btnAddR = document.getElementById("addR");

const displayArea = document.getElementById("glyph-container");

const glyphs = document.getElementsByClassName("glyph");

// glyph definitions
const glyphL =
  '<svg class="glyph">...</svg>';

const glyphR =
  '<svg class="glyph">...</svg>';

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function init() {
  function glyphButtons() {
    // left button
    btnAddL.addEventListener('click', () => {
      //add svg, i.e., html, to '#output'
      displayArea.insertAdjacentHTML('afterbegin', glyphL);
    });

    // right button
    btnAddR.addEventListener('click', () => {
      //add svg, i.e., html, to '#output'
      displayArea.insertAdjacentHTML('afterbegin', glyphR);
    });
  }

  function colorButtons() {
    for (let color of colors) {
      let colorBtn = document.getElementById(`${color}Btn`);
      colorBtn.addEventListener('click', () => {
        // we'll come back to this...
      });
    }
  }

  // don't forget to call the functions!
  glyphButtons();
  colorButtons();
}

window.addEventListener('load', (event) => {
  init();
});
```
Inside the `init()` function are two other functions, `glyphButtons()` and `colorButtons()`, both of which get called at the end of `init()`.
### event listeners on glyphs
Before the color of the glyphs can be changed, a single glyph will need to be selected. For now, I'm going to declare an empty variable that will "hold" the selected glyph. I'll put it at the top of the `init()` function, so that it can be accessed from the other functions within `init()`. Note that I'm using `let` so that it's value can be changed as needed.
```javascript
  let selectedGlyph = "";
```
When the page loads, there won't be any glyphs to select. Adding the actual event listener can go in a function easily enough, but there needs to be a way to call that function whenever a glyph is added. It turns out that Javascript has something called a Mutation Observer that can "watch" part of the page and do something when it changes. 
#### mutation observer
```javascript
let observer = new MutationObserver(function () {
  glyphListener();
});

observer.observe(displayArea, {
  subtree: true,
  childList: true
});
```
First, a new `MutationObserver()` is declared with the variable `observer`, which then uses the method `observe` to point the observer to the `displayArea`. The options `subtree` and `childList` tell the observer to watch for changes to the all the child nodes of `displayArea`. 
#### adding the listener
With the `MutationObserver` in place, an event listener can now be attached to each glyph as it gets added. Earlier I mentioned that IDs couldn't be used for the glyphs, because there would be more than one. Instead, they will each get a class of `.glyph`, which can then be collected with `getElementsByClassName()`. Because this will return multiple elements, a loop is needed. As each glyph is iterated over, it gets an event listener, which is again set up for a `'click'` event.
```javascript
function glyphListener() {
  for (let glyph of glyphs) {
    glyph.addEventListener('click', () => {
      glyph.classList.add("glyph-selected");
      selectedGlyph = glyph;
    });
  }
}
```
This time, the event listener is going to add a class of `.glyph-selected` to the glyph that has been clicked on. This will style the glyph, turning it from light gray to cyan, visually indicating that it has been selected. The variable `selectedGlyph` is now assigned the value of the glyph that has been clicked on.
##### clearing previous selection
This is looking promising, but there is a problem. As it is now, it's possible to select multiple glyphs, or, more precisely, to style multiple glyphs with `.glyph-selected`. Every time a glyph is clicked, the previous selection needs to be cleared, which can be accomplished with a function that gets called before adding `.glyph-selected`. For good measure, this `clearSelection()` function will also reassign `selectedGlyph` to be empty.
```javascript
function glyphListener() {
  for (let glyph of glyphs) {
    glyph.addEventListener('click', () => {
      clearSelection();
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
```
### changing glyph colors
In the same way that `selectedGlyph` was initialized as an empty variable so that it could be reassigned as needed, a variable called `selectedColor` will be declared that can "hold" the color the user selects.
```javascript
let selectedColor = "";
```
Now the event listener for the color buttons can take shape. First, the color of the button clicked is assigned to `selectedColor`.

```javascript
function colorButtons() {
  for (let color of colors) {
    let colorBtn = document.getElementById(`${color}Btn`);
    colorBtn.addEventListener('click', () => {
      selectedColor = color;
    });
  }
}
```
In order to assign that color to the selected glyph, a class will get added to the glyph that styles it with CSS. I chose to make the function that does that a method on an object that resides outside of the `init()` function. Putting this object outside `init()` means its methods will be readily available regardless of where the function calling them resides.
```javascript
const setColor = {
  addColorClass(glyph, color) {
    glyph.classList.add(`${color}Glyph`);
  },
};
```
The method `addColorClass()` gets passed the value of `selectedGlyph` and `selectedColor`.
```javascript
function colorButtons() {
  for (let color of colors) {
    let colorBtn = document.getElementById(`${color}Btn`);
    colorBtn.addEventListener("click", function () {
      selectedColor = color;
      setColor.addColorClass(selectedGlyph, selectedColor);
    });
  }
}
```
If the code was left in this state, each time a color button was clicked, a new color class would be added to the glyph. Just as the styling provided by `.glyph-selected` needed to be removed from one glyph before it could be added to another, the color class needs to be removed
```javascript
removeColorClass(glyph) {
  let colorRegEx = /(?!Glyph)[a-z]*Glyph/gm;
  let iterator = glyph.classList.values();
  for (let value of iterator) {
    glyph.classList.remove(value.match(colorRegEx));
  }
},
```
```javascript
setColor.removeColorClass(selectedGlyph);
```

