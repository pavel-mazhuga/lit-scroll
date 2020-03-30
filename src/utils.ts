// linear interpolation
export function lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
}
