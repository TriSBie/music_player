export default function html([first, ...rests], ...values) {
    return values.reduce((prev, curr) =>
        prev.concat(curr, rests.shift()), [first]
            .filter(x => x && x !== true || x === 0)
            .join(''))
}


export function createStore(reducer) {
    let state = reducer()
    const roots = new Map()
    function render() {
        for (const [root, component] of roots) {
            const output = component();
            root.innerHTML = output
        }
    }
    return {
        //function
        attach(component, root) {
            roots.set(component, root);
            render()
        },
        //connect
        connect(selector = state => state) {
            return component => (props, ...rests) =>
                component(Object.assign({}, props, selector(state), ...arguments))
        }
    }
}



