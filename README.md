Imagine you have a dog. You'd like the dog to raise their paw and touch your hand whenever you say "shake". You'll have to teach the dog this behavior, but with enough patience (and treats!), eventually the dog will learn. You have now taught your dog (the target) to listen for a command (the event) and raise its paw (the action).

That's essentially what an event handler in Javascript is. Instead of all that training though, we just have to use `addEventListener`. This little bit of ~~magic~~ code lets us add all sorts of interactivity to web pages.

I wanted to practice using event handlers, so I built a little app that adds SVG glyphs to the screen. Once added, the color of the glyphs can be changed by selecting one and clicking on a button. Not particularly useful, maybe, but kind of fun.

| ![glyph consisting of three diagonal lines tilting to the right](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5lpq3iwizvucbw3dvcw6.png) |     | ![glyph consisting of three diagonal lines tilting to the left](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uwnxge5dkasfg395ytr3.png) |
| :-------------------------------------------------------------------------------------------------------------------------------------------------: | --- | :------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                       glyphR                                                                        |     |                                                                       glyphL                                                                       |

First off, let's create a space for displaying the glyphs.

```html
<section id="output">
  <div id="glyph-container"></div>
</section>
```

It's an empty `<div>` for now, but shortly we'll be using `insertAdjacentHTML` to fill it with `<svg>` elements.

Now we need a way to add the glyphs. Let's add a couple of buttons, giving them unique IDs so that we can easily reference them in the Javascript.

```html
<section id="controls">
  <div id="add-buttons">
    <button id="addL">
      <svg>...</svg>
    </button>
    <button id="addR">
      <svg>...</svg>
    </button>
  </div>
</section>
```

I've truncated the `<svg>` definition here for the sake of clarity.

Now let's use `addEventListener` to make those buttons do something.

```javascript
const btnAddL = document.getElementById("addL");
const btnAddR = document.getElementById("addR");

const displayArea = document.getElementById("glyph-container");

// glyph definitions
const glyphL = "<svg> ... </svg>";

const glyphR = "<svg> ... </svg>";

// left button
btnAddL.addEventListener("click", function () {
  //add svg, i.e., html, to '#output'
  displayArea.insertAdjacentHTML("afterbegin", glyphL);
});

// right button
btnAddR.addEventListener("click", function () {
  //add svg, i.e., html, to '#output'
  displayArea.insertAdjacentHTML("afterbegin", glyphR);
});
```

Let's walk through what's going on here. First, we specify what the target is going to be (our dog). We'll use `getElementById` to find the appropriate button and store that in a variable. Then we use `addEventListener` to tell target (our dog) what to listen for. In this case, we're going to be listening for a 'click' event. There are lots of different events that can be listened for, but 'click' is pretty common. Next comes the action, or the 'shake'. This will take the form of a function.

