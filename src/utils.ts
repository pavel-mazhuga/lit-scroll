export function lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
}

export function isMobileDevice() {
    return /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(navigator.userAgent);
}
