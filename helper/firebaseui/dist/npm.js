;(function () {
  var firebase = require('firebase/app')
  require('firebase/auth')
  if (typeof firebase.default !== 'undefined') {
    firebase = firebase.default
  }
  ;(function () {
    var supportCustomEvent = window.CustomEvent
    if (!supportCustomEvent || typeof supportCustomEvent === 'object') {
      supportCustomEvent = function CustomEvent(event, x) {
        x = x || {}
        var ev = document.createEvent('CustomEvent')
        ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null)
        return ev
      }
      supportCustomEvent.prototype = window.Event.prototype
    }
    function createsStackingContext(el) {
      while (el && el !== document.body) {
        var s = window.getComputedStyle(el)
        var invalid = function (k, ok) {
          return !(s[k] === undefined || s[k] === ok)
        }
        if (
          s.opacity < 1 ||
          invalid('zIndex', 'auto') ||
          invalid('transform', 'none') ||
          invalid('mixBlendMode', 'normal') ||
          invalid('filter', 'none') ||
          invalid('perspective', 'none') ||
          s['isolation'] === 'isolate' ||
          s.position === 'fixed' ||
          s.webkitOverflowScrolling === 'touch'
        )
          return true
        el = el.parentElement
      }
      return false
    }
    function findNearestDialog(el) {
      while (el) {
        if (el.localName === 'dialog') return el
        el = el.parentElement
      }
      return null
    }
    function safeBlur(el) {
      if (el && el.blur && el !== document.body) el.blur()
    }
    function inNodeList(nodeList, node) {
      for (var i = 0; i < nodeList.length; ++i) if (nodeList[i] === node) return true
      return false
    }
    function isFormMethodDialog(el) {
      if (!el || !el.hasAttribute('method')) return false
      return el.getAttribute('method').toLowerCase() === 'dialog'
    }
    function dialogPolyfillInfo(dialog) {
      this.dialog_ = dialog
      this.replacedStyleTop_ = false
      this.openAsModal_ = false
      if (!dialog.hasAttribute('role')) dialog.setAttribute('role', 'dialog')
      dialog.show = this.show.bind(this)
      dialog.showModal = this.showModal.bind(this)
      dialog.close = this.close.bind(this)
      if (!('returnValue' in dialog)) dialog.returnValue = ''
      if ('MutationObserver' in window) {
        var mo = new MutationObserver(this.maybeHideModal.bind(this))
        mo.observe(dialog, { attributes: true, attributeFilter: ['open'] })
      } else {
        var removed = false
        var cb = function () {
          removed ? this.downgradeModal() : this.maybeHideModal()
          removed = false
        }.bind(this)
        var timeout
        var delayModel = function (ev) {
          if (ev.target !== dialog) return
          var cand = 'DOMNodeRemoved'
          removed |= ev.type.substr(0, cand.length) === cand
          window.clearTimeout(timeout)
          timeout = window.setTimeout(cb, 0)
        }
        ;['DOMAttrModified', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument'].forEach(function (
          name
        ) {
          dialog.addEventListener(name, delayModel)
        })
      }
      Object.defineProperty(dialog, 'open', {
        set: this.setOpen.bind(this),
        get: dialog.hasAttribute.bind(dialog, 'open'),
      })
      this.backdrop_ = document.createElement('div')
      this.backdrop_.className = 'backdrop'
      this.backdrop_.addEventListener('click', this.backdropClick_.bind(this))
    }
    dialogPolyfillInfo.prototype = {
      get dialog() {
        return this.dialog_
      },
      maybeHideModal: function () {
        if (this.dialog_.hasAttribute('open') && document.body.contains(this.dialog_)) return
        this.downgradeModal()
      },
      downgradeModal: function () {
        if (!this.openAsModal_) return
        this.openAsModal_ = false
        this.dialog_.style.zIndex = ''
        if (this.replacedStyleTop_) {
          this.dialog_.style.top = ''
          this.replacedStyleTop_ = false
        }
        this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_)
        dialogPolyfill.dm.removeDialog(this)
      },
      setOpen: function (value) {
        if (value) this.dialog_.hasAttribute('open') || this.dialog_.setAttribute('open', '')
        else {
          this.dialog_.removeAttribute('open')
          this.maybeHideModal()
        }
      },
      backdropClick_: function (e) {
        if (!this.dialog_.hasAttribute('tabindex')) {
          var fake = document.createElement('div')
          this.dialog_.insertBefore(fake, this.dialog_.firstChild)
          fake.tabIndex = -1
          fake.focus()
          this.dialog_.removeChild(fake)
        } else this.dialog_.focus()
        var redirectedEvent = document.createEvent('MouseEvents')
        redirectedEvent.initMouseEvent(
          e.type,
          e.bubbles,
          e.cancelable,
          window,
          e.detail,
          e.screenX,
          e.screenY,
          e.clientX,
          e.clientY,
          e.ctrlKey,
          e.altKey,
          e.shiftKey,
          e.metaKey,
          e.button,
          e.relatedTarget
        )
        this.dialog_.dispatchEvent(redirectedEvent)
        e.stopPropagation()
      },
      focus_: function () {
        var target = this.dialog_.querySelector('[autofocus]:not([disabled])')
        if (!target && this.dialog_.tabIndex >= 0) target = this.dialog_
        if (!target) {
          var opts = ['button', 'input', 'keygen', 'select', 'textarea']
          var query = opts.map(function (el) {
            return el + ':not([disabled])'
          })
          query.push('[tabindex]:not([disabled]):not([tabindex=""])')
          target = this.dialog_.querySelector(query.join(', '))
        }
        safeBlur(document.activeElement)
        target && target.focus()
      },
      updateZIndex: function (dialogZ, backdropZ) {
        if (dialogZ < backdropZ) throw new Error('dialogZ should never be < backdropZ')
        this.dialog_.style.zIndex = dialogZ
        this.backdrop_.style.zIndex = backdropZ
      },
      show: function () {
        if (!this.dialog_.open) {
          this.setOpen(true)
          this.focus_()
        }
      },
      showModal: function () {
        if (this.dialog_.hasAttribute('open'))
          throw new Error(
            "Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally."
          )
        if (!document.body.contains(this.dialog_))
          throw new Error(
            "Failed to execute 'showModal' on dialog: The element is not in a Document."
          )
        if (!dialogPolyfill.dm.pushDialog(this))
          throw new Error(
            "Failed to execute 'showModal' on dialog: There are too many open modal dialogs."
          )
        if (createsStackingContext(this.dialog_.parentElement))
          console.warn(
            'A dialog is being shown inside a stacking context. ' +
              'This may cause it to be unusable. For more information, see this link: ' +
              'https://github.com/GoogleChrome/dialog-polyfill/#stacking-context'
          )
        this.setOpen(true)
        this.openAsModal_ = true
        if (dialogPolyfill.needsCentering(this.dialog_)) {
          dialogPolyfill.reposition(this.dialog_)
          this.replacedStyleTop_ = true
        } else this.replacedStyleTop_ = false
        this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling)
        this.focus_()
      },
      close: function (opt_returnValue) {
        if (!this.dialog_.hasAttribute('open'))
          throw new Error(
            "Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed."
          )
        this.setOpen(false)
        if (opt_returnValue !== undefined) this.dialog_.returnValue = opt_returnValue
        var closeEvent = new supportCustomEvent('close', { bubbles: false, cancelable: false })
        this.dialog_.dispatchEvent(closeEvent)
      },
    }
    var dialogPolyfill = {}
    dialogPolyfill.reposition = function (element) {
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2
      element.style.top = Math.max(scrollTop, topValue) + 'px'
    }
    dialogPolyfill.isInlinePositionSetByStylesheet = function (element) {
      for (var i = 0; i < document.styleSheets.length; ++i) {
        var styleSheet = document.styleSheets[i]
        var cssRules = null
        try {
          cssRules = styleSheet.cssRules
        } catch (e) {}
        if (!cssRules) continue
        for (var j = 0; j < cssRules.length; ++j) {
          var rule = cssRules[j]
          var selectedNodes = null
          try {
            selectedNodes = document.querySelectorAll(rule.selectorText)
          } catch (e$0) {}
          if (!selectedNodes || !inNodeList(selectedNodes, element)) continue
          var cssTop = rule.style.getPropertyValue('top')
          var cssBottom = rule.style.getPropertyValue('bottom')
          if ((cssTop && cssTop !== 'auto') || (cssBottom && cssBottom !== 'auto')) return true
        }
      }
      return false
    }
    dialogPolyfill.needsCentering = function (dialog) {
      var computedStyle = window.getComputedStyle(dialog)
      if (computedStyle.position !== 'absolute') return false
      if (
        (dialog.style.top !== 'auto' && dialog.style.top !== '') ||
        (dialog.style.bottom !== 'auto' && dialog.style.bottom !== '')
      )
        return false
      return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog)
    }
    dialogPolyfill.forceRegisterDialog = function (element) {
      if (window.HTMLDialogElement || element.showModal)
        console.warn(
          'This browser already supports <dialog>, the polyfill ' + 'may not work correctly',
          element
        )
      if (element.localName !== 'dialog')
        throw new Error('Failed to register dialog: The element is not a dialog.')
      new dialogPolyfillInfo(element)
    }
    dialogPolyfill.registerDialog = function (element) {
      if (!element.showModal) dialogPolyfill.forceRegisterDialog(element)
    }
    dialogPolyfill.DialogManager = function () {
      this.pendingDialogStack = []
      var checkDOM = this.checkDOM_.bind(this)
      this.overlay = document.createElement('div')
      this.overlay.className = '_dialog_overlay'
      this.overlay.addEventListener(
        'click',
        function (e) {
          this.forwardTab_ = undefined
          e.stopPropagation()
          checkDOM([])
        }.bind(this)
      )
      this.handleKey_ = this.handleKey_.bind(this)
      this.handleFocus_ = this.handleFocus_.bind(this)
      this.zIndexLow_ = 1e5
      this.zIndexHigh_ = 1e5 + 150
      this.forwardTab_ = undefined
      if ('MutationObserver' in window)
        this.mo_ = new MutationObserver(function (records) {
          var removed = []
          records.forEach(function (rec) {
            for (var i = 0, c; (c = rec.removedNodes[i]); ++i) {
              if (!(c instanceof Element)) continue
              else if (c.localName === 'dialog') removed.push(c)
              removed = removed.concat(c.querySelectorAll('dialog'))
            }
          })
          removed.length && checkDOM(removed)
        })
    }
    dialogPolyfill.DialogManager.prototype.blockDocument = function () {
      document.documentElement.addEventListener('focus', this.handleFocus_, true)
      document.addEventListener('keydown', this.handleKey_)
      this.mo_ && this.mo_.observe(document, { childList: true, subtree: true })
    }
    dialogPolyfill.DialogManager.prototype.unblockDocument = function () {
      document.documentElement.removeEventListener('focus', this.handleFocus_, true)
      document.removeEventListener('keydown', this.handleKey_)
      this.mo_ && this.mo_.disconnect()
    }
    dialogPolyfill.DialogManager.prototype.updateStacking = function () {
      var zIndex = this.zIndexHigh_
      for (var i = 0, dpi; (dpi = this.pendingDialogStack[i]); ++i) {
        dpi.updateZIndex(--zIndex, --zIndex)
        if (i === 0) this.overlay.style.zIndex = --zIndex
      }
      var last = this.pendingDialogStack[0]
      if (last) {
        var p = last.dialog.parentNode || document.body
        p.appendChild(this.overlay)
      } else if (this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay)
    }
    dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function (candidate) {
      while ((candidate = findNearestDialog(candidate))) {
        for (var i = 0, dpi; (dpi = this.pendingDialogStack[i]); ++i)
          if (dpi.dialog === candidate) return i === 0
        candidate = candidate.parentElement
      }
      return false
    }
    dialogPolyfill.DialogManager.prototype.handleFocus_ = function (event) {
      if (this.containedByTopDialog_(event.target)) return
      event.preventDefault()
      event.stopPropagation()
      safeBlur(event.target)
      if (this.forwardTab_ === undefined) return
      var dpi = this.pendingDialogStack[0]
      var dialog = dpi.dialog
      var position = dialog.compareDocumentPosition(event.target)
      if (position & Node.DOCUMENT_POSITION_PRECEDING)
        if (this.forwardTab_) dpi.focus_()
        else document.documentElement.focus()
      else;
      return false
    }
    dialogPolyfill.DialogManager.prototype.handleKey_ = function (event) {
      this.forwardTab_ = undefined
      if (event.keyCode === 27) {
        event.preventDefault()
        event.stopPropagation()
        var cancelEvent = new supportCustomEvent('cancel', { bubbles: false, cancelable: true })
        var dpi = this.pendingDialogStack[0]
        if (dpi && dpi.dialog.dispatchEvent(cancelEvent)) dpi.dialog.close()
      } else if (event.keyCode === 9) this.forwardTab_ = !event.shiftKey
    }
    dialogPolyfill.DialogManager.prototype.checkDOM_ = function (removed) {
      var clone = this.pendingDialogStack.slice()
      clone.forEach(function (dpi) {
        if (removed.indexOf(dpi.dialog) !== -1) dpi.downgradeModal()
        else dpi.maybeHideModal()
      })
    }
    dialogPolyfill.DialogManager.prototype.pushDialog = function (dpi) {
      var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1
      if (this.pendingDialogStack.length >= allowed) return false
      if (this.pendingDialogStack.unshift(dpi) === 1) this.blockDocument()
      this.updateStacking()
      return true
    }
    dialogPolyfill.DialogManager.prototype.removeDialog = function (dpi) {
      var index = this.pendingDialogStack.indexOf(dpi)
      if (index === -1) return
      this.pendingDialogStack.splice(index, 1)
      if (this.pendingDialogStack.length === 0) this.unblockDocument()
      this.updateStacking()
    }
    dialogPolyfill.dm = new dialogPolyfill.DialogManager()
    dialogPolyfill.formSubmitter = null
    dialogPolyfill.useValue = null
    if (window.HTMLDialogElement === undefined) {
      var testForm = document.createElement('form')
      testForm.setAttribute('method', 'dialog')
      if (testForm.method !== 'dialog') {
        var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'method')
        if (methodDescriptor) {
          var realGet = methodDescriptor.get
          methodDescriptor.get = function () {
            if (isFormMethodDialog(this)) return 'dialog'
            return realGet.call(this)
          }
          var realSet = methodDescriptor.set
          methodDescriptor.set = function (v) {
            if (typeof v === 'string' && v.toLowerCase() === 'dialog')
              return this.setAttribute('method', v)
            return realSet.call(this, v)
          }
          Object.defineProperty(HTMLFormElement.prototype, 'method', methodDescriptor)
        }
      }
      document.addEventListener(
        'click',
        function (ev) {
          dialogPolyfill.formSubmitter = null
          dialogPolyfill.useValue = null
          if (ev.defaultPrevented) return
          var target = ev.target
          if (!target || !isFormMethodDialog(target.form)) return
          var valid = target.type === 'submit' && ['button', 'input'].indexOf(target.localName) > -1
          if (!valid) {
            if (!(target.localName === 'input' && target.type === 'image')) return
            dialogPolyfill.useValue = ev.offsetX + ',' + ev.offsetY
          }
          var dialog = findNearestDialog(target)
          if (!dialog) return
          dialogPolyfill.formSubmitter = target
        },
        false
      )
      var nativeFormSubmit = HTMLFormElement.prototype.submit
      var replacementFormSubmit = function () {
        if (!isFormMethodDialog(this)) return nativeFormSubmit.call(this)
        var dialog = findNearestDialog(this)
        dialog && dialog.close()
      }
      HTMLFormElement.prototype.submit = replacementFormSubmit
      document.addEventListener(
        'submit',
        function (ev) {
          var form = ev.target
          if (!isFormMethodDialog(form)) return
          ev.preventDefault()
          var dialog = findNearestDialog(form)
          if (!dialog) return
          var s = dialogPolyfill.formSubmitter
          if (s && s.form === form) dialog.close(dialogPolyfill.useValue || s.value)
          else dialog.close()
          dialogPolyfill.formSubmitter = null
        },
        true
      )
    }
    dialogPolyfill['forceRegisterDialog'] = dialogPolyfill.forceRegisterDialog
    dialogPolyfill['registerDialog'] = dialogPolyfill.registerDialog
    if (typeof define === 'function' && 'amd' in define)
      define(function () {
        return dialogPolyfill
      })
    else if (typeof module === 'object' && typeof module['exports'] === 'object')
      module['exports'] = dialogPolyfill
    else window['dialogPolyfill'] = dialogPolyfill
  })() /*

 Copyright 2015 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
  var componentHandler = {
    upgradeDom: function (optJsClass, optCssClass) {},
    upgradeElement: function (element, optJsClass) {},
    upgradeElements: function (elements) {},
    upgradeAllRegistered: function () {},
    registerUpgradedCallback: function (jsClass, callback) {},
    register: function (config) {},
    downgradeElements: function (nodes) {},
  }
  componentHandler = (function () {
    var registeredComponents_ = []
    var createdComponents_ = []
    var componentConfigProperty_ = 'mdlComponentConfigInternal_'
    function findRegisteredClass_(name, optReplace) {
      for (var i = 0; i < registeredComponents_.length; i++)
        if (registeredComponents_[i].className === name) {
          if (typeof optReplace !== 'undefined') registeredComponents_[i] = optReplace
          return registeredComponents_[i]
        }
      return false
    }
    function getUpgradedListOfElement_(element) {
      var dataUpgraded = element.getAttribute('data-upgraded')
      return dataUpgraded === null ? [''] : dataUpgraded.split(',')
    }
    function isElementUpgraded_(element, jsClass) {
      var upgradedList = getUpgradedListOfElement_(element)
      return upgradedList.indexOf(jsClass) !== -1
    }
    function createEvent_(eventType, bubbles, cancelable) {
      if ('CustomEvent' in window && typeof window.CustomEvent === 'function')
        return new CustomEvent(eventType, { bubbles: bubbles, cancelable: cancelable })
      else {
        var ev = document.createEvent('Events')
        ev.initEvent(eventType, bubbles, cancelable)
        return ev
      }
    }
    function upgradeDomInternal(optJsClass, optCssClass) {
      if (typeof optJsClass === 'undefined' && typeof optCssClass === 'undefined')
        for (var i = 0; i < registeredComponents_.length; i++)
          upgradeDomInternal(registeredComponents_[i].className, registeredComponents_[i].cssClass)
      else {
        var jsClass = optJsClass
        if (typeof optCssClass === 'undefined') {
          var registeredClass = findRegisteredClass_(jsClass)
          if (registeredClass) optCssClass = registeredClass.cssClass
        }
        var elements = document.querySelectorAll('.' + optCssClass)
        for (var n = 0; n < elements.length; n++) upgradeElementInternal(elements[n], jsClass)
      }
    }
    function upgradeElementInternal(element, optJsClass) {
      if (!(typeof element === 'object' && element instanceof Element))
        throw new Error('Invalid argument provided to upgrade MDL element.')
      var upgradingEv = createEvent_('mdl-componentupgrading', true, true)
      element.dispatchEvent(upgradingEv)
      if (upgradingEv.defaultPrevented) return
      var upgradedList = getUpgradedListOfElement_(element)
      var classesToUpgrade = []
      if (!optJsClass) {
        var classList = element.classList
        registeredComponents_.forEach(function (component) {
          if (
            classList.contains(component.cssClass) &&
            classesToUpgrade.indexOf(component) === -1 &&
            !isElementUpgraded_(element, component.className)
          )
            classesToUpgrade.push(component)
        })
      } else if (!isElementUpgraded_(element, optJsClass))
        classesToUpgrade.push(findRegisteredClass_(optJsClass))
      for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
        registeredClass = classesToUpgrade[i]
        if (registeredClass) {
          upgradedList.push(registeredClass.className)
          element.setAttribute('data-upgraded', upgradedList.join(','))
          var instance = new registeredClass.classConstructor(element)
          instance[componentConfigProperty_] = registeredClass
          createdComponents_.push(instance)
          for (var j = 0, m = registeredClass.callbacks.length; j < m; j++)
            registeredClass.callbacks[j](element)
          if (registeredClass.widget) element[registeredClass.className] = instance
        } else throw new Error('Unable to find a registered component for the given class.')
        var upgradedEv = createEvent_('mdl-componentupgraded', true, false)
        element.dispatchEvent(upgradedEv)
      }
    }
    function upgradeElementsInternal(elements) {
      if (!Array.isArray(elements))
        if (elements instanceof Element) elements = [elements]
        else elements = Array.prototype.slice.call(elements)
      for (var i = 0, n = elements.length, element; i < n; i++) {
        element = elements[i]
        if (element instanceof HTMLElement) {
          upgradeElementInternal(element)
          if (element.children.length > 0) upgradeElementsInternal(element.children)
        }
      }
    }
    function registerInternal(config) {
      var widgetMissing =
        typeof config.widget === 'undefined' && typeof config['widget'] === 'undefined'
      var widget = true
      if (!widgetMissing) widget = config.widget || config['widget']
      var newConfig = {
        classConstructor: config.constructor || config['constructor'],
        className: config.classAsString || config['classAsString'],
        cssClass: config.cssClass || config['cssClass'],
        widget: widget,
        callbacks: [],
      }
      registeredComponents_.forEach(function (item) {
        if (item.cssClass === newConfig.cssClass)
          throw new Error('The provided cssClass has already been registered: ' + item.cssClass)
        if (item.className === newConfig.className)
          throw new Error('The provided className has already been registered')
      })
      if (config.constructor.prototype.hasOwnProperty(componentConfigProperty_))
        throw new Error(
          'MDL component classes must not have ' +
            componentConfigProperty_ +
            ' defined as a property.'
        )
      var found = findRegisteredClass_(config.classAsString, newConfig)
      if (!found) registeredComponents_.push(newConfig)
    }
    function registerUpgradedCallbackInternal(jsClass, callback) {
      var regClass = findRegisteredClass_(jsClass)
      if (regClass) regClass.callbacks.push(callback)
    }
    function upgradeAllRegisteredInternal() {
      for (var n = 0; n < registeredComponents_.length; n++)
        upgradeDomInternal(registeredComponents_[n].className)
    }
    function deconstructComponentInternal(component) {
      if (component) {
        var componentIndex = createdComponents_.indexOf(component)
        createdComponents_.splice(componentIndex, 1)
        var upgrades = component.element_.getAttribute('data-upgraded').split(',')
        var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString)
        upgrades.splice(componentPlace, 1)
        component.element_.setAttribute('data-upgraded', upgrades.join(','))
        var ev = createEvent_('mdl-componentdowngraded', true, false)
        component.element_.dispatchEvent(ev)
      }
    }
    function downgradeNodesInternal(nodes) {
      var downgradeNode = function (node) {
        createdComponents_
          .filter(function (item) {
            return item.element_ === node
          })
          .forEach(deconstructComponentInternal)
      }
      if (nodes instanceof Array || nodes instanceof NodeList)
        for (var n = 0; n < nodes.length; n++) downgradeNode(nodes[n])
      else if (nodes instanceof Node) downgradeNode(nodes)
      else throw new Error('Invalid argument provided to downgrade MDL nodes.')
    }
    return {
      upgradeDom: upgradeDomInternal,
      upgradeElement: upgradeElementInternal,
      upgradeElements: upgradeElementsInternal,
      upgradeAllRegistered: upgradeAllRegisteredInternal,
      registerUpgradedCallback: registerUpgradedCallbackInternal,
      register: registerInternal,
      downgradeElements: downgradeNodesInternal,
    }
  })()
  componentHandler.ComponentConfigPublic
  componentHandler.ComponentConfig
  componentHandler.Component
  componentHandler['upgradeDom'] = componentHandler.upgradeDom
  componentHandler['upgradeElement'] = componentHandler.upgradeElement
  componentHandler['upgradeElements'] = componentHandler.upgradeElements
  componentHandler['upgradeAllRegistered'] = componentHandler.upgradeAllRegistered
  componentHandler['registerUpgradedCallback'] = componentHandler.registerUpgradedCallback
  componentHandler['register'] = componentHandler.register
  componentHandler['downgradeElements'] = componentHandler.downgradeElements
  window.componentHandler = componentHandler
  window['componentHandler'] = componentHandler
  window.addEventListener('load', function () {
    if (
      'classList' in document.createElement('div') &&
      'querySelector' in document &&
      'addEventListener' in window &&
      Array.prototype.forEach
    ) {
      document.documentElement.classList.add('mdl-js')
      componentHandler.upgradeAllRegistered()
    } else {
      componentHandler.upgradeElement = function () {}
      componentHandler.register = function () {}
    }
  })
  ;(function () {
    var MaterialButton = function MaterialButton(element) {
      this.element_ = element
      this.init()
    }
    window['MaterialButton'] = MaterialButton
    MaterialButton.prototype.Constant_ = {}
    MaterialButton.prototype.CssClasses_ = {
      RIPPLE_EFFECT: 'mdl-js-ripple-effect',
      RIPPLE_CONTAINER: 'mdl-button__ripple-container',
      RIPPLE: 'mdl-ripple',
    }
    MaterialButton.prototype.blurHandler_ = function (event) {
      if (event) this.element_.blur()
    }
    MaterialButton.prototype.disable = function () {
      this.element_.disabled = true
    }
    MaterialButton.prototype['disable'] = MaterialButton.prototype.disable
    MaterialButton.prototype.enable = function () {
      this.element_.disabled = false
    }
    MaterialButton.prototype['enable'] = MaterialButton.prototype.enable
    MaterialButton.prototype.init = function () {
      if (this.element_) {
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
          var rippleContainer = document.createElement('span')
          rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER)
          this.rippleElement_ = document.createElement('span')
          this.rippleElement_.classList.add(this.CssClasses_.RIPPLE)
          rippleContainer.appendChild(this.rippleElement_)
          this.boundRippleBlurHandler = this.blurHandler_.bind(this)
          this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler)
          this.element_.appendChild(rippleContainer)
        }
        this.boundButtonBlurHandler = this.blurHandler_.bind(this)
        this.element_.addEventListener('mouseup', this.boundButtonBlurHandler)
        this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler)
      }
    }
    componentHandler.register({
      constructor: MaterialButton,
      classAsString: 'MaterialButton',
      cssClass: 'mdl-js-button',
      widget: true,
    })
  })()
  ;(function () {
    var MaterialProgress = function MaterialProgress(element) {
      this.element_ = element
      this.init()
    }
    window['MaterialProgress'] = MaterialProgress
    MaterialProgress.prototype.Constant_ = {}
    MaterialProgress.prototype.CssClasses_ = { INDETERMINATE_CLASS: 'mdl-progress__indeterminate' }
    MaterialProgress.prototype.setProgress = function (p) {
      if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) return
      this.progressbar_.style.width = p + '%'
    }
    MaterialProgress.prototype['setProgress'] = MaterialProgress.prototype.setProgress
    MaterialProgress.prototype.setBuffer = function (p) {
      this.bufferbar_.style.width = p + '%'
      this.auxbar_.style.width = 100 - p + '%'
    }
    MaterialProgress.prototype['setBuffer'] = MaterialProgress.prototype.setBuffer
    MaterialProgress.prototype.init = function () {
      if (this.element_) {
        var el = document.createElement('div')
        el.className = 'progressbar bar bar1'
        this.element_.appendChild(el)
        this.progressbar_ = el
        el = document.createElement('div')
        el.className = 'bufferbar bar bar2'
        this.element_.appendChild(el)
        this.bufferbar_ = el
        el = document.createElement('div')
        el.className = 'auxbar bar bar3'
        this.element_.appendChild(el)
        this.auxbar_ = el
        this.progressbar_.style.width = '0%'
        this.bufferbar_.style.width = '100%'
        this.auxbar_.style.width = '0%'
        this.element_.classList.add('is-upgraded')
      }
    }
    componentHandler.register({
      constructor: MaterialProgress,
      classAsString: 'MaterialProgress',
      cssClass: 'mdl-js-progress',
      widget: true,
    })
  })()
  ;(function () {
    var MaterialSpinner = function MaterialSpinner(element) {
      this.element_ = element
      this.init()
    }
    window['MaterialSpinner'] = MaterialSpinner
    MaterialSpinner.prototype.Constant_ = { MDL_SPINNER_LAYER_COUNT: 4 }
    MaterialSpinner.prototype.CssClasses_ = {
      MDL_SPINNER_LAYER: 'mdl-spinner__layer',
      MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
      MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
      MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
      MDL_SPINNER_LEFT: 'mdl-spinner__left',
      MDL_SPINNER_RIGHT: 'mdl-spinner__right',
    }
    MaterialSpinner.prototype.createLayer = function (index) {
      var layer = document.createElement('div')
      layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER)
      layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index)
      var leftClipper = document.createElement('div')
      leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER)
      leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT)
      var gapPatch = document.createElement('div')
      gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH)
      var rightClipper = document.createElement('div')
      rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER)
      rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT)
      var circleOwners = [leftClipper, gapPatch, rightClipper]
      for (var i = 0; i < circleOwners.length; i++) {
        var circle = document.createElement('div')
        circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE)
        circleOwners[i].appendChild(circle)
      }
      layer.appendChild(leftClipper)
      layer.appendChild(gapPatch)
      layer.appendChild(rightClipper)
      this.element_.appendChild(layer)
    }
    MaterialSpinner.prototype['createLayer'] = MaterialSpinner.prototype.createLayer
    MaterialSpinner.prototype.stop = function () {
      this.element_.classList.remove('is-active')
    }
    MaterialSpinner.prototype['stop'] = MaterialSpinner.prototype.stop
    MaterialSpinner.prototype.start = function () {
      this.element_.classList.add('is-active')
    }
    MaterialSpinner.prototype['start'] = MaterialSpinner.prototype.start
    MaterialSpinner.prototype.init = function () {
      if (this.element_) {
        for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) this.createLayer(i)
        this.element_.classList.add('is-upgraded')
      }
    }
    componentHandler.register({
      constructor: MaterialSpinner,
      classAsString: 'MaterialSpinner',
      cssClass: 'mdl-js-spinner',
      widget: true,
    })
  })()
  ;(function () {
    var MaterialTextfield = function MaterialTextfield(element) {
      this.element_ = element
      this.maxRows = this.Constant_.NO_MAX_ROWS
      this.init()
    }
    window['MaterialTextfield'] = MaterialTextfield
    MaterialTextfield.prototype.Constant_ = { NO_MAX_ROWS: -1, MAX_ROWS_ATTRIBUTE: 'maxrows' }
    MaterialTextfield.prototype.CssClasses_ = {
      LABEL: 'mdl-textfield__label',
      INPUT: 'mdl-textfield__input',
      IS_DIRTY: 'is-dirty',
      IS_FOCUSED: 'is-focused',
      IS_DISABLED: 'is-disabled',
      IS_INVALID: 'is-invalid',
      IS_UPGRADED: 'is-upgraded',
      HAS_PLACEHOLDER: 'has-placeholder',
    }
    MaterialTextfield.prototype.onKeyDown_ = function (event) {
      var currentRowCount = event.target.value.split('\n').length
      if (event.keyCode === 13) if (currentRowCount >= this.maxRows) event.preventDefault()
    }
    MaterialTextfield.prototype.onFocus_ = function (event) {
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED)
    }
    MaterialTextfield.prototype.onBlur_ = function (event) {
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED)
    }
    MaterialTextfield.prototype.onReset_ = function (event) {
      this.updateClasses_()
    }
    MaterialTextfield.prototype.updateClasses_ = function () {
      this.checkDisabled()
      this.checkValidity()
      this.checkDirty()
      this.checkFocus()
    }
    MaterialTextfield.prototype.checkDisabled = function () {
      if (this.input_.disabled) this.element_.classList.add(this.CssClasses_.IS_DISABLED)
      else this.element_.classList.remove(this.CssClasses_.IS_DISABLED)
    }
    MaterialTextfield.prototype['checkDisabled'] = MaterialTextfield.prototype.checkDisabled
    MaterialTextfield.prototype.checkFocus = function () {
      if (Boolean(this.element_.querySelector(':focus')))
        this.element_.classList.add(this.CssClasses_.IS_FOCUSED)
      else this.element_.classList.remove(this.CssClasses_.IS_FOCUSED)
    }
    MaterialTextfield.prototype['checkFocus'] = MaterialTextfield.prototype.checkFocus
    MaterialTextfield.prototype.checkValidity = function () {
      if (this.input_.validity)
        if (this.input_.validity.valid) this.element_.classList.remove(this.CssClasses_.IS_INVALID)
        else this.element_.classList.add(this.CssClasses_.IS_INVALID)
    }
    MaterialTextfield.prototype['checkValidity'] = MaterialTextfield.prototype.checkValidity
    MaterialTextfield.prototype.checkDirty = function () {
      if (this.input_.value && this.input_.value.length > 0)
        this.element_.classList.add(this.CssClasses_.IS_DIRTY)
      else this.element_.classList.remove(this.CssClasses_.IS_DIRTY)
    }
    MaterialTextfield.prototype['checkDirty'] = MaterialTextfield.prototype.checkDirty
    MaterialTextfield.prototype.disable = function () {
      this.input_.disabled = true
      this.updateClasses_()
    }
    MaterialTextfield.prototype['disable'] = MaterialTextfield.prototype.disable
    MaterialTextfield.prototype.enable = function () {
      this.input_.disabled = false
      this.updateClasses_()
    }
    MaterialTextfield.prototype['enable'] = MaterialTextfield.prototype.enable
    MaterialTextfield.prototype.change = function (value) {
      this.input_.value = value || ''
      this.updateClasses_()
    }
    MaterialTextfield.prototype['change'] = MaterialTextfield.prototype.change
    MaterialTextfield.prototype.init = function () {
      if (this.element_) {
        this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL)
        this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT)
        if (this.input_) {
          if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
            this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10)
            if (isNaN(this.maxRows)) this.maxRows = this.Constant_.NO_MAX_ROWS
          }
          if (this.input_.hasAttribute('placeholder'))
            this.element_.classList.add(this.CssClasses_.HAS_PLACEHOLDER)
          this.boundUpdateClassesHandler = this.updateClasses_.bind(this)
          this.boundFocusHandler = this.onFocus_.bind(this)
          this.boundBlurHandler = this.onBlur_.bind(this)
          this.boundResetHandler = this.onReset_.bind(this)
          this.input_.addEventListener('input', this.boundUpdateClassesHandler)
          this.input_.addEventListener('focus', this.boundFocusHandler)
          this.input_.addEventListener('blur', this.boundBlurHandler)
          this.input_.addEventListener('reset', this.boundResetHandler)
          if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
            this.boundKeyDownHandler = this.onKeyDown_.bind(this)
            this.input_.addEventListener('keydown', this.boundKeyDownHandler)
          }
          var invalid = this.element_.classList.contains(this.CssClasses_.IS_INVALID)
          this.updateClasses_()
          this.element_.classList.add(this.CssClasses_.IS_UPGRADED)
          if (invalid) this.element_.classList.add(this.CssClasses_.IS_INVALID)
          if (this.input_.hasAttribute('autofocus')) {
            this.element_.focus()
            this.checkFocus()
          }
        }
      }
    }
    componentHandler.register({
      constructor: MaterialTextfield,
      classAsString: 'MaterialTextfield',
      cssClass: 'mdl-js-textfield',
      widget: true,
    })
  })()
  ;(function () {
    var l,
      aa =
        'function' == typeof Object.create
          ? Object.create
          : function (a) {
              function b() {}
              b.prototype = a
              return new b()
            },
      ba
    if ('function' == typeof Object.setPrototypeOf) ba = Object.setPrototypeOf
    else {
      var ca
      a: {
        var da = { xb: !0 },
          ea = {}
        try {
          ea.__proto__ = da
          ca = ea.xb
          break a
        } catch (a) {}
        ca = !1
      }
      ba = ca
        ? function (a, b) {
            a.__proto__ = b
            if (a.__proto__ !== b) throw new TypeError(a + ' is not extensible')
            return a
          }
        : null
    }
    var fa = ba
    function m(a, b) {
      a.prototype = aa(b.prototype)
      a.prototype.constructor = a
      if (fa) fa(a, b)
      else
        for (var c in b)
          if ('prototype' != c)
            if (Object.defineProperties) {
              var d = Object.getOwnPropertyDescriptor(b, c)
              d && Object.defineProperty(a, c, d)
            } else a[c] = b[c]
      a.K = b.prototype
    }
    var ha =
        'function' == typeof Object.defineProperties
          ? Object.defineProperty
          : function (a, b, c) {
              a != Array.prototype && a != Object.prototype && (a[b] = c.value)
            },
      ia =
        'undefined' != typeof window && window === this
          ? this
          : 'undefined' != typeof global && null != global
          ? global
          : this
    function ja(a, b) {
      if (b) {
        var c = ia
        a = a.split('.')
        for (var d = 0; d < a.length - 1; d++) {
          var e = a[d]
          e in c || (c[e] = {})
          c = c[e]
        }
        a = a[a.length - 1]
        d = c[a]
        b = b(d)
        b != d && null != b && ha(c, a, { configurable: !0, writable: !0, value: b })
      }
    }
    ja('Object.is', function (a) {
      return a
        ? a
        : function (b, c) {
            return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c
          }
    })
    ja('Array.prototype.includes', function (a) {
      return a
        ? a
        : function (b, c) {
            var d = this
            d instanceof String && (d = String(d))
            var e = d.length
            c = c || 0
            for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
              var f = d[c]
              if (f === b || Object.is(f, b)) return !0
            }
            return !1
          }
    })
    var n = this
    function ka(a) {
      return void 0 !== a
    }
    function q(a) {
      return 'string' == typeof a
    }
    var la = /^[\w+/_-]+[=]{0,2}$/,
      ma = null
    function na() {}
    function oa(a) {
      a.W = void 0
      a.Xa = function () {
        return a.W ? a.W : (a.W = new a())
      }
    }
    function pa(a) {
      var b = typeof a
      if ('object' == b)
        if (a) {
          if (a instanceof Array) return 'array'
          if (a instanceof Object) return b
          var c = Object.prototype.toString.call(a)
          if ('[object Window]' == c) return 'object'
          if (
            '[object Array]' == c ||
            ('number' == typeof a.length &&
              'undefined' != typeof a.splice &&
              'undefined' != typeof a.propertyIsEnumerable &&
              !a.propertyIsEnumerable('splice'))
          )
            return 'array'
          if (
            '[object Function]' == c ||
            ('undefined' != typeof a.call &&
              'undefined' != typeof a.propertyIsEnumerable &&
              !a.propertyIsEnumerable('call'))
          )
            return 'function'
        } else return 'null'
      else if ('function' == b && 'undefined' == typeof a.call) return 'object'
      return b
    }
    function qa(a) {
      return 'array' == pa(a)
    }
    function ra(a) {
      var b = pa(a)
      return 'array' == b || ('object' == b && 'number' == typeof a.length)
    }
    function sa(a) {
      return 'function' == pa(a)
    }
    function ta(a) {
      var b = typeof a
      return ('object' == b && null != a) || 'function' == b
    }
    var ua = 'closure_uid_' + ((1e9 * Math.random()) >>> 0),
      va = 0
    function wa(a, b, c) {
      return a.call.apply(a.bind, arguments)
    }
    function xa(a, b, c) {
      if (!a) throw Error()
      if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2)
        return function () {
          var e = Array.prototype.slice.call(arguments)
          Array.prototype.unshift.apply(e, d)
          return a.apply(b, e)
        }
      }
      return function () {
        return a.apply(b, arguments)
      }
    }
    function r(a, b, c) {
      Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf('native code')
        ? (r = wa)
        : (r = xa)
      return r.apply(null, arguments)
    }
    function za(a, b) {
      var c = Array.prototype.slice.call(arguments, 1)
      return function () {
        var d = c.slice()
        d.push.apply(d, arguments)
        return a.apply(this, d)
      }
    }
    function u(a, b) {
      for (var c in b) a[c] = b[c]
    }
    var Aa =
      Date.now ||
      function () {
        return +new Date()
      }
    function v(a, b) {
      a = a.split('.')
      var c = n
      a[0] in c || 'undefined' == typeof c.execScript || c.execScript('var ' + a[0])
      for (var d; a.length && (d = a.shift()); )
        !a.length && ka(b)
          ? (c[d] = b)
          : c[d] && c[d] !== Object.prototype[d]
          ? (c = c[d])
          : (c = c[d] = {})
    }
    function w(a, b) {
      function c() {}
      c.prototype = b.prototype
      a.K = b.prototype
      a.prototype = new c()
      a.prototype.constructor = a
      a.wc = function (d, e, f) {
        for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++)
          g[h - 2] = arguments[h]
        return b.prototype[e].apply(d, g)
      }
    }
    function Ba(a) {
      if (Error.captureStackTrace) Error.captureStackTrace(this, Ba)
      else {
        var b = Error().stack
        b && (this.stack = b)
      }
      a && (this.message = String(a))
    }
    w(Ba, Error)
    Ba.prototype.name = 'CustomError'
    var Da
    function Ea(a, b) {
      a = a.split('%s')
      for (var c = '', d = a.length - 1, e = 0; e < d; e++) c += a[e] + (e < b.length ? b[e] : '%s')
      Ba.call(this, c + a[d])
    }
    w(Ea, Ba)
    Ea.prototype.name = 'AssertionError'
    function Fa(a, b) {
      throw new Ea('Failure' + (a ? ': ' + a : ''), Array.prototype.slice.call(arguments, 1))
    }
    var Ga = Array.prototype.indexOf
        ? function (a, b) {
            return Array.prototype.indexOf.call(a, b, void 0)
          }
        : function (a, b) {
            if (q(a)) return q(b) && 1 == b.length ? a.indexOf(b, 0) : -1
            for (var c = 0; c < a.length; c++) if (c in a && a[c] === b) return c
            return -1
          },
      Ha = Array.prototype.forEach
        ? function (a, b, c) {
            Array.prototype.forEach.call(a, b, c)
          }
        : function (a, b, c) {
            for (var d = a.length, e = q(a) ? a.split('') : a, f = 0; f < d; f++)
              f in e && b.call(c, e[f], f, a)
          }
    function Ia(a, b) {
      for (var c = q(a) ? a.split('') : a, d = a.length - 1; 0 <= d; --d)
        d in c && b.call(void 0, c[d], d, a)
    }
    var Ja = Array.prototype.filter
        ? function (a, b) {
            return Array.prototype.filter.call(a, b, void 0)
          }
        : function (a, b) {
            for (var c = a.length, d = [], e = 0, f = q(a) ? a.split('') : a, g = 0; g < c; g++)
              if (g in f) {
                var h = f[g]
                b.call(void 0, h, g, a) && (d[e++] = h)
              }
            return d
          },
      Ka = Array.prototype.map
        ? function (a, b) {
            return Array.prototype.map.call(a, b, void 0)
          }
        : function (a, b) {
            for (var c = a.length, d = Array(c), e = q(a) ? a.split('') : a, f = 0; f < c; f++)
              f in e && (d[f] = b.call(void 0, e[f], f, a))
            return d
          },
      La = Array.prototype.some
        ? function (a, b) {
            return Array.prototype.some.call(a, b, void 0)
          }
        : function (a, b) {
            for (var c = a.length, d = q(a) ? a.split('') : a, e = 0; e < c; e++)
              if (e in d && b.call(void 0, d[e], e, a)) return !0
            return !1
          }
    function Ma(a, b) {
      return 0 <= Ga(a, b)
    }
    function Na(a, b) {
      b = Ga(a, b)
      var c
      ;(c = 0 <= b) && Oa(a, b)
      return c
    }
    function Oa(a, b) {
      return 1 == Array.prototype.splice.call(a, b, 1).length
    }
    function Pa(a, b) {
      a: {
        for (var c = a.length, d = q(a) ? a.split('') : a, e = 0; e < c; e++)
          if (e in d && b.call(void 0, d[e], e, a)) {
            b = e
            break a
          }
        b = -1
      }
      0 <= b && Oa(a, b)
    }
    function Qa(a, b) {
      var c = 0
      Ia(a, function (d, e) {
        b.call(void 0, d, e, a) && Oa(a, e) && c++
      })
    }
    function Ra(a) {
      return Array.prototype.concat.apply([], arguments)
    }
    function Sa(a) {
      var b = a.length
      if (0 < b) {
        for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d]
        return c
      }
      return []
    }
    function Ta(a, b, c) {
      return 2 >= arguments.length
        ? Array.prototype.slice.call(a, b)
        : Array.prototype.slice.call(a, b, c)
    }
    var Ua = String.prototype.trim
        ? function (a) {
            return a.trim()
          }
        : function (a) {
            return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
          },
      Va = /&/g,
      Wa = /</g,
      Xa = />/g,
      Ya = /"/g,
      Za = /'/g,
      $a = /\x00/g,
      ab = /[\x00&<>"']/
    function bb(a, b) {
      return a < b ? -1 : a > b ? 1 : 0
    }
    function cb(a) {
      ab.test(a) &&
        (-1 != a.indexOf('&') && (a = a.replace(Va, '&amp;')),
        -1 != a.indexOf('<') && (a = a.replace(Wa, '&lt;')),
        -1 != a.indexOf('>') && (a = a.replace(Xa, '&gt;')),
        -1 != a.indexOf('"') && (a = a.replace(Ya, '&quot;')),
        -1 != a.indexOf("'") && (a = a.replace(Za, '&#39;')),
        -1 != a.indexOf('\x00') && (a = a.replace($a, '&#0;')))
      return a
    }
    function db(a, b, c) {
      for (var d in a) b.call(c, a[d], d, a)
    }
    function eb(a) {
      var b = {},
        c
      for (c in a) b[c] = a[c]
      return b
    }
    var fb =
      'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(
        ' '
      )
    function gb(a, b) {
      for (var c, d, e = 1; e < arguments.length; e++) {
        d = arguments[e]
        for (c in d) a[c] = d[c]
        for (var f = 0; f < fb.length; f++)
          (c = fb[f]), Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
      }
    }
    var hb = 'StopIteration' in n ? n.StopIteration : { message: 'StopIteration', stack: '' }
    function ib() {}
    ib.prototype.next = function () {
      throw hb
    }
    ib.prototype.ha = function () {
      return this
    }
    function jb(a) {
      if (a instanceof ib) return a
      if ('function' == typeof a.ha) return a.ha(!1)
      if (ra(a)) {
        var b = 0,
          c = new ib()
        c.next = function () {
          for (;;) {
            if (b >= a.length) throw hb
            if (b in a) return a[b++]
            b++
          }
        }
        return c
      }
      throw Error('Not implemented')
    }
    function kb(a, b) {
      if (ra(a))
        try {
          Ha(a, b, void 0)
        } catch (c) {
          if (c !== hb) throw c
        }
      else {
        a = jb(a)
        try {
          for (;;) b.call(void 0, a.next(), void 0, a)
        } catch (c$1) {
          if (c$1 !== hb) throw c$1
        }
      }
    }
    function lb(a) {
      if (ra(a)) return Sa(a)
      a = jb(a)
      var b = []
      kb(a, function (c) {
        b.push(c)
      })
      return b
    }
    function mb(a, b) {
      this.g = {}
      this.a = []
      this.j = this.h = 0
      var c = arguments.length
      if (1 < c) {
        if (c % 2) throw Error('Uneven number of arguments')
        for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
      } else if (a)
        if (a instanceof mb) for (c = a.ja(), d = 0; d < c.length; d++) this.set(c[d], a.get(c[d]))
        else for (d in a) this.set(d, a[d])
    }
    l = mb.prototype
    l.la = function () {
      nb(this)
      for (var a = [], b = 0; b < this.a.length; b++) a.push(this.g[this.a[b]])
      return a
    }
    l.ja = function () {
      nb(this)
      return this.a.concat()
    }
    l.clear = function () {
      this.g = {}
      this.j = this.h = this.a.length = 0
    }
    function nb(a) {
      if (a.h != a.a.length) {
        for (var b = 0, c = 0; b < a.a.length; ) {
          var d = a.a[b]
          ob(a.g, d) && (a.a[c++] = d)
          b++
        }
        a.a.length = c
      }
      if (a.h != a.a.length) {
        var e = {}
        for (c = b = 0; b < a.a.length; )
          (d = a.a[b]), ob(e, d) || ((a.a[c++] = d), (e[d] = 1)), b++
        a.a.length = c
      }
    }
    l.get = function (a, b) {
      return ob(this.g, a) ? this.g[a] : b
    }
    l.set = function (a, b) {
      ob(this.g, a) || (this.h++, this.a.push(a), this.j++)
      this.g[a] = b
    }
    l.forEach = function (a, b) {
      for (var c = this.ja(), d = 0; d < c.length; d++) {
        var e = c[d],
          f = this.get(e)
        a.call(b, f, e, this)
      }
    }
    l.ha = function (a) {
      nb(this)
      var b = 0,
        c = this.j,
        d = this,
        e = new ib()
      e.next = function () {
        if (c != d.j) throw Error('The map has changed since the iterator was created')
        if (b >= d.a.length) throw hb
        var f = d.a[b++]
        return a ? f : d.g[f]
      }
      return e
    }
    function ob(a, b) {
      return Object.prototype.hasOwnProperty.call(a, b)
    }
    var pb =
      /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/
    function qb(a, b) {
      if (a) {
        a = a.split('&')
        for (var c = 0; c < a.length; c++) {
          var d = a[c].indexOf('='),
            e = null
          if (0 <= d) {
            var f = a[c].substring(0, d)
            e = a[c].substring(d + 1)
          } else f = a[c]
          b(f, e ? decodeURIComponent(e.replace(/\+/g, ' ')) : '')
        }
      }
    }
    function rb(a, b, c, d) {
      for (var e = c.length; 0 <= (b = a.indexOf(c, b)) && b < d; ) {
        var f = a.charCodeAt(b - 1)
        if (38 == f || 63 == f)
          if (((f = a.charCodeAt(b + e)), !f || 61 == f || 38 == f || 35 == f)) return b
        b += e + 1
      }
      return -1
    }
    var sb = /#|$/
    function tb(a, b) {
      var c = a.search(sb),
        d = rb(a, 0, b, c)
      if (0 > d) return null
      var e = a.indexOf('&', d)
      if (0 > e || e > c) e = c
      d += b.length + 1
      return decodeURIComponent(a.substr(d, e - d).replace(/\+/g, ' '))
    }
    var ub = /[?&]($|#)/
    function vb(a, b) {
      this.h = this.A = this.j = ''
      this.C = null
      this.s = this.g = ''
      this.i = !1
      var c
      a instanceof vb
        ? ((this.i = ka(b) ? b : a.i),
          wb(this, a.j),
          (this.A = a.A),
          (this.h = a.h),
          xb(this, a.C),
          (this.g = a.g),
          yb(this, zb(a.a)),
          (this.s = a.s))
        : a && (c = String(a).match(pb))
        ? ((this.i = !!b),
          wb(this, c[1] || '', !0),
          (this.A = Ab(c[2] || '')),
          (this.h = Ab(c[3] || '', !0)),
          xb(this, c[4]),
          (this.g = Ab(c[5] || '', !0)),
          yb(this, c[6] || '', !0),
          (this.s = Ab(c[7] || '')))
        : ((this.i = !!b), (this.a = new Bb(null, this.i)))
    }
    vb.prototype.toString = function () {
      var a = [],
        b = this.j
      b && a.push(Cb(b, Db, !0), ':')
      var c = this.h
      if (c || 'file' == b)
        a.push('//'),
          (b = this.A) && a.push(Cb(b, Db, !0), '@'),
          a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
          (c = this.C),
          null != c && a.push(':', String(c))
      if ((c = this.g))
        this.h && '/' != c.charAt(0) && a.push('/'), a.push(Cb(c, '/' == c.charAt(0) ? Eb : Fb, !0))
      ;(c = this.a.toString()) && a.push('?', c)
      ;(c = this.s) && a.push('#', Cb(c, Gb))
      return a.join('')
    }
    function wb(a, b, c) {
      a.j = c ? Ab(b, !0) : b
      a.j && (a.j = a.j.replace(/:$/, ''))
    }
    function xb(a, b) {
      if (b) {
        b = Number(b)
        if (isNaN(b) || 0 > b) throw Error('Bad port number ' + b)
        a.C = b
      } else a.C = null
    }
    function yb(a, b, c) {
      b instanceof Bb ? ((a.a = b), Hb(a.a, a.i)) : (c || (b = Cb(b, Ib)), (a.a = new Bb(b, a.i)))
    }
    function Jb(a) {
      return a instanceof vb ? new vb(a) : new vb(a, void 0)
    }
    function Ab(a, b) {
      return a ? (b ? decodeURI(a.replace(/%25/g, '%2525')) : decodeURIComponent(a)) : ''
    }
    function Cb(a, b, c) {
      return q(a)
        ? ((a = encodeURI(a).replace(b, Kb)),
          c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
          a)
        : null
    }
    function Kb(a) {
      a = a.charCodeAt(0)
      return '%' + ((a >> 4) & 15).toString(16) + (a & 15).toString(16)
    }
    var Db = /[#\/\?@]/g,
      Fb = /[#\?:]/g,
      Eb = /[#\?]/g,
      Ib = /[#\?@]/g,
      Gb = /#/g
    function Bb(a, b) {
      this.g = this.a = null
      this.h = a || null
      this.j = !!b
    }
    function Lb(a) {
      a.a ||
        ((a.a = new mb()),
        (a.g = 0),
        a.h &&
          qb(a.h, function (b, c) {
            a.add(decodeURIComponent(b.replace(/\+/g, ' ')), c)
          }))
    }
    l = Bb.prototype
    l.add = function (a, b) {
      Lb(this)
      this.h = null
      a = Mb(this, a)
      var c = this.a.get(a)
      c || this.a.set(a, (c = []))
      c.push(b)
      this.g += 1
      return this
    }
    function Nb(a, b) {
      Lb(a)
      b = Mb(a, b)
      ob(a.a.g, b) &&
        ((a.h = null),
        (a.g -= a.a.get(b).length),
        (a = a.a),
        ob(a.g, b) && (delete a.g[b], a.h--, a.j++, a.a.length > 2 * a.h && nb(a)))
    }
    l.clear = function () {
      this.a = this.h = null
      this.g = 0
    }
    function Ob(a, b) {
      Lb(a)
      b = Mb(a, b)
      return ob(a.a.g, b)
    }
    l.forEach = function (a, b) {
      Lb(this)
      this.a.forEach(function (c, d) {
        Ha(
          c,
          function (e) {
            a.call(b, e, d, this)
          },
          this
        )
      }, this)
    }
    l.ja = function () {
      Lb(this)
      for (var a = this.a.la(), b = this.a.ja(), c = [], d = 0; d < b.length; d++)
        for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d])
      return c
    }
    l.la = function (a) {
      Lb(this)
      var b = []
      if (q(a)) Ob(this, a) && (b = Ra(b, this.a.get(Mb(this, a))))
      else {
        a = this.a.la()
        for (var c = 0; c < a.length; c++) b = Ra(b, a[c])
      }
      return b
    }
    l.set = function (a, b) {
      Lb(this)
      this.h = null
      a = Mb(this, a)
      Ob(this, a) && (this.g -= this.a.get(a).length)
      this.a.set(a, [b])
      this.g += 1
      return this
    }
    l.get = function (a, b) {
      if (!a) return b
      a = this.la(a)
      return 0 < a.length ? String(a[0]) : b
    }
    l.toString = function () {
      if (this.h) return this.h
      if (!this.a) return ''
      for (var a = [], b = this.a.ja(), c = 0; c < b.length; c++) {
        var d = b[c],
          e = encodeURIComponent(String(d))
        d = this.la(d)
        for (var f = 0; f < d.length; f++) {
          var g = e
          '' !== d[f] && (g += '=' + encodeURIComponent(String(d[f])))
          a.push(g)
        }
      }
      return (this.h = a.join('&'))
    }
    function zb(a) {
      var b = new Bb()
      b.h = a.h
      a.a && ((b.a = new mb(a.a)), (b.g = a.g))
      return b
    }
    function Mb(a, b) {
      b = String(b)
      a.j && (b = b.toLowerCase())
      return b
    }
    function Hb(a, b) {
      b &&
        !a.j &&
        (Lb(a),
        (a.h = null),
        a.a.forEach(function (c, d) {
          var e = d.toLowerCase()
          d != e &&
            (Nb(this, d),
            Nb(this, e),
            0 < c.length && ((this.h = null), this.a.set(Mb(this, e), Sa(c)), (this.g += c.length)))
        }, a))
      a.j = b
    }
    function Pb(a) {
      this.a = Jb(a)
    }
    function Qb(a, b) {
      b ? a.a.a.set(x.Sa, b) : Nb(a.a.a, x.Sa)
    }
    function Rb(a, b) {
      null !== b ? a.a.a.set(x.Qa, b ? '1' : '0') : Nb(a.a.a, x.Qa)
    }
    function Sb(a) {
      return a.a.a.get(x.Pa) || null
    }
    function Tb(a, b) {
      b ? a.a.a.set(x.PROVIDER_ID, b) : Nb(a.a.a, x.PROVIDER_ID)
    }
    Pb.prototype.toString = function () {
      return this.a.toString()
    }
    var x = {
      Pa: 'ui_auid',
      mc: 'apiKey',
      Qa: 'ui_sd',
      ub: 'mode',
      $a: 'oobCode',
      PROVIDER_ID: 'ui_pid',
      Sa: 'ui_sid',
      vb: 'tenantId',
    }
    var Ub
    a: {
      var Vb = n.navigator
      if (Vb) {
        var Wb = Vb.userAgent
        if (Wb) {
          Ub = Wb
          break a
        }
      }
      Ub = ''
    }
    function y(a) {
      return -1 != Ub.indexOf(a)
    }
    function Xb() {
      return (y('Chrome') || y('CriOS')) && !y('Edge')
    }
    function Yb(a) {
      Yb[' '](a)
      return a
    }
    Yb[' '] = na
    function Zb(a, b) {
      var c = $b
      return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : (c[a] = b(a))
    }
    var ac = y('Opera'),
      z = y('Trident') || y('MSIE'),
      bc = y('Edge'),
      cc = bc || z,
      dc =
        y('Gecko') &&
        !(-1 != Ub.toLowerCase().indexOf('webkit') && !y('Edge')) &&
        !(y('Trident') || y('MSIE')) &&
        !y('Edge'),
      ec = -1 != Ub.toLowerCase().indexOf('webkit') && !y('Edge'),
      fc = ec && y('Mobile'),
      gc = y('Macintosh')
    function hc() {
      var a = n.document
      return a ? a.documentMode : void 0
    }
    var ic
    a: {
      var jc = '',
        kc = (function () {
          var a = Ub
          if (dc) return /rv:([^\);]+)(\)|;)/.exec(a)
          if (bc) return /Edge\/([\d\.]+)/.exec(a)
          if (z) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a)
          if (ec) return /WebKit\/(\S+)/.exec(a)
          if (ac) return /(?:Version)[ \/]?(\S+)/.exec(a)
        })()
      kc && (jc = kc ? kc[1] : '')
      if (z) {
        var lc = hc()
        if (null != lc && lc > parseFloat(jc)) {
          ic = String(lc)
          break a
        }
      }
      ic = jc
    }
    var $b = {}
    function mc(a) {
      return Zb(a, function () {
        for (
          var b = 0,
            c = Ua(String(ic)).split('.'),
            d = Ua(String(a)).split('.'),
            e = Math.max(c.length, d.length),
            f = 0;
          0 == b && f < e;
          f++
        ) {
          var g = c[f] || '',
            h = d[f] || ''
          do {
            g = /(\d*)(\D*)(.*)/.exec(g) || ['', '', '', '']
            h = /(\d*)(\D*)(.*)/.exec(h) || ['', '', '', '']
            if (0 == g[0].length && 0 == h[0].length) break
            b =
              bb(
                0 == g[1].length ? 0 : parseInt(g[1], 10),
                0 == h[1].length ? 0 : parseInt(h[1], 10)
              ) ||
              bb(0 == g[2].length, 0 == h[2].length) ||
              bb(g[2], h[2])
            g = g[3]
            h = h[3]
          } while (0 == b)
        }
        return 0 <= b
      })
    }
    var nc
    var oc = n.document
    nc = oc && z ? hc() || ('CSS1Compat' == oc.compatMode ? parseInt(ic, 10) : 5) : void 0
    function pc(a, b) {
      this.a = (a === qc && b) || ''
      this.g = rc
    }
    pc.prototype.ma = !0
    pc.prototype.ka = function () {
      return this.a
    }
    pc.prototype.toString = function () {
      return 'Const{' + this.a + '}'
    }
    var rc = {},
      qc = {}
    function sc() {
      this.a = ''
      this.h = tc
    }
    sc.prototype.ma = !0
    sc.prototype.ka = function () {
      return this.a.toString()
    }
    sc.prototype.g = function () {
      return 1
    }
    sc.prototype.toString = function () {
      return 'TrustedResourceUrl{' + this.a + '}'
    }
    function uc(a) {
      if (a instanceof sc && a.constructor === sc && a.h === tc) return a.a
      Fa("expected object of type TrustedResourceUrl, got '" + a + "' of type " + pa(a))
      return 'type_error:TrustedResourceUrl'
    }
    function vc() {
      var a = wc
      a instanceof pc && a.constructor === pc && a.g === rc
        ? (a = a.a)
        : (Fa("expected object of type Const, got '" + a + "'"), (a = 'type_error:Const'))
      var b = new sc()
      b.a = a
      return b
    }
    var tc = {}
    function xc() {
      this.a = ''
      this.h = yc
    }
    xc.prototype.ma = !0
    xc.prototype.ka = function () {
      return this.a.toString()
    }
    xc.prototype.g = function () {
      return 1
    }
    xc.prototype.toString = function () {
      return 'SafeUrl{' + this.a + '}'
    }
    function zc(a) {
      if (a instanceof xc && a.constructor === xc && a.h === yc) return a.a
      Fa("expected object of type SafeUrl, got '" + a + "' of type " + pa(a))
      return 'type_error:SafeUrl'
    }
    var Ac = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i
    function Bc(a) {
      if (a instanceof xc) return a
      a = 'object' == typeof a && a.ma ? a.ka() : String(a)
      Ac.test(a) || (a = 'about:invalid#zClosurez')
      return Cc(a)
    }
    function Dc(a) {
      if (a instanceof xc) return a
      a = 'object' == typeof a && a.ma ? a.ka() : String(a)
      Ac.test(a) || (a = 'about:invalid#zClosurez')
      return Cc(a)
    }
    var yc = {}
    function Cc(a) {
      var b = new xc()
      b.a = a
      return b
    }
    Cc('about:blank')
    function Ec() {
      this.a = ''
      this.g = Fc
    }
    Ec.prototype.ma = !0
    var Fc = {}
    Ec.prototype.ka = function () {
      return this.a
    }
    Ec.prototype.toString = function () {
      return 'SafeStyle{' + this.a + '}'
    }
    function Gc() {
      this.a = ''
      this.j = Hc
      this.h = null
    }
    Gc.prototype.g = function () {
      return this.h
    }
    Gc.prototype.ma = !0
    Gc.prototype.ka = function () {
      return this.a.toString()
    }
    Gc.prototype.toString = function () {
      return 'SafeHtml{' + this.a + '}'
    }
    function Ic(a) {
      if (a instanceof Gc && a.constructor === Gc && a.j === Hc) return a.a
      Fa("expected object of type SafeHtml, got '" + a + "' of type " + pa(a))
      return 'type_error:SafeHtml'
    }
    var Hc = {}
    function Jc(a, b) {
      var c = new Gc()
      c.a = a
      c.h = b
      return c
    }
    Jc('<!DOCTYPE html>', 0)
    var Kc = Jc('', 0)
    Jc('<br>', 0)
    var Lc = (function (a) {
      var b = !1,
        c
      return function () {
        b || ((c = a()), (b = !0))
        return c
      }
    })(function () {
      if ('undefined' === typeof document) return !1
      var a = document.createElement('div'),
        b = document.createElement('div')
      b.appendChild(document.createElement('div'))
      a.appendChild(b)
      if (!a.firstChild) return !1
      b = a.firstChild.firstChild
      a.innerHTML = Ic(Kc)
      return !b.parentElement
    })
    function Mc(a, b) {
      a.src = uc(b)
      if (null === ma)
        b: {
          b = n.document
          if (
            (b = b.querySelector && b.querySelector('script[nonce]')) &&
            (b = b.nonce || b.getAttribute('nonce')) &&
            la.test(b)
          ) {
            ma = b
            break b
          }
          ma = ''
        }
      b = ma
      b && a.setAttribute('nonce', b)
    }
    function Nc(a, b) {
      b = b instanceof xc ? b : Dc(b)
      a.assign(zc(b))
    }
    function Oc(a, b) {
      this.a = ka(a) ? a : 0
      this.g = ka(b) ? b : 0
    }
    Oc.prototype.toString = function () {
      return '(' + this.a + ', ' + this.g + ')'
    }
    Oc.prototype.ceil = function () {
      this.a = Math.ceil(this.a)
      this.g = Math.ceil(this.g)
      return this
    }
    Oc.prototype.floor = function () {
      this.a = Math.floor(this.a)
      this.g = Math.floor(this.g)
      return this
    }
    Oc.prototype.round = function () {
      this.a = Math.round(this.a)
      this.g = Math.round(this.g)
      return this
    }
    function Pc(a, b) {
      this.width = a
      this.height = b
    }
    l = Pc.prototype
    l.toString = function () {
      return '(' + this.width + ' x ' + this.height + ')'
    }
    l.aspectRatio = function () {
      return this.width / this.height
    }
    l.ceil = function () {
      this.width = Math.ceil(this.width)
      this.height = Math.ceil(this.height)
      return this
    }
    l.floor = function () {
      this.width = Math.floor(this.width)
      this.height = Math.floor(this.height)
      return this
    }
    l.round = function () {
      this.width = Math.round(this.width)
      this.height = Math.round(this.height)
      return this
    }
    function Qc(a) {
      return a ? new Rc(Sc(a)) : Da || (Da = new Rc())
    }
    function Tc(a, b) {
      var c = b || document
      return c.querySelectorAll && c.querySelector
        ? c.querySelectorAll('.' + a)
        : Uc(document, a, b)
    }
    function Vc(a, b) {
      var c = b || document
      if (c.getElementsByClassName) a = c.getElementsByClassName(a)[0]
      else {
        c = document
        var d = b || c
        a =
          d.querySelectorAll && d.querySelector && a
            ? d.querySelector(a ? '.' + a : '')
            : Uc(c, a, b)[0] || null
      }
      return a || null
    }
    function Uc(a, b, c) {
      var d
      a = c || a
      if (a.querySelectorAll && a.querySelector && b) return a.querySelectorAll(b ? '.' + b : '')
      if (b && a.getElementsByClassName) {
        var e = a.getElementsByClassName(b)
        return e
      }
      e = a.getElementsByTagName('*')
      if (b) {
        var f = {}
        for (c = d = 0; (a = e[c]); c++) {
          var g = a.className
          'function' == typeof g.split && Ma(g.split(/\s+/), b) && (f[d++] = a)
        }
        f.length = d
        return f
      }
      return e
    }
    function Wc(a, b) {
      db(b, function (c, d) {
        c && 'object' == typeof c && c.ma && (c = c.ka())
        'style' == d
          ? (a.style.cssText = c)
          : 'class' == d
          ? (a.className = c)
          : 'for' == d
          ? (a.htmlFor = c)
          : Xc.hasOwnProperty(d)
          ? a.setAttribute(Xc[d], c)
          : 0 == d.lastIndexOf('aria-', 0) || 0 == d.lastIndexOf('data-', 0)
          ? a.setAttribute(d, c)
          : (a[d] = c)
      })
    }
    var Xc = {
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing',
      colspan: 'colSpan',
      frameborder: 'frameBorder',
      height: 'height',
      maxlength: 'maxLength',
      nonce: 'nonce',
      role: 'role',
      rowspan: 'rowSpan',
      type: 'type',
      usemap: 'useMap',
      valign: 'vAlign',
      width: 'width',
    }
    function Yc(a) {
      return a.scrollingElement
        ? a.scrollingElement
        : ec || 'CSS1Compat' != a.compatMode
        ? a.body || a.documentElement
        : a.documentElement
    }
    function Zc(a) {
      a && a.parentNode && a.parentNode.removeChild(a)
    }
    function Sc(a) {
      return 9 == a.nodeType ? a : a.ownerDocument || a.document
    }
    function $c(a, b) {
      if ('textContent' in a) a.textContent = b
      else if (3 == a.nodeType) a.data = String(b)
      else if (a.firstChild && 3 == a.firstChild.nodeType) {
        for (; a.lastChild != a.firstChild; ) a.removeChild(a.lastChild)
        a.firstChild.data = String(b)
      } else {
        for (var c; (c = a.firstChild); ) a.removeChild(c)
        a.appendChild(Sc(a).createTextNode(String(b)))
      }
    }
    function ad(a, b) {
      return b
        ? bd(a, function (c) {
            return !b || (q(c.className) && Ma(c.className.split(/\s+/), b))
          })
        : null
    }
    function bd(a, b) {
      for (var c = 0; a; ) {
        if (b(a)) return a
        a = a.parentNode
        c++
      }
      return null
    }
    function Rc(a) {
      this.a = a || n.document || document
    }
    Rc.prototype.N = function () {
      return q(void 0) ? this.a.getElementById(void 0) : void 0
    }
    var cd = { Gc: !0 },
      dd = { Ic: !0 },
      ed = { Fc: !0 },
      fd = { Hc: !0 }
    function gd() {
      throw Error('Do not instantiate directly')
    }
    gd.prototype.va = null
    gd.prototype.toString = function () {
      return this.content
    }
    function hd(a, b, c, d) {
      a = a(b || id, void 0, c)
      d = (d || Qc()).a.createElement('DIV')
      a = jd(a)
      a.match(kd)
      a = Jc(a, null)
      if (Lc()) for (; d.lastChild; ) d.removeChild(d.lastChild)
      d.innerHTML = Ic(a)
      1 == d.childNodes.length && ((a = d.firstChild), 1 == a.nodeType && (d = a))
      return d
    }
    function jd(a) {
      if (!ta(a)) return cb(String(a))
      if (a instanceof gd) {
        if (a.fa === cd) return a.content
        if (a.fa === fd) return cb(a.content)
      }
      Fa('Soy template output is unsafe for use as HTML: ' + a)
      return 'zSoyz'
    }
    var kd = /^<(body|caption|col|colgroup|head|html|tr|td|th|tbody|thead|tfoot)>/i,
      id = {}
    function ld(a) {
      if (null != a)
        switch (a.va) {
          case 1:
            return 1
          case -1:
            return -1
          case 0:
            return 0
        }
      return null
    }
    function od() {
      gd.call(this)
    }
    w(od, gd)
    od.prototype.fa = cd
    function A(a) {
      return null != a && a.fa === cd
        ? a
        : a instanceof Gc
        ? B(Ic(a).toString(), a.g())
        : B(cb(String(String(a))), ld(a))
    }
    function pd() {
      gd.call(this)
    }
    w(pd, gd)
    pd.prototype.fa = dd
    pd.prototype.va = 1
    function qd(a, b) {
      this.content = String(a)
      this.va = null != b ? b : null
    }
    w(qd, gd)
    qd.prototype.fa = fd
    function C(a) {
      return new qd(a, void 0)
    }
    var B = (function (a) {
        function b(c) {
          this.content = c
        }
        b.prototype = a.prototype
        return function (c, d) {
          c = new b(String(c))
          void 0 !== d && (c.va = d)
          return c
        }
      })(od),
      rd = (function (a) {
        function b(c) {
          this.content = c
        }
        b.prototype = a.prototype
        return function (c) {
          return new b(String(c))
        }
      })(pd)
    function sd(a) {
      function b() {}
      var c = { label: D('New password') }
      b.prototype = a
      a = new b()
      for (var d in c) a[d] = c[d]
      return a
    }
    function D(a) {
      return (a = String(a)) ? new qd(a, void 0) : ''
    }
    var td = (function (a) {
      function b(c) {
        this.content = c
      }
      b.prototype = a.prototype
      return function (c, d) {
        c = String(c)
        if (!c) return ''
        c = new b(c)
        void 0 !== d && (c.va = d)
        return c
      }
    })(od)
    function ud(a) {
      return null != a && a.fa === cd
        ? String(String(a.content).replace(vd, '').replace(wd, '&lt;')).replace(xd, yd)
        : cb(String(a))
    }
    function zd(a) {
      null != a && a.fa === dd
        ? (a = String(a).replace(Ad, Bd))
        : a instanceof xc
        ? (a = String(zc(a).toString()).replace(Ad, Bd))
        : ((a = String(a)),
          Cd.test(a)
            ? (a = a.replace(Ad, Bd))
            : (Fa('Bad value `%s` for |filterNormalizeUri', [a]), (a = '#zSoyz')))
      return a
    }
    function Dd(a) {
      null != a && a.fa === ed
        ? (a = a.content)
        : null == a
        ? (a = '')
        : a instanceof Ec
        ? a instanceof Ec && a.constructor === Ec && a.g === Fc
          ? (a = a.a)
          : (Fa("expected object of type SafeStyle, got '" + a + "' of type " + pa(a)),
            (a = 'type_error:SafeStyle'))
        : ((a = String(a)),
          Ed.test(a) || (Fa('Bad value `%s` for |filterCssValue', [a]), (a = 'zSoyz')))
      return a
    }
    var Fd = {
      '\x00': '&#0;',
      '\t': '&#9;',
      '\n': '&#10;',
      '\x0B': '&#11;',
      '\f': '&#12;',
      '\r': '&#13;',
      ' ': '&#32;',
      '"': '&quot;',
      '&': '&amp;',
      "'": '&#39;',
      '-': '&#45;',
      '/': '&#47;',
      '<': '&lt;',
      '=': '&#61;',
      '>': '&gt;',
      '`': '&#96;',
      '\u0085': '&#133;',
      '\u00a0': '&#160;',
      '\u2028': '&#8232;',
      '\u2029': '&#8233;',
    }
    function yd(a) {
      return Fd[a]
    }
    var Gd = {
      '\x00': '%00',
      '\u0001': '%01',
      '\u0002': '%02',
      '\u0003': '%03',
      '\u0004': '%04',
      '\u0005': '%05',
      '\u0006': '%06',
      '\u0007': '%07',
      '\b': '%08',
      '\t': '%09',
      '\n': '%0A',
      '\x0B': '%0B',
      '\f': '%0C',
      '\r': '%0D',
      '\u000e': '%0E',
      '\u000f': '%0F',
      '\u0010': '%10',
      '\u0011': '%11',
      '\u0012': '%12',
      '\u0013': '%13',
      '\u0014': '%14',
      '\u0015': '%15',
      '\u0016': '%16',
      '\u0017': '%17',
      '\u0018': '%18',
      '\u0019': '%19',
      '\u001a': '%1A',
      '\u001b': '%1B',
      '\u001c': '%1C',
      '\u001d': '%1D',
      '\u001e': '%1E',
      '\u001f': '%1F',
      ' ': '%20',
      '"': '%22',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '<': '%3C',
      '>': '%3E',
      '\\': '%5C',
      '{': '%7B',
      '}': '%7D',
      '\u007f': '%7F',
      '\u0085': '%C2%85',
      '\u00a0': '%C2%A0',
      '\u2028': '%E2%80%A8',
      '\u2029': '%E2%80%A9',
      '\uff01': '%EF%BC%81',
      '\uff03': '%EF%BC%83',
      '\uff04': '%EF%BC%84',
      '\uff06': '%EF%BC%86',
      '\uff07': '%EF%BC%87',
      '\uff08': '%EF%BC%88',
      '\uff09': '%EF%BC%89',
      '\uff0a': '%EF%BC%8A',
      '\uff0b': '%EF%BC%8B',
      '\uff0c': '%EF%BC%8C',
      '\uff0f': '%EF%BC%8F',
      '\uff1a': '%EF%BC%9A',
      '\uff1b': '%EF%BC%9B',
      '\uff1d': '%EF%BC%9D',
      '\uff1f': '%EF%BC%9F',
      '\uff20': '%EF%BC%A0',
      '\uff3b': '%EF%BC%BB',
      '\uff3d': '%EF%BC%BD',
    }
    function Bd(a) {
      return Gd[a]
    }
    var xd = /[\x00\x22\x27\x3c\x3e]/g,
      Ad =
        /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g,
      Ed =
        /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i,
      Cd = /^(?![^#?]*\/(?:\.|%2E){2}(?:[\/?#]|$))(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i,
      vd = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g,
      wd = /</g
    function Hd() {
      return C('Enter a valid phone number')
    }
    function Id() {
      return C('Unable to send password reset code to specified email')
    }
    function Jd() {
      return C('Something went wrong. Please try again.')
    }
    function Kd() {
      return C(
        'This email already exists without any means of sign-in. Please reset the password to recover.'
      )
    }
    function Ld(a) {
      a = a || {}
      var b = ''
      switch (a.code) {
        case 'invalid-argument':
          b += 'Client specified an invalid argument.'
          break
        case 'invalid-configuration':
          b += 'Client specified an invalid project configuration.'
          break
        case 'failed-precondition':
          b += 'Request can not be executed in the current system state.'
          break
        case 'out-of-range':
          b += 'Client specified an invalid range.'
          break
        case 'unauthenticated':
          b += 'Request not authenticated due to missing, invalid, or expired OAuth token.'
          break
        case 'permission-denied':
          b += 'Client does not have sufficient permission.'
          break
        case 'not-found':
          b += 'Specified resource is not found.'
          break
        case 'aborted':
          b += 'Concurrency conflict, such as read-modify-write conflict.'
          break
        case 'already-exists':
          b += 'The resource that a client tried to create already exists.'
          break
        case 'resource-exhausted':
          b += 'Either out of resource quota or reaching rate limiting.'
          break
        case 'cancelled':
          b += 'Request cancelled by the client.'
          break
        case 'data-loss':
          b += 'Unrecoverable data loss or data corruption.'
          break
        case 'unknown':
          b += 'Unknown server error.'
          break
        case 'internal':
          b += 'Internal server error.'
          break
        case 'not-implemented':
          b += 'API method not implemented by the server.'
          break
        case 'unavailable':
          b += 'Service unavailable.'
          break
        case 'deadline-exceeded':
          b += 'Request deadline exceeded.'
          break
        case 'auth/user-disabled':
          b += 'The user account has been disabled by an administrator.'
          break
        case 'auth/timeout':
          b += 'The operation has timed out.'
          break
        case 'auth/too-many-requests':
          b +=
            'We have blocked all requests from this device due to unusual activity. Try again later.'
          break
        case 'auth/quota-exceeded':
          b += 'The quota for this operation has been exceeded. Try again later.'
          break
        case 'auth/network-request-failed':
          b += 'A network error has occurred. Try again later.'
          break
        case 'restart-process':
          b +=
            'An issue was encountered when authenticating your request. Please visit the URL that redirected you to this page again to restart the authentication process.'
          break
        case 'no-matching-tenant-for-email':
          b +=
            'No sign-in provider is available for the given email, please try with a different email.'
      }
      return C(b)
    }
    function Md() {
      return C('Please login again to perform this operation')
    }
    function Nd(a, b, c) {
      var d = Error.call(this)
      this.message = d.message
      'stack' in d && (this.stack = d.stack)
      this.code = Od + a
      if (!(a = b)) {
        a = ''
        switch (this.code) {
          case 'firebaseui/merge-conflict':
            a +=
              'The current anonymous user failed to upgrade. The non-anonymous credential is already associated with a different user account.'
            break
          default:
            a += Jd()
        }
        a = C(a).toString()
      }
      this.message = a || ''
      this.credential = c || null
    }
    m(Nd, Error)
    Nd.prototype.toJSON = function () {
      return { code: this.code, message: this.message }
    }
    var Od = 'firebaseui/'
    function Pd() {
      0 != Qd && (Rd[this[ua] || (this[ua] = ++va)] = this)
      this.T = this.T
      this.C = this.C
    }
    var Qd = 0,
      Rd = {}
    Pd.prototype.T = !1
    Pd.prototype.m = function () {
      if (!this.T && ((this.T = !0), this.o(), 0 != Qd)) {
        var a = this[ua] || (this[ua] = ++va)
        if (0 != Qd && this.C && 0 < this.C.length)
          throw Error(
            this +
              " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method."
          )
        delete Rd[a]
      }
    }
    function Sd(a, b) {
      a.T
        ? ka(void 0)
          ? b.call(void 0)
          : b()
        : (a.C || (a.C = []), a.C.push(ka(void 0) ? r(b, void 0) : b))
    }
    Pd.prototype.o = function () {
      if (this.C) for (; this.C.length; ) this.C.shift()()
    }
    function Td(a) {
      a && 'function' == typeof a.m && a.m()
    }
    var Ud =
      Object.freeze ||
      function (a) {
        return a
      }
    var Vd = !z || 9 <= Number(nc),
      Wd = z && !mc('9'),
      Xd = (function () {
        if (!n.addEventListener || !Object.defineProperty) return !1
        var a = !1,
          b = Object.defineProperty({}, 'passive', {
            get: function () {
              a = !0
            },
          })
        try {
          n.addEventListener('test', na, b), n.removeEventListener('test', na, b)
        } catch (c) {}
        return a
      })()
    function Yd(a, b) {
      this.type = a
      this.g = this.target = b
      this.h = !1
      this.qb = !0
    }
    Yd.prototype.stopPropagation = function () {
      this.h = !0
    }
    Yd.prototype.preventDefault = function () {
      this.qb = !1
    }
    function Zd(a, b) {
      Yd.call(this, a ? a.type : '')
      this.relatedTarget = this.g = this.target = null
      this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0
      this.key = ''
      this.j = this.keyCode = 0
      this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1
      this.pointerId = 0
      this.pointerType = ''
      this.a = null
      if (a) {
        var c = (this.type = a.type),
          d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null
        this.target = a.target || a.srcElement
        this.g = b
        if ((b = a.relatedTarget)) {
          if (dc) {
            a: {
              try {
                Yb(b.nodeName)
                var e = !0
                break a
              } catch (f) {}
              e = !1
            }
            e || (b = null)
          }
        } else 'mouseover' == c ? (b = a.fromElement) : 'mouseout' == c && (b = a.toElement)
        this.relatedTarget = b
        d
          ? ((this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX),
            (this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY),
            (this.screenX = d.screenX || 0),
            (this.screenY = d.screenY || 0))
          : ((this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX),
            (this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY),
            (this.screenX = a.screenX || 0),
            (this.screenY = a.screenY || 0))
        this.button = a.button
        this.keyCode = a.keyCode || 0
        this.key = a.key || ''
        this.j = a.charCode || ('keypress' == c ? a.keyCode : 0)
        this.ctrlKey = a.ctrlKey
        this.altKey = a.altKey
        this.shiftKey = a.shiftKey
        this.metaKey = a.metaKey
        this.pointerId = a.pointerId || 0
        this.pointerType = q(a.pointerType) ? a.pointerType : $d[a.pointerType] || ''
        this.a = a
        a.defaultPrevented && this.preventDefault()
      }
    }
    w(Zd, Yd)
    var $d = Ud({ 2: 'touch', 3: 'pen', 4: 'mouse' })
    Zd.prototype.stopPropagation = function () {
      Zd.K.stopPropagation.call(this)
      this.a.stopPropagation ? this.a.stopPropagation() : (this.a.cancelBubble = !0)
    }
    Zd.prototype.preventDefault = function () {
      Zd.K.preventDefault.call(this)
      var a = this.a
      if (a.preventDefault) a.preventDefault()
      else if (((a.returnValue = !1), Wd))
        try {
          if (a.ctrlKey || (112 <= a.keyCode && 123 >= a.keyCode)) a.keyCode = -1
        } catch (b) {}
    }
    var ae = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
      be = 0
    function ce(a, b, c, d, e) {
      this.listener = a
      this.proxy = null
      this.src = b
      this.type = c
      this.capture = !!d
      this.La = e
      this.key = ++be
      this.sa = this.Ia = !1
    }
    function de(a) {
      a.sa = !0
      a.listener = null
      a.proxy = null
      a.src = null
      a.La = null
    }
    function ee(a) {
      this.src = a
      this.a = {}
      this.g = 0
    }
    ee.prototype.add = function (a, b, c, d, e) {
      var f = a.toString()
      a = this.a[f]
      a || ((a = this.a[f] = []), this.g++)
      var g = fe(a, b, d, e)
      ;-1 < g
        ? ((b = a[g]), c || (b.Ia = !1))
        : ((b = new ce(b, this.src, f, !!d, e)), (b.Ia = c), a.push(b))
      return b
    }
    function ge(a, b) {
      var c = b.type
      c in a.a && Na(a.a[c], b) && (de(b), 0 == a.a[c].length && (delete a.a[c], a.g--))
    }
    function fe(a, b, c, d) {
      for (var e = 0; e < a.length; ++e) {
        var f = a[e]
        if (!f.sa && f.listener == b && f.capture == !!c && f.La == d) return e
      }
      return -1
    }
    var he = 'closure_lm_' + ((1e6 * Math.random()) | 0),
      ie = {},
      je = 0
    function ke(a, b, c, d, e) {
      if (d && d.once) return le(a, b, c, d, e)
      if (qa(b)) {
        for (var f = 0; f < b.length; f++) ke(a, b[f], c, d, e)
        return null
      }
      c = me(c)
      return a && a[ae]
        ? a.J.add(String(b), c, !1, ta(d) ? !!d.capture : !!d, e)
        : ne(a, b, c, !1, d, e)
    }
    function ne(a, b, c, d, e, f) {
      if (!b) throw Error('Invalid event type')
      var g = ta(e) ? !!e.capture : !!e,
        h = oe(a)
      h || (a[he] = h = new ee(a))
      c = h.add(b, c, d, g, f)
      if (c.proxy) return c
      d = pe()
      c.proxy = d
      d.src = a
      d.listener = c
      if (a.addEventListener)
        Xd || (e = g), void 0 === e && (e = !1), a.addEventListener(b.toString(), d, e)
      else if (a.attachEvent) a.attachEvent(qe(b.toString()), d)
      else if (a.addListener && a.removeListener) a.addListener(d)
      else throw Error('addEventListener and attachEvent are unavailable.')
      je++
      return c
    }
    function pe() {
      var a = re,
        b = Vd
          ? function (c) {
              return a.call(b.src, b.listener, c)
            }
          : function (c) {
              c = a.call(b.src, b.listener, c)
              if (!c) return c
            }
      return b
    }
    function le(a, b, c, d, e) {
      if (qa(b)) {
        for (var f = 0; f < b.length; f++) le(a, b[f], c, d, e)
        return null
      }
      c = me(c)
      return a && a[ae]
        ? a.J.add(String(b), c, !0, ta(d) ? !!d.capture : !!d, e)
        : ne(a, b, c, !0, d, e)
    }
    function se(a, b, c, d, e) {
      if (qa(b)) for (var f = 0; f < b.length; f++) se(a, b[f], c, d, e)
      else
        ((d = ta(d) ? !!d.capture : !!d), (c = me(c)), a && a[ae])
          ? ((a = a.J),
            (b = String(b).toString()),
            b in a.a &&
              ((f = a.a[b]),
              (c = fe(f, c, d, e)),
              -1 < c && (de(f[c]), Oa(f, c), 0 == f.length && (delete a.a[b], a.g--))))
          : a &&
            (a = oe(a)) &&
            ((b = a.a[b.toString()]),
            (a = -1),
            b && (a = fe(b, c, d, e)),
            (c = -1 < a ? b[a] : null) && te(c))
    }
    function te(a) {
      if ('number' != typeof a && a && !a.sa) {
        var b = a.src
        if (b && b[ae]) ge(b.J, a)
        else {
          var c = a.type,
            d = a.proxy
          b.removeEventListener
            ? b.removeEventListener(c, d, a.capture)
            : b.detachEvent
            ? b.detachEvent(qe(c), d)
            : b.addListener && b.removeListener && b.removeListener(d)
          je--
          ;(c = oe(b)) ? (ge(c, a), 0 == c.g && ((c.src = null), (b[he] = null))) : de(a)
        }
      }
    }
    function qe(a) {
      return a in ie ? ie[a] : (ie[a] = 'on' + a)
    }
    function ue(a, b, c, d) {
      var e = !0
      if ((a = oe(a)))
        if ((b = a.a[b.toString()]))
          for (b = b.concat(), a = 0; a < b.length; a++) {
            var f = b[a]
            f && f.capture == c && !f.sa && ((f = ve(f, d)), (e = e && !1 !== f))
          }
      return e
    }
    function ve(a, b) {
      var c = a.listener,
        d = a.La || a.src
      a.Ia && te(a)
      return c.call(d, b)
    }
    function re(a, b) {
      if (a.sa) return !0
      if (!Vd) {
        if (!b)
          a: {
            b = ['window', 'event']
            for (var c = n, d = 0; d < b.length; d++)
              if (((c = c[b[d]]), null == c)) {
                b = null
                break a
              }
            b = c
          }
        d = b
        b = new Zd(d, this)
        c = !0
        if (!(0 > d.keyCode || void 0 != d.returnValue)) {
          a: {
            var e = !1
            if (0 == d.keyCode)
              try {
                d.keyCode = -1
                break a
              } catch (g) {
                e = !0
              }
            if (e || void 0 == d.returnValue) d.returnValue = !0
          }
          d = []
          for (e = b.g; e; e = e.parentNode) d.push(e)
          a = a.type
          for (e = d.length - 1; !b.h && 0 <= e; e--) {
            b.g = d[e]
            var f = ue(d[e], a, !0, b)
            c = c && f
          }
          for (e = 0; !b.h && e < d.length; e++)
            (b.g = d[e]), (f = ue(d[e], a, !1, b)), (c = c && f)
        }
        return c
      }
      return ve(a, new Zd(b, this))
    }
    function oe(a) {
      a = a[he]
      return a instanceof ee ? a : null
    }
    var we = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0)
    function me(a) {
      if (sa(a)) return a
      a[we] ||
        (a[we] = function (b) {
          return a.handleEvent(b)
        })
      return a[we]
    }
    function E() {
      Pd.call(this)
      this.J = new ee(this)
      this.wb = this
      this.Ha = null
    }
    w(E, Pd)
    E.prototype[ae] = !0
    E.prototype.Za = function (a) {
      this.Ha = a
    }
    E.prototype.removeEventListener = function (a, b, c, d) {
      se(this, a, b, c, d)
    }
    function xe(a, b) {
      var c,
        d = a.Ha
      if (d) for (c = []; d; d = d.Ha) c.push(d)
      a = a.wb
      d = b.type || b
      if (q(b)) b = new Yd(b, a)
      else if (b instanceof Yd) b.target = b.target || a
      else {
        var e = b
        b = new Yd(d, a)
        gb(b, e)
      }
      e = !0
      if (c)
        for (var f = c.length - 1; !b.h && 0 <= f; f--) {
          var g = (b.g = c[f])
          e = ye(g, d, !0, b) && e
        }
      b.h || ((g = b.g = a), (e = ye(g, d, !0, b) && e), b.h || (e = ye(g, d, !1, b) && e))
      if (c) for (f = 0; !b.h && f < c.length; f++) (g = b.g = c[f]), (e = ye(g, d, !1, b) && e)
      return e
    }
    E.prototype.o = function () {
      E.K.o.call(this)
      if (this.J) {
        var a = this.J,
          b = 0,
          c
        for (c in a.a) {
          for (var d = a.a[c], e = 0; e < d.length; e++) ++b, de(d[e])
          delete a.a[c]
          a.g--
        }
      }
      this.Ha = null
    }
    function ye(a, b, c, d) {
      b = a.J.a[String(b)]
      if (!b) return !0
      b = b.concat()
      for (var e = !0, f = 0; f < b.length; ++f) {
        var g = b[f]
        if (g && !g.sa && g.capture == c) {
          var h = g.listener,
            k = g.La || g.src
          g.Ia && ge(a.J, g)
          e = !1 !== h.call(k, d) && e
        }
      }
      return e && 0 != d.qb
    }
    var ze = {},
      Ae = 0
    function Be(a, b) {
      if (!a) throw Error('Event target element must be provided!')
      a = Ce(a)
      if (ze[a] && ze[a].length) for (var c = 0; c < ze[a].length; c++) xe(ze[a][c], b)
    }
    function De(a) {
      var b = Ce(a.N())
      ze[b] &&
        ze[b].length &&
        (Pa(ze[b], function (c) {
          return c == a
        }),
        ze[b].length || delete ze[b])
    }
    function Ce(a) {
      'undefined' === typeof a.a && ((a.a = Ae), Ae++)
      return a.a
    }
    function Ee(a) {
      if (!a) throw Error('Event target element must be provided!')
      E.call(this)
      this.a = a
    }
    m(Ee, E)
    Ee.prototype.N = function () {
      return this.a
    }
    Ee.prototype.register = function () {
      var a = Ce(this.N())
      ze[a] ? Ma(ze[a], this) || ze[a].push(this) : (ze[a] = [this])
    }
    function Fe(a) {
      if (!a) return !1
      try {
        return !!a.$goog_Thenable
      } catch (b) {
        return !1
      }
    }
    function Ge(a, b) {
      this.h = a
      this.j = b
      this.g = 0
      this.a = null
    }
    Ge.prototype.get = function () {
      if (0 < this.g) {
        this.g--
        var a = this.a
        this.a = a.next
        a.next = null
      } else a = this.h()
      return a
    }
    function He(a, b) {
      a.j(b)
      100 > a.g && (a.g++, (b.next = a.a), (a.a = b))
    }
    function Ie() {
      this.g = this.a = null
    }
    var Ke = new Ge(
      function () {
        return new Je()
      },
      function (a) {
        a.reset()
      }
    )
    Ie.prototype.add = function (a, b) {
      var c = Ke.get()
      c.set(a, b)
      this.g ? (this.g.next = c) : (this.a = c)
      this.g = c
    }
    function Le() {
      var a = Me,
        b = null
      a.a && ((b = a.a), (a.a = a.a.next), a.a || (a.g = null), (b.next = null))
      return b
    }
    function Je() {
      this.next = this.g = this.a = null
    }
    Je.prototype.set = function (a, b) {
      this.a = a
      this.g = b
      this.next = null
    }
    Je.prototype.reset = function () {
      this.next = this.g = this.a = null
    }
    function Ne(a) {
      n.setTimeout(function () {
        throw a
      }, 0)
    }
    var Oe
    function Pe() {
      var a = n.MessageChannel
      'undefined' === typeof a &&
        'undefined' !== typeof window &&
        window.postMessage &&
        window.addEventListener &&
        !y('Presto') &&
        (a = function () {
          var e = document.createElement('IFRAME')
          e.style.display = 'none'
          e.src = ''
          document.documentElement.appendChild(e)
          var f = e.contentWindow
          e = f.document
          e.open()
          e.write('')
          e.close()
          var g = 'callImmediate' + Math.random(),
            h = 'file:' == f.location.protocol ? '*' : f.location.protocol + '//' + f.location.host
          e = r(function (k) {
            if (('*' == h || k.origin == h) && k.data == g) this.port1.onmessage()
          }, this)
          f.addEventListener('message', e, !1)
          this.port1 = {}
          this.port2 = {
            postMessage: function () {
              f.postMessage(g, h)
            },
          }
        })
      if ('undefined' !== typeof a && !y('Trident') && !y('MSIE')) {
        var b = new a(),
          c = {},
          d = c
        b.port1.onmessage = function () {
          if (ka(c.next)) {
            c = c.next
            var e = c.gb
            c.gb = null
            e()
          }
        }
        return function (e) {
          d.next = { gb: e }
          d = d.next
          b.port2.postMessage(0)
        }
      }
      return 'undefined' !== typeof document &&
        'onreadystatechange' in document.createElement('SCRIPT')
        ? function (e) {
            var f = document.createElement('SCRIPT')
            f.onreadystatechange = function () {
              f.onreadystatechange = null
              f.parentNode.removeChild(f)
              f = null
              e()
              e = null
            }
            document.documentElement.appendChild(f)
          }
        : function (e) {
            n.setTimeout(e, 0)
          }
    }
    function Qe(a, b) {
      Re || Se()
      Te || (Re(), (Te = !0))
      Me.add(a, b)
    }
    var Re
    function Se() {
      if (n.Promise && n.Promise.resolve) {
        var a = n.Promise.resolve(void 0)
        Re = function () {
          a.then(Ue)
        }
      } else
        Re = function () {
          var b = Ue
          !sa(n.setImmediate) ||
          (n.Window &&
            n.Window.prototype &&
            !y('Edge') &&
            n.Window.prototype.setImmediate == n.setImmediate)
            ? (Oe || (Oe = Pe()), Oe(b))
            : n.setImmediate(b)
        }
    }
    var Te = !1,
      Me = new Ie()
    function Ue() {
      for (var a; (a = Le()); ) {
        try {
          a.a.call(a.g)
        } catch (b) {
          Ne(b)
        }
        He(Ke, a)
      }
      Te = !1
    }
    function Ve(a) {
      this.a = We
      this.A = void 0
      this.j = this.g = this.h = null
      this.s = this.i = !1
      if (a != na)
        try {
          var b = this
          a.call(
            void 0,
            function (c) {
              Xe(b, Ye, c)
            },
            function (c) {
              if (!(c instanceof Ze))
                try {
                  if (c instanceof Error) throw c
                  throw Error('Promise rejected.')
                } catch (d) {}
              Xe(b, $e, c)
            }
          )
        } catch (c) {
          Xe(this, $e, c)
        }
    }
    var We = 0,
      Ye = 2,
      $e = 3
    function af() {
      this.next = this.j = this.g = this.s = this.a = null
      this.h = !1
    }
    af.prototype.reset = function () {
      this.j = this.g = this.s = this.a = null
      this.h = !1
    }
    var bf = new Ge(
      function () {
        return new af()
      },
      function (a) {
        a.reset()
      }
    )
    function cf(a, b, c) {
      var d = bf.get()
      d.s = a
      d.g = b
      d.j = c
      return d
    }
    function F(a) {
      if (a instanceof Ve) return a
      var b = new Ve(na)
      Xe(b, Ye, a)
      return b
    }
    function df(a) {
      return new Ve(function (b, c) {
        c(a)
      })
    }
    Ve.prototype.then = function (a, b, c) {
      return ef(this, sa(a) ? a : null, sa(b) ? b : null, c)
    }
    Ve.prototype.$goog_Thenable = !0
    l = Ve.prototype
    l.fc = function (a, b) {
      a = cf(a, a, b)
      a.h = !0
      ff(this, a)
      return this
    }
    l.Ca = function (a, b) {
      return ef(this, null, a, b)
    }
    l.cancel = function (a) {
      this.a == We &&
        Qe(function () {
          var b = new Ze(a)
          gf(this, b)
        }, this)
    }
    function gf(a, b) {
      if (a.a == We)
        if (a.h) {
          var c = a.h
          if (c.g) {
            for (
              var d = 0, e = null, f = null, g = c.g;
              g && (g.h || (d++, g.a == a && (e = g), !(e && 1 < d)));
              g = g.next
            )
              e || (f = g)
            e &&
              (c.a == We && 1 == d
                ? gf(c, b)
                : (f ? ((d = f), d.next == c.j && (c.j = d), (d.next = d.next.next)) : hf(c),
                  jf(c, e, $e, b)))
          }
          a.h = null
        } else Xe(a, $e, b)
    }
    function ff(a, b) {
      a.g || (a.a != Ye && a.a != $e) || kf(a)
      a.j ? (a.j.next = b) : (a.g = b)
      a.j = b
    }
    function ef(a, b, c, d) {
      var e = cf(null, null, null)
      e.a = new Ve(function (f, g) {
        e.s = b
          ? function (h) {
              try {
                var k = b.call(d, h)
                f(k)
              } catch (p) {
                g(p)
              }
            }
          : f
        e.g = c
          ? function (h) {
              try {
                var k = c.call(d, h)
                !ka(k) && h instanceof Ze ? g(h) : f(k)
              } catch (p) {
                g(p)
              }
            }
          : g
      })
      e.a.h = a
      ff(a, e)
      return e.a
    }
    l.hc = function (a) {
      this.a = We
      Xe(this, Ye, a)
    }
    l.ic = function (a) {
      this.a = We
      Xe(this, $e, a)
    }
    function Xe(a, b, c) {
      if (a.a == We) {
        a === c && ((b = $e), (c = new TypeError('Promise cannot resolve to itself')))
        a.a = 1
        a: {
          var d = c,
            e = a.hc,
            f = a.ic
          if (d instanceof Ve) {
            ff(d, cf(e || na, f || null, a))
            var g = !0
          } else if (Fe(d)) d.then(e, f, a), (g = !0)
          else {
            if (ta(d))
              try {
                var h = d.then
                if (sa(h)) {
                  lf(d, h, e, f, a)
                  g = !0
                  break a
                }
              } catch (k) {
                f.call(a, k)
                g = !0
                break a
              }
            g = !1
          }
        }
        g || ((a.A = c), (a.a = b), (a.h = null), kf(a), b != $e || c instanceof Ze || mf(a, c))
      }
    }
    function lf(a, b, c, d, e) {
      function f(k) {
        h || ((h = !0), d.call(e, k))
      }
      function g(k) {
        h || ((h = !0), c.call(e, k))
      }
      var h = !1
      try {
        b.call(a, g, f)
      } catch (k) {
        f(k)
      }
    }
    function kf(a) {
      a.i || ((a.i = !0), Qe(a.Hb, a))
    }
    function hf(a) {
      var b = null
      a.g && ((b = a.g), (a.g = b.next), (b.next = null))
      a.g || (a.j = null)
      return b
    }
    l.Hb = function () {
      for (var a; (a = hf(this)); ) jf(this, a, this.a, this.A)
      this.i = !1
    }
    function jf(a, b, c, d) {
      if (c == $e && b.g && !b.h) for (; a && a.s; a = a.h) a.s = !1
      if (b.a) (b.a.h = null), nf(b, c, d)
      else
        try {
          b.h ? b.s.call(b.j) : nf(b, c, d)
        } catch (e) {
          of.call(null, e)
        }
      He(bf, b)
    }
    function nf(a, b, c) {
      b == Ye ? a.s.call(a.j, c) : a.g && a.g.call(a.j, c)
    }
    function mf(a, b) {
      a.s = !0
      Qe(function () {
        a.s && of.call(null, b)
      })
    }
    var of = Ne
    function Ze(a) {
      Ba.call(this, a)
    }
    w(Ze, Ba)
    Ze.prototype.name = 'cancel'
    function pf(a, b, c) {
      b || (b = {})
      c = c || window
      var d = a instanceof xc ? a : Bc('undefined' != typeof a.href ? a.href : String(a))
      a = b.target || a.target
      var e = []
      for (f in b)
        switch (f) {
          case 'width':
          case 'height':
          case 'top':
          case 'left':
            e.push(f + '=' + b[f])
            break
          case 'target':
          case 'noopener':
          case 'noreferrer':
            break
          default:
            e.push(f + '=' + (b[f] ? 1 : 0))
        }
      var f = e.join(',')
      ;((y('iPhone') && !y('iPod') && !y('iPad')) || y('iPad') || y('iPod')) &&
      c.navigator &&
      c.navigator.standalone &&
      a &&
      '_self' != a
        ? ((f = c.document.createElement('A')),
          (d = d instanceof xc ? d : Dc(d)),
          (f.href = zc(d)),
          f.setAttribute('target', a),
          b.noreferrer && f.setAttribute('rel', 'noreferrer'),
          (b = document.createEvent('MouseEvent')),
          b.initMouseEvent('click', !0, !0, c, 1),
          f.dispatchEvent(b),
          (c = {}))
        : b.noreferrer
        ? ((c = c.open('', a, f)),
          (b = zc(d).toString()),
          c &&
            (cc && -1 != b.indexOf(';') && (b = "'" + b.replace(/'/g, '%27') + "'"),
            (c.opener = null),
            (b = Jc(
              '<meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0; url=' +
                cb(b) +
                '">',
              null
            )),
            c.document.write(Ic(b)),
            c.document.close()))
        : (c = c.open(zc(d).toString(), a, f)) && b.noopener && (c.opener = null)
      return c
    }
    function qf() {
      try {
        return !(
          !window.opener ||
          !window.opener.location ||
          window.opener.location.hostname !== window.location.hostname ||
          window.opener.location.protocol !== window.location.protocol
        )
      } catch (a$2) {}
      return !1
    }
    function rf(a) {
      pf(
        a,
        { target: window.cordova && window.cordova.InAppBrowser ? '_system' : '_blank' },
        void 0
      )
    }
    function sf(a, b) {
      a = ta(a) && 1 == a.nodeType ? a : document.querySelector(String(a))
      if (null == a) throw Error(b || 'Cannot find element.')
      return a
    }
    function tf() {
      return window.location.href
    }
    function uf() {
      var a = null
      return new Ve(function (b) {
        'complete' == n.document.readyState
          ? b()
          : ((a = function () {
              b()
            }),
            le(window, 'load', a))
      }).Ca(function (b) {
        se(window, 'load', a)
        throw b
      })
    }
    function vf() {
      for (var a = 32, b = []; 0 < a; )
        b.push(
          '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(
            Math.floor(62 * Math.random())
          )
        ),
          a--
      return b.join('')
    }
    function wf(a, b, c) {
      c = void 0 === c ? {} : c
      return Object.keys(a)
        .filter(function (d) {
          return b.includes(d)
        })
        .reduce(function (d, e) {
          d[e] = a[e]
          return d
        }, c)
    }
    function xf(a) {
      var b = yf
      this.s = []
      this.T = b
      this.O = a || null
      this.j = this.a = !1
      this.h = void 0
      this.J = this.l = this.A = !1
      this.i = 0
      this.g = null
      this.C = 0
    }
    xf.prototype.cancel = function (a) {
      if (this.a) this.h instanceof xf && this.h.cancel()
      else {
        if (this.g) {
          var b = this.g
          delete this.g
          a ? b.cancel(a) : (b.C--, 0 >= b.C && b.cancel())
        }
        this.T ? this.T.call(this.O, this) : (this.J = !0)
        this.a || ((a = new zf(this)), Af(this), Bf(this, !1, a))
      }
    }
    xf.prototype.L = function (a, b) {
      this.A = !1
      Bf(this, a, b)
    }
    function Bf(a, b, c) {
      a.a = !0
      a.h = c
      a.j = !b
      Cf(a)
    }
    function Af(a) {
      if (a.a) {
        if (!a.J) throw new Df(a)
        a.J = !1
      }
    }
    xf.prototype.callback = function (a) {
      Af(this)
      Bf(this, !0, a)
    }
    function Ef(a, b, c) {
      a.s.push([b, c, void 0])
      a.a && Cf(a)
    }
    xf.prototype.then = function (a, b, c) {
      var d,
        e,
        f = new Ve(function (g, h) {
          d = g
          e = h
        })
      Ef(this, d, function (g) {
        g instanceof zf ? f.cancel() : e(g)
      })
      return f.then(a, b, c)
    }
    xf.prototype.$goog_Thenable = !0
    function Ff(a) {
      return La(a.s, function (b) {
        return sa(b[1])
      })
    }
    function Cf(a) {
      if (a.i && a.a && Ff(a)) {
        var b = a.i,
          c = Gf[b]
        c && (n.clearTimeout(c.a), delete Gf[b])
        a.i = 0
      }
      a.g && (a.g.C--, delete a.g)
      b = a.h
      for (var d = (c = !1); a.s.length && !a.A; ) {
        var e = a.s.shift(),
          f = e[0],
          g = e[1]
        e = e[2]
        if ((f = a.j ? g : f))
          try {
            var h = f.call(e || a.O, b)
            ka(h) && ((a.j = a.j && (h == b || h instanceof Error)), (a.h = b = h))
            if (Fe(b) || ('function' === typeof n.Promise && b instanceof n.Promise))
              (d = !0), (a.A = !0)
          } catch (k) {
            ;(b = k), (a.j = !0), Ff(a) || (c = !0)
          }
      }
      a.h = b
      d &&
        ((h = r(a.L, a, !0)),
        (d = r(a.L, a, !1)),
        b instanceof xf ? (Ef(b, h, d), (b.l = !0)) : b.then(h, d))
      c && ((b = new Hf(b)), (Gf[b.a] = b), (a.i = b.a))
    }
    function Df() {
      Ba.call(this)
    }
    w(Df, Ba)
    Df.prototype.message = 'Deferred has already fired'
    Df.prototype.name = 'AlreadyCalledError'
    function zf() {
      Ba.call(this)
    }
    w(zf, Ba)
    zf.prototype.message = 'Deferred was canceled'
    zf.prototype.name = 'CanceledError'
    function Hf(a) {
      this.a = n.setTimeout(r(this.h, this), 0)
      this.g = a
    }
    Hf.prototype.h = function () {
      delete Gf[this.a]
      throw this.g
    }
    var Gf = {}
    function If(a) {
      var b = {},
        c = b.document || document,
        d = uc(a).toString(),
        e = document.createElement('SCRIPT'),
        f = { rb: e, sb: void 0 },
        g = new xf(f),
        h = null,
        k = null != b.timeout ? b.timeout : 5e3
      0 < k &&
        ((h = window.setTimeout(function () {
          Jf(e, !0)
          var p = new Kf(Lf, 'Timeout reached for loading script ' + d)
          Af(g)
          Bf(g, !1, p)
        }, k)),
        (f.sb = h))
      e.onload = e.onreadystatechange = function () {
        ;(e.readyState && 'loaded' != e.readyState && 'complete' != e.readyState) ||
          (Jf(e, b.yc || !1, h), g.callback(null))
      }
      e.onerror = function () {
        Jf(e, !0, h)
        var p = new Kf(Mf, 'Error while loading script ' + d)
        Af(g)
        Bf(g, !1, p)
      }
      f = b.attributes || {}
      gb(f, { type: 'text/javascript', charset: 'UTF-8' })
      Wc(e, f)
      Mc(e, a)
      Nf(c).appendChild(e)
      return g
    }
    function Nf(a) {
      var b = (a || document).getElementsByTagName('HEAD')
      return b && 0 != b.length ? b[0] : a.documentElement
    }
    function yf() {
      if (this && this.rb) {
        var a = this.rb
        a && 'SCRIPT' == a.tagName && Jf(a, !0, this.sb)
      }
    }
    function Jf(a, b, c) {
      null != c && n.clearTimeout(c)
      a.onload = na
      a.onerror = na
      a.onreadystatechange = na
      b &&
        window.setTimeout(function () {
          Zc(a)
        }, 0)
    }
    var Mf = 0,
      Lf = 1
    function Kf(a, b) {
      var c = 'Jsloader error (code #' + a + ')'
      b && (c += ': ' + b)
      Ba.call(this, c)
      this.code = a
    }
    w(Kf, Ba)
    function Of() {
      return (n.google && n.google.accounts && n.google.accounts.id) || null
    }
    function Pf(a) {
      this.a = a || Of()
      this.h = !1
      this.g = null
    }
    Pf.prototype.cancel = function () {
      this.a && this.h && (this.g && this.g(null), this.a.cancel())
    }
    function Qf(a, b, c) {
      if (a.a && b)
        return (function () {
          a.h = !0
          return new Ve(function (e) {
            a.g = e
            a.a.initialize({ client_id: b, callback: e, auto_select: !c })
            a.a.prompt()
          })
        })()
      if (b) {
        var d = Rf.Xa()
          .load()
          .then(function () {
            a.a = Of()
            return Qf(a, b, c)
          })
          .Ca(function () {
            return null
          })
        return F(d)
      }
      return F(null)
    }
    oa(Pf)
    var wc = new pc(qc, 'https://accounts.google.com/gsi/client')
    function Rf() {
      this.a = null
    }
    Rf.prototype.load = function () {
      var a = this
      if (this.a) return this.a
      var b = vc()
      return Of()
        ? F()
        : (this.a = uf().then(function () {
            if (!Of())
              return new Ve(function (c, d) {
                var e = setTimeout(function () {
                  a.a = null
                  d(Error('Network error!'))
                }, 1e4)
                n.onGoogleLibraryLoad = function () {
                  clearTimeout(e)
                  c()
                }
                F(If(b))
                  .then(function () {
                    Of() && c()
                  })
                  .Ca(function (f) {
                    clearTimeout(e)
                    a.a = null
                    d(f)
                  })
              })
          }))
    }
    oa(Rf)
    function Sf(a, b) {
      this.a = a
      this.g =
        b ||
        function (c) {
          throw c
        }
    }
    Sf.prototype.confirm = function (a) {
      return F(this.a.confirm(a)).Ca(this.g)
    }
    function Tf(a, b, c) {
      this.reset(a, b, c, void 0, void 0)
    }
    Tf.prototype.a = null
    var Uf = 0
    Tf.prototype.reset = function (a, b, c, d, e) {
      'number' == typeof e || Uf++
      this.h = d || Aa()
      this.j = a
      this.s = b
      this.g = c
      delete this.a
    }
    function Vf(a) {
      this.s = a
      this.a = this.h = this.j = this.g = null
    }
    function Wf(a, b) {
      this.name = a
      this.value = b
    }
    Wf.prototype.toString = function () {
      return this.name
    }
    var Xf = new Wf('SEVERE', 1e3),
      Yf = new Wf('WARNING', 900),
      Zf = new Wf('CONFIG', 700)
    function $f(a) {
      if (a.j) return a.j
      if (a.g) return $f(a.g)
      Fa('Root logger has no level set.')
      return null
    }
    Vf.prototype.log = function (a, b, c) {
      if (a.value >= $f(this).value)
        for (sa(b) && (b = b()), a = new Tf(a, String(b), this.s), c && (a.a = c), c = this; c; ) {
          var d = c,
            e = a
          if (d.a) for (var f = 0; (b = d.a[f]); f++) b(e)
          c = c.g
        }
    }
    var ag = {},
      bg = null
    function cg() {
      bg || ((bg = new Vf('')), (ag[''] = bg), (bg.j = Zf))
    }
    function dg(a) {
      cg()
      var b
      if (!(b = ag[a])) {
        b = new Vf(a)
        var c = a.lastIndexOf('.'),
          d = a.substr(c + 1)
        c = dg(a.substr(0, c))
        c.h || (c.h = {})
        c.h[d] = b
        b.g = c
        ag[a] = b
      }
      return b
    }
    function eg() {
      this.a = Aa()
    }
    var fg = null
    eg.prototype.set = function (a) {
      this.a = a
    }
    eg.prototype.reset = function () {
      this.set(Aa())
    }
    eg.prototype.get = function () {
      return this.a
    }
    function gg(a) {
      this.j = a || ''
      fg || (fg = new eg())
      this.s = fg
    }
    gg.prototype.a = !0
    gg.prototype.g = !0
    gg.prototype.h = !1
    function hg(a) {
      return 10 > a ? '0' + a : String(a)
    }
    function ig(a, b) {
      a = (a.h - b) / 1e3
      b = a.toFixed(3)
      var c = 0
      if (1 > a) c = 2
      else for (; 100 > a; ) c++, (a *= 10)
      for (; 0 < c--; ) b = ' ' + b
      return b
    }
    function jg(a) {
      gg.call(this, a)
    }
    w(jg, gg)
    function kg(a, b) {
      var c = []
      c.push(a.j, ' ')
      if (a.g) {
        var d = new Date(b.h)
        c.push(
          '[',
          hg(d.getFullYear() - 2e3) +
            hg(d.getMonth() + 1) +
            hg(d.getDate()) +
            ' ' +
            hg(d.getHours()) +
            ':' +
            hg(d.getMinutes()) +
            ':' +
            hg(d.getSeconds()) +
            '.' +
            hg(Math.floor(d.getMilliseconds() / 10)),
          '] '
        )
      }
      c.push('[', ig(b, a.s.get()), 's] ')
      c.push('[', b.g, '] ')
      c.push(b.s)
      a.h && (b = b.a) && c.push('\n', b instanceof Error ? b.message : b.toString())
      a.a && c.push('\n')
      return c.join('')
    }
    function lg() {
      this.s = r(this.h, this)
      this.a = new jg()
      this.a.g = !1
      this.a.h = !1
      this.g = this.a.a = !1
      this.j = {}
    }
    lg.prototype.h = function (a) {
      function b(f) {
        if (f) {
          if (f.value >= Xf.value) return 'error'
          if (f.value >= Yf.value) return 'warn'
          if (f.value >= Zf.value) return 'log'
        }
        return 'debug'
      }
      if (!this.j[a.g]) {
        var c = kg(this.a, a),
          d = mg
        if (d) {
          var e = b(a.j)
          ng(d, e, c, a.a)
        }
      }
    }
    var mg = n.console
    function ng(a, b, c, d) {
      if (a[b]) a[b](c, d || '')
      else a.log(c, d || '')
    }
    function og(a, b) {
      var c = pg
      c && c.log(Xf, a, b)
    }
    var pg
    pg = dg('firebaseui')
    var qg = new lg()
    if (1 != qg.g) {
      var rg
      cg()
      rg = bg
      var sg = qg.s
      rg.a || (rg.a = [])
      rg.a.push(sg)
      qg.g = !0
    }
    function tg(a) {
      var b = pg
      b && b.log(Yf, a, void 0)
    }
    function ug() {
      this.a = ('undefined' == typeof document ? null : document) || { cookie: '' }
    }
    l = ug.prototype
    l.set = function (a, b, c, d, e, f) {
      if (/[;=\s]/.test(a)) throw Error('Invalid cookie name "' + a + '"')
      if (/[;\r\n]/.test(b)) throw Error('Invalid cookie value "' + b + '"')
      ka(c) || (c = -1)
      e = e ? ';domain=' + e : ''
      d = d ? ';path=' + d : ''
      f = f ? ';secure' : ''
      c =
        0 > c
          ? ''
          : 0 == c
          ? ';expires=' + new Date(1970, 1, 1).toUTCString()
          : ';expires=' + new Date(Aa() + 1e3 * c).toUTCString()
      this.a.cookie = a + '=' + b + e + d + c + f
    }
    l.get = function (a, b) {
      for (var c = a + '=', d = (this.a.cookie || '').split(';'), e = 0, f; e < d.length; e++) {
        f = Ua(d[e])
        if (0 == f.lastIndexOf(c, 0)) return f.substr(c.length)
        if (f == a) return ''
      }
      return b
    }
    l.ja = function () {
      return vg(this).keys
    }
    l.la = function () {
      return vg(this).values
    }
    l.clear = function () {
      for (var a = vg(this).keys, b = a.length - 1; 0 <= b; b--) {
        var c = a[b]
        this.get(c)
        this.set(c, '', 0, void 0, void 0)
      }
    }
    function vg(a) {
      a = (a.a.cookie || '').split(';')
      for (var b = [], c = [], d, e, f = 0; f < a.length; f++)
        (e = Ua(a[f])),
          (d = e.indexOf('=')),
          -1 == d
            ? (b.push(''), c.push(e))
            : (b.push(e.substring(0, d)), c.push(e.substring(d + 1)))
      return { keys: b, values: c }
    }
    var wg = new ug()
    function yg() {}
    function zg(a, b, c, d) {
      this.h = 'undefined' !== typeof a && null !== a ? a : -1
      this.g = b || null
      this.a = c || null
      this.j = !!d
    }
    m(zg, yg)
    zg.prototype.set = function (a, b) {
      wg.set(a, b, this.h, this.g, this.a, this.j)
    }
    zg.prototype.get = function (a) {
      return wg.get(a) || null
    }
    zg.prototype.ra = function (a) {
      var b = this.g,
        c = this.a
      wg.get(a)
      wg.set(a, '', 0, b, c)
    }
    function Ag(a, b) {
      this.g = a
      this.a = b || null
    }
    function Bg(a) {
      return { email: a.g, credential: a.a && a.a.toJSON() }
    }
    function Cg(a) {
      if (a && a.email) {
        var b = a.credential && firebase.auth.AuthCredential.fromJSON(a.credential)
        return new Ag(a.email, b)
      }
      return null
    }
    function Dg(a) {
      this.a = a || null
    }
    function Eg(a) {
      for (var b = [], c = 0, d = 0; d < a.length; d++) {
        var e = a.charCodeAt(d)
        255 < e && ((b[c++] = e & 255), (e >>= 8))
        b[c++] = e
      }
      return b
    }
    function Fg(a) {
      return Ka(a, function (b) {
        b = b.toString(16)
        return 1 < b.length ? b : '0' + b
      }).join('')
    }
    function Gg(a) {
      this.i = a
      this.g = this.i.length / 4
      this.j = this.g + 6
      this.h = [[], [], [], []]
      this.s = [[], [], [], []]
      this.a = Array(Hg * (this.j + 1))
      for (a = 0; a < this.g; a++)
        this.a[a] = [this.i[4 * a], this.i[4 * a + 1], this.i[4 * a + 2], this.i[4 * a + 3]]
      var b = Array(4)
      for (a = this.g; a < Hg * (this.j + 1); a++) {
        b[0] = this.a[a - 1][0]
        b[1] = this.a[a - 1][1]
        b[2] = this.a[a - 1][2]
        b[3] = this.a[a - 1][3]
        if (0 == a % this.g) {
          var c = b,
            d = c[0]
          c[0] = c[1]
          c[1] = c[2]
          c[2] = c[3]
          c[3] = d
          Ig(b)
          b[0] ^= Jg[a / this.g][0]
          b[1] ^= Jg[a / this.g][1]
          b[2] ^= Jg[a / this.g][2]
          b[3] ^= Jg[a / this.g][3]
        } else 6 < this.g && 4 == a % this.g && Ig(b)
        this.a[a] = Array(4)
        this.a[a][0] = this.a[a - this.g][0] ^ b[0]
        this.a[a][1] = this.a[a - this.g][1] ^ b[1]
        this.a[a][2] = this.a[a - this.g][2] ^ b[2]
        this.a[a][3] = this.a[a - this.g][3] ^ b[3]
      }
    }
    Gg.prototype.A = 16
    var Hg = Gg.prototype.A / 4
    function Kg(a, b) {
      for (var c, d = 0; d < Hg; d++)
        for (var e = 0; 4 > e; e++) (c = 4 * e + d), (c = b[c]), (a.h[d][e] = c)
    }
    function Lg(a) {
      for (var b = [], c = 0; c < Hg; c++) for (var d = 0; 4 > d; d++) b[4 * d + c] = a.h[c][d]
      return b
    }
    function Mg(a, b) {
      for (var c = 0; 4 > c; c++) for (var d = 0; 4 > d; d++) a.h[c][d] ^= a.a[4 * b + d][c]
    }
    function Ng(a, b) {
      for (var c = 0; 4 > c; c++) for (var d = 0; 4 > d; d++) a.h[c][d] = b[a.h[c][d]]
    }
    function Og(a) {
      for (var b = 1; 4 > b; b++) for (var c = 0; 4 > c; c++) a.s[b][c] = a.h[b][c]
      for (b = 1; 4 > b; b++) for (c = 0; 4 > c; c++) a.h[b][c] = a.s[b][(c + b) % Hg]
    }
    function Pg(a) {
      for (var b = 1; 4 > b; b++) for (var c = 0; 4 > c; c++) a.s[b][(c + b) % Hg] = a.h[b][c]
      for (b = 1; 4 > b; b++) for (c = 0; 4 > c; c++) a.h[b][c] = a.s[b][c]
    }
    function Ig(a) {
      a[0] = Qg[a[0]]
      a[1] = Qg[a[1]]
      a[2] = Qg[a[2]]
      a[3] = Qg[a[3]]
    }
    var Qg = [
        99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201,
        125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63,
        247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128,
        226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47,
        132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170,
        251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56,
        245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126,
        61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11,
        219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55,
        109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180,
        198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87,
        185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85,
        40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22,
      ],
      Rg = [
        82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130,
        155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61,
        238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73,
        109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182,
        146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216,
        171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15,
        2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207,
        206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117,
        223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86,
        62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7,
        199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122,
        159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83,
        153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125,
      ],
      Jg = [
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [8, 0, 0, 0],
        [16, 0, 0, 0],
        [32, 0, 0, 0],
        [64, 0, 0, 0],
        [128, 0, 0, 0],
        [27, 0, 0, 0],
        [54, 0, 0, 0],
      ],
      Sg = [
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46,
        48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92,
        94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130,
        132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166,
        168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200, 202,
        204, 206, 208, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228, 230, 232, 234, 236, 238,
        240, 242, 244, 246, 248, 250, 252, 254, 27, 25, 31, 29, 19, 17, 23, 21, 11, 9, 15, 13, 3, 1,
        7, 5, 59, 57, 63, 61, 51, 49, 55, 53, 43, 41, 47, 45, 35, 33, 39, 37, 91, 89, 95, 93, 83,
        81, 87, 85, 75, 73, 79, 77, 67, 65, 71, 69, 123, 121, 127, 125, 115, 113, 119, 117, 107,
        105, 111, 109, 99, 97, 103, 101, 155, 153, 159, 157, 147, 145, 151, 149, 139, 137, 143, 141,
        131, 129, 135, 133, 187, 185, 191, 189, 179, 177, 183, 181, 171, 169, 175, 173, 163, 161,
        167, 165, 219, 217, 223, 221, 211, 209, 215, 213, 203, 201, 207, 205, 195, 193, 199, 197,
        251, 249, 255, 253, 243, 241, 247, 245, 235, 233, 239, 237, 227, 225, 231, 229,
      ],
      Tg = [
        0, 3, 6, 5, 12, 15, 10, 9, 24, 27, 30, 29, 20, 23, 18, 17, 48, 51, 54, 53, 60, 63, 58, 57,
        40, 43, 46, 45, 36, 39, 34, 33, 96, 99, 102, 101, 108, 111, 106, 105, 120, 123, 126, 125,
        116, 119, 114, 113, 80, 83, 86, 85, 92, 95, 90, 89, 72, 75, 78, 77, 68, 71, 66, 65, 192,
        195, 198, 197, 204, 207, 202, 201, 216, 219, 222, 221, 212, 215, 210, 209, 240, 243, 246,
        245, 252, 255, 250, 249, 232, 235, 238, 237, 228, 231, 226, 225, 160, 163, 166, 165, 172,
        175, 170, 169, 184, 187, 190, 189, 180, 183, 178, 177, 144, 147, 150, 149, 156, 159, 154,
        153, 136, 139, 142, 141, 132, 135, 130, 129, 155, 152, 157, 158, 151, 148, 145, 146, 131,
        128, 133, 134, 143, 140, 137, 138, 171, 168, 173, 174, 167, 164, 161, 162, 179, 176, 181,
        182, 191, 188, 185, 186, 251, 248, 253, 254, 247, 244, 241, 242, 227, 224, 229, 230, 239,
        236, 233, 234, 203, 200, 205, 206, 199, 196, 193, 194, 211, 208, 213, 214, 223, 220, 217,
        218, 91, 88, 93, 94, 87, 84, 81, 82, 67, 64, 69, 70, 79, 76, 73, 74, 107, 104, 109, 110,
        103, 100, 97, 98, 115, 112, 117, 118, 127, 124, 121, 122, 59, 56, 61, 62, 55, 52, 49, 50,
        35, 32, 37, 38, 47, 44, 41, 42, 11, 8, 13, 14, 7, 4, 1, 2, 19, 16, 21, 22, 31, 28, 25, 26,
      ],
      Ug = [
        0, 9, 18, 27, 36, 45, 54, 63, 72, 65, 90, 83, 108, 101, 126, 119, 144, 153, 130, 139, 180,
        189, 166, 175, 216, 209, 202, 195, 252, 245, 238, 231, 59, 50, 41, 32, 31, 22, 13, 4, 115,
        122, 97, 104, 87, 94, 69, 76, 171, 162, 185, 176, 143, 134, 157, 148, 227, 234, 241, 248,
        199, 206, 213, 220, 118, 127, 100, 109, 82, 91, 64, 73, 62, 55, 44, 37, 26, 19, 8, 1, 230,
        239, 244, 253, 194, 203, 208, 217, 174, 167, 188, 181, 138, 131, 152, 145, 77, 68, 95, 86,
        105, 96, 123, 114, 5, 12, 23, 30, 33, 40, 51, 58, 221, 212, 207, 198, 249, 240, 235, 226,
        149, 156, 135, 142, 177, 184, 163, 170, 236, 229, 254, 247, 200, 193, 218, 211, 164, 173,
        182, 191, 128, 137, 146, 155, 124, 117, 110, 103, 88, 81, 74, 67, 52, 61, 38, 47, 16, 25, 2,
        11, 215, 222, 197, 204, 243, 250, 225, 232, 159, 150, 141, 132, 187, 178, 169, 160, 71, 78,
        85, 92, 99, 106, 113, 120, 15, 6, 29, 20, 43, 34, 57, 48, 154, 147, 136, 129, 190, 183, 172,
        165, 210, 219, 192, 201, 246, 255, 228, 237, 10, 3, 24, 17, 46, 39, 60, 53, 66, 75, 80, 89,
        102, 111, 116, 125, 161, 168, 179, 186, 133, 140, 151, 158, 233, 224, 251, 242, 205, 196,
        223, 214, 49, 56, 35, 42, 21, 28, 7, 14, 121, 112, 107, 98, 93, 84, 79, 70,
      ],
      Vg = [
        0, 11, 22, 29, 44, 39, 58, 49, 88, 83, 78, 69, 116, 127, 98, 105, 176, 187, 166, 173, 156,
        151, 138, 129, 232, 227, 254, 245, 196, 207, 210, 217, 123, 112, 109, 102, 87, 92, 65, 74,
        35, 40, 53, 62, 15, 4, 25, 18, 203, 192, 221, 214, 231, 236, 241, 250, 147, 152, 133, 142,
        191, 180, 169, 162, 246, 253, 224, 235, 218, 209, 204, 199, 174, 165, 184, 179, 130, 137,
        148, 159, 70, 77, 80, 91, 106, 97, 124, 119, 30, 21, 8, 3, 50, 57, 36, 47, 141, 134, 155,
        144, 161, 170, 183, 188, 213, 222, 195, 200, 249, 242, 239, 228, 61, 54, 43, 32, 17, 26, 7,
        12, 101, 110, 115, 120, 73, 66, 95, 84, 247, 252, 225, 234, 219, 208, 205, 198, 175, 164,
        185, 178, 131, 136, 149, 158, 71, 76, 81, 90, 107, 96, 125, 118, 31, 20, 9, 2, 51, 56, 37,
        46, 140, 135, 154, 145, 160, 171, 182, 189, 212, 223, 194, 201, 248, 243, 238, 229, 60, 55,
        42, 33, 16, 27, 6, 13, 100, 111, 114, 121, 72, 67, 94, 85, 1, 10, 23, 28, 45, 38, 59, 48,
        89, 82, 79, 68, 117, 126, 99, 104, 177, 186, 167, 172, 157, 150, 139, 128, 233, 226, 255,
        244, 197, 206, 211, 216, 122, 113, 108, 103, 86, 93, 64, 75, 34, 41, 52, 63, 14, 5, 24, 19,
        202, 193, 220, 215, 230, 237, 240, 251, 146, 153, 132, 143, 190, 181, 168, 163,
      ],
      Wg = [
        0, 13, 26, 23, 52, 57, 46, 35, 104, 101, 114, 127, 92, 81, 70, 75, 208, 221, 202, 199, 228,
        233, 254, 243, 184, 181, 162, 175, 140, 129, 150, 155, 187, 182, 161, 172, 143, 130, 149,
        152, 211, 222, 201, 196, 231, 234, 253, 240, 107, 102, 113, 124, 95, 82, 69, 72, 3, 14, 25,
        20, 55, 58, 45, 32, 109, 96, 119, 122, 89, 84, 67, 78, 5, 8, 31, 18, 49, 60, 43, 38, 189,
        176, 167, 170, 137, 132, 147, 158, 213, 216, 207, 194, 225, 236, 251, 246, 214, 219, 204,
        193, 226, 239, 248, 245, 190, 179, 164, 169, 138, 135, 144, 157, 6, 11, 28, 17, 50, 63, 40,
        37, 110, 99, 116, 121, 90, 87, 64, 77, 218, 215, 192, 205, 238, 227, 244, 249, 178, 191,
        168, 165, 134, 139, 156, 145, 10, 7, 16, 29, 62, 51, 36, 41, 98, 111, 120, 117, 86, 91, 76,
        65, 97, 108, 123, 118, 85, 88, 79, 66, 9, 4, 19, 30, 61, 48, 39, 42, 177, 188, 171, 166,
        133, 136, 159, 146, 217, 212, 195, 206, 237, 224, 247, 250, 183, 186, 173, 160, 131, 142,
        153, 148, 223, 210, 197, 200, 235, 230, 241, 252, 103, 106, 125, 112, 83, 94, 73, 68, 15, 2,
        21, 24, 59, 54, 33, 44, 12, 1, 22, 27, 56, 53, 34, 47, 100, 105, 126, 115, 80, 93, 74, 71,
        220, 209, 198, 203, 232, 229, 242, 255, 180, 185, 174, 163, 128, 141, 154, 151,
      ],
      Xg = [
        0, 14, 28, 18, 56, 54, 36, 42, 112, 126, 108, 98, 72, 70, 84, 90, 224, 238, 252, 242, 216,
        214, 196, 202, 144, 158, 140, 130, 168, 166, 180, 186, 219, 213, 199, 201, 227, 237, 255,
        241, 171, 165, 183, 185, 147, 157, 143, 129, 59, 53, 39, 41, 3, 13, 31, 17, 75, 69, 87, 89,
        115, 125, 111, 97, 173, 163, 177, 191, 149, 155, 137, 135, 221, 211, 193, 207, 229, 235,
        249, 247, 77, 67, 81, 95, 117, 123, 105, 103, 61, 51, 33, 47, 5, 11, 25, 23, 118, 120, 106,
        100, 78, 64, 82, 92, 6, 8, 26, 20, 62, 48, 34, 44, 150, 152, 138, 132, 174, 160, 178, 188,
        230, 232, 250, 244, 222, 208, 194, 204, 65, 79, 93, 83, 121, 119, 101, 107, 49, 63, 45, 35,
        9, 7, 21, 27, 161, 175, 189, 179, 153, 151, 133, 139, 209, 223, 205, 195, 233, 231, 245,
        251, 154, 148, 134, 136, 162, 172, 190, 176, 234, 228, 246, 248, 210, 220, 206, 192, 122,
        116, 102, 104, 66, 76, 94, 80, 10, 4, 22, 24, 50, 60, 46, 32, 236, 226, 240, 254, 212, 218,
        200, 198, 156, 146, 128, 142, 164, 170, 184, 182, 12, 2, 16, 30, 52, 58, 40, 38, 124, 114,
        96, 110, 68, 74, 88, 86, 55, 57, 43, 37, 15, 1, 19, 29, 71, 73, 91, 85, 127, 113, 99, 109,
        215, 217, 203, 197, 239, 225, 243, 253, 167, 169, 187, 181, 159, 145, 131, 141,
      ]
    function Yg(a, b) {
      a = new Gg(Zg(a))
      b = Eg(b)
      for (var c = b.splice(0, 16), d = '', e; c.length; ) {
        e = 16 - c.length
        for (var f = 0; f < e; f++) c.push(0)
        e = a
        Kg(e, c)
        Mg(e, 0)
        for (c = 1; c < e.j; ++c) {
          Ng(e, Qg)
          Og(e)
          f = e.h
          for (var g = e.s[0], h = 0; 4 > h; h++)
            (g[0] = f[0][h]),
              (g[1] = f[1][h]),
              (g[2] = f[2][h]),
              (g[3] = f[3][h]),
              (f[0][h] = Sg[g[0]] ^ Tg[g[1]] ^ g[2] ^ g[3]),
              (f[1][h] = g[0] ^ Sg[g[1]] ^ Tg[g[2]] ^ g[3]),
              (f[2][h] = g[0] ^ g[1] ^ Sg[g[2]] ^ Tg[g[3]]),
              (f[3][h] = Tg[g[0]] ^ g[1] ^ g[2] ^ Sg[g[3]])
          Mg(e, c)
        }
        Ng(e, Qg)
        Og(e)
        Mg(e, e.j)
        d += Fg(Lg(e))
        c = b.splice(0, 16)
      }
      return d
    }
    function $g(a, b) {
      a = new Gg(Zg(a))
      for (var c = [], d = 0; d < b.length; d += 2) c.push(parseInt(b.substring(d, d + 2), 16))
      var e = c.splice(0, 16)
      for (b = ''; e.length; ) {
        d = a
        Kg(d, e)
        Mg(d, d.j)
        for (e = 1; e < d.j; ++e) {
          Pg(d)
          Ng(d, Rg)
          Mg(d, d.j - e)
          for (var f = d.h, g = d.s[0], h = 0; 4 > h; h++)
            (g[0] = f[0][h]),
              (g[1] = f[1][h]),
              (g[2] = f[2][h]),
              (g[3] = f[3][h]),
              (f[0][h] = Xg[g[0]] ^ Vg[g[1]] ^ Wg[g[2]] ^ Ug[g[3]]),
              (f[1][h] = Ug[g[0]] ^ Xg[g[1]] ^ Vg[g[2]] ^ Wg[g[3]]),
              (f[2][h] = Wg[g[0]] ^ Ug[g[1]] ^ Xg[g[2]] ^ Vg[g[3]]),
              (f[3][h] = Vg[g[0]] ^ Wg[g[1]] ^ Ug[g[2]] ^ Xg[g[3]])
        }
        Pg(d)
        Ng(d, Rg)
        Mg(d, 0)
        d = Lg(d)
        if (8192 >= d.length) d = String.fromCharCode.apply(null, d)
        else {
          e = ''
          for (f = 0; f < d.length; f += 8192)
            e += String.fromCharCode.apply(null, Ta(d, f, f + 8192))
          d = e
        }
        b += d
        e = c.splice(0, 16)
      }
      return b.replace(/(\x00)+$/, '')
    }
    function Zg(a) {
      a = Eg(a.substring(0, 32))
      for (var b = 32 - a.length, c = 0; c < b; c++) a.push(0)
      return a
    }
    function ah(a) {
      var b = []
      bh(new ch(), a, b)
      return b.join('')
    }
    function ch() {}
    function bh(a, b, c) {
      if (null == b) c.push('null')
      else {
        if ('object' == typeof b) {
          if (qa(b)) {
            var d = b
            b = d.length
            c.push('[')
            for (var e = '', f = 0; f < b; f++) c.push(e), bh(a, d[f], c), (e = ',')
            c.push(']')
            return
          }
          if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf()
          else {
            c.push('{')
            e = ''
            for (d in b)
              Object.prototype.hasOwnProperty.call(b, d) &&
                ((f = b[d]),
                'function' != typeof f &&
                  (c.push(e), dh(d, c), c.push(':'), bh(a, f, c), (e = ',')))
            c.push('}')
            return
          }
        }
        switch (typeof b) {
          case 'string':
            dh(b, c)
            break
          case 'number':
            c.push(isFinite(b) && !isNaN(b) ? String(b) : 'null')
            break
          case 'boolean':
            c.push(String(b))
            break
          case 'function':
            c.push('null')
            break
          default:
            throw Error('Unknown type: ' + typeof b)
        }
      }
    }
    var eh = {
        '"': '\\"',
        '\\': '\\\\',
        '/': '\\/',
        '\b': '\\b',
        '\f': '\\f',
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        '\x0B': '\\u000b',
      },
      fh = /\uffff/.test('\uffff') ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g
    function dh(a, b) {
      b.push(
        '"',
        a.replace(fh, function (c) {
          var d = eh[c]
          d || ((d = '\\u' + (c.charCodeAt(0) | 65536).toString(16).substr(1)), (eh[c] = d))
          return d
        }),
        '"'
      )
    }
    function gh(a) {
      this.a = a
    }
    gh.prototype.set = function (a, b) {
      ka(b) ? this.a.set(a, ah(b)) : this.a.ra(a)
    }
    gh.prototype.get = function (a) {
      try {
        var b = this.a.get(a)
      } catch (c) {
        return
      }
      if (null !== b)
        try {
          return JSON.parse(b)
        } catch (c$3) {
          throw 'Storage: Invalid value was encountered'
        }
    }
    function hh() {}
    w(hh, yg)
    hh.prototype.clear = function () {
      var a = lb(this.ha(!0)),
        b = this
      Ha(a, function (c) {
        b.ra(c)
      })
    }
    function ih(a) {
      this.a = a
    }
    w(ih, hh)
    function jh(a) {
      if (!a.a) return !1
      try {
        return a.a.setItem('__sak', '1'), a.a.removeItem('__sak'), !0
      } catch (b) {
        return !1
      }
    }
    l = ih.prototype
    l.set = function (a, b) {
      try {
        this.a.setItem(a, b)
      } catch (c) {
        if (0 == this.a.length) throw 'Storage mechanism: Storage disabled'
        throw 'Storage mechanism: Quota exceeded'
      }
    }
    l.get = function (a) {
      a = this.a.getItem(a)
      if (!q(a) && null !== a) throw 'Storage mechanism: Invalid value was encountered'
      return a
    }
    l.ra = function (a) {
      this.a.removeItem(a)
    }
    l.ha = function (a) {
      var b = 0,
        c = this.a,
        d = new ib()
      d.next = function () {
        if (b >= c.length) throw hb
        var e = c.key(b++)
        if (a) return e
        e = c.getItem(e)
        if (!q(e)) throw 'Storage mechanism: Invalid value was encountered'
        return e
      }
      return d
    }
    l.clear = function () {
      this.a.clear()
    }
    l.key = function (a) {
      return this.a.key(a)
    }
    function kh() {
      var a = null
      try {
        a = window.localStorage || null
      } catch (b) {}
      this.a = a
    }
    w(kh, ih)
    function lh() {
      var a = null
      try {
        a = window.sessionStorage || null
      } catch (b) {}
      this.a = a
    }
    w(lh, ih)
    function mh(a, b) {
      this.g = a
      this.a = b + '::'
    }
    w(mh, hh)
    mh.prototype.set = function (a, b) {
      this.g.set(this.a + a, b)
    }
    mh.prototype.get = function (a) {
      return this.g.get(this.a + a)
    }
    mh.prototype.ra = function (a) {
      this.g.ra(this.a + a)
    }
    mh.prototype.ha = function (a) {
      var b = this.g.ha(!0),
        c = this,
        d = new ib()
      d.next = function () {
        for (var e = b.next(); e.substr(0, c.a.length) != c.a; ) e = b.next()
        return a ? e.substr(c.a.length) : c.g.get(e)
      }
      return d
    }
    jh(new kh())
    var nh,
      oh = new lh()
    nh = jh(oh) ? new mh(oh, 'firebaseui') : null
    var ph = new gh(nh),
      qh = { name: 'pendingEmailCredential', storage: ph },
      rh = { name: 'redirectStatus', storage: ph },
      sh = { name: 'redirectUrl', storage: ph },
      th = { name: 'emailForSignIn', storage: new gh(new zg(3600, '/')) },
      uh = { name: 'pendingEncryptedCredential', storage: new gh(new zg(3600, '/')) }
    function vh(a, b) {
      return a.storage.get(b ? a.name + ':' + b : a.name)
    }
    function wh(a, b) {
      a.storage.a.ra(b ? a.name + ':' + b : a.name)
    }
    function xh(a, b, c) {
      a.storage.set(c ? a.name + ':' + c : a.name, b)
    }
    function yh(a) {
      return vh(sh, a) || null
    }
    function zh(a) {
      a = vh(qh, a) || null
      return Cg(a)
    }
    function Ah(a) {
      wh(qh, a)
    }
    function Bh(a, b) {
      xh(qh, Bg(a), b)
    }
    function Ch(a) {
      return (a = vh(rh, a) || null) && 'undefined' !== typeof a.tenantId
        ? new Dg(a.tenantId)
        : null
    }
    function Dh(a, b) {
      xh(rh, { tenantId: a.a }, b)
    }
    function Eh(a, b) {
      b = vh(th, b)
      var c = null
      if (b)
        try {
          var d = $g(a, b),
            e = JSON.parse(d)
          c = (e && e.email) || null
        } catch (f) {}
      return c
    }
    function Fh(a, b) {
      b = vh(uh, b)
      var c = null
      if (b)
        try {
          var d = $g(a, b)
          c = JSON.parse(d)
        } catch (e) {}
      return Cg(c || null)
    }
    function Gh(a, b, c) {
      xh(uh, Yg(a, JSON.stringify(Bg(b))), c)
    }
    function Hh() {
      this.W = {}
    }
    function G(a, b, c) {
      if (b.toLowerCase() in a.W) throw Error('Configuration ' + b + ' has already been defined.')
      a.W[b.toLowerCase()] = c
    }
    function Ih(a, b, c) {
      if (!(b.toLowerCase() in a.W)) throw Error('Configuration ' + b + ' is not defined.')
      a.W[b.toLowerCase()] = c
    }
    Hh.prototype.get = function (a) {
      if (!(a.toLowerCase() in this.W)) throw Error('Configuration ' + a + ' is not defined.')
      return this.W[a.toLowerCase()]
    }
    function Jh(a, b) {
      a = a.get(b)
      if (!a) throw Error('Configuration ' + b + ' is required.')
      return a
    }
    function Kh() {
      this.g = void 0
      this.a = {}
    }
    l = Kh.prototype
    l.set = function (a, b) {
      Lh(this, a, b, !1)
    }
    l.add = function (a, b) {
      Lh(this, a, b, !0)
    }
    function Lh(a, b, c, d) {
      for (var e = 0; e < b.length; e++) {
        var f = b.charAt(e)
        a.a[f] || (a.a[f] = new Kh())
        a = a.a[f]
      }
      if (d && void 0 !== a.g) throw Error('The collection already contains the key "' + b + '"')
      a.g = c
    }
    l.get = function (a) {
      a: {
        for (var b = this, c = 0; c < a.length; c++)
          if (((b = b.a[a.charAt(c)]), !b)) {
            a = void 0
            break a
          }
        a = b
      }
      return a ? a.g : void 0
    }
    l.la = function () {
      var a = []
      Mh(this, a)
      return a
    }
    function Mh(a, b) {
      void 0 !== a.g && b.push(a.g)
      for (var c in a.a) Mh(a.a[c], b)
    }
    l.ja = function () {
      var a = []
      Nh(this, '', a)
      return a
    }
    function Nh(a, b, c) {
      void 0 !== a.g && c.push(b)
      for (var d in a.a) Nh(a.a[d], b + d, c)
    }
    l.clear = function () {
      this.a = {}
      this.g = void 0
    }
    function Oh(a) {
      this.a = a
      this.g = new Kh()
      for (a = 0; a < this.a.length; a++) {
        var b = this.g.get('+' + this.a[a].b)
        b ? b.push(this.a[a]) : this.g.add('+' + this.a[a].b, [this.a[a]])
      }
    }
    function Ph(a, b) {
      a = a.g
      var c = {},
        d = 0
      void 0 !== a.g && (c[d] = a.g)
      for (; d < b.length; d++) {
        var e = b.charAt(d)
        if (!(e in a.a)) break
        a = a.a[e]
        void 0 !== a.g && (c[d] = a.g)
      }
      for (var f in c) if (c.hasOwnProperty(f)) return c[f]
      return []
    }
    function Qh(a) {
      for (var b = 0; b < Rh.length; b++) if (Rh[b].c === a) return Rh[b]
      return null
    }
    function Sh(a) {
      a = a.toUpperCase()
      for (var b = [], c = 0; c < Rh.length; c++) Rh[c].f === a && b.push(Rh[c])
      return b
    }
    function Th(a) {
      if (0 < a.length && '+' == a.charAt(0)) {
        a = a.substring(1)
        for (var b = [], c = 0; c < Rh.length; c++) Rh[c].b == a && b.push(Rh[c])
        a = b
      } else a = Sh(a)
      return a
    }
    function Uh(a) {
      a.sort(function (b, c) {
        return b.name.localeCompare(c.name, 'en')
      })
    }
    var Rh = [
      { name: 'Afghanistan', c: '93-AF-0', b: '93', f: 'AF' },
      { name: '\u00c5land Islands', c: '358-AX-0', b: '358', f: 'AX' },
      { name: 'Albania', c: '355-AL-0', b: '355', f: 'AL' },
      { name: 'Algeria', c: '213-DZ-0', b: '213', f: 'DZ' },
      { name: 'American Samoa', c: '1-AS-0', b: '1', f: 'AS' },
      { name: 'Andorra', c: '376-AD-0', b: '376', f: 'AD' },
      { name: 'Angola', c: '244-AO-0', b: '244', f: 'AO' },
      { name: 'Anguilla', c: '1-AI-0', b: '1', f: 'AI' },
      { name: 'Antigua and Barbuda', c: '1-AG-0', b: '1', f: 'AG' },
      { name: 'Argentina', c: '54-AR-0', b: '54', f: 'AR' },
      { name: 'Armenia', c: '374-AM-0', b: '374', f: 'AM' },
      { name: 'Aruba', c: '297-AW-0', b: '297', f: 'AW' },
      { name: 'Ascension Island', c: '247-AC-0', b: '247', f: 'AC' },
      { name: 'Australia', c: '61-AU-0', b: '61', f: 'AU' },
      { name: 'Austria', c: '43-AT-0', b: '43', f: 'AT' },
      { name: 'Azerbaijan', c: '994-AZ-0', b: '994', f: 'AZ' },
      { name: 'Bahamas', c: '1-BS-0', b: '1', f: 'BS' },
      { name: 'Bahrain', c: '973-BH-0', b: '973', f: 'BH' },
      { name: 'Bangladesh', c: '880-BD-0', b: '880', f: 'BD' },
      { name: 'Barbados', c: '1-BB-0', b: '1', f: 'BB' },
      { name: 'Belarus', c: '375-BY-0', b: '375', f: 'BY' },
      { name: 'Belgium', c: '32-BE-0', b: '32', f: 'BE' },
      { name: 'Belize', c: '501-BZ-0', b: '501', f: 'BZ' },
      { name: 'Benin', c: '229-BJ-0', b: '229', f: 'BJ' },
      { name: 'Bermuda', c: '1-BM-0', b: '1', f: 'BM' },
      { name: 'Bhutan', c: '975-BT-0', b: '975', f: 'BT' },
      { name: 'Bolivia', c: '591-BO-0', b: '591', f: 'BO' },
      { name: 'Bosnia and Herzegovina', c: '387-BA-0', b: '387', f: 'BA' },
      { name: 'Botswana', c: '267-BW-0', b: '267', f: 'BW' },
      { name: 'Brazil', c: '55-BR-0', b: '55', f: 'BR' },
      { name: 'British Indian Ocean Territory', c: '246-IO-0', b: '246', f: 'IO' },
      { name: 'British Virgin Islands', c: '1-VG-0', b: '1', f: 'VG' },
      { name: 'Brunei', c: '673-BN-0', b: '673', f: 'BN' },
      { name: 'Bulgaria', c: '359-BG-0', b: '359', f: 'BG' },
      { name: 'Burkina Faso', c: '226-BF-0', b: '226', f: 'BF' },
      { name: 'Burundi', c: '257-BI-0', b: '257', f: 'BI' },
      { name: 'Cambodia', c: '855-KH-0', b: '855', f: 'KH' },
      { name: 'Cameroon', c: '237-CM-0', b: '237', f: 'CM' },
      { name: 'Canada', c: '1-CA-0', b: '1', f: 'CA' },
      { name: 'Cape Verde', c: '238-CV-0', b: '238', f: 'CV' },
      { name: 'Caribbean Netherlands', c: '599-BQ-0', b: '599', f: 'BQ' },
      { name: 'Cayman Islands', c: '1-KY-0', b: '1', f: 'KY' },
      { name: 'Central African Republic', c: '236-CF-0', b: '236', f: 'CF' },
      { name: 'Chad', c: '235-TD-0', b: '235', f: 'TD' },
      { name: 'Chile', c: '56-CL-0', b: '56', f: 'CL' },
      { name: 'China', c: '86-CN-0', b: '86', f: 'CN' },
      { name: 'Christmas Island', c: '61-CX-0', b: '61', f: 'CX' },
      { name: 'Cocos [Keeling] Islands', c: '61-CC-0', b: '61', f: 'CC' },
      { name: 'Colombia', c: '57-CO-0', b: '57', f: 'CO' },
      { name: 'Comoros', c: '269-KM-0', b: '269', f: 'KM' },
      { name: 'Democratic Republic Congo', c: '243-CD-0', b: '243', f: 'CD' },
      { name: 'Republic of Congo', c: '242-CG-0', b: '242', f: 'CG' },
      { name: 'Cook Islands', c: '682-CK-0', b: '682', f: 'CK' },
      { name: 'Costa Rica', c: '506-CR-0', b: '506', f: 'CR' },
      { name: "C\u00f4te d'Ivoire", c: '225-CI-0', b: '225', f: 'CI' },
      { name: 'Croatia', c: '385-HR-0', b: '385', f: 'HR' },
      { name: 'Cuba', c: '53-CU-0', b: '53', f: 'CU' },
      { name: 'Cura\u00e7ao', c: '599-CW-0', b: '599', f: 'CW' },
      { name: 'Cyprus', c: '357-CY-0', b: '357', f: 'CY' },
      { name: 'Czech Republic', c: '420-CZ-0', b: '420', f: 'CZ' },
      { name: 'Denmark', c: '45-DK-0', b: '45', f: 'DK' },
      { name: 'Djibouti', c: '253-DJ-0', b: '253', f: 'DJ' },
      { name: 'Dominica', c: '1-DM-0', b: '1', f: 'DM' },
      { name: 'Dominican Republic', c: '1-DO-0', b: '1', f: 'DO' },
      { name: 'East Timor', c: '670-TL-0', b: '670', f: 'TL' },
      { name: 'Ecuador', c: '593-EC-0', b: '593', f: 'EC' },
      { name: 'Egypt', c: '20-EG-0', b: '20', f: 'EG' },
      { name: 'El Salvador', c: '503-SV-0', b: '503', f: 'SV' },
      { name: 'Equatorial Guinea', c: '240-GQ-0', b: '240', f: 'GQ' },
      { name: 'Eritrea', c: '291-ER-0', b: '291', f: 'ER' },
      { name: 'Estonia', c: '372-EE-0', b: '372', f: 'EE' },
      { name: 'Ethiopia', c: '251-ET-0', b: '251', f: 'ET' },
      { name: 'Falkland Islands [Islas Malvinas]', c: '500-FK-0', b: '500', f: 'FK' },
      { name: 'Faroe Islands', c: '298-FO-0', b: '298', f: 'FO' },
      { name: 'Fiji', c: '679-FJ-0', b: '679', f: 'FJ' },
      { name: 'Finland', c: '358-FI-0', b: '358', f: 'FI' },
      { name: 'France', c: '33-FR-0', b: '33', f: 'FR' },
      { name: 'French Guiana', c: '594-GF-0', b: '594', f: 'GF' },
      { name: 'French Polynesia', c: '689-PF-0', b: '689', f: 'PF' },
      { name: 'Gabon', c: '241-GA-0', b: '241', f: 'GA' },
      { name: 'Gambia', c: '220-GM-0', b: '220', f: 'GM' },
      { name: 'Georgia', c: '995-GE-0', b: '995', f: 'GE' },
      { name: 'Germany', c: '49-DE-0', b: '49', f: 'DE' },
      { name: 'Ghana', c: '233-GH-0', b: '233', f: 'GH' },
      { name: 'Gibraltar', c: '350-GI-0', b: '350', f: 'GI' },
      { name: 'Greece', c: '30-GR-0', b: '30', f: 'GR' },
      { name: 'Greenland', c: '299-GL-0', b: '299', f: 'GL' },
      { name: 'Grenada', c: '1-GD-0', b: '1', f: 'GD' },
      { name: 'Guadeloupe', c: '590-GP-0', b: '590', f: 'GP' },
      { name: 'Guam', c: '1-GU-0', b: '1', f: 'GU' },
      { name: 'Guatemala', c: '502-GT-0', b: '502', f: 'GT' },
      { name: 'Guernsey', c: '44-GG-0', b: '44', f: 'GG' },
      { name: 'Guinea Conakry', c: '224-GN-0', b: '224', f: 'GN' },
      { name: 'Guinea-Bissau', c: '245-GW-0', b: '245', f: 'GW' },
      { name: 'Guyana', c: '592-GY-0', b: '592', f: 'GY' },
      { name: 'Haiti', c: '509-HT-0', b: '509', f: 'HT' },
      { name: 'Heard Island and McDonald Islands', c: '672-HM-0', b: '672', f: 'HM' },
      { name: 'Honduras', c: '504-HN-0', b: '504', f: 'HN' },
      { name: 'Hong Kong', c: '852-HK-0', b: '852', f: 'HK' },
      { name: 'Hungary', c: '36-HU-0', b: '36', f: 'HU' },
      { name: 'Iceland', c: '354-IS-0', b: '354', f: 'IS' },
      { name: 'India', c: '91-IN-0', b: '91', f: 'IN' },
      { name: 'Indonesia', c: '62-ID-0', b: '62', f: 'ID' },
      { name: 'Iran', c: '98-IR-0', b: '98', f: 'IR' },
      { name: 'Iraq', c: '964-IQ-0', b: '964', f: 'IQ' },
      { name: 'Ireland', c: '353-IE-0', b: '353', f: 'IE' },
      { name: 'Isle of Man', c: '44-IM-0', b: '44', f: 'IM' },
      { name: 'Israel', c: '972-IL-0', b: '972', f: 'IL' },
      { name: 'Italy', c: '39-IT-0', b: '39', f: 'IT' },
      { name: 'Jamaica', c: '1-JM-0', b: '1', f: 'JM' },
      { name: 'Japan', c: '81-JP-0', b: '81', f: 'JP' },
      { name: 'Jersey', c: '44-JE-0', b: '44', f: 'JE' },
      { name: 'Jordan', c: '962-JO-0', b: '962', f: 'JO' },
      { name: 'Kazakhstan', c: '7-KZ-0', b: '7', f: 'KZ' },
      { name: 'Kenya', c: '254-KE-0', b: '254', f: 'KE' },
      { name: 'Kiribati', c: '686-KI-0', b: '686', f: 'KI' },
      { name: 'Kosovo', c: '377-XK-0', b: '377', f: 'XK' },
      { name: 'Kosovo', c: '381-XK-0', b: '381', f: 'XK' },
      { name: 'Kosovo', c: '386-XK-0', b: '386', f: 'XK' },
      { name: 'Kuwait', c: '965-KW-0', b: '965', f: 'KW' },
      { name: 'Kyrgyzstan', c: '996-KG-0', b: '996', f: 'KG' },
      { name: 'Laos', c: '856-LA-0', b: '856', f: 'LA' },
      { name: 'Latvia', c: '371-LV-0', b: '371', f: 'LV' },
      { name: 'Lebanon', c: '961-LB-0', b: '961', f: 'LB' },
      { name: 'Lesotho', c: '266-LS-0', b: '266', f: 'LS' },
      { name: 'Liberia', c: '231-LR-0', b: '231', f: 'LR' },
      { name: 'Libya', c: '218-LY-0', b: '218', f: 'LY' },
      { name: 'Liechtenstein', c: '423-LI-0', b: '423', f: 'LI' },
      { name: 'Lithuania', c: '370-LT-0', b: '370', f: 'LT' },
      { name: 'Luxembourg', c: '352-LU-0', b: '352', f: 'LU' },
      { name: 'Macau', c: '853-MO-0', b: '853', f: 'MO' },
      { name: 'Macedonia', c: '389-MK-0', b: '389', f: 'MK' },
      { name: 'Madagascar', c: '261-MG-0', b: '261', f: 'MG' },
      { name: 'Malawi', c: '265-MW-0', b: '265', f: 'MW' },
      { name: 'Malaysia', c: '60-MY-0', b: '60', f: 'MY' },
      { name: 'Maldives', c: '960-MV-0', b: '960', f: 'MV' },
      { name: 'Mali', c: '223-ML-0', b: '223', f: 'ML' },
      { name: 'Malta', c: '356-MT-0', b: '356', f: 'MT' },
      { name: 'Marshall Islands', c: '692-MH-0', b: '692', f: 'MH' },
      { name: 'Martinique', c: '596-MQ-0', b: '596', f: 'MQ' },
      { name: 'Mauritania', c: '222-MR-0', b: '222', f: 'MR' },
      { name: 'Mauritius', c: '230-MU-0', b: '230', f: 'MU' },
      { name: 'Mayotte', c: '262-YT-0', b: '262', f: 'YT' },
      { name: 'Mexico', c: '52-MX-0', b: '52', f: 'MX' },
      { name: 'Micronesia', c: '691-FM-0', b: '691', f: 'FM' },
      { name: 'Moldova', c: '373-MD-0', b: '373', f: 'MD' },
      { name: 'Monaco', c: '377-MC-0', b: '377', f: 'MC' },
      { name: 'Mongolia', c: '976-MN-0', b: '976', f: 'MN' },
      { name: 'Montenegro', c: '382-ME-0', b: '382', f: 'ME' },
      { name: 'Montserrat', c: '1-MS-0', b: '1', f: 'MS' },
      { name: 'Morocco', c: '212-MA-0', b: '212', f: 'MA' },
      { name: 'Mozambique', c: '258-MZ-0', b: '258', f: 'MZ' },
      { name: 'Myanmar [Burma]', c: '95-MM-0', b: '95', f: 'MM' },
      { name: 'Namibia', c: '264-NA-0', b: '264', f: 'NA' },
      { name: 'Nauru', c: '674-NR-0', b: '674', f: 'NR' },
      { name: 'Nepal', c: '977-NP-0', b: '977', f: 'NP' },
      { name: 'Netherlands', c: '31-NL-0', b: '31', f: 'NL' },
      { name: 'New Caledonia', c: '687-NC-0', b: '687', f: 'NC' },
      { name: 'New Zealand', c: '64-NZ-0', b: '64', f: 'NZ' },
      { name: 'Nicaragua', c: '505-NI-0', b: '505', f: 'NI' },
      { name: 'Niger', c: '227-NE-0', b: '227', f: 'NE' },
      { name: 'Nigeria', c: '234-NG-0', b: '234', f: 'NG' },
      { name: 'Niue', c: '683-NU-0', b: '683', f: 'NU' },
      { name: 'Norfolk Island', c: '672-NF-0', b: '672', f: 'NF' },
      { name: 'North Korea', c: '850-KP-0', b: '850', f: 'KP' },
      { name: 'Northern Mariana Islands', c: '1-MP-0', b: '1', f: 'MP' },
      { name: 'Norway', c: '47-NO-0', b: '47', f: 'NO' },
      { name: 'Oman', c: '968-OM-0', b: '968', f: 'OM' },
      { name: 'Pakistan', c: '92-PK-0', b: '92', f: 'PK' },
      { name: 'Palau', c: '680-PW-0', b: '680', f: 'PW' },
      { name: 'Palestinian Territories', c: '970-PS-0', b: '970', f: 'PS' },
      { name: 'Panama', c: '507-PA-0', b: '507', f: 'PA' },
      { name: 'Papua New Guinea', c: '675-PG-0', b: '675', f: 'PG' },
      { name: 'Paraguay', c: '595-PY-0', b: '595', f: 'PY' },
      { name: 'Peru', c: '51-PE-0', b: '51', f: 'PE' },
      { name: 'Philippines', c: '63-PH-0', b: '63', f: 'PH' },
      { name: 'Poland', c: '48-PL-0', b: '48', f: 'PL' },
      { name: 'Portugal', c: '351-PT-0', b: '351', f: 'PT' },
      { name: 'Puerto Rico', c: '1-PR-0', b: '1', f: 'PR' },
      { name: 'Qatar', c: '974-QA-0', b: '974', f: 'QA' },
      { name: 'R\u00e9union', c: '262-RE-0', b: '262', f: 'RE' },
      { name: 'Romania', c: '40-RO-0', b: '40', f: 'RO' },
      { name: 'Russia', c: '7-RU-0', b: '7', f: 'RU' },
      { name: 'Rwanda', c: '250-RW-0', b: '250', f: 'RW' },
      { name: 'Saint Barth\u00e9lemy', c: '590-BL-0', b: '590', f: 'BL' },
      { name: 'Saint Helena', c: '290-SH-0', b: '290', f: 'SH' },
      { name: 'St. Kitts', c: '1-KN-0', b: '1', f: 'KN' },
      { name: 'St. Lucia', c: '1-LC-0', b: '1', f: 'LC' },
      { name: 'Saint Martin', c: '590-MF-0', b: '590', f: 'MF' },
      { name: 'Saint Pierre and Miquelon', c: '508-PM-0', b: '508', f: 'PM' },
      { name: 'St. Vincent', c: '1-VC-0', b: '1', f: 'VC' },
      { name: 'Samoa', c: '685-WS-0', b: '685', f: 'WS' },
      { name: 'San Marino', c: '378-SM-0', b: '378', f: 'SM' },
      { name: 'S\u00e3o Tom\u00e9 and Pr\u00edncipe', c: '239-ST-0', b: '239', f: 'ST' },
      { name: 'Saudi Arabia', c: '966-SA-0', b: '966', f: 'SA' },
      { name: 'Senegal', c: '221-SN-0', b: '221', f: 'SN' },
      { name: 'Serbia', c: '381-RS-0', b: '381', f: 'RS' },
      { name: 'Seychelles', c: '248-SC-0', b: '248', f: 'SC' },
      { name: 'Sierra Leone', c: '232-SL-0', b: '232', f: 'SL' },
      { name: 'Singapore', c: '65-SG-0', b: '65', f: 'SG' },
      { name: 'Sint Maarten', c: '1-SX-0', b: '1', f: 'SX' },
      { name: 'Slovakia', c: '421-SK-0', b: '421', f: 'SK' },
      { name: 'Slovenia', c: '386-SI-0', b: '386', f: 'SI' },
      { name: 'Solomon Islands', c: '677-SB-0', b: '677', f: 'SB' },
      { name: 'Somalia', c: '252-SO-0', b: '252', f: 'SO' },
      { name: 'South Africa', c: '27-ZA-0', b: '27', f: 'ZA' },
      { name: 'South Georgia and the South Sandwich Islands', c: '500-GS-0', b: '500', f: 'GS' },
      { name: 'South Korea', c: '82-KR-0', b: '82', f: 'KR' },
      { name: 'South Sudan', c: '211-SS-0', b: '211', f: 'SS' },
      { name: 'Spain', c: '34-ES-0', b: '34', f: 'ES' },
      { name: 'Sri Lanka', c: '94-LK-0', b: '94', f: 'LK' },
      { name: 'Sudan', c: '249-SD-0', b: '249', f: 'SD' },
      { name: 'Suriname', c: '597-SR-0', b: '597', f: 'SR' },
      { name: 'Svalbard and Jan Mayen', c: '47-SJ-0', b: '47', f: 'SJ' },
      { name: 'Swaziland', c: '268-SZ-0', b: '268', f: 'SZ' },
      { name: 'Sweden', c: '46-SE-0', b: '46', f: 'SE' },
      { name: 'Switzerland', c: '41-CH-0', b: '41', f: 'CH' },
      { name: 'Syria', c: '963-SY-0', b: '963', f: 'SY' },
      { name: 'Taiwan', c: '886-TW-0', b: '886', f: 'TW' },
      { name: 'Tajikistan', c: '992-TJ-0', b: '992', f: 'TJ' },
      { name: 'Tanzania', c: '255-TZ-0', b: '255', f: 'TZ' },
      { name: 'Thailand', c: '66-TH-0', b: '66', f: 'TH' },
      { name: 'Togo', c: '228-TG-0', b: '228', f: 'TG' },
      { name: 'Tokelau', c: '690-TK-0', b: '690', f: 'TK' },
      { name: 'Tonga', c: '676-TO-0', b: '676', f: 'TO' },
      { name: 'Trinidad/Tobago', c: '1-TT-0', b: '1', f: 'TT' },
      { name: 'Tunisia', c: '216-TN-0', b: '216', f: 'TN' },
      { name: 'Turkey', c: '90-TR-0', b: '90', f: 'TR' },
      { name: 'Turkmenistan', c: '993-TM-0', b: '993', f: 'TM' },
      { name: 'Turks and Caicos Islands', c: '1-TC-0', b: '1', f: 'TC' },
      { name: 'Tuvalu', c: '688-TV-0', b: '688', f: 'TV' },
      { name: 'U.S. Virgin Islands', c: '1-VI-0', b: '1', f: 'VI' },
      { name: 'Uganda', c: '256-UG-0', b: '256', f: 'UG' },
      { name: 'Ukraine', c: '380-UA-0', b: '380', f: 'UA' },
      { name: 'United Arab Emirates', c: '971-AE-0', b: '971', f: 'AE' },
      { name: 'United Kingdom', c: '44-GB-0', b: '44', f: 'GB' },
      { name: 'United States', c: '1-US-0', b: '1', f: 'US' },
      { name: 'Uruguay', c: '598-UY-0', b: '598', f: 'UY' },
      { name: 'Uzbekistan', c: '998-UZ-0', b: '998', f: 'UZ' },
      { name: 'Vanuatu', c: '678-VU-0', b: '678', f: 'VU' },
      { name: 'Vatican City', c: '379-VA-0', b: '379', f: 'VA' },
      { name: 'Venezuela', c: '58-VE-0', b: '58', f: 'VE' },
      { name: 'Vietnam', c: '84-VN-0', b: '84', f: 'VN' },
      { name: 'Wallis and Futuna', c: '681-WF-0', b: '681', f: 'WF' },
      { name: 'Western Sahara', c: '212-EH-0', b: '212', f: 'EH' },
      { name: 'Yemen', c: '967-YE-0', b: '967', f: 'YE' },
      { name: 'Zambia', c: '260-ZM-0', b: '260', f: 'ZM' },
      { name: 'Zimbabwe', c: '263-ZW-0', b: '263', f: 'ZW' },
    ]
    Uh(Rh)
    var Vh = new Oh(Rh)
    function Wh(a, b) {
      this.a = a
      this.Aa = b
    }
    function Xh(a) {
      a = Ua(a)
      var b = Ph(Vh, a)
      return 0 < b.length
        ? new Wh('1' == b[0].b ? '1-US-0' : b[0].c, Ua(a.substr(b[0].b.length + 1)))
        : null
    }
    function Yh(a) {
      var b = Qh(a.a)
      if (!b) throw Error('Country ID ' + a.a + ' not found.')
      return '+' + b.b + a.Aa
    }
    function Zh(a, b) {
      for (var c = 0; c < a.length; c++)
        if (!Ma($h, a[c]) && ((null !== ai && a[c] in ai) || Ma(b, a[c]))) return a[c]
      return null
    }
    var $h = ['emailLink', 'password', 'phone'],
      ai = {
        'facebook.com': 'FacebookAuthProvider',
        'github.com': 'GithubAuthProvider',
        'google.com': 'GoogleAuthProvider',
        password: 'EmailAuthProvider',
        'twitter.com': 'TwitterAuthProvider',
        phone: 'PhoneAuthProvider',
      }
    function bi() {
      this.a = new Hh()
      G(this.a, 'acUiConfig')
      G(this.a, 'autoUpgradeAnonymousUsers')
      G(this.a, 'callbacks')
      G(this.a, 'credentialHelper', ci)
      G(this.a, 'immediateFederatedRedirect', !1)
      G(this.a, 'popupMode', !1)
      G(this.a, 'privacyPolicyUrl')
      G(this.a, 'queryParameterForSignInSuccessUrl', 'signInSuccessUrl')
      G(this.a, 'queryParameterForWidgetMode', 'mode')
      G(this.a, 'signInFlow')
      G(this.a, 'signInOptions')
      G(this.a, 'signInSuccessUrl')
      G(this.a, 'siteName')
      G(this.a, 'tosUrl')
      G(this.a, 'widgetUrl')
      G(this.a, 'adminRestrictedOperation')
    }
    function di(a) {
      var b = !!a.a.get('autoUpgradeAnonymousUsers')
      b &&
        !ei(a) &&
        og(
          'Missing "signInFailure" callback: "signInFailure" callback needs to be provided when "autoUpgradeAnonymousUsers" is set to true.',
          void 0
        )
      return b
    }
    function fi(a) {
      a = a.a.get('signInOptions') || []
      for (var b = [], c = 0; c < a.length; c++) {
        var d = a[c]
        d = ta(d) ? d : { provider: d }
        d.provider && b.push(d)
      }
      return b
    }
    function gi(a, b) {
      a = fi(a)
      for (var c = 0; c < a.length; c++) if (a[c].provider === b) return a[c]
      return null
    }
    function hi(a) {
      return fi(a).map(function (b) {
        return b.provider
      })
    }
    function ii(a, b) {
      a = ji(a)
      for (var c = 0; c < a.length; c++) if (a[c].providerId === b) return a[c]
      return null
    }
    function ji(a) {
      return fi(a).map(function (b) {
        if (ai[b.provider] || Ma(ki, b.provider)) {
          b = {
            providerId: b.provider,
            S: b.providerName || null,
            V: b.fullLabel || null,
            ta: b.buttonColor || null,
            za: b.iconUrl ? zc(Bc(b.iconUrl)).toString() : null,
          }
          for (var c in b) null === b[c] && delete b[c]
          return b
        }
        return {
          providerId: b.provider,
          S: b.providerName || null,
          V: b.fullLabel || null,
          ta: b.buttonColor || null,
          za: b.iconUrl ? zc(Bc(b.iconUrl)).toString() : null,
          Ob: b.loginHintKey || null,
        }
      })
    }
    function li(a) {
      var b = gi(a, firebase.auth.GoogleAuthProvider.PROVIDER_ID)
      return b && b.clientId && mi(a) === ni ? b.clientId || null : null
    }
    function oi(a) {
      a = gi(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)
      return !!(a && a.disableSignUp && a.disableSignUp.status)
    }
    function pi(a) {
      a = a.a.get('adminRestrictedOperation') || null
      return !(!a || !a.status)
    }
    function qi(a) {
      var b = null
      fi(a).forEach(function (d) {
        d.provider == firebase.auth.PhoneAuthProvider.PROVIDER_ID &&
          ta(d.recaptchaParameters) &&
          !Array.isArray(d.recaptchaParameters) &&
          (b = eb(d.recaptchaParameters))
      })
      if (b) {
        var c = []
        ri.forEach(function (d) {
          'undefined' !== typeof b[d] && (c.push(d), delete b[d])
        })
        c.length &&
          tg('The following provided "recaptchaParameters" keys are not allowed: ' + c.join(', '))
      }
      return b
    }
    function si(a) {
      return (a = a.a.get('adminRestrictedOperation')) && a.adminEmail ? a.adminEmail : null
    }
    function ti(a) {
      if ((a = a.a.get('adminRestrictedOperation') || null)) {
        var b = a.helpLink || null
        if (b && 'string' === typeof b)
          return function () {
            rf(b)
          }
      }
      return null
    }
    function ui(a) {
      return (
        ((a = gi(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) &&
          a.disableSignUp &&
          a.disableSignUp.adminEmail) ||
        null
      )
    }
    function vi(a) {
      if ((a = gi(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) && a.disableSignUp) {
        var b = a.disableSignUp.helpLink || null
        if (b && 'string' === typeof b)
          return function () {
            rf(b)
          }
      }
      return null
    }
    function wi(a, b) {
      a = (a = gi(a, b)) && a.scopes
      return Array.isArray(a) ? a : []
    }
    function xi(a, b) {
      a = (a = gi(a, b)) && a.customParameters
      return ta(a)
        ? ((a = eb(a)),
          b === firebase.auth.GoogleAuthProvider.PROVIDER_ID && delete a.login_hint,
          b === firebase.auth.GithubAuthProvider.PROVIDER_ID && delete a.login,
          a)
        : null
    }
    function yi(a) {
      a = gi(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID)
      var b = null
      a && 'string' === typeof a.loginHint && (b = Xh(a.loginHint))
      return (a && a.defaultNationalNumber) || (b && b.Aa) || null
    }
    function zi(a) {
      var b = ((a = gi(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID)) && a.defaultCountry) || null
      b = b && Sh(b)
      var c = null
      a && 'string' === typeof a.loginHint && (c = Xh(a.loginHint))
      return (b && b[0]) || (c && Qh(c.a)) || null
    }
    function Ai(a) {
      a = gi(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID)
      if (!a) return null
      var b = a.whitelistedCountries,
        c = a.blacklistedCountries
      if ('undefined' !== typeof b && (!Array.isArray(b) || 0 == b.length))
        throw Error('WhitelistedCountries must be a non-empty array.')
      if ('undefined' !== typeof c && !Array.isArray(c))
        throw Error('BlacklistedCountries must be an array.')
      if (b && c) throw Error('Both whitelistedCountries and blacklistedCountries are provided.')
      if (!b && !c) return Rh
      a = []
      if (b) {
        c = {}
        for (var d = 0; d < b.length; d++) {
          var e = Th(b[d])
          for (var f = 0; f < e.length; f++) c[e[f].c] = e[f]
        }
        for (var g in c) c.hasOwnProperty(g) && a.push(c[g])
      } else {
        g = {}
        for (b = 0; b < c.length; b++) for (e = Th(c[b]), d = 0; d < e.length; d++) g[e[d].c] = e[d]
        for (e = 0; e < Rh.length; e++) (null !== g && Rh[e].c in g) || a.push(Rh[e])
      }
      return a
    }
    function Bi(a) {
      return Jh(a.a, 'queryParameterForWidgetMode')
    }
    function H(a) {
      var b = a.a.get('tosUrl') || null
      a = a.a.get('privacyPolicyUrl') || null
      b && !a && tg('Privacy Policy URL is missing, the link will not be displayed.')
      if (b && a) {
        if ('function' === typeof b) return b
        if ('string' === typeof b)
          return function () {
            rf(b)
          }
      }
      return null
    }
    function J(a) {
      var b = a.a.get('tosUrl') || null,
        c = a.a.get('privacyPolicyUrl') || null
      c && !b && tg('Term of Service URL is missing, the link will not be displayed.')
      if (b && c) {
        if ('function' === typeof c) return c
        if ('string' === typeof c)
          return function () {
            rf(c)
          }
      }
      return null
    }
    function Ci(a) {
      return (a = gi(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) &&
        'undefined' !== typeof a.requireDisplayName
        ? !!a.requireDisplayName
        : !0
    }
    function Di(a) {
      a = gi(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)
      return !(!a || a.signInMethod !== firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD)
    }
    function Ei(a) {
      a = gi(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)
      return !(!a || !a.forceSameDevice)
    }
    function Fi(a) {
      if (Di(a)) {
        var b = { url: tf(), handleCodeInApp: !0 }
        ;(a = gi(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) &&
          'function' === typeof a.emailLinkSignIn &&
          gb(b, a.emailLinkSignIn())
        a = b.url
        var c = tf()
        c instanceof vb || (c = Jb(c))
        a instanceof vb || (a = Jb(a))
        var d = c
        c = new vb(d)
        var e = !!a.j
        e ? wb(c, a.j) : (e = !!a.A)
        e ? (c.A = a.A) : (e = !!a.h)
        e ? (c.h = a.h) : (e = null != a.C)
        var f = a.g
        if (e) xb(c, a.C)
        else if ((e = !!a.g))
          if (
            ('/' != f.charAt(0) &&
              (d.h && !d.g
                ? (f = '/' + f)
                : ((d = c.g.lastIndexOf('/')), -1 != d && (f = c.g.substr(0, d + 1) + f))),
            '..' == f || '.' == f)
          )
            f = ''
          else if (-1 != f.indexOf('./') || -1 != f.indexOf('/.')) {
            d = 0 == f.lastIndexOf('/', 0)
            f = f.split('/')
            for (var g = [], h = 0; h < f.length; ) {
              var k = f[h++]
              '.' == k
                ? d && h == f.length && g.push('')
                : '..' == k
                ? ((1 < g.length || (1 == g.length && '' != g[0])) && g.pop(),
                  d && h == f.length && g.push(''))
                : (g.push(k), (d = !0))
            }
            f = g.join('/')
          }
        e ? (c.g = f) : (e = '' !== a.a.toString())
        e ? yb(c, zb(a.a)) : (e = !!a.s)
        e && (c.s = a.s)
        b.url = c.toString()
        return b
      }
      return null
    }
    function Gi(a) {
      var b = !!a.a.get('immediateFederatedRedirect'),
        c = hi(a)
      a = Hi(a)
      return b && 1 == c.length && !Ma($h, c[0]) && a == Ii
    }
    function Hi(a) {
      a = a.a.get('signInFlow')
      for (var b in Ji) if (Ji[b] == a) return Ji[b]
      return Ii
    }
    function Ki(a) {
      return Li(a).signInSuccess || null
    }
    function Mi(a) {
      return Li(a).signInSuccessWithAuthResult || null
    }
    function ei(a) {
      return Li(a).signInFailure || null
    }
    function Li(a) {
      return a.a.get('callbacks') || {}
    }
    function mi(a) {
      if (
        'http:' !== (window.location && window.location.protocol) &&
        'https:' !== (window.location && window.location.protocol)
      )
        return ci
      a = a.a.get('credentialHelper')
      if (a === Ni) return ci
      for (var b in Oi) if (Oi[b] === a) return Oi[b]
      return ci
    }
    var Ni = 'accountchooser.com',
      ni = 'googleyolo',
      ci = 'none',
      Oi = { lc: Ni, oc: ni, NONE: ci },
      Ii = 'redirect',
      Ji = { rc: 'popup', sc: Ii },
      Pi = {
        nc: 'callback',
        RECOVER_EMAIL: 'recoverEmail',
        tc: 'resetPassword',
        REVERT_SECOND_FACTOR_ADDITION: 'revertSecondFactorAddition',
        uc: 'select',
        vc: 'signIn',
        VERIFY_AND_CHANGE_EMAIL: 'verifyAndChangeEmail',
        VERIFY_EMAIL: 'verifyEmail',
      },
      ki = ['anonymous'],
      ri = ['sitekey', 'tabindex', 'callback', 'expired-callback']
    var Qi,
      Ri,
      Si,
      Ti,
      K = {}
    function L(a, b, c, d) {
      K[a].apply(null, Array.prototype.slice.call(arguments, 1))
    }
    function Ui(a) {
      if (a.classList) return a.classList
      a = a.className
      return (q(a) && a.match(/\S+/g)) || []
    }
    function Vi(a, b) {
      return a.classList ? a.classList.contains(b) : Ma(Ui(a), b)
    }
    function Wi(a, b) {
      a.classList
        ? a.classList.add(b)
        : Vi(a, b) || (a.className += 0 < a.className.length ? ' ' + b : b)
    }
    function Xi(a, b) {
      a.classList
        ? a.classList.remove(b)
        : Vi(a, b) &&
          (a.className = Ja(Ui(a), function (c) {
            return c != b
          }).join(' '))
    }
    function Yi(a) {
      var b = a.type
      switch (q(b) && b.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          return a.checked ? a.value : null
        case 'select-one':
          return (b = a.selectedIndex), 0 <= b ? a.options[b].value : null
        case 'select-multiple':
          b = []
          for (var c, d = 0; (c = a.options[d]); d++) c.selected && b.push(c.value)
          return b.length ? b : null
        default:
          return null != a.value ? a.value : null
      }
    }
    function Zi(a, b) {
      var c = a.type
      switch (q(c) && c.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          a.checked = b
          break
        case 'select-one':
          a.selectedIndex = -1
          if (q(b))
            for (var d = 0; (c = a.options[d]); d++)
              if (c.value == b) {
                c.selected = !0
                break
              }
          break
        case 'select-multiple':
          q(b) && (b = [b])
          for (d = 0; (c = a.options[d]); d++)
            if (((c.selected = !1), b))
              for (var e, f = 0; (e = b[f]); f++) c.value == e && (c.selected = !0)
          break
        default:
          a.value = null != b ? b : ''
      }
    }
    function $i(a) {
      if ((a.altKey && !a.ctrlKey) || a.metaKey || (112 <= a.keyCode && 123 >= a.keyCode)) return !1
      if (aj(a.keyCode)) return !0
      switch (a.keyCode) {
        case 18:
        case 20:
        case 93:
        case 17:
        case 40:
        case 35:
        case 27:
        case 36:
        case 45:
        case 37:
        case 224:
        case 91:
        case 144:
        case 12:
        case 34:
        case 33:
        case 19:
        case 255:
        case 44:
        case 39:
        case 145:
        case 16:
        case 38:
        case 252:
        case 224:
        case 92:
          return !1
        case 0:
          return !dc
        default:
          return 166 > a.keyCode || 183 < a.keyCode
      }
    }
    function bj(a, b, c, d, e, f) {
      if (ec && !mc('525')) return !0
      if (gc && e) return aj(a)
      if (e && !d) return !1
      if (!dc) {
        'number' == typeof b && (b = cj(b))
        var g = 17 == b || 18 == b || (gc && 91 == b)
        if (((!c || gc) && g) || (gc && 16 == b && (d || f))) return !1
      }
      if ((ec || bc) && d && c)
        switch (a) {
          case 220:
          case 219:
          case 221:
          case 192:
          case 186:
          case 189:
          case 187:
          case 188:
          case 190:
          case 191:
          case 192:
          case 222:
            return !1
        }
      if (z && d && b == a) return !1
      switch (a) {
        case 13:
          return dc ? (f || e ? !1 : !(c && d)) : !0
        case 27:
          return !(ec || bc || dc)
      }
      return dc && (d || e || f) ? !1 : aj(a)
    }
    function aj(a) {
      if (
        (48 <= a && 57 >= a) ||
        (96 <= a && 106 >= a) ||
        (65 <= a && 90 >= a) ||
        ((ec || bc) && 0 == a)
      )
        return !0
      switch (a) {
        case 32:
        case 43:
        case 63:
        case 64:
        case 107:
        case 109:
        case 110:
        case 111:
        case 186:
        case 59:
        case 189:
        case 187:
        case 61:
        case 188:
        case 190:
        case 191:
        case 192:
        case 222:
        case 219:
        case 220:
        case 221:
        case 163:
          return !0
        case 173:
          return dc
        default:
          return !1
      }
    }
    function cj(a) {
      if (dc) a = dj(a)
      else if (gc && ec)
        switch (a) {
          case 93:
            a = 91
        }
      return a
    }
    function dj(a) {
      switch (a) {
        case 61:
          return 187
        case 59:
          return 186
        case 173:
          return 189
        case 224:
          return 91
        case 0:
          return 224
        default:
          return a
      }
    }
    function ej(a) {
      E.call(this)
      this.a = a
      ke(a, 'keydown', this.g, !1, this)
      ke(a, 'click', this.h, !1, this)
    }
    w(ej, E)
    ej.prototype.g = function (a) {
      ;(13 == a.keyCode || (ec && 3 == a.keyCode)) && fj(this, a)
    }
    ej.prototype.h = function (a) {
      fj(this, a)
    }
    function fj(a, b) {
      var c = new gj(b)
      if (xe(a, c)) {
        c = new hj(b)
        try {
          xe(a, c)
        } finally {
          b.stopPropagation()
        }
      }
    }
    ej.prototype.o = function () {
      ej.K.o.call(this)
      se(this.a, 'keydown', this.g, !1, this)
      se(this.a, 'click', this.h, !1, this)
      delete this.a
    }
    function hj(a) {
      Zd.call(this, a.a)
      this.type = 'action'
    }
    w(hj, Zd)
    function gj(a) {
      Zd.call(this, a.a)
      this.type = 'beforeaction'
    }
    w(gj, Zd)
    function ij(a) {
      E.call(this)
      this.a = a
      a = z ? 'focusout' : 'blur'
      this.g = ke(this.a, z ? 'focusin' : 'focus', this, !z)
      this.h = ke(this.a, a, this, !z)
    }
    w(ij, E)
    ij.prototype.handleEvent = function (a) {
      var b = new Zd(a.a)
      b.type = 'focusin' == a.type || 'focus' == a.type ? 'focusin' : 'focusout'
      xe(this, b)
    }
    ij.prototype.o = function () {
      ij.K.o.call(this)
      te(this.g)
      te(this.h)
      delete this.a
    }
    function jj(a, b) {
      E.call(this)
      this.g = a || 1
      this.a = b || n
      this.h = r(this.gc, this)
      this.j = Aa()
    }
    w(jj, E)
    l = jj.prototype
    l.Ka = !1
    l.aa = null
    l.gc = function () {
      if (this.Ka) {
        var a = Aa() - this.j
        0 < a && a < 0.8 * this.g
          ? (this.aa = this.a.setTimeout(this.h, this.g - a))
          : (this.aa && (this.a.clearTimeout(this.aa), (this.aa = null)),
            xe(this, 'tick'),
            this.Ka && (kj(this), this.start()))
      }
    }
    l.start = function () {
      this.Ka = !0
      this.aa || ((this.aa = this.a.setTimeout(this.h, this.g)), (this.j = Aa()))
    }
    function kj(a) {
      a.Ka = !1
      a.aa && (a.a.clearTimeout(a.aa), (a.aa = null))
    }
    l.o = function () {
      jj.K.o.call(this)
      kj(this)
      delete this.a
    }
    function lj(a, b) {
      if (sa(a)) b && (a = r(a, b))
      else if (a && 'function' == typeof a.handleEvent) a = r(a.handleEvent, a)
      else throw Error('Invalid listener argument')
      return 2147483647 < Number(0) ? -1 : n.setTimeout(a, 0)
    }
    function mj(a) {
      Pd.call(this)
      this.g = a
      this.a = {}
    }
    w(mj, Pd)
    var nj = []
    function oj(a, b, c, d) {
      qa(c) || (c && (nj[0] = c.toString()), (c = nj))
      for (var e = 0; e < c.length; e++) {
        var f = ke(b, c[e], d || a.handleEvent, !1, a.g || a)
        if (!f) break
        a.a[f.key] = f
      }
    }
    function pj(a) {
      db(
        a.a,
        function (b, c) {
          this.a.hasOwnProperty(c) && te(b)
        },
        a
      )
      a.a = {}
    }
    mj.prototype.o = function () {
      mj.K.o.call(this)
      pj(this)
    }
    mj.prototype.handleEvent = function () {
      throw Error('EventHandler.handleEvent not implemented')
    }
    function qj(a) {
      E.call(this)
      this.a = null
      this.g = a
      a = z || bc || (ec && !mc('531') && 'TEXTAREA' == a.tagName)
      this.h = new mj(this)
      oj(this.h, this.g, a ? ['keydown', 'paste', 'cut', 'drop', 'input'] : 'input', this)
    }
    w(qj, E)
    qj.prototype.handleEvent = function (a) {
      if ('input' == a.type)
        (z && mc(10) && 0 == a.keyCode && 0 == a.j) || (rj(this), xe(this, sj(a)))
      else if ('keydown' != a.type || $i(a)) {
        var b = 'keydown' == a.type ? this.g.value : null
        z && 229 == a.keyCode && (b = null)
        var c = sj(a)
        rj(this)
        this.a = lj(function () {
          this.a = null
          this.g.value != b && xe(this, c)
        }, this)
      }
    }
    function rj(a) {
      null != a.a && (n.clearTimeout(a.a), (a.a = null))
    }
    function sj(a) {
      a = new Zd(a.a)
      a.type = 'input'
      return a
    }
    qj.prototype.o = function () {
      qj.K.o.call(this)
      this.h.m()
      rj(this)
      delete this.g
    }
    function tj(a, b) {
      E.call(this)
      a &&
        (this.Oa && uj(this),
        (this.qa = a),
        (this.Na = ke(this.qa, 'keypress', this, b)),
        (this.Ya = ke(this.qa, 'keydown', this.Jb, b, this)),
        (this.Oa = ke(this.qa, 'keyup', this.Kb, b, this)))
    }
    w(tj, E)
    l = tj.prototype
    l.qa = null
    l.Na = null
    l.Ya = null
    l.Oa = null
    l.R = -1
    l.X = -1
    l.Ua = !1
    var vj = {
        3: 13,
        12: 144,
        63232: 38,
        63233: 40,
        63234: 37,
        63235: 39,
        63236: 112,
        63237: 113,
        63238: 114,
        63239: 115,
        63240: 116,
        63241: 117,
        63242: 118,
        63243: 119,
        63244: 120,
        63245: 121,
        63246: 122,
        63247: 123,
        63248: 44,
        63272: 46,
        63273: 36,
        63275: 35,
        63276: 33,
        63277: 34,
        63289: 144,
        63302: 45,
      },
      wj = {
        Up: 38,
        Down: 40,
        Left: 37,
        Right: 39,
        Enter: 13,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        'U+007F': 46,
        Home: 36,
        End: 35,
        PageUp: 33,
        PageDown: 34,
        Insert: 45,
      },
      xj = !ec || mc('525'),
      yj = gc && dc
    l = tj.prototype
    l.Jb = function (a) {
      if (ec || bc)
        if (
          (17 == this.R && !a.ctrlKey) ||
          (18 == this.R && !a.altKey) ||
          (gc && 91 == this.R && !a.metaKey)
        )
          this.X = this.R = -1
      ;-1 == this.R &&
        (a.ctrlKey && 17 != a.keyCode
          ? (this.R = 17)
          : a.altKey && 18 != a.keyCode
          ? (this.R = 18)
          : a.metaKey && 91 != a.keyCode && (this.R = 91))
      xj && !bj(a.keyCode, this.R, a.shiftKey, a.ctrlKey, a.altKey, a.metaKey)
        ? this.handleEvent(a)
        : ((this.X = cj(a.keyCode)), yj && (this.Ua = a.altKey))
    }
    l.Kb = function (a) {
      this.X = this.R = -1
      this.Ua = a.altKey
    }
    l.handleEvent = function (a) {
      var b = a.a,
        c = b.altKey
      if (z && 'keypress' == a.type) {
        var d = this.X
        var e = 13 != d && 27 != d ? b.keyCode : 0
      } else
        (ec || bc) && 'keypress' == a.type
          ? ((d = this.X), (e = 0 <= b.charCode && 63232 > b.charCode && aj(d) ? b.charCode : 0))
          : ac && !ec
          ? ((d = this.X), (e = aj(d) ? b.keyCode : 0))
          : ('keypress' == a.type
              ? (yj && (c = this.Ua),
                b.keyCode == b.charCode
                  ? 32 > b.keyCode
                    ? ((d = b.keyCode), (e = 0))
                    : ((d = this.X), (e = b.charCode))
                  : ((d = b.keyCode || this.X), (e = b.charCode || 0)))
              : ((d = b.keyCode || this.X), (e = b.charCode || 0)),
            gc && 63 == e && 224 == d && (d = 191))
      var f = (d = cj(d))
      d
        ? 63232 <= d && d in vj
          ? (f = vj[d])
          : 25 == d && a.shiftKey && (f = 9)
        : b.keyIdentifier && b.keyIdentifier in wj && (f = wj[b.keyIdentifier])
      ;(dc && xj && 'keypress' == a.type && !bj(f, this.R, a.shiftKey, a.ctrlKey, c, a.metaKey)) ||
        ((a = f == this.R), (this.R = f), (b = new zj(f, e, a, b)), (b.altKey = c), xe(this, b))
    }
    l.N = function () {
      return this.qa
    }
    function uj(a) {
      a.Na && (te(a.Na), te(a.Ya), te(a.Oa), (a.Na = null), (a.Ya = null), (a.Oa = null))
      a.qa = null
      a.R = -1
      a.X = -1
    }
    l.o = function () {
      tj.K.o.call(this)
      uj(this)
    }
    function zj(a, b, c, d) {
      Zd.call(this, d)
      this.type = 'key'
      this.keyCode = a
      this.j = b
      this.repeat = c
    }
    w(zj, Zd)
    function Aj(a, b, c, d) {
      this.top = a
      this.right = b
      this.bottom = c
      this.left = d
    }
    Aj.prototype.toString = function () {
      return '(' + this.top + 't, ' + this.right + 'r, ' + this.bottom + 'b, ' + this.left + 'l)'
    }
    Aj.prototype.ceil = function () {
      this.top = Math.ceil(this.top)
      this.right = Math.ceil(this.right)
      this.bottom = Math.ceil(this.bottom)
      this.left = Math.ceil(this.left)
      return this
    }
    Aj.prototype.floor = function () {
      this.top = Math.floor(this.top)
      this.right = Math.floor(this.right)
      this.bottom = Math.floor(this.bottom)
      this.left = Math.floor(this.left)
      return this
    }
    Aj.prototype.round = function () {
      this.top = Math.round(this.top)
      this.right = Math.round(this.right)
      this.bottom = Math.round(this.bottom)
      this.left = Math.round(this.left)
      return this
    }
    function Bj(a, b) {
      var c = Sc(a)
      return c.defaultView &&
        c.defaultView.getComputedStyle &&
        (a = c.defaultView.getComputedStyle(a, null))
        ? a[b] || a.getPropertyValue(b) || ''
        : ''
    }
    function Cj(a) {
      try {
        var b = a.getBoundingClientRect()
      } catch (c) {
        return { left: 0, top: 0, right: 0, bottom: 0 }
      }
      z &&
        a.ownerDocument.body &&
        ((a = a.ownerDocument),
        (b.left -= a.documentElement.clientLeft + a.body.clientLeft),
        (b.top -= a.documentElement.clientTop + a.body.clientTop))
      return b
    }
    function Dj(a, b) {
      b = b || Yc(document)
      var c = b || Yc(document)
      var d = Ej(a),
        e = Ej(c)
      if (!z || 9 <= Number(nc)) {
        g = Bj(c, 'borderLeftWidth')
        var f = Bj(c, 'borderRightWidth')
        h = Bj(c, 'borderTopWidth')
        k = Bj(c, 'borderBottomWidth')
        f = new Aj(parseFloat(h), parseFloat(f), parseFloat(k), parseFloat(g))
      } else {
        var g = Fj(c, 'borderLeft')
        f = Fj(c, 'borderRight')
        var h = Fj(c, 'borderTop'),
          k = Fj(c, 'borderBottom')
        f = new Aj(h, f, k, g)
      }
      c == Yc(document)
        ? ((g = d.a - c.scrollLeft),
          (d = d.g - c.scrollTop),
          !z || 10 <= Number(nc) || ((g += f.left), (d += f.top)))
        : ((g = d.a - e.a - f.left), (d = d.g - e.g - f.top))
      e = a.offsetWidth
      f = a.offsetHeight
      h = ec && !e && !f
      ;(ka(e) && !h) || !a.getBoundingClientRect
        ? (a = new Pc(e, f))
        : ((a = Cj(a)), (a = new Pc(a.right - a.left, a.bottom - a.top)))
      e = c.clientHeight - a.height
      f = c.scrollLeft
      h = c.scrollTop
      f += Math.min(g, Math.max(g - (c.clientWidth - a.width), 0))
      h += Math.min(d, Math.max(d - e, 0))
      c = new Oc(f, h)
      b.scrollLeft = c.a
      b.scrollTop = c.g
    }
    function Ej(a) {
      var b = Sc(a),
        c = new Oc(0, 0)
      var d = b ? Sc(b) : document
      d = !z || 9 <= Number(nc) || 'CSS1Compat' == Qc(d).a.compatMode ? d.documentElement : d.body
      if (a == d) return c
      a = Cj(a)
      d = Qc(b).a
      b = Yc(d)
      d = d.parentWindow || d.defaultView
      b =
        z && mc('10') && d.pageYOffset != b.scrollTop
          ? new Oc(b.scrollLeft, b.scrollTop)
          : new Oc(d.pageXOffset || b.scrollLeft, d.pageYOffset || b.scrollTop)
      c.a = a.left + b.a
      c.g = a.top + b.g
      return c
    }
    var Gj = { thin: 2, medium: 4, thick: 6 }
    function Fj(a, b) {
      if ('none' == (a.currentStyle ? a.currentStyle[b + 'Style'] : null)) return 0
      var c = a.currentStyle ? a.currentStyle[b + 'Width'] : null
      if (c in Gj) a = Gj[c]
      else if (/^\d+px?$/.test(c)) a = parseInt(c, 10)
      else {
        b = a.style.left
        var d = a.runtimeStyle.left
        a.runtimeStyle.left = a.currentStyle.left
        a.style.left = c
        c = a.style.pixelLeft
        a.style.left = b
        a.runtimeStyle.left = d
        a = +c
      }
      return a
    }
    function Hj() {}
    oa(Hj)
    Hj.prototype.a = 0
    function Ij(a) {
      E.call(this)
      this.s = a || Qc()
      this.cb = null
      this.na = !1
      this.g = null
      this.L = void 0
      this.oa = this.Ea = this.Y = null
    }
    w(Ij, E)
    l = Ij.prototype
    l.Lb = Hj.Xa()
    l.N = function () {
      return this.g
    }
    function M(a, b) {
      return a.g ? Vc(b, a.g || a.s.a) : null
    }
    function Jj(a) {
      a.L || (a.L = new mj(a))
      return a.L
    }
    l.Za = function (a) {
      if (this.Y && this.Y != a) throw Error('Method not supported')
      Ij.K.Za.call(this, a)
    }
    l.kb = function () {
      this.g = this.s.a.createElement('DIV')
    }
    l.render = function (a) {
      if (this.na) throw Error('Component already rendered')
      this.g || this.kb()
      a ? a.insertBefore(this.g, null) : this.s.a.body.appendChild(this.g)
      ;(this.Y && !this.Y.na) || this.v()
    }
    l.v = function () {
      this.na = !0
      Kj(this, function (a) {
        !a.na && a.N() && a.v()
      })
    }
    l.ya = function () {
      Kj(this, function (a) {
        a.na && a.ya()
      })
      this.L && pj(this.L)
      this.na = !1
    }
    l.o = function () {
      this.na && this.ya()
      this.L && (this.L.m(), delete this.L)
      Kj(this, function (a) {
        a.m()
      })
      this.g && Zc(this.g)
      this.Y = this.g = this.oa = this.Ea = null
      Ij.K.o.call(this)
    }
    function Kj(a, b) {
      a.Ea && Ha(a.Ea, b, void 0)
    }
    l.removeChild = function (a, b) {
      if (a) {
        var c = q(a) ? a : a.cb || (a.cb = ':' + (a.Lb.a++).toString(36))
        this.oa && c
          ? ((a = this.oa), (a = (null !== a && c in a ? a[c] : void 0) || null))
          : (a = null)
        if (c && a) {
          var d = this.oa
          c in d && delete d[c]
          Na(this.Ea, a)
          b && (a.ya(), a.g && Zc(a.g))
          b = a
          if (null == b) throw Error('Unable to set parent component')
          b.Y = null
          Ij.K.Za.call(b, null)
        }
      }
      if (!a) throw Error('Child is not in parent component')
      return a
    }
    function N(a, b) {
      var c = ad(a, 'firebaseui-textfield')
      b
        ? (Xi(a, 'firebaseui-input-invalid'),
          Wi(a, 'firebaseui-input'),
          c && Xi(c, 'firebaseui-textfield-invalid'))
        : (Xi(a, 'firebaseui-input'),
          Wi(a, 'firebaseui-input-invalid'),
          c && Wi(c, 'firebaseui-textfield-invalid'))
    }
    function Lj(a, b, c) {
      b = new qj(b)
      Sd(a, za(Td, b))
      oj(Jj(a), b, 'input', c)
    }
    function Mj(a, b, c) {
      b = new tj(b)
      Sd(a, za(Td, b))
      oj(Jj(a), b, 'key', function (d) {
        13 == d.keyCode && (d.stopPropagation(), d.preventDefault(), c(d))
      })
    }
    function Nj(a, b, c) {
      b = new ij(b)
      Sd(a, za(Td, b))
      oj(Jj(a), b, 'focusin', c)
    }
    function Oj(a, b, c) {
      b = new ij(b)
      Sd(a, za(Td, b))
      oj(Jj(a), b, 'focusout', c)
    }
    function O(a, b, c) {
      b = new ej(b)
      Sd(a, za(Td, b))
      oj(Jj(a), b, 'action', function (d) {
        d.stopPropagation()
        d.preventDefault()
        c(d)
      })
    }
    function Pj(a) {
      Wi(a, 'firebaseui-hidden')
    }
    function Qj(a, b) {
      b && $c(a, b)
      Xi(a, 'firebaseui-hidden')
    }
    function Rj(a) {
      return !Vi(a, 'firebaseui-hidden') && 'none' != a.style.display
    }
    function Sj(a) {
      a = a || {}
      var b = a.email,
        c = a.disabled,
        d =
          '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="ui-sign-in-email-input">'
      d = a.xc ? d + 'Enter new email address' : d + 'Email'
      d +=
        '</label><input type="email" name="email" id="ui-sign-in-email-input" autocomplete="username" class="mdl-textfield__input firebaseui-input firebaseui-id-email" value="' +
        ud(null != b ? b : '') +
        '"' +
        (c ? 'disabled' : '') +
        '></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-email-error"></p></div>'
      return B(d)
    }
    function Tj(a) {
      a = a || {}
      a = a.label
      var b =
        '<button type="submit" class="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">'
      b = a ? b + A(a) : b + 'Next'
      return B(b + '</button>')
    }
    function Uj() {
      var a = '' + Tj({ label: D('Sign In') })
      return B(a)
    }
    function Vj() {
      var a = '' + Tj({ label: D('Save') })
      return B(a)
    }
    function Wj() {
      var a = '' + Tj({ label: D('Continue') })
      return B(a)
    }
    function Xj(a) {
      a = a || {}
      a = a.label
      var b =
        '<div class="firebaseui-new-password-component"><div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="ui-sign-in-new-password-input">'
      b = a ? b + A(a) : b + 'Choose password'
      return B(
        b +
          '</label><input type="password" name="newPassword" id="ui-sign-in-new-password-input" autocomplete="new-password" class="mdl-textfield__input firebaseui-input firebaseui-id-new-password"></div><a href="javascript:void(0)" class="firebaseui-input-floating-button firebaseui-id-password-toggle firebaseui-input-toggle-on firebaseui-input-toggle-blur"></a><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-new-password-error"></p></div></div>'
      )
    }
    function Yj() {
      var a = {}
      var b =
        '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="ui-sign-in-password-input">'
      b = a.current ? b + 'Current password' : b + 'Password'
      return B(
        b +
          '</label><input type="password" name="password" id="ui-sign-in-password-input" autocomplete="current-password" class="mdl-textfield__input firebaseui-input firebaseui-id-password"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-password-error"></p></div>'
      )
    }
    function Zj() {
      return B(
        '<a class="firebaseui-link firebaseui-id-secondary-link" href="javascript:void(0)">Trouble signing in?</a>'
      )
    }
    function ak(a) {
      a = a || {}
      a = a.label
      var b =
        '<button class="firebaseui-id-secondary-link firebaseui-button mdl-button mdl-js-button mdl-button--primary">'
      b = a ? b + A(a) : b + 'Cancel'
      return B(b + '</button>')
    }
    function bk(a) {
      var b = ''
      a.F &&
        a.D &&
        (b +=
          '<ul class="firebaseui-tos-list firebaseui-tos"><li class="firebaseui-inline-list-item"><a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">Terms of Service</a></li><li class="firebaseui-inline-list-item"><a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">Privacy Policy</a></li></ul>')
      return B(b)
    }
    function ck(a) {
      var b = ''
      a.F &&
        a.D &&
        (b +=
          '<p class="firebaseui-tos firebaseui-tospp-full-message">By continuing, you are indicating that you accept our <a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">Terms of Service</a> and <a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">Privacy Policy</a>.</p>')
      return B(b)
    }
    function dk(a) {
      a =
        '<div class="firebaseui-info-bar firebaseui-id-info-bar"><p class="firebaseui-info-bar-message">' +
        A(a.message) +
        '&nbsp;&nbsp;<a href="javascript:void(0)" class="firebaseui-link firebaseui-id-dismiss-info-bar">Dismiss</a></p></div>'
      return B(a)
    }
    dk.a = 'firebaseui.auth.soy2.element.infoBar'
    function ek(a) {
      var b = a.content
      a = a.Ab
      return B(
        '<dialog class="mdl-dialog firebaseui-dialog firebaseui-id-dialog' +
          (a ? ' ' + ud(a) : '') +
          '">' +
          A(b) +
          '</dialog>'
      )
    }
    function fk(a) {
      var b = a.message
      return B(
        ek({
          content: td(
            '<div class="firebaseui-dialog-icon-wrapper"><div class="' +
              ud(a.Ma) +
              ' firebaseui-dialog-icon"></div></div><div class="firebaseui-progress-dialog-message">' +
              A(b) +
              '</div>'
          ),
        })
      )
    }
    fk.a = 'firebaseui.auth.soy2.element.progressDialog'
    function gk(a) {
      var b = '<div class="firebaseui-list-box-actions">'
      a = a.items
      for (var c = a.length, d = 0; d < c; d++) {
        var e = a[d]
        b +=
          '<button type="button" data-listboxid="' +
          ud(e.id) +
          '" class="mdl-button firebaseui-id-list-box-dialog-button firebaseui-list-box-dialog-button">' +
          (e.Ma
            ? '<div class="firebaseui-list-box-icon-wrapper"><div class="firebaseui-list-box-icon ' +
              ud(e.Ma) +
              '"></div></div>'
            : '') +
          '<div class="firebaseui-list-box-label-wrapper">' +
          A(e.label) +
          '</div></button>'
      }
      b = '' + ek({ Ab: D('firebaseui-list-box-dialog'), content: td(b + '</div>') })
      return B(b)
    }
    gk.a = 'firebaseui.auth.soy2.element.listBoxDialog'
    function hk(a) {
      a = a || {}
      return B(
        a.tb
          ? '<div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-busy-indicator firebaseui-id-busy-indicator"></div>'
          : '<div class="mdl-progress mdl-js-progress mdl-progress__indeterminate firebaseui-busy-indicator firebaseui-id-busy-indicator"></div>'
      )
    }
    hk.a = 'firebaseui.auth.soy2.element.busyIndicator'
    function ik(a, b) {
      a = a || {}
      a = a.ga
      return C(
        a.S
          ? a.S
          : b.hb[a.providerId]
          ? '' + b.hb[a.providerId]
          : a.providerId && 0 == a.providerId.indexOf('saml.')
          ? a.providerId.substring(5)
          : a.providerId && 0 == a.providerId.indexOf('oidc.')
          ? a.providerId.substring(5)
          : '' + a.providerId
      )
    }
    function jk(a) {
      kk(a, 'upgradeElement')
    }
    function lk(a) {
      kk(a, 'downgradeElements')
    }
    var mk = ['mdl-js-textfield', 'mdl-js-progress', 'mdl-js-spinner', 'mdl-js-button']
    function kk(a, b) {
      a &&
        window.componentHandler &&
        window.componentHandler[b] &&
        mk.forEach(function (c) {
          if (Vi(a, c)) window.componentHandler[b](a)
          Ha(Tc(c, a), function (d) {
            window.componentHandler[b](d)
          })
        })
    }
    function nk(a, b, c) {
      ok.call(this)
      document.body.appendChild(a)
      a.showModal || window.dialogPolyfill.registerDialog(a)
      a.showModal()
      jk(a)
      b &&
        O(this, a, function (f) {
          var g = a.getBoundingClientRect()
          ;(f.clientX < g.left ||
            g.left + g.width < f.clientX ||
            f.clientY < g.top ||
            g.top + g.height < f.clientY) &&
            ok.call(this)
        })
      if (!c) {
        var d = this.N().parentElement || this.N().parentNode
        if (d) {
          var e = this
          this.da = function () {
            if (a.open) {
              var f = a.getBoundingClientRect().height,
                g = d.getBoundingClientRect().height,
                h = d.getBoundingClientRect().top - document.body.getBoundingClientRect().top,
                k = d.getBoundingClientRect().left - document.body.getBoundingClientRect().left,
                p = a.getBoundingClientRect().width,
                t = d.getBoundingClientRect().width
              a.style.top = (h + (g - f) / 2).toString() + 'px'
              f = k + (t - p) / 2
              a.style.left = f.toString() + 'px'
              a.style.right =
                (document.body.getBoundingClientRect().width - f - p).toString() + 'px'
            } else window.removeEventListener('resize', e.da)
          }
          this.da()
          window.addEventListener('resize', this.da, !1)
        }
      }
    }
    function ok() {
      var a = pk.call(this)
      a &&
        (lk(a),
        a.open && a.close(),
        Zc(a),
        this.da && window.removeEventListener('resize', this.da))
    }
    function pk() {
      return Vc('firebaseui-id-dialog')
    }
    function qk() {
      Zc(rk.call(this))
    }
    function rk() {
      return M(this, 'firebaseui-id-info-bar')
    }
    function sk() {
      return M(this, 'firebaseui-id-dismiss-info-bar')
    }
    var tk = {
      xa: {
        'google.com': 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
        'github.com': 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg',
        'facebook.com': 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg',
        'twitter.com': 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/twitter.svg',
        password: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg',
        phone: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/phone.svg',
        anonymous: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/anonymous.png',
        'microsoft.com': 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg',
        'yahoo.com': 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/yahoo.svg',
        'apple.com': 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/apple.png',
        saml: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/saml.svg',
        oidc: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/oidc.svg',
      },
      wa: {
        'google.com': '#ffffff',
        'github.com': '#333333',
        'facebook.com': '#3b5998',
        'twitter.com': '#55acee',
        password: '#db4437',
        phone: '#02bd7e',
        anonymous: '#f4b400',
        'microsoft.com': '#2F2F2F',
        'yahoo.com': '#720E9E',
        'apple.com': '#000000',
        saml: '#007bff',
        oidc: '#007bff',
      },
      hb: {
        'google.com': 'Google',
        'github.com': 'GitHub',
        'facebook.com': 'Facebook',
        'twitter.com': 'Twitter',
        password: 'Password',
        phone: 'Phone',
        anonymous: 'Guest',
        'microsoft.com': 'Microsoft',
        'yahoo.com': 'Yahoo',
        'apple.com': 'Apple',
      },
    }
    function uk(a, b, c) {
      Yd.call(this, a, b)
      for (var d in c) this[d] = c[d]
    }
    w(uk, Yd)
    function P(a, b, c, d, e) {
      Ij.call(this, c)
      this.fb = a
      this.eb = b
      this.Fa = !1
      this.Ga = d || null
      this.A = this.ca = null
      this.Z = eb(tk)
      gb(this.Z, e || {})
    }
    w(P, Ij)
    l = P.prototype
    l.kb = function () {
      var a = hd(this.fb, this.eb, this.Z, this.s)
      jk(a)
      this.g = a
    }
    l.v = function () {
      P.K.v.call(this)
      Be(Q(this), new uk('pageEnter', Q(this), { pageId: this.Ga }))
      if (this.bb() && this.Z.F) {
        var a = this.Z.F
        O(this, this.bb(), function () {
          a()
        })
      }
      if (this.ab() && this.Z.D) {
        var b = this.Z.D
        O(this, this.ab(), function () {
          b()
        })
      }
    }
    l.ya = function () {
      Be(Q(this), new uk('pageExit', Q(this), { pageId: this.Ga }))
      P.K.ya.call(this)
    }
    l.o = function () {
      window.clearTimeout(this.ca)
      this.eb = this.fb = this.ca = null
      this.Fa = !1
      this.A = null
      lk(this.N())
      P.K.o.call(this)
    }
    function vk(a) {
      a.Fa = !0
      var b = Vi(a.N(), 'firebaseui-use-spinner')
      a.ca = window.setTimeout(function () {
        a.N() &&
          null === a.A &&
          ((a.A = hd(hk, { tb: b }, null, a.s)), a.N().appendChild(a.A), jk(a.A))
      }, 500)
    }
    l.I = function (a, b, c, d) {
      function e() {
        if (f.T) return null
        f.Fa = !1
        window.clearTimeout(f.ca)
        f.ca = null
        f.A && (lk(f.A), Zc(f.A), (f.A = null))
      }
      var f = this
      if (f.Fa) return null
      vk(f)
      return a.apply(null, b).then(c, d).then(e, e)
    }
    function Q(a) {
      return a.N().parentElement || a.N().parentNode
    }
    function wk(a, b, c) {
      Mj(a, b, function () {
        c.focus()
      })
    }
    function xk(a, b, c) {
      Mj(a, b, function () {
        c()
      })
    }
    u(P.prototype, {
      a: function (a) {
        qk.call(this)
        var b = hd(dk, { message: a }, null, this.s)
        this.N().appendChild(b)
        O(this, sk.call(this), function () {
          Zc(b)
        })
      },
      zc: qk,
      Bc: rk,
      Ac: sk,
      $: function (a, b) {
        a = hd(fk, { Ma: a, message: b }, null, this.s)
        nk.call(this, a)
      },
      h: ok,
      Cb: pk,
      Dc: function () {
        return M(this, 'firebaseui-tos')
      },
      bb: function () {
        return M(this, 'firebaseui-tos-link')
      },
      ab: function () {
        return M(this, 'firebaseui-pp-link')
      },
      Ec: function () {
        return M(this, 'firebaseui-tos-list')
      },
    })
    function yk(a, b, c) {
      a = a || {}
      b = a.Va
      var d = a.ia
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-sign-in"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in with email</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' +
        Sj(a) +
        '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        (b ? ak(null) : '') +
        Tj(null) +
        '</div></div><div class="firebaseui-card-footer">' +
        (d ? ck(c) : bk(c)) +
        '</div></form></div>'
      return B(a)
    }
    yk.a = 'firebaseui.auth.soy2.page.signIn'
    function zk(a, b, c) {
      a = a || {}
      b = a.ia
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-sign-in"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content">' +
        Sj(a) +
        Yj() +
        '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' +
        Zj() +
        '</div><div class="firebaseui-form-actions">' +
        Uj() +
        '</div></div><div class="firebaseui-card-footer">' +
        (b ? ck(c) : bk(c)) +
        '</div></form></div>'
      return B(a)
    }
    zk.a = 'firebaseui.auth.soy2.page.passwordSignIn'
    function Ak(a, b, c) {
      a = a || {}
      var d = a.Tb
      b = a.Ta
      var e = a.ia,
        f =
          '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-sign-up"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Create account</h1></div><div class="firebaseui-card-content">' +
          Sj(a)
      d
        ? ((a = a || {}),
          (a = a.name),
          (a =
            '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="ui-sign-in-name-input">First &amp; last name</label><input type="text" name="name" id="ui-sign-in-name-input" autocomplete="name" class="mdl-textfield__input firebaseui-input firebaseui-id-name" value="' +
            ud(null != a ? a : '') +
            '"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-name-error"></p></div>'),
          (a = B(a)))
        : (a = '')
      c =
        f +
        a +
        Xj(null) +
        '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        (b ? ak(null) : '') +
        Vj() +
        '</div></div><div class="firebaseui-card-footer">' +
        (e ? ck(c) : bk(c)) +
        '</div></form></div>'
      return B(c)
    }
    Ak.a = 'firebaseui.auth.soy2.page.passwordSignUp'
    function Bk(a, b, c) {
      a = a || {}
      b = a.Ta
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-recovery"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Recover password</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Get instructions sent to this email that explain how to reset your password</p>' +
        Sj(a) +
        '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        (b ? ak(null) : '') +
        Tj({ label: D('Send') }) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(a)
    }
    Bk.a = 'firebaseui.auth.soy2.page.passwordRecovery'
    function Ck(a, b, c) {
      b = a.G
      var d = ''
      a =
        'Follow the instructions sent to <strong>' +
        (A(a.email) + '</strong> to recover your password')
      d +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-recovery-email-sent"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Check your email</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
        a +
        '</p></div><div class="firebaseui-card-actions">'
      b && (d += '<div class="firebaseui-form-actions">' + Tj({ label: D('Done') }) + '</div>')
      d += '</div><div class="firebaseui-card-footer">' + bk(c) + '</div></div>'
      return B(d)
    }
    Ck.a = 'firebaseui.auth.soy2.page.passwordRecoveryEmailSent'
    function Dk(a, b, c) {
      return B(
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-callback"><div class="firebaseui-callback-indicator-container">' +
          hk(null, null, c) +
          '</div></div>'
      )
    }
    Dk.a = 'firebaseui.auth.soy2.page.callback'
    function Ek(a, b, c) {
      return B(
        '<div class="firebaseui-container firebaseui-id-page-spinner">' +
          hk({ tb: !0 }, null, c) +
          '</div>'
      )
    }
    Ek.a = 'firebaseui.auth.soy2.page.spinner'
    function Fk() {
      return B(
        '<div class="firebaseui-container firebaseui-id-page-blank firebaseui-use-spinner"></div>'
      )
    }
    Fk.a = 'firebaseui.auth.soy2.page.blank'
    function Gk(a, b, c) {
      b = ''
      a =
        'A sign-in email with additional instructions was sent to <strong>' +
        (A(a.email) + '</strong>. Check your email to complete sign-in.')
      var d = B(
        '<a class="firebaseui-link firebaseui-id-trouble-getting-email-link" href="javascript:void(0)">Trouble getting email?</a>'
      )
      b +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-sent"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign-in email sent</h1></div><div class="firebaseui-card-content"><div class="firebaseui-email-sent"></div><p class="firebaseui-text">' +
        a +
        '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' +
        d +
        '</div><div class="firebaseui-form-actions">' +
        ak({ label: D('Back') }) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(b)
    }
    Gk.a = 'firebaseui.auth.soy2.page.emailLinkSignInSent'
    function Hk(a, b, c) {
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-not-received"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Trouble getting email?</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Try these common fixes:<ul><li>Check if the email was marked as spam or filtered.</li><li>Check your internet connection.</li><li>Check that you did not misspell your email.</li><li>Check that your inbox space is not running out or other inbox settings related issues.</li></ul></p><p class="firebaseui-text">If the steps above didn\'t work, you can resend the email. Note that this will deactivate the link in the older email.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' +
        B(
          '<a class="firebaseui-link firebaseui-id-resend-email-link" href="javascript:void(0)">Resend</a>'
        ) +
        '</div><div class="firebaseui-form-actions">' +
        ak({ label: D('Back') }) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(a)
    }
    Hk.a = 'firebaseui.auth.soy2.page.emailNotReceived'
    function Ik(a, b, c) {
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-confirmation"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Confirm email</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Confirm your email to complete sign in</p><div class="firebaseui-relative-wrapper">' +
        Sj(a) +
        '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        ak(null) +
        Tj(null) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(a)
    }
    Ik.a = 'firebaseui.auth.soy2.page.emailLinkSignInConfirmation'
    function Jk() {
      var a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-different-device-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">New device or browser detected</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Try opening the link using the same device or browser where you started the sign-in process.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        ak({ label: D('Dismiss') }) +
        '</div></div></div>'
      return B(a)
    }
    Jk.a = 'firebaseui.auth.soy2.page.differentDeviceError'
    function Kk() {
      var a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-anonymous-user-mismatch"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Session ended</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">The session associated with this sign-in request has either expired or was cleared.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        ak({ label: D('Dismiss') }) +
        '</div></div></div>'
      return B(a)
    }
    Kk.a = 'firebaseui.auth.soy2.page.anonymousUserMismatch'
    function Lk(a, b, c) {
      b = ''
      a =
        'You\u2019ve already used <strong>' +
        (A(a.email) + '</strong> to sign in. Enter your password for that account.')
      b +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">You already have an account</h2><p class="firebaseui-text">' +
        a +
        '</p>' +
        Yj() +
        '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' +
        Zj() +
        '</div><div class="firebaseui-form-actions">' +
        Uj() +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(b)
    }
    Lk.a = 'firebaseui.auth.soy2.page.passwordLinking'
    function Mk(a, b, c) {
      var d = a.email
      b = ''
      a = '' + ik(a, c)
      a = D(a)
      d =
        'You\u2019ve already used <strong>' +
        (A(d) +
          ('</strong>. You can connect your <strong>' +
            (A(a) +
              ('</strong> account with <strong>' +
                (A(d) + '</strong> by signing in with email link below.')))))
      a =
        'For this flow to successfully connect your ' +
        (A(a) +
          ' account with this email, you have to open the link on the same device or browser.')
      b +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">You already have an account</h2><p class="firebaseui-text firebaseui-text-justify">' +
        d +
        '<p class="firebaseui-text firebaseui-text-justify">' +
        a +
        '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        Uj() +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(b)
    }
    Mk.a = 'firebaseui.auth.soy2.page.emailLinkSignInLinking'
    function Nk(a, b, c) {
      b = ''
      var d = '' + ik(a, c)
      d = D(d)
      a =
        'You originally intended to connect <strong>' +
        (A(d) +
          '</strong> to your email account but have opened the link on a different device where you are not signed in.')
      d =
        'If you still want to connect your <strong>' +
        (A(d) +
          '</strong> account, open the link on the same device where you started sign-in. Otherwise, tap Continue to sign-in on this device.')
      b +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-linking-different-device"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text firebaseui-text-justify">' +
        a +
        '</p><p class="firebaseui-text firebaseui-text-justify">' +
        d +
        '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        Wj() +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(b)
    }
    Nk.a = 'firebaseui.auth.soy2.page.emailLinkSignInLinkingDifferentDevice'
    function Ok(a, b, c) {
      var d = a.email
      b = ''
      a = '' + ik(a, c)
      a = D(a)
      d =
        'You\u2019ve already used <strong>' +
        (A(d) + ('</strong>. Sign in with ' + (A(a) + ' to continue.')))
      b +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-federated-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">You already have an account</h2><p class="firebaseui-text">' +
        d +
        '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        Tj({ label: D('Sign in with ' + a) }) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(b)
    }
    Ok.a = 'firebaseui.auth.soy2.page.federatedLinking'
    function Pk(a, b, c) {
      a = a || {}
      var d = a.kc
      b = a.yb
      a = a.Eb
      var e =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-unauthorized-user"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Not Authorized</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">'
      d
        ? ((d = '<strong>' + (A(d) + '</strong> is not authorized to view the requested page.')),
          (e += d))
        : (e += 'User is not authorized to view the requested page.')
      e += '</p>'
      b &&
        ((b = 'Please contact <strong>' + (A(b) + '</strong> for authorization.')),
        (e +=
          '<p class="firebaseui-text firebaseui-id-unauthorized-user-admin-email">' + b + '</p>'))
      e += '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">'
      a &&
        (e +=
          '<a class="firebaseui-link firebaseui-id-unauthorized-user-help-link" href="javascript:void(0)" target="_blank">Learn More</a>')
      e +=
        '</div><div class="firebaseui-form-actions">' +
        ak({ label: D('Back') }) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(e)
    }
    Pk.a = 'firebaseui.auth.soy2.page.unauthorizedUser'
    function Qk(a, b, c) {
      b = ''
      a =
        'To continue sign in with <strong>' +
        (A(a.email) + '</strong> on this device, you have to recover the password.')
      b +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-unsupported-provider"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
        a +
        '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        ak(null) +
        Tj({ label: D('Recover password') }) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(b)
    }
    Qk.a = 'firebaseui.auth.soy2.page.unsupportedProvider'
    function Rk(a) {
      var b = '',
        c = '<p class="firebaseui-text">for <strong>' + (A(a.email) + '</strong></p>')
      b +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Reset your password</h1></div><div class="firebaseui-card-content">' +
        c +
        Xj(sd(a)) +
        '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        Vj() +
        '</div></div></form></div>'
      return B(b)
    }
    Rk.a = 'firebaseui.auth.soy2.page.passwordReset'
    function Sk(a) {
      a = a || {}
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Password changed</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">You can now sign in with your new password</p></div><div class="firebaseui-card-actions">' +
        (a.G ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></div>'
      return B(a)
    }
    Sk.a = 'firebaseui.auth.soy2.page.passwordResetSuccess'
    function Tk(a) {
      a = a || {}
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Try resetting your password again</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Your request to reset your password has expired or the link has already been used</p></div><div class="firebaseui-card-actions">' +
        (a.G ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></div>'
      return B(a)
    }
    Tk.a = 'firebaseui.auth.soy2.page.passwordResetFailure'
    function Uk(a) {
      var b = a.G,
        c = ''
      a =
        'Your sign-in email address has been changed back to <strong>' + (A(a.email) + '</strong>.')
      c +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-change-revoke-success"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Updated email address</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
        a +
        '</p><p class="firebaseui-text">If you didn\u2019t ask to change your sign-in email, it\u2019s possible someone is trying to access your account and you should <a class="firebaseui-link firebaseui-id-reset-password-link" href="javascript:void(0)">change your password right away</a>.</p></div><div class="firebaseui-card-actions">' +
        (b ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></form></div>'
      return B(c)
    }
    Uk.a = 'firebaseui.auth.soy2.page.emailChangeRevokeSuccess'
    function Vk(a) {
      a = a || {}
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-change-revoke-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Unable to update your email address</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">There was a problem changing your sign-in email back.</p><p class="firebaseui-text">If you try again and still can\u2019t reset your email, try asking your administrator for help.</p></div><div class="firebaseui-card-actions">' +
        (a.G ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></div>'
      return B(a)
    }
    Vk.a = 'firebaseui.auth.soy2.page.emailChangeRevokeFailure'
    function Wk(a) {
      a = a || {}
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-verification-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Your email has been verified</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">You can now sign in with your new account</p></div><div class="firebaseui-card-actions">' +
        (a.G ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></div>'
      return B(a)
    }
    Wk.a = 'firebaseui.auth.soy2.page.emailVerificationSuccess'
    function Yk(a) {
      a = a || {}
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-verification-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Try verifying your email again</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Your request to verify your email has expired or the link has already been used</p></div><div class="firebaseui-card-actions">' +
        (a.G ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></div>'
      return B(a)
    }
    Yk.a = 'firebaseui.auth.soy2.page.emailVerificationFailure'
    function Zk(a) {
      var b = a.G,
        c = ''
      a = 'You can now sign in with your new email <strong>' + (A(a.email) + '</strong>.')
      c +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-verify-and-change-email-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Your email has been verified and changed</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
        a +
        '</p></div><div class="firebaseui-card-actions">' +
        (b ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></div>'
      return B(c)
    }
    Zk.a = 'firebaseui.auth.soy2.page.verifyAndChangeEmailSuccess'
    function $k(a) {
      a = a || {}
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-verify-and-change-email-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Try updating your email again</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Your request to verify and update your email has expired or the link has already been used.</p></div><div class="firebaseui-card-actions">' +
        (a.G ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></div>'
      return B(a)
    }
    $k.a = 'firebaseui.auth.soy2.page.verifyAndChangeEmailFailure'
    function al(a) {
      var b = a.factorId,
        c = a.phoneNumber
      a = a.G
      var d =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-revert-second-factor-addition-success"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Removed second factor</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">'
      switch (b) {
        case 'phone':
          b =
            'The <strong>' +
            (A(b) + (' ' + (A(c) + '</strong> was removed as a second authentication step.')))
          d += b
          break
        default:
          d += 'The device or app was removed as a second authentication step.'
      }
      d +=
        '</p><p class="firebaseui-text">If you don\'t recognize this device, someone might be trying to access your account. Consider <a class="firebaseui-link firebaseui-id-reset-password-link" href="javascript:void(0)">changing your password right away</a>.</p></div><div class="firebaseui-card-actions">' +
        (a ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></form></div>'
      return B(d)
    }
    al.a = 'firebaseui.auth.soy2.page.revertSecondFactorAdditionSuccess'
    function bl(a) {
      a = a || {}
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-revert-second-factor-addition-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Couldn\'t remove your second factor</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Something went wrong removing your second factor.</p><p class="firebaseui-text">Try removing it again. If that doesn\'t work, contact support for assistance.</p></div><div class="firebaseui-card-actions">' +
        (a.G ? '<div class="firebaseui-form-actions">' + Wj() + '</div>' : '') +
        '</div></div>'
      return B(a)
    }
    bl.a = 'firebaseui.auth.soy2.page.revertSecondFactorAdditionFailure'
    function cl(a) {
      var b = a.zb
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-recoverable-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Error encountered</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
        A(a.errorMessage) +
        '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">'
      b && (a += Tj({ label: D('Retry') }))
      return B(a + '</div></div></div>')
    }
    cl.a = 'firebaseui.auth.soy2.page.recoverableError'
    function dl(a) {
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-unrecoverable-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Error encountered</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
        A(a.errorMessage) +
        '</p></div></div>'
      return B(a)
    }
    dl.a = 'firebaseui.auth.soy2.page.unrecoverableError'
    function el(a, b, c) {
      var d = a.Qb
      b = ''
      a = 'Continue with ' + (A(a.jc) + '?')
      d = 'You originally wanted to sign in with ' + A(d)
      b +=
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-mismatch"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">' +
        a +
        '</h2><p class="firebaseui-text">' +
        d +
        '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        ak(null) +
        Tj({ label: D('Continue') }) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form></div>'
      return B(b)
    }
    el.a = 'firebaseui.auth.soy2.page.emailMismatch'
    function fl(a, b, c) {
      var d =
        '<div class="firebaseui-container firebaseui-page-provider-sign-in firebaseui-id-page-provider-sign-in firebaseui-use-spinner"><div class="firebaseui-card-content"><form onsubmit="return false;"><ul class="firebaseui-idp-list">'
      a = a.Sb
      b = a.length
      for (var e = 0; e < b; e++) {
        var f = { ga: a[e] },
          g = c
        f = f || {}
        var h = f.ga
        var k = f
        k = k || {}
        var p = ''
        switch (k.ga.providerId) {
          case 'google.com':
            p += 'firebaseui-idp-google'
            break
          case 'github.com':
            p += 'firebaseui-idp-github'
            break
          case 'facebook.com':
            p += 'firebaseui-idp-facebook'
            break
          case 'twitter.com':
            p += 'firebaseui-idp-twitter'
            break
          case 'phone':
            p += 'firebaseui-idp-phone'
            break
          case 'anonymous':
            p += 'firebaseui-idp-anonymous'
            break
          case 'password':
            p += 'firebaseui-idp-password'
            break
          default:
            p += 'firebaseui-idp-generic'
        }
        k =
          '<button class="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised ' +
          ud(C(p)) +
          ' firebaseui-id-idp-button" data-provider-id="' +
          ud(h.providerId) +
          '" style="background-color:'
        p = (p = f) || {}
        p = p.ga
        k =
          k +
          ud(
            Dd(
              C(
                p.ta
                  ? p.ta
                  : g.wa[p.providerId]
                  ? '' + g.wa[p.providerId]
                  : 0 == p.providerId.indexOf('saml.')
                  ? '' + g.wa.saml
                  : 0 == p.providerId.indexOf('oidc.')
                  ? '' + g.wa.oidc
                  : '' + g.wa.password
              )
            )
          ) +
          '"><span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" alt="" src="'
        var t = f
        p = g
        t = t || {}
        t = t.ga
        p = rd(
          t.za
            ? zd(t.za)
            : p.xa[t.providerId]
            ? zd(p.xa[t.providerId])
            : 0 == t.providerId.indexOf('saml.')
            ? zd(p.xa.saml)
            : 0 == t.providerId.indexOf('oidc.')
            ? zd(p.xa.oidc)
            : zd(p.xa.password)
        )
        k = k + ud(zd(p)) + '"></span>'
        'password' == h.providerId
          ? ((k += '<span class="firebaseui-idp-text firebaseui-idp-text-long">'),
            h.V
              ? (k += A(h.V))
              : h.S
              ? ((f = 'Sign in with ' + A(ik(f, g))), (k += f))
              : (k += 'Sign in with email'),
            (k += '</span><span class="firebaseui-idp-text firebaseui-idp-text-short">'),
            (k = h.S ? k + A(h.S) : k + 'Email'),
            (k += '</span>'))
          : 'phone' == h.providerId
          ? ((k += '<span class="firebaseui-idp-text firebaseui-idp-text-long">'),
            h.V
              ? (k += A(h.V))
              : h.S
              ? ((f = 'Sign in with ' + A(ik(f, g))), (k += f))
              : (k += 'Sign in with phone'),
            (k += '</span><span class="firebaseui-idp-text firebaseui-idp-text-short">'),
            (k = h.S ? k + A(h.S) : k + 'Phone'),
            (k += '</span>'))
          : 'anonymous' == h.providerId
          ? ((k += '<span class="firebaseui-idp-text firebaseui-idp-text-long">'),
            h.V
              ? (k += A(h.V))
              : h.S
              ? ((f = 'Sign in with ' + A(ik(f, g))), (k += f))
              : (k += 'Continue as guest'),
            (k += '</span><span class="firebaseui-idp-text firebaseui-idp-text-short">'),
            (k = h.S ? k + A(h.S) : k + 'Guest'),
            (k += '</span>'))
          : ((k += '<span class="firebaseui-idp-text firebaseui-idp-text-long">'),
            h.V ? (k += A(h.V)) : ((p = 'Sign in with ' + A(ik(f, g))), (k += p)),
            (k +=
              '</span><span class="firebaseui-idp-text firebaseui-idp-text-short">' +
              (h.S ? A(h.S) : A(ik(f, g))) +
              '</span>'))
        h = B(k + '</button>')
        d += '<li class="firebaseui-list-item">' + h + '</li>'
      }
      d +=
        '</ul></form></div><div class="firebaseui-card-footer firebaseui-provider-sign-in-footer">' +
        ck(c) +
        '</div></div>'
      return B(d)
    }
    fl.a = 'firebaseui.auth.soy2.page.providerSignIn'
    function gl(a, b, c) {
      a = a || {}
      var d = a.Gb,
        e = a.Va
      b = a.ia
      a = a || {}
      a = a.Aa
      a =
        '<div class="firebaseui-phone-number"><button class="firebaseui-id-country-selector firebaseui-country-selector mdl-button mdl-js-button"><span class="firebaseui-flag firebaseui-country-selector-flag firebaseui-id-country-selector-flag"></span><span class="firebaseui-id-country-selector-code"></span></button><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label firebaseui-textfield firebaseui-phone-input-wrapper"><label class="mdl-textfield__label firebaseui-label" for="ui-sign-in-phone-number-input">Phone number</label><input type="tel" name="phoneNumber" id="ui-sign-in-phone-number-input" class="mdl-textfield__input firebaseui-input firebaseui-id-phone-number" value="' +
        ud(null != a ? a : '') +
        '"></div></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-phone-number-error firebaseui-id-phone-number-error"></p></div>'
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-phone-sign-in-start"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Enter your phone number</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' +
        B(a)
      var f
      d
        ? (f = B(
            '<div class="firebaseui-recaptcha-wrapper"><div class="firebaseui-recaptcha-container"></div><div class="firebaseui-error-wrapper firebaseui-recaptcha-error-wrapper"><p class="firebaseui-error firebaseui-hidden firebaseui-id-recaptcha-error"></p></div></div>'
          ))
        : (f = '')
      f =
        a +
        f +
        '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        (e ? ak(null) : '') +
        Tj({ label: D('Verify') }) +
        '</div></div><div class="firebaseui-card-footer">'
      b
        ? ((b = '<p class="firebaseui-tos firebaseui-phone-tos">'),
          (b =
            c.F && c.D
              ? b +
                'By tapping Verify, you are indicating that you accept our <a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">Terms of Service</a> and <a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">Privacy Policy</a>. An SMS may be sent. Message &amp; data rates may apply.'
              : b + 'By tapping Verify, an SMS may be sent. Message &amp; data rates may apply.'),
          (c = B(b + '</p>')))
        : (c =
            B(
              '<p class="firebaseui-tos firebaseui-phone-sms-notice">By tapping Verify, an SMS may be sent. Message &amp; data rates may apply.</p>'
            ) + bk(c))
      return B(f + c + '</div></form></div>')
    }
    gl.a = 'firebaseui.auth.soy2.page.phoneSignInStart'
    function hl(a, b, c) {
      a = a || {}
      b = a.phoneNumber
      var d = ''
      a =
        'Enter the 6-digit code we sent to <a class="firebaseui-link firebaseui-change-phone-number-link firebaseui-id-change-phone-number-link" href="javascript:void(0)">&lrm;' +
        (A(b) + '</a>')
      A(b)
      b = d
      d = B(
        '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="ui-sign-in-phone-confirmation-code-input">6-digit code</label><input type="number" name="phoneConfirmationCode" id="ui-sign-in-phone-confirmation-code-input" class="mdl-textfield__input firebaseui-input firebaseui-id-phone-confirmation-code"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-phone-confirmation-code-error"></p></div>'
      )
      c =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-phone-sign-in-finish"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Verify your phone number</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' +
        a +
        '</p>' +
        d +
        '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        ak(null) +
        Tj({ label: D('Continue') }) +
        '</div></div><div class="firebaseui-card-footer">' +
        bk(c) +
        '</div></form>'
      a = B(
        '<div class="firebaseui-resend-container"><span class="firebaseui-id-resend-countdown"></span><a href="javascript:void(0)" class="firebaseui-id-resend-link firebaseui-hidden firebaseui-link">Resend</a></div>'
      )
      return B(b + (c + a + '</div>'))
    }
    hl.a = 'firebaseui.auth.soy2.page.phoneSignInFinish'
    function il() {
      return B(
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-sign-out"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign Out</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">You are now successfully signed out.</p></div></div>'
      )
    }
    il.a = 'firebaseui.auth.soy2.page.signOut'
    function jl(a, b, c) {
      var d =
        '<div class="firebaseui-container firebaseui-page-select-tenant firebaseui-id-page-select-tenant"><div class="firebaseui-card-content"><form onsubmit="return false;"><ul class="firebaseui-tenant-list">'
      a = a.ec
      b = a.length
      for (var e = 0; e < b; e++) {
        var f = a[e]
        var g = ''
        var h = A(f.displayName),
          k = f.tenantId ? f.tenantId : 'top-level-project'
        k = D(k)
        g +=
          '<button class="firebaseui-tenant-button mdl-button mdl-js-button mdl-button--raised firebaseui-tenant-selection-' +
          ud(k) +
          ' firebaseui-id-tenant-selection-button"' +
          (f.tenantId ? 'data-tenant-id="' + ud(f.tenantId) + '"' : '') +
          'style="background-color:' +
          ud(Dd(f.ta)) +
          '"><span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" alt="" src="' +
          ud(zd(f.za)) +
          '"></span><span class="firebaseui-idp-text firebaseui-idp-text-long">'
        f.V ? (g += A(f.V)) : ((f = 'Sign in to ' + A(f.displayName)), (g += f))
        g = B(
          g +
            ('</span><span class="firebaseui-idp-text firebaseui-idp-text-short">' +
              h +
              '</span></button>')
        )
        d += '<li class="firebaseui-list-item">' + g + '</li>'
      }
      d +=
        '</ul></form></div><div class="firebaseui-card-footer firebaseui-provider-sign-in-footer">' +
        ck(c) +
        '</div></div>'
      return B(d)
    }
    jl.a = 'firebaseui.auth.soy2.page.selectTenant'
    function kl(a, b, c) {
      a =
        '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-provider-match-by-email"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sign in</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' +
        Sj(null) +
        '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' +
        Tj(null) +
        '</div></div><div class="firebaseui-card-footer">' +
        ck(c) +
        '</div></form></div>'
      return B(a)
    }
    kl.a = 'firebaseui.auth.soy2.page.providerMatchByEmail'
    function ll() {
      return M(this, 'firebaseui-id-submit')
    }
    function ml() {
      return M(this, 'firebaseui-id-secondary-link')
    }
    function nl(a, b) {
      O(this, ll.call(this), function (d) {
        a(d)
      })
      var c = ml.call(this)
      c &&
        b &&
        O(this, c, function (d) {
          b(d)
        })
    }
    function ol() {
      return M(this, 'firebaseui-id-password')
    }
    function pl() {
      return M(this, 'firebaseui-id-password-error')
    }
    function ql() {
      var a = ol.call(this),
        b = pl.call(this)
      Lj(this, a, function () {
        Rj(b) && (N(a, !0), Pj(b))
      })
    }
    function rl() {
      var a = ol.call(this)
      var b = pl.call(this)
      Yi(a)
        ? (N(a, !0), Pj(b), (b = !0))
        : (N(a, !1), Qj(b, C('Enter your password').toString()), (b = !1))
      return b ? Yi(a) : null
    }
    function sl(a, b, c, d, e, f) {
      P.call(this, Lk, { email: a }, f, 'passwordLinking', { F: d, D: e })
      this.w = b
      this.H = c
    }
    m(sl, P)
    sl.prototype.v = function () {
      this.P()
      this.M(this.w, this.H)
      xk(this, this.i(), this.w)
      this.i().focus()
      P.prototype.v.call(this)
    }
    sl.prototype.o = function () {
      this.w = null
      P.prototype.o.call(this)
    }
    sl.prototype.j = function () {
      return Yi(M(this, 'firebaseui-id-email'))
    }
    u(sl.prototype, { i: ol, B: pl, P: ql, u: rl, ea: ll, ba: ml, M: nl })
    var tl = /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/
    function ul() {
      return M(this, 'firebaseui-id-email')
    }
    function vl() {
      return M(this, 'firebaseui-id-email-error')
    }
    function wl(a) {
      var b = ul.call(this),
        c = vl.call(this)
      Lj(this, b, function () {
        Rj(c) && (N(b, !0), Pj(c))
      })
      a &&
        Mj(this, b, function () {
          a()
        })
    }
    function xl() {
      return Ua(Yi(ul.call(this)) || '')
    }
    function yl() {
      var a = ul.call(this)
      var b = vl.call(this)
      var c = Yi(a) || ''
      c
        ? tl.test(c)
          ? (N(a, !0), Pj(b), (b = !0))
          : (N(a, !1), Qj(b, C("That email address isn't correct").toString()), (b = !1))
        : (N(a, !1), Qj(b, C('Enter your email address to continue').toString()), (b = !1))
      return b ? Ua(Yi(a)) : null
    }
    function zl(a, b, c, d, e, f, g) {
      P.call(this, zk, { email: c, ia: !!f }, g, 'passwordSignIn', { F: d, D: e })
      this.w = a
      this.H = b
    }
    m(zl, P)
    zl.prototype.v = function () {
      this.P()
      this.ea()
      this.ba(this.w, this.H)
      wk(this, this.l(), this.i())
      xk(this, this.i(), this.w)
      Yi(this.l()) ? this.i().focus() : this.l().focus()
      P.prototype.v.call(this)
    }
    zl.prototype.o = function () {
      this.H = this.w = null
      P.prototype.o.call(this)
    }
    u(zl.prototype, {
      l: ul,
      U: vl,
      P: wl,
      M: xl,
      j: yl,
      i: ol,
      B: pl,
      ea: ql,
      u: rl,
      ua: ll,
      pa: ml,
      ba: nl,
    })
    function R(a, b, c, d, e, f) {
      P.call(this, a, b, d, e || 'notice', f)
      this.i = c || null
    }
    w(R, P)
    R.prototype.v = function () {
      this.i && (this.u(this.i), this.l().focus())
      R.K.v.call(this)
    }
    R.prototype.o = function () {
      this.i = null
      R.K.o.call(this)
    }
    u(R.prototype, { l: ll, w: ml, u: nl })
    function Al(a, b, c, d, e) {
      R.call(this, Ck, { email: a, G: !!b }, b, e, 'passwordRecoveryEmailSent', { F: c, D: d })
    }
    w(Al, R)
    function Bl(a, b) {
      R.call(this, Wk, { G: !!a }, a, b, 'emailVerificationSuccess')
    }
    w(Bl, R)
    function Cl(a, b) {
      R.call(this, Yk, { G: !!a }, a, b, 'emailVerificationFailure')
    }
    w(Cl, R)
    function Dl(a, b, c) {
      R.call(this, Zk, { email: a, G: !!b }, b, c, 'verifyAndChangeEmailSuccess')
    }
    w(Dl, R)
    function El(a, b) {
      R.call(this, $k, { G: !!a }, a, b, 'verifyAndChangeEmailFailure')
    }
    w(El, R)
    function Fl(a, b) {
      R.call(this, bl, { G: !!a }, a, b, 'revertSecondFactorAdditionFailure')
    }
    w(Fl, R)
    function Gl(a) {
      R.call(this, il, void 0, void 0, a, 'signOut')
    }
    w(Gl, R)
    function Hl(a, b) {
      R.call(this, Sk, { G: !!a }, a, b, 'passwordResetSuccess')
    }
    w(Hl, R)
    function Il(a, b) {
      R.call(this, Tk, { G: !!a }, a, b, 'passwordResetFailure')
    }
    w(Il, R)
    function Jl(a, b) {
      R.call(this, Vk, { G: !!a }, a, b, 'emailChangeRevokeFailure')
    }
    w(Jl, R)
    function Kl(a, b, c) {
      R.call(this, cl, { errorMessage: a, zb: !!b }, b, c, 'recoverableError')
    }
    w(Kl, R)
    function Ll(a, b) {
      R.call(this, dl, { errorMessage: a }, void 0, b, 'unrecoverableError')
    }
    w(Ll, R)
    function Ml(a) {
      if (
        'auth/invalid-credential' === a.code &&
        a.message &&
        -1 !== a.message.indexOf('error=consent_required')
      )
        return { code: 'auth/user-cancelled' }
      if (a.message && -1 !== a.message.indexOf('HTTP Cloud Function returned an error:')) {
        var b = JSON.parse(
          a.message.substring(a.message.indexOf('{'), a.message.lastIndexOf('}') + 1)
        )
        return { code: a.code, message: (b && b.error && b.error.message) || a.message }
      }
      return a
    }
    function Nl(a, b, c, d) {
      function e(g) {
        if (!g.name || 'cancel' != g.name) {
          a: {
            var h = g.message
            try {
              var k = ((JSON.parse(h).error || {}).message || '')
                .toLowerCase()
                .match(/invalid.+(access|id)_token/)
              if (k && k.length) {
                var p = !0
                break a
              }
            } catch (t) {}
            p = !1
          }
          if (p)
            (g = Q(b)),
              b.m(),
              S(a, g, void 0, C('Your sign-in session has expired. Please try again.').toString())
          else {
            p = (g && g.message) || ''
            if (g.code) {
              if (
                'auth/email-already-in-use' == g.code ||
                'auth/credential-already-in-use' == g.code
              )
                return
              p = T(g)
            }
            b.a(p)
          }
        }
      }
      Ol(a)
      if (d) return Pl(a, c), F()
      if (!c.credential) throw Error('No credential found!')
      if (!U(a).currentUser && !c.user) throw Error('User not logged in.')
      try {
        var f = Ql(a, c)
      } catch (g) {
        return og(g.code || g.message, g), b.a(g.code || g.message), F()
      }
      c = f
        .then(function (g) {
          Pl(a, g)
        }, e)
        .then(void 0, e)
      V(a, f)
      return F(c)
    }
    function Pl(a, b) {
      if (!b.user) throw Error('No user found')
      var c = Mi(W(a))
      Ki(W(a)) &&
        c &&
        tg(
          'Both signInSuccess and signInSuccessWithAuthResult callbacks are provided. Only signInSuccessWithAuthResult callback will be invoked.'
        )
      if (c) {
        c = Mi(W(a))
        var d = yh(X(a)) || void 0
        wh(sh, X(a))
        var e = !1
        if (qf()) {
          if (!c || c(b, d)) (e = !0), Nc(window.opener.location, Rl(a, d))
          c || window.close()
        } else if (!c || c(b, d)) (e = !0), Nc(window.location, Rl(a, d))
        e || a.reset()
      } else {
        c = b.user
        b = b.credential
        d = Ki(W(a))
        e = yh(X(a)) || void 0
        wh(sh, X(a))
        var f = !1
        if (qf()) {
          if (!d || d(c, b, e)) (f = !0), Nc(window.opener.location, Rl(a, e))
          d || window.close()
        } else if (!d || d(c, b, e)) (f = !0), Nc(window.location, Rl(a, e))
        f || a.reset()
      }
    }
    function Rl(a, b) {
      a = b || W(a).a.get('signInSuccessUrl')
      if (!a)
        throw Error(
          'No redirect URL has been found. You must either specify a signInSuccessUrl in the configuration, pass in a redirect URL to the widget URL, or return false from the callback.'
        )
      return a
    }
    function T(a) {
      var b = { code: a.code }
      b = b || {}
      var c = ''
      switch (b.code) {
        case 'auth/email-already-in-use':
          c += 'The email address is already used by another account'
          break
        case 'auth/requires-recent-login':
          c += Md()
          break
        case 'auth/too-many-requests':
          c +=
            'You have entered an incorrect password too many times. Please try again in a few minutes.'
          break
        case 'auth/user-cancelled':
          c += 'Please authorize the required permissions to sign in to the application'
          break
        case 'auth/user-not-found':
          c += "That email address doesn't match an existing account"
          break
        case 'auth/user-token-expired':
          c += Md()
          break
        case 'auth/weak-password':
          c += 'Strong passwords have at least 6 characters and a mix of letters and numbers'
          break
        case 'auth/wrong-password':
          c += "The email and password you entered don't match"
          break
        case 'auth/network-request-failed':
          c += 'A network error has occurred'
          break
        case 'auth/invalid-phone-number':
          c += Hd()
          break
        case 'auth/invalid-verification-code':
          c += C('Wrong code. Try again.')
          break
        case 'auth/code-expired':
          c += 'This code is no longer valid'
          break
        case 'auth/expired-action-code':
          c += 'This code has expired.'
          break
        case 'auth/invalid-action-code':
          c +=
            'The action code is invalid. This can happen if the code is malformed, expired, or has already been used.'
      }
      if ((b = C(c).toString())) return b
      try {
        return JSON.parse(a.message), og('Internal error: ' + a.message, void 0), Jd().toString()
      } catch (d) {
        return a.message
      }
    }
    function Sl(a, b, c) {
      var d =
        ai[b] && firebase.auth[ai[b]]
          ? new firebase.auth[ai[b]]()
          : 0 == b.indexOf('saml.')
          ? new firebase.auth.SAMLAuthProvider(b)
          : new firebase.auth.OAuthProvider(b)
      if (!d) throw Error('Invalid Firebase Auth provider!')
      var e = wi(W(a), b)
      if (d.addScope) for (var f = 0; f < e.length; f++) d.addScope(e[f])
      e = xi(W(a), b) || {}
      c &&
        (b == firebase.auth.GoogleAuthProvider.PROVIDER_ID
          ? (a = 'login_hint')
          : b == firebase.auth.GithubAuthProvider.PROVIDER_ID
          ? (a = 'login')
          : (a = (a = ii(W(a), b)) && a.Ob),
        a && (e[a] = c))
      d.setCustomParameters && d.setCustomParameters(e)
      return d
    }
    function Tl(a, b, c, d) {
      function e() {
        Dh(new Dg(a.h.tenantId || null), X(a))
        V(
          a,
          b.I(
            r(a.dc, a),
            [k],
            function () {
              if ('file:' === (window.location && window.location.protocol))
                return V(
                  a,
                  Ul(a).then(function (p) {
                    b.m()
                    wh(rh, X(a))
                    L('callback', a, h, F(p))
                  }, f)
                )
            },
            g
          )
        )
      }
      function f(p) {
        wh(rh, X(a))
        if (!p.name || 'cancel' != p.name)
          switch (((p = Ml(p)), p.code)) {
            case 'auth/popup-blocked':
              e()
              break
            case 'auth/popup-closed-by-user':
            case 'auth/cancelled-popup-request':
              break
            case 'auth/credential-already-in-use':
              break
            case 'auth/network-request-failed':
            case 'auth/too-many-requests':
            case 'auth/user-cancelled':
              b.a(T(p))
              break
            case 'auth/admin-restricted-operation':
              b.m()
              pi(W(a)) ? L('handleUnauthorizedUser', a, h, null, c) : L('callback', a, h, df(p))
              break
            default:
              b.m(), L('callback', a, h, df(p))
          }
      }
      function g(p) {
        wh(rh, X(a))
        ;(p.name && 'cancel' == p.name) ||
          (og('signInWithRedirect: ' + p.code, void 0),
          (p = T(p)),
          'blank' == b.Ga && Gi(W(a)) ? (b.m(), L('providerSignIn', a, h, p)) : b.a(p))
      }
      var h = Q(b),
        k = Sl(a, c, d)
      Hi(W(a)) == Ii
        ? e()
        : V(
            a,
            Vl(a, k).then(function (p) {
              b.m()
              L('callback', a, h, F(p))
            }, f)
          )
    }
    function Wl(a, b) {
      V(
        a,
        b.I(
          r(a.$b, a),
          [],
          function (c) {
            b.m()
            return Nl(a, b, c, !0)
          },
          function (c) {
            ;(c.name && 'cancel' == c.name) ||
              (og('ContinueAsGuest: ' + c.code, void 0), (c = T(c)), b.a(c))
          }
        )
      )
    }
    function Xl(a, b, c) {
      function d(f) {
        var g = !1
        f = b.I(
          r(a.ac, a),
          [f],
          function (h) {
            var k = Q(b)
            b.m()
            L('callback', a, k, F(h))
            g = !0
          },
          function (h) {
            if (!h.name || 'cancel' != h.name)
              if (!h || 'auth/credential-already-in-use' != h.code)
                if (h && 'auth/email-already-in-use' == h.code && h.email && h.credential) {
                  var k = Q(b)
                  b.m()
                  L('callback', a, k, df(h))
                } else
                  h && 'auth/admin-restricted-operation' == h.code && pi(W(a))
                    ? ((h = Q(b)),
                      b.m(),
                      L(
                        'handleUnauthorizedUser',
                        a,
                        h,
                        null,
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID
                      ))
                    : ((h = T(h)), b.a(h))
          }
        )
        V(a, f)
        return f.then(
          function () {
            return g
          },
          function () {
            return !1
          }
        )
      }
      if (c && c.credential && c.clientId === li(W(a))) {
        if (wi(W(a), firebase.auth.GoogleAuthProvider.PROVIDER_ID).length) {
          try {
            var e = JSON.parse(atob(c.credential.split('.')[1])).email
          } catch (f) {}
          Tl(a, b, firebase.auth.GoogleAuthProvider.PROVIDER_ID, e)
          return F(!0)
        }
        return d(firebase.auth.GoogleAuthProvider.credential(c.credential))
      }
      c &&
        b.a(
          C('The selected credential for the authentication provider is not supported!').toString()
        )
      return F(!1)
    }
    function Yl(a, b) {
      var c = b.j(),
        d = b.u()
      if (c)
        if (d) {
          var e = firebase.auth.EmailAuthProvider.credential(c, d)
          V(
            a,
            b.I(
              r(a.bc, a),
              [c, d],
              function (f) {
                return Nl(a, b, {
                  user: f.user,
                  credential: e,
                  operationType: f.operationType,
                  additionalUserInfo: f.additionalUserInfo,
                })
              },
              function (f) {
                if (!f.name || 'cancel' != f.name)
                  switch (f.code) {
                    case 'auth/email-already-in-use':
                      break
                    case 'auth/email-exists':
                      N(b.l(), !1)
                      Qj(b.U(), T(f))
                      break
                    case 'auth/too-many-requests':
                    case 'auth/wrong-password':
                      N(b.i(), !1)
                      Qj(b.B(), T(f))
                      break
                    default:
                      og('verifyPassword: ' + f.message, void 0), b.a(T(f))
                  }
              }
            )
          )
        } else b.i().focus()
      else b.l().focus()
    }
    function Zl(a) {
      a = hi(W(a))
      return 1 == a.length && a[0] == firebase.auth.EmailAuthProvider.PROVIDER_ID
    }
    function $l(a) {
      a = hi(W(a))
      return 1 == a.length && a[0] == firebase.auth.PhoneAuthProvider.PROVIDER_ID
    }
    function S(a, b, c, d) {
      Zl(a)
        ? d
          ? L('signIn', a, b, c, d)
          : am(a, b, c)
        : a && $l(a) && !d
        ? L('phoneSignInStart', a, b)
        : a && Gi(W(a)) && !d
        ? L('federatedRedirect', a, b, c)
        : L('providerSignIn', a, b, d, c)
    }
    function bm(a, b, c, d) {
      var e = Q(b)
      V(
        a,
        b.I(
          r(U(a).fetchSignInMethodsForEmail, U(a)),
          [c],
          function (f) {
            b.m()
            cm(a, e, f, c, d)
          },
          function (f) {
            f = T(f)
            b.a(f)
          }
        )
      )
    }
    function cm(a, b, c, d, e, f) {
      c.length || (Di(W(a)) && !Di(W(a)))
        ? Ma(c, firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)
          ? L('passwordSignIn', a, b, d, f)
          : 1 == c.length && c[0] === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
          ? Di(W(a))
            ? L('sendEmailLinkForSignIn', a, b, d, function () {
                L('signIn', a, b)
              })
            : L('unsupportedProvider', a, b, d)
          : (c = Zh(c, hi(W(a))))
          ? (Bh(new Ag(d), X(a)), L('federatedSignIn', a, b, d, c, e))
          : L('unsupportedProvider', a, b, d)
        : oi(W(a))
        ? L('handleUnauthorizedUser', a, b, d, firebase.auth.EmailAuthProvider.PROVIDER_ID)
        : Di(W(a))
        ? L('sendEmailLinkForSignIn', a, b, d, function () {
            L('signIn', a, b)
          })
        : L('passwordSignUp', a, b, d, void 0, void 0, f)
    }
    function dm(a, b, c, d, e, f) {
      var g = Q(b)
      V(
        a,
        b.I(
          r(a.Ib, a),
          [c, f],
          function () {
            b.m()
            L('emailLinkSignInSent', a, g, c, d, f)
          },
          e
        )
      )
    }
    function am(a, b, c) {
      c ? L('prefilledEmailSignIn', a, b, c) : L('signIn', a, b)
    }
    function em() {
      return tb(tf(), 'oobCode')
    }
    function fm() {
      var a = tb(tf(), 'continueUrl')
      return a
        ? function () {
            Nc(window.location, a)
          }
        : null
    }
    function gm(a, b) {
      P.call(this, Kk, void 0, b, 'anonymousUserMismatch')
      this.i = a
    }
    m(gm, P)
    gm.prototype.v = function () {
      var a = this
      O(this, this.l(), function () {
        a.i()
      })
      this.l().focus()
      P.prototype.v.call(this)
    }
    gm.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    u(gm.prototype, { l: ml })
    K.anonymousUserMismatch = function (a, b) {
      var c = new gm(function () {
        c.m()
        S(a, b)
      })
      c.render(b)
      Y(a, c)
    }
    function hm(a) {
      P.call(this, Dk, void 0, a, 'callback')
    }
    m(hm, P)
    hm.prototype.I = function (a, b, c, d) {
      return a.apply(null, b).then(c, d)
    }
    function im(a, b, c) {
      if (c.user) {
        var d = {
            user: c.user,
            credential: c.credential,
            operationType: c.operationType,
            additionalUserInfo: c.additionalUserInfo,
          },
          e = zh(X(a)),
          f = e && e.g
        if (f && !jm(c.user, f)) km(a, b, d)
        else {
          var g = e && e.a
          g
            ? V(
                a,
                c.user.linkWithCredential(g).then(
                  function (h) {
                    d = {
                      user: h.user,
                      credential: g,
                      operationType: h.operationType,
                      additionalUserInfo: h.additionalUserInfo,
                    }
                    lm(a, b, d)
                  },
                  function (h) {
                    mm(a, b, h)
                  }
                )
              )
            : lm(a, b, d)
        }
      } else (c = Q(b)), b.m(), Ah(X(a)), S(a, c)
    }
    function lm(a, b, c) {
      Ah(X(a))
      Nl(a, b, c)
    }
    function mm(a, b, c) {
      var d = Q(b)
      Ah(X(a))
      c = T(c)
      b.m()
      S(a, d, void 0, c)
    }
    function nm(a, b, c, d) {
      var e = Q(b)
      V(
        a,
        U(a)
          .fetchSignInMethodsForEmail(c)
          .then(
            function (f) {
              b.m()
              f.length
                ? Ma(f, firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)
                  ? L('passwordLinking', a, e, c)
                  : 1 == f.length &&
                    f[0] === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
                  ? L('emailLinkSignInLinking', a, e, c)
                  : (f = Zh(f, hi(W(a))))
                  ? L('federatedLinking', a, e, c, f, d)
                  : (Ah(X(a)), L('unsupportedProvider', a, e, c))
                : (Ah(X(a)), L('passwordRecovery', a, e, c, !1, Kd().toString()))
            },
            function (f) {
              mm(a, b, f)
            }
          )
      )
    }
    function km(a, b, c) {
      var d = Q(b)
      V(
        a,
        om(a).then(
          function () {
            b.m()
            L('emailMismatch', a, d, c)
          },
          function (e) {
            ;(e.name && 'cancel' == e.name) || ((e = T(e.code)), b.a(e))
          }
        )
      )
    }
    function jm(a, b) {
      if (b == a.email) return !0
      if (a.providerData)
        for (var c = 0; c < a.providerData.length; c++) if (b == a.providerData[c].email) return !0
      return !1
    }
    K.callback = function (a, b, c) {
      var d = new hm()
      d.render(b)
      Y(a, d)
      c = c || Ul(a)
      V(
        a,
        c.then(
          function (e) {
            im(a, d, e)
          },
          function (e) {
            if (
              (e = Ml(e)) &&
              ('auth/account-exists-with-different-credential' == e.code ||
                'auth/email-already-in-use' == e.code) &&
              e.email &&
              e.credential
            )
              Bh(new Ag(e.email, e.credential), X(a)), nm(a, d, e.email)
            else if (e && 'auth/user-cancelled' == e.code) {
              var f = zh(X(a)),
                g = T(e)
              f && f.a ? nm(a, d, f.g, g) : f ? bm(a, d, f.g, g) : mm(a, d, e)
            } else
              (e && 'auth/credential-already-in-use' == e.code) ||
                (e && 'auth/operation-not-supported-in-this-environment' == e.code && Zl(a)
                  ? im(a, d, { user: null, credential: null })
                  : e && 'auth/admin-restricted-operation' == e.code && pi(W(a))
                  ? (d.m(), Ah(X(a)), L('handleUnauthorizedUser', a, b, null, null))
                  : mm(a, d, e))
          }
        )
      )
    }
    function pm(a, b) {
      P.call(this, Jk, void 0, b, 'differentDeviceError')
      this.i = a
    }
    m(pm, P)
    pm.prototype.v = function () {
      var a = this
      O(this, this.l(), function () {
        a.i()
      })
      this.l().focus()
      P.prototype.v.call(this)
    }
    pm.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    u(pm.prototype, { l: ml })
    K.differentDeviceError = function (a, b) {
      var c = new pm(function () {
        c.m()
        S(a, b)
      })
      c.render(b)
      Y(a, c)
    }
    function qm(a, b, c, d) {
      P.call(this, Uk, { email: a, G: !!c }, d, 'emailChangeRevoke')
      this.l = b
      this.i = c || null
    }
    m(qm, P)
    qm.prototype.v = function () {
      var a = this
      O(this, M(this, 'firebaseui-id-reset-password-link'), function () {
        a.l()
      })
      this.i && (this.w(this.i), this.u().focus())
      P.prototype.v.call(this)
    }
    qm.prototype.o = function () {
      this.l = this.i = null
      P.prototype.o.call(this)
    }
    u(qm.prototype, { u: ll, B: ml, w: nl })
    function rm() {
      return M(this, 'firebaseui-id-new-password')
    }
    function sm() {
      return M(this, 'firebaseui-id-password-toggle')
    }
    function tm() {
      this.Ra = !this.Ra
      var a = sm.call(this),
        b = rm.call(this)
      this.Ra
        ? ((b.type = 'text'),
          Wi(a, 'firebaseui-input-toggle-off'),
          Xi(a, 'firebaseui-input-toggle-on'))
        : ((b.type = 'password'),
          Wi(a, 'firebaseui-input-toggle-on'),
          Xi(a, 'firebaseui-input-toggle-off'))
      b.focus()
    }
    function um() {
      return M(this, 'firebaseui-id-new-password-error')
    }
    function vm() {
      this.Ra = !1
      var a = rm.call(this)
      a.type = 'password'
      var b = um.call(this)
      Lj(this, a, function () {
        Rj(b) && (N(a, !0), Pj(b))
      })
      var c = sm.call(this)
      Wi(c, 'firebaseui-input-toggle-on')
      Xi(c, 'firebaseui-input-toggle-off')
      Nj(this, a, function () {
        Wi(c, 'firebaseui-input-toggle-focus')
        Xi(c, 'firebaseui-input-toggle-blur')
      })
      Oj(this, a, function () {
        Wi(c, 'firebaseui-input-toggle-blur')
        Xi(c, 'firebaseui-input-toggle-focus')
      })
      O(this, c, r(tm, this))
    }
    function wm() {
      var a = rm.call(this)
      var b = um.call(this)
      Yi(a)
        ? (N(a, !0), Pj(b), (b = !0))
        : (N(a, !1), Qj(b, C('Enter your password').toString()), (b = !1))
      return b ? Yi(a) : null
    }
    function xm(a, b, c) {
      P.call(this, Rk, { email: a }, c, 'passwordReset')
      this.l = b
    }
    m(xm, P)
    xm.prototype.v = function () {
      this.H()
      this.B(this.l)
      xk(this, this.i(), this.l)
      this.i().focus()
      P.prototype.v.call(this)
    }
    xm.prototype.o = function () {
      this.l = null
      P.prototype.o.call(this)
    }
    u(xm.prototype, { i: rm, w: um, M: sm, H: vm, u: wm, U: ll, P: ml, B: nl })
    function ym(a, b, c, d, e) {
      P.call(
        this,
        al,
        { factorId: a, phoneNumber: c || null, G: !!d },
        e,
        'revertSecondFactorAdditionSuccess'
      )
      this.l = b
      this.i = d || null
    }
    m(ym, P)
    ym.prototype.v = function () {
      var a = this
      O(this, M(this, 'firebaseui-id-reset-password-link'), function () {
        a.l()
      })
      this.i && (this.w(this.i), this.u().focus())
      P.prototype.v.call(this)
    }
    ym.prototype.o = function () {
      this.l = this.i = null
      P.prototype.o.call(this)
    }
    u(ym.prototype, { u: ll, B: ml, w: nl })
    function zm(a, b, c, d, e) {
      var f = c.u()
      f &&
        V(
          a,
          c.I(
            r(U(a).confirmPasswordReset, U(a)),
            [d, f],
            function () {
              c.m()
              var g = new Hl(e)
              g.render(b)
              Y(a, g)
            },
            function (g) {
              Am(a, b, c, g)
            }
          )
        )
    }
    function Am(a, b, c, d) {
      'auth/weak-password' == (d && d.code)
        ? ((a = T(d)), N(c.i(), !1), Qj(c.w(), a), c.i().focus())
        : (c && c.m(), (c = new Il()), c.render(b), Y(a, c))
    }
    function Bm(a, b, c) {
      var d = new qm(c, function () {
        V(
          a,
          d.I(
            r(U(a).sendPasswordResetEmail, U(a)),
            [c],
            function () {
              d.m()
              d = new Al(c, void 0, H(W(a)), J(W(a)))
              d.render(b)
              Y(a, d)
            },
            function () {
              d.a(Id().toString())
            }
          )
        )
      })
      d.render(b)
      Y(a, d)
    }
    function Cm(a, b, c, d) {
      var e = new ym(
        d.factorId,
        function () {
          e.I(
            r(U(a).sendPasswordResetEmail, U(a)),
            [c],
            function () {
              e.m()
              e = new Al(c, void 0, H(W(a)), J(W(a)))
              e.render(b)
              Y(a, e)
            },
            function () {
              e.a(Id().toString())
            }
          )
        },
        d.phoneNumber
      )
      e.render(b)
      Y(a, e)
    }
    K.passwordReset = function (a, b, c, d) {
      V(
        a,
        U(a)
          .verifyPasswordResetCode(c)
          .then(
            function (e) {
              var f = new xm(e, function () {
                zm(a, b, f, c, d)
              })
              f.render(b)
              Y(a, f)
            },
            function () {
              Am(a, b)
            }
          )
      )
    }
    K.emailChangeRevocation = function (a, b, c) {
      var d = null
      V(
        a,
        U(a)
          .checkActionCode(c)
          .then(function (e) {
            d = e.data.email
            return U(a).applyActionCode(c)
          })
          .then(
            function () {
              Bm(a, b, d)
            },
            function () {
              var e = new Jl()
              e.render(b)
              Y(a, e)
            }
          )
      )
    }
    K.emailVerification = function (a, b, c, d) {
      V(
        a,
        U(a)
          .applyActionCode(c)
          .then(
            function () {
              var e = new Bl(d)
              e.render(b)
              Y(a, e)
            },
            function () {
              var e = new Cl()
              e.render(b)
              Y(a, e)
            }
          )
      )
    }
    K.revertSecondFactorAddition = function (a, b, c) {
      var d = null,
        e = null
      V(
        a,
        U(a)
          .checkActionCode(c)
          .then(function (f) {
            d = f.data.email
            e = f.data.multiFactorInfo
            return U(a).applyActionCode(c)
          })
          .then(
            function () {
              Cm(a, b, d, e)
            },
            function () {
              var f = new Fl()
              f.render(b)
              Y(a, f)
            }
          )
      )
    }
    K.verifyAndChangeEmail = function (a, b, c, d) {
      var e = null
      V(
        a,
        U(a)
          .checkActionCode(c)
          .then(function (f) {
            e = f.data.email
            return U(a).applyActionCode(c)
          })
          .then(
            function () {
              var f = new Dl(e, d)
              f.render(b)
              Y(a, f)
            },
            function () {
              var f = new El()
              f.render(b)
              Y(a, f)
            }
          )
      )
    }
    function Dm(a, b) {
      try {
        var c = 'number' == typeof a.selectionStart
      } catch (d) {
        c = !1
      }
      c
        ? ((a.selectionStart = b), (a.selectionEnd = b))
        : z &&
          !mc('9') &&
          ('textarea' == a.type &&
            (b = a.value.substring(0, b).replace(/(\r\n|\r|\n)/g, '\n').length),
          (a = a.createTextRange()),
          a.collapse(!0),
          a.move('character', b),
          a.select())
    }
    function Em(a, b, c, d, e, f) {
      P.call(this, Ik, { email: c }, f, 'emailLinkSignInConfirmation', { F: d, D: e })
      this.l = a
      this.u = b
    }
    m(Em, P)
    Em.prototype.v = function () {
      this.w(this.l)
      this.B(this.l, this.u)
      this.i().focus()
      Dm(this.i(), (this.i().value || '').length)
      P.prototype.v.call(this)
    }
    Em.prototype.o = function () {
      this.u = this.l = null
      P.prototype.o.call(this)
    }
    u(Em.prototype, { i: ul, M: vl, w: wl, H: xl, j: yl, U: ll, P: ml, B: nl })
    K.emailLinkConfirmation = function (a, b, c, d, e, f) {
      var g = new Em(
        function () {
          var h = g.j()
          h ? (g.m(), d(a, b, h, c)) : g.i().focus()
        },
        function () {
          g.m()
          S(a, b, e || void 0)
        },
        e || void 0,
        H(W(a)),
        J(W(a))
      )
      g.render(b)
      Y(a, g)
      f && g.a(f)
    }
    function Fm(a, b, c, d, e) {
      P.call(this, Nk, { ga: a }, e, 'emailLinkSignInLinkingDifferentDevice', { F: c, D: d })
      this.i = b
    }
    m(Fm, P)
    Fm.prototype.v = function () {
      this.u(this.i)
      this.l().focus()
      P.prototype.v.call(this)
    }
    Fm.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    u(Fm.prototype, { l: ll, u: nl })
    K.emailLinkNewDeviceLinking = function (a, b, c, d) {
      var e = new Pb(c)
      c = e.a.a.get(x.PROVIDER_ID) || null
      Tb(e, null)
      if (c) {
        var f = new Fm(
          ii(W(a), c),
          function () {
            f.m()
            d(a, b, e.toString())
          },
          H(W(a)),
          J(W(a))
        )
        f.render(b)
        Y(a, f)
      } else S(a, b)
    }
    function Gm(a) {
      P.call(this, Fk, void 0, a, 'blank')
    }
    m(Gm, P)
    function Hm(a, b, c, d, e) {
      var f = new Gm(),
        g = new Pb(c),
        h = g.a.a.get(x.$a) || '',
        k = g.a.a.get(x.Sa) || '',
        p = '1' === g.a.a.get(x.Qa),
        t = Sb(g),
        I = g.a.a.get(x.PROVIDER_ID) || null
      g = g.a.a.get(x.vb) || null
      Im(a, g)
      var Ca = !vh(th, X(a)),
        Xk = d || Eh(k, X(a)),
        md = (d = Fh(k, X(a))) && d.a
      I && md && md.providerId !== I && (md = null)
      f.render(b)
      Y(a, f)
      V(
        a,
        f.I(
          function () {
            var ya = F(null)
            ya =
              (t && Ca) || (Ca && p)
                ? df(Error('anonymous-user-not-found'))
                : Jm(a, c).then(function (xg) {
                    if (I && !md) throw Error('pending-credential-not-found')
                    return xg
                  })
            var nd = null
            return ya
              .then(function (xg) {
                nd = xg
                return e ? null : U(a).checkActionCode(h)
              })
              .then(function () {
                return nd
              })
          },
          [],
          function (ya) {
            Xk
              ? Km(a, f, Xk, c, md, ya)
              : p
              ? (f.m(), L('differentDeviceError', a, b))
              : (f.m(), L('emailLinkConfirmation', a, b, c, Lm))
          },
          function (ya) {
            var nd = void 0
            if (!ya || !ya.name || 'cancel' != ya.name)
              switch ((f.m(), ya && ya.message)) {
                case 'anonymous-user-not-found':
                  L('differentDeviceError', a, b)
                  break
                case 'anonymous-user-mismatch':
                  L('anonymousUserMismatch', a, b)
                  break
                case 'pending-credential-not-found':
                  L('emailLinkNewDeviceLinking', a, b, c, Mm)
                  break
                default:
                  ya && (nd = T(ya)), S(a, b, void 0, nd)
              }
          }
        )
      )
    }
    function Lm(a, b, c, d) {
      Hm(a, b, d, c, !0)
    }
    function Mm(a, b, c) {
      Hm(a, b, c)
    }
    function Km(a, b, c, d, e, f) {
      var g = Q(b)
      b.$(
        'mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon',
        C('Signing in...').toString()
      )
      var h = null
      e = (f ? Nm(a, f, c, d, e) : Om(a, c, d, e)).then(
        function (k) {
          wh(uh, X(a))
          wh(th, X(a))
          b.h()
          b.$('firebaseui-icon-done', C('Signed in!').toString())
          h = setTimeout(function () {
            b.h()
            Nl(a, b, k, !0)
          }, 1e3)
          V(a, function () {
            b && (b.h(), b.m())
            clearTimeout(h)
          })
        },
        function (k) {
          b.h()
          b.m()
          if (!k.name || 'cancel' != k.name) {
            k = Ml(k)
            var p = T(k)
            'auth/email-already-in-use' == k.code || 'auth/credential-already-in-use' == k.code
              ? (wh(uh, X(a)), wh(th, X(a)))
              : 'auth/invalid-email' == k.code
              ? ((p = C(
                  'The email provided does not match the current sign-in session.'
                ).toString()),
                L('emailLinkConfirmation', a, g, d, Lm, null, p))
              : S(a, g, c, p)
          }
        }
      )
      V(a, e)
    }
    K.emailLinkSignInCallback = Hm
    function Pm(a, b, c, d, e, f) {
      P.call(this, Mk, { email: a, ga: b }, f, 'emailLinkSignInLinking', { F: d, D: e })
      this.i = c
    }
    m(Pm, P)
    Pm.prototype.v = function () {
      this.u(this.i)
      this.l().focus()
      P.prototype.v.call(this)
    }
    Pm.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    u(Pm.prototype, { l: ll, u: nl })
    function Qm(a, b, c, d) {
      var e = Q(b)
      dm(
        a,
        b,
        c,
        function () {
          S(a, e, c)
        },
        function (f) {
          if (!f.name || 'cancel' != f.name) {
            var g = T(f)
            f && 'auth/network-request-failed' == f.code ? b.a(g) : (b.m(), S(a, e, c, g))
          }
        },
        d
      )
    }
    K.emailLinkSignInLinking = function (a, b, c) {
      var d = zh(X(a))
      Ah(X(a))
      if (d) {
        var e = d.a.providerId,
          f = new Pm(
            c,
            ii(W(a), e),
            function () {
              Qm(a, f, c, d)
            },
            H(W(a)),
            J(W(a))
          )
        f.render(b)
        Y(a, f)
      } else S(a, b)
    }
    function Rm(a, b, c, d, e, f) {
      P.call(this, Gk, { email: a }, f, 'emailLinkSignInSent', { F: d, D: e })
      this.u = b
      this.i = c
    }
    m(Rm, P)
    Rm.prototype.v = function () {
      var a = this
      O(this, this.l(), function () {
        a.i()
      })
      O(this, M(this, 'firebaseui-id-trouble-getting-email-link'), function () {
        a.u()
      })
      this.l().focus()
      P.prototype.v.call(this)
    }
    Rm.prototype.o = function () {
      this.i = this.u = null
      P.prototype.o.call(this)
    }
    u(Rm.prototype, { l: ml })
    K.emailLinkSignInSent = function (a, b, c, d, e) {
      var f = new Rm(
        c,
        function () {
          f.m()
          L('emailNotReceived', a, b, c, d, e)
        },
        function () {
          f.m()
          d()
        },
        H(W(a)),
        J(W(a))
      )
      f.render(b)
      Y(a, f)
    }
    function Sm(a, b, c, d, e, f, g) {
      P.call(this, el, { jc: a, Qb: b }, g, 'emailMismatch', { F: e, D: f })
      this.l = c
      this.i = d
    }
    m(Sm, P)
    Sm.prototype.v = function () {
      this.w(this.l, this.i)
      this.u().focus()
      P.prototype.v.call(this)
    }
    Sm.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    u(Sm.prototype, { u: ll, B: ml, w: nl })
    K.emailMismatch = function (a, b, c) {
      var d = zh(X(a))
      if (d) {
        var e = new Sm(
          c.user.email,
          d.g,
          function () {
            var f = e
            Ah(X(a))
            Nl(a, f, c)
          },
          function () {
            var f = c.credential.providerId,
              g = Q(e)
            e.m()
            d.a ? L('federatedLinking', a, g, d.g, f) : L('federatedSignIn', a, g, d.g, f)
          },
          H(W(a)),
          J(W(a))
        )
        e.render(b)
        Y(a, e)
      } else S(a, b)
    }
    function Tm(a, b, c, d, e) {
      P.call(this, Hk, void 0, e, 'emailNotReceived', { F: c, D: d })
      this.l = a
      this.i = b
    }
    m(Tm, P)
    Tm.prototype.v = function () {
      var a = this
      O(this, this.u(), function () {
        a.i()
      })
      O(this, this.Da(), function () {
        a.l()
      })
      this.u().focus()
      P.prototype.v.call(this)
    }
    Tm.prototype.Da = function () {
      return M(this, 'firebaseui-id-resend-email-link')
    }
    Tm.prototype.o = function () {
      this.i = this.l = null
      P.prototype.o.call(this)
    }
    u(Tm.prototype, { u: ml })
    K.emailNotReceived = function (a, b, c, d, e) {
      var f = new Tm(
        function () {
          dm(
            a,
            f,
            c,
            d,
            function (g) {
              g = T(g)
              f.a(g)
            },
            e
          )
        },
        function () {
          f.m()
          S(a, b, c)
        },
        H(W(a)),
        J(W(a))
      )
      f.render(b)
      Y(a, f)
    }
    function Um(a, b, c, d, e, f) {
      P.call(this, Ok, { email: a, ga: b }, f, 'federatedLinking', { F: d, D: e })
      this.i = c
    }
    m(Um, P)
    Um.prototype.v = function () {
      this.u(this.i)
      this.l().focus()
      P.prototype.v.call(this)
    }
    Um.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    u(Um.prototype, { l: ll, u: nl })
    K.federatedLinking = function (a, b, c, d, e) {
      var f = zh(X(a))
      if (f && f.a) {
        var g = new Um(
          c,
          ii(W(a), d),
          function () {
            Tl(a, g, d, c)
          },
          H(W(a)),
          J(W(a))
        )
        g.render(b)
        Y(a, g)
        e && g.a(e)
      } else S(a, b)
    }
    K.federatedRedirect = function (a, b, c) {
      var d = new Gm()
      d.render(b)
      Y(a, d)
      b = hi(W(a))[0]
      Tl(a, d, b, c)
    }
    K.federatedSignIn = function (a, b, c, d, e) {
      var f = new Um(
        c,
        ii(W(a), d),
        function () {
          Tl(a, f, d, c)
        },
        H(W(a)),
        J(W(a))
      )
      f.render(b)
      Y(a, f)
      e && f.a(e)
    }
    function Vm(a, b, c, d) {
      var e = b.u()
      e
        ? V(
            a,
            b.I(
              r(a.Xb, a),
              [c, e],
              function (f) {
                f = f.user.linkWithCredential(d).then(function (g) {
                  return Nl(a, b, {
                    user: g.user,
                    credential: d,
                    operationType: g.operationType,
                    additionalUserInfo: g.additionalUserInfo,
                  })
                })
                V(a, f)
                return f
              },
              function (f) {
                if (!f.name || 'cancel' != f.name)
                  switch (f.code) {
                    case 'auth/wrong-password':
                      N(b.i(), !1)
                      Qj(b.B(), T(f))
                      break
                    case 'auth/too-many-requests':
                      b.a(T(f))
                      break
                    default:
                      og('signInWithEmailAndPassword: ' + f.message, void 0), b.a(T(f))
                  }
              }
            )
          )
        : b.i().focus()
    }
    K.passwordLinking = function (a, b, c) {
      var d = zh(X(a))
      Ah(X(a))
      var e = d && d.a
      if (e) {
        var f = new sl(
          c,
          function () {
            Vm(a, f, c, e)
          },
          function () {
            f.m()
            L('passwordRecovery', a, b, c)
          },
          H(W(a)),
          J(W(a))
        )
        f.render(b)
        Y(a, f)
      } else S(a, b)
    }
    function Wm(a, b, c, d, e, f) {
      P.call(this, Bk, { email: c, Ta: !!b }, f, 'passwordRecovery', { F: d, D: e })
      this.l = a
      this.u = b
    }
    m(Wm, P)
    Wm.prototype.v = function () {
      this.B()
      this.H(this.l, this.u)
      Yi(this.i()) || this.i().focus()
      xk(this, this.i(), this.l)
      P.prototype.v.call(this)
    }
    Wm.prototype.o = function () {
      this.u = this.l = null
      P.prototype.o.call(this)
    }
    u(Wm.prototype, { i: ul, w: vl, B: wl, M: xl, j: yl, U: ll, P: ml, H: nl })
    function Xm(a, b) {
      var c = b.j()
      if (c) {
        var d = Q(b)
        V(
          a,
          b.I(
            r(U(a).sendPasswordResetEmail, U(a)),
            [c],
            function () {
              b.m()
              var e = new Al(
                c,
                function () {
                  e.m()
                  S(a, d)
                },
                H(W(a)),
                J(W(a))
              )
              e.render(d)
              Y(a, e)
            },
            function (e) {
              N(b.i(), !1)
              Qj(b.w(), T(e))
            }
          )
        )
      } else b.i().focus()
    }
    K.passwordRecovery = function (a, b, c, d, e) {
      var f = new Wm(
        function () {
          Xm(a, f)
        },
        d
          ? void 0
          : function () {
              f.m()
              S(a, b)
            },
        c,
        H(W(a)),
        J(W(a))
      )
      f.render(b)
      Y(a, f)
      e && f.a(e)
    }
    K.passwordSignIn = function (a, b, c, d) {
      var e = new zl(
        function () {
          Yl(a, e)
        },
        function () {
          var f = e.M()
          e.m()
          L('passwordRecovery', a, b, f)
        },
        c,
        H(W(a)),
        J(W(a)),
        d
      )
      e.render(b)
      Y(a, e)
    }
    function Ym() {
      return M(this, 'firebaseui-id-name')
    }
    function Zm() {
      return M(this, 'firebaseui-id-name-error')
    }
    function $m(a, b, c, d, e, f, g, h, k) {
      P.call(this, Ak, { email: d, Tb: a, name: e, Ta: !!c, ia: !!h }, k, 'passwordSignUp', {
        F: f,
        D: g,
      })
      this.w = b
      this.H = c
      this.B = a
    }
    m($m, P)
    $m.prototype.v = function () {
      this.ea()
      this.B && this.Ja()
      this.ua()
      this.pa(this.w, this.H)
      this.B
        ? (wk(this, this.i(), this.u()), wk(this, this.u(), this.l()))
        : wk(this, this.i(), this.l())
      this.w && xk(this, this.l(), this.w)
      Yi(this.i())
        ? this.B && !Yi(this.u())
          ? this.u().focus()
          : this.l().focus()
        : this.i().focus()
      P.prototype.v.call(this)
    }
    $m.prototype.o = function () {
      this.H = this.w = null
      P.prototype.o.call(this)
    }
    u($m.prototype, {
      i: ul,
      U: vl,
      ea: wl,
      jb: xl,
      j: yl,
      u: Ym,
      Cc: Zm,
      Ja: function () {
        var a = Ym.call(this),
          b = Zm.call(this)
        Lj(this, a, function () {
          Rj(b) && (N(a, !0), Pj(b))
        })
      },
      M: function () {
        var a = Ym.call(this)
        var b = Zm.call(this)
        var c = Yi(a)
        c = !/^[\s\xa0]*$/.test(null == c ? '' : String(c))
        N(a, c)
        c ? (Pj(b), (b = !0)) : (Qj(b, C('Enter your account name').toString()), (b = !1))
        return b ? Ua(Yi(a)) : null
      },
      l: rm,
      ba: um,
      lb: sm,
      ua: vm,
      P: wm,
      Nb: ll,
      Mb: ml,
      pa: nl,
    })
    function an(a, b) {
      var c = Ci(W(a)),
        d = b.j(),
        e = null
      c && (e = b.M())
      var f = b.P()
      if (d) {
        if (c)
          if (e) e = cb(e)
          else {
            b.u().focus()
            return
          }
        if (f) {
          var g = firebase.auth.EmailAuthProvider.credential(d, f)
          V(
            a,
            b.I(
              r(a.Yb, a),
              [d, f],
              function (h) {
                var k = {
                  user: h.user,
                  credential: g,
                  operationType: h.operationType,
                  additionalUserInfo: h.additionalUserInfo,
                }
                return c
                  ? ((h = h.user.updateProfile({ displayName: e }).then(function () {
                      return Nl(a, b, k)
                    })),
                    V(a, h),
                    h)
                  : Nl(a, b, k)
              },
              function (h) {
                if (!h.name || 'cancel' != h.name) {
                  var k = Ml(h)
                  h = T(k)
                  switch (k.code) {
                    case 'auth/email-already-in-use':
                      return bn(a, b, d, k)
                    case 'auth/too-many-requests':
                      h = C(
                        'Too many account requests are coming from your IP address. Try again in a few minutes.'
                      ).toString()
                    case 'auth/operation-not-allowed':
                    case 'auth/weak-password':
                      N(b.l(), !1)
                      Qj(b.ba(), h)
                      break
                    case 'auth/admin-restricted-operation':
                      pi(W(a))
                        ? ((h = Q(b)),
                          b.m(),
                          L(
                            'handleUnauthorizedUser',
                            a,
                            h,
                            d,
                            firebase.auth.EmailAuthProvider.PROVIDER_ID
                          ))
                        : b.a(h)
                      break
                    default:
                      ;(k = 'setAccountInfo: ' + ah(k)), og(k, void 0), b.a(h)
                  }
                }
              }
            )
          )
        } else b.l().focus()
      } else b.i().focus()
    }
    function bn(a, b, c, d) {
      function e() {
        var g = T(d)
        N(b.i(), !1)
        Qj(b.U(), g)
        b.i().focus()
      }
      var f = U(a)
        .fetchSignInMethodsForEmail(c)
        .then(
          function (g) {
            g.length
              ? e()
              : ((g = Q(b)), b.m(), L('passwordRecovery', a, g, c, !1, Kd().toString()))
          },
          function () {
            e()
          }
        )
      V(a, f)
      return f
    }
    K.passwordSignUp = function (a, b, c, d, e, f) {
      function g() {
        h.m()
        S(a, b)
      }
      var h = new $m(
        Ci(W(a)),
        function () {
          an(a, h)
        },
        e ? void 0 : g,
        c,
        d,
        H(W(a)),
        J(W(a)),
        f
      )
      h.render(b)
      Y(a, h)
    }
    function cn() {
      return M(this, 'firebaseui-id-phone-confirmation-code')
    }
    function dn() {
      return M(this, 'firebaseui-id-phone-confirmation-code-error')
    }
    function en() {
      return M(this, 'firebaseui-id-resend-countdown')
    }
    function fn(a, b, c, d, e, f, g, h, k) {
      P.call(this, hl, { phoneNumber: e }, k, 'phoneSignInFinish', { F: g, D: h })
      this.jb = f
      this.i = new jj(1e3)
      this.B = f
      this.P = a
      this.l = b
      this.H = c
      this.M = d
    }
    m(fn, P)
    fn.prototype.v = function () {
      var a = this
      this.U(this.jb)
      ke(this.i, 'tick', this.w, !1, this)
      this.i.start()
      O(this, M(this, 'firebaseui-id-change-phone-number-link'), function () {
        a.P()
      })
      O(this, this.Da(), function () {
        a.M()
      })
      this.Ja(this.l)
      this.ea(this.l, this.H)
      this.u().focus()
      P.prototype.v.call(this)
    }
    fn.prototype.o = function () {
      this.M = this.H = this.l = this.P = null
      kj(this.i)
      se(this.i, 'tick', this.w)
      this.i = null
      P.prototype.o.call(this)
    }
    fn.prototype.w = function () {
      --this.B
      0 < this.B ? this.U(this.B) : (kj(this.i), se(this.i, 'tick', this.w), this.ua(), this.lb())
    }
    u(fn.prototype, {
      u: cn,
      pa: dn,
      Ja: function (a) {
        var b = cn.call(this),
          c = dn.call(this)
        Lj(this, b, function () {
          Rj(c) && (N(b, !0), Pj(c))
        })
        a &&
          Mj(this, b, function () {
            a()
          })
      },
      ba: function () {
        var a = Ua(Yi(cn.call(this)) || '')
        return /^\d{6}$/.test(a) ? a : null
      },
      Fb: en,
      U: function (a) {
        $c(en.call(this), C('Resend code in ' + ((9 < a ? '0:' : '0:0') + a)).toString())
      },
      ua: function () {
        Pj(this.Fb())
      },
      Da: function () {
        return M(this, 'firebaseui-id-resend-link')
      },
      lb: function () {
        Qj(this.Da())
      },
      Nb: ll,
      Mb: ml,
      ea: nl,
    })
    function gn(a, b, c, d) {
      function e(g) {
        b.u().focus()
        N(b.u(), !1)
        Qj(b.pa(), g)
      }
      var f = b.ba()
      f
        ? (b.$(
            'mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon',
            C('Verifying...').toString()
          ),
          V(
            a,
            b.I(
              r(d.confirm, d),
              [f],
              function (g) {
                b.h()
                b.$('firebaseui-icon-done', C('Verified!').toString())
                var h = setTimeout(function () {
                  b.h()
                  b.m()
                  var k = {
                    user: hn(a).currentUser,
                    credential: null,
                    operationType: g.operationType,
                    additionalUserInfo: g.additionalUserInfo,
                  }
                  Nl(a, b, k, !0)
                }, 1e3)
                V(a, function () {
                  b && b.h()
                  clearTimeout(h)
                })
              },
              function (g) {
                if (g.name && 'cancel' == g.name) b.h()
                else {
                  var h = Ml(g)
                  g = T(h)
                  switch (h.code) {
                    case 'auth/credential-already-in-use':
                      b.h()
                      break
                    case 'auth/code-expired':
                      h = Q(b)
                      b.h()
                      b.m()
                      L('phoneSignInStart', a, h, c, g)
                      break
                    case 'auth/missing-verification-code':
                    case 'auth/invalid-verification-code':
                      b.h()
                      e(g)
                      break
                    default:
                      b.h(), b.a(g)
                  }
                }
              }
            )
          ))
        : e(C('Wrong code. Try again.').toString())
    }
    K.phoneSignInFinish = function (a, b, c, d, e, f) {
      var g = new fn(
        function () {
          g.m()
          L('phoneSignInStart', a, b, c)
        },
        function () {
          gn(a, g, c, e)
        },
        function () {
          g.m()
          S(a, b)
        },
        function () {
          g.m()
          L('phoneSignInStart', a, b, c)
        },
        Yh(c),
        d,
        H(W(a)),
        J(W(a))
      )
      g.render(b)
      Y(a, g)
      f && g.a(f)
    }
    var jn =
      !z &&
      !(
        y('Safari') &&
        !(
          Xb() ||
          y('Coast') ||
          y('Opera') ||
          y('Edge') ||
          y('Firefox') ||
          y('FxiOS') ||
          y('Silk') ||
          y('Android')
        )
      )
    function kn(a, b) {
      if (/-[a-z]/.test(b)) return null
      if (jn && a.dataset) {
        if (
          !(
            !y('Android') ||
            Xb() ||
            y('Firefox') ||
            y('FxiOS') ||
            y('Opera') ||
            y('Silk') ||
            b in a.dataset
          )
        )
          return null
        a = a.dataset[b]
        return void 0 === a ? null : a
      }
      return a.getAttribute(
        'data-' +
          String(b)
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
      )
    }
    function ln(a, b, c) {
      var d = this
      a = hd(gk, { items: a }, null, this.s)
      nk.call(this, a, !0, !0)
      c && (c = mn(a, c)) && (c.focus(), Dj(c, a))
      O(this, a, function (e) {
        if ((e = (e = ad(e.target, 'firebaseui-id-list-box-dialog-button')) && kn(e, 'listboxid')))
          ok.call(d), b(e)
      })
    }
    function mn(a, b) {
      a = (a || document).getElementsByTagName('BUTTON')
      for (var c = 0; c < a.length; c++) if (kn(a[c], 'listboxid') === b) return a[c]
      return null
    }
    function nn() {
      return M(this, 'firebaseui-id-phone-number')
    }
    function on() {
      return M(this, 'firebaseui-id-country-selector')
    }
    function pn() {
      return M(this, 'firebaseui-id-phone-number-error')
    }
    function qn(a, b) {
      var c = a.a,
        d = rn('1-US-0', c),
        e = null
      b && rn(b, c) ? (e = b) : d ? (e = '1-US-0') : (e = 0 < c.length ? c[0].c : null)
      if (!e) throw Error('No available default country')
      sn.call(this, e, a)
    }
    function rn(a, b) {
      a = Qh(a)
      return !(!a || !Ma(b, a))
    }
    function tn(a) {
      return a.map(function (b) {
        return { id: b.c, Ma: 'firebaseui-flag ' + un(b), label: b.name + ' ' + ('\u200e+' + b.b) }
      })
    }
    function un(a) {
      return 'firebaseui-flag-' + a.f
    }
    function vn(a) {
      var b = this
      ln.call(
        this,
        tn(a.a),
        function (c) {
          sn.call(b, c, a, !0)
          b.O().focus()
        },
        this.Ba
      )
    }
    function sn(a, b, c) {
      var d = Qh(a)
      d &&
        (c &&
          ((c = Ua(Yi(nn.call(this)) || '')),
          (b = Ph(b, c)),
          b.length &&
            b[0].b != d.b &&
            ((c = '+' + d.b + c.substr(b[0].b.length + 1)), Zi(nn.call(this), c))),
        (b = Qh(this.Ba)),
        (this.Ba = a),
        (a = M(this, 'firebaseui-id-country-selector-flag')),
        b && Xi(a, un(b)),
        Wi(a, un(d)),
        $c(M(this, 'firebaseui-id-country-selector-code'), '\u200e+' + d.b))
    }
    function wn(a, b, c, d, e, f, g, h, k, p) {
      P.call(this, gl, { Gb: b, Aa: k || null, Va: !!c, ia: !!f }, p, 'phoneSignInStart', {
        F: d,
        D: e,
      })
      this.H = h || null
      this.M = b
      this.l = a
      this.w = c || null
      this.pa = g || null
    }
    m(wn, P)
    wn.prototype.v = function () {
      this.ea(this.pa, this.H)
      this.P(this.l, this.w || void 0)
      this.M || wk(this, this.O(), this.i())
      xk(this, this.i(), this.l)
      this.O().focus()
      Dm(this.O(), (this.O().value || '').length)
      P.prototype.v.call(this)
    }
    wn.prototype.o = function () {
      this.w = this.l = null
      P.prototype.o.call(this)
    }
    u(wn.prototype, {
      Cb: pk,
      O: nn,
      B: pn,
      ea: function (a, b, c) {
        var d = this,
          e = nn.call(this),
          f = on.call(this),
          g = pn.call(this),
          h = a || Vh,
          k = h.a
        if (0 == k.length) throw Error('No available countries provided.')
        qn.call(d, h, b)
        O(this, f, function () {
          vn.call(d, h)
        })
        Lj(this, e, function () {
          Rj(g) && (N(e, !0), Pj(g))
          var p = Ua(Yi(e) || ''),
            t = Qh(this.Ba),
            I = Ph(h, p)
          p = rn('1-US-0', k)
          I.length && I[0].b != t.b && ((t = I[0]), sn.call(d, '1' == t.b && p ? '1-US-0' : t.c, h))
        })
        c &&
          Mj(this, e, function () {
            c()
          })
      },
      U: function (a) {
        var b = Ua(Yi(nn.call(this)) || '')
        a = a || Vh
        var c = a.a,
          d = Ph(Vh, b)
        if (d.length && !Ma(c, d[0]))
          throw (
            (Zi(nn.call(this)),
            nn.call(this).focus(),
            Qj(pn.call(this), C('The country code provided is not supported.').toString()),
            Error('The country code provided is not supported.'))
          )
        c = Qh(this.Ba)
        d.length && d[0].b != c.b && sn.call(this, d[0].c, a)
        d.length && (b = b.substr(d[0].b.length + 1))
        return b ? new Wh(this.Ba, b) : null
      },
      Ja: on,
      ba: function () {
        return M(this, 'firebaseui-recaptcha-container')
      },
      u: function () {
        return M(this, 'firebaseui-id-recaptcha-error')
      },
      i: ll,
      ua: ml,
      P: nl,
    })
    function xn(a, b, c, d) {
      try {
        var e = b.U(Si)
      } catch (f) {
        return
      }
      e
        ? Qi
          ? (b.$(
              'mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon',
              C('Verifying...').toString()
            ),
            V(
              a,
              b.I(
                r(a.cc, a),
                [Yh(e), c],
                function (f) {
                  var g = Q(b)
                  b.$('firebaseui-icon-done', C('Code sent!').toString())
                  var h = setTimeout(function () {
                    b.h()
                    b.m()
                    L('phoneSignInFinish', a, g, e, 15, f)
                  }, 1e3)
                  V(a, function () {
                    b && b.h()
                    clearTimeout(h)
                  })
                },
                function (f) {
                  b.h()
                  if (!f.name || 'cancel' != f.name) {
                    grecaptcha.reset(Ti)
                    Qi = null
                    var g = (f && f.message) || ''
                    if (f.code)
                      switch (f.code) {
                        case 'auth/too-many-requests':
                          g = C('This phone number has been used too many times').toString()
                          break
                        case 'auth/invalid-phone-number':
                        case 'auth/missing-phone-number':
                          b.O().focus()
                          Qj(b.B(), Hd().toString())
                          return
                        case 'auth/admin-restricted-operation':
                          if (pi(W(a))) {
                            f = Q(b)
                            b.m()
                            L(
                              'handleUnauthorizedUser',
                              a,
                              f,
                              Yh(e),
                              firebase.auth.PhoneAuthProvider.PROVIDER_ID
                            )
                            return
                          }
                          g = T(f)
                          break
                        default:
                          g = T(f)
                      }
                    b.a(g)
                  }
                }
              )
            ))
          : Ri
          ? Qj(b.u(), C('Solve the reCAPTCHA').toString())
          : !Ri && d && b.i().click()
        : (b.O().focus(), Qj(b.B(), Hd().toString()))
    }
    K.phoneSignInStart = function (a, b, c, d) {
      var e = qi(W(a)) || {}
      Qi = null
      Ri = !(e && 'invisible' === e.size)
      var f = $l(a),
        g = zi(W(a)),
        h = f ? yi(W(a)) : null
      g = (c && c.a) || (g && g.c) || null
      c = (c && c.Aa) || h
      ;(h = Ai(W(a))) && Uh(h)
      Si = h ? new Oh(Ai(W(a))) : Vh
      var k = new wn(
        function (t) {
          xn(a, k, p, !(!t || !t.keyCode))
        },
        Ri,
        f
          ? null
          : function () {
              p.clear()
              k.m()
              S(a, b)
            },
        H(W(a)),
        J(W(a)),
        f,
        Si,
        g,
        c
      )
      k.render(b)
      Y(a, k)
      d && k.a(d)
      e.callback = function (t) {
        k.u() && Pj(k.u())
        Qi = t
        Ri || xn(a, k, p)
      }
      e['expired-callback'] = function () {
        Qi = null
      }
      var p = new firebase.auth.RecaptchaVerifier(Ri ? k.ba() : k.i(), e, hn(a).app)
      V(
        a,
        k.I(
          r(p.render, p),
          [],
          function (t) {
            Ti = t
          },
          function (t) {
            ;(t.name && 'cancel' == t.name) || ((t = T(t)), k.m(), S(a, b, void 0, t))
          }
        )
      )
    }
    K.prefilledEmailSignIn = function (a, b, c) {
      var d = new Gm()
      d.render(b)
      Y(a, d)
      V(
        a,
        d.I(
          r(U(a).fetchSignInMethodsForEmail, U(a)),
          [c],
          function (e) {
            d.m()
            var f = !(!Zl(a) || !yn(a))
            cm(a, b, e, c, void 0, f)
          },
          function (e) {
            e = T(e)
            d.m()
            L('signIn', a, b, c, e)
          }
        )
      )
    }
    function zn(a, b, c, d, e) {
      P.call(this, fl, { Sb: b }, e, 'providerSignIn', { F: c, D: d })
      this.i = a
    }
    m(zn, P)
    zn.prototype.v = function () {
      this.l(this.i)
      P.prototype.v.call(this)
    }
    zn.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    u(zn.prototype, {
      l: function (a) {
        function b(g) {
          a(g)
        }
        for (
          var c = this.g ? Tc('firebaseui-id-idp-button', this.g || this.s.a) : [], d = 0;
          d < c.length;
          d++
        ) {
          var e = c[d],
            f = kn(e, 'providerId')
          O(this, e, za(b, f))
        }
      },
    })
    K.providerSignIn = function (a, b, c, d) {
      var e = new zn(
        function (f) {
          f == firebase.auth.EmailAuthProvider.PROVIDER_ID
            ? (e.m(), am(a, b, d))
            : f == firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ? (e.m(), L('phoneSignInStart', a, b))
            : 'anonymous' == f
            ? Wl(a, e)
            : Tl(a, e, f, d)
          Z(a)
          a.l.cancel()
        },
        ji(W(a)),
        H(W(a)),
        J(W(a))
      )
      e.render(b)
      Y(a, e)
      c && e.a(c)
      An(a)
    }
    K.sendEmailLinkForSignIn = function (a, b, c, d) {
      var e = new hm()
      e.render(b)
      Y(a, e)
      dm(a, e, c, d, function (f) {
        e.m()
        f && 'auth/admin-restricted-operation' == f.code && pi(W(a))
          ? L('handleUnauthorizedUser', a, b, c, firebase.auth.EmailAuthProvider.PROVIDER_ID)
          : ((f = T(f)), L('signIn', a, b, c, f))
      })
    }
    function Bn(a, b, c, d, e, f, g) {
      P.call(this, yk, { email: c, Va: !!b, ia: !!f }, g, 'signIn', { F: d, D: e })
      this.i = a
      this.u = b
    }
    m(Bn, P)
    Bn.prototype.v = function () {
      this.w(this.i)
      this.B(this.i, this.u || void 0)
      this.l().focus()
      Dm(this.l(), (this.l().value || '').length)
      P.prototype.v.call(this)
    }
    Bn.prototype.o = function () {
      this.u = this.i = null
      P.prototype.o.call(this)
    }
    u(Bn.prototype, { l: ul, M: vl, w: wl, H: xl, j: yl, U: ll, P: ml, B: nl })
    K.signIn = function (a, b, c, d) {
      var e = Zl(a),
        f = new Bn(
          function () {
            var g = f,
              h = g.j() || ''
            h && bm(a, g, h)
          },
          e
            ? null
            : function () {
                f.m()
                S(a, b, c)
              },
          c,
          H(W(a)),
          J(W(a)),
          e
        )
      f.render(b)
      Y(a, f)
      d && f.a(d)
    }
    function Cn(a, b, c, d, e, f, g) {
      P.call(this, Pk, { kc: a, yb: c, Eb: !!d }, g, 'unauthorizedUser', { F: e, D: f })
      this.l = b
      this.i = d
    }
    m(Cn, P)
    Cn.prototype.v = function () {
      var a = this,
        b = M(this, 'firebaseui-id-unauthorized-user-help-link')
      this.i &&
        b &&
        O(this, b, function () {
          a.i()
        })
      O(this, this.u(), function () {
        a.l()
      })
      this.u().focus()
      P.prototype.v.call(this)
    }
    Cn.prototype.o = function () {
      this.i = this.l = null
      P.prototype.o.call(this)
    }
    u(Cn.prototype, { u: ml })
    K.handleUnauthorizedUser = function (a, b, c, d) {
      function e() {
        S(a, b)
      }
      d === firebase.auth.EmailAuthProvider.PROVIDER_ID
        ? (e = function () {
            am(a, b)
          })
        : d === firebase.auth.PhoneAuthProvider.PROVIDER_ID &&
          (e = function () {
            L('phoneSignInStart', a, b)
          })
      var f = null,
        g = null
      d === firebase.auth.EmailAuthProvider.PROVIDER_ID && oi(W(a))
        ? ((f = ui(W(a))), (g = vi(W(a))))
        : pi(W(a)) && ((f = si(W(a))), (g = ti(W(a))))
      var h = new Cn(
        c,
        function () {
          h.m()
          e()
        },
        f,
        g,
        H(W(a)),
        J(W(a))
      )
      h.render(b)
      Y(a, h)
    }
    function Dn(a, b, c, d, e, f) {
      P.call(this, Qk, { email: a }, f, 'unsupportedProvider', { F: d, D: e })
      this.l = b
      this.i = c
    }
    m(Dn, P)
    Dn.prototype.v = function () {
      this.w(this.l, this.i)
      this.u().focus()
      P.prototype.v.call(this)
    }
    Dn.prototype.o = function () {
      this.i = this.l = null
      P.prototype.o.call(this)
    }
    u(Dn.prototype, { u: ll, B: ml, w: nl })
    K.unsupportedProvider = function (a, b, c) {
      var d = new Dn(
        c,
        function () {
          d.m()
          L('passwordRecovery', a, b, c)
        },
        function () {
          d.m()
          S(a, b, c)
        },
        H(W(a)),
        J(W(a))
      )
      d.render(b)
      Y(a, d)
    }
    function En(a, b) {
      this.$ = !1
      var c = Fn(b)
      if (Gn[c]) throw Error('An AuthUI instance already exists for the key "' + c + '"')
      Gn[c] = this
      this.a = a
      this.u = null
      this.Y = !1
      Hn(this.a)
      this.h = firebase
        .initializeApp(
          { apiKey: a.app.options.apiKey, authDomain: a.app.options.authDomain },
          a.app.name + '-firebaseui-temp'
        )
        .auth()
      if ((a = a.emulatorConfig))
        (c = a.port),
          this.h.useEmulator(a.protocol + '://' + a.host + (null === c ? '' : ':' + c), a.options)
      Hn(this.h)
      this.h.setPersistence && this.h.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      this.oa = b
      this.ca = new bi()
      this.g = this.T = this.i = this.J = this.O = null
      this.s = []
      this.Z = !1
      this.l = Pf.Xa()
      this.j = this.C = null
      this.da = this.A = !1
    }
    function Hn(a) {
      a && a.INTERNAL && a.INTERNAL.logFramework && a.INTERNAL.logFramework('FirebaseUI-web')
    }
    var Gn = {}
    function Fn(a) {
      return a || '[DEFAULT]'
    }
    function Ul(a) {
      Z(a)
      a.i ||
        (a.i = In(a, function (b) {
          return b && !zh(X(a))
            ? F(
                hn(a)
                  .getRedirectResult()
                  .then(
                    function (c) {
                      return c
                    },
                    function (c) {
                      if (c && 'auth/email-already-in-use' == c.code && c.email && c.credential)
                        throw c
                      return Jn(a, c)
                    }
                  )
              )
            : F(
                U(a)
                  .getRedirectResult()
                  .then(function (c) {
                    return di(W(a)) && !c.user && a.j && !a.j.isAnonymous
                      ? hn(a).getRedirectResult()
                      : c
                  })
              )
        }))
      return a.i
    }
    function Y(a, b) {
      Z(a)
      a.g = b
    }
    var Kn = null
    function U(a) {
      Z(a)
      return a.h
    }
    function hn(a) {
      Z(a)
      return a.a
    }
    function X(a) {
      Z(a)
      return a.oa
    }
    function yn(a) {
      Z(a)
      return a.O ? a.O.emailHint : void 0
    }
    l = En.prototype
    l.nb = function () {
      Z(this)
      return !!Ch(X(this)) || Ln(tf())
    }
    function Ln(a) {
      a = new Pb(a)
      return 'signIn' === (a.a.a.get(x.ub) || null) && !!a.a.a.get(x.$a)
    }
    l.start = function (a, b) {
      Mn(this, a, b)
    }
    function Mn(a, b, c, d) {
      Z(a)
      'undefined' !== typeof a.a.languageCode && (a.u = a.a.languageCode)
      var e = 'en'.replace(/_/g, '-')
      a.a.languageCode = e
      a.h.languageCode = e
      a.Y = !0
      'undefined' !== typeof a.a.tenantId && (a.h.tenantId = a.a.tenantId)
      a.ib(c)
      a.O = d || null
      var f = n.document
      a.C
        ? a.C.then(function () {
            'complete' == f.readyState
              ? Nn(a, b)
              : le(window, 'load', function () {
                  Nn(a, b)
                })
          })
        : 'complete' == f.readyState
        ? Nn(a, b)
        : le(window, 'load', function () {
            Nn(a, b)
          })
    }
    function Nn(a, b) {
      var c = sf(b, 'Could not find the FirebaseUI widget element on the page.')
      c.setAttribute('lang', 'en'.replace(/_/g, '-'))
      if (Kn) {
        var d = Kn
        Z(d)
        zh(X(d)) &&
          tg(
            'UI Widget is already rendered on the page and is pending some user interaction. Only one widget instance can be rendered per page. The previous instance has been automatically reset.'
          )
        Kn.reset()
      }
      Kn = a
      a.T = c
      On(a, c)
      if (jh(new kh()) && jh(new lh())) {
        b = sf(b, 'Could not find the FirebaseUI widget element on the page.')
        c = tf()
        d = Jh(W(a).a, 'queryParameterForSignInSuccessUrl')
        c = (c = tb(c, d)) ? zc(Bc(c)).toString() : null
        a: {
          d = tf()
          var e = Bi(W(a))
          d = tb(d, e) || ''
          for (f in Pi)
            if (Pi[f].toLowerCase() == d.toLowerCase()) {
              var f = Pi[f]
              break a
            }
          f = 'callback'
        }
        switch (f) {
          case 'callback':
            c && ((f = X(a)), xh(sh, c, f))
            a.nb() ? L('callback', a, b) : S(a, b, yn(a))
            break
          case 'resetPassword':
            L('passwordReset', a, b, em(), fm())
            break
          case 'recoverEmail':
            L('emailChangeRevocation', a, b, em())
            break
          case 'revertSecondFactorAddition':
            L('revertSecondFactorAddition', a, b, em())
            break
          case 'verifyEmail':
            L('emailVerification', a, b, em(), fm())
            break
          case 'verifyAndChangeEmail':
            L('verifyAndChangeEmail', a, b, em(), fm())
            break
          case 'signIn':
            L('emailLinkSignInCallback', a, b, tf())
            Pn()
            break
          case 'select':
            c && ((f = X(a)), xh(sh, c, f))
            S(a, b)
            break
          default:
            throw Error('Unhandled widget operation.')
        }
        b = W(a)
        ;(b = Li(b).uiShown || null) && b()
      } else
        (b = sf(b, 'Could not find the FirebaseUI widget element on the page.')),
          (f = new Ll(
            C(
              'The browser you are using does not support Web Storage. Please try again in a different browser.'
            ).toString()
          )),
          f.render(b),
          Y(a, f)
      b = a.g && 'blank' == a.g.Ga && Gi(W(a))
      Ch(X(a)) && !b && ((b = Ch(X(a))), Im(a, b.a), wh(rh, X(a)))
    }
    function In(a, b) {
      if (a.A) return b(Qn(a))
      V(a, function () {
        a.A = !1
      })
      if (di(W(a))) {
        var c = new Ve(function (d) {
          V(
            a,
            a.a.onAuthStateChanged(function (e) {
              a.j = e
              a.A || ((a.A = !0), d(b(Qn(a))))
            })
          )
        })
        V(a, c)
        return c
      }
      a.A = !0
      return b(null)
    }
    function Qn(a) {
      Z(a)
      return di(W(a)) && a.j && a.j.isAnonymous ? a.j : null
    }
    function V(a, b) {
      Z(a)
      if (b) {
        a.s.push(b)
        var c = function () {
          Qa(a.s, function (d) {
            return d == b
          })
        }
        'function' != typeof b && b.then(c, c)
      }
    }
    l.Db = function () {
      Z(this)
      this.Z = !0
    }
    function Rn(a) {
      Z(a)
      var b
      ;(b = a.Z) ||
        ((a = W(a)),
        (a = xi(a, firebase.auth.GoogleAuthProvider.PROVIDER_ID)),
        (b = !(!a || 'select_account' !== a.prompt)))
      return b
    }
    function Ol(a) {
      'undefined' !== typeof a.a.languageCode && a.Y && ((a.Y = !1), (a.a.languageCode = a.u))
    }
    function Im(a, b) {
      a.a.tenantId = b
      a.h.tenantId = b
    }
    l.reset = function () {
      Z(this)
      var a = this
      this.T && this.T.removeAttribute('lang')
      this.J && De(this.J)
      Ol(this)
      this.O = null
      Pn()
      wh(rh, X(this))
      Z(this)
      this.l.cancel()
      this.i = F({ user: null, credential: null })
      Kn == this && (Kn = null)
      this.T = null
      for (var b = 0; b < this.s.length; b++)
        if ('function' == typeof this.s[b]) this.s[b]()
        else this.s[b].cancel && this.s[b].cancel()
      this.s = []
      Ah(X(this))
      this.g && (this.g.m(), (this.g = null))
      this.L = null
      this.h &&
        (this.C = om(this).then(
          function () {
            a.C = null
          },
          function () {
            a.C = null
          }
        ))
    }
    function On(a, b) {
      a.L = null
      a.J = new Ee(b)
      a.J.register()
      ke(a.J, 'pageEnter', function (c) {
        c = c && c.pageId
        if (a.L != c) {
          var d = W(a)
          ;(d = Li(d).uiChanged || null) && d(a.L, c)
          a.L = c
        }
      })
    }
    l.ib = function (a) {
      Z(this)
      var b = this.ca,
        c
      for (c in a)
        try {
          Ih(b.a, c, a[c])
        } catch (d) {
          og('Invalid config: "' + c + '"', void 0)
        }
      fc && Ih(b.a, 'popupMode', !1)
      Ai(b)
      !this.da &&
        Ki(W(this)) &&
        (tg(
          'signInSuccess callback is deprecated. Please use signInSuccessWithAuthResult callback instead.'
        ),
        (this.da = !0))
    }
    function W(a) {
      Z(a)
      return a.ca
    }
    l.Wb = function () {
      Z(this)
      var a = W(this),
        b = Jh(a.a, 'widgetUrl')
      a = Bi(a)
      var c = b.search(sb)
      for (var d = 0, e, f = []; 0 <= (e = rb(b, d, a, c)); )
        f.push(b.substring(d, e)), (d = Math.min(b.indexOf('&', e) + 1 || c, c))
      f.push(b.substr(d))
      b = f.join('').replace(ub, '$1')
      c = '=' + encodeURIComponent('select')
      ;(a += c)
        ? ((c = b.indexOf('#')),
          0 > c && (c = b.length),
          (d = b.indexOf('?')),
          0 > d || d > c ? ((d = c), (e = '')) : (e = b.substring(d + 1, c)),
          (b = [b.substr(0, d), e, b.substr(c)]),
          (c = b[1]),
          (b[1] = a ? (c ? c + '&' + a : a) : c),
          (c = b[0] + (b[1] ? '?' + b[1] : '') + b[2]))
        : (c = b)
      W(this).a.get('popupMode')
        ? ((a = (window.screen.availHeight - 600) / 2),
          (b = (window.screen.availWidth - 500) / 2),
          (c = c || 'about:blank'),
          (a = {
            width: 500,
            height: 600,
            top: 0 < a ? a : 0,
            left: 0 < b ? b : 0,
            location: !0,
            resizable: !0,
            statusbar: !0,
            toolbar: !1,
          }),
          (a.target = a.target || c.target || 'google_popup'),
          (a.width = a.width || 690),
          (a.height = a.height || 500),
          (a = pf(c, a)) && a.focus())
        : Nc(window.location, c)
    }
    function Z(a) {
      if (a.$) throw Error('AuthUI instance is deleted!')
    }
    l.Wa = function () {
      var a = this
      Z(this)
      return this.h.app.delete().then(function () {
        var b = Fn(X(a))
        delete Gn[b]
        a.reset()
        a.$ = !0
      })
    }
    function An(a) {
      Z(a)
      try {
        Qf(a.l, li(W(a)), Rn(a)).then(function (b) {
          return a.g ? Xl(a, a.g, b) : !1
        })
      } catch (b) {}
    }
    l.Ib = function (a, b) {
      Z(this)
      var c = this,
        d = vf()
      if (!Di(W(this)))
        return df(Error('Email link sign-in should be enabled to trigger email sending.'))
      var e = Fi(W(this)),
        f = new Pb(e.url)
      Qb(f, d)
      b && b.a && (Gh(d, b, X(this)), Tb(f, b.a.providerId))
      Rb(f, Ei(W(this)))
      return In(this, function (g) {
        g && ((g = g.uid) ? f.a.a.set(x.Pa, g) : Nb(f.a.a, x.Pa))
        e.url = f.toString()
        return U(c).sendSignInLinkToEmail(a, e)
      }).then(
        function () {
          var g = X(c),
            h = {}
          h.email = a
          xh(th, Yg(d, JSON.stringify(h)), g)
        },
        function (g) {
          wh(uh, X(c))
          wh(th, X(c))
          throw g
        }
      )
    }
    function Jm(a, b) {
      var c = Sb(new Pb(b))
      if (!c) return F(null)
      b = new Ve(function (d, e) {
        var f = hn(a).onAuthStateChanged(function (g) {
          f()
          g && g.isAnonymous && g.uid === c
            ? d(g)
            : g && g.isAnonymous && g.uid !== c
            ? e(Error('anonymous-user-mismatch'))
            : e(Error('anonymous-user-not-found'))
        })
        V(a, f)
      })
      V(a, b)
      return b
    }
    function Nm(a, b, c, d, e) {
      Z(a)
      var f = e || null,
        g = firebase.auth.EmailAuthProvider.credentialWithLink(c, d)
      c = f
        ? U(a)
            .signInWithEmailLink(c, d)
            .then(function (h) {
              return h.user.linkWithCredential(f)
            })
            .then(function () {
              return om(a)
            })
            .then(function () {
              return Jn(a, { code: 'auth/email-already-in-use' }, f)
            })
        : U(a)
            .fetchSignInMethodsForEmail(c)
            .then(function (h) {
              return h.length
                ? Jn(a, { code: 'auth/email-already-in-use' }, g)
                : b.linkWithCredential(g)
            })
      V(a, c)
      return c
    }
    function Om(a, b, c, d) {
      Z(a)
      var e = d || null,
        f
      b = U(a)
        .signInWithEmailLink(b, c)
        .then(function (g) {
          f = {
            user: g.user,
            credential: null,
            operationType: g.operationType,
            additionalUserInfo: g.additionalUserInfo,
          }
          if (e)
            return g.user.linkWithCredential(e).then(function (h) {
              f = {
                user: h.user,
                credential: e,
                operationType: f.operationType,
                additionalUserInfo: h.additionalUserInfo,
              }
            })
        })
        .then(function () {
          om(a)
        })
        .then(function () {
          return hn(a).updateCurrentUser(f.user)
        })
        .then(function () {
          f.user = hn(a).currentUser
          return f
        })
      V(a, b)
      return b
    }
    function Pn() {
      var a = tf()
      if (Ln(a)) {
        a = new Pb(a)
        for (var b in x) x.hasOwnProperty(b) && Nb(a.a.a, x[b])
        b = { state: 'signIn', mode: 'emailLink', operation: 'clear' }
        var c = n.document.title
        n.history && n.history.replaceState && n.history.replaceState(b, c, a.toString())
      }
    }
    l.bc = function (a, b) {
      Z(this)
      var c = this
      return U(this)
        .signInWithEmailAndPassword(a, b)
        .then(function (d) {
          return In(c, function (e) {
            return e
              ? om(c).then(function () {
                  return Jn(
                    c,
                    { code: 'auth/email-already-in-use' },
                    firebase.auth.EmailAuthProvider.credential(a, b)
                  )
                })
              : d
          })
        })
    }
    l.Yb = function (a, b) {
      Z(this)
      var c = this
      return In(this, function (d) {
        if (d) {
          var e = firebase.auth.EmailAuthProvider.credential(a, b)
          return d.linkWithCredential(e)
        }
        return U(c).createUserWithEmailAndPassword(a, b)
      })
    }
    l.ac = function (a) {
      Z(this)
      var b = this
      return In(this, function (c) {
        return c
          ? c.linkWithCredential(a).then(
              function (d) {
                return d
              },
              function (d) {
                if (d && 'auth/email-already-in-use' == d.code && d.email && d.credential) throw d
                return Jn(b, d, a)
              }
            )
          : U(b).signInWithCredential(a)
      })
    }
    function Vl(a, b) {
      Z(a)
      return In(a, function (c) {
        return c && !zh(X(a))
          ? c.linkWithPopup(b).then(
              function (d) {
                return d
              },
              function (d) {
                if (d && 'auth/email-already-in-use' == d.code && d.email && d.credential) throw d
                return Jn(a, d)
              }
            )
          : U(a).signInWithPopup(b)
      })
    }
    l.dc = function (a) {
      Z(this)
      var b = this,
        c = this.i
      this.i = null
      return In(this, function (d) {
        return d && !zh(X(b)) ? d.linkWithRedirect(a) : U(b).signInWithRedirect(a)
      }).then(
        function () {},
        function (d) {
          b.i = c
          throw d
        }
      )
    }
    l.cc = function (a, b) {
      Z(this)
      var c = this
      return In(this, function (d) {
        return d
          ? d.linkWithPhoneNumber(a, b).then(function (e) {
              return new Sf(e, function (f) {
                if ('auth/credential-already-in-use' == f.code) return Jn(c, f)
                throw f
              })
            })
          : hn(c)
              .signInWithPhoneNumber(a, b)
              .then(function (e) {
                return new Sf(e)
              })
      })
    }
    l.$b = function () {
      Z(this)
      return hn(this).signInAnonymously()
    }
    function Ql(a, b) {
      Z(a)
      return In(a, function (c) {
        if (a.j && !a.j.isAnonymous && di(W(a)) && !U(a).currentUser)
          return om(a).then(function () {
            'password' == b.credential.providerId && (b.credential = null)
            return b
          })
        if (c)
          return om(a)
            .then(function () {
              return c.linkWithCredential(b.credential)
            })
            .then(
              function (d) {
                b.user = d.user
                b.credential = d.credential
                b.operationType = d.operationType
                b.additionalUserInfo = d.additionalUserInfo
                return b
              },
              function (d) {
                if (d && 'auth/email-already-in-use' == d.code && d.email && d.credential) throw d
                return Jn(a, d, b.credential)
              }
            )
        if (!b.user)
          throw Error(
            'Internal error: An incompatible or outdated version of "firebase.js" may be used.'
          )
        return om(a)
          .then(function () {
            return hn(a).updateCurrentUser(b.user)
          })
          .then(function () {
            b.user = hn(a).currentUser
            b.operationType = 'signIn'
            b.credential &&
              b.credential.providerId &&
              'password' == b.credential.providerId &&
              (b.credential = null)
            return b
          })
      })
    }
    l.Xb = function (a, b) {
      Z(this)
      return U(this).signInWithEmailAndPassword(a, b)
    }
    function om(a) {
      Z(a)
      return U(a).signOut()
    }
    function Jn(a, b, c) {
      Z(a)
      if (
        b &&
        b.code &&
        ('auth/email-already-in-use' == b.code || 'auth/credential-already-in-use' == b.code)
      ) {
        var d = ei(W(a))
        return F()
          .then(function () {
            return d(new Nd('anonymous-upgrade-merge-conflict', null, c || b.credential))
          })
          .then(function () {
            a.g && (a.g.m(), (a.g = null))
            throw b
          })
      }
      return df(b)
    }
    function Sn(a, b, c, d) {
      P.call(this, kl, void 0, d, 'providerMatchByEmail', { F: b, D: c })
      this.i = a
    }
    m(Sn, P)
    Sn.prototype.v = function () {
      this.u(this.i)
      this.w(this.i)
      this.l().focus()
      Dm(this.l(), (this.l().value || '').length)
      P.prototype.v.call(this)
    }
    Sn.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    u(Sn.prototype, { l: ul, H: vl, u: wl, B: xl, j: yl, M: ll, w: nl })
    function Tn(a, b, c, d, e) {
      P.call(this, jl, { ec: b }, e, 'selectTenant', { F: c, D: d })
      this.i = a
    }
    m(Tn, P)
    Tn.prototype.v = function () {
      Un(this, this.i)
      P.prototype.v.call(this)
    }
    Tn.prototype.o = function () {
      this.i = null
      P.prototype.o.call(this)
    }
    function Un(a, b) {
      function c(h) {
        b(h)
      }
      for (
        var d = a.g ? Tc('firebaseui-id-tenant-selection-button', a.g || a.s.a) : [], e = 0;
        e < d.length;
        e++
      ) {
        var f = d[e],
          g = kn(f, 'tenantId')
        O(a, f, za(c, g))
      }
    }
    function Vn(a) {
      P.call(this, Ek, void 0, a, 'spinner')
    }
    m(Vn, P)
    function Wn(a) {
      this.a = new Hh()
      G(this.a, 'authDomain')
      G(this.a, 'displayMode', Xn)
      G(this.a, 'tenants')
      G(this.a, 'callbacks')
      G(this.a, 'tosUrl')
      G(this.a, 'privacyPolicyUrl')
      for (var b in a)
        if (a.hasOwnProperty(b))
          try {
            Ih(this.a, b, a[b])
          } catch (c) {
            og('Invalid config: "' + b + '"', void 0)
          }
    }
    function Yn(a) {
      a = a.a.get('displayMode')
      for (var b in Zn) if (Zn[b] === a) return Zn[b]
      return Xn
    }
    function $n(a) {
      return a.a.get('callbacks') || {}
    }
    function ao(a) {
      var b = a.a.get('tosUrl') || null
      a = a.a.get('privacyPolicyUrl') || null
      b && !a && tg('Privacy Policy URL is missing, the link will not be displayed.')
      if (b && a) {
        if ('function' === typeof b) return b
        if ('string' === typeof b)
          return function () {
            rf(b)
          }
      }
      return null
    }
    function bo(a) {
      var b = a.a.get('tosUrl') || null,
        c = a.a.get('privacyPolicyUrl') || null
      c && !b && tg('Terms of Service URL is missing, the link will not be displayed.')
      if (b && c) {
        if ('function' === typeof c) return c
        if ('string' === typeof c)
          return function () {
            rf(c)
          }
      }
      return null
    }
    function co(a, b) {
      a = a.a.get('tenants')
      if (!a || (!a.hasOwnProperty(b) && !a.hasOwnProperty(eo)))
        throw Error('Invalid tenant configuration!')
    }
    function fo(a, b, c) {
      a = a.a.get('tenants')
      if (!a) throw Error('Invalid tenant configuration!')
      var d = []
      a = a[b] || a[eo]
      if (!a) return og('Invalid tenant configuration: ' + (b + ' is not configured!'), void 0), d
      b = a.signInOptions
      if (!b) throw Error('Invalid tenant configuration: signInOptions are invalid!')
      b.forEach(function (e) {
        if ('string' === typeof e) d.push(e)
        else if ('string' === typeof e.provider) {
          var f = e.hd
          f && c
            ? (f instanceof RegExp ? f : new RegExp('@' + f.replace('.', '\\.') + '$')).test(c) &&
              d.push(e.provider)
            : d.push(e.provider)
        } else
          (e =
            'Invalid tenant configuration: signInOption ' + (JSON.stringify(e) + ' is invalid!')),
            og(e, void 0)
      })
      return d
    }
    function go(a, b, c) {
      a = ho(a, b)
      ;(b = a.signInOptions) &&
        c &&
        ((b = b.filter(function (d) {
          return 'string' === typeof d ? c.includes(d) : c.includes(d.provider)
        })),
        (a.signInOptions = b))
      return a
    }
    function ho(a, b) {
      var c = io
      var d = void 0 === d ? {} : d
      co(a, b)
      a = a.a.get('tenants')
      return wf(a[b] || a[eo], c, d)
    }
    var io = [
        'immediateFederatedRedirect',
        'privacyPolicyUrl',
        'signInFlow',
        'signInOptions',
        'tosUrl',
      ],
      Xn = 'optionFirst',
      Zn = { qc: Xn, pc: 'identifierFirst' },
      eo = '*'
    function jo(a, b) {
      var c = this
      this.s = sf(a)
      this.a = {}
      Object.keys(b).forEach(function (d) {
        c.a[d] = new Wn(b[d])
      })
      this.ob = this.g = this.A = this.h = this.i = this.j = null
      Object.defineProperty(this, 'languageCode', {
        get: function () {
          return this.ob
        },
        set: function (d) {
          this.ob = d || null
        },
        enumerable: !1,
      })
    }
    l = jo.prototype
    l.Ub = function (a, b) {
      var c = this
      ko(this)
      var d = a.apiKey
      return new Ve(function (e, f) {
        if (c.a.hasOwnProperty(d)) {
          var g = $n(c.a[d]).selectTenantUiHidden || null
          if (Yn(c.a[d]) === Xn) {
            var h = []
            b.forEach(function (t) {
              t = t || '_'
              var I = c.a[d].a.get('tenants')
              if (!I) throw Error('Invalid tenant configuration!')
              ;(I = I[t] || I[eo])
                ? (t = {
                    tenantId: '_' !== t ? t : null,
                    V: I.fullLabel || null,
                    displayName: I.displayName,
                    za: I.iconUrl,
                    ta: I.buttonColor,
                  })
                : (og('Invalid tenant configuration: ' + (t + ' is not configured!'), void 0),
                  (t = null))
              t && h.push(t)
            })
            var k = function (t) {
              t = { tenantId: t, providerIds: fo(c.a[d], t || '_') }
              e(t)
            }
            if (1 === h.length) {
              k(h[0].tenantId)
              return
            }
            c.g = new Tn(
              function (t) {
                ko(c)
                g && g()
                k(t)
              },
              h,
              ao(c.a[d]),
              bo(c.a[d])
            )
          } else
            c.g = new Sn(
              function () {
                var t = c.g.j()
                if (t) {
                  for (var I = 0; I < b.length; I++) {
                    var Ca = fo(c.a[d], b[I] || '_', t)
                    if (0 !== Ca.length) {
                      t = { tenantId: b[I], providerIds: Ca, email: t }
                      ko(c)
                      g && g()
                      e(t)
                      return
                    }
                  }
                  c.g.a(Ld({ code: 'no-matching-tenant-for-email' }).toString())
                }
              },
              ao(c.a[d]),
              bo(c.a[d])
            )
          c.g.render(c.s)
          ;(f = $n(c.a[d]).selectTenantUiShown || null) && f()
        } else {
          var p = Error('Invalid project configuration: API key is invalid!')
          p.code = 'invalid-configuration'
          c.pb(p)
          f(p)
        }
      })
    }
    l.Pb = function (a, b) {
      if (!this.a.hasOwnProperty(a))
        throw Error('Invalid project configuration: API key is invalid!')
      var c = b || void 0
      co(this.a[a], b || '_')
      try {
        this.i = firebase.app(c).auth()
      } catch (e) {
        var d = this.a[a].a.get('authDomain')
        if (!d) throw Error('Invalid project configuration: authDomain is required!')
        a = firebase.initializeApp({ apiKey: a, authDomain: d }, c)
        a.auth().tenantId = b
        this.i = a.auth()
      }
      return this.i
    }
    l.Zb = function (a, b) {
      var c = this
      return new Ve(function (d, e) {
        function f(I, Ca) {
          c.j = new En(a)
          Mn(c.j, c.s, I, Ca)
        }
        var g = a.app.options.apiKey
        c.a.hasOwnProperty(g) || e(Error('Invalid project configuration: API key is invalid!'))
        var h = go(c.a[g], a.tenantId || '_', b && b.providerIds)
        ko(c)
        e = {
          signInSuccessWithAuthResult: function (I) {
            d(I)
            return !1
          },
        }
        var k = $n(c.a[g]).signInUiShown || null,
          p = !1
        e.uiChanged = function (I, Ca) {
          null === I && 'callback' === Ca
            ? ((I = Vc('firebaseui-id-page-callback', c.s)) && Pj(I),
              (c.h = new Vn()),
              c.h.render(c.s))
            : p ||
              (null === I && 'spinner' === Ca) ||
              'blank' === Ca ||
              (c.h && (c.h.m(), (c.h = null)), (p = !0), k && k(a.tenantId))
        }
        h.callbacks = e
        h.credentialHelper = 'none'
        var t
        b && b.email && (t = { emailHint: b.email })
        c.j
          ? c.j.Wa().then(function () {
              f(h, t)
            })
          : f(h, t)
      })
    }
    l.reset = function () {
      var a = this
      return F()
        .then(function () {
          a.j && a.j.Wa()
        })
        .then(function () {
          a.j = null
          ko(a)
        })
    }
    l.Vb = function () {
      var a = this
      this.h ||
        this.A ||
        (this.A = window.setTimeout(function () {
          ko(a)
          a.h = new Vn()
          a.g = a.h
          a.h.render(a.s)
          a.A = null
        }, 500))
    }
    l.mb = function () {
      window.clearTimeout(this.A)
      this.A = null
      this.h && (this.h.m(), (this.h = null))
    }
    l.Bb = function () {
      ko(this)
      this.g = new Gl()
      this.g.render(this.s)
      return F()
    }
    function ko(a) {
      a.j && a.j.reset()
      a.mb()
      a.g && a.g.m()
    }
    l.pb = function (a) {
      var b = this,
        c = Ld({ code: a.code }).toString() || a.message
      ko(this)
      var d
      a.retry &&
        'function' === typeof a.retry &&
        (d = function () {
          b.reset()
          a.retry()
        })
      this.g = new Kl(c, d)
      this.g.render(this.s)
    }
    l.Rb = function (a) {
      var b = this
      return F()
        .then(function () {
          var c = b.i && b.i.app.options.apiKey
          if (!b.a.hasOwnProperty(c))
            throw Error('Invalid project configuration: API key is invalid!')
          co(b.a[c], a.tenantId || '_')
          if (!b.i.currentUser || b.i.currentUser.uid !== a.uid)
            throw Error('The user being processed does not match the signed in user!')
          return (c = $n(b.a[c]).beforeSignInSuccess || null) ? c(a) : a
        })
        .then(function (c) {
          if (c.uid !== a.uid) throw Error('User with mismatching UID returned.')
          return c
        })
    }
    v('firebaseui.auth.FirebaseUiHandler', jo)
    v('firebaseui.auth.FirebaseUiHandler.prototype.selectTenant', jo.prototype.Ub)
    v('firebaseui.auth.FirebaseUiHandler.prototype.getAuth', jo.prototype.Pb)
    v('firebaseui.auth.FirebaseUiHandler.prototype.startSignIn', jo.prototype.Zb)
    v('firebaseui.auth.FirebaseUiHandler.prototype.reset', jo.prototype.reset)
    v('firebaseui.auth.FirebaseUiHandler.prototype.showProgressBar', jo.prototype.Vb)
    v('firebaseui.auth.FirebaseUiHandler.prototype.hideProgressBar', jo.prototype.mb)
    v('firebaseui.auth.FirebaseUiHandler.prototype.completeSignOut', jo.prototype.Bb)
    v('firebaseui.auth.FirebaseUiHandler.prototype.handleError', jo.prototype.pb)
    v('firebaseui.auth.FirebaseUiHandler.prototype.processUser', jo.prototype.Rb)
    v('firebaseui.auth.AuthUI', En)
    v('firebaseui.auth.AuthUI.getInstance', function (a) {
      a = Fn(a)
      return Gn[a] ? Gn[a] : null
    })
    v('firebaseui.auth.AuthUI.prototype.disableAutoSignIn', En.prototype.Db)
    v('firebaseui.auth.AuthUI.prototype.start', En.prototype.start)
    v('firebaseui.auth.AuthUI.prototype.setConfig', En.prototype.ib)
    v('firebaseui.auth.AuthUI.prototype.signIn', En.prototype.Wb)
    v('firebaseui.auth.AuthUI.prototype.reset', En.prototype.reset)
    v('firebaseui.auth.AuthUI.prototype.delete', En.prototype.Wa)
    v('firebaseui.auth.AuthUI.prototype.isPendingRedirect', En.prototype.nb)
    v('firebaseui.auth.AuthUIError', Nd)
    v('firebaseui.auth.AuthUIError.prototype.toJSON', Nd.prototype.toJSON)
    v('firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM', Ni)
    v('firebaseui.auth.CredentialHelper.GOOGLE_YOLO', ni)
    v('firebaseui.auth.CredentialHelper.NONE', ci)
    v('firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID', 'anonymous')
    Ve.prototype['catch'] = Ve.prototype.Ca
    Ve.prototype['finally'] = Ve.prototype.fc
  }.apply(typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : window))
  if (typeof window !== 'undefined') {
    window.dialogPolyfill = require('dialog-polyfill')
  }
})()
module.exports = firebaseui
