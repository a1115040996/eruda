/*
 * @Author: your name
 * @Date: 2020-10-23 16:08:02
 * @LastEditTime: 2020-10-23 16:56:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \eruda\src\Performance\Performance.js
 */
import Tool from '../DevTools/Tool'
import evalCss from '../lib/evalCss'

export default class Performance extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Performance.scss'))

    this.name = 'performance'
    this._tpl = require('./Performance.hbs')
    this._performance = window.performance.timing
    this._locationHref = location.href
  }
  init($el) {
    super.init($el)

    this._bindEvent()
    this._render()
    window.onload = function() {
        console.log('onload========>');
    }
  }

  _bindEvent() {
    const $el = this._$el
    $el.on('click', '.eruda-icon-refresh', () => {})
  }

  destroy() {
    super.destroy()

    evalCss.remove(this._style)
  }
  _render() {
    const performance = this._performance
    const locationHref = this._locationHref

    this._renderHtml(
      this._tpl({
        performance,
        locationHref
      })
    )
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$el.html(html)
  }
}
