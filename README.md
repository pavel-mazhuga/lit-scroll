# LitScroll

## A lightweight (1.4kb gzipped) custom scroll implementation. Written in TypeScript.

## Installation

Install it from NPM:
`npm i lit-scroll`

## Browser Support

The library uses a `ResizeObserver` (conditionally) to listen to scrollable element size change. In order to support dynamic scrollable container size change in Safari and IE, you should use `ResizeObserver` polyfill (<https://github.com/que-etc/resize-observer-polyfill>).

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

Note: wrapper element must be a descendant of <body>.

In your JS:

```javascript
import createLitScroll from 'lit-scroll';

const scroll = createLitScroll();
```

## Options

| Option | Default | Description                                                                                |
| ------ | ------- | ------------------------------------------------------------------------------------------ |
| ease   | 0.1     | Number. Configures linear interpolation "strength".                                        |
| mobile | true    | Boolean. Indicates whether or not library should take over native scroll on mobile devices |

## API

### Methods

| Method              | Parameters                      | Description                                                                                                                                                                                                                     |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on                  | (event: 'scroll', fn: Function) | Add a scroll listener, which executes a specified function on every scroll change. Callback parameters: docScrollValue (current browser scroll value), scrollValue (current interpolated value), maxHeight (max scroll height). |
| off                 | (event: 'scroll', fn: Function) | Remove a scroll listener                                                                                                                                                                                                        |
| scrollTo            | (target: (string                | number                                                                                                                                                                                                                          | Element) | Scroll to element | Element, opts: { native?: boolean }) | Scroll to an element (via selector, document top offset, or element reference) |
| getCurrentValue     | none                            | Get current document scroll value                                                                                                                                                                                               |
| getCurrentLerpValue | none                            | Get current lerp scroll value                                                                                                                                                                                                   |
| disable             | none                            | Disable scrolling                                                                                                                                                                                                               |
| enable              | none                            | Enable scrolling                                                                                                                                                                                                                |
| isEnabled           | none                            | Get scroll lock state. Returns boolean value. scrolling                                                                                                                                                                         |
| destroy             | none                            | Destroy an instance                                                                                                                                                                                                             |
