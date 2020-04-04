import createLitScroll from '../src/index';

let container: Element | null;

const createMarkup = () => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-lit-scroll', 'wrapper');
    container = document.createElement('div');
    container.setAttribute('data-lit-scroll', 'container');
    wrapper.appendChild(container);
    document.body.appendChild(wrapper);
};

const clearMarkup = () => {
    document.body.innerHTML = '';
    container = null;
};

beforeEach(createMarkup);
afterEach(clearMarkup);

describe('lit-scroll', () => {
    it('shows correct initial scroll value', () => {
        const scroll = createLitScroll();
        expect(scroll.getCurrentValue()).toEqual(0);
    });
});
