export function lerp(a: number, b: number, n: number): number {
    return (1 - n) * a + n * b;
}

export function isMobileDevice(): boolean {
    return /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(navigator.userAgent);
}

export function getOffsetTop(el: HTMLElement, windowScrollY: number = window.scrollY, windowHeight = 0): number {
    return el.getBoundingClientRect().top + windowScrollY - windowHeight;
}
