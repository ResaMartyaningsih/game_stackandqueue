/**
 * queue.js
 * Real Object-Oriented Queue Data Structure Implementation
 * FIFO (First In, First Out)
 */

class Queue {
    constructor() {
        this.items = [];
    }

    /**
     * Enqueue: Add item to the rear of the queue
     * @param {*} item 
     */
    enqueue(item) {
        this.items.push(item);
        return item;
    }

    /**
     * Dequeue: Remove and return the frontmost item
     * @returns {*}
     */
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    /**
     * Front: Inspect the frontmost element without removing it
     * @returns {*}
     */
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    /**
     * isEmpty: Check if queue is empty
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
     * Clear: Reset the queue
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

window.Queue = Queue;
