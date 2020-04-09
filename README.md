# LitScroll

## A lightweight (1kb gzipped) custom scroll implementation. Written in TypeScript.

## Installation

Install it from NPM:
`npm i lit-scroll`

## Browser Support

The library uses a `ResizeObserver` to listen to scrollable element size changing. In order to support Safari and IE, you should use `ResizeObserver` polyfill (<https://github.com/que-etc/resize-observer-polyfill>);

## Usage

In yout HTML:

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

## API

### Methods

| Method          | Parameters                      | Description                                                                       |
| --------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| on              | (event: 'scroll', fn: Function) | Add a scroll listener, which executes a specified function on every scroll change |
| off             | (event: 'scroll', fn: Function) | Remove a scroll listener animation                                                |
| scrollTo        | (target: string                 | number                                                                            | Element, opts: { native?: boolean }) | Scroll to an element (via selector, document top offset, or element reference) |
| getCurrentValue | none                            | Get a current scroll value                                                        |
| destroy         | none                            | Destroy an instance                                                               |
