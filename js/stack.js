/**
 * stack.js
 * Real Object-Oriented Stack Data Structure Implementation
 * LIFO (Last In, First Out)
 */

class Stack {
    constructor() {
        this.items = [];
    }

    /**
     * Push: Add item to the top of the stack
     * @param {*} item 
     */
    push(item) {
        this.items.push(item);
        return item;
    }

    /**
     * Pop: Remove and return the topmost item
     * @returns {*}
     */
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }

    /**
     * Peek: Inspect the topmost element without removing it
     * @returns {*}
     */
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    /**
     * isEmpty: Check if stack is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Size: Get total elements count
     * @returns {number}
     */
    size() {
        return this.items.length;
    }

    /**
     * Clear: Reset the stack
     */
    clear() {
        this.items = [];
    }

    /**
     * toArray: Returns a shallow copy of items
     * @returns {Array}
     */
    toArray() {
        return [...this.items];
    }
}

window.Stack = Stack;