Inside this function, we're going to use `insertAdjacentHTML` to add the `<svg>` element that defines our glyph. Much like `addEventListener`, `insertAdjacentHTML` needs a target. In this case it's the empty `<div>` we created in the HTML, again stored in a variable. Then we need to specify where to put the HTML we're inserting, and we'll just put it right after the opening `<svg>` tag by specifying `"afterbegin"` as the first argument. There are other options that could be used here, check out [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML#parameters) for all of them. Last but not least, we'll specify what HTML we're adding, and here it's our `<svg>` stored in a variable.

Now when the user clicks one of the two buttons, a glyph will get added to the display area. Because we used `"afterbegin"` as our parameter for `insertAdjacentHTML`, the glyphs get added just after the opening `<div>`, and the viewing area gets filled from the top left.

Clicking repeatedly on the buttons will eventually fill the display area with glyphs, creating patterns that change as more are added. Kind of neat, but let's see if we can make it a little more colorful.

To add color, we need to do a couple of things. We'll need to be able to specify which glyph we want to add color to, which means we'll be adding an event listener to each one. Then we need to tell the browser what color we want the selected glyph to be.

Adding an event listener to the displayed glyphs will be similar to the buttons that add them, we'll again be using `addEventListener`.

```javascript
// set listener on glyph
const glyph = document.getElementsByClassName("glyph");

glyph.addEventListener("click", function () {
  glyph.classList.add("glyph-selected");
});
```

To identify the selected glyph, we're going to add a class of `"glyph-selected"`, which, according to our CSS, should change the color of the glyph. But click on a glyph...and nothing happens. What's more, there's an error in the console telling us that `glyph.addEventListener` isn't a function.

We've set up our event listener using the same pattern we used with the buttons, so why isn't it working? There are a couple of things going on. For one thing, we've assigned event listeners to elements that _don't exist_ when the page loads. They won't be there until we add them using the buttons. The other thing is that `getElementsByClassName` is plural, where `getElementById` is singular. In fact, looking at [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName), we see that `getElementsByClassName` returns "an array-like object". We're going to be dealing with more than element, so we're going to need to set up a loop.

Because the app will allow the user to add as many or as few glyphs as they like, we need to be able to iterate over an unknown number of elements. *For*tunately, that's not too hard.

```javascript
const glyphs = document.getElementsByClassName("glyph"); //note that this is now plural

for (let glyph of glyphs) {
  glyph.addEventListener("click", function () {
    glyph.classList.add("glyph-selected");
  });
}
```

No errors! But...it's still not doing anything. The `for...` loop is going to execute _once_ when the page loads. As noted above, there aren't any elements with a class of `"glyph"` because we haven't added any. By the time we've added some, it's too late, because the `for...` loop already ran. So we need to figure out a way to get that loop to run whenever a glyph is added.

Before we do anything else, let's put our click event in a function, so it's a little easier to work with.

```javascript
// set listener on glyph
const glyphs = document.getElementsByClassName("glyph");

function setListener(elem) {
  elem.addEventListener("click", function () {
    elem.classList.add("glyph-selected");
  });
}

for (let glyph of glyphs) {
  setListener(glyph);
}
```

Looks promising. The loop is still only running when the page loads though, when there aren't any glyphs to call the function on. So we need to trigger it whenever a new glyph is added. It turns out that there is something called a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) that can watch the DOM for changes. So we can set that up to watch our `<div>` that holds the SVGs. Here's what that looks like:

```javascript
// set listener on glyph
const glyphs = document.getElementsByClassName("glyph");

function setListener() {
  // note that the for... loop is now inside the setListener function
  for (let glyph of glyphs) {
    glyph.addEventListener("click", function () {
      glyph.classList.add("glyph-selected");
    });
  }
}

var observer = new MutationObserver(function () {
  setListener();
});

observer.observe(displayArea, {
  subtree: true,
  childList: true,
});
```

It works! Now, when we click on a glyph, it gets the class "glyph-selected". There's a problem though. _Every_ glyph we click will get selected. We only want one at a time. Easy enough to fix, though. We just have to clear the class we added, so we can loop through the glyphs again, and this time, we'll _remove_ the class `glyph-selected`.

```javascript
function setListener() {
  for (let glyph of glyphs) {
    glyph.addEventListener("click", function () {
      clearSelection();
      glyph.classList.add("glyph-selected");
    });
  }
  function clearSelection() {
    for (let glyph of glyphs) {
      glyph.classList.remove("glyph-selected");
    }
  }
}
```

Cool! Now we can select a glyph. Next up, we're going to change its color.

To do that, we'll need to add a few more buttons to our HTML.
```html
<div id="color-pickers">
  <!-- note that for accessibility, a <button> should have some kind of label identifying it for screen readers, but I've left that out here for clarity -->
  <button id="redBtn" class="picker"></button>
  <button id="orangeBtn" class="picker "></button>
  <button id="yellowBtn" class="picker"></button>
  <button id="greenBtn" class="picker"></button>
  <button id="blueBtn" class="picker"></button>
  <button id="indigoBtn" class="picker"></button>
  <button id="violetBtn" class="picker"></button>
</div>
```
Much like the buttons we put in for adding glyphs, these have a unique ID so that we can reference them easily.

To make these functional, we'll have to add event listeners to each one. We can again use `addEventListener`, and follow the same pattern that we used before — use the ID of each button as the target, tell it to listen for a "click" event, then tell it to add a class that changes its color with CSS. 

There are seven colors though. Will we have to write out code for each color, needlessly repeating ourelselves? Thankfully not! It will take a bit of doing though.

Let's start out by creating an array of the colors we're going to use. I kept this simple, and used named colors.

```javascript
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
```

A `for...` loop will help us out here, allowing us to define the event listener once, substituting the color name each time. To do this, we'll make use of [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), which allow us to substitute text.

```javascript
function setColor() {
  for (let color of colors) {
    let colorBtn = document.getElementById(`${color}Btn`);
    colorBtn.addEventListener("click", function () {
      selectedElem.classList.add(`${color}Glyph`);
    });
  }
}
```

We haven't declared `selectedElem` anywhere, so if we were to run this, we get an error when we click on one of the color buttons. The element that `selectedElem` is refers to is the glyph that's been clicked on, so let's declare it in our `setListener()` function.
```javascript
function setListener() {
  let selectedElem = ""; // empty variable using 'let' so its value can change
  for (let glyph of glyphs) {
    glyph.addEventListener("click", function () {
      clearSelection();
      selectedElem = glyph; // not empty anymore!
      glyph.classList.add("glyph-selected");
      setColor();
    });
  }
  function clearSelection() {
    for (let glyph of glyphs) {
      glyph.classList.remove("glyph-selected");
    }
  }
  function setColor() {
    for (let color of colors) {
      let colorBtn = document.getElementById(`${color}Btn`);
      colorBtn.addEventListener("click", function () {
        selectedElem.classList.add(`${color}Glyph`);
      });
    }
  }
}
```

This lets us change the color of the glyph, but something strange is happening. If we select a glyph, then change its color to red, then orange (or any color after red in the array), we can't go back. That's because we're iterating over the list of colors in one direction. If you open up the inspector in your browser, you'll notice something else. Every time a color button gets clicked, the corresponding class gets added to the glyph and you end up with a long sequence of conflicting classes. So let's clean up those classes every time we click on a color button.
```javascript
function setListener() {
  let selectedElem = ""; // empty variable using 'let' so its value can change
  for (let glyph of glyphs) {
    glyph.addEventListener("click", function () {
      clearSelection();
      selectedElem = glyph; // not empty anymore!
      glyph.classList.add("glyph-selected");
      setColor();
    });
  }
  function clearSelection() {
    for (let glyph of glyphs) {
      glyph.classList.remove("glyph-selected");
    }
  }
  function setColor() {
    for (let color of colors) {
      let colorBtn = document.getElementById(`${color}Btn`);
      colorBtn.addEventListener("click", function () {
        unsetColor();
        selectedElem.classList.add(`${color}Glyph`);
      });
    }
  }
  function unsetColor() {
    let colorRegEx = /(?!Glyph)[a-z]*Glyph/gm;
    let iterator = selectedElem.classList.values();
    for (let value of iterator) {
      selectedElem.classList.remove(value.match(colorRegEx));
    }
  }
}
```