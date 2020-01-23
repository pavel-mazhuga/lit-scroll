interface LitScrollOptions {
    ease?: number;
}
declare type EventName = 'scroll';
declare type LitScrollListener = (LitScrollListenerEvent: any) => void;
declare type ListenerFunction = (eventName: EventName, fn: LitScrollListener) => void;
interface LitScrollInstance {
    getCurrentValue: () => number;
    on: ListenerFunction;
    destroy: () => void;
}
export default function createLitScroll(_options?: LitScrollOptions): LitScrollInstance;
export {};
