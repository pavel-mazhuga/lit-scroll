interface LitScrollOptions {
    ease?: number;
}
declare type EventName = 'scroll';
interface LitScrollListenerEvent {
    docScrollValue: number;
    scrollValue: number;
}
declare type LitScrollListener = (event: LitScrollListenerEvent) => void;
declare type ListenerFunction = (eventName: EventName, fn: LitScrollListener) => void;
declare type ScrollTo = (target: number | string | Element, options?: {
    native: boolean;
}) => number | null;
interface LitScrollInstance {
    getCurrentValue: () => number;
    on: ListenerFunction;
    scrollTo: ScrollTo;
    destroy: () => void;
}
export default function createLitScroll(_options?: LitScrollOptions): LitScrollInstance;
export {};
