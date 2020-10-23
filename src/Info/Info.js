import Tool from '../DevTools/Tool'
import defInfo from './defInfo'
import { each, isFn, isUndef, cloneDeep, detectOs, escape, detectBrowser } from '../lib/util'
import evalCss from '../lib/evalCss'

const browser = detectBrowser()

export default class Info extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Info.scss'))

    this.name = 'info'
    this._tpl = require('./Info.hbs')
    this._infos = []
    this._locationHref = escape(location.href);
    this._userAgent = navigator.userAgent;
    this._device = {
      screenWidth: screen.width,
      screenHeight: screen.height,
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    };
    this._system = {
      detectOs: detectOs(),
      browserName: browser.name,
      browserVersion: browser.version
    };
  }
  init($el) {
    super.init($el)

    this._addDefInfo()
    this._bindEvent()
  }

  _bindEvent() {
      const $el = this._$el
      $el
        .on('click', '.eruda-icon-refresh', () => {
          console.log('refresh');
          this.refreshHref()._render()
        })
  }

  refreshHref() {
    this._locationHref = escape(location.href);
    return this;
  }

  destroy() {
    super.destroy()

    evalCss.remove(this._style)
  }
  add(name, val) {
    const infos = this._infos
    let isUpdate = false

    each(infos, info => {
      if (name !== info.name) return

      info.val = val
      isUpdate = true
    })

    if (!isUpdate) infos.push({ name, val })

    this._render()

    return this
  }
  get(name) {
    const infos = this._infos

    if (isUndef(name)) {
      return cloneDeep(infos)
    }

    let result

    each(infos, info => {
      if (name === info.name) result = info.val
    })

    return result
  }
  remove(name) {
    const infos = this._infos

    for (let i = infos.length - 1; i >= 0; i--) {
      if (infos[i].name === name) infos.splice(i, 1)
    }

    this._render()

    return this
  }
  clear() {
    this._infos = []

    this._render()

    return this
  }
  _addDefInfo() {
    each(defInfo, info => this.add(info.name, info.val))
  }
  _render() {
    const infos = []
    const locationHref = this._locationHref
    const userAgent = this._userAgent
    const device = this._device
    const system = this._system;

    each(this._infos, ({ name, val }) => {
      if (isFn(val)) val = val()

      infos.push({ name, val })
    })

    this._renderHtml(this._tpl({ 
      infos,
      locationHref,
      userAgent,
      device,
      system
    }))
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$el.html(html)
  }
}
