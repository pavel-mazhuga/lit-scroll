export function lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
}

export function getOffsetTop(element: Element) {
    return element.getBoundingClientRect().top + window.scrollY;
}
