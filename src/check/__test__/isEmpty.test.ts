/**
 * si recibe null -> isEmpty(null) //true
 * si recibe undefined -> isEmpty/true
 * si recibe {} //true
 * si recibe [1,2,3] //false
 * si recibe: {name: 'Pepe} //false
 */

import { isEmpty } from "../isEmpty"

describe('isEmpty.ts', () => {
    it.each([
        { tested: null, expected: true, label: null },
        { tested: undefined, expected: true, label: 'undefined' },
        { tested: ['1', '2'], expected: false, label: '[1,2]' },
        { tested: [], expected: true, label: '[]' },
        { tested: {}, expected: true, label: '{}' },
        { tested: { name: "rocko" }, expected: false, label: '{name: "Rocko"}' }
    ])("isEmpty($label) should be $expected", ({ tested, expected }) => {
        expect(isEmpty(tested)).toBe(expected)
    })
})