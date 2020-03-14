/* eslint-env browser */

import attachNode from '@qc/attach-node'

const ADD_EVENT_LISTENER_OPTIONS = Object.freeze({ capture: true, once: true })

/**
 * @param {Object} params
 * @param {Attachable[]} params.attach An attachable as defined by `@qc/attach-node`.
 * @param {string} params.tag The name of the tag of the element to create.
 * @param {boolean|string} params[attribute_name] The names of the attributes to add
 *   to the created element. Use `true` or `false` for boolean attribute's value.
 *   Otherwise use strings for the attribute's value.
 * @param {number} [params.timeout=10000]
 */
function injectElement (params) {
  const { attach, tag, timeout, ...attrs } = params
  return new Promise((resolve, reject) => {
    const elmt = document.createElement(tag)
    Object.entries(attrs).forEach(([name, value]) => {
      if (typeof value === 'boolean') {
        elmt.setAttribute(name, '')
      }
      else {
        elmt.setAttribute(name, value)
      }
    })

    const t = typeof timeout === 'number' && timeout >= 0 ? timeout : 10000
    const timer = setTimeout(() => {
      const error = Error(`Failed to inject <${tag}> in ${t}ms.`)
      reject(error)
    }, t)
    const handleError = event => {
      // [1]
      elmt.removeEventListener('error', handleError)
      clearTimeout(timer)
      const error = Error(event.message || `Failed to inject <${tag}>.`)
      reject(error)
    }
    elmt.addEventListener('error', handleError, ADD_EVENT_LISTENER_OPTIONS)

    const handleLoad = event => {
      // [1]
      elmt.removeEventListener('load', handleLoad)
      clearTimeout(timer)
      resolve(elmt)
    }
    elmt.addEventListener('load', handleLoad, ADD_EVENT_LISTENER_OPTIONS)

    attachNode(elmt, attach)
  })
}

// [1]: The call to `removeEventListener` is still needed for IE and older
//   evergreen browsers.

export default injectElement
