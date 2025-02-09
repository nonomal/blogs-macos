import type {
    DirectiveBinding,
    ObjectDirective
} from 'vue'
import { on } from '@/utils/dom';

type clickoutsideContextType = HTMLElement & {
    "@@clickoutsideContext": {
        methodName: string,
        id: number,
        documentHandler: Function,
        bindingFn: Function
    }
}
type DocumentHandler = <T extends MouseEvent>(mouseup: T, mousedown: T) => void


const nodeList: { [Key: string]: any }[] = [];
const ctx = '@@clickoutsideContext';
let startClick: MouseEvent;
let seed = 0;

on(document, 'mousedown', (e: MouseEvent) => (startClick = e));

on(document, 'mouseup', (e: MouseEvent) => {
    nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});


function createDocumentHandler(el: clickoutsideContextType, binding: DirectiveBinding & { expression: string }, vnode: ObjectDirective & { context: { [Key: string]: any } }): DocumentHandler {
    return function (mouseup: any, mousedown: any) {
        if (!vnode ||
            !mouseup.target ||
            !mousedown.target ||
            el.contains(mouseup.target) ||
            el.contains(mousedown.target) ||
            el === mouseup.target) return;

        if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
            vnode.context[el[ctx].methodName]();
        } else {
            el[ctx].bindingFn && el[ctx].bindingFn();
        }
    };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-clickoutside="handleClose">
 * ```
 */
export default {
    mounted(el: clickoutsideContextType, binding: DirectiveBinding & { expression: string }, vnode: ObjectDirective & { context: { [Key: string]: any } }) {
        try {
            nodeList.push(el);
            const id = seed++;
            el[ctx] = {
                id,
                documentHandler: createDocumentHandler(el, binding, vnode),
                methodName: binding.expression,
                bindingFn: binding.value
            };
        } catch (e) {
            console.log('eee', e)
        }
    },
    updated(el: clickoutsideContextType, binding: DirectiveBinding & { expression: string }, vnode: ObjectDirective & { context: { [Key: string]: any } }) {
        el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
        el[ctx].methodName = binding.expression;
        el[ctx].bindingFn = binding.value;
    },
    unmounted(el: clickoutsideContextType) {
        let len = nodeList.length;
        for (let i = 0; i < len; i++) {
            if (nodeList[i][ctx].id === el[ctx].id) {
                nodeList.splice(i, 1);
                break;
            }
        }
    }
};