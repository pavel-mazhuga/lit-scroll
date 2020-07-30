# LitScroll

## A lightweight (1.4kb gzipped) custom scroll implementation. Written in TypeScript.

## Installation

Install it from NPM:
`npm i lit-scroll`

## Browser Support

The library uses a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) (conditionally) to listen to scrollable element size change. In order to support dynamic scrollable container size change in Safari and IE, you should use [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) [polyfill](https://github.com/que-etc/resize-observer-polyfill).

**IMPORTANT:** The library's default compilation target is ES6. If you need to support ES5 environments - consider transpiling it.

## Usage

In your HTML:

```html
<body>
    <div data-lit-scroll="wrapper">
        <div data-lit-scroll="container">
            <!-- Layout here -->
        </div>
    </div>
</body>
```

Note: wrapper element must be a descendant of `<body>`.

In your JS:

```javascript
import createLitScroll from 'lit-scroll';

const scroll = createLitScroll();
```

## Scroll sections

If your page is quite long, you can split your scroll container into scroll sections (via [data-lit-scroll="section"] attribute) to improve scrolling performance. This technique requires [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) [support](https://caniuse.com/#search=IntersectionObserver). If none will be detected - [data-lit-scroll="section"] attribute will simply have no effect, nothing will break.

Syntax:

```html
<body>
    <div data-lit-scroll="wrapper">
        <div data-lit-scroll="container">
            <div data-lit-scroll="section">
                <!-- Section content goes here -->
            </div>
            <div data-lit-scroll="section">
                <!-- Section content goes here -->
            </div>
            <!-- ...and so on -->
        </div>
    </div>
</body>
```

## Options

| Option | Default | Description                                                                                |
| ------ | ------- | ------------------------------------------------------------------------------------------ |
| ease   | 0.1     | Number. Configures linear interpolation "strength".                                        |
| mobile | true    | Boolean. Indicates whether or not library should take over native scroll on mobile devices |

## API

### Methods

| Method              | Parameters                      | Description                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on                  | (event: 'scroll', fn: Function) | Add a scroll listener, which executes a specified function on every scroll change. Callback parameters: docScrollValue (current browser scroll value), scrollValue (current interpolated value), maxHeight (max scroll height), speed (positive if scrolling down, negative otherwise). |
| off                 | (event: 'scroll', fn: Function) | Remove a scroll listener                                                                                                                                                                                                                                                                |
| scrollTo            | (target: (string                | number                                                                                                                                                                                                                                                                                  | Element) | Scroll to element | Element, opts: { native?: boolean }) | Scroll to an element (via selector, document top offset, or element reference) |
| getCurrentValue     | none                            | Get current document scroll value                                                                                                                                                                                                                                                       |
| getCurrentLerpValue | none                            | Get current lerp scroll value                                                                                                                                                                                                                                                           |
| getSpeed            | none                            | Get current speed value                                                                                                                                                                                                                                                                 |
| disable             | none                            | Disable scrolling                                                                                                                                                                                                                                                                       |
| enable              | none                            | Enable scrolling                                                                                                                                                                                                                                                                        |
| isEnabled           | none                            | Get scroll lock state. Returns boolean value. scrolling                                                                                                                                                                                                                                 |
| destroy             | none                            | Destroy an instance                                                                                                                                                                                                                                                                     |
