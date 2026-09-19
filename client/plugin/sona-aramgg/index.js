/**
 * @name Sona · ARAMGG 内置版
 * @version 1.9.1
 * @description ARAMGG 内置战绩插件 — 大厅与选人阶段战绩注入
 * @author WJZ_P (Sona) · ARAMGG 整合
 * @link https://github.com/AGTHESHY/ARAMGG
 */
import "./index.css";
var t0 = Object.defineProperty;
var a0 = (u, s, c) => s in u ? t0(u, s, { enumerable: !0, configurable: !0, writable: !0, value: c }) : u[s] = c;
var Te = (u, s, c) => a0(u, typeof s != "symbol" ? s + "" : s, c);
const l0 = {
  info: { badge: "INFO", color: "#43b581", method: "log" },
  warn: { badge: "WARN", color: "#faa61a", method: "warn" },
  error: { badge: "ERROR", color: "#f04747", method: "error" },
  debug: { badge: "DEBUG", color: "#7289da", method: "debug" }
};
function Fg(u) {
  const {
    name: s,
    version: c,
    primaryColor: o = "#66ccff",
    accentColor: r = "#43b581"
  } = u, m = `${s}`;
  function h() {
    const S = [
      "color: #fff",
      `background: ${o}`,
      "padding: 4px 8px",
      "border-radius: 4px 0 0 4px",
      "font-weight: bold",
      "font-size: 14px"
    ].join(";"), g = [
      "color: #fff",
      `background: ${r}`,
      "padding: 4px 8px",
      "border-radius: 0 4px 4px 0",
      "font-weight: bold",
      "font-size: 14px"
    ].join(";");
    console.log(
      `%c ${s} ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚♫ %c v${c} `,
      S,
      g
    );
  }
  function y(S, g, ...A) {
    const { badge: C, color: L, method: B } = l0[S], q = [
      "color: #fff",
      `background: ${o}`,
      "padding: 2px 6px",
      "border-radius: 3px 0 0 3px",
      "font-weight: bold",
      "font-size: 13px"
    ].join(";"), K = [
      "color: #fff",
      `background: ${L}`,
      "padding: 2px 6px",
      "border-radius: 0 3px 3px 0",
      "font-weight: bold",
      "font-size: 13px"
    ].join(";");
    console[B](
      `%c${m}%c${C}%c ${g}`,
      q,
      K,
      "color: inherit; background: inherit;",
      ...A
    );
  }
  return {
    printBanner: h,
    info: (S, ...g) => y("info", S, ...g),
    warn: (S, ...g) => y("warn", S, ...g),
    error: (S, ...g) => y("error", S, ...g),
    debug: (S, ...g) => y("debug", S, ...g)
  };
}
var Ec = { exports: {} }, Wn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vg;
function n0() {
  if (vg) return Wn;
  vg = 1;
  var u = Symbol.for("react.transitional.element"), s = Symbol.for("react.fragment");
  function c(o, r, m) {
    var h = null;
    if (m !== void 0 && (h = "" + m), r.key !== void 0 && (h = "" + r.key), "key" in r) {
      m = {};
      for (var y in r)
        y !== "key" && (m[y] = r[y]);
    } else m = r;
    return r = m.ref, {
      $$typeof: u,
      type: o,
      key: h,
      ref: r !== void 0 ? r : null,
      props: m
    };
  }
  return Wn.Fragment = s, Wn.jsx = c, Wn.jsxs = c, Wn;
}
var bg;
function i0() {
  return bg || (bg = 1, Ec.exports = n0()), Ec.exports;
}
var D = i0(), Mc = { exports: {} }, Pn = {}, Nc = { exports: {} }, Cc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Sg;
function u0() {
  return Sg || (Sg = 1, (function(u) {
    function s(w, k) {
      var P = w.length;
      w.push(k);
      e: for (; 0 < P; ) {
        var be = P - 1 >>> 1, Ae = w[be];
        if (0 < r(Ae, k))
          w[be] = k, w[P] = Ae, P = be;
        else break e;
      }
    }
    function c(w) {
      return w.length === 0 ? null : w[0];
    }
    function o(w) {
      if (w.length === 0) return null;
      var k = w[0], P = w.pop();
      if (P !== k) {
        w[0] = P;
        e: for (var be = 0, Ae = w.length, b = Ae >>> 1; be < b; ) {
          var U = 2 * (be + 1) - 1, H = w[U], j = U + 1, W = w[j];
          if (0 > r(H, P))
            j < Ae && 0 > r(W, H) ? (w[be] = W, w[j] = P, be = j) : (w[be] = H, w[U] = P, be = U);
          else if (j < Ae && 0 > r(W, P))
            w[be] = W, w[j] = P, be = j;
          else break e;
        }
      }
      return k;
    }
    function r(w, k) {
      var P = w.sortIndex - k.sortIndex;
      return P !== 0 ? P : w.id - k.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      u.unstable_now = function() {
        return m.now();
      };
    } else {
      var h = Date, y = h.now();
      u.unstable_now = function() {
        return h.now() - y;
      };
    }
    var S = [], g = [], A = 1, C = null, L = 3, B = !1, q = !1, K = !1, x = !1, ae = typeof setTimeout == "function" ? setTimeout : null, Y = typeof clearTimeout == "function" ? clearTimeout : null, $ = typeof setImmediate < "u" ? setImmediate : null;
    function G(w) {
      for (var k = c(g); k !== null; ) {
        if (k.callback === null) o(g);
        else if (k.startTime <= w)
          o(g), k.sortIndex = k.expirationTime, s(S, k);
        else break;
        k = c(g);
      }
    }
    function J(w) {
      if (K = !1, G(w), !q)
        if (c(S) !== null)
          q = !0, oe || (oe = !0, I());
        else {
          var k = c(g);
          k !== null && Ye(J, k.startTime - w);
        }
    }
    var oe = !1, Q = -1, ne = 5, he = -1;
    function ve() {
      return x ? !0 : !(u.unstable_now() - he < ne);
    }
    function Le() {
      if (x = !1, oe) {
        var w = u.unstable_now();
        he = w;
        var k = !0;
        try {
          e: {
            q = !1, K && (K = !1, Y(Q), Q = -1), B = !0;
            var P = L;
            try {
              t: {
                for (G(w), C = c(S); C !== null && !(C.expirationTime > w && ve()); ) {
                  var be = C.callback;
                  if (typeof be == "function") {
                    C.callback = null, L = C.priorityLevel;
                    var Ae = be(
                      C.expirationTime <= w
                    );
                    if (w = u.unstable_now(), typeof Ae == "function") {
                      C.callback = Ae, G(w), k = !0;
                      break t;
                    }
                    C === c(S) && o(S), G(w);
                  } else o(S);
                  C = c(S);
                }
                if (C !== null) k = !0;
                else {
                  var b = c(g);
                  b !== null && Ye(
                    J,
                    b.startTime - w
                  ), k = !1;
                }
              }
              break e;
            } finally {
              C = null, L = P, B = !1;
            }
            k = void 0;
          }
        } finally {
          k ? I() : oe = !1;
        }
      }
    }
    var I;
    if (typeof $ == "function")
      I = function() {
        $(Le);
      };
    else if (typeof MessageChannel < "u") {
      var at = new MessageChannel(), He = at.port2;
      at.port1.onmessage = Le, I = function() {
        He.postMessage(null);
      };
    } else
      I = function() {
        ae(Le, 0);
      };
    function Ye(w, k) {
      Q = ae(function() {
        w(u.unstable_now());
      }, k);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(w) {
      w.callback = null;
    }, u.unstable_forceFrameRate = function(w) {
      0 > w || 125 < w ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : ne = 0 < w ? Math.floor(1e3 / w) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return L;
    }, u.unstable_next = function(w) {
      switch (L) {
        case 1:
        case 2:
        case 3:
          var k = 3;
          break;
        default:
          k = L;
      }
      var P = L;
      L = k;
      try {
        return w();
      } finally {
        L = P;
      }
    }, u.unstable_requestPaint = function() {
      x = !0;
    }, u.unstable_runWithPriority = function(w, k) {
      switch (w) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          w = 3;
      }
      var P = L;
      L = w;
      try {
        return k();
      } finally {
        L = P;
      }
    }, u.unstable_scheduleCallback = function(w, k, P) {
      var be = u.unstable_now();
      switch (typeof P == "object" && P !== null ? (P = P.delay, P = typeof P == "number" && 0 < P ? be + P : be) : P = be, w) {
        case 1:
          var Ae = -1;
          break;
        case 2:
          Ae = 250;
          break;
        case 5:
          Ae = 1073741823;
          break;
        case 4:
          Ae = 1e4;
          break;
        default:
          Ae = 5e3;
      }
      return Ae = P + Ae, w = {
        id: A++,
        callback: k,
        priorityLevel: w,
        startTime: P,
        expirationTime: Ae,
        sortIndex: -1
      }, P > be ? (w.sortIndex = P, s(g, w), c(S) === null && w === c(g) && (K ? (Y(Q), Q = -1) : K = !0, Ye(J, P - be))) : (w.sortIndex = Ae, s(S, w), q || B || (q = !0, oe || (oe = !0, I()))), w;
    }, u.unstable_shouldYield = ve, u.unstable_wrapCallback = function(w) {
      var k = L;
      return function() {
        var P = L;
        L = k;
        try {
          return w.apply(this, arguments);
        } finally {
          L = P;
        }
      };
    };
  })(Cc)), Cc;
}
var Tg;
function s0() {
  return Tg || (Tg = 1, Nc.exports = u0()), Nc.exports;
}
var Rc = { exports: {} }, ie = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ag;
function o0() {
  if (Ag) return ie;
  Ag = 1;
  var u = Symbol.for("react.transitional.element"), s = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), h = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), g = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), C = Symbol.for("react.activity"), L = Symbol.iterator;
  function B(b) {
    return b === null || typeof b != "object" ? null : (b = L && b[L] || b["@@iterator"], typeof b == "function" ? b : null);
  }
  var q = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, K = Object.assign, x = {};
  function ae(b, U, H) {
    this.props = b, this.context = U, this.refs = x, this.updater = H || q;
  }
  ae.prototype.isReactComponent = {}, ae.prototype.setState = function(b, U) {
    if (typeof b != "object" && typeof b != "function" && b != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, b, U, "setState");
  }, ae.prototype.forceUpdate = function(b) {
    this.updater.enqueueForceUpdate(this, b, "forceUpdate");
  };
  function Y() {
  }
  Y.prototype = ae.prototype;
  function $(b, U, H) {
    this.props = b, this.context = U, this.refs = x, this.updater = H || q;
  }
  var G = $.prototype = new Y();
  G.constructor = $, K(G, ae.prototype), G.isPureReactComponent = !0;
  var J = Array.isArray;
  function oe() {
  }
  var Q = { H: null, A: null, T: null, S: null }, ne = Object.prototype.hasOwnProperty;
  function he(b, U, H) {
    var j = H.ref;
    return {
      $$typeof: u,
      type: b,
      key: U,
      ref: j !== void 0 ? j : null,
      props: H
    };
  }
  function ve(b, U) {
    return he(b.type, U, b.props);
  }
  function Le(b) {
    return typeof b == "object" && b !== null && b.$$typeof === u;
  }
  function I(b) {
    var U = { "=": "=0", ":": "=2" };
    return "$" + b.replace(/[=:]/g, function(H) {
      return U[H];
    });
  }
  var at = /\/+/g;
  function He(b, U) {
    return typeof b == "object" && b !== null && b.key != null ? I("" + b.key) : U.toString(36);
  }
  function Ye(b) {
    switch (b.status) {
      case "fulfilled":
        return b.value;
      case "rejected":
        throw b.reason;
      default:
        switch (typeof b.status == "string" ? b.then(oe, oe) : (b.status = "pending", b.then(
          function(U) {
            b.status === "pending" && (b.status = "fulfilled", b.value = U);
          },
          function(U) {
            b.status === "pending" && (b.status = "rejected", b.reason = U);
          }
        )), b.status) {
          case "fulfilled":
            return b.value;
          case "rejected":
            throw b.reason;
        }
    }
    throw b;
  }
  function w(b, U, H, j, W) {
    var te = typeof b;
    (te === "undefined" || te === "boolean") && (b = null);
    var ue = !1;
    if (b === null) ue = !0;
    else
      switch (te) {
        case "bigint":
        case "string":
        case "number":
          ue = !0;
          break;
        case "object":
          switch (b.$$typeof) {
            case u:
            case s:
              ue = !0;
              break;
            case A:
              return ue = b._init, w(
                ue(b._payload),
                U,
                H,
                j,
                W
              );
          }
      }
    if (ue)
      return W = W(b), ue = j === "" ? "." + He(b, 0) : j, J(W) ? (H = "", ue != null && (H = ue.replace(at, "$&/") + "/"), w(W, U, H, "", function(nn) {
        return nn;
      })) : W != null && (Le(W) && (W = ve(
        W,
        H + (W.key == null || b && b.key === W.key ? "" : ("" + W.key).replace(
          at,
          "$&/"
        ) + "/") + ue
      )), U.push(W)), 1;
    ue = 0;
    var ke = j === "" ? "." : j + ":";
    if (J(b))
      for (var je = 0; je < b.length; je++)
        j = b[je], te = ke + He(j, je), ue += w(
          j,
          U,
          H,
          te,
          W
        );
    else if (je = B(b), typeof je == "function")
      for (b = je.call(b), je = 0; !(j = b.next()).done; )
        j = j.value, te = ke + He(j, je++), ue += w(
          j,
          U,
          H,
          te,
          W
        );
    else if (te === "object") {
      if (typeof b.then == "function")
        return w(
          Ye(b),
          U,
          H,
          j,
          W
        );
      throw U = String(b), Error(
        "Objects are not valid as a React child (found: " + (U === "[object Object]" ? "object with keys {" + Object.keys(b).join(", ") + "}" : U) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ue;
  }
  function k(b, U, H) {
    if (b == null) return b;
    var j = [], W = 0;
    return w(b, j, "", "", function(te) {
      return U.call(H, te, W++);
    }), j;
  }
  function P(b) {
    if (b._status === -1) {
      var U = b._result;
      U = U(), U.then(
        function(H) {
          (b._status === 0 || b._status === -1) && (b._status = 1, b._result = H);
        },
        function(H) {
          (b._status === 0 || b._status === -1) && (b._status = 2, b._result = H);
        }
      ), b._status === -1 && (b._status = 0, b._result = U);
    }
    if (b._status === 1) return b._result.default;
    throw b._result;
  }
  var be = typeof reportError == "function" ? reportError : function(b) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var U = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof b == "object" && b !== null && typeof b.message == "string" ? String(b.message) : String(b),
        error: b
      });
      if (!window.dispatchEvent(U)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", b);
      return;
    }
    console.error(b);
  }, Ae = {
    map: k,
    forEach: function(b, U, H) {
      k(
        b,
        function() {
          U.apply(this, arguments);
        },
        H
      );
    },
    count: function(b) {
      var U = 0;
      return k(b, function() {
        U++;
      }), U;
    },
    toArray: function(b) {
      return k(b, function(U) {
        return U;
      }) || [];
    },
    only: function(b) {
      if (!Le(b))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return b;
    }
  };
  return ie.Activity = C, ie.Children = Ae, ie.Component = ae, ie.Fragment = c, ie.Profiler = r, ie.PureComponent = $, ie.StrictMode = o, ie.Suspense = S, ie.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Q, ie.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(b) {
      return Q.H.useMemoCache(b);
    }
  }, ie.cache = function(b) {
    return function() {
      return b.apply(null, arguments);
    };
  }, ie.cacheSignal = function() {
    return null;
  }, ie.cloneElement = function(b, U, H) {
    if (b == null)
      throw Error(
        "The argument must be a React element, but you passed " + b + "."
      );
    var j = K({}, b.props), W = b.key;
    if (U != null)
      for (te in U.key !== void 0 && (W = "" + U.key), U)
        !ne.call(U, te) || te === "key" || te === "__self" || te === "__source" || te === "ref" && U.ref === void 0 || (j[te] = U[te]);
    var te = arguments.length - 2;
    if (te === 1) j.children = H;
    else if (1 < te) {
      for (var ue = Array(te), ke = 0; ke < te; ke++)
        ue[ke] = arguments[ke + 2];
      j.children = ue;
    }
    return he(b.type, W, j);
  }, ie.createContext = function(b) {
    return b = {
      $$typeof: h,
      _currentValue: b,
      _currentValue2: b,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, b.Provider = b, b.Consumer = {
      $$typeof: m,
      _context: b
    }, b;
  }, ie.createElement = function(b, U, H) {
    var j, W = {}, te = null;
    if (U != null)
      for (j in U.key !== void 0 && (te = "" + U.key), U)
        ne.call(U, j) && j !== "key" && j !== "__self" && j !== "__source" && (W[j] = U[j]);
    var ue = arguments.length - 2;
    if (ue === 1) W.children = H;
    else if (1 < ue) {
      for (var ke = Array(ue), je = 0; je < ue; je++)
        ke[je] = arguments[je + 2];
      W.children = ke;
    }
    if (b && b.defaultProps)
      for (j in ue = b.defaultProps, ue)
        W[j] === void 0 && (W[j] = ue[j]);
    return he(b, te, W);
  }, ie.createRef = function() {
    return { current: null };
  }, ie.forwardRef = function(b) {
    return { $$typeof: y, render: b };
  }, ie.isValidElement = Le, ie.lazy = function(b) {
    return {
      $$typeof: A,
      _payload: { _status: -1, _result: b },
      _init: P
    };
  }, ie.memo = function(b, U) {
    return {
      $$typeof: g,
      type: b,
      compare: U === void 0 ? null : U
    };
  }, ie.startTransition = function(b) {
    var U = Q.T, H = {};
    Q.T = H;
    try {
      var j = b(), W = Q.S;
      W !== null && W(H, j), typeof j == "object" && j !== null && typeof j.then == "function" && j.then(oe, be);
    } catch (te) {
      be(te);
    } finally {
      U !== null && H.types !== null && (U.types = H.types), Q.T = U;
    }
  }, ie.unstable_useCacheRefresh = function() {
    return Q.H.useCacheRefresh();
  }, ie.use = function(b) {
    return Q.H.use(b);
  }, ie.useActionState = function(b, U, H) {
    return Q.H.useActionState(b, U, H);
  }, ie.useCallback = function(b, U) {
    return Q.H.useCallback(b, U);
  }, ie.useContext = function(b) {
    return Q.H.useContext(b);
  }, ie.useDebugValue = function() {
  }, ie.useDeferredValue = function(b, U) {
    return Q.H.useDeferredValue(b, U);
  }, ie.useEffect = function(b, U) {
    return Q.H.useEffect(b, U);
  }, ie.useEffectEvent = function(b) {
    return Q.H.useEffectEvent(b);
  }, ie.useId = function() {
    return Q.H.useId();
  }, ie.useImperativeHandle = function(b, U, H) {
    return Q.H.useImperativeHandle(b, U, H);
  }, ie.useInsertionEffect = function(b, U) {
    return Q.H.useInsertionEffect(b, U);
  }, ie.useLayoutEffect = function(b, U) {
    return Q.H.useLayoutEffect(b, U);
  }, ie.useMemo = function(b, U) {
    return Q.H.useMemo(b, U);
  }, ie.useOptimistic = function(b, U) {
    return Q.H.useOptimistic(b, U);
  }, ie.useReducer = function(b, U, H) {
    return Q.H.useReducer(b, U, H);
  }, ie.useRef = function(b) {
    return Q.H.useRef(b);
  }, ie.useState = function(b) {
    return Q.H.useState(b);
  }, ie.useSyncExternalStore = function(b, U, H) {
    return Q.H.useSyncExternalStore(
      b,
      U,
      H
    );
  }, ie.useTransition = function() {
    return Q.H.useTransition();
  }, ie.version = "19.2.4", ie;
}
var Eg;
function tr() {
  return Eg || (Eg = 1, Rc.exports = o0()), Rc.exports;
}
var Dc = { exports: {} }, lt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Mg;
function c0() {
  if (Mg) return lt;
  Mg = 1;
  var u = tr();
  function s(S) {
    var g = "https://react.dev/errors/" + S;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var A = 2; A < arguments.length; A++)
        g += "&args[]=" + encodeURIComponent(arguments[A]);
    }
    return "Minified React error #" + S + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c() {
  }
  var o = {
    d: {
      f: c,
      r: function() {
        throw Error(s(522));
      },
      D: c,
      C: c,
      L: c,
      m: c,
      X: c,
      S: c,
      M: c
    },
    p: 0,
    findDOMNode: null
  }, r = Symbol.for("react.portal");
  function m(S, g, A) {
    var C = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: r,
      key: C == null ? null : "" + C,
      children: S,
      containerInfo: g,
      implementation: A
    };
  }
  var h = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function y(S, g) {
    if (S === "font") return "";
    if (typeof g == "string")
      return g === "use-credentials" ? g : "";
  }
  return lt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, lt.createPortal = function(S, g) {
    var A = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)
      throw Error(s(299));
    return m(S, g, null, A);
  }, lt.flushSync = function(S) {
    var g = h.T, A = o.p;
    try {
      if (h.T = null, o.p = 2, S) return S();
    } finally {
      h.T = g, o.p = A, o.d.f();
    }
  }, lt.preconnect = function(S, g) {
    typeof S == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, o.d.C(S, g));
  }, lt.prefetchDNS = function(S) {
    typeof S == "string" && o.d.D(S);
  }, lt.preinit = function(S, g) {
    if (typeof S == "string" && g && typeof g.as == "string") {
      var A = g.as, C = y(A, g.crossOrigin), L = typeof g.integrity == "string" ? g.integrity : void 0, B = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
      A === "style" ? o.d.S(
        S,
        typeof g.precedence == "string" ? g.precedence : void 0,
        {
          crossOrigin: C,
          integrity: L,
          fetchPriority: B
        }
      ) : A === "script" && o.d.X(S, {
        crossOrigin: C,
        integrity: L,
        fetchPriority: B,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0
      });
    }
  }, lt.preinitModule = function(S, g) {
    if (typeof S == "string")
      if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var A = y(
            g.as,
            g.crossOrigin
          );
          o.d.M(S, {
            crossOrigin: A,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0
          });
        }
      } else g == null && o.d.M(S);
  }, lt.preload = function(S, g) {
    if (typeof S == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
      var A = g.as, C = y(A, g.crossOrigin);
      o.d.L(S, A, {
        crossOrigin: C,
        integrity: typeof g.integrity == "string" ? g.integrity : void 0,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0,
        type: typeof g.type == "string" ? g.type : void 0,
        fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
        referrerPolicy: typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
        imageSrcSet: typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
        imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
        media: typeof g.media == "string" ? g.media : void 0
      });
    }
  }, lt.preloadModule = function(S, g) {
    if (typeof S == "string")
      if (g) {
        var A = y(g.as, g.crossOrigin);
        o.d.m(S, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: A,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0
        });
      } else o.d.m(S);
  }, lt.requestFormReset = function(S) {
    o.d.r(S);
  }, lt.unstable_batchedUpdates = function(S, g) {
    return S(g);
  }, lt.useFormState = function(S, g, A) {
    return h.H.useFormState(S, g, A);
  }, lt.useFormStatus = function() {
    return h.H.useHostTransitionStatus();
  }, lt.version = "19.2.4", lt;
}
var Ng;
function $g() {
  if (Ng) return Dc.exports;
  Ng = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (s) {
        console.error(s);
      }
  }
  return u(), Dc.exports = c0(), Dc.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Cg;
function r0() {
  if (Cg) return Pn;
  Cg = 1;
  var u = s0(), s = tr(), c = $g();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function r(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function m(e) {
    var t = e, a = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (a = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? a : null;
  }
  function h(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function y(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function S(e) {
    if (m(e) !== e)
      throw Error(o(188));
  }
  function g(e) {
    var t = e.alternate;
    if (!t) {
      if (t = m(e), t === null) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var a = e, l = t; ; ) {
      var n = a.return;
      if (n === null) break;
      var i = n.alternate;
      if (i === null) {
        if (l = n.return, l !== null) {
          a = l;
          continue;
        }
        break;
      }
      if (n.child === i.child) {
        for (i = n.child; i; ) {
          if (i === a) return S(n), e;
          if (i === l) return S(n), t;
          i = i.sibling;
        }
        throw Error(o(188));
      }
      if (a.return !== l.return) a = n, l = i;
      else {
        for (var f = !1, d = n.child; d; ) {
          if (d === a) {
            f = !0, a = n, l = i;
            break;
          }
          if (d === l) {
            f = !0, l = n, a = i;
            break;
          }
          d = d.sibling;
        }
        if (!f) {
          for (d = i.child; d; ) {
            if (d === a) {
              f = !0, a = i, l = n;
              break;
            }
            if (d === l) {
              f = !0, l = i, a = n;
              break;
            }
            d = d.sibling;
          }
          if (!f) throw Error(o(189));
        }
      }
      if (a.alternate !== l) throw Error(o(190));
    }
    if (a.tag !== 3) throw Error(o(188));
    return a.stateNode.current === a ? e : t;
  }
  function A(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = A(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var C = Object.assign, L = Symbol.for("react.element"), B = Symbol.for("react.transitional.element"), q = Symbol.for("react.portal"), K = Symbol.for("react.fragment"), x = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), Y = Symbol.for("react.consumer"), $ = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), J = Symbol.for("react.suspense"), oe = Symbol.for("react.suspense_list"), Q = Symbol.for("react.memo"), ne = Symbol.for("react.lazy"), he = Symbol.for("react.activity"), ve = Symbol.for("react.memo_cache_sentinel"), Le = Symbol.iterator;
  function I(e) {
    return e === null || typeof e != "object" ? null : (e = Le && e[Le] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var at = Symbol.for("react.client.reference");
  function He(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === at ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case K:
        return "Fragment";
      case ae:
        return "Profiler";
      case x:
        return "StrictMode";
      case J:
        return "Suspense";
      case oe:
        return "SuspenseList";
      case he:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case q:
          return "Portal";
        case $:
          return e.displayName || "Context";
        case Y:
          return (e._context.displayName || "Context") + ".Consumer";
        case G:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case Q:
          return t = e.displayName || null, t !== null ? t : He(e.type) || "Memo";
        case ne:
          t = e._payload, e = e._init;
          try {
            return He(e(t));
          } catch {
          }
      }
    return null;
  }
  var Ye = Array.isArray, w = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, k = c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, P = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, be = [], Ae = -1;
  function b(e) {
    return { current: e };
  }
  function U(e) {
    0 > Ae || (e.current = be[Ae], be[Ae] = null, Ae--);
  }
  function H(e, t) {
    Ae++, be[Ae] = e.current, e.current = t;
  }
  var j = b(null), W = b(null), te = b(null), ue = b(null);
  function ke(e, t) {
    switch (H(te, t), H(W, e), H(j, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? qm(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = qm(t), e = Ym(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    U(j), H(j, e);
  }
  function je() {
    U(j), U(W), U(te);
  }
  function nn(e) {
    e.memoizedState !== null && H(ue, e);
    var t = j.current, a = Ym(t, e.type);
    t !== a && (H(W, e), H(j, a));
  }
  function yi(e) {
    W.current === e && (U(j), U(W)), ue.current === e && (U(ue), In._currentValue = P);
  }
  var ns, pr;
  function qa(e) {
    if (ns === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        ns = t && t[1] || "", pr = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ns + e + pr;
  }
  var is = !1;
  function us(e, t) {
    if (!e || is) return "";
    is = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var z = function() {
                throw Error();
              };
              if (Object.defineProperty(z.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(z, []);
                } catch (R) {
                  var N = R;
                }
                Reflect.construct(e, [], z);
              } else {
                try {
                  z.call();
                } catch (R) {
                  N = R;
                }
                e.call(z.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (R) {
                N = R;
              }
              (z = e()) && typeof z.catch == "function" && z.catch(function() {
              });
            }
          } catch (R) {
            if (R && N && typeof R.stack == "string")
              return [R.stack, N.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var i = l.DetermineComponentFrameRoot(), f = i[0], d = i[1];
      if (f && d) {
        var p = f.split(`
`), M = d.split(`
`);
        for (n = l = 0; l < p.length && !p[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; n < M.length && !M[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (l === p.length || n === M.length)
          for (l = p.length - 1, n = M.length - 1; 1 <= l && 0 <= n && p[l] !== M[n]; )
            n--;
        for (; 1 <= l && 0 <= n; l--, n--)
          if (p[l] !== M[n]) {
            if (l !== 1 || n !== 1)
              do
                if (l--, n--, 0 > n || p[l] !== M[n]) {
                  var _ = `
` + p[l].replace(" at new ", " at ");
                  return e.displayName && _.includes("<anonymous>") && (_ = _.replace("<anonymous>", e.displayName)), _;
                }
              while (1 <= l && 0 <= n);
            break;
          }
      }
    } finally {
      is = !1, Error.prepareStackTrace = a;
    }
    return (a = e ? e.displayName || e.name : "") ? qa(a) : "";
  }
  function zh(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return qa(e.type);
      case 16:
        return qa("Lazy");
      case 13:
        return e.child !== t && t !== null ? qa("Suspense Fallback") : qa("Suspense");
      case 19:
        return qa("SuspenseList");
      case 0:
      case 15:
        return us(e.type, !1);
      case 11:
        return us(e.type.render, !1);
      case 1:
        return us(e.type, !0);
      case 31:
        return qa("Activity");
      default:
        return "";
    }
  }
  function yr(e) {
    try {
      var t = "", a = null;
      do
        t += zh(e, a), a = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var ss = Object.prototype.hasOwnProperty, os = u.unstable_scheduleCallback, cs = u.unstable_cancelCallback, Uh = u.unstable_shouldYield, Lh = u.unstable_requestPaint, yt = u.unstable_now, Hh = u.unstable_getCurrentPriorityLevel, vr = u.unstable_ImmediatePriority, br = u.unstable_UserBlockingPriority, vi = u.unstable_NormalPriority, xh = u.unstable_LowPriority, Sr = u.unstable_IdlePriority, Bh = u.log, kh = u.unstable_setDisableYieldValue, un = null, vt = null;
  function fa(e) {
    if (typeof Bh == "function" && kh(e), vt && typeof vt.setStrictMode == "function")
      try {
        vt.setStrictMode(un, e);
      } catch {
      }
  }
  var bt = Math.clz32 ? Math.clz32 : qh, jh = Math.log, Gh = Math.LN2;
  function qh(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (jh(e) / Gh | 0) | 0;
  }
  var bi = 256, Si = 262144, Ti = 4194304;
  function Ya(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Ai(e, t, a) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var n = 0, i = e.suspendedLanes, f = e.pingedLanes;
    e = e.warmLanes;
    var d = l & 134217727;
    return d !== 0 ? (l = d & ~i, l !== 0 ? n = Ya(l) : (f &= d, f !== 0 ? n = Ya(f) : a || (a = d & ~e, a !== 0 && (n = Ya(a))))) : (d = l & ~i, d !== 0 ? n = Ya(d) : f !== 0 ? n = Ya(f) : a || (a = l & ~e, a !== 0 && (n = Ya(a)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, a = t & -t, i >= a || i === 32 && (a & 4194048) !== 0) ? t : n;
  }
  function sn(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Yh(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Tr() {
    var e = Ti;
    return Ti <<= 1, (Ti & 62914560) === 0 && (Ti = 4194304), e;
  }
  function rs(e) {
    for (var t = [], a = 0; 31 > a; a++) t.push(e);
    return t;
  }
  function on(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Qh(e, t, a, l, n, i) {
    var f = e.pendingLanes;
    e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
    var d = e.entanglements, p = e.expirationTimes, M = e.hiddenUpdates;
    for (a = f & ~a; 0 < a; ) {
      var _ = 31 - bt(a), z = 1 << _;
      d[_] = 0, p[_] = -1;
      var N = M[_];
      if (N !== null)
        for (M[_] = null, _ = 0; _ < N.length; _++) {
          var R = N[_];
          R !== null && (R.lane &= -536870913);
        }
      a &= ~z;
    }
    l !== 0 && Ar(e, l, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(f & ~t));
  }
  function Ar(e, t, a) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - bt(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | a & 261930;
  }
  function Er(e, t) {
    var a = e.entangledLanes |= t;
    for (e = e.entanglements; a; ) {
      var l = 31 - bt(a), n = 1 << l;
      n & t | e[l] & t && (e[l] |= t), a &= ~n;
    }
  }
  function Mr(e, t) {
    var a = t & -t;
    return a = (a & 42) !== 0 ? 1 : fs(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
  }
  function fs(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function ds(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Nr() {
    var e = k.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : fg(e.type));
  }
  function Cr(e, t) {
    var a = k.p;
    try {
      return k.p = e, t();
    } finally {
      k.p = a;
    }
  }
  var da = Math.random().toString(36).slice(2), $e = "__reactFiber$" + da, ot = "__reactProps$" + da, fl = "__reactContainer$" + da, ms = "__reactEvents$" + da, Vh = "__reactListeners$" + da, Kh = "__reactHandles$" + da, Rr = "__reactResources$" + da, cn = "__reactMarker$" + da;
  function gs(e) {
    delete e[$e], delete e[ot], delete e[ms], delete e[Vh], delete e[Kh];
  }
  function dl(e) {
    var t = e[$e];
    if (t) return t;
    for (var a = e.parentNode; a; ) {
      if (t = a[fl] || a[$e]) {
        if (a = t.alternate, t.child !== null || a !== null && a.child !== null)
          for (e = Jm(e); e !== null; ) {
            if (a = e[$e]) return a;
            e = Jm(e);
          }
        return t;
      }
      e = a, a = e.parentNode;
    }
    return null;
  }
  function ml(e) {
    if (e = e[$e] || e[fl]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function rn(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function gl(e) {
    var t = e[Rr];
    return t || (t = e[Rr] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Je(e) {
    e[cn] = !0;
  }
  var Dr = /* @__PURE__ */ new Set(), wr = {};
  function Qa(e, t) {
    hl(e, t), hl(e + "Capture", t);
  }
  function hl(e, t) {
    for (wr[e] = t, e = 0; e < t.length; e++)
      Dr.add(t[e]);
  }
  var Xh = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), _r = {}, Or = {};
  function Zh(e) {
    return ss.call(Or, e) ? !0 : ss.call(_r, e) ? !1 : Xh.test(e) ? Or[e] = !0 : (_r[e] = !0, !1);
  }
  function Ei(e, t, a) {
    if (Zh(t))
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var l = t.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + a);
      }
  }
  function Mi(e, t, a) {
    if (a === null) e.removeAttribute(t);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + a);
    }
  }
  function Xt(e, t, a, l) {
    if (l === null) e.removeAttribute(a);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(a);
          return;
      }
      e.setAttributeNS(t, a, "" + l);
    }
  }
  function Rt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function zr(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Ih(e, t, a) {
    var l = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var n = l.get, i = l.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(f) {
          a = "" + f, i.call(this, f);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(f) {
          a = "" + f;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function hs(e) {
    if (!e._valueTracker) {
      var t = zr(e) ? "checked" : "value";
      e._valueTracker = Ih(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Ur(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var a = t.getValue(), l = "";
    return e && (l = zr(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== a ? (t.setValue(e), !0) : !1;
  }
  function Ni(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Jh = /[\n"\\]/g;
  function Dt(e) {
    return e.replace(
      Jh,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ps(e, t, a, l, n, i, f, d) {
    e.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? e.type = f : e.removeAttribute("type"), t != null ? f === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Rt(t)) : e.value !== "" + Rt(t) && (e.value = "" + Rt(t)) : f !== "submit" && f !== "reset" || e.removeAttribute("value"), t != null ? ys(e, f, Rt(t)) : a != null ? ys(e, f, Rt(a)) : l != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.name = "" + Rt(d) : e.removeAttribute("name");
  }
  function Lr(e, t, a, l, n, i, f, d) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || a != null) {
      if (!(i !== "submit" && i !== "reset" || t != null)) {
        hs(e);
        return;
      }
      a = a != null ? "" + Rt(a) : "", t = t != null ? "" + Rt(t) : a, d || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? n, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = d ? e.checked : !!l, e.defaultChecked = !!l, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (e.name = f), hs(e);
  }
  function ys(e, t, a) {
    t === "number" && Ni(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
  }
  function pl(e, t, a, l) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < a.length; n++)
        t["$" + a[n]] = !0;
      for (a = 0; a < e.length; a++)
        n = t.hasOwnProperty("$" + e[a].value), e[a].selected !== n && (e[a].selected = n), n && l && (e[a].defaultSelected = !0);
    } else {
      for (a = "" + Rt(a), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === a) {
          e[n].selected = !0, l && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Hr(e, t, a) {
    if (t != null && (t = "" + Rt(t), t !== e.value && (e.value = t), a == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = a != null ? "" + Rt(a) : "";
  }
  function xr(e, t, a, l) {
    if (t == null) {
      if (l != null) {
        if (a != null) throw Error(o(92));
        if (Ye(l)) {
          if (1 < l.length) throw Error(o(93));
          l = l[0];
        }
        a = l;
      }
      a == null && (a = ""), t = a;
    }
    a = Rt(t), e.defaultValue = a, l = e.textContent, l === a && l !== "" && l !== null && (e.value = l), hs(e);
  }
  function yl(e, t) {
    if (t) {
      var a = e.firstChild;
      if (a && a === e.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Fh = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Br(e, t, a) {
    var l = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, a) : typeof a != "number" || a === 0 || Fh.has(t) ? t === "float" ? e.cssFloat = a : e[t] = ("" + a).trim() : e[t] = a + "px";
  }
  function kr(e, t, a) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, a != null) {
      for (var l in a)
        !a.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var n in t)
        l = t[n], t.hasOwnProperty(n) && a[n] !== l && Br(e, n, l);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Br(e, i, t[i]);
  }
  function vs(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var $h = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Wh = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ci(e) {
    return Wh.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Zt() {
  }
  var bs = null;
  function Ss(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var vl = null, bl = null;
  function jr(e) {
    var t = ml(e);
    if (t && (e = t.stateNode)) {
      var a = e[ot] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (ps(
            e,
            a.value,
            a.defaultValue,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name
          ), t = a.name, a.type === "radio" && t != null) {
            for (a = e; a.parentNode; ) a = a.parentNode;
            for (a = a.querySelectorAll(
              'input[name="' + Dt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < a.length; t++) {
              var l = a[t];
              if (l !== e && l.form === e.form) {
                var n = l[ot] || null;
                if (!n) throw Error(o(90));
                ps(
                  l,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (t = 0; t < a.length; t++)
              l = a[t], l.form === e.form && Ur(l);
          }
          break e;
        case "textarea":
          Hr(e, a.value, a.defaultValue);
          break e;
        case "select":
          t = a.value, t != null && pl(e, !!a.multiple, t, !1);
      }
    }
  }
  var Ts = !1;
  function Gr(e, t, a) {
    if (Ts) return e(t, a);
    Ts = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (Ts = !1, (vl !== null || bl !== null) && (mu(), vl && (t = vl, e = bl, bl = vl = null, jr(t), e)))
        for (t = 0; t < e.length; t++) jr(e[t]);
    }
  }
  function fn(e, t) {
    var a = e.stateNode;
    if (a === null) return null;
    var l = a[ot] || null;
    if (l === null) return null;
    a = l[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (l = !l.disabled) || (e = e.type, l = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !l;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (a && typeof a != "function")
      throw Error(
        o(231, t, typeof a)
      );
    return a;
  }
  var It = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), As = !1;
  if (It)
    try {
      var dn = {};
      Object.defineProperty(dn, "passive", {
        get: function() {
          As = !0;
        }
      }), window.addEventListener("test", dn, dn), window.removeEventListener("test", dn, dn);
    } catch {
      As = !1;
    }
  var ma = null, Es = null, Ri = null;
  function qr() {
    if (Ri) return Ri;
    var e, t = Es, a = t.length, l, n = "value" in ma ? ma.value : ma.textContent, i = n.length;
    for (e = 0; e < a && t[e] === n[e]; e++) ;
    var f = a - e;
    for (l = 1; l <= f && t[a - l] === n[i - l]; l++) ;
    return Ri = n.slice(e, 1 < l ? 1 - l : void 0);
  }
  function Di(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function wi() {
    return !0;
  }
  function Yr() {
    return !1;
  }
  function ct(e) {
    function t(a, l, n, i, f) {
      this._reactName = a, this._targetInst = n, this.type = l, this.nativeEvent = i, this.target = f, this.currentTarget = null;
      for (var d in e)
        e.hasOwnProperty(d) && (a = e[d], this[d] = a ? a(i) : i[d]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? wi : Yr, this.isPropagationStopped = Yr, this;
    }
    return C(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = wi);
      },
      stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = wi);
      },
      persist: function() {
      },
      isPersistent: wi
    }), t;
  }
  var Va = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, _i = ct(Va), mn = C({}, Va, { view: 0, detail: 0 }), Ph = ct(mn), Ms, Ns, gn, Oi = C({}, mn, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Rs,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== gn && (gn && e.type === "mousemove" ? (Ms = e.screenX - gn.screenX, Ns = e.screenY - gn.screenY) : Ns = Ms = 0, gn = e), Ms);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Ns;
    }
  }), Qr = ct(Oi), ep = C({}, Oi, { dataTransfer: 0 }), tp = ct(ep), ap = C({}, mn, { relatedTarget: 0 }), Cs = ct(ap), lp = C({}, Va, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), np = ct(lp), ip = C({}, Va, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), up = ct(ip), sp = C({}, Va, { data: 0 }), Vr = ct(sp), op = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, cp = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, rp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function fp(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = rp[e]) ? !!t[e] : !1;
  }
  function Rs() {
    return fp;
  }
  var dp = C({}, mn, {
    key: function(e) {
      if (e.key) {
        var t = op[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Di(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? cp[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Rs,
    charCode: function(e) {
      return e.type === "keypress" ? Di(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Di(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), mp = ct(dp), gp = C({}, Oi, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), Kr = ct(gp), hp = C({}, mn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Rs
  }), pp = ct(hp), yp = C({}, Va, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), vp = ct(yp), bp = C({}, Oi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Sp = ct(bp), Tp = C({}, Va, {
    newState: 0,
    oldState: 0
  }), Ap = ct(Tp), Ep = [9, 13, 27, 32], Ds = It && "CompositionEvent" in window, hn = null;
  It && "documentMode" in document && (hn = document.documentMode);
  var Mp = It && "TextEvent" in window && !hn, Xr = It && (!Ds || hn && 8 < hn && 11 >= hn), Zr = " ", Ir = !1;
  function Jr(e, t) {
    switch (e) {
      case "keyup":
        return Ep.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Fr(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Sl = !1;
  function Np(e, t) {
    switch (e) {
      case "compositionend":
        return Fr(t);
      case "keypress":
        return t.which !== 32 ? null : (Ir = !0, Zr);
      case "textInput":
        return e = t.data, e === Zr && Ir ? null : e;
      default:
        return null;
    }
  }
  function Cp(e, t) {
    if (Sl)
      return e === "compositionend" || !Ds && Jr(e, t) ? (e = qr(), Ri = Es = ma = null, Sl = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Xr && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Rp = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function $r(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Rp[e.type] : t === "textarea";
  }
  function Wr(e, t, a, l) {
    vl ? bl ? bl.push(l) : bl = [l] : vl = l, t = Su(t, "onChange"), 0 < t.length && (a = new _i(
      "onChange",
      "change",
      null,
      a,
      l
    ), e.push({ event: a, listeners: t }));
  }
  var pn = null, yn = null;
  function Dp(e) {
    Hm(e, 0);
  }
  function zi(e) {
    var t = rn(e);
    if (Ur(t)) return e;
  }
  function Pr(e, t) {
    if (e === "change") return t;
  }
  var ef = !1;
  if (It) {
    var ws;
    if (It) {
      var _s = "oninput" in document;
      if (!_s) {
        var tf = document.createElement("div");
        tf.setAttribute("oninput", "return;"), _s = typeof tf.oninput == "function";
      }
      ws = _s;
    } else ws = !1;
    ef = ws && (!document.documentMode || 9 < document.documentMode);
  }
  function af() {
    pn && (pn.detachEvent("onpropertychange", lf), yn = pn = null);
  }
  function lf(e) {
    if (e.propertyName === "value" && zi(yn)) {
      var t = [];
      Wr(
        t,
        yn,
        e,
        Ss(e)
      ), Gr(Dp, t);
    }
  }
  function wp(e, t, a) {
    e === "focusin" ? (af(), pn = t, yn = a, pn.attachEvent("onpropertychange", lf)) : e === "focusout" && af();
  }
  function _p(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return zi(yn);
  }
  function Op(e, t) {
    if (e === "click") return zi(t);
  }
  function zp(e, t) {
    if (e === "input" || e === "change")
      return zi(t);
  }
  function Up(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var St = typeof Object.is == "function" ? Object.is : Up;
  function vn(e, t) {
    if (St(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var a = Object.keys(e), l = Object.keys(t);
    if (a.length !== l.length) return !1;
    for (l = 0; l < a.length; l++) {
      var n = a[l];
      if (!ss.call(t, n) || !St(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function nf(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function uf(e, t) {
    var a = nf(e);
    e = 0;
    for (var l; a; ) {
      if (a.nodeType === 3) {
        if (l = e + a.textContent.length, e <= t && l >= t)
          return { node: a, offset: t - e };
        e = l;
      }
      e: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = nf(a);
    }
  }
  function sf(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? sf(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function of(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Ni(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var a = typeof t.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) e = t.contentWindow;
      else break;
      t = Ni(e.document);
    }
    return t;
  }
  function Os(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Lp = It && "documentMode" in document && 11 >= document.documentMode, Tl = null, zs = null, bn = null, Us = !1;
  function cf(e, t, a) {
    var l = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    Us || Tl == null || Tl !== Ni(l) || (l = Tl, "selectionStart" in l && Os(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), bn && vn(bn, l) || (bn = l, l = Su(zs, "onSelect"), 0 < l.length && (t = new _i(
      "onSelect",
      "select",
      null,
      t,
      a
    ), e.push({ event: t, listeners: l }), t.target = Tl)));
  }
  function Ka(e, t) {
    var a = {};
    return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
  }
  var Al = {
    animationend: Ka("Animation", "AnimationEnd"),
    animationiteration: Ka("Animation", "AnimationIteration"),
    animationstart: Ka("Animation", "AnimationStart"),
    transitionrun: Ka("Transition", "TransitionRun"),
    transitionstart: Ka("Transition", "TransitionStart"),
    transitioncancel: Ka("Transition", "TransitionCancel"),
    transitionend: Ka("Transition", "TransitionEnd")
  }, Ls = {}, rf = {};
  It && (rf = document.createElement("div").style, "AnimationEvent" in window || (delete Al.animationend.animation, delete Al.animationiteration.animation, delete Al.animationstart.animation), "TransitionEvent" in window || delete Al.transitionend.transition);
  function Xa(e) {
    if (Ls[e]) return Ls[e];
    if (!Al[e]) return e;
    var t = Al[e], a;
    for (a in t)
      if (t.hasOwnProperty(a) && a in rf)
        return Ls[e] = t[a];
    return e;
  }
  var ff = Xa("animationend"), df = Xa("animationiteration"), mf = Xa("animationstart"), Hp = Xa("transitionrun"), xp = Xa("transitionstart"), Bp = Xa("transitioncancel"), gf = Xa("transitionend"), hf = /* @__PURE__ */ new Map(), Hs = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Hs.push("scrollEnd");
  function kt(e, t) {
    hf.set(e, t), Qa(t, [e]);
  }
  var Ui = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, wt = [], El = 0, xs = 0;
  function Li() {
    for (var e = El, t = xs = El = 0; t < e; ) {
      var a = wt[t];
      wt[t++] = null;
      var l = wt[t];
      wt[t++] = null;
      var n = wt[t];
      wt[t++] = null;
      var i = wt[t];
      if (wt[t++] = null, l !== null && n !== null) {
        var f = l.pending;
        f === null ? n.next = n : (n.next = f.next, f.next = n), l.pending = n;
      }
      i !== 0 && pf(a, n, i);
    }
  }
  function Hi(e, t, a, l) {
    wt[El++] = e, wt[El++] = t, wt[El++] = a, wt[El++] = l, xs |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Bs(e, t, a, l) {
    return Hi(e, t, a, l), xi(e);
  }
  function Za(e, t) {
    return Hi(e, null, null, t), xi(e);
  }
  function pf(e, t, a) {
    e.lanes |= a;
    var l = e.alternate;
    l !== null && (l.lanes |= a);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= a, l = i.alternate, l !== null && (l.childLanes |= a), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - bt(a), e = i.hiddenUpdates, l = e[n], l === null ? e[n] = [t] : l.push(t), t.lane = a | 536870912), i) : null;
  }
  function xi(e) {
    if (50 < qn)
      throw qn = 0, Zo = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Ml = {};
  function kp(e, t, a, l) {
    this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Tt(e, t, a, l) {
    return new kp(e, t, a, l);
  }
  function ks(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Jt(e, t) {
    var a = e.alternate;
    return a === null ? (a = Tt(
      e.tag,
      t,
      e.key,
      e.mode
    ), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = e.flags & 65011712, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue, t = e.dependencies, a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.refCleanup = e.refCleanup, a;
  }
  function yf(e, t) {
    e.flags &= 65011714;
    var a = e.alternate;
    return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Bi(e, t, a, l, n, i) {
    var f = 0;
    if (l = e, typeof e == "function") ks(e) && (f = 1);
    else if (typeof e == "string")
      f = Qy(
        e,
        a,
        j.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case he:
          return e = Tt(31, a, t, n), e.elementType = he, e.lanes = i, e;
        case K:
          return Ia(a.children, n, i, t);
        case x:
          f = 8, n |= 24;
          break;
        case ae:
          return e = Tt(12, a, t, n | 2), e.elementType = ae, e.lanes = i, e;
        case J:
          return e = Tt(13, a, t, n), e.elementType = J, e.lanes = i, e;
        case oe:
          return e = Tt(19, a, t, n), e.elementType = oe, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case $:
                f = 10;
                break e;
              case Y:
                f = 9;
                break e;
              case G:
                f = 11;
                break e;
              case Q:
                f = 14;
                break e;
              case ne:
                f = 16, l = null;
                break e;
            }
          f = 29, a = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = Tt(f, a, t, n), t.elementType = e, t.type = l, t.lanes = i, t;
  }
  function Ia(e, t, a, l) {
    return e = Tt(7, e, l, t), e.lanes = a, e;
  }
  function js(e, t, a) {
    return e = Tt(6, e, null, t), e.lanes = a, e;
  }
  function vf(e) {
    var t = Tt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Gs(e, t, a) {
    return t = Tt(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = a, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var bf = /* @__PURE__ */ new WeakMap();
  function _t(e, t) {
    if (typeof e == "object" && e !== null) {
      var a = bf.get(e);
      return a !== void 0 ? a : (t = {
        value: e,
        source: t,
        stack: yr(t)
      }, bf.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: yr(t)
    };
  }
  var Nl = [], Cl = 0, ki = null, Sn = 0, Ot = [], zt = 0, ga = null, qt = 1, Yt = "";
  function Ft(e, t) {
    Nl[Cl++] = Sn, Nl[Cl++] = ki, ki = e, Sn = t;
  }
  function Sf(e, t, a) {
    Ot[zt++] = qt, Ot[zt++] = Yt, Ot[zt++] = ga, ga = e;
    var l = qt;
    e = Yt;
    var n = 32 - bt(l) - 1;
    l &= ~(1 << n), a += 1;
    var i = 32 - bt(t) + n;
    if (30 < i) {
      var f = n - n % 5;
      i = (l & (1 << f) - 1).toString(32), l >>= f, n -= f, qt = 1 << 32 - bt(t) + n | a << n | l, Yt = i + e;
    } else
      qt = 1 << i | a << n | l, Yt = e;
  }
  function qs(e) {
    e.return !== null && (Ft(e, 1), Sf(e, 1, 0));
  }
  function Ys(e) {
    for (; e === ki; )
      ki = Nl[--Cl], Nl[Cl] = null, Sn = Nl[--Cl], Nl[Cl] = null;
    for (; e === ga; )
      ga = Ot[--zt], Ot[zt] = null, Yt = Ot[--zt], Ot[zt] = null, qt = Ot[--zt], Ot[zt] = null;
  }
  function Tf(e, t) {
    Ot[zt++] = qt, Ot[zt++] = Yt, Ot[zt++] = ga, qt = t.id, Yt = t.overflow, ga = e;
  }
  var We = null, _e = null, ge = !1, ha = null, Ut = !1, Qs = Error(o(519));
  function pa(e) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Tn(_t(t, e)), Qs;
  }
  function Af(e) {
    var t = e.stateNode, a = e.type, l = e.memoizedProps;
    switch (t[$e] = e, t[ot] = l, a) {
      case "dialog":
        fe("cancel", t), fe("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        fe("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Qn.length; a++)
          fe(Qn[a], t);
        break;
      case "source":
        fe("error", t);
        break;
      case "img":
      case "image":
      case "link":
        fe("error", t), fe("load", t);
        break;
      case "details":
        fe("toggle", t);
        break;
      case "input":
        fe("invalid", t), Lr(
          t,
          l.value,
          l.defaultValue,
          l.checked,
          l.defaultChecked,
          l.type,
          l.name,
          !0
        );
        break;
      case "select":
        fe("invalid", t);
        break;
      case "textarea":
        fe("invalid", t), xr(t, l.value, l.defaultValue, l.children);
    }
    a = l.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || l.suppressHydrationWarning === !0 || jm(t.textContent, a) ? (l.popover != null && (fe("beforetoggle", t), fe("toggle", t)), l.onScroll != null && fe("scroll", t), l.onScrollEnd != null && fe("scrollend", t), l.onClick != null && (t.onclick = Zt), t = !0) : t = !1, t || pa(e, !0);
  }
  function Ef(e) {
    for (We = e.return; We; )
      switch (We.tag) {
        case 5:
        case 31:
        case 13:
          Ut = !1;
          return;
        case 27:
        case 3:
          Ut = !0;
          return;
        default:
          We = We.return;
      }
  }
  function Rl(e) {
    if (e !== We) return !1;
    if (!ge) return Ef(e), ge = !0, !1;
    var t = e.tag, a;
    if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || oc(e.type, e.memoizedProps)), a = !a), a && _e && pa(e), Ef(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      _e = Im(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      _e = Im(e);
    } else
      t === 27 ? (t = _e, _a(e.type) ? (e = mc, mc = null, _e = e) : _e = t) : _e = We ? Ht(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ja() {
    _e = We = null, ge = !1;
  }
  function Vs() {
    var e = ha;
    return e !== null && (mt === null ? mt = e : mt.push.apply(
      mt,
      e
    ), ha = null), e;
  }
  function Tn(e) {
    ha === null ? ha = [e] : ha.push(e);
  }
  var Ks = b(null), Fa = null, $t = null;
  function ya(e, t, a) {
    H(Ks, t._currentValue), t._currentValue = a;
  }
  function Wt(e) {
    e._currentValue = Ks.current, U(Ks);
  }
  function Xs(e, t, a) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === a) break;
      e = e.return;
    }
  }
  function Zs(e, t, a, l) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var f = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var d = i;
          i = n;
          for (var p = 0; p < t.length; p++)
            if (d.context === t[p]) {
              i.lanes |= a, d = i.alternate, d !== null && (d.lanes |= a), Xs(
                i.return,
                a,
                e
              ), l || (f = null);
              break e;
            }
          i = d.next;
        }
      } else if (n.tag === 18) {
        if (f = n.return, f === null) throw Error(o(341));
        f.lanes |= a, i = f.alternate, i !== null && (i.lanes |= a), Xs(f, a, e), f = null;
      } else f = n.child;
      if (f !== null) f.return = n;
      else
        for (f = n; f !== null; ) {
          if (f === e) {
            f = null;
            break;
          }
          if (n = f.sibling, n !== null) {
            n.return = f.return, f = n;
            break;
          }
          f = f.return;
        }
      n = f;
    }
  }
  function Dl(e, t, a, l) {
    e = null;
    for (var n = t, i = !1; n !== null; ) {
      if (!i) {
        if ((n.flags & 524288) !== 0) i = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var f = n.alternate;
        if (f === null) throw Error(o(387));
        if (f = f.memoizedProps, f !== null) {
          var d = n.type;
          St(n.pendingProps.value, f.value) || (e !== null ? e.push(d) : e = [d]);
        }
      } else if (n === ue.current) {
        if (f = n.alternate, f === null) throw Error(o(387));
        f.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(In) : e = [In]);
      }
      n = n.return;
    }
    e !== null && Zs(
      t,
      e,
      a,
      l
    ), t.flags |= 262144;
  }
  function ji(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!St(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function $a(e) {
    Fa = e, $t = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function Pe(e) {
    return Mf(Fa, e);
  }
  function Gi(e, t) {
    return Fa === null && $a(e), Mf(e, t);
  }
  function Mf(e, t) {
    var a = t._currentValue;
    if (t = { context: t, memoizedValue: a, next: null }, $t === null) {
      if (e === null) throw Error(o(308));
      $t = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else $t = $t.next = t;
    return a;
  }
  var jp = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(a, l) {
        e.push(l);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(a) {
        return a();
      });
    };
  }, Gp = u.unstable_scheduleCallback, qp = u.unstable_NormalPriority, Qe = {
    $$typeof: $,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Is() {
    return {
      controller: new jp(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function An(e) {
    e.refCount--, e.refCount === 0 && Gp(qp, function() {
      e.controller.abort();
    });
  }
  var En = null, Js = 0, wl = 0, _l = null;
  function Yp(e, t) {
    if (En === null) {
      var a = En = [];
      Js = 0, wl = Po(), _l = {
        status: "pending",
        value: void 0,
        then: function(l) {
          a.push(l);
        }
      };
    }
    return Js++, t.then(Nf, Nf), t;
  }
  function Nf() {
    if (--Js === 0 && En !== null) {
      _l !== null && (_l.status = "fulfilled");
      var e = En;
      En = null, wl = 0, _l = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Qp(e, t) {
    var a = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        a.push(n);
      }
    };
    return e.then(
      function() {
        l.status = "fulfilled", l.value = t;
        for (var n = 0; n < a.length; n++) (0, a[n])(t);
      },
      function(n) {
        for (l.status = "rejected", l.reason = n, n = 0; n < a.length; n++)
          (0, a[n])(void 0);
      }
    ), l;
  }
  var Cf = w.S;
  w.S = function(e, t) {
    cm = yt(), typeof t == "object" && t !== null && typeof t.then == "function" && Yp(e, t), Cf !== null && Cf(e, t);
  };
  var Wa = b(null);
  function Fs() {
    var e = Wa.current;
    return e !== null ? e : De.pooledCache;
  }
  function qi(e, t) {
    t === null ? H(Wa, Wa.current) : H(Wa, t.pool);
  }
  function Rf() {
    var e = Fs();
    return e === null ? null : { parent: Qe._currentValue, pool: e };
  }
  var Ol = Error(o(460)), $s = Error(o(474)), Yi = Error(o(542)), Qi = { then: function() {
  } };
  function Df(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function wf(e, t, a) {
    switch (a = e[a], a === void 0 ? e.push(t) : a !== t && (t.then(Zt, Zt), t = a), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Of(e), e;
      default:
        if (typeof t.status == "string") t.then(Zt, Zt);
        else {
          if (e = De, e !== null && 100 < e.shellSuspendCounter)
            throw Error(o(482));
          e = t, e.status = "pending", e.then(
            function(l) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = l;
              }
            },
            function(l) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = l;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, Of(e), e;
        }
        throw el = t, Ol;
    }
  }
  function Pa(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (a) {
      throw a !== null && typeof a == "object" && typeof a.then == "function" ? (el = a, Ol) : a;
    }
  }
  var el = null;
  function _f() {
    if (el === null) throw Error(o(459));
    var e = el;
    return el = null, e;
  }
  function Of(e) {
    if (e === Ol || e === Yi)
      throw Error(o(483));
  }
  var zl = null, Mn = 0;
  function Vi(e) {
    var t = Mn;
    return Mn += 1, zl === null && (zl = []), wf(zl, e, t);
  }
  function Nn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Ki(e, t) {
    throw t.$$typeof === L ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function zf(e) {
    function t(T, v) {
      if (e) {
        var E = T.deletions;
        E === null ? (T.deletions = [v], T.flags |= 16) : E.push(v);
      }
    }
    function a(T, v) {
      if (!e) return null;
      for (; v !== null; )
        t(T, v), v = v.sibling;
      return null;
    }
    function l(T) {
      for (var v = /* @__PURE__ */ new Map(); T !== null; )
        T.key !== null ? v.set(T.key, T) : v.set(T.index, T), T = T.sibling;
      return v;
    }
    function n(T, v) {
      return T = Jt(T, v), T.index = 0, T.sibling = null, T;
    }
    function i(T, v, E) {
      return T.index = E, e ? (E = T.alternate, E !== null ? (E = E.index, E < v ? (T.flags |= 67108866, v) : E) : (T.flags |= 67108866, v)) : (T.flags |= 1048576, v);
    }
    function f(T) {
      return e && T.alternate === null && (T.flags |= 67108866), T;
    }
    function d(T, v, E, O) {
      return v === null || v.tag !== 6 ? (v = js(E, T.mode, O), v.return = T, v) : (v = n(v, E), v.return = T, v);
    }
    function p(T, v, E, O) {
      var F = E.type;
      return F === K ? _(
        T,
        v,
        E.props.children,
        O,
        E.key
      ) : v !== null && (v.elementType === F || typeof F == "object" && F !== null && F.$$typeof === ne && Pa(F) === v.type) ? (v = n(v, E.props), Nn(v, E), v.return = T, v) : (v = Bi(
        E.type,
        E.key,
        E.props,
        null,
        T.mode,
        O
      ), Nn(v, E), v.return = T, v);
    }
    function M(T, v, E, O) {
      return v === null || v.tag !== 4 || v.stateNode.containerInfo !== E.containerInfo || v.stateNode.implementation !== E.implementation ? (v = Gs(E, T.mode, O), v.return = T, v) : (v = n(v, E.children || []), v.return = T, v);
    }
    function _(T, v, E, O, F) {
      return v === null || v.tag !== 7 ? (v = Ia(
        E,
        T.mode,
        O,
        F
      ), v.return = T, v) : (v = n(v, E), v.return = T, v);
    }
    function z(T, v, E) {
      if (typeof v == "string" && v !== "" || typeof v == "number" || typeof v == "bigint")
        return v = js(
          "" + v,
          T.mode,
          E
        ), v.return = T, v;
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case B:
            return E = Bi(
              v.type,
              v.key,
              v.props,
              null,
              T.mode,
              E
            ), Nn(E, v), E.return = T, E;
          case q:
            return v = Gs(
              v,
              T.mode,
              E
            ), v.return = T, v;
          case ne:
            return v = Pa(v), z(T, v, E);
        }
        if (Ye(v) || I(v))
          return v = Ia(
            v,
            T.mode,
            E,
            null
          ), v.return = T, v;
        if (typeof v.then == "function")
          return z(T, Vi(v), E);
        if (v.$$typeof === $)
          return z(
            T,
            Gi(T, v),
            E
          );
        Ki(T, v);
      }
      return null;
    }
    function N(T, v, E, O) {
      var F = v !== null ? v.key : null;
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return F !== null ? null : d(T, v, "" + E, O);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case B:
            return E.key === F ? p(T, v, E, O) : null;
          case q:
            return E.key === F ? M(T, v, E, O) : null;
          case ne:
            return E = Pa(E), N(T, v, E, O);
        }
        if (Ye(E) || I(E))
          return F !== null ? null : _(T, v, E, O, null);
        if (typeof E.then == "function")
          return N(
            T,
            v,
            Vi(E),
            O
          );
        if (E.$$typeof === $)
          return N(
            T,
            v,
            Gi(T, E),
            O
          );
        Ki(T, E);
      }
      return null;
    }
    function R(T, v, E, O, F) {
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return T = T.get(E) || null, d(v, T, "" + O, F);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case B:
            return T = T.get(
              O.key === null ? E : O.key
            ) || null, p(v, T, O, F);
          case q:
            return T = T.get(
              O.key === null ? E : O.key
            ) || null, M(v, T, O, F);
          case ne:
            return O = Pa(O), R(
              T,
              v,
              E,
              O,
              F
            );
        }
        if (Ye(O) || I(O))
          return T = T.get(E) || null, _(v, T, O, F, null);
        if (typeof O.then == "function")
          return R(
            T,
            v,
            E,
            Vi(O),
            F
          );
        if (O.$$typeof === $)
          return R(
            T,
            v,
            E,
            Gi(v, O),
            F
          );
        Ki(v, O);
      }
      return null;
    }
    function V(T, v, E, O) {
      for (var F = null, pe = null, X = v, ce = v = 0, me = null; X !== null && ce < E.length; ce++) {
        X.index > ce ? (me = X, X = null) : me = X.sibling;
        var ye = N(
          T,
          X,
          E[ce],
          O
        );
        if (ye === null) {
          X === null && (X = me);
          break;
        }
        e && X && ye.alternate === null && t(T, X), v = i(ye, v, ce), pe === null ? F = ye : pe.sibling = ye, pe = ye, X = me;
      }
      if (ce === E.length)
        return a(T, X), ge && Ft(T, ce), F;
      if (X === null) {
        for (; ce < E.length; ce++)
          X = z(T, E[ce], O), X !== null && (v = i(
            X,
            v,
            ce
          ), pe === null ? F = X : pe.sibling = X, pe = X);
        return ge && Ft(T, ce), F;
      }
      for (X = l(X); ce < E.length; ce++)
        me = R(
          X,
          T,
          ce,
          E[ce],
          O
        ), me !== null && (e && me.alternate !== null && X.delete(
          me.key === null ? ce : me.key
        ), v = i(
          me,
          v,
          ce
        ), pe === null ? F = me : pe.sibling = me, pe = me);
      return e && X.forEach(function(Ha) {
        return t(T, Ha);
      }), ge && Ft(T, ce), F;
    }
    function ee(T, v, E, O) {
      if (E == null) throw Error(o(151));
      for (var F = null, pe = null, X = v, ce = v = 0, me = null, ye = E.next(); X !== null && !ye.done; ce++, ye = E.next()) {
        X.index > ce ? (me = X, X = null) : me = X.sibling;
        var Ha = N(T, X, ye.value, O);
        if (Ha === null) {
          X === null && (X = me);
          break;
        }
        e && X && Ha.alternate === null && t(T, X), v = i(Ha, v, ce), pe === null ? F = Ha : pe.sibling = Ha, pe = Ha, X = me;
      }
      if (ye.done)
        return a(T, X), ge && Ft(T, ce), F;
      if (X === null) {
        for (; !ye.done; ce++, ye = E.next())
          ye = z(T, ye.value, O), ye !== null && (v = i(ye, v, ce), pe === null ? F = ye : pe.sibling = ye, pe = ye);
        return ge && Ft(T, ce), F;
      }
      for (X = l(X); !ye.done; ce++, ye = E.next())
        ye = R(X, T, ce, ye.value, O), ye !== null && (e && ye.alternate !== null && X.delete(ye.key === null ? ce : ye.key), v = i(ye, v, ce), pe === null ? F = ye : pe.sibling = ye, pe = ye);
      return e && X.forEach(function(e0) {
        return t(T, e0);
      }), ge && Ft(T, ce), F;
    }
    function Re(T, v, E, O) {
      if (typeof E == "object" && E !== null && E.type === K && E.key === null && (E = E.props.children), typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case B:
            e: {
              for (var F = E.key; v !== null; ) {
                if (v.key === F) {
                  if (F = E.type, F === K) {
                    if (v.tag === 7) {
                      a(
                        T,
                        v.sibling
                      ), O = n(
                        v,
                        E.props.children
                      ), O.return = T, T = O;
                      break e;
                    }
                  } else if (v.elementType === F || typeof F == "object" && F !== null && F.$$typeof === ne && Pa(F) === v.type) {
                    a(
                      T,
                      v.sibling
                    ), O = n(v, E.props), Nn(O, E), O.return = T, T = O;
                    break e;
                  }
                  a(T, v);
                  break;
                } else t(T, v);
                v = v.sibling;
              }
              E.type === K ? (O = Ia(
                E.props.children,
                T.mode,
                O,
                E.key
              ), O.return = T, T = O) : (O = Bi(
                E.type,
                E.key,
                E.props,
                null,
                T.mode,
                O
              ), Nn(O, E), O.return = T, T = O);
            }
            return f(T);
          case q:
            e: {
              for (F = E.key; v !== null; ) {
                if (v.key === F)
                  if (v.tag === 4 && v.stateNode.containerInfo === E.containerInfo && v.stateNode.implementation === E.implementation) {
                    a(
                      T,
                      v.sibling
                    ), O = n(v, E.children || []), O.return = T, T = O;
                    break e;
                  } else {
                    a(T, v);
                    break;
                  }
                else t(T, v);
                v = v.sibling;
              }
              O = Gs(E, T.mode, O), O.return = T, T = O;
            }
            return f(T);
          case ne:
            return E = Pa(E), Re(
              T,
              v,
              E,
              O
            );
        }
        if (Ye(E))
          return V(
            T,
            v,
            E,
            O
          );
        if (I(E)) {
          if (F = I(E), typeof F != "function") throw Error(o(150));
          return E = F.call(E), ee(
            T,
            v,
            E,
            O
          );
        }
        if (typeof E.then == "function")
          return Re(
            T,
            v,
            Vi(E),
            O
          );
        if (E.$$typeof === $)
          return Re(
            T,
            v,
            Gi(T, E),
            O
          );
        Ki(T, E);
      }
      return typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint" ? (E = "" + E, v !== null && v.tag === 6 ? (a(T, v.sibling), O = n(v, E), O.return = T, T = O) : (a(T, v), O = js(E, T.mode, O), O.return = T, T = O), f(T)) : a(T, v);
    }
    return function(T, v, E, O) {
      try {
        Mn = 0;
        var F = Re(
          T,
          v,
          E,
          O
        );
        return zl = null, F;
      } catch (X) {
        if (X === Ol || X === Yi) throw X;
        var pe = Tt(29, X, null, T.mode);
        return pe.lanes = O, pe.return = T, pe;
      } finally {
      }
    };
  }
  var tl = zf(!0), Uf = zf(!1), va = !1;
  function Ws(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Ps(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ba(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Sa(e, t, a) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (Se & 2) !== 0) {
      var n = l.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), l.pending = t, t = xi(e), pf(e, null, a), t;
    }
    return Hi(e, l, t, a), xi(e);
  }
  function Cn(e, t, a) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, a |= l, t.lanes = a, Er(e, a);
    }
  }
  function eo(e, t) {
    var a = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, a === l)) {
      var n = null, i = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var f = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          i === null ? n = i = f : i = i.next = f, a = a.next;
        } while (a !== null);
        i === null ? n = i = t : i = i.next = t;
      } else n = i = t;
      a = {
        baseState: l.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: i,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = a;
      return;
    }
    e = a.lastBaseUpdate, e === null ? a.firstBaseUpdate = t : e.next = t, a.lastBaseUpdate = t;
  }
  var to = !1;
  function Rn() {
    if (to) {
      var e = _l;
      if (e !== null) throw e;
    }
  }
  function Dn(e, t, a, l) {
    to = !1;
    var n = e.updateQueue;
    va = !1;
    var i = n.firstBaseUpdate, f = n.lastBaseUpdate, d = n.shared.pending;
    if (d !== null) {
      n.shared.pending = null;
      var p = d, M = p.next;
      p.next = null, f === null ? i = M : f.next = M, f = p;
      var _ = e.alternate;
      _ !== null && (_ = _.updateQueue, d = _.lastBaseUpdate, d !== f && (d === null ? _.firstBaseUpdate = M : d.next = M, _.lastBaseUpdate = p));
    }
    if (i !== null) {
      var z = n.baseState;
      f = 0, _ = M = p = null, d = i;
      do {
        var N = d.lane & -536870913, R = N !== d.lane;
        if (R ? (de & N) === N : (l & N) === N) {
          N !== 0 && N === wl && (to = !0), _ !== null && (_ = _.next = {
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: null,
            next: null
          });
          e: {
            var V = e, ee = d;
            N = t;
            var Re = a;
            switch (ee.tag) {
              case 1:
                if (V = ee.payload, typeof V == "function") {
                  z = V.call(Re, z, N);
                  break e;
                }
                z = V;
                break e;
              case 3:
                V.flags = V.flags & -65537 | 128;
              case 0:
                if (V = ee.payload, N = typeof V == "function" ? V.call(Re, z, N) : V, N == null) break e;
                z = C({}, z, N);
                break e;
              case 2:
                va = !0;
            }
          }
          N = d.callback, N !== null && (e.flags |= 64, R && (e.flags |= 8192), R = n.callbacks, R === null ? n.callbacks = [N] : R.push(N));
        } else
          R = {
            lane: N,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          }, _ === null ? (M = _ = R, p = z) : _ = _.next = R, f |= N;
        if (d = d.next, d === null) {
          if (d = n.shared.pending, d === null)
            break;
          R = d, d = R.next, R.next = null, n.lastBaseUpdate = R, n.shared.pending = null;
        }
      } while (!0);
      _ === null && (p = z), n.baseState = p, n.firstBaseUpdate = M, n.lastBaseUpdate = _, i === null && (n.shared.lanes = 0), Na |= f, e.lanes = f, e.memoizedState = z;
    }
  }
  function Lf(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Hf(e, t) {
    var a = e.callbacks;
    if (a !== null)
      for (e.callbacks = null, e = 0; e < a.length; e++)
        Lf(a[e], t);
  }
  var Ul = b(null), Xi = b(0);
  function xf(e, t) {
    e = sa, H(Xi, e), H(Ul, t), sa = e | t.baseLanes;
  }
  function ao() {
    H(Xi, sa), H(Ul, Ul.current);
  }
  function lo() {
    sa = Xi.current, U(Ul), U(Xi);
  }
  var At = b(null), Lt = null;
  function Ta(e) {
    var t = e.alternate;
    H(Ge, Ge.current & 1), H(At, e), Lt === null && (t === null || Ul.current !== null || t.memoizedState !== null) && (Lt = e);
  }
  function no(e) {
    H(Ge, Ge.current), H(At, e), Lt === null && (Lt = e);
  }
  function Bf(e) {
    e.tag === 22 ? (H(Ge, Ge.current), H(At, e), Lt === null && (Lt = e)) : Aa();
  }
  function Aa() {
    H(Ge, Ge.current), H(At, At.current);
  }
  function Et(e) {
    U(At), Lt === e && (Lt = null), U(Ge);
  }
  var Ge = b(0);
  function Zi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || fc(a) || dc(a)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Pt = 0, se = null, Ne = null, Ve = null, Ii = !1, Ll = !1, al = !1, Ji = 0, wn = 0, Hl = null, Vp = 0;
  function xe() {
    throw Error(o(321));
  }
  function io(e, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < e.length; a++)
      if (!St(e[a], t[a])) return !1;
    return !0;
  }
  function uo(e, t, a, l, n, i) {
    return Pt = i, se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, w.H = e === null || e.memoizedState === null ? Sd : Ao, al = !1, i = a(l, n), al = !1, Ll && (i = jf(
      t,
      a,
      l,
      n
    )), kf(e), i;
  }
  function kf(e) {
    w.H = zn;
    var t = Ne !== null && Ne.next !== null;
    if (Pt = 0, Ve = Ne = se = null, Ii = !1, wn = 0, Hl = null, t) throw Error(o(300));
    e === null || Ke || (e = e.dependencies, e !== null && ji(e) && (Ke = !0));
  }
  function jf(e, t, a, l) {
    se = e;
    var n = 0;
    do {
      if (Ll && (Hl = null), wn = 0, Ll = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Ve = Ne = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      w.H = Td, i = t(a, l);
    } while (Ll);
    return i;
  }
  function Kp() {
    var e = w.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? _n(t) : t, e = e.useState()[0], (Ne !== null ? Ne.memoizedState : null) !== e && (se.flags |= 1024), t;
  }
  function so() {
    var e = Ji !== 0;
    return Ji = 0, e;
  }
  function oo(e, t, a) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a;
  }
  function co(e) {
    if (Ii) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Ii = !1;
    }
    Pt = 0, Ve = Ne = se = null, Ll = !1, wn = Ji = 0, Hl = null;
  }
  function st() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ve === null ? se.memoizedState = Ve = e : Ve = Ve.next = e, Ve;
  }
  function qe() {
    if (Ne === null) {
      var e = se.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ne.next;
    var t = Ve === null ? se.memoizedState : Ve.next;
    if (t !== null)
      Ve = t, Ne = e;
    else {
      if (e === null)
        throw se.alternate === null ? Error(o(467)) : Error(o(310));
      Ne = e, e = {
        memoizedState: Ne.memoizedState,
        baseState: Ne.baseState,
        baseQueue: Ne.baseQueue,
        queue: Ne.queue,
        next: null
      }, Ve === null ? se.memoizedState = Ve = e : Ve = Ve.next = e;
    }
    return Ve;
  }
  function Fi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function _n(e) {
    var t = wn;
    return wn += 1, Hl === null && (Hl = []), e = wf(Hl, e, t), t = se, (Ve === null ? t.memoizedState : Ve.next) === null && (t = t.alternate, w.H = t === null || t.memoizedState === null ? Sd : Ao), e;
  }
  function $i(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return _n(e);
      if (e.$$typeof === $) return Pe(e);
    }
    throw Error(o(438, String(e)));
  }
  function ro(e) {
    var t = null, a = se.updateQueue;
    if (a !== null && (t = a.memoCache), t == null) {
      var l = se.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), a === null && (a = Fi(), se.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0)
      for (a = t.data[t.index] = Array(e), l = 0; l < e; l++)
        a[l] = ve;
    return t.index++, a;
  }
  function ea(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Wi(e) {
    var t = qe();
    return fo(t, Ne, e);
  }
  function fo(e, t, a) {
    var l = e.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = a;
    var n = e.baseQueue, i = l.pending;
    if (i !== null) {
      if (n !== null) {
        var f = n.next;
        n.next = i.next, i.next = f;
      }
      t.baseQueue = n = i, l.pending = null;
    }
    if (i = e.baseState, n === null) e.memoizedState = i;
    else {
      t = n.next;
      var d = f = null, p = null, M = t, _ = !1;
      do {
        var z = M.lane & -536870913;
        if (z !== M.lane ? (de & z) === z : (Pt & z) === z) {
          var N = M.revertLane;
          if (N === 0)
            p !== null && (p = p.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: M.action,
              hasEagerState: M.hasEagerState,
              eagerState: M.eagerState,
              next: null
            }), z === wl && (_ = !0);
          else if ((Pt & N) === N) {
            M = M.next, N === wl && (_ = !0);
            continue;
          } else
            z = {
              lane: 0,
              revertLane: M.revertLane,
              gesture: null,
              action: M.action,
              hasEagerState: M.hasEagerState,
              eagerState: M.eagerState,
              next: null
            }, p === null ? (d = p = z, f = i) : p = p.next = z, se.lanes |= N, Na |= N;
          z = M.action, al && a(i, z), i = M.hasEagerState ? M.eagerState : a(i, z);
        } else
          N = {
            lane: z,
            revertLane: M.revertLane,
            gesture: M.gesture,
            action: M.action,
            hasEagerState: M.hasEagerState,
            eagerState: M.eagerState,
            next: null
          }, p === null ? (d = p = N, f = i) : p = p.next = N, se.lanes |= z, Na |= z;
        M = M.next;
      } while (M !== null && M !== t);
      if (p === null ? f = i : p.next = d, !St(i, e.memoizedState) && (Ke = !0, _ && (a = _l, a !== null)))
        throw a;
      e.memoizedState = i, e.baseState = f, e.baseQueue = p, l.lastRenderedState = i;
    }
    return n === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function mo(e) {
    var t = qe(), a = t.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = e;
    var l = a.dispatch, n = a.pending, i = t.memoizedState;
    if (n !== null) {
      a.pending = null;
      var f = n = n.next;
      do
        i = e(i, f.action), f = f.next;
      while (f !== n);
      St(i, t.memoizedState) || (Ke = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), a.lastRenderedState = i;
    }
    return [i, l];
  }
  function Gf(e, t, a) {
    var l = se, n = qe(), i = ge;
    if (i) {
      if (a === void 0) throw Error(o(407));
      a = a();
    } else a = t();
    var f = !St(
      (Ne || n).memoizedState,
      a
    );
    if (f && (n.memoizedState = a, Ke = !0), n = n.queue, po(Qf.bind(null, l, n, e), [
      e
    ]), n.getSnapshot !== t || f || Ve !== null && Ve.memoizedState.tag & 1) {
      if (l.flags |= 2048, xl(
        9,
        { destroy: void 0 },
        Yf.bind(
          null,
          l,
          n,
          a,
          t
        ),
        null
      ), De === null) throw Error(o(349));
      i || (Pt & 127) !== 0 || qf(l, t, a);
    }
    return a;
  }
  function qf(e, t, a) {
    e.flags |= 16384, e = { getSnapshot: t, value: a }, t = se.updateQueue, t === null ? (t = Fi(), se.updateQueue = t, t.stores = [e]) : (a = t.stores, a === null ? t.stores = [e] : a.push(e));
  }
  function Yf(e, t, a, l) {
    t.value = a, t.getSnapshot = l, Vf(t) && Kf(e);
  }
  function Qf(e, t, a) {
    return a(function() {
      Vf(t) && Kf(e);
    });
  }
  function Vf(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var a = t();
      return !St(e, a);
    } catch {
      return !0;
    }
  }
  function Kf(e) {
    var t = Za(e, 2);
    t !== null && gt(t, e, 2);
  }
  function go(e) {
    var t = st();
    if (typeof e == "function") {
      var a = e;
      if (e = a(), al) {
        fa(!0);
        try {
          a();
        } finally {
          fa(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ea,
      lastRenderedState: e
    }, t;
  }
  function Xf(e, t, a, l) {
    return e.baseState = a, fo(
      e,
      Ne,
      typeof l == "function" ? l : ea
    );
  }
  function Xp(e, t, a, l, n) {
    if (tu(e)) throw Error(o(485));
    if (e = t.action, e !== null) {
      var i = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(f) {
          i.listeners.push(f);
        }
      };
      w.T !== null ? a(!0) : i.isTransition = !1, l(i), a = t.pending, a === null ? (i.next = t.pending = i, Zf(t, i)) : (i.next = a.next, t.pending = a.next = i);
    }
  }
  function Zf(e, t) {
    var a = t.action, l = t.payload, n = e.state;
    if (t.isTransition) {
      var i = w.T, f = {};
      w.T = f;
      try {
        var d = a(n, l), p = w.S;
        p !== null && p(f, d), If(e, t, d);
      } catch (M) {
        ho(e, t, M);
      } finally {
        i !== null && f.types !== null && (i.types = f.types), w.T = i;
      }
    } else
      try {
        i = a(n, l), If(e, t, i);
      } catch (M) {
        ho(e, t, M);
      }
  }
  function If(e, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(
      function(l) {
        Jf(e, t, l);
      },
      function(l) {
        return ho(e, t, l);
      }
    ) : Jf(e, t, a);
  }
  function Jf(e, t, a) {
    t.status = "fulfilled", t.value = a, Ff(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, Zf(e, a)));
  }
  function ho(e, t, a) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = a, Ff(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function Ff(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function $f(e, t) {
    return t;
  }
  function Wf(e, t) {
    if (ge) {
      var a = De.formState;
      if (a !== null) {
        e: {
          var l = se;
          if (ge) {
            if (_e) {
              t: {
                for (var n = _e, i = Ut; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = Ht(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                _e = Ht(
                  n.nextSibling
                ), l = n.data === "F!";
                break e;
              }
            }
            pa(l);
          }
          l = !1;
        }
        l && (t = a[0]);
      }
    }
    return a = st(), a.memoizedState = a.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: $f,
      lastRenderedState: t
    }, a.queue = l, a = yd.bind(
      null,
      se,
      l
    ), l.dispatch = a, l = go(!1), i = To.bind(
      null,
      se,
      !1,
      l.queue
    ), l = st(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = n, a = Xp.bind(
      null,
      se,
      n,
      i,
      a
    ), n.dispatch = a, l.memoizedState = e, [t, a, !1];
  }
  function Pf(e) {
    var t = qe();
    return ed(t, Ne, e);
  }
  function ed(e, t, a) {
    if (t = fo(
      e,
      t,
      $f
    )[0], e = Wi(ea)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = _n(t);
      } catch (f) {
        throw f === Ol ? Yi : f;
      }
    else l = t;
    t = qe();
    var n = t.queue, i = n.dispatch;
    return a !== t.memoizedState && (se.flags |= 2048, xl(
      9,
      { destroy: void 0 },
      Zp.bind(null, n, a),
      null
    )), [l, i, e];
  }
  function Zp(e, t) {
    e.action = t;
  }
  function td(e) {
    var t = qe(), a = Ne;
    if (a !== null)
      return ed(t, a, e);
    qe(), t = t.memoizedState, a = qe();
    var l = a.queue.dispatch;
    return a.memoizedState = e, [t, l, !1];
  }
  function xl(e, t, a, l) {
    return e = { tag: e, create: a, deps: l, inst: t, next: null }, t = se.updateQueue, t === null && (t = Fi(), se.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (l = a.next, a.next = e, e.next = l, t.lastEffect = e), e;
  }
  function ad() {
    return qe().memoizedState;
  }
  function Pi(e, t, a, l) {
    var n = st();
    se.flags |= e, n.memoizedState = xl(
      1 | t,
      { destroy: void 0 },
      a,
      l === void 0 ? null : l
    );
  }
  function eu(e, t, a, l) {
    var n = qe();
    l = l === void 0 ? null : l;
    var i = n.memoizedState.inst;
    Ne !== null && l !== null && io(l, Ne.memoizedState.deps) ? n.memoizedState = xl(t, i, a, l) : (se.flags |= e, n.memoizedState = xl(
      1 | t,
      i,
      a,
      l
    ));
  }
  function ld(e, t) {
    Pi(8390656, 8, e, t);
  }
  function po(e, t) {
    eu(2048, 8, e, t);
  }
  function Ip(e) {
    se.flags |= 4;
    var t = se.updateQueue;
    if (t === null)
      t = Fi(), se.updateQueue = t, t.events = [e];
    else {
      var a = t.events;
      a === null ? t.events = [e] : a.push(e);
    }
  }
  function nd(e) {
    var t = qe().memoizedState;
    return Ip({ ref: t, nextImpl: e }), function() {
      if ((Se & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function id(e, t) {
    return eu(4, 2, e, t);
  }
  function ud(e, t) {
    return eu(4, 4, e, t);
  }
  function sd(e, t) {
    if (typeof t == "function") {
      e = e();
      var a = t(e);
      return function() {
        typeof a == "function" ? a() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function od(e, t, a) {
    a = a != null ? a.concat([e]) : null, eu(4, 4, sd.bind(null, t, e), a);
  }
  function yo() {
  }
  function cd(e, t) {
    var a = qe();
    t = t === void 0 ? null : t;
    var l = a.memoizedState;
    return t !== null && io(t, l[1]) ? l[0] : (a.memoizedState = [e, t], e);
  }
  function rd(e, t) {
    var a = qe();
    t = t === void 0 ? null : t;
    var l = a.memoizedState;
    if (t !== null && io(t, l[1]))
      return l[0];
    if (l = e(), al) {
      fa(!0);
      try {
        e();
      } finally {
        fa(!1);
      }
    }
    return a.memoizedState = [l, t], l;
  }
  function vo(e, t, a) {
    return a === void 0 || (Pt & 1073741824) !== 0 && (de & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = fm(), se.lanes |= e, Na |= e, a);
  }
  function fd(e, t, a, l) {
    return St(a, t) ? a : Ul.current !== null ? (e = vo(e, a, l), St(e, t) || (Ke = !0), e) : (Pt & 42) === 0 || (Pt & 1073741824) !== 0 && (de & 261930) === 0 ? (Ke = !0, e.memoizedState = a) : (e = fm(), se.lanes |= e, Na |= e, t);
  }
  function dd(e, t, a, l, n) {
    var i = k.p;
    k.p = i !== 0 && 8 > i ? i : 8;
    var f = w.T, d = {};
    w.T = d, To(e, !1, t, a);
    try {
      var p = n(), M = w.S;
      if (M !== null && M(d, p), p !== null && typeof p == "object" && typeof p.then == "function") {
        var _ = Qp(
          p,
          l
        );
        On(
          e,
          t,
          _,
          Ct(e)
        );
      } else
        On(
          e,
          t,
          l,
          Ct(e)
        );
    } catch (z) {
      On(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: z },
        Ct()
      );
    } finally {
      k.p = i, f !== null && d.types !== null && (f.types = d.types), w.T = f;
    }
  }
  function Jp() {
  }
  function bo(e, t, a, l) {
    if (e.tag !== 5) throw Error(o(476));
    var n = md(e).queue;
    dd(
      e,
      n,
      t,
      P,
      a === null ? Jp : function() {
        return gd(e), a(l);
      }
    );
  }
  function md(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: P,
      baseState: P,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ea,
        lastRenderedState: P
      },
      next: null
    };
    var a = {};
    return t.next = {
      memoizedState: a,
      baseState: a,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ea,
        lastRenderedState: a
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function gd(e) {
    var t = md(e);
    t.next === null && (t = e.alternate.memoizedState), On(
      e,
      t.next.queue,
      {},
      Ct()
    );
  }
  function So() {
    return Pe(In);
  }
  function hd() {
    return qe().memoizedState;
  }
  function pd() {
    return qe().memoizedState;
  }
  function Fp(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = Ct();
          e = ba(a);
          var l = Sa(t, e, a);
          l !== null && (gt(l, t, a), Cn(l, t, a)), t = { cache: Is() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function $p(e, t, a) {
    var l = Ct();
    a = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, tu(e) ? vd(t, a) : (a = Bs(e, t, a, l), a !== null && (gt(a, e, l), bd(a, t, l)));
  }
  function yd(e, t, a) {
    var l = Ct();
    On(e, t, a, l);
  }
  function On(e, t, a, l) {
    var n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (tu(e)) vd(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var f = t.lastRenderedState, d = i(f, a);
          if (n.hasEagerState = !0, n.eagerState = d, St(d, f))
            return Hi(e, t, n, 0), De === null && Li(), !1;
        } catch {
        } finally {
        }
      if (a = Bs(e, t, n, l), a !== null)
        return gt(a, e, l), bd(a, t, l), !0;
    }
    return !1;
  }
  function To(e, t, a, l) {
    if (l = {
      lane: 2,
      revertLane: Po(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, tu(e)) {
      if (t) throw Error(o(479));
    } else
      t = Bs(
        e,
        a,
        l,
        2
      ), t !== null && gt(t, e, 2);
  }
  function tu(e) {
    var t = e.alternate;
    return e === se || t !== null && t === se;
  }
  function vd(e, t) {
    Ll = Ii = !0;
    var a = e.pending;
    a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
  }
  function bd(e, t, a) {
    if ((a & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, a |= l, t.lanes = a, Er(e, a);
    }
  }
  var zn = {
    readContext: Pe,
    use: $i,
    useCallback: xe,
    useContext: xe,
    useEffect: xe,
    useImperativeHandle: xe,
    useLayoutEffect: xe,
    useInsertionEffect: xe,
    useMemo: xe,
    useReducer: xe,
    useRef: xe,
    useState: xe,
    useDebugValue: xe,
    useDeferredValue: xe,
    useTransition: xe,
    useSyncExternalStore: xe,
    useId: xe,
    useHostTransitionStatus: xe,
    useFormState: xe,
    useActionState: xe,
    useOptimistic: xe,
    useMemoCache: xe,
    useCacheRefresh: xe
  };
  zn.useEffectEvent = xe;
  var Sd = {
    readContext: Pe,
    use: $i,
    useCallback: function(e, t) {
      return st().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: Pe,
    useEffect: ld,
    useImperativeHandle: function(e, t, a) {
      a = a != null ? a.concat([e]) : null, Pi(
        4194308,
        4,
        sd.bind(null, t, e),
        a
      );
    },
    useLayoutEffect: function(e, t) {
      return Pi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Pi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var a = st();
      t = t === void 0 ? null : t;
      var l = e();
      if (al) {
        fa(!0);
        try {
          e();
        } finally {
          fa(!1);
        }
      }
      return a.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, a) {
      var l = st();
      if (a !== void 0) {
        var n = a(t);
        if (al) {
          fa(!0);
          try {
            a(t);
          } finally {
            fa(!1);
          }
        }
      } else n = t;
      return l.memoizedState = l.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, l.queue = e, e = e.dispatch = $p.bind(
        null,
        se,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = st();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = go(e);
      var t = e.queue, a = yd.bind(null, se, t);
      return t.dispatch = a, [e.memoizedState, a];
    },
    useDebugValue: yo,
    useDeferredValue: function(e, t) {
      var a = st();
      return vo(a, e, t);
    },
    useTransition: function() {
      var e = go(!1);
      return e = dd.bind(
        null,
        se,
        e.queue,
        !0,
        !1
      ), st().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, a) {
      var l = se, n = st();
      if (ge) {
        if (a === void 0)
          throw Error(o(407));
        a = a();
      } else {
        if (a = t(), De === null)
          throw Error(o(349));
        (de & 127) !== 0 || qf(l, t, a);
      }
      n.memoizedState = a;
      var i = { value: a, getSnapshot: t };
      return n.queue = i, ld(Qf.bind(null, l, i, e), [
        e
      ]), l.flags |= 2048, xl(
        9,
        { destroy: void 0 },
        Yf.bind(
          null,
          l,
          i,
          a,
          t
        ),
        null
      ), a;
    },
    useId: function() {
      var e = st(), t = De.identifierPrefix;
      if (ge) {
        var a = Yt, l = qt;
        a = (l & ~(1 << 32 - bt(l) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = Ji++, 0 < a && (t += "H" + a.toString(32)), t += "_";
      } else
        a = Vp++, t = "_" + t + "r_" + a.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: So,
    useFormState: Wf,
    useActionState: Wf,
    useOptimistic: function(e) {
      var t = st();
      t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = a, t = To.bind(
        null,
        se,
        !0,
        a
      ), a.dispatch = t, [e, t];
    },
    useMemoCache: ro,
    useCacheRefresh: function() {
      return st().memoizedState = Fp.bind(
        null,
        se
      );
    },
    useEffectEvent: function(e) {
      var t = st(), a = { impl: e };
      return t.memoizedState = a, function() {
        if ((Se & 2) !== 0)
          throw Error(o(440));
        return a.impl.apply(void 0, arguments);
      };
    }
  }, Ao = {
    readContext: Pe,
    use: $i,
    useCallback: cd,
    useContext: Pe,
    useEffect: po,
    useImperativeHandle: od,
    useInsertionEffect: id,
    useLayoutEffect: ud,
    useMemo: rd,
    useReducer: Wi,
    useRef: ad,
    useState: function() {
      return Wi(ea);
    },
    useDebugValue: yo,
    useDeferredValue: function(e, t) {
      var a = qe();
      return fd(
        a,
        Ne.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Wi(ea)[0], t = qe().memoizedState;
      return [
        typeof e == "boolean" ? e : _n(e),
        t
      ];
    },
    useSyncExternalStore: Gf,
    useId: hd,
    useHostTransitionStatus: So,
    useFormState: Pf,
    useActionState: Pf,
    useOptimistic: function(e, t) {
      var a = qe();
      return Xf(a, Ne, e, t);
    },
    useMemoCache: ro,
    useCacheRefresh: pd
  };
  Ao.useEffectEvent = nd;
  var Td = {
    readContext: Pe,
    use: $i,
    useCallback: cd,
    useContext: Pe,
    useEffect: po,
    useImperativeHandle: od,
    useInsertionEffect: id,
    useLayoutEffect: ud,
    useMemo: rd,
    useReducer: mo,
    useRef: ad,
    useState: function() {
      return mo(ea);
    },
    useDebugValue: yo,
    useDeferredValue: function(e, t) {
      var a = qe();
      return Ne === null ? vo(a, e, t) : fd(
        a,
        Ne.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = mo(ea)[0], t = qe().memoizedState;
      return [
        typeof e == "boolean" ? e : _n(e),
        t
      ];
    },
    useSyncExternalStore: Gf,
    useId: hd,
    useHostTransitionStatus: So,
    useFormState: td,
    useActionState: td,
    useOptimistic: function(e, t) {
      var a = qe();
      return Ne !== null ? Xf(a, Ne, e, t) : (a.baseState = e, [e, a.queue.dispatch]);
    },
    useMemoCache: ro,
    useCacheRefresh: pd
  };
  Td.useEffectEvent = nd;
  function Eo(e, t, a, l) {
    t = e.memoizedState, a = a(l, t), a = a == null ? t : C({}, t, a), e.memoizedState = a, e.lanes === 0 && (e.updateQueue.baseState = a);
  }
  var Mo = {
    enqueueSetState: function(e, t, a) {
      e = e._reactInternals;
      var l = Ct(), n = ba(l);
      n.payload = t, a != null && (n.callback = a), t = Sa(e, n, l), t !== null && (gt(t, e, l), Cn(t, e, l));
    },
    enqueueReplaceState: function(e, t, a) {
      e = e._reactInternals;
      var l = Ct(), n = ba(l);
      n.tag = 1, n.payload = t, a != null && (n.callback = a), t = Sa(e, n, l), t !== null && (gt(t, e, l), Cn(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var a = Ct(), l = ba(a);
      l.tag = 2, t != null && (l.callback = t), t = Sa(e, l, a), t !== null && (gt(t, e, a), Cn(t, e, a));
    }
  };
  function Ad(e, t, a, l, n, i, f) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, i, f) : t.prototype && t.prototype.isPureReactComponent ? !vn(a, l) || !vn(n, i) : !0;
  }
  function Ed(e, t, a, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, l), t.state !== e && Mo.enqueueReplaceState(t, t.state, null);
  }
  function ll(e, t) {
    var a = t;
    if ("ref" in t) {
      a = {};
      for (var l in t)
        l !== "ref" && (a[l] = t[l]);
    }
    if (e = e.defaultProps) {
      a === t && (a = C({}, a));
      for (var n in e)
        a[n] === void 0 && (a[n] = e[n]);
    }
    return a;
  }
  function Md(e) {
    Ui(e);
  }
  function Nd(e) {
    console.error(e);
  }
  function Cd(e) {
    Ui(e);
  }
  function au(e, t) {
    try {
      var a = e.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function Rd(e, t, a) {
    try {
      var l = e.onCaughtError;
      l(a.value, {
        componentStack: a.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function No(e, t, a) {
    return a = ba(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
      au(e, t);
    }, a;
  }
  function Dd(e) {
    return e = ba(e), e.tag = 3, e;
  }
  function wd(e, t, a, l) {
    var n = a.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = l.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        Rd(t, a, l);
      };
    }
    var f = a.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (e.callback = function() {
      Rd(t, a, l), typeof n != "function" && (Ca === null ? Ca = /* @__PURE__ */ new Set([this]) : Ca.add(this));
      var d = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: d !== null ? d : ""
      });
    });
  }
  function Wp(e, t, a, l, n) {
    if (a.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = a.alternate, t !== null && Dl(
        t,
        a,
        n,
        !0
      ), a = At.current, a !== null) {
        switch (a.tag) {
          case 31:
          case 13:
            return Lt === null ? gu() : a.alternate === null && Be === 0 && (Be = 3), a.flags &= -257, a.flags |= 65536, a.lanes = n, l === Qi ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), Fo(e, l, n)), !1;
          case 22:
            return a.flags |= 65536, l === Qi ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : a.add(l)), Fo(e, l, n)), !1;
        }
        throw Error(o(435, a.tag));
      }
      return Fo(e, l, n), gu(), !1;
    }
    if (ge)
      return t = At.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, l !== Qs && (e = Error(o(422), { cause: l }), Tn(_t(e, a)))) : (l !== Qs && (t = Error(o(423), {
        cause: l
      }), Tn(
        _t(t, a)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, l = _t(l, a), n = No(
        e.stateNode,
        l,
        n
      ), eo(e, n), Be !== 4 && (Be = 2)), !1;
    var i = Error(o(520), { cause: l });
    if (i = _t(i, a), Gn === null ? Gn = [i] : Gn.push(i), Be !== 4 && (Be = 2), t === null) return !0;
    l = _t(l, a), a = t;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, e = n & -n, a.lanes |= e, e = No(a.stateNode, l, e), eo(a, e), !1;
        case 1:
          if (t = a.type, i = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (Ca === null || !Ca.has(i))))
            return a.flags |= 65536, n &= -n, a.lanes |= n, n = Dd(n), wd(
              n,
              e,
              a,
              l
            ), eo(a, n), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var Co = Error(o(461)), Ke = !1;
  function et(e, t, a, l) {
    t.child = e === null ? Uf(t, null, a, l) : tl(
      t,
      e.child,
      a,
      l
    );
  }
  function _d(e, t, a, l, n) {
    a = a.render;
    var i = t.ref;
    if ("ref" in l) {
      var f = {};
      for (var d in l)
        d !== "ref" && (f[d] = l[d]);
    } else f = l;
    return $a(t), l = uo(
      e,
      t,
      a,
      f,
      i,
      n
    ), d = so(), e !== null && !Ke ? (oo(e, t, n), ta(e, t, n)) : (ge && d && qs(t), t.flags |= 1, et(e, t, l, n), t.child);
  }
  function Od(e, t, a, l, n) {
    if (e === null) {
      var i = a.type;
      return typeof i == "function" && !ks(i) && i.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = i, zd(
        e,
        t,
        i,
        l,
        n
      )) : (e = Bi(
        a.type,
        null,
        l,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !Lo(e, n)) {
      var f = i.memoizedProps;
      if (a = a.compare, a = a !== null ? a : vn, a(f, l) && e.ref === t.ref)
        return ta(e, t, n);
    }
    return t.flags |= 1, e = Jt(i, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function zd(e, t, a, l, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (vn(i, l) && e.ref === t.ref)
        if (Ke = !1, t.pendingProps = l = i, Lo(e, n))
          (e.flags & 131072) !== 0 && (Ke = !0);
        else
          return t.lanes = e.lanes, ta(e, t, n);
    }
    return Ro(
      e,
      t,
      a,
      l,
      n
    );
  }
  function Ud(e, t, a, l) {
    var n = l.children, i = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (i = i !== null ? i.baseLanes | a : a, e !== null) {
          for (l = t.child = e.child, n = 0; l !== null; )
            n = n | l.lanes | l.childLanes, l = l.sibling;
          l = n & ~i;
        } else l = 0, t.child = null;
        return Ld(
          e,
          t,
          i,
          a,
          l
        );
      }
      if ((a & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && qi(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? xf(t, i) : ao(), Bf(t);
      else
        return l = t.lanes = 536870912, Ld(
          e,
          t,
          i !== null ? i.baseLanes | a : a,
          a,
          l
        );
    } else
      i !== null ? (qi(t, i.cachePool), xf(t, i), Aa(), t.memoizedState = null) : (e !== null && qi(t, null), ao(), Aa());
    return et(e, t, n, a), t.child;
  }
  function Un(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Ld(e, t, a, l, n) {
    var i = Fs();
    return i = i === null ? null : { parent: Qe._currentValue, pool: i }, t.memoizedState = {
      baseLanes: a,
      cachePool: i
    }, e !== null && qi(t, null), ao(), Bf(t), e !== null && Dl(e, t, l, !0), t.childLanes = n, null;
  }
  function lu(e, t) {
    return t = iu(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Hd(e, t, a) {
    return tl(t, e.child, null, a), e = lu(t, t.pendingProps), e.flags |= 2, Et(t), t.memoizedState = null, e;
  }
  function Pp(e, t, a) {
    var l = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (ge) {
        if (l.mode === "hidden")
          return e = lu(t, l), t.lanes = 536870912, Un(null, e);
        if (no(t), (e = _e) ? (e = Zm(
          e,
          Ut
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ga !== null ? { id: qt, overflow: Yt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = vf(e), a.return = t, t.child = a, We = t, _e = null)) : e = null, e === null) throw pa(t);
        return t.lanes = 536870912, null;
      }
      return lu(t, l);
    }
    var i = e.memoizedState;
    if (i !== null) {
      var f = i.dehydrated;
      if (no(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = Hd(
            e,
            t,
            a
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (Ke || Dl(e, t, a, !1), n = (a & e.childLanes) !== 0, Ke || n) {
        if (l = De, l !== null && (f = Mr(l, a), f !== 0 && f !== i.retryLane))
          throw i.retryLane = f, Za(e, f), gt(l, e, f), Co;
        gu(), t = Hd(
          e,
          t,
          a
        );
      } else
        e = i.treeContext, _e = Ht(f.nextSibling), We = t, ge = !0, ha = null, Ut = !1, e !== null && Tf(t, e), t = lu(t, l), t.flags |= 4096;
      return t;
    }
    return e = Jt(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function nu(e, t) {
    var a = t.ref;
    if (a === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != "function" && typeof a != "object")
        throw Error(o(284));
      (e === null || e.ref !== a) && (t.flags |= 4194816);
    }
  }
  function Ro(e, t, a, l, n) {
    return $a(t), a = uo(
      e,
      t,
      a,
      l,
      void 0,
      n
    ), l = so(), e !== null && !Ke ? (oo(e, t, n), ta(e, t, n)) : (ge && l && qs(t), t.flags |= 1, et(e, t, a, n), t.child);
  }
  function xd(e, t, a, l, n, i) {
    return $a(t), t.updateQueue = null, a = jf(
      t,
      l,
      a,
      n
    ), kf(e), l = so(), e !== null && !Ke ? (oo(e, t, i), ta(e, t, i)) : (ge && l && qs(t), t.flags |= 1, et(e, t, a, i), t.child);
  }
  function Bd(e, t, a, l, n) {
    if ($a(t), t.stateNode === null) {
      var i = Ml, f = a.contextType;
      typeof f == "object" && f !== null && (i = Pe(f)), i = new a(l, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = Mo, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = l, i.state = t.memoizedState, i.refs = {}, Ws(t), f = a.contextType, i.context = typeof f == "object" && f !== null ? Pe(f) : Ml, i.state = t.memoizedState, f = a.getDerivedStateFromProps, typeof f == "function" && (Eo(
        t,
        a,
        f,
        l
      ), i.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (f = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), f !== i.state && Mo.enqueueReplaceState(i, i.state, null), Dn(t, l, i, n), Rn(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      i = t.stateNode;
      var d = t.memoizedProps, p = ll(a, d);
      i.props = p;
      var M = i.context, _ = a.contextType;
      f = Ml, typeof _ == "object" && _ !== null && (f = Pe(_));
      var z = a.getDerivedStateFromProps;
      _ = typeof z == "function" || typeof i.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, _ || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (d || M !== f) && Ed(
        t,
        i,
        l,
        f
      ), va = !1;
      var N = t.memoizedState;
      i.state = N, Dn(t, l, i, n), Rn(), M = t.memoizedState, d || N !== M || va ? (typeof z == "function" && (Eo(
        t,
        a,
        z,
        l
      ), M = t.memoizedState), (p = va || Ad(
        t,
        a,
        p,
        l,
        N,
        M,
        f
      )) ? (_ || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = M), i.props = l, i.state = M, i.context = f, l = p) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      i = t.stateNode, Ps(e, t), f = t.memoizedProps, _ = ll(a, f), i.props = _, z = t.pendingProps, N = i.context, M = a.contextType, p = Ml, typeof M == "object" && M !== null && (p = Pe(M)), d = a.getDerivedStateFromProps, (M = typeof d == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (f !== z || N !== p) && Ed(
        t,
        i,
        l,
        p
      ), va = !1, N = t.memoizedState, i.state = N, Dn(t, l, i, n), Rn();
      var R = t.memoizedState;
      f !== z || N !== R || va || e !== null && e.dependencies !== null && ji(e.dependencies) ? (typeof d == "function" && (Eo(
        t,
        a,
        d,
        l
      ), R = t.memoizedState), (_ = va || Ad(
        t,
        a,
        _,
        l,
        N,
        R,
        p
      ) || e !== null && e.dependencies !== null && ji(e.dependencies)) ? (M || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(l, R, p), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        l,
        R,
        p
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || f === e.memoizedProps && N === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && N === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = R), i.props = l, i.state = R, i.context = p, l = _) : (typeof i.componentDidUpdate != "function" || f === e.memoizedProps && N === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && N === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return i = l, nu(e, t), l = (t.flags & 128) !== 0, i || l ? (i = t.stateNode, a = l && typeof a.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && l ? (t.child = tl(
      t,
      e.child,
      null,
      n
    ), t.child = tl(
      t,
      null,
      a,
      n
    )) : et(e, t, a, n), t.memoizedState = i.state, e = t.child) : e = ta(
      e,
      t,
      n
    ), e;
  }
  function kd(e, t, a, l) {
    return Ja(), t.flags |= 256, et(e, t, a, l), t.child;
  }
  var Do = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function wo(e) {
    return { baseLanes: e, cachePool: Rf() };
  }
  function _o(e, t, a) {
    return e = e !== null ? e.childLanes & ~a : 0, t && (e |= Nt), e;
  }
  function jd(e, t, a) {
    var l = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, f;
    if ((f = i) || (f = e !== null && e.memoizedState === null ? !1 : (Ge.current & 2) !== 0), f && (n = !0, t.flags &= -129), f = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (ge) {
        if (n ? Ta(t) : Aa(), (e = _e) ? (e = Zm(
          e,
          Ut
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ga !== null ? { id: qt, overflow: Yt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = vf(e), a.return = t, t.child = a, We = t, _e = null)) : e = null, e === null) throw pa(t);
        return dc(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var d = l.children;
      return l = l.fallback, n ? (Aa(), n = t.mode, d = iu(
        { mode: "hidden", children: d },
        n
      ), l = Ia(
        l,
        n,
        a,
        null
      ), d.return = t, l.return = t, d.sibling = l, t.child = d, l = t.child, l.memoizedState = wo(a), l.childLanes = _o(
        e,
        f,
        a
      ), t.memoizedState = Do, Un(null, l)) : (Ta(t), Oo(t, d));
    }
    var p = e.memoizedState;
    if (p !== null && (d = p.dehydrated, d !== null)) {
      if (i)
        t.flags & 256 ? (Ta(t), t.flags &= -257, t = zo(
          e,
          t,
          a
        )) : t.memoizedState !== null ? (Aa(), t.child = e.child, t.flags |= 128, t = null) : (Aa(), d = l.fallback, n = t.mode, l = iu(
          { mode: "visible", children: l.children },
          n
        ), d = Ia(
          d,
          n,
          a,
          null
        ), d.flags |= 2, l.return = t, d.return = t, l.sibling = d, t.child = l, tl(
          t,
          e.child,
          null,
          a
        ), l = t.child, l.memoizedState = wo(a), l.childLanes = _o(
          e,
          f,
          a
        ), t.memoizedState = Do, t = Un(null, l));
      else if (Ta(t), dc(d)) {
        if (f = d.nextSibling && d.nextSibling.dataset, f) var M = f.dgst;
        f = M, l = Error(o(419)), l.stack = "", l.digest = f, Tn({ value: l, source: null, stack: null }), t = zo(
          e,
          t,
          a
        );
      } else if (Ke || Dl(e, t, a, !1), f = (a & e.childLanes) !== 0, Ke || f) {
        if (f = De, f !== null && (l = Mr(f, a), l !== 0 && l !== p.retryLane))
          throw p.retryLane = l, Za(e, l), gt(f, e, l), Co;
        fc(d) || gu(), t = zo(
          e,
          t,
          a
        );
      } else
        fc(d) ? (t.flags |= 192, t.child = e.child, t = null) : (e = p.treeContext, _e = Ht(
          d.nextSibling
        ), We = t, ge = !0, ha = null, Ut = !1, e !== null && Tf(t, e), t = Oo(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (Aa(), d = l.fallback, n = t.mode, p = e.child, M = p.sibling, l = Jt(p, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = p.subtreeFlags & 65011712, M !== null ? d = Jt(
      M,
      d
    ) : (d = Ia(
      d,
      n,
      a,
      null
    ), d.flags |= 2), d.return = t, l.return = t, l.sibling = d, t.child = l, Un(null, l), l = t.child, d = e.child.memoizedState, d === null ? d = wo(a) : (n = d.cachePool, n !== null ? (p = Qe._currentValue, n = n.parent !== p ? { parent: p, pool: p } : n) : n = Rf(), d = {
      baseLanes: d.baseLanes | a,
      cachePool: n
    }), l.memoizedState = d, l.childLanes = _o(
      e,
      f,
      a
    ), t.memoizedState = Do, Un(e.child, l)) : (Ta(t), a = e.child, e = a.sibling, a = Jt(a, {
      mode: "visible",
      children: l.children
    }), a.return = t, a.sibling = null, e !== null && (f = t.deletions, f === null ? (t.deletions = [e], t.flags |= 16) : f.push(e)), t.child = a, t.memoizedState = null, a);
  }
  function Oo(e, t) {
    return t = iu(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function iu(e, t) {
    return e = Tt(22, e, null, t), e.lanes = 0, e;
  }
  function zo(e, t, a) {
    return tl(t, e.child, null, a), e = Oo(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Gd(e, t, a) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), Xs(e.return, t, a);
  }
  function Uo(e, t, a, l, n, i) {
    var f = e.memoizedState;
    f === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: a,
      tailMode: n,
      treeForkCount: i
    } : (f.isBackwards = t, f.rendering = null, f.renderingStartTime = 0, f.last = l, f.tail = a, f.tailMode = n, f.treeForkCount = i);
  }
  function qd(e, t, a) {
    var l = t.pendingProps, n = l.revealOrder, i = l.tail;
    l = l.children;
    var f = Ge.current, d = (f & 2) !== 0;
    if (d ? (f = f & 1 | 2, t.flags |= 128) : f &= 1, H(Ge, f), et(e, t, l, a), l = ge ? Sn : 0, !d && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Gd(e, a, t);
        else if (e.tag === 19)
          Gd(e, a, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (n) {
      case "forwards":
        for (a = t.child, n = null; a !== null; )
          e = a.alternate, e !== null && Zi(e) === null && (n = a), a = a.sibling;
        a = n, a === null ? (n = t.child, t.child = null) : (n = a.sibling, a.sibling = null), Uo(
          t,
          !1,
          n,
          a,
          i,
          l
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (a = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && Zi(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = a, a = n, n = e;
        }
        Uo(
          t,
          !0,
          a,
          null,
          i,
          l
        );
        break;
      case "together":
        Uo(
          t,
          !1,
          null,
          null,
          void 0,
          l
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function ta(e, t, a) {
    if (e !== null && (t.dependencies = e.dependencies), Na |= t.lanes, (a & t.childLanes) === 0)
      if (e !== null) {
        if (Dl(
          e,
          t,
          a,
          !1
        ), (a & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (e = t.child, a = Jt(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null; )
        e = e.sibling, a = a.sibling = Jt(e, e.pendingProps), a.return = t;
      a.sibling = null;
    }
    return t.child;
  }
  function Lo(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && ji(e)));
  }
  function ey(e, t, a) {
    switch (t.tag) {
      case 3:
        ke(t, t.stateNode.containerInfo), ya(t, Qe, e.memoizedState.cache), Ja();
        break;
      case 27:
      case 5:
        nn(t);
        break;
      case 4:
        ke(t, t.stateNode.containerInfo);
        break;
      case 10:
        ya(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, no(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (Ta(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? jd(e, t, a) : (Ta(t), e = ta(
            e,
            t,
            a
          ), e !== null ? e.sibling : null);
        Ta(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (l = (a & t.childLanes) !== 0, l || (Dl(
          e,
          t,
          a,
          !1
        ), l = (a & t.childLanes) !== 0), n) {
          if (l)
            return qd(
              e,
              t,
              a
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), H(Ge, Ge.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, Ud(
          e,
          t,
          a,
          t.pendingProps
        );
      case 24:
        ya(t, Qe, e.memoizedState.cache);
    }
    return ta(e, t, a);
  }
  function Yd(e, t, a) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ke = !0;
      else {
        if (!Lo(e, a) && (t.flags & 128) === 0)
          return Ke = !1, ey(
            e,
            t,
            a
          );
        Ke = (e.flags & 131072) !== 0;
      }
    else
      Ke = !1, ge && (t.flags & 1048576) !== 0 && Sf(t, Sn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = Pa(t.elementType), t.type = e, typeof e == "function")
            ks(e) ? (l = ll(e, l), t.tag = 1, t = Bd(
              null,
              t,
              e,
              l,
              a
            )) : (t.tag = 0, t = Ro(
              null,
              t,
              e,
              l,
              a
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === G) {
                t.tag = 11, t = _d(
                  null,
                  t,
                  e,
                  l,
                  a
                );
                break e;
              } else if (n === Q) {
                t.tag = 14, t = Od(
                  null,
                  t,
                  e,
                  l,
                  a
                );
                break e;
              }
            }
            throw t = He(e) || e, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return Ro(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 1:
        return l = t.type, n = ll(
          l,
          t.pendingProps
        ), Bd(
          e,
          t,
          l,
          n,
          a
        );
      case 3:
        e: {
          if (ke(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          l = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Ps(e, t), Dn(t, l, null, a);
          var f = t.memoizedState;
          if (l = f.cache, ya(t, Qe, l), l !== i.cache && Zs(
            t,
            [Qe],
            a,
            !0
          ), Rn(), l = f.element, i.isDehydrated)
            if (i = {
              element: l,
              isDehydrated: !1,
              cache: f.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = kd(
                e,
                t,
                l,
                a
              );
              break e;
            } else if (l !== n) {
              n = _t(
                Error(o(424)),
                t
              ), Tn(n), t = kd(
                e,
                t,
                l,
                a
              );
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (_e = Ht(e.firstChild), We = t, ge = !0, ha = null, Ut = !0, a = Uf(
                t,
                null,
                l,
                a
              ), t.child = a; a; )
                a.flags = a.flags & -3 | 4096, a = a.sibling;
            }
          else {
            if (Ja(), l === n) {
              t = ta(
                e,
                t,
                a
              );
              break e;
            }
            et(e, t, l, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return nu(e, t), e === null ? (a = Pm(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = a : ge || (a = t.type, e = t.pendingProps, l = Tu(
          te.current
        ).createElement(a), l[$e] = t, l[ot] = e, tt(l, a, e), Je(l), t.stateNode = l) : t.memoizedState = Pm(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return nn(t), e === null && ge && (l = t.stateNode = Fm(
          t.type,
          t.pendingProps,
          te.current
        ), We = t, Ut = !0, n = _e, _a(t.type) ? (mc = n, _e = Ht(l.firstChild)) : _e = n), et(
          e,
          t,
          t.pendingProps.children,
          a
        ), nu(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && ge && ((n = l = _e) && (l = _y(
          l,
          t.type,
          t.pendingProps,
          Ut
        ), l !== null ? (t.stateNode = l, We = t, _e = Ht(l.firstChild), Ut = !1, n = !0) : n = !1), n || pa(t)), nn(t), n = t.type, i = t.pendingProps, f = e !== null ? e.memoizedProps : null, l = i.children, oc(n, i) ? l = null : f !== null && oc(n, f) && (t.flags |= 32), t.memoizedState !== null && (n = uo(
          e,
          t,
          Kp,
          null,
          null,
          a
        ), In._currentValue = n), nu(e, t), et(e, t, l, a), t.child;
      case 6:
        return e === null && ge && ((e = a = _e) && (a = Oy(
          a,
          t.pendingProps,
          Ut
        ), a !== null ? (t.stateNode = a, We = t, _e = null, e = !0) : e = !1), e || pa(t)), null;
      case 13:
        return jd(e, t, a);
      case 4:
        return ke(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = tl(
          t,
          null,
          l,
          a
        ) : et(e, t, l, a), t.child;
      case 11:
        return _d(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 7:
        return et(
          e,
          t,
          t.pendingProps,
          a
        ), t.child;
      case 8:
        return et(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 12:
        return et(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 10:
        return l = t.pendingProps, ya(t, t.type, l.value), et(e, t, l.children, a), t.child;
      case 9:
        return n = t.type._context, l = t.pendingProps.children, $a(t), n = Pe(n), l = l(n), t.flags |= 1, et(e, t, l, a), t.child;
      case 14:
        return Od(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 15:
        return zd(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 19:
        return qd(e, t, a);
      case 31:
        return Pp(e, t, a);
      case 22:
        return Ud(
          e,
          t,
          a,
          t.pendingProps
        );
      case 24:
        return $a(t), l = Pe(Qe), e === null ? (n = Fs(), n === null && (n = De, i = Is(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= a), n = i), t.memoizedState = { parent: l, cache: n }, Ws(t), ya(t, Qe, n)) : ((e.lanes & a) !== 0 && (Ps(e, t), Dn(t, null, null, a), Rn()), n = e.memoizedState, i = t.memoizedState, n.parent !== l ? (n = { parent: l, cache: l }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), ya(t, Qe, l)) : (l = i.cache, ya(t, Qe, l), l !== n.cache && Zs(
          t,
          [Qe],
          a,
          !0
        ))), et(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function aa(e) {
    e.flags |= 4;
  }
  function Ho(e, t, a, l, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (hm()) e.flags |= 8192;
        else
          throw el = Qi, $s;
    } else e.flags &= -16777217;
  }
  function Qd(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !ng(t))
      if (hm()) e.flags |= 8192;
      else
        throw el = Qi, $s;
  }
  function uu(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Tr() : 536870912, e.lanes |= t, Gl |= t);
  }
  function Ln(e, t) {
    if (!ge)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var a = null; t !== null; )
            t.alternate !== null && (a = t), t = t.sibling;
          a === null ? e.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = e.tail;
          for (var l = null; a !== null; )
            a.alternate !== null && (l = a), a = a.sibling;
          l === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null;
      }
  }
  function Oe(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, a = 0, l = 0;
    if (t)
      for (var n = e.child; n !== null; )
        a |= n.lanes | n.childLanes, l |= n.subtreeFlags & 65011712, l |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        a |= n.lanes | n.childLanes, l |= n.subtreeFlags, l |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= l, e.childLanes = a, t;
  }
  function ty(e, t, a) {
    var l = t.pendingProps;
    switch (Ys(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Oe(t), null;
      case 1:
        return Oe(t), null;
      case 3:
        return a = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Wt(Qe), je(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && (Rl(t) ? aa(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Vs())), Oe(t), null;
      case 26:
        var n = t.type, i = t.memoizedState;
        return e === null ? (aa(t), i !== null ? (Oe(t), Qd(t, i)) : (Oe(t), Ho(
          t,
          n,
          null,
          l,
          a
        ))) : i ? i !== e.memoizedState ? (aa(t), Oe(t), Qd(t, i)) : (Oe(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && aa(t), Oe(t), Ho(
          t,
          n,
          e,
          l,
          a
        )), null;
      case 27:
        if (yi(t), a = te.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && aa(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Oe(t), null;
          }
          e = j.current, Rl(t) ? Af(t) : (e = Fm(n, l, a), t.stateNode = e, aa(t));
        }
        return Oe(t), null;
      case 5:
        if (yi(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && aa(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Oe(t), null;
          }
          if (i = j.current, Rl(t))
            Af(t);
          else {
            var f = Tu(
              te.current
            );
            switch (i) {
              case 1:
                i = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                i = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    i = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    i = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    i = f.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(
                      i.firstChild
                    );
                    break;
                  case "select":
                    i = typeof l.is == "string" ? f.createElement("select", {
                      is: l.is
                    }) : f.createElement("select"), l.multiple ? i.multiple = !0 : l.size && (i.size = l.size);
                    break;
                  default:
                    i = typeof l.is == "string" ? f.createElement(n, { is: l.is }) : f.createElement(n);
                }
            }
            i[$e] = t, i[ot] = l;
            e: for (f = t.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                i.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === t) break e;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === t)
                  break e;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            t.stateNode = i;
            e: switch (tt(i, n, l), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break e;
              case "img":
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && aa(t);
          }
        }
        return Oe(t), Ho(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          a
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && aa(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = te.current, Rl(t)) {
            if (e = t.stateNode, a = t.memoizedProps, l = null, n = We, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  l = n.memoizedProps;
              }
            e[$e] = t, e = !!(e.nodeValue === a || l !== null && l.suppressHydrationWarning === !0 || jm(e.nodeValue, a)), e || pa(t, !0);
          } else
            e = Tu(e).createTextNode(
              l
            ), e[$e] = t, t.stateNode = e;
        }
        return Oe(t), null;
      case 31:
        if (a = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = Rl(t), a !== null) {
            if (e === null) {
              if (!l) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
              e[$e] = t;
            } else
              Ja(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Oe(t), e = !1;
          } else
            a = Vs(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = !0;
          if (!e)
            return t.flags & 256 ? (Et(t), t) : (Et(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return Oe(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Rl(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[$e] = t;
            } else
              Ja(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Oe(t), n = !1;
          } else
            n = Vs(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Et(t), t) : (Et(t), null);
        }
        return Et(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = l !== null, e = e !== null && e.memoizedState !== null, a && (l = t.child, n = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (n = l.alternate.memoizedState.cachePool.pool), i = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (i = l.memoizedState.cachePool.pool), i !== n && (l.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), uu(t, t.updateQueue), Oe(t), null);
      case 4:
        return je(), e === null && lc(t.stateNode.containerInfo), Oe(t), null;
      case 10:
        return Wt(t.type), Oe(t), null;
      case 19:
        if (U(Ge), l = t.memoizedState, l === null) return Oe(t), null;
        if (n = (t.flags & 128) !== 0, i = l.rendering, i === null)
          if (n) Ln(l, !1);
          else {
            if (Be !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = Zi(e), i !== null) {
                  for (t.flags |= 128, Ln(l, !1), e = i.updateQueue, t.updateQueue = e, uu(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null; )
                    yf(a, e), a = a.sibling;
                  return H(
                    Ge,
                    Ge.current & 1 | 2
                  ), ge && Ft(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && yt() > fu && (t.flags |= 128, n = !0, Ln(l, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = Zi(i), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, uu(t, e), Ln(l, !0), l.tail === null && l.tailMode === "hidden" && !i.alternate && !ge)
                return Oe(t), null;
            } else
              2 * yt() - l.renderingStartTime > fu && a !== 536870912 && (t.flags |= 128, n = !0, Ln(l, !1), t.lanes = 4194304);
          l.isBackwards ? (i.sibling = t.child, t.child = i) : (e = l.last, e !== null ? e.sibling = i : t.child = i, l.last = i);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = yt(), e.sibling = null, a = Ge.current, H(
          Ge,
          n ? a & 1 | 2 : a & 1
        ), ge && Ft(t, l.treeForkCount), e) : (Oe(t), null);
      case 22:
      case 23:
        return Et(t), lo(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (Oe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Oe(t), a = t.updateQueue, a !== null && uu(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== a && (t.flags |= 2048), e !== null && U(Wa), null;
      case 24:
        return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Wt(Qe), Oe(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function ay(e, t) {
    switch (Ys(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Wt(Qe), je(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return yi(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Et(t), t.alternate === null)
            throw Error(o(340));
          Ja();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Et(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Ja();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return U(Ge), null;
      case 4:
        return je(), null;
      case 10:
        return Wt(t.type), null;
      case 22:
      case 23:
        return Et(t), lo(), e !== null && U(Wa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Wt(Qe), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Vd(e, t) {
    switch (Ys(t), t.tag) {
      case 3:
        Wt(Qe), je();
        break;
      case 26:
      case 27:
      case 5:
        yi(t);
        break;
      case 4:
        je();
        break;
      case 31:
        t.memoizedState !== null && Et(t);
        break;
      case 13:
        Et(t);
        break;
      case 19:
        U(Ge);
        break;
      case 10:
        Wt(t.type);
        break;
      case 22:
      case 23:
        Et(t), lo(), e !== null && U(Wa);
        break;
      case 24:
        Wt(Qe);
    }
  }
  function Hn(e, t) {
    try {
      var a = t.updateQueue, l = a !== null ? a.lastEffect : null;
      if (l !== null) {
        var n = l.next;
        a = n;
        do {
          if ((a.tag & e) === e) {
            l = void 0;
            var i = a.create, f = a.inst;
            l = i(), f.destroy = l;
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (d) {
      Me(t, t.return, d);
    }
  }
  function Ea(e, t, a) {
    try {
      var l = t.updateQueue, n = l !== null ? l.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        l = i;
        do {
          if ((l.tag & e) === e) {
            var f = l.inst, d = f.destroy;
            if (d !== void 0) {
              f.destroy = void 0, n = t;
              var p = a, M = d;
              try {
                M();
              } catch (_) {
                Me(
                  n,
                  p,
                  _
                );
              }
            }
          }
          l = l.next;
        } while (l !== i);
      }
    } catch (_) {
      Me(t, t.return, _);
    }
  }
  function Kd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var a = e.stateNode;
      try {
        Hf(t, a);
      } catch (l) {
        Me(e, e.return, l);
      }
    }
  }
  function Xd(e, t, a) {
    a.props = ll(
      e.type,
      e.memoizedProps
    ), a.state = e.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (l) {
      Me(e, t, l);
    }
  }
  function xn(e, t) {
    try {
      var a = e.ref;
      if (a !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof a == "function" ? e.refCleanup = a(l) : a.current = l;
      }
    } catch (n) {
      Me(e, t, n);
    }
  }
  function Qt(e, t) {
    var a = e.ref, l = e.refCleanup;
    if (a !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (n) {
          Me(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (n) {
          Me(e, t, n);
        }
      else a.current = null;
  }
  function Zd(e) {
    var t = e.type, a = e.memoizedProps, l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && l.focus();
          break e;
        case "img":
          a.src ? l.src = a.src : a.srcSet && (l.srcset = a.srcSet);
      }
    } catch (n) {
      Me(e, e.return, n);
    }
  }
  function xo(e, t, a) {
    try {
      var l = e.stateNode;
      My(l, e.type, a, t), l[ot] = t;
    } catch (n) {
      Me(e, e.return, n);
    }
  }
  function Id(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && _a(e.type) || e.tag === 4;
  }
  function Bo(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Id(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && _a(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function ko(e, t, a) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(e, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(e), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = Zt));
    else if (l !== 4 && (l === 27 && _a(e.type) && (a = e.stateNode, t = null), e = e.child, e !== null))
      for (ko(e, t, a), e = e.sibling; e !== null; )
        ko(e, t, a), e = e.sibling;
  }
  function su(e, t, a) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);
    else if (l !== 4 && (l === 27 && _a(e.type) && (a = e.stateNode), e = e.child, e !== null))
      for (su(e, t, a), e = e.sibling; e !== null; )
        su(e, t, a), e = e.sibling;
  }
  function Jd(e) {
    var t = e.stateNode, a = e.memoizedProps;
    try {
      for (var l = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      tt(t, l, a), t[$e] = e, t[ot] = a;
    } catch (i) {
      Me(e, e.return, i);
    }
  }
  var la = !1, Xe = !1, jo = !1, Fd = typeof WeakSet == "function" ? WeakSet : Set, Fe = null;
  function ly(e, t) {
    if (e = e.containerInfo, uc = Du, e = of(e), Os(e)) {
      if ("selectionStart" in e)
        var a = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var l = a.getSelection && a.getSelection();
          if (l && l.rangeCount !== 0) {
            a = l.anchorNode;
            var n = l.anchorOffset, i = l.focusNode;
            l = l.focusOffset;
            try {
              a.nodeType, i.nodeType;
            } catch {
              a = null;
              break e;
            }
            var f = 0, d = -1, p = -1, M = 0, _ = 0, z = e, N = null;
            t: for (; ; ) {
              for (var R; z !== a || n !== 0 && z.nodeType !== 3 || (d = f + n), z !== i || l !== 0 && z.nodeType !== 3 || (p = f + l), z.nodeType === 3 && (f += z.nodeValue.length), (R = z.firstChild) !== null; )
                N = z, z = R;
              for (; ; ) {
                if (z === e) break t;
                if (N === a && ++M === n && (d = f), N === i && ++_ === l && (p = f), (R = z.nextSibling) !== null) break;
                z = N, N = z.parentNode;
              }
              z = R;
            }
            a = d === -1 || p === -1 ? null : { start: d, end: p };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (sc = { focusedElem: e, selectionRange: a }, Du = !1, Fe = t; Fe !== null; )
      if (t = Fe, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, Fe = e;
      else
        for (; Fe !== null; ) {
          switch (t = Fe, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (a = 0; a < e.length; a++)
                  n = e[a], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, a = t, n = i.memoizedProps, i = i.memoizedState, l = a.stateNode;
                try {
                  var V = ll(
                    a.type,
                    n
                  );
                  e = l.getSnapshotBeforeUpdate(
                    V,
                    i
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ee) {
                  Me(
                    a,
                    a.return,
                    ee
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, a = e.nodeType, a === 9)
                  rc(e);
                else if (a === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      rc(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(o(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Fe = e;
            break;
          }
          Fe = t.return;
        }
  }
  function $d(e, t, a) {
    var l = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        ia(e, a), l & 4 && Hn(5, a);
        break;
      case 1:
        if (ia(e, a), l & 4)
          if (e = a.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (f) {
              Me(a, a.return, f);
            }
          else {
            var n = ll(
              a.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                n,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (f) {
              Me(
                a,
                a.return,
                f
              );
            }
          }
        l & 64 && Kd(a), l & 512 && xn(a, a.return);
        break;
      case 3:
        if (ia(e, a), l & 64 && (e = a.updateQueue, e !== null)) {
          if (t = null, a.child !== null)
            switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
          try {
            Hf(e, t);
          } catch (f) {
            Me(a, a.return, f);
          }
        }
        break;
      case 27:
        t === null && l & 4 && Jd(a);
      case 26:
      case 5:
        ia(e, a), t === null && l & 4 && Zd(a), l & 512 && xn(a, a.return);
        break;
      case 12:
        ia(e, a);
        break;
      case 31:
        ia(e, a), l & 4 && em(e, a);
        break;
      case 13:
        ia(e, a), l & 4 && tm(e, a), l & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (a = dy.bind(
          null,
          a
        ), zy(e, a))));
        break;
      case 22:
        if (l = a.memoizedState !== null || la, !l) {
          t = t !== null && t.memoizedState !== null || Xe, n = la;
          var i = Xe;
          la = l, (Xe = t) && !i ? ua(
            e,
            a,
            (a.subtreeFlags & 8772) !== 0
          ) : ia(e, a), la = n, Xe = i;
        }
        break;
      case 30:
        break;
      default:
        ia(e, a);
    }
  }
  function Wd(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Wd(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && gs(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var ze = null, rt = !1;
  function na(e, t, a) {
    for (a = a.child; a !== null; )
      Pd(e, t, a), a = a.sibling;
  }
  function Pd(e, t, a) {
    if (vt && typeof vt.onCommitFiberUnmount == "function")
      try {
        vt.onCommitFiberUnmount(un, a);
      } catch {
      }
    switch (a.tag) {
      case 26:
        Xe || Qt(a, t), na(
          e,
          t,
          a
        ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        Xe || Qt(a, t);
        var l = ze, n = rt;
        _a(a.type) && (ze = a.stateNode, rt = !1), na(
          e,
          t,
          a
        ), Kn(a.stateNode), ze = l, rt = n;
        break;
      case 5:
        Xe || Qt(a, t);
      case 6:
        if (l = ze, n = rt, ze = null, na(
          e,
          t,
          a
        ), ze = l, rt = n, ze !== null)
          if (rt)
            try {
              (ze.nodeType === 9 ? ze.body : ze.nodeName === "HTML" ? ze.ownerDocument.body : ze).removeChild(a.stateNode);
            } catch (i) {
              Me(
                a,
                t,
                i
              );
            }
          else
            try {
              ze.removeChild(a.stateNode);
            } catch (i) {
              Me(
                a,
                t,
                i
              );
            }
        break;
      case 18:
        ze !== null && (rt ? (e = ze, Km(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          a.stateNode
        ), Il(e)) : Km(ze, a.stateNode));
        break;
      case 4:
        l = ze, n = rt, ze = a.stateNode.containerInfo, rt = !0, na(
          e,
          t,
          a
        ), ze = l, rt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ea(2, a, t), Xe || Ea(4, a, t), na(
          e,
          t,
          a
        );
        break;
      case 1:
        Xe || (Qt(a, t), l = a.stateNode, typeof l.componentWillUnmount == "function" && Xd(
          a,
          t,
          l
        )), na(
          e,
          t,
          a
        );
        break;
      case 21:
        na(
          e,
          t,
          a
        );
        break;
      case 22:
        Xe = (l = Xe) || a.memoizedState !== null, na(
          e,
          t,
          a
        ), Xe = l;
        break;
      default:
        na(
          e,
          t,
          a
        );
    }
  }
  function em(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Il(e);
      } catch (a) {
        Me(t, t.return, a);
      }
    }
  }
  function tm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Il(e);
      } catch (a) {
        Me(t, t.return, a);
      }
  }
  function ny(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Fd()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Fd()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function ou(e, t) {
    var a = ny(e);
    t.forEach(function(l) {
      if (!a.has(l)) {
        a.add(l);
        var n = my.bind(null, e, l);
        l.then(n, n);
      }
    });
  }
  function ft(e, t) {
    var a = t.deletions;
    if (a !== null)
      for (var l = 0; l < a.length; l++) {
        var n = a[l], i = e, f = t, d = f;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 27:
              if (_a(d.type)) {
                ze = d.stateNode, rt = !1;
                break e;
              }
              break;
            case 5:
              ze = d.stateNode, rt = !1;
              break e;
            case 3:
            case 4:
              ze = d.stateNode.containerInfo, rt = !0;
              break e;
          }
          d = d.return;
        }
        if (ze === null) throw Error(o(160));
        Pd(i, f, n), ze = null, rt = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        am(t, e), t = t.sibling;
  }
  var jt = null;
  function am(e, t) {
    var a = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ft(t, e), dt(e), l & 4 && (Ea(3, e, e.return), Hn(3, e), Ea(5, e, e.return));
        break;
      case 1:
        ft(t, e), dt(e), l & 512 && (Xe || a === null || Qt(a, a.return)), l & 64 && la && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (a = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = a === null ? l : a.concat(l))));
        break;
      case 26:
        var n = jt;
        if (ft(t, e), dt(e), l & 512 && (Xe || a === null || Qt(a, a.return)), l & 4) {
          var i = a !== null ? a.memoizedState : null;
          if (l = e.memoizedState, a === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, a = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (l) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[cn] || i[$e] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(l), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), tt(i, l, a), i[$e] = e, Je(i), l = i;
                      break e;
                    case "link":
                      var f = ag(
                        "link",
                        "href",
                        n
                      ).get(l + (a.href || ""));
                      if (f) {
                        for (var d = 0; d < f.length; d++)
                          if (i = f[d], i.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && i.getAttribute("rel") === (a.rel == null ? null : a.rel) && i.getAttribute("title") === (a.title == null ? null : a.title) && i.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                            f.splice(d, 1);
                            break t;
                          }
                      }
                      i = n.createElement(l), tt(i, l, a), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (f = ag(
                        "meta",
                        "content",
                        n
                      ).get(l + (a.content || ""))) {
                        for (d = 0; d < f.length; d++)
                          if (i = f[d], i.getAttribute("content") === (a.content == null ? null : "" + a.content) && i.getAttribute("name") === (a.name == null ? null : a.name) && i.getAttribute("property") === (a.property == null ? null : a.property) && i.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && i.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                            f.splice(d, 1);
                            break t;
                          }
                      }
                      i = n.createElement(l), tt(i, l, a), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(o(468, l));
                  }
                  i[$e] = e, Je(i), l = i;
                }
                e.stateNode = l;
              } else
                lg(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = tg(
                n,
                l,
                e.memoizedProps
              );
          else
            i !== l ? (i === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : i.count--, l === null ? lg(
              n,
              e.type,
              e.stateNode
            ) : tg(
              n,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && xo(
              e,
              e.memoizedProps,
              a.memoizedProps
            );
        }
        break;
      case 27:
        ft(t, e), dt(e), l & 512 && (Xe || a === null || Qt(a, a.return)), a !== null && l & 4 && xo(
          e,
          e.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (ft(t, e), dt(e), l & 512 && (Xe || a === null || Qt(a, a.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            yl(n, "");
          } catch (V) {
            Me(e, e.return, V);
          }
        }
        l & 4 && e.stateNode != null && (n = e.memoizedProps, xo(
          e,
          n,
          a !== null ? a.memoizedProps : n
        )), l & 1024 && (jo = !0);
        break;
      case 6:
        if (ft(t, e), dt(e), l & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          l = e.memoizedProps, a = e.stateNode;
          try {
            a.nodeValue = l;
          } catch (V) {
            Me(e, e.return, V);
          }
        }
        break;
      case 3:
        if (Mu = null, n = jt, jt = Au(t.containerInfo), ft(t, e), jt = n, dt(e), l & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            Il(t.containerInfo);
          } catch (V) {
            Me(e, e.return, V);
          }
        jo && (jo = !1, lm(e));
        break;
      case 4:
        l = jt, jt = Au(
          e.stateNode.containerInfo
        ), ft(t, e), dt(e), jt = l;
        break;
      case 12:
        ft(t, e), dt(e);
        break;
      case 31:
        ft(t, e), dt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ou(e, l)));
        break;
      case 13:
        ft(t, e), dt(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (ru = yt()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ou(e, l)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var p = a !== null && a.memoizedState !== null, M = la, _ = Xe;
        if (la = M || n, Xe = _ || p, ft(t, e), Xe = _, la = M, dt(e), l & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (a === null || p || la || Xe || nl(e)), a = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                p = a = t;
                try {
                  if (i = p.stateNode, n)
                    f = i.style, typeof f.setProperty == "function" ? f.setProperty("display", "none", "important") : f.display = "none";
                  else {
                    d = p.stateNode;
                    var z = p.memoizedProps.style, N = z != null && z.hasOwnProperty("display") ? z.display : null;
                    d.style.display = N == null || typeof N == "boolean" ? "" : ("" + N).trim();
                  }
                } catch (V) {
                  Me(p, p.return, V);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                p = t;
                try {
                  p.stateNode.nodeValue = n ? "" : p.memoizedProps;
                } catch (V) {
                  Me(p, p.return, V);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                p = t;
                try {
                  var R = p.stateNode;
                  n ? Xm(R, !0) : Xm(p.stateNode, !1);
                } catch (V) {
                  Me(p, p.return, V);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              a === t && (a = null), t = t.return;
            }
            a === t && (a = null), t.sibling.return = t.return, t = t.sibling;
          }
        l & 4 && (l = e.updateQueue, l !== null && (a = l.retryQueue, a !== null && (l.retryQueue = null, ou(e, a))));
        break;
      case 19:
        ft(t, e), dt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ou(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ft(t, e), dt(e);
    }
  }
  function dt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var a, l = e.return; l !== null; ) {
          if (Id(l)) {
            a = l;
            break;
          }
          l = l.return;
        }
        if (a == null) throw Error(o(160));
        switch (a.tag) {
          case 27:
            var n = a.stateNode, i = Bo(e);
            su(e, i, n);
            break;
          case 5:
            var f = a.stateNode;
            a.flags & 32 && (yl(f, ""), a.flags &= -33);
            var d = Bo(e);
            su(e, d, f);
            break;
          case 3:
          case 4:
            var p = a.stateNode.containerInfo, M = Bo(e);
            ko(
              e,
              M,
              p
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (_) {
        Me(e, e.return, _);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function lm(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        lm(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function ia(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        $d(e, t.alternate, t), t = t.sibling;
  }
  function nl(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ea(4, t, t.return), nl(t);
          break;
        case 1:
          Qt(t, t.return);
          var a = t.stateNode;
          typeof a.componentWillUnmount == "function" && Xd(
            t,
            t.return,
            a
          ), nl(t);
          break;
        case 27:
          Kn(t.stateNode);
        case 26:
        case 5:
          Qt(t, t.return), nl(t);
          break;
        case 22:
          t.memoizedState === null && nl(t);
          break;
        case 30:
          nl(t);
          break;
        default:
          nl(t);
      }
      e = e.sibling;
    }
  }
  function ua(e, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, n = e, i = t, f = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          ua(
            n,
            i,
            a
          ), Hn(4, i);
          break;
        case 1:
          if (ua(
            n,
            i,
            a
          ), l = i, n = l.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (M) {
              Me(l, l.return, M);
            }
          if (l = i, n = l.updateQueue, n !== null) {
            var d = l.stateNode;
            try {
              var p = n.shared.hiddenCallbacks;
              if (p !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < p.length; n++)
                  Lf(p[n], d);
            } catch (M) {
              Me(l, l.return, M);
            }
          }
          a && f & 64 && Kd(i), xn(i, i.return);
          break;
        case 27:
          Jd(i);
        case 26:
        case 5:
          ua(
            n,
            i,
            a
          ), a && l === null && f & 4 && Zd(i), xn(i, i.return);
          break;
        case 12:
          ua(
            n,
            i,
            a
          );
          break;
        case 31:
          ua(
            n,
            i,
            a
          ), a && f & 4 && em(n, i);
          break;
        case 13:
          ua(
            n,
            i,
            a
          ), a && f & 4 && tm(n, i);
          break;
        case 22:
          i.memoizedState === null && ua(
            n,
            i,
            a
          ), xn(i, i.return);
          break;
        case 30:
          break;
        default:
          ua(
            n,
            i,
            a
          );
      }
      t = t.sibling;
    }
  }
  function Go(e, t) {
    var a = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && e.refCount++, a != null && An(a));
  }
  function qo(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && An(e));
  }
  function Gt(e, t, a, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        nm(
          e,
          t,
          a,
          l
        ), t = t.sibling;
  }
  function nm(e, t, a, l) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Gt(
          e,
          t,
          a,
          l
        ), n & 2048 && Hn(9, t);
        break;
      case 1:
        Gt(
          e,
          t,
          a,
          l
        );
        break;
      case 3:
        Gt(
          e,
          t,
          a,
          l
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && An(e)));
        break;
      case 12:
        if (n & 2048) {
          Gt(
            e,
            t,
            a,
            l
          ), e = t.stateNode;
          try {
            var i = t.memoizedProps, f = i.id, d = i.onPostCommit;
            typeof d == "function" && d(
              f,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (p) {
            Me(t, t.return, p);
          }
        } else
          Gt(
            e,
            t,
            a,
            l
          );
        break;
      case 31:
        Gt(
          e,
          t,
          a,
          l
        );
        break;
      case 13:
        Gt(
          e,
          t,
          a,
          l
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, f = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? Gt(
          e,
          t,
          a,
          l
        ) : Bn(e, t) : i._visibility & 2 ? Gt(
          e,
          t,
          a,
          l
        ) : (i._visibility |= 2, Bl(
          e,
          t,
          a,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && Go(f, t);
        break;
      case 24:
        Gt(
          e,
          t,
          a,
          l
        ), n & 2048 && qo(t.alternate, t);
        break;
      default:
        Gt(
          e,
          t,
          a,
          l
        );
    }
  }
  function Bl(e, t, a, l, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var i = e, f = t, d = a, p = l, M = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          Bl(
            i,
            f,
            d,
            p,
            n
          ), Hn(8, f);
          break;
        case 23:
          break;
        case 22:
          var _ = f.stateNode;
          f.memoizedState !== null ? _._visibility & 2 ? Bl(
            i,
            f,
            d,
            p,
            n
          ) : Bn(
            i,
            f
          ) : (_._visibility |= 2, Bl(
            i,
            f,
            d,
            p,
            n
          )), n && M & 2048 && Go(
            f.alternate,
            f
          );
          break;
        case 24:
          Bl(
            i,
            f,
            d,
            p,
            n
          ), n && M & 2048 && qo(f.alternate, f);
          break;
        default:
          Bl(
            i,
            f,
            d,
            p,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Bn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var a = e, l = t, n = l.flags;
        switch (l.tag) {
          case 22:
            Bn(a, l), n & 2048 && Go(
              l.alternate,
              l
            );
            break;
          case 24:
            Bn(a, l), n & 2048 && qo(l.alternate, l);
            break;
          default:
            Bn(a, l);
        }
        t = t.sibling;
      }
  }
  var kn = 8192;
  function kl(e, t, a) {
    if (e.subtreeFlags & kn)
      for (e = e.child; e !== null; )
        im(
          e,
          t,
          a
        ), e = e.sibling;
  }
  function im(e, t, a) {
    switch (e.tag) {
      case 26:
        kl(
          e,
          t,
          a
        ), e.flags & kn && e.memoizedState !== null && Vy(
          a,
          jt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        kl(
          e,
          t,
          a
        );
        break;
      case 3:
      case 4:
        var l = jt;
        jt = Au(e.stateNode.containerInfo), kl(
          e,
          t,
          a
        ), jt = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = kn, kn = 16777216, kl(
          e,
          t,
          a
        ), kn = l) : kl(
          e,
          t,
          a
        ));
        break;
      default:
        kl(
          e,
          t,
          a
        );
    }
  }
  function um(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function jn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var l = t[a];
          Fe = l, om(
            l,
            e
          );
        }
      um(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        sm(e), e = e.sibling;
  }
  function sm(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        jn(e), e.flags & 2048 && Ea(9, e, e.return);
        break;
      case 3:
        jn(e);
        break;
      case 12:
        jn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, cu(e)) : jn(e);
        break;
      default:
        jn(e);
    }
  }
  function cu(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var l = t[a];
          Fe = l, om(
            l,
            e
          );
        }
      um(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Ea(8, t, t.return), cu(t);
          break;
        case 22:
          a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, cu(t));
          break;
        default:
          cu(t);
      }
      e = e.sibling;
    }
  }
  function om(e, t) {
    for (; Fe !== null; ) {
      var a = Fe;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          Ea(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var l = a.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          An(a.memoizedState.cache);
      }
      if (l = a.child, l !== null) l.return = a, Fe = l;
      else
        e: for (a = e; Fe !== null; ) {
          l = Fe;
          var n = l.sibling, i = l.return;
          if (Wd(l), l === a) {
            Fe = null;
            break e;
          }
          if (n !== null) {
            n.return = i, Fe = n;
            break e;
          }
          Fe = i;
        }
    }
  }
  var iy = {
    getCacheForType: function(e) {
      var t = Pe(Qe), a = t.data.get(e);
      return a === void 0 && (a = e(), t.data.set(e, a)), a;
    },
    cacheSignal: function() {
      return Pe(Qe).controller.signal;
    }
  }, uy = typeof WeakMap == "function" ? WeakMap : Map, Se = 0, De = null, re = null, de = 0, Ee = 0, Mt = null, Ma = !1, jl = !1, Yo = !1, sa = 0, Be = 0, Na = 0, il = 0, Qo = 0, Nt = 0, Gl = 0, Gn = null, mt = null, Vo = !1, ru = 0, cm = 0, fu = 1 / 0, du = null, Ca = null, Ie = 0, Ra = null, ql = null, oa = 0, Ko = 0, Xo = null, rm = null, qn = 0, Zo = null;
  function Ct() {
    return (Se & 2) !== 0 && de !== 0 ? de & -de : w.T !== null ? Po() : Nr();
  }
  function fm() {
    if (Nt === 0)
      if ((de & 536870912) === 0 || ge) {
        var e = Si;
        Si <<= 1, (Si & 3932160) === 0 && (Si = 262144), Nt = e;
      } else Nt = 536870912;
    return e = At.current, e !== null && (e.flags |= 32), Nt;
  }
  function gt(e, t, a) {
    (e === De && (Ee === 2 || Ee === 9) || e.cancelPendingCommit !== null) && (Yl(e, 0), Da(
      e,
      de,
      Nt,
      !1
    )), on(e, a), ((Se & 2) === 0 || e !== De) && (e === De && ((Se & 2) === 0 && (il |= a), Be === 4 && Da(
      e,
      de,
      Nt,
      !1
    )), Vt(e));
  }
  function dm(e, t, a) {
    if ((Se & 6) !== 0) throw Error(o(327));
    var l = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || sn(e, t), n = l ? cy(e, t) : Jo(e, t, !0), i = l;
    do {
      if (n === 0) {
        jl && !l && Da(e, t, 0, !1);
        break;
      } else {
        if (a = e.current.alternate, i && !sy(a)) {
          n = Jo(e, t, !1), i = !1;
          continue;
        }
        if (n === 2) {
          if (i = t, e.errorRecoveryDisabledLanes & i)
            var f = 0;
          else
            f = e.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            t = f;
            e: {
              var d = e;
              n = Gn;
              var p = d.current.memoizedState.isDehydrated;
              if (p && (Yl(d, f).flags |= 256), f = Jo(
                d,
                f,
                !1
              ), f !== 2) {
                if (Yo && !p) {
                  d.errorRecoveryDisabledLanes |= i, il |= i, n = 4;
                  break e;
                }
                i = mt, mt = n, i !== null && (mt === null ? mt = i : mt.push.apply(
                  mt,
                  i
                ));
              }
              n = f;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Yl(e, 0), Da(e, t, 0, !0);
          break;
        }
        e: {
          switch (l = e, i = n, i) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Da(
                l,
                t,
                Nt,
                !Ma
              );
              break e;
            case 2:
              mt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = ru + 300 - yt(), 10 < n)) {
            if (Da(
              l,
              t,
              Nt,
              !Ma
            ), Ai(l, 0, !0) !== 0) break e;
            oa = t, l.timeoutHandle = Qm(
              mm.bind(
                null,
                l,
                a,
                mt,
                du,
                Vo,
                t,
                Nt,
                il,
                Gl,
                Ma,
                i,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          mm(
            l,
            a,
            mt,
            du,
            Vo,
            t,
            Nt,
            il,
            Gl,
            Ma,
            i,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Vt(e);
  }
  function mm(e, t, a, l, n, i, f, d, p, M, _, z, N, R) {
    if (e.timeoutHandle = -1, z = t.subtreeFlags, z & 8192 || (z & 16785408) === 16785408) {
      z = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Zt
      }, im(
        t,
        i,
        z
      );
      var V = (i & 62914560) === i ? ru - yt() : (i & 4194048) === i ? cm - yt() : 0;
      if (V = Ky(
        z,
        V
      ), V !== null) {
        oa = i, e.cancelPendingCommit = V(
          Tm.bind(
            null,
            e,
            t,
            i,
            a,
            l,
            n,
            f,
            d,
            p,
            _,
            z,
            null,
            N,
            R
          )
        ), Da(e, i, f, !M);
        return;
      }
    }
    Tm(
      e,
      t,
      i,
      a,
      l,
      n,
      f,
      d,
      p
    );
  }
  function sy(e) {
    for (var t = e; ; ) {
      var a = t.tag;
      if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null)))
        for (var l = 0; l < a.length; l++) {
          var n = a[l], i = n.getSnapshot;
          n = n.value;
          try {
            if (!St(i(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (a = t.child, t.subtreeFlags & 16384 && a !== null)
        a.return = t, t = a;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Da(e, t, a, l) {
    t &= ~Qo, t &= ~il, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - bt(n), f = 1 << i;
      l[i] = -1, n &= ~f;
    }
    a !== 0 && Ar(e, a, t);
  }
  function mu() {
    return (Se & 6) === 0 ? (Yn(0), !1) : !0;
  }
  function Io() {
    if (re !== null) {
      if (Ee === 0)
        var e = re.return;
      else
        e = re, $t = Fa = null, co(e), zl = null, Mn = 0, e = re;
      for (; e !== null; )
        Vd(e.alternate, e), e = e.return;
      re = null;
    }
  }
  function Yl(e, t) {
    var a = e.timeoutHandle;
    a !== -1 && (e.timeoutHandle = -1, Ry(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), oa = 0, Io(), De = e, re = a = Jt(e.current, null), de = t, Ee = 0, Mt = null, Ma = !1, jl = sn(e, t), Yo = !1, Gl = Nt = Qo = il = Na = Be = 0, mt = Gn = null, Vo = !1, (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var n = 31 - bt(l), i = 1 << n;
        t |= e[n], l &= ~i;
      }
    return sa = t, Li(), a;
  }
  function gm(e, t) {
    se = null, w.H = zn, t === Ol || t === Yi ? (t = _f(), Ee = 3) : t === $s ? (t = _f(), Ee = 4) : Ee = t === Co ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Mt = t, re === null && (Be = 1, au(
      e,
      _t(t, e.current)
    ));
  }
  function hm() {
    var e = At.current;
    return e === null ? !0 : (de & 4194048) === de ? Lt === null : (de & 62914560) === de || (de & 536870912) !== 0 ? e === Lt : !1;
  }
  function pm() {
    var e = w.H;
    return w.H = zn, e === null ? zn : e;
  }
  function ym() {
    var e = w.A;
    return w.A = iy, e;
  }
  function gu() {
    Be = 4, Ma || (de & 4194048) !== de && At.current !== null || (jl = !0), (Na & 134217727) === 0 && (il & 134217727) === 0 || De === null || Da(
      De,
      de,
      Nt,
      !1
    );
  }
  function Jo(e, t, a) {
    var l = Se;
    Se |= 2;
    var n = pm(), i = ym();
    (De !== e || de !== t) && (du = null, Yl(e, t)), t = !1;
    var f = Be;
    e: do
      try {
        if (Ee !== 0 && re !== null) {
          var d = re, p = Mt;
          switch (Ee) {
            case 8:
              Io(), f = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              At.current === null && (t = !0);
              var M = Ee;
              if (Ee = 0, Mt = null, Ql(e, d, p, M), a && jl) {
                f = 0;
                break e;
              }
              break;
            default:
              M = Ee, Ee = 0, Mt = null, Ql(e, d, p, M);
          }
        }
        oy(), f = Be;
        break;
      } catch (_) {
        gm(e, _);
      }
    while (!0);
    return t && e.shellSuspendCounter++, $t = Fa = null, Se = l, w.H = n, w.A = i, re === null && (De = null, de = 0, Li()), f;
  }
  function oy() {
    for (; re !== null; ) vm(re);
  }
  function cy(e, t) {
    var a = Se;
    Se |= 2;
    var l = pm(), n = ym();
    De !== e || de !== t ? (du = null, fu = yt() + 500, Yl(e, t)) : jl = sn(
      e,
      t
    );
    e: do
      try {
        if (Ee !== 0 && re !== null) {
          t = re;
          var i = Mt;
          t: switch (Ee) {
            case 1:
              Ee = 0, Mt = null, Ql(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (Df(i)) {
                Ee = 0, Mt = null, bm(t);
                break;
              }
              t = function() {
                Ee !== 2 && Ee !== 9 || De !== e || (Ee = 7), Vt(e);
              }, i.then(t, t);
              break e;
            case 3:
              Ee = 7;
              break e;
            case 4:
              Ee = 5;
              break e;
            case 7:
              Df(i) ? (Ee = 0, Mt = null, bm(t)) : (Ee = 0, Mt = null, Ql(e, t, i, 7));
              break;
            case 5:
              var f = null;
              switch (re.tag) {
                case 26:
                  f = re.memoizedState;
                case 5:
                case 27:
                  var d = re;
                  if (f ? ng(f) : d.stateNode.complete) {
                    Ee = 0, Mt = null;
                    var p = d.sibling;
                    if (p !== null) re = p;
                    else {
                      var M = d.return;
                      M !== null ? (re = M, hu(M)) : re = null;
                    }
                    break t;
                  }
              }
              Ee = 0, Mt = null, Ql(e, t, i, 5);
              break;
            case 6:
              Ee = 0, Mt = null, Ql(e, t, i, 6);
              break;
            case 8:
              Io(), Be = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        ry();
        break;
      } catch (_) {
        gm(e, _);
      }
    while (!0);
    return $t = Fa = null, w.H = l, w.A = n, Se = a, re !== null ? 0 : (De = null, de = 0, Li(), Be);
  }
  function ry() {
    for (; re !== null && !Uh(); )
      vm(re);
  }
  function vm(e) {
    var t = Yd(e.alternate, e, sa);
    e.memoizedProps = e.pendingProps, t === null ? hu(e) : re = t;
  }
  function bm(e) {
    var t = e, a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = xd(
          a,
          t,
          t.pendingProps,
          t.type,
          void 0,
          de
        );
        break;
      case 11:
        t = xd(
          a,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          de
        );
        break;
      case 5:
        co(t);
      default:
        Vd(a, t), t = re = yf(t, sa), t = Yd(a, t, sa);
    }
    e.memoizedProps = e.pendingProps, t === null ? hu(e) : re = t;
  }
  function Ql(e, t, a, l) {
    $t = Fa = null, co(t), zl = null, Mn = 0;
    var n = t.return;
    try {
      if (Wp(
        e,
        n,
        t,
        a,
        de
      )) {
        Be = 1, au(
          e,
          _t(a, e.current)
        ), re = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw re = n, i;
      Be = 1, au(
        e,
        _t(a, e.current)
      ), re = null;
      return;
    }
    t.flags & 32768 ? (ge || l === 1 ? e = !0 : jl || (de & 536870912) !== 0 ? e = !1 : (Ma = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = At.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Sm(t, e)) : hu(t);
  }
  function hu(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Sm(
          t,
          Ma
        );
        return;
      }
      e = t.return;
      var a = ty(
        t.alternate,
        t,
        sa
      );
      if (a !== null) {
        re = a;
        return;
      }
      if (t = t.sibling, t !== null) {
        re = t;
        return;
      }
      re = t = e;
    } while (t !== null);
    Be === 0 && (Be = 5);
  }
  function Sm(e, t) {
    do {
      var a = ay(e.alternate, e);
      if (a !== null) {
        a.flags &= 32767, re = a;
        return;
      }
      if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
        re = e;
        return;
      }
      re = e = a;
    } while (e !== null);
    Be = 6, re = null;
  }
  function Tm(e, t, a, l, n, i, f, d, p) {
    e.cancelPendingCommit = null;
    do
      pu();
    while (Ie !== 0);
    if ((Se & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (i = t.lanes | t.childLanes, i |= xs, Qh(
        e,
        a,
        i,
        f,
        d,
        p
      ), e === De && (re = De = null, de = 0), ql = t, Ra = e, oa = a, Ko = i, Xo = n, rm = l, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, gy(vi, function() {
        return Cm(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
        l = w.T, w.T = null, n = k.p, k.p = 2, f = Se, Se |= 4;
        try {
          ly(e, t, a);
        } finally {
          Se = f, k.p = n, w.T = l;
        }
      }
      Ie = 1, Am(), Em(), Mm();
    }
  }
  function Am() {
    if (Ie === 1) {
      Ie = 0;
      var e = Ra, t = ql, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = w.T, w.T = null;
        var l = k.p;
        k.p = 2;
        var n = Se;
        Se |= 4;
        try {
          am(t, e);
          var i = sc, f = of(e.containerInfo), d = i.focusedElem, p = i.selectionRange;
          if (f !== d && d && d.ownerDocument && sf(
            d.ownerDocument.documentElement,
            d
          )) {
            if (p !== null && Os(d)) {
              var M = p.start, _ = p.end;
              if (_ === void 0 && (_ = M), "selectionStart" in d)
                d.selectionStart = M, d.selectionEnd = Math.min(
                  _,
                  d.value.length
                );
              else {
                var z = d.ownerDocument || document, N = z && z.defaultView || window;
                if (N.getSelection) {
                  var R = N.getSelection(), V = d.textContent.length, ee = Math.min(p.start, V), Re = p.end === void 0 ? ee : Math.min(p.end, V);
                  !R.extend && ee > Re && (f = Re, Re = ee, ee = f);
                  var T = uf(
                    d,
                    ee
                  ), v = uf(
                    d,
                    Re
                  );
                  if (T && v && (R.rangeCount !== 1 || R.anchorNode !== T.node || R.anchorOffset !== T.offset || R.focusNode !== v.node || R.focusOffset !== v.offset)) {
                    var E = z.createRange();
                    E.setStart(T.node, T.offset), R.removeAllRanges(), ee > Re ? (R.addRange(E), R.extend(v.node, v.offset)) : (E.setEnd(v.node, v.offset), R.addRange(E));
                  }
                }
              }
            }
            for (z = [], R = d; R = R.parentNode; )
              R.nodeType === 1 && z.push({
                element: R,
                left: R.scrollLeft,
                top: R.scrollTop
              });
            for (typeof d.focus == "function" && d.focus(), d = 0; d < z.length; d++) {
              var O = z[d];
              O.element.scrollLeft = O.left, O.element.scrollTop = O.top;
            }
          }
          Du = !!uc, sc = uc = null;
        } finally {
          Se = n, k.p = l, w.T = a;
        }
      }
      e.current = t, Ie = 2;
    }
  }
  function Em() {
    if (Ie === 2) {
      Ie = 0;
      var e = Ra, t = ql, a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        a = w.T, w.T = null;
        var l = k.p;
        k.p = 2;
        var n = Se;
        Se |= 4;
        try {
          $d(e, t.alternate, t);
        } finally {
          Se = n, k.p = l, w.T = a;
        }
      }
      Ie = 3;
    }
  }
  function Mm() {
    if (Ie === 4 || Ie === 3) {
      Ie = 0, Lh();
      var e = Ra, t = ql, a = oa, l = rm;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Ie = 5 : (Ie = 0, ql = Ra = null, Nm(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (Ca = null), ds(a), t = t.stateNode, vt && typeof vt.onCommitFiberRoot == "function")
        try {
          vt.onCommitFiberRoot(
            un,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (l !== null) {
        t = w.T, n = k.p, k.p = 2, w.T = null;
        try {
          for (var i = e.onRecoverableError, f = 0; f < l.length; f++) {
            var d = l[f];
            i(d.value, {
              componentStack: d.stack
            });
          }
        } finally {
          w.T = t, k.p = n;
        }
      }
      (oa & 3) !== 0 && pu(), Vt(e), n = e.pendingLanes, (a & 261930) !== 0 && (n & 42) !== 0 ? e === Zo ? qn++ : (qn = 0, Zo = e) : qn = 0, Yn(0);
    }
  }
  function Nm(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, An(t)));
  }
  function pu() {
    return Am(), Em(), Mm(), Cm();
  }
  function Cm() {
    if (Ie !== 5) return !1;
    var e = Ra, t = Ko;
    Ko = 0;
    var a = ds(oa), l = w.T, n = k.p;
    try {
      k.p = 32 > a ? 32 : a, w.T = null, a = Xo, Xo = null;
      var i = Ra, f = oa;
      if (Ie = 0, ql = Ra = null, oa = 0, (Se & 6) !== 0) throw Error(o(331));
      var d = Se;
      if (Se |= 4, sm(i.current), nm(
        i,
        i.current,
        f,
        a
      ), Se = d, Yn(0, !1), vt && typeof vt.onPostCommitFiberRoot == "function")
        try {
          vt.onPostCommitFiberRoot(un, i);
        } catch {
        }
      return !0;
    } finally {
      k.p = n, w.T = l, Nm(e, t);
    }
  }
  function Rm(e, t, a) {
    t = _t(a, t), t = No(e.stateNode, t, 2), e = Sa(e, t, 2), e !== null && (on(e, 2), Vt(e));
  }
  function Me(e, t, a) {
    if (e.tag === 3)
      Rm(e, e, a);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Rm(
            t,
            e,
            a
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (Ca === null || !Ca.has(l))) {
            e = _t(a, e), a = Dd(2), l = Sa(t, a, 2), l !== null && (wd(
              a,
              l,
              t,
              e
            ), on(l, 2), Vt(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function Fo(e, t, a) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new uy();
      var n = /* @__PURE__ */ new Set();
      l.set(t, n);
    } else
      n = l.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), l.set(t, n));
    n.has(a) || (Yo = !0, n.add(a), e = fy.bind(null, e, t, a), t.then(e, e));
  }
  function fy(e, t, a) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, De === e && (de & a) === a && (Be === 4 || Be === 3 && (de & 62914560) === de && 300 > yt() - ru ? (Se & 2) === 0 && Yl(e, 0) : Qo |= a, Gl === de && (Gl = 0)), Vt(e);
  }
  function Dm(e, t) {
    t === 0 && (t = Tr()), e = Za(e, t), e !== null && (on(e, t), Vt(e));
  }
  function dy(e) {
    var t = e.memoizedState, a = 0;
    t !== null && (a = t.retryLane), Dm(e, a);
  }
  function my(e, t) {
    var a = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode, n = e.memoizedState;
        n !== null && (a = n.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    l !== null && l.delete(t), Dm(e, a);
  }
  function gy(e, t) {
    return os(e, t);
  }
  var yu = null, Vl = null, $o = !1, vu = !1, Wo = !1, wa = 0;
  function Vt(e) {
    e !== Vl && e.next === null && (Vl === null ? yu = Vl = e : Vl = Vl.next = e), vu = !0, $o || ($o = !0, py());
  }
  function Yn(e, t) {
    if (!Wo && vu) {
      Wo = !0;
      do
        for (var a = !1, l = yu; l !== null; ) {
          if (e !== 0) {
            var n = l.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var f = l.suspendedLanes, d = l.pingedLanes;
              i = (1 << 31 - bt(42 | e) + 1) - 1, i &= n & ~(f & ~d), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (a = !0, zm(l, i));
          } else
            i = de, i = Ai(
              l,
              l === De ? i : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (i & 3) === 0 || sn(l, i) || (a = !0, zm(l, i));
          l = l.next;
        }
      while (a);
      Wo = !1;
    }
  }
  function hy() {
    wm();
  }
  function wm() {
    vu = $o = !1;
    var e = 0;
    wa !== 0 && Cy() && (e = wa);
    for (var t = yt(), a = null, l = yu; l !== null; ) {
      var n = l.next, i = _m(l, t);
      i === 0 ? (l.next = null, a === null ? yu = n : a.next = n, n === null && (Vl = a)) : (a = l, (e !== 0 || (i & 3) !== 0) && (vu = !0)), l = n;
    }
    Ie !== 0 && Ie !== 5 || Yn(e), wa !== 0 && (wa = 0);
  }
  function _m(e, t) {
    for (var a = e.suspendedLanes, l = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var f = 31 - bt(i), d = 1 << f, p = n[f];
      p === -1 ? ((d & a) === 0 || (d & l) !== 0) && (n[f] = Yh(d, t)) : p <= t && (e.expiredLanes |= d), i &= ~d;
    }
    if (t = De, a = de, a = Ai(
      e,
      e === t ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, a === 0 || e === t && (Ee === 2 || Ee === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && cs(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((a & 3) === 0 || sn(e, a)) {
      if (t = a & -a, t === e.callbackPriority) return t;
      switch (l !== null && cs(l), ds(a)) {
        case 2:
        case 8:
          a = br;
          break;
        case 32:
          a = vi;
          break;
        case 268435456:
          a = Sr;
          break;
        default:
          a = vi;
      }
      return l = Om.bind(null, e), a = os(a, l), e.callbackPriority = t, e.callbackNode = a, t;
    }
    return l !== null && l !== null && cs(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Om(e, t) {
    if (Ie !== 0 && Ie !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var a = e.callbackNode;
    if (pu() && e.callbackNode !== a)
      return null;
    var l = de;
    return l = Ai(
      e,
      e === De ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (dm(e, l, t), _m(e, yt()), e.callbackNode != null && e.callbackNode === a ? Om.bind(null, e) : null);
  }
  function zm(e, t) {
    if (pu()) return null;
    dm(e, t, !0);
  }
  function py() {
    Dy(function() {
      (Se & 6) !== 0 ? os(
        vr,
        hy
      ) : wm();
    });
  }
  function Po() {
    if (wa === 0) {
      var e = wl;
      e === 0 && (e = bi, bi <<= 1, (bi & 261888) === 0 && (bi = 256)), wa = e;
    }
    return wa;
  }
  function Um(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Ci("" + e);
  }
  function Lm(e, t) {
    var a = t.ownerDocument.createElement("input");
    return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
  }
  function yy(e, t, a, l, n) {
    if (t === "submit" && a && a.stateNode === n) {
      var i = Um(
        (n[ot] || null).action
      ), f = l.submitter;
      f && (t = (t = f[ot] || null) ? Um(t.formAction) : f.getAttribute("formAction"), t !== null && (i = t, f = null));
      var d = new _i(
        "action",
        "action",
        null,
        l,
        n
      );
      e.push({
        event: d,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (wa !== 0) {
                  var p = f ? Lm(n, f) : new FormData(n);
                  bo(
                    a,
                    {
                      pending: !0,
                      data: p,
                      method: n.method,
                      action: i
                    },
                    null,
                    p
                  );
                }
              } else
                typeof i == "function" && (d.preventDefault(), p = f ? Lm(n, f) : new FormData(n), bo(
                  a,
                  {
                    pending: !0,
                    data: p,
                    method: n.method,
                    action: i
                  },
                  i,
                  p
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var ec = 0; ec < Hs.length; ec++) {
    var tc = Hs[ec], vy = tc.toLowerCase(), by = tc[0].toUpperCase() + tc.slice(1);
    kt(
      vy,
      "on" + by
    );
  }
  kt(ff, "onAnimationEnd"), kt(df, "onAnimationIteration"), kt(mf, "onAnimationStart"), kt("dblclick", "onDoubleClick"), kt("focusin", "onFocus"), kt("focusout", "onBlur"), kt(Hp, "onTransitionRun"), kt(xp, "onTransitionStart"), kt(Bp, "onTransitionCancel"), kt(gf, "onTransitionEnd"), hl("onMouseEnter", ["mouseout", "mouseover"]), hl("onMouseLeave", ["mouseout", "mouseover"]), hl("onPointerEnter", ["pointerout", "pointerover"]), hl("onPointerLeave", ["pointerout", "pointerover"]), Qa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Qa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Qa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Qa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Qa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Qa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Qn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Sy = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Qn)
  );
  function Hm(e, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < e.length; a++) {
      var l = e[a], n = l.event;
      l = l.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var f = l.length - 1; 0 <= f; f--) {
            var d = l[f], p = d.instance, M = d.currentTarget;
            if (d = d.listener, p !== i && n.isPropagationStopped())
              break e;
            i = d, n.currentTarget = M;
            try {
              i(n);
            } catch (_) {
              Ui(_);
            }
            n.currentTarget = null, i = p;
          }
        else
          for (f = 0; f < l.length; f++) {
            if (d = l[f], p = d.instance, M = d.currentTarget, d = d.listener, p !== i && n.isPropagationStopped())
              break e;
            i = d, n.currentTarget = M;
            try {
              i(n);
            } catch (_) {
              Ui(_);
            }
            n.currentTarget = null, i = p;
          }
      }
    }
  }
  function fe(e, t) {
    var a = t[ms];
    a === void 0 && (a = t[ms] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    a.has(l) || (xm(t, e, 2, !1), a.add(l));
  }
  function ac(e, t, a) {
    var l = 0;
    t && (l |= 4), xm(
      a,
      e,
      l,
      t
    );
  }
  var bu = "_reactListening" + Math.random().toString(36).slice(2);
  function lc(e) {
    if (!e[bu]) {
      e[bu] = !0, Dr.forEach(function(a) {
        a !== "selectionchange" && (Sy.has(a) || ac(a, !1, e), ac(a, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[bu] || (t[bu] = !0, ac("selectionchange", !1, t));
    }
  }
  function xm(e, t, a, l) {
    switch (fg(t)) {
      case 2:
        var n = Iy;
        break;
      case 8:
        n = Jy;
        break;
      default:
        n = vc;
    }
    a = n.bind(
      null,
      t,
      a,
      e
    ), n = void 0, !As || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), l ? n !== void 0 ? e.addEventListener(t, a, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, a, !0) : n !== void 0 ? e.addEventListener(t, a, {
      passive: n
    }) : e.addEventListener(t, a, !1);
  }
  function nc(e, t, a, l, n) {
    var i = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var f = l.tag;
        if (f === 3 || f === 4) {
          var d = l.stateNode.containerInfo;
          if (d === n) break;
          if (f === 4)
            for (f = l.return; f !== null; ) {
              var p = f.tag;
              if ((p === 3 || p === 4) && f.stateNode.containerInfo === n)
                return;
              f = f.return;
            }
          for (; d !== null; ) {
            if (f = dl(d), f === null) return;
            if (p = f.tag, p === 5 || p === 6 || p === 26 || p === 27) {
              l = i = f;
              continue e;
            }
            d = d.parentNode;
          }
        }
        l = l.return;
      }
    Gr(function() {
      var M = i, _ = Ss(a), z = [];
      e: {
        var N = hf.get(e);
        if (N !== void 0) {
          var R = _i, V = e;
          switch (e) {
            case "keypress":
              if (Di(a) === 0) break e;
            case "keydown":
            case "keyup":
              R = mp;
              break;
            case "focusin":
              V = "focus", R = Cs;
              break;
            case "focusout":
              V = "blur", R = Cs;
              break;
            case "beforeblur":
            case "afterblur":
              R = Cs;
              break;
            case "click":
              if (a.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              R = Qr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = tp;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = pp;
              break;
            case ff:
            case df:
            case mf:
              R = np;
              break;
            case gf:
              R = vp;
              break;
            case "scroll":
            case "scrollend":
              R = Ph;
              break;
            case "wheel":
              R = Sp;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = up;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = Kr;
              break;
            case "toggle":
            case "beforetoggle":
              R = Ap;
          }
          var ee = (t & 4) !== 0, Re = !ee && (e === "scroll" || e === "scrollend"), T = ee ? N !== null ? N + "Capture" : null : N;
          ee = [];
          for (var v = M, E; v !== null; ) {
            var O = v;
            if (E = O.stateNode, O = O.tag, O !== 5 && O !== 26 && O !== 27 || E === null || T === null || (O = fn(v, T), O != null && ee.push(
              Vn(v, O, E)
            )), Re) break;
            v = v.return;
          }
          0 < ee.length && (N = new R(
            N,
            V,
            null,
            a,
            _
          ), z.push({ event: N, listeners: ee }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (N = e === "mouseover" || e === "pointerover", R = e === "mouseout" || e === "pointerout", N && a !== bs && (V = a.relatedTarget || a.fromElement) && (dl(V) || V[fl]))
            break e;
          if ((R || N) && (N = _.window === _ ? _ : (N = _.ownerDocument) ? N.defaultView || N.parentWindow : window, R ? (V = a.relatedTarget || a.toElement, R = M, V = V ? dl(V) : null, V !== null && (Re = m(V), ee = V.tag, V !== Re || ee !== 5 && ee !== 27 && ee !== 6) && (V = null)) : (R = null, V = M), R !== V)) {
            if (ee = Qr, O = "onMouseLeave", T = "onMouseEnter", v = "mouse", (e === "pointerout" || e === "pointerover") && (ee = Kr, O = "onPointerLeave", T = "onPointerEnter", v = "pointer"), Re = R == null ? N : rn(R), E = V == null ? N : rn(V), N = new ee(
              O,
              v + "leave",
              R,
              a,
              _
            ), N.target = Re, N.relatedTarget = E, O = null, dl(_) === M && (ee = new ee(
              T,
              v + "enter",
              V,
              a,
              _
            ), ee.target = E, ee.relatedTarget = Re, O = ee), Re = O, R && V)
              t: {
                for (ee = Ty, T = R, v = V, E = 0, O = T; O; O = ee(O))
                  E++;
                O = 0;
                for (var F = v; F; F = ee(F))
                  O++;
                for (; 0 < E - O; )
                  T = ee(T), E--;
                for (; 0 < O - E; )
                  v = ee(v), O--;
                for (; E--; ) {
                  if (T === v || v !== null && T === v.alternate) {
                    ee = T;
                    break t;
                  }
                  T = ee(T), v = ee(v);
                }
                ee = null;
              }
            else ee = null;
            R !== null && Bm(
              z,
              N,
              R,
              ee,
              !1
            ), V !== null && Re !== null && Bm(
              z,
              Re,
              V,
              ee,
              !0
            );
          }
        }
        e: {
          if (N = M ? rn(M) : window, R = N.nodeName && N.nodeName.toLowerCase(), R === "select" || R === "input" && N.type === "file")
            var pe = Pr;
          else if ($r(N))
            if (ef)
              pe = zp;
            else {
              pe = _p;
              var X = wp;
            }
          else
            R = N.nodeName, !R || R.toLowerCase() !== "input" || N.type !== "checkbox" && N.type !== "radio" ? M && vs(M.elementType) && (pe = Pr) : pe = Op;
          if (pe && (pe = pe(e, M))) {
            Wr(
              z,
              pe,
              a,
              _
            );
            break e;
          }
          X && X(e, N, M), e === "focusout" && M && N.type === "number" && M.memoizedProps.value != null && ys(N, "number", N.value);
        }
        switch (X = M ? rn(M) : window, e) {
          case "focusin":
            ($r(X) || X.contentEditable === "true") && (Tl = X, zs = M, bn = null);
            break;
          case "focusout":
            bn = zs = Tl = null;
            break;
          case "mousedown":
            Us = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Us = !1, cf(z, a, _);
            break;
          case "selectionchange":
            if (Lp) break;
          case "keydown":
          case "keyup":
            cf(z, a, _);
        }
        var ce;
        if (Ds)
          e: {
            switch (e) {
              case "compositionstart":
                var me = "onCompositionStart";
                break e;
              case "compositionend":
                me = "onCompositionEnd";
                break e;
              case "compositionupdate":
                me = "onCompositionUpdate";
                break e;
            }
            me = void 0;
          }
        else
          Sl ? Jr(e, a) && (me = "onCompositionEnd") : e === "keydown" && a.keyCode === 229 && (me = "onCompositionStart");
        me && (Xr && a.locale !== "ko" && (Sl || me !== "onCompositionStart" ? me === "onCompositionEnd" && Sl && (ce = qr()) : (ma = _, Es = "value" in ma ? ma.value : ma.textContent, Sl = !0)), X = Su(M, me), 0 < X.length && (me = new Vr(
          me,
          e,
          null,
          a,
          _
        ), z.push({ event: me, listeners: X }), ce ? me.data = ce : (ce = Fr(a), ce !== null && (me.data = ce)))), (ce = Mp ? Np(e, a) : Cp(e, a)) && (me = Su(M, "onBeforeInput"), 0 < me.length && (X = new Vr(
          "onBeforeInput",
          "beforeinput",
          null,
          a,
          _
        ), z.push({
          event: X,
          listeners: me
        }), X.data = ce)), yy(
          z,
          e,
          M,
          a,
          _
        );
      }
      Hm(z, t);
    });
  }
  function Vn(e, t, a) {
    return {
      instance: e,
      listener: t,
      currentTarget: a
    };
  }
  function Su(e, t) {
    for (var a = t + "Capture", l = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = fn(e, a), n != null && l.unshift(
        Vn(e, n, i)
      ), n = fn(e, t), n != null && l.push(
        Vn(e, n, i)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function Ty(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Bm(e, t, a, l, n) {
    for (var i = t._reactName, f = []; a !== null && a !== l; ) {
      var d = a, p = d.alternate, M = d.stateNode;
      if (d = d.tag, p !== null && p === l) break;
      d !== 5 && d !== 26 && d !== 27 || M === null || (p = M, n ? (M = fn(a, i), M != null && f.unshift(
        Vn(a, M, p)
      )) : n || (M = fn(a, i), M != null && f.push(
        Vn(a, M, p)
      ))), a = a.return;
    }
    f.length !== 0 && e.push({ event: t, listeners: f });
  }
  var Ay = /\r\n?/g, Ey = /\u0000|\uFFFD/g;
  function km(e) {
    return (typeof e == "string" ? e : "" + e).replace(Ay, `
`).replace(Ey, "");
  }
  function jm(e, t) {
    return t = km(t), km(e) === t;
  }
  function Ce(e, t, a, l, n, i) {
    switch (a) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || yl(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && yl(e, "" + l);
        break;
      case "className":
        Mi(e, "class", l);
        break;
      case "tabIndex":
        Mi(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Mi(e, a, l);
        break;
      case "style":
        kr(e, l, i);
        break;
      case "data":
        if (t !== "object") {
          Mi(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || a !== "href")) {
          e.removeAttribute(a);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(a);
          break;
        }
        l = Ci("" + l), e.setAttribute(a, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof i == "function" && (a === "formAction" ? (t !== "input" && Ce(e, t, "name", n.name, n, null), Ce(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Ce(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Ce(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Ce(e, t, "encType", n.encType, n, null), Ce(e, t, "method", n.method, n, null), Ce(e, t, "target", n.target, n, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(a);
          break;
        }
        l = Ci("" + l), e.setAttribute(a, l);
        break;
      case "onClick":
        l != null && (e.onclick = Zt);
        break;
      case "onScroll":
        l != null && fe("scroll", e);
        break;
      case "onScrollEnd":
        l != null && fe("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(o(61));
          if (a = l.__html, a != null) {
            if (n.children != null) throw Error(o(60));
            e.innerHTML = a;
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        a = Ci("" + l), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          a
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, "" + l) : e.removeAttribute(a);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, "") : e.removeAttribute(a);
        break;
      case "capture":
      case "download":
        l === !0 ? e.setAttribute(a, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, l) : e.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(a, l) : e.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(a) : e.setAttribute(a, l);
        break;
      case "popover":
        fe("beforetoggle", e), fe("toggle", e), Ei(e, "popover", l);
        break;
      case "xlinkActuate":
        Xt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        Xt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        Xt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        Xt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        Xt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        Xt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        Xt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        Xt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        Xt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        Ei(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = $h.get(a) || a, Ei(e, a, l));
    }
  }
  function ic(e, t, a, l, n, i) {
    switch (a) {
      case "style":
        kr(e, l, i);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(o(61));
          if (a = l.__html, a != null) {
            if (n.children != null) throw Error(o(60));
            e.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof l == "string" ? yl(e, l) : (typeof l == "number" || typeof l == "bigint") && yl(e, "" + l);
        break;
      case "onScroll":
        l != null && fe("scroll", e);
        break;
      case "onScrollEnd":
        l != null && fe("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = Zt);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!wr.hasOwnProperty(a))
          e: {
            if (a[0] === "o" && a[1] === "n" && (n = a.endsWith("Capture"), t = a.slice(2, n ? a.length - 7 : void 0), i = e[ot] || null, i = i != null ? i[a] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof l == "function")) {
              typeof i != "function" && i !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, l, n);
              break e;
            }
            a in e ? e[a] = l : l === !0 ? e.setAttribute(a, "") : Ei(e, a, l);
          }
    }
  }
  function tt(e, t, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        fe("error", e), fe("load", e);
        var l = !1, n = !1, i;
        for (i in a)
          if (a.hasOwnProperty(i)) {
            var f = a[i];
            if (f != null)
              switch (i) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  Ce(e, t, i, f, a, null);
              }
          }
        n && Ce(e, t, "srcSet", a.srcSet, a, null), l && Ce(e, t, "src", a.src, a, null);
        return;
      case "input":
        fe("invalid", e);
        var d = i = f = n = null, p = null, M = null;
        for (l in a)
          if (a.hasOwnProperty(l)) {
            var _ = a[l];
            if (_ != null)
              switch (l) {
                case "name":
                  n = _;
                  break;
                case "type":
                  f = _;
                  break;
                case "checked":
                  p = _;
                  break;
                case "defaultChecked":
                  M = _;
                  break;
                case "value":
                  i = _;
                  break;
                case "defaultValue":
                  d = _;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (_ != null)
                    throw Error(o(137, t));
                  break;
                default:
                  Ce(e, t, l, _, a, null);
              }
          }
        Lr(
          e,
          i,
          d,
          p,
          M,
          f,
          n,
          !1
        );
        return;
      case "select":
        fe("invalid", e), l = f = i = null;
        for (n in a)
          if (a.hasOwnProperty(n) && (d = a[n], d != null))
            switch (n) {
              case "value":
                i = d;
                break;
              case "defaultValue":
                f = d;
                break;
              case "multiple":
                l = d;
              default:
                Ce(e, t, n, d, a, null);
            }
        t = i, a = f, e.multiple = !!l, t != null ? pl(e, !!l, t, !1) : a != null && pl(e, !!l, a, !0);
        return;
      case "textarea":
        fe("invalid", e), i = n = l = null;
        for (f in a)
          if (a.hasOwnProperty(f) && (d = a[f], d != null))
            switch (f) {
              case "value":
                l = d;
                break;
              case "defaultValue":
                n = d;
                break;
              case "children":
                i = d;
                break;
              case "dangerouslySetInnerHTML":
                if (d != null) throw Error(o(91));
                break;
              default:
                Ce(e, t, f, d, a, null);
            }
        xr(e, l, n, i);
        return;
      case "option":
        for (p in a)
          if (a.hasOwnProperty(p) && (l = a[p], l != null))
            switch (p) {
              case "selected":
                e.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                Ce(e, t, p, l, a, null);
            }
        return;
      case "dialog":
        fe("beforetoggle", e), fe("toggle", e), fe("cancel", e), fe("close", e);
        break;
      case "iframe":
      case "object":
        fe("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Qn.length; l++)
          fe(Qn[l], e);
        break;
      case "image":
        fe("error", e), fe("load", e);
        break;
      case "details":
        fe("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        fe("error", e), fe("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (M in a)
          if (a.hasOwnProperty(M) && (l = a[M], l != null))
            switch (M) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Ce(e, t, M, l, a, null);
            }
        return;
      default:
        if (vs(t)) {
          for (_ in a)
            a.hasOwnProperty(_) && (l = a[_], l !== void 0 && ic(
              e,
              t,
              _,
              l,
              a,
              void 0
            ));
          return;
        }
    }
    for (d in a)
      a.hasOwnProperty(d) && (l = a[d], l != null && Ce(e, t, d, l, a, null));
  }
  function My(e, t, a, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null, i = null, f = null, d = null, p = null, M = null, _ = null;
        for (R in a) {
          var z = a[R];
          if (a.hasOwnProperty(R) && z != null)
            switch (R) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                p = z;
              default:
                l.hasOwnProperty(R) || Ce(e, t, R, null, l, z);
            }
        }
        for (var N in l) {
          var R = l[N];
          if (z = a[N], l.hasOwnProperty(N) && (R != null || z != null))
            switch (N) {
              case "type":
                i = R;
                break;
              case "name":
                n = R;
                break;
              case "checked":
                M = R;
                break;
              case "defaultChecked":
                _ = R;
                break;
              case "value":
                f = R;
                break;
              case "defaultValue":
                d = R;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(o(137, t));
                break;
              default:
                R !== z && Ce(
                  e,
                  t,
                  N,
                  R,
                  l,
                  z
                );
            }
        }
        ps(
          e,
          f,
          d,
          p,
          M,
          _,
          i,
          n
        );
        return;
      case "select":
        R = f = d = N = null;
        for (i in a)
          if (p = a[i], a.hasOwnProperty(i) && p != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                R = p;
              default:
                l.hasOwnProperty(i) || Ce(
                  e,
                  t,
                  i,
                  null,
                  l,
                  p
                );
            }
        for (n in l)
          if (i = l[n], p = a[n], l.hasOwnProperty(n) && (i != null || p != null))
            switch (n) {
              case "value":
                N = i;
                break;
              case "defaultValue":
                d = i;
                break;
              case "multiple":
                f = i;
              default:
                i !== p && Ce(
                  e,
                  t,
                  n,
                  i,
                  l,
                  p
                );
            }
        t = d, a = f, l = R, N != null ? pl(e, !!a, N, !1) : !!l != !!a && (t != null ? pl(e, !!a, t, !0) : pl(e, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        R = N = null;
        for (d in a)
          if (n = a[d], a.hasOwnProperty(d) && n != null && !l.hasOwnProperty(d))
            switch (d) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ce(e, t, d, null, l, n);
            }
        for (f in l)
          if (n = l[f], i = a[f], l.hasOwnProperty(f) && (n != null || i != null))
            switch (f) {
              case "value":
                N = n;
                break;
              case "defaultValue":
                R = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(o(91));
                break;
              default:
                n !== i && Ce(e, t, f, n, l, i);
            }
        Hr(e, N, R);
        return;
      case "option":
        for (var V in a)
          if (N = a[V], a.hasOwnProperty(V) && N != null && !l.hasOwnProperty(V))
            switch (V) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ce(
                  e,
                  t,
                  V,
                  null,
                  l,
                  N
                );
            }
        for (p in l)
          if (N = l[p], R = a[p], l.hasOwnProperty(p) && N !== R && (N != null || R != null))
            switch (p) {
              case "selected":
                e.selected = N && typeof N != "function" && typeof N != "symbol";
                break;
              default:
                Ce(
                  e,
                  t,
                  p,
                  N,
                  l,
                  R
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ee in a)
          N = a[ee], a.hasOwnProperty(ee) && N != null && !l.hasOwnProperty(ee) && Ce(e, t, ee, null, l, N);
        for (M in l)
          if (N = l[M], R = a[M], l.hasOwnProperty(M) && N !== R && (N != null || R != null))
            switch (M) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (N != null)
                  throw Error(o(137, t));
                break;
              default:
                Ce(
                  e,
                  t,
                  M,
                  N,
                  l,
                  R
                );
            }
        return;
      default:
        if (vs(t)) {
          for (var Re in a)
            N = a[Re], a.hasOwnProperty(Re) && N !== void 0 && !l.hasOwnProperty(Re) && ic(
              e,
              t,
              Re,
              void 0,
              l,
              N
            );
          for (_ in l)
            N = l[_], R = a[_], !l.hasOwnProperty(_) || N === R || N === void 0 && R === void 0 || ic(
              e,
              t,
              _,
              N,
              l,
              R
            );
          return;
        }
    }
    for (var T in a)
      N = a[T], a.hasOwnProperty(T) && N != null && !l.hasOwnProperty(T) && Ce(e, t, T, null, l, N);
    for (z in l)
      N = l[z], R = a[z], !l.hasOwnProperty(z) || N === R || N == null && R == null || Ce(e, t, z, N, l, R);
  }
  function Gm(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Ny() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), l = 0; l < a.length; l++) {
        var n = a[l], i = n.transferSize, f = n.initiatorType, d = n.duration;
        if (i && d && Gm(f)) {
          for (f = 0, d = n.responseEnd, l += 1; l < a.length; l++) {
            var p = a[l], M = p.startTime;
            if (M > d) break;
            var _ = p.transferSize, z = p.initiatorType;
            _ && Gm(z) && (p = p.responseEnd, f += _ * (p < d ? 1 : (d - M) / (p - M)));
          }
          if (--l, t += 8 * (i + f) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var uc = null, sc = null;
  function Tu(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function qm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Ym(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function oc(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var cc = null;
  function Cy() {
    var e = window.event;
    return e && e.type === "popstate" ? e === cc ? !1 : (cc = e, !0) : (cc = null, !1);
  }
  var Qm = typeof setTimeout == "function" ? setTimeout : void 0, Ry = typeof clearTimeout == "function" ? clearTimeout : void 0, Vm = typeof Promise == "function" ? Promise : void 0, Dy = typeof queueMicrotask == "function" ? queueMicrotask : typeof Vm < "u" ? function(e) {
    return Vm.resolve(null).then(e).catch(wy);
  } : Qm;
  function wy(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function _a(e) {
    return e === "head";
  }
  function Km(e, t) {
    var a = t, l = 0;
    do {
      var n = a.nextSibling;
      if (e.removeChild(a), n && n.nodeType === 8)
        if (a = n.data, a === "/$" || a === "/&") {
          if (l === 0) {
            e.removeChild(n), Il(t);
            return;
          }
          l--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&")
          l++;
        else if (a === "html")
          Kn(e.ownerDocument.documentElement);
        else if (a === "head") {
          a = e.ownerDocument.head, Kn(a);
          for (var i = a.firstChild; i; ) {
            var f = i.nextSibling, d = i.nodeName;
            i[cn] || d === "SCRIPT" || d === "STYLE" || d === "LINK" && i.rel.toLowerCase() === "stylesheet" || a.removeChild(i), i = f;
          }
        } else
          a === "body" && Kn(e.ownerDocument.body);
      a = n;
    } while (a);
    Il(t);
  }
  function Xm(e, t) {
    var a = e;
    e = 0;
    do {
      var l = a.nextSibling;
      if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), l && l.nodeType === 8)
        if (a = l.data, a === "/$") {
          if (e === 0) break;
          e--;
        } else
          a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || e++;
      a = l;
    } while (a);
  }
  function rc(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var a = t;
      switch (t = t.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          rc(a), gs(a);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(a);
    }
  }
  function _y(e, t, a, l) {
    for (; e.nodeType === 1; ) {
      var n = a;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[cn])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (i = e.getAttribute("rel"), i === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (i !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (i = e.getAttribute("src"), (i !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && i && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var i = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === i)
          return e;
      } else return e;
      if (e = Ht(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Oy(e, t, a) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = Ht(e.nextSibling), e === null)) return null;
    return e;
  }
  function Zm(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Ht(e.nextSibling), e === null)) return null;
    return e;
  }
  function fc(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function dc(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function zy(e, t) {
    var a = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || a.readyState !== "loading")
      t();
    else {
      var l = function() {
        t(), a.removeEventListener("DOMContentLoaded", l);
      };
      a.addEventListener("DOMContentLoaded", l), e._reactRetry = l;
    }
  }
  function Ht(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var mc = null;
  function Im(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "/$" || a === "/&") {
          if (t === 0)
            return Ht(e.nextSibling);
          t--;
        } else
          a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Jm(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
          if (t === 0) return e;
          t--;
        } else a !== "/$" && a !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Fm(e, t, a) {
    switch (t = Tu(a), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(o(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(o(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(o(454));
        return e;
      default:
        throw Error(o(451));
    }
  }
  function Kn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    gs(e);
  }
  var xt = /* @__PURE__ */ new Map(), $m = /* @__PURE__ */ new Set();
  function Au(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var ca = k.d;
  k.d = {
    f: Uy,
    r: Ly,
    D: Hy,
    C: xy,
    L: By,
    m: ky,
    X: Gy,
    S: jy,
    M: qy
  };
  function Uy() {
    var e = ca.f(), t = mu();
    return e || t;
  }
  function Ly(e) {
    var t = ml(e);
    t !== null && t.tag === 5 && t.type === "form" ? gd(t) : ca.r(e);
  }
  var Kl = typeof document > "u" ? null : document;
  function Wm(e, t, a) {
    var l = Kl;
    if (l && typeof t == "string" && t) {
      var n = Dt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof a == "string" && (n += '[crossorigin="' + a + '"]'), $m.has(n) || ($m.add(n), e = { rel: e, crossOrigin: a, href: t }, l.querySelector(n) === null && (t = l.createElement("link"), tt(t, "link", e), Je(t), l.head.appendChild(t)));
    }
  }
  function Hy(e) {
    ca.D(e), Wm("dns-prefetch", e, null);
  }
  function xy(e, t) {
    ca.C(e, t), Wm("preconnect", e, t);
  }
  function By(e, t, a) {
    ca.L(e, t, a);
    var l = Kl;
    if (l && e && t) {
      var n = 'link[rel="preload"][as="' + Dt(t) + '"]';
      t === "image" && a && a.imageSrcSet ? (n += '[imagesrcset="' + Dt(
        a.imageSrcSet
      ) + '"]', typeof a.imageSizes == "string" && (n += '[imagesizes="' + Dt(
        a.imageSizes
      ) + '"]')) : n += '[href="' + Dt(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = Xl(e);
          break;
        case "script":
          i = Zl(e);
      }
      xt.has(i) || (e = C(
        {
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : e,
          as: t
        },
        a
      ), xt.set(i, e), l.querySelector(n) !== null || t === "style" && l.querySelector(Xn(i)) || t === "script" && l.querySelector(Zn(i)) || (t = l.createElement("link"), tt(t, "link", e), Je(t), l.head.appendChild(t)));
    }
  }
  function ky(e, t) {
    ca.m(e, t);
    var a = Kl;
    if (a && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Dt(l) + '"][href="' + Dt(e) + '"]', i = n;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Zl(e);
      }
      if (!xt.has(i) && (e = C({ rel: "modulepreload", href: e }, t), xt.set(i, e), a.querySelector(n) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(Zn(i)))
              return;
        }
        l = a.createElement("link"), tt(l, "link", e), Je(l), a.head.appendChild(l);
      }
    }
  }
  function jy(e, t, a) {
    ca.S(e, t, a);
    var l = Kl;
    if (l && e) {
      var n = gl(l).hoistableStyles, i = Xl(e);
      t = t || "default";
      var f = n.get(i);
      if (!f) {
        var d = { loading: 0, preload: null };
        if (f = l.querySelector(
          Xn(i)
        ))
          d.loading = 5;
        else {
          e = C(
            { rel: "stylesheet", href: e, "data-precedence": t },
            a
          ), (a = xt.get(i)) && gc(e, a);
          var p = f = l.createElement("link");
          Je(p), tt(p, "link", e), p._p = new Promise(function(M, _) {
            p.onload = M, p.onerror = _;
          }), p.addEventListener("load", function() {
            d.loading |= 1;
          }), p.addEventListener("error", function() {
            d.loading |= 2;
          }), d.loading |= 4, Eu(f, t, l);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: d
        }, n.set(i, f);
      }
    }
  }
  function Gy(e, t) {
    ca.X(e, t);
    var a = Kl;
    if (a && e) {
      var l = gl(a).hoistableScripts, n = Zl(e), i = l.get(n);
      i || (i = a.querySelector(Zn(n)), i || (e = C({ src: e, async: !0 }, t), (t = xt.get(n)) && hc(e, t), i = a.createElement("script"), Je(i), tt(i, "link", e), a.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, l.set(n, i));
    }
  }
  function qy(e, t) {
    ca.M(e, t);
    var a = Kl;
    if (a && e) {
      var l = gl(a).hoistableScripts, n = Zl(e), i = l.get(n);
      i || (i = a.querySelector(Zn(n)), i || (e = C({ src: e, async: !0, type: "module" }, t), (t = xt.get(n)) && hc(e, t), i = a.createElement("script"), Je(i), tt(i, "link", e), a.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, l.set(n, i));
    }
  }
  function Pm(e, t, a, l) {
    var n = (n = te.current) ? Au(n) : null;
    if (!n) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Xl(a.href), a = gl(
          n
        ).hoistableStyles, l = a.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          e = Xl(a.href);
          var i = gl(
            n
          ).hoistableStyles, f = i.get(e);
          if (f || (n = n.ownerDocument || n, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, f), (i = n.querySelector(
            Xn(e)
          )) && !i._p && (f.instance = i, f.state.loading = 5), xt.has(e) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, xt.set(e, a), i || Yy(
            n,
            e,
            a,
            f.state
          ))), t && l === null)
            throw Error(o(528, ""));
          return f;
        }
        if (t && l !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Zl(a), a = gl(
          n
        ).hoistableScripts, l = a.get(t), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, e));
    }
  }
  function Xl(e) {
    return 'href="' + Dt(e) + '"';
  }
  function Xn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function eg(e) {
    return C({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Yy(e, t, a, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), tt(t, "link", a), Je(t), e.head.appendChild(t));
  }
  function Zl(e) {
    return '[src="' + Dt(e) + '"]';
  }
  function Zn(e) {
    return "script[async]" + e;
  }
  function tg(e, t, a) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + Dt(a.href) + '"]'
          );
          if (l)
            return t.instance = l, Je(l), l;
          var n = C({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), Je(l), tt(l, "style", n), Eu(l, a.precedence, e), t.instance = l;
        case "stylesheet":
          n = Xl(a.href);
          var i = e.querySelector(
            Xn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, Je(i), i;
          l = eg(a), (n = xt.get(n)) && gc(l, n), i = (e.ownerDocument || e).createElement("link"), Je(i);
          var f = i;
          return f._p = new Promise(function(d, p) {
            f.onload = d, f.onerror = p;
          }), tt(i, "link", l), t.state.loading |= 4, Eu(i, a.precedence, e), t.instance = i;
        case "script":
          return i = Zl(a.src), (n = e.querySelector(
            Zn(i)
          )) ? (t.instance = n, Je(n), n) : (l = a, (n = xt.get(i)) && (l = C({}, a), hc(l, n)), e = e.ownerDocument || e, n = e.createElement("script"), Je(n), tt(n, "link", l), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, Eu(l, a.precedence, e));
    return t.instance;
  }
  function Eu(e, t, a) {
    for (var l = a.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = l.length ? l[l.length - 1] : null, i = n, f = 0; f < l.length; f++) {
      var d = l[f];
      if (d.dataset.precedence === t) i = d;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(e, t.firstChild));
  }
  function gc(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function hc(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Mu = null;
  function ag(e, t, a) {
    if (Mu === null) {
      var l = /* @__PURE__ */ new Map(), n = Mu = /* @__PURE__ */ new Map();
      n.set(a, l);
    } else
      n = Mu, l = n.get(a), l || (l = /* @__PURE__ */ new Map(), n.set(a, l));
    if (l.has(e)) return l;
    for (l.set(e, null), a = a.getElementsByTagName(e), n = 0; n < a.length; n++) {
      var i = a[n];
      if (!(i[cn] || i[$e] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = i.getAttribute(t) || "";
        f = e + f;
        var d = l.get(f);
        d ? d.push(i) : l.set(f, [i]);
      }
    }
    return l;
  }
  function lg(e, t, a) {
    e = e.ownerDocument || e, e.head.insertBefore(
      a,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Qy(e, t, a) {
    if (a === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return e = t.disabled, typeof t.precedence == "string" && e == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function ng(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Vy(e, t, a, l) {
    if (a.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (a.state.loading & 4) === 0) {
      if (a.instance === null) {
        var n = Xl(l.href), i = t.querySelector(
          Xn(n)
        );
        if (i) {
          t = i._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Nu.bind(e), t.then(e, e)), a.state.loading |= 4, a.instance = i, Je(i);
          return;
        }
        i = t.ownerDocument || t, l = eg(l), (n = xt.get(n)) && gc(l, n), i = i.createElement("link"), Je(i);
        var f = i;
        f._p = new Promise(function(d, p) {
          f.onload = d, f.onerror = p;
        }), tt(i, "link", l), a.instance = i;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (e.count++, a = Nu.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
    }
  }
  var pc = 0;
  function Ky(e, t) {
    return e.stylesheets && e.count === 0 && Ru(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(a) {
      var l = setTimeout(function() {
        if (e.stylesheets && Ru(e, e.stylesheets), e.unsuspend) {
          var i = e.unsuspend;
          e.unsuspend = null, i();
        }
      }, 6e4 + t);
      0 < e.imgBytes && pc === 0 && (pc = 62500 * Ny());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Ru(e, e.stylesheets), e.unsuspend)) {
            var i = e.unsuspend;
            e.unsuspend = null, i();
          }
        },
        (e.imgBytes > pc ? 50 : 800) + t
      );
      return e.unsuspend = a, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(n);
      };
    } : null;
  }
  function Nu() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Ru(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Cu = null;
  function Ru(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Cu = /* @__PURE__ */ new Map(), t.forEach(Xy, e), Cu = null, Nu.call(e));
  }
  function Xy(e, t) {
    if (!(t.state.loading & 4)) {
      var a = Cu.get(e);
      if (a) var l = a.get(null);
      else {
        a = /* @__PURE__ */ new Map(), Cu.set(e, a);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var f = n[i];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (a.set(f.dataset.precedence, f), l = f);
        }
        l && a.set(null, l);
      }
      n = t.instance, f = n.getAttribute("data-precedence"), i = a.get(f) || l, i === l && a.set(null, n), a.set(f, n), this.count++, l = Nu.bind(this), n.addEventListener("load", l), n.addEventListener("error", l), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var In = {
    $$typeof: $,
    Provider: null,
    Consumer: null,
    _currentValue: P,
    _currentValue2: P,
    _threadCount: 0
  };
  function Zy(e, t, a, l, n, i, f, d, p) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = rs(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = rs(0), this.hiddenUpdates = rs(null), this.identifierPrefix = l, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = p, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function ig(e, t, a, l, n, i, f, d, p, M, _, z) {
    return e = new Zy(
      e,
      t,
      a,
      f,
      p,
      M,
      _,
      z,
      d
    ), t = 1, i === !0 && (t |= 24), i = Tt(3, null, null, t), e.current = i, i.stateNode = e, t = Is(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: l,
      isDehydrated: a,
      cache: t
    }, Ws(i), e;
  }
  function ug(e) {
    return e ? (e = Ml, e) : Ml;
  }
  function sg(e, t, a, l, n, i) {
    n = ug(n), l.context === null ? l.context = n : l.pendingContext = n, l = ba(t), l.payload = { element: a }, i = i === void 0 ? null : i, i !== null && (l.callback = i), a = Sa(e, l, t), a !== null && (gt(a, e, t), Cn(a, e, t));
  }
  function og(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var a = e.retryLane;
      e.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function yc(e, t) {
    og(e, t), (e = e.alternate) && og(e, t);
  }
  function cg(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Za(e, 67108864);
      t !== null && gt(t, e, 67108864), yc(e, 67108864);
    }
  }
  function rg(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ct();
      t = fs(t);
      var a = Za(e, t);
      a !== null && gt(a, e, t), yc(e, t);
    }
  }
  var Du = !0;
  function Iy(e, t, a, l) {
    var n = w.T;
    w.T = null;
    var i = k.p;
    try {
      k.p = 2, vc(e, t, a, l);
    } finally {
      k.p = i, w.T = n;
    }
  }
  function Jy(e, t, a, l) {
    var n = w.T;
    w.T = null;
    var i = k.p;
    try {
      k.p = 8, vc(e, t, a, l);
    } finally {
      k.p = i, w.T = n;
    }
  }
  function vc(e, t, a, l) {
    if (Du) {
      var n = bc(l);
      if (n === null)
        nc(
          e,
          t,
          l,
          wu,
          a
        ), dg(e, l);
      else if ($y(
        n,
        e,
        t,
        a,
        l
      ))
        l.stopPropagation();
      else if (dg(e, l), t & 4 && -1 < Fy.indexOf(e)) {
        for (; n !== null; ) {
          var i = ml(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var f = Ya(i.pendingLanes);
                  if (f !== 0) {
                    var d = i;
                    for (d.pendingLanes |= 2, d.entangledLanes |= 2; f; ) {
                      var p = 1 << 31 - bt(f);
                      d.entanglements[1] |= p, f &= ~p;
                    }
                    Vt(i), (Se & 6) === 0 && (fu = yt() + 500, Yn(0));
                  }
                }
                break;
              case 31:
              case 13:
                d = Za(i, 2), d !== null && gt(d, i, 2), mu(), yc(i, 2);
            }
          if (i = bc(l), i === null && nc(
            e,
            t,
            l,
            wu,
            a
          ), i === n) break;
          n = i;
        }
        n !== null && l.stopPropagation();
      } else
        nc(
          e,
          t,
          l,
          null,
          a
        );
    }
  }
  function bc(e) {
    return e = Ss(e), Sc(e);
  }
  var wu = null;
  function Sc(e) {
    if (wu = null, e = dl(e), e !== null) {
      var t = m(e);
      if (t === null) e = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (e = h(t), e !== null) return e;
          e = null;
        } else if (a === 31) {
          if (e = y(t), e !== null) return e;
          e = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return wu = e, null;
  }
  function fg(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Hh()) {
          case vr:
            return 2;
          case br:
            return 8;
          case vi:
          case xh:
            return 32;
          case Sr:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Tc = !1, Oa = null, za = null, Ua = null, Jn = /* @__PURE__ */ new Map(), Fn = /* @__PURE__ */ new Map(), La = [], Fy = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function dg(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Oa = null;
        break;
      case "dragenter":
      case "dragleave":
        za = null;
        break;
      case "mouseover":
      case "mouseout":
        Ua = null;
        break;
      case "pointerover":
      case "pointerout":
        Jn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Fn.delete(t.pointerId);
    }
  }
  function $n(e, t, a, l, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: a,
      eventSystemFlags: l,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = ml(t), t !== null && cg(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function $y(e, t, a, l, n) {
    switch (t) {
      case "focusin":
        return Oa = $n(
          Oa,
          e,
          t,
          a,
          l,
          n
        ), !0;
      case "dragenter":
        return za = $n(
          za,
          e,
          t,
          a,
          l,
          n
        ), !0;
      case "mouseover":
        return Ua = $n(
          Ua,
          e,
          t,
          a,
          l,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return Jn.set(
          i,
          $n(
            Jn.get(i) || null,
            e,
            t,
            a,
            l,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, Fn.set(
          i,
          $n(
            Fn.get(i) || null,
            e,
            t,
            a,
            l,
            n
          )
        ), !0;
    }
    return !1;
  }
  function mg(e) {
    var t = dl(e.target);
    if (t !== null) {
      var a = m(t);
      if (a !== null) {
        if (t = a.tag, t === 13) {
          if (t = h(a), t !== null) {
            e.blockedOn = t, Cr(e.priority, function() {
              rg(a);
            });
            return;
          }
        } else if (t === 31) {
          if (t = y(a), t !== null) {
            e.blockedOn = t, Cr(e.priority, function() {
              rg(a);
            });
            return;
          }
        } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function _u(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var a = bc(e.nativeEvent);
      if (a === null) {
        a = e.nativeEvent;
        var l = new a.constructor(
          a.type,
          a
        );
        bs = l, a.target.dispatchEvent(l), bs = null;
      } else
        return t = ml(a), t !== null && cg(t), e.blockedOn = a, !1;
      t.shift();
    }
    return !0;
  }
  function gg(e, t, a) {
    _u(e) && a.delete(t);
  }
  function Wy() {
    Tc = !1, Oa !== null && _u(Oa) && (Oa = null), za !== null && _u(za) && (za = null), Ua !== null && _u(Ua) && (Ua = null), Jn.forEach(gg), Fn.forEach(gg);
  }
  function Ou(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Tc || (Tc = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      Wy
    )));
  }
  var zu = null;
  function hg(e) {
    zu !== e && (zu = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        zu === e && (zu = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t], l = e[t + 1], n = e[t + 2];
          if (typeof l != "function") {
            if (Sc(l || a) === null)
              continue;
            break;
          }
          var i = ml(a);
          i !== null && (e.splice(t, 3), t -= 3, bo(
            i,
            {
              pending: !0,
              data: n,
              method: a.method,
              action: l
            },
            l,
            n
          ));
        }
      }
    ));
  }
  function Il(e) {
    function t(p) {
      return Ou(p, e);
    }
    Oa !== null && Ou(Oa, e), za !== null && Ou(za, e), Ua !== null && Ou(Ua, e), Jn.forEach(t), Fn.forEach(t);
    for (var a = 0; a < La.length; a++) {
      var l = La[a];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < La.length && (a = La[0], a.blockedOn === null); )
      mg(a), a.blockedOn === null && La.shift();
    if (a = (e.ownerDocument || e).$$reactFormReplay, a != null)
      for (l = 0; l < a.length; l += 3) {
        var n = a[l], i = a[l + 1], f = n[ot] || null;
        if (typeof i == "function")
          f || hg(a);
        else if (f) {
          var d = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, f = i[ot] || null)
              d = f.formAction;
            else if (Sc(n) !== null) continue;
          } else d = f.action;
          typeof d == "function" ? a[l + 1] = d : (a.splice(l, 3), l -= 3), hg(a);
        }
      }
  }
  function pg() {
    function e(i) {
      i.canIntercept && i.info === "react-transition" && i.intercept({
        handler: function() {
          return new Promise(function(f) {
            return n = f;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      n !== null && (n(), n = null), l || setTimeout(a, 20);
    }
    function a() {
      if (!l && !navigation.transition) {
        var i = navigation.currentEntry;
        i && i.url != null && navigation.navigate(i.url, {
          state: i.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1, n = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
        l = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function Ac(e) {
    this._internalRoot = e;
  }
  Uu.prototype.render = Ac.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var a = t.current, l = Ct();
    sg(a, l, e, t, null, null);
  }, Uu.prototype.unmount = Ac.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      sg(e.current, 2, null, e, null, null), mu(), t[fl] = null;
    }
  };
  function Uu(e) {
    this._internalRoot = e;
  }
  Uu.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Nr();
      e = { blockedOn: null, target: e, priority: t };
      for (var a = 0; a < La.length && t !== 0 && t < La[a].priority; a++) ;
      La.splice(a, 0, e), a === 0 && mg(e);
    }
  };
  var yg = s.version;
  if (yg !== "19.2.4")
    throw Error(
      o(
        527,
        yg,
        "19.2.4"
      )
    );
  k.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = g(t), e = e !== null ? A(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Py = {
    bundleType: 0,
    version: "19.2.4",
    rendererPackageName: "react-dom",
    currentDispatcherRef: w,
    reconcilerVersion: "19.2.4"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Lu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Lu.isDisabled && Lu.supportsFiber)
      try {
        un = Lu.inject(
          Py
        ), vt = Lu;
      } catch {
      }
  }
  return Pn.createRoot = function(e, t) {
    if (!r(e)) throw Error(o(299));
    var a = !1, l = "", n = Md, i = Nd, f = Cd;
    return t != null && (t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (f = t.onRecoverableError)), t = ig(
      e,
      1,
      !1,
      null,
      null,
      a,
      l,
      null,
      n,
      i,
      f,
      pg
    ), e[fl] = t.current, lc(e), new Ac(t);
  }, Pn.hydrateRoot = function(e, t, a) {
    if (!r(e)) throw Error(o(299));
    var l = !1, n = "", i = Md, f = Nd, d = Cd, p = null;
    return a != null && (a.unstable_strictMode === !0 && (l = !0), a.identifierPrefix !== void 0 && (n = a.identifierPrefix), a.onUncaughtError !== void 0 && (i = a.onUncaughtError), a.onCaughtError !== void 0 && (f = a.onCaughtError), a.onRecoverableError !== void 0 && (d = a.onRecoverableError), a.formState !== void 0 && (p = a.formState)), t = ig(
      e,
      1,
      !0,
      t,
      a ?? null,
      l,
      n,
      p,
      i,
      f,
      d,
      pg
    ), t.context = ug(null), a = t.current, l = Ct(), l = fs(l), n = ba(l), n.callback = null, Sa(a, n, l), a = l, t.current.lanes = a, on(t, a), Vt(t), e[fl] = t.current, lc(e), new Uu(t);
  }, Pn.version = "19.2.4", Pn;
}
var Rg;
function f0() {
  if (Rg) return Mc.exports;
  Rg = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (s) {
        console.error(s);
      }
  }
  return u(), Mc.exports = r0(), Mc.exports;
}
var ar = f0(), Z = tr(), d0 = $g();
function Wg({
  open: u,
  onClose: s,
  children: c,
  width: o = 680,
  height: r = 520,
  maskClosable: m = !0,
  closable: h = !0
}) {
  const y = Z.useRef(null), S = Z.useRef(null), g = Z.useRef(null), A = Z.useRef(!1), [C, L] = Z.useState(!1), [B, q] = Z.useState(!1);
  if (Z.useEffect(() => {
    u ? (L(!0), q(!1)) : C && q(!0);
  }, [u]), Z.useEffect(() => {
    if (!B) return;
    const G = S.current;
    if (!G) {
      L(!1), q(!1);
      return;
    }
    const J = (oe) => {
      oe.target === G && (L(!1), q(!1));
    };
    return G.addEventListener("animationend", J), () => G.removeEventListener("animationend", J);
  }, [B]), Z.useEffect(() => {
    if (!u) return;
    const G = (J) => {
      J.key === "Escape" && s();
    };
    return document.addEventListener("keydown", G), () => document.removeEventListener("keydown", G);
  }, [u, s]), Z.useEffect(() => {
    if (!C || B) return;
    const G = g.current;
    if (!G) return;
    const J = G.getContext("2d");
    if (!J) return;
    let oe, Q = !1;
    const ne = [], he = () => {
      const I = G.parentElement;
      if (I) {
        const at = I.offsetWidth, He = I.offsetHeight;
        at > 0 && He > 0 && (G.width = at, G.height = He);
      }
    }, ve = () => {
      if (!(Q || G.width === 0 || G.height === 0)) {
        Q = !0;
        for (let I = 0; I < 80; I++)
          ne.push({
            x: Math.random() * G.width,
            y: Math.random() * G.height,
            size: Math.random() * 1.5 + 0.5,
            speedY: Math.random() * 0.4 + 0.1,
            speedX: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.3 + 0.1,
            isGold: Math.random() > 0.7
          });
      }
    }, Le = () => {
      Q || (he(), ve()), J.clearRect(0, 0, G.width, G.height), ne.forEach((I) => {
        I.y -= I.speedY, I.x += I.speedX, I.opacity += (Math.random() - 0.5) * 0.02, I.opacity < 0.1 && (I.opacity = 0.1), I.opacity > 0.5 && (I.opacity = 0.5), I.y < 0 && (I.y = G.height, I.x = Math.random() * G.width), I.isGold ? (J.shadowBlur = 4, J.shadowColor = `rgba(200, 170, 110, ${I.opacity})`) : (J.shadowBlur = 3, J.shadowColor = `rgba(0, 180, 255, ${I.opacity * 0.8})`), J.beginPath(), J.arc(I.x, I.y, I.size, 0, Math.PI * 2), J.fillStyle = I.isGold ? `rgba(220, 190, 130, ${I.opacity})` : `rgba(80, 200, 255, ${I.opacity * 0.85})`, J.fill();
      }), J.shadowBlur = 0, J.shadowColor = "transparent", oe = requestAnimationFrame(Le);
    };
    return oe = requestAnimationFrame(Le), window.addEventListener("resize", he), () => {
      window.removeEventListener("resize", he), cancelAnimationFrame(oe);
    };
  }, [C, B]), Z.useEffect(() => (C && !B && (document.body.style.overflow = "hidden"), C || (document.body.style.overflow = ""), () => {
    document.body.style.overflow = "";
  }), [C, B]), !C) return null;
  const K = {
    width: typeof o == "number" ? `${o}px` : o,
    height: typeof r == "number" ? `${r}px` : r
  }, x = `sona-modal-overlay${B ? " sona-modal-closing" : ""}`, ae = `sona-modal-dialog${B ? " sona-modal-closing" : ""}`, Y = (G) => {
    A.current = G.target === G.currentTarget, G.stopPropagation();
  }, $ = (G) => {
    const J = m && A.current && G.target === G.currentTarget;
    A.current = !1, G.stopPropagation(), J && s();
  };
  return d0.createPortal(
    /* @__PURE__ */ D.jsx(
      "div",
      {
        ref: S,
        className: x,
        onClick: (G) => G.stopPropagation(),
        onMouseDown: Y,
        onMouseUp: $,
        children: /* @__PURE__ */ D.jsxs(
          "div",
          {
            ref: y,
            className: ae,
            style: K,
            onClick: (G) => G.stopPropagation(),
            children: [
              /* @__PURE__ */ D.jsx(
                "canvas",
                {
                  ref: g,
                  className: "sona-modal-particle-canvas"
                }
              ),
              h && /* @__PURE__ */ D.jsx("button", { className: "sona-modal-close", onClick: s, title: "Close", children: /* @__PURE__ */ D.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ D.jsx("path", { d: "M1 1L13 13M13 1L1 13", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }) }),
              /* @__PURE__ */ D.jsx("div", { className: "sona-modal-body", children: c })
            ]
          }
        )
      }
    ),
    // 挂到 body，避免 #sona-root 的低层级 stacking context 被客户端透明层盖住，
    // 出现弹窗可见但关闭按钮无法接收点击的情况。
    document.body
  );
}
const xa = {
  autoAcceptMatch: !1,
  allowDeclineAfterAccept: !0,
  autoAcceptDelayMin: 0,
  autoAcceptDelayMax: 0,
  developerMode: !1,
  unlockStatus: !0,
  unlockAvailability: !1,
  benchNoCooldown: !1,
  sidebarCollapsed: !1,
  availability: "chat",
  statusMessage: {},
  hotkey: "F1",
  hideSonaIcon: !1,
  locale: "auto",
  skippedUpdateVersion: null,
  windowEffect: "none",
  champSelectAssist: !1,
  opggBuildRecommendation: !1,
  smartBuildRecommendation: !0,
  smartRunePages: {},
  smartSummonerSpells: {},
  gameSettingsBackups: {},
  opggBuildRecommendationTier: "emerald_plus",
  analyzeTeamPower: !1,
  analyzeTeamPowerMsgType: "celebration",
  analyzeTeamPowerFetchCount: 50,
  champSelectAssistFetchCount: 50,
  gameAnalysisFetchCount: 50,
  sideIndicator: !1,
  sideIndicatorMsgType: "celebration",
  globalParticle: !1,
  beautifyWallpaperMode: !1,
  beautifyWallpaperSceneBlur: 4,
  beautifyWallpaperSceneOpacity: 15,
  beautifyHomepageBackgroundAssetPath: null,
  beautifyHomepageBackgroundAssetPaths: [],
  beautifyHomepageBackgroundRandom: !1,
  beautifyHomepageBackgroundLastRandomAssetPath: null,
  beautifyHomepageBackgroundAdjustments: {},
  beautifyHomepageBackgroundBlur: 0,
  beautifyHomepageBackgroundOpacity: 0,
  beautifyGlassBlur: 14,
  beautifyGlassOpacity: 28,
  beautifyNavbarBlur: 10,
  beautifyNavbarHideLines: !1,
  beautifySummonerNameEffect: {
    enabled: !1,
    startColor: "#c8aa6e",
    endColor: "#4a9eff",
    angle: 90
  },
  beautifyAssetPaths: [],
  customAvatarAssetPaths: [],
  customAvatarRemoteCache: {},
  friendSmartGroup: !1,
  enhancedFriendGameStatus: !0,
  lobbyEnhancement: !0,
  lobbyEnhancementFetchCount: 50,
  hideTFT: !1,
  gameModeFilter: !0,
  hiddenGameModes: {},
  hideRightNavText: !1,
  hideEsportsPopup: !0,
  customProfileBg: !1,
  ignoreProfilePrivacy: !0,
  customBanner: !1,
  customBannerSelection: null,
  autoHonor: !1,
  rankDisguise: !1,
  rankQueue: "RANKED_SOLO_5x5",
  rankTier: "CHALLENGER",
  rankDivision: "I",
  autoLockChampion: !1,
  autoLockChampionIds: [],
  autoLockInstant: !0,
  autoBanChampion: !1,
  autoBanChampionIds: [],
  balanceBuffTooltip: !1,
  unlockChromas: !0,
  champSelectQuitButton: !1,
  gameAnalysisPopup: !1,
  autoReturnToLobby: !1,
  autoReturnMode: "queue",
  quickLobbyMode: !1,
  quickLobbyQueueId: 430
}, Dg = "sona:";
class m0 {
  constructor() {
    Te(this, "listeners", /* @__PURE__ */ new Map());
    Te(this, "cache");
    const s = { ...xa };
    for (const c of Object.keys(xa))
      s[c] = this.readFromDisk(c);
    this.cache = s;
  }
  /**
   * 获取配置值
   */
  get(s) {
    return this.cache[s];
  }
  /**
   * 设置配置值（自动持久化 + 触发监听）
   */
  set(s, c) {
    if (this.cache[s] === c) return;
    this.cache[s] = c, DataStore.set(`${Dg}${s}`, c);
    const r = this.listeners.get(s);
    r && r.forEach((m) => {
      try {
        m(c, s);
      } catch {
      }
    });
  }
  /**
   * 切换布尔值配置
   */
  toggle(s) {
    const c = this.get(s);
    if (typeof c != "boolean") return c;
    const o = !c;
    return this.set(s, o), o;
  }
  /**
   * 监听配置变化
   * @returns 取消监听的函数
   */
  onChange(s, c) {
    let o = this.listeners.get(s);
    return o || (o = /* @__PURE__ */ new Set(), this.listeners.set(s, o)), o.add(c), () => {
      o.delete(c);
    };
  }
  /**
   * 重置所有配置为默认值
   */
  resetAll() {
    for (const s of Object.keys(xa))
      this.set(s, xa[s]);
  }
  /**
   * 重置单个配置为默认值
   */
  reset(s) {
    this.set(s, xa[s]);
  }
  /**
   * 获取所有配置的快照
   */
  getAll() {
    const s = { ...xa };
    for (const c of Object.keys(xa))
      s[c] = this.get(c);
    return s;
  }
  // ---- 内部方法 ----
  readFromDisk(s) {
    const c = DataStore.get(`${Dg}${s}`);
    return c !== void 0 ? c : xa[s];
  }
}
const pt = new m0(), g0 = {
  "common.apply": "应用",
  "common.cancel": "取消",
  "common.close": "关闭",
  "common.confirm": "确认",
  "common.delete": "删除",
  "common.download": "下载",
  "common.failed": "失败",
  "common.loading": "加载中...",
  "common.noData": "暂无数据",
  "common.remove": "移除",
  "common.reset": "重置",
  "common.restore": "恢复",
  "common.save": "保存",
  "common.success": "成功",
  "common.unknown": "未知",
  "common.win": "胜利",
  "common.loss": "失败",
  "common.today": "今天",
  "common.yesterday": "昨天",
  "common.dayBeforeYesterday": "前天",
  "nav.home": "主页",
  "nav.tools": "工具",
  "nav.beautify": "美化",
  "nav.settings": "设置",
  "nav.about": "关于",
  "nav.debug": "调试",
  "nav.rewards": "领取",
  "nav.updateAvailable": "检测到新版本",
  "sidebar.expand": "展开侧边栏",
  "sidebar.collapse": "收起侧边栏",
  "settings.title": "设置",
  "settings.group.general": "通用",
  "settings.group.advanced": "高级选项",
  "settings.language.title": "界面语言",
  "settings.language.description": "选择 Sona 语言。",
  "settings.language.auto": "自动",
  "settings.language.zhCN": "简体中文",
  "settings.language.enUS": "English",
  "settings.hotkey.title": "面板快捷键",
  "settings.hotkey.description": "随时按下快捷键打开/关闭 Sona 面板。",
  "settings.hideSonaIcon.title": "隐藏琴女 Icon",
  "settings.hideSonaIcon.description": "隐藏 Play 按钮旁的 Sona 入口图标；隐藏后仍可按 {hotkey} 打开面板。",
  "settings.globalParticle.title": "全局粒子美化",
  "settings.globalParticle.description": "为客户端添加星光粒子背景效果",
  "settings.skippedUpdate.title": "已跳过 v{version} 版本更新",
  "settings.skippedUpdate.description": "Sona 不会再提示这个版本；恢复提醒后会重新检查更新。",
  "settings.skippedUpdate.clear": "恢复更新提醒",
  "settings.developerMode.title": "开发者模式",
  "settings.developerMode.description": "启用调试面板，你最好知道你在做什么 ( ˘•ω•˘ )◞⚠",
  "select.placeholder": "请选择...",
  "home.heading": "欢迎使用 Sona",
  "home.subtitle": "你的英雄联盟客户端增强工具",
  "home.quote": '"本项目完全开源免费，如果你通过收费渠道使用，那你被骗啦!"',
  "home.quoteAuthor": "—— 神奇的WJZ_P",
  "about.description": "Sona 是一款基于 React + Vite 构建的英雄联盟客户端增强插件，运行在 Pengu Loader 之上，提供丰富的自定义功能。",
  "about.card.plugin": "插件",
  "about.card.framework": "框架",
  "about.card.loader": "加载器",
  "about.techStack": "技术栈",
  "about.license": "开源协议",
  "update.title": "检测到Sona新版本",
  "update.titleWithVersion": "检测到Sona新版本：",
  "update.downloadTitle": "下载方式",
  "update.downloadDescription": "请到 Release 地址、群文件或夸克网盘下载新版 Sona。",
  "update.openRelease": "打开 Release",
  "update.groupFile": "官方QQ群：1097295981",
  "update.quark": "夸克网盘",
  "update.skipVersion": "跳过 v{version}",
  "update.checking": "正在检查更新...",
  "update.checkFailed": "检查更新失败：{error}",
  "update.none": "当前没有检测到新版本。",
  "update.recheck": "重新检查",
  "rewards.title": "通行证奖励领取",
  "rewards.hint": "这里列出所有「待领取」的奖励，可以选择性领取。",
  "rewards.refresh": "刷新",
  "rewards.empty": "当前没有待选择的奖励喵～",
  "rewards.loadFailed": "加载失败：{error}",
  "rewards.untitled": "未命名奖励",
  "rewards.selectHintRange": "请选择 {min}-{max} 个",
  "rewards.selectHintExact": "请选择 {count} 个",
  "rewards.selectedCount": "已选 {count}/{max}",
  "rewards.claim": "领取",
  "rewards.claimSelected": "领取所选 ({count})",
  "rewards.claiming": "领取中...",
  "rewards.claimSuccess": "已领取：{items}",
  "rewards.claimFailed": "领取失败：{error}",
  "rewards.quantity": "x{count}",
  "tools.title": "工具",
  "tools.group.matchQuery": "战绩查询",
  "tools.group.match": "对局相关",
  "tools.group.social": "社交",
  "tools.group.interface": "界面",
  "tools.group.rankDisguise": "段位伪装",
  "tools.group.replay": "回放工具",
  "tools.group.backup": "游戏设置备份",
  "tools.matchQuery.description": "输入召唤师名#Tag 查询任意玩家的近期战绩，不支持跨联盟大区查询。",
  "tools.matchQuery.placeholder": "名字#Tag (例:丨一疾风剑豪一丨#77772)",
  "tools.matchQuery.search": "查询战绩",
  "tools.matchQuery.invalid": "格式错误，请输入: 名字#Tag",
  "tools.matchQuery.notFound": "未找到该召唤师",
  "tools.matchQuery.failed": "查询失败，请检查名字和Tag是否正确",
  "tools.autoAccept.title": "自动接受对局",
  "tools.autoAccept.description": "匹配到对局时自动点击接受，再也不会错过。",
  "tools.autoAcceptDelay.title": "自动接受的随机延迟",
  "tools.autoAcceptDelay.description": "在区间内随机延迟后再接受（上限 15000ms）。",
  "tools.allowDeclineAfterAccept.title": "允许接受后再拒绝",
  "tools.allowDeclineAfterAccept.description": "接受对局后保持拒绝按钮可点，让你能随时反悔；接受/拒绝始终可自由切换。(拒绝按钮灰色，但可以点击)",
  "tools.benchNoCooldown.title": "大乱斗无CD换英雄",
  "tools.benchNoCooldown.description": "移除共享池英雄的切换冷却限制，随时换取心仪英雄。",
  "tools.analyzeTeamPower.title": "分析友方战力",
  "tools.analyzeTeamPower.description": "进入英雄选择时，自动分析队友近期战绩并发送到队伍聊天框。",
  "tools.sideIndicator.title": "红蓝方提示",
  "tools.sideIndicator.description": "进入英雄选择时，在聊天框提示本局是蓝方还是红方。",
  "tools.champSelectAssist.title": "英雄选择阶段增强",
  "tools.champSelectAssist.description": "英雄选择时显示粒子特效、队友近期胜率/KDA 和英雄 T 级角标；点击队友头像可查询近期战绩。",
  "tools.opggBuildRecommendation.title": "配装推荐面板",
  "tools.opggBuildRecommendation.description": "锁定英雄后，点击皮肤选择下方的按钮以打开当前英雄的 OP.GG 配装、符文和海克斯推荐。",
  "tools.smartBuildRecommendation.title": "智能配装 & 符文 & 召唤师技能",
  "tools.smartBuildRecommendation.description": "根据模式和英雄智能配装、保存并恢复符文与召唤师技能；首次使用会在进入游戏前记录最终配置。",
  "tools.balanceBuffTooltip.title": "平衡性调整buff提示",
  "tools.balanceBuffTooltip.description": "游玩特定模式（大乱斗、无限火力）时，鼠标悬停在英雄头像上，显示对应的平衡性数值调整。",
  "tools.champSelectQuitButton.title": "选人阶段退出按钮",
  "tools.champSelectQuitButton.description": "非自定义对局的英雄选择中支持右下角点击秒退。",
  "tools.gameAnalysisPopup.title": "全局战力分析弹窗",
  "tools.gameAnalysisPopup.description": "进入游戏后，自动弹窗展示双方队伍战力分析，包括胜率、KDA、段位、开黑分组。(注，不是直接在游戏内展示，需要切回客户端查看)",
  "tools.autoReturn.title": "对局结束自动返回房间",
  "tools.autoReturn.description": "对局结束后自动返回房间，省去手动操作。可选择自动排队或仅返回房间。",
  "tools.autoHonor.title": "对局结束自动点赞",
  "tools.autoHonor.description": "对局结束后，随机给队友点赞，再也不用手点啦。",
  "tools.autoLock.title": "秒抢英雄",
  "tools.autoLock.description": "进入可选英雄的模式时，轮到自己自动秒锁指定英雄；排位被系统补位时会自动跳过。大乱斗等无需选人的模式不受影响。",
  "tools.autoLock.searchPlaceholder": "输入英雄名/称号搜索 (如: 亚索)",
  "tools.autoLock.lock": "秒选并锁定",
  "tools.autoLock.preselect": "仅预选",
  "tools.autoLock.empty": "还没有添加秒抢英雄，按优先级从左到右尝试。",
  "tools.autoBan.title": "自动 Ban 英雄",
  "tools.autoBan.description": "进入有禁用阶段的模式时，轮到自己自动禁用指定英雄。匹配、大乱斗等无ban的不受影响。",
  "tools.autoBan.searchPlaceholder": "搜索要 Ban 的英雄 (如: 亚索 / Yasuo)",
  "tools.autoBan.empty": "还没有添加自动 Ban 英雄，按优先级从左到右尝试。",
  "tools.unlockStatus.title": "解锁自定义签名",
  "tools.unlockStatus.description": "移除客户端对签名编辑的禁用限制，可自由修改个人签名。",
  "tools.unlockAvailability.title": "解锁在线状态切换",
  "tools.unlockAvailability.description": "接管客户端的状态按钮，支持切换至隐身、手机在线等客户端默认不提供的状态。",
  "tools.unlockChromas.title": "解锁炫彩分页（国服）",
  "tools.unlockChromas.description": "在生涯藏品页恢复被隐藏的「炫彩」子分页。修改开关后需要重启客户端才能生效。",
  "tools.removeCrest.title": "卸下头像边框",
  "tools.removeCrest.description": "移除头像框装饰，恢复干净的头像展示。(需召唤师等级>=525)",
  "tools.removeChallengeBadges.title": "卸下身份徽章",
  "tools.removeChallengeBadges.description": "一键清空头像下方展示的三个挑战徽章，恢复干净的身份卡片。",
  "tools.removeIcon.title": "卸下头像",
  "tools.removeIcon.description": "将召唤师头像恢复为客户端默认头像。",
  "tools.unequip": "卸下",
  "tools.customProfileBg.title": "自定义生涯背景",
  "tools.customProfileBg.description": "增强修改生涯背景弹窗，可以选择任意皮肤作为生涯背景。(好友可见)",
  "tools.customBanner.title": "自定义旗帜",
  "tools.customBanner.description": "在原有设置旗帜处新增自定义旗帜按钮，更换的旗帜仅自己可见。",
  "tools.friendSmartGroup.title": "开黑好友标记",
  "tools.friendSmartGroup.description": "好友列表中，开黑中的好友在右侧用同样颜色标记，看看谁在偷偷开黑！",
  "tools.enhancedFriendStatus.title": "增强游戏中好友状态",
  "tools.enhancedFriendStatus.description": "好友游戏中时，在右侧好友列表显示游戏模式和对局时长。",
  "tools.lobbyEnhancement.title": "组队界面增强",
  "tools.lobbyEnhancement.description": "开启后，组队界面点击头像即可查看召唤师战绩，且旗帜上方显示近期表现。",
  "tools.gameModeFilter.title": "模式过滤",
  "tools.gameModeFilter.description": "在主页玩家对战分页的导航栏右侧显示模式勾选框，可隐藏不常玩的游戏模式（如海克斯大乱斗、云顶之弈等）。",
  "tools.quickLobby.title": "快速大厅模式",
  "tools.quickLobby.description": "点击主页 Play 按钮时跳过模式选择，直接进入选定的目标队列大厅。",
  "tools.quickLobby.placeholder": "选择目标队列",
  "tools.hideTFT.title": "隐藏首页云顶之弈",
  "tools.hideTFT.description": "隐藏顶部导航栏的云顶之弈入口。",
  "tools.hideRightNavText.title": "隐藏右侧导航文字",
  "tools.hideRightNavText.description": "隐藏主页顶部右侧导航栏的文字标签，仅保留图标，界面更简洁。",
  "tools.hideEsportsPopup.title": "关闭赛事直播弹窗",
  "tools.hideEsportsPopup.description": "自动移除客户端右下角弹出的官方赛事直播浮窗。",
  "tools.windowEffect.title": "窗口特效",
  "tools.windowEffect.description": "为客户端窗口添加毛玻璃等视觉效果。Win10 拖动窗口时可能卡顿。但实际测试下来好像没啥效果？",
  "tools.rankDisguise.description": "伪装好友列表中显示的段位信息，仅影响聊天名片展示，不影响生涯页面。(好友可见)",
  "tools.replay.description": "输入 Game ID 下载或直接观看回放。",
  "tools.replay.placeholder": "输入 Game ID...",
  "tools.replay.status.idle": "准备就绪",
  "tools.replay.status.downloading": "⏳ 下载中...",
  "tools.replay.status.ready": "✅ 已下载",
  "tools.replay.status.launching": "🚀 启动中...",
  "tools.replay.status.error": "❌ 操作失败",
  "tools.replay.watch": "直接观看",
  "tools.replay.download": "下载回放",
  "tools.backup.placeholder": "输入备份名称 (如: 排位设置)",
  "tools.backup.description": "备份当前客户端设置（快捷键、界面布局等），支持多个命名存档。",
  "tools.backup.save": "保存备份",
  "tools.backup.nameRequired": "❌ 请输入备份名称",
  "tools.backup.saving": "⏳ 备份中...",
  "tools.backup.success": "✅ 备份成功",
  "tools.backup.failed": "❌ 备份失败",
  "tools.backup.restoring": '⏳ 恢复 "{name}" 中...',
  "tools.backup.restored": '✅ "{name}" 已恢复',
  "tools.backup.restoreFailed": "❌ 恢复失败",
  "tools.backup.deleted": '已删除 "{name}"',
  "option.recent.20": "近20局",
  "option.recent.50": "近50局",
  "option.recent.100": "近100局",
  "option.visibility.self": "自己可见",
  "option.visibility.team": "全队可见",
  "option.autoReturn.queue": "自动排队",
  "option.autoReturn.lobby": "仅返回房间",
  "option.windowEffect.none": "无（默认）",
  "option.windowEffect.blurbehind": "毛玻璃",
  "option.windowEffect.acrylic": "亚克力",
  "option.windowEffect.unified": "混合",
  "option.windowEffect.mica": "云母 (Win11)",
  "option.windowEffect.transparent": "透明",
  "rank.CHALLENGER": "最强王者",
  "rank.GRANDMASTER": "傲世宗师",
  "rank.MASTER": "超凡大师",
  "rank.DIAMOND": "璀璨钻石",
  "rank.EMERALD": "流光翡翠",
  "rank.PLATINUM": "华贵铂金",
  "rank.GOLD": "荣耀黄金",
  "rank.SILVER": "不屈白银",
  "rank.BRONZE": "英勇青铜",
  "rank.IRON": "坚韧黑铁",
  "rank.UNRANKED": "未定级",
  "rank.queue.RANKED_SOLO_5x5": "单排/双排",
  "rank.queue.RANKED_FLEX_SR": "灵活组排",
  "rank.queue.RANKED_FLEX_TT": "灵活 3v3",
  "rank.queue.RANKED_TFT": "云顶之弈",
  "rank.queue.RANKED_TFT_DOUBLE_UP": "云顶双人",
  "rank.queue.RANKED_TFT_TURBO": "云顶激斗",
  "beautify.title": "美化",
  "beautify.group.client": "客户端美化",
  "beautify.group.wallpaper": "主页壁纸",
  "beautify.group.avatar": "自定义头像",
  "beautify.group.assets": "资源管理",
  "beautify.wallpaperMode.title": "壁纸模式",
  "beautify.wallpaperMode.description": "隐藏首页活动中心，并清空右侧栏背景，让自定义背景更干净。关闭后会恢复客户端默认显示。",
  "beautify.wallpaperScene.title": "模式选择 / 大厅场景毛玻璃",
  "beautify.wallpaperScene.description": "壁纸模式下，调整模式选择、大厅等场景背景的毛玻璃模糊强度。",
  "beautify.glass.title": "好友栏毛玻璃参数",
  "beautify.glass.description": "调整右侧好友栏和壁纸模式侧栏的毛玻璃效果。",
  "beautify.navbarBlur.title": "顶部导航栏模糊",
  "beautify.navbarBlur.description": "调整客户端顶部导航栏背景的毛玻璃模糊强度。",
  "beautify.navbarLines.title": "去除顶部线条",
  "beautify.navbarLines.description": "隐藏顶部导航栏图标之间的竖线和导航栏底部边框。",
  "beautify.nameEffect.title": "召唤师名字特效",
  "beautify.nameEffect.description": "为召唤师名字应用平滑流动的渐变色，可同步给同样安装了 Sona 的好友。",
  "beautify.nameEffect.settingsTitle": "名字特效配置",
  "beautify.nameEffect.settingsDescription": "调整水流渐变的起始色、结束色与流动方向。",
  "beautify.nameEffect.preview": "召唤师名字",
  "beautify.nameEffect.startColor": "起始色",
  "beautify.nameEffect.endColor": "结束色",
  "beautify.nameEffect.angle": "渐变角度",
  "beautify.slider.blur": "模糊",
  "beautify.slider.opacity": "底色",
  "beautify.wallpaper.random.title": "随机壁纸",
  "beautify.wallpaper.random.description": "每次启动客户端时，从上方主页壁纸列表随机应用一张，并尽量避免和上次重复。",
  "beautify.wallpaper.effect": "主页壁纸效果",
  "beautify.wallpaper.dropHint": "从下方资源列表拖动图片或视频到这里，以添加主页壁纸",
  "beautify.wallpaper.clickApply": "点击应用",
  "beautify.wallpaper.adjust": "调整",
  "beautify.wallpaper.adjustTitle": "调整主页壁纸",
  "beautify.wallpaper.reset": "重置取景",
  "beautify.avatar.dropHint": "从下方资源列表拖动图片到这里，以添加自定义头像",
  "beautify.avatar.syncing": "正在同步头像...",
  "beautify.assets.openFolder": "打开 assets 目录",
  "beautify.assets.add": "录入资源",
  "beautify.assets.searching": "查找中...",
  "beautify.assets.placeholder": "输入 assets 相对路径...",
  "beautify.assets.instructions": "把图片或视频放进 assets 目录后，直接输入文件名即可，例如 avatar；也可以输入完整文件名 avatar.png，或输入子目录路径 icons/avatar。文件后缀可以省略，Sona 会自动查找。",
  "beautify.assets.browserTitle": "资源列表",
  "beautify.assets.dragHint": "拖动图片到上方功能区即可复制使用",
  "beautify.assets.loadFailed": "资源加载失败",
  "beautify.assets.loadFailedHint": "请核对文件是否被移动、改名或删除",
  "beautify.assets.folderTitle": "资源目录",
  "beautify.assets.folderDescription": "打开 Sona 的 assets 目录，你的自定义图片、视频等资源应该放在这里。",
  "beautify.assets.inputTitle": "录入资源",
  "beautify.assets.inputDescription": "输入 assets 目录中的图片名或视频名即可导入，支持省略 .jpg、.png、.mp4 等后缀；子目录可输入 icons/avatar。",
  "beautify.assets.examplePlaceholder": "例如 avatar 或 icons/avatar",
  "beautify.assets.empty": "还没有录入资源。",
  "beautify.status.assetInputRequired": "请输入资源路径。",
  "beautify.status.assetPathInvalid": "路径不能包含 ..。",
  "beautify.status.assetUrlRejected": "请输入 assets 目录内的相对路径，不要输入完整 URL。",
  "beautify.status.assetUnsupported": "目前只支持录入图片或视频资源：png/jpg/jpeg/webp/gif/svg/bmp/ico/mp4/webm/ogg/ogv/mov/m4v。",
  "beautify.status.assetSearching": "正在查找资源：{path}...",
  "beautify.status.assetNotFound": "没有找到“{path}”。请确认文件已放入 assets 目录，并核对文件名后重试。",
  "beautify.status.assetMatched": "已自动找到并录入：{input} → {path}",
  "beautify.status.assetDuplicate": "这个资源已经录入过了。",
  "beautify.status.assetAdded": "已录入资源：{path}",
  "beautify.status.assetRemoved": "已移除资源：{path}",
  "beautify.status.wallpaperApplied": "已设置主页壁纸：{path}",
  "beautify.status.wallpaperAdded": "已添加主页壁纸：{path}",
  "beautify.status.wallpaperRemoved": "已从主页壁纸移除：{path}",
  "beautify.status.wallpaperSaved": "已保存主页壁纸取景：{path}",
  "beautify.status.wallpaperListOnly": "只能使用资源列表中已录入的资源作为主页壁纸。",
  "beautify.status.wallpaperAddListOnly": "只能添加资源列表中已录入的资源作为主页壁纸。",
  "beautify.status.wallpaperMediaOnly": "主页壁纸仅支持图片或视频资源。",
  "beautify.status.avatarAdded": "已添加到自定义头像：{path}",
  "beautify.status.avatarRemoved": "已从自定义头像移除：{path}",
  "beautify.status.avatarApplied": "已应用自定义头像：{path}",
  "beautify.status.avatarCurrent": "当前已应用头像：{path}",
  "beautify.status.avatarSynced": "已同步自定义头像：{path}",
  "beautify.status.avatarSyncFailed": "本地头像已应用，但同步失败：{error}",
  "beautify.status.avatarListOnly": "只能添加资源列表中已录入的图片。",
  "beautify.status.avatarImageOnly": "自定义头像仅支持图片资源，视频只能用于主页壁纸。",
  "beautify.status.avatarDuplicate": "这张图片已经在自定义头像列表里了。",
  "beautify.wallpaper.adjustHint": "按住拖动调整位置，滚动鼠标滚轮缩放资源",
  "beautify.wallpaper.saveCrop": "保存取景",
  "strength.grade.legendary": "天籁主宰",
  "strength.grade.carry": "核心大腿",
  "strength.grade.strong": "稳定强点",
  "strength.grade.reliable": "可靠队友",
  "strength.grade.balanced": "均衡发挥",
  "strength.grade.unstable": "状态摇摆",
  "strength.grade.risky": "高风险点",
  "strength.grade.critical": "需要照顾",
  "strength.lowConfidence": "样本偏少，暂评",
  "strength.line": "{grade} {score}分 | 胜率{winRate} | KDA {kda}",
  "strength.teamTier.ace": "🦄 独角马",
  "strength.teamTier.high": "🏇 上等马",
  "strength.teamTier.mid": "🐎 中等马",
  "strength.teamTier.low": "🐴 下等马",
  "strength.teamTier.burden": "🐂 纯牛马",
  "strength.teamTier.newbie": "🆕 萌新上线",
  "champSelect.teamAnalysis.header": `Sona助手 ♫   队友卡池一览(本模式近{count}场战绩):
`,
  "champSelect.teamAnalysis.floor": "{floor}楼",
  "champSelect.teamAnalysis.line": "{floor}: {title}|胜率{winRate}%|KDA{kda}|综合评分{score}",
  "champSelect.teamAnalysis.emptyLine": "{floor}: 🆕 萌新上线|胜率--|综合评分--",
  "champSelect.stats.winLoss": "{winRate}% ({wins}胜/{losses}负)",
  "champSelect.side.blue": "🔵 蓝方 (左下方)",
  "champSelect.side.red": "🔴 红方 (右上方)",
  "champSelect.side.message": "Sona助手 ♫   本局{side}",
  "champSelect.autoBan.message": "Sona助手 ♫   自动 Ban: {championName}",
  "champSelect.autoLock.lock": "自动锁定",
  "champSelect.autoLock.preselect": "自动预选",
  "champSelect.autoLock.message": "Sona助手 ♫   {action}: {championName}",
  "champSelect.rating.godlike": "👑 峡谷通天代",
  "champSelect.rating.smurf": "🚀 降维来炸鱼",
  "champSelect.rating.hardCarry": "🔥 绝对真大腿",
  "champSelect.rating.specialist": "⚔️ 绝活哥出列",
  "champSelect.rating.steady": "✨ 稳健老司机",
  "champSelect.rating.helper": "🛡️ 上分好帮手",
  "champSelect.rating.swing": "🎲 峡谷摇摆人",
  "champSelect.rating.holding": "🫠 默默抗压中",
  "champSelect.rating.autofill": "🍂 随缘在补位",
  "champSelect.rating.losing": "💀 连败渡劫中",
  "champSelect.rating.breakpoint": "🤡 敌方突破口",
  "champSelect.rating.atm": "💸 峡谷提款机",
  "champSelect.rating.surrender": "🏳️ 投降发起人",
  "champSelect.rating.actor": "☠️ 演员已就位",
  "matchHistory.title": "❖ {playerName} 的近期战报",
  "matchHistory.filter.all": "全部模式",
  "matchHistory.loading": "正在拉取战绩...",
  "matchHistory.loadingMore": "正在加载更多...",
  "matchHistory.loadMore": "↓ 下滑加载更多",
  "matchHistory.noMore": "— 共 {count} 条战绩 —",
  "matchHistory.empty": "暂无对局数据",
  "matchHistory.error": "战绩加载失败：{error}",
  "matchHistory.clickDetail": "点击查看单局详情",
  "matchDetail.title": "对局详情",
  "matchDetail.copyId": "已复制ID",
  "matchDetail.reportTitle": "❖ 单局战报详情",
  "matchDetail.loading": "加载中...",
  "matchDetail.error": "加载单局详情失败",
  "matchDetail.duration": "时长 {duration}",
  "matchDetail.start": "开始 {time}",
  "matchDetail.playerFallback": "玩家 {id}",
  "matchDetail.team.blue": "蓝色方",
  "matchDetail.team.red": "红色方",
  "gameAnalysis.title": "对局分析",
  "gameAnalysis.loading": "正在分析对局数据...",
  "gameAnalysis.empty": "暂无对局数据",
  "gameAnalysis.blueTeam": "蓝色方",
  "gameAnalysis.redTeam": "红色方",
  "gameAnalysis.avgWinRate": "平均胜率",
  "gameAnalysis.broadcaster": "主播模式",
  "gameAnalysis.premadeTeam": "{group}队",
  "gameAnalysis.unranked": "未定级",
  "gameAnalysis.noData": "无数据",
  "gameAnalysis.recentCount": "本模式近{count}局",
  "gameAnalysis.winLoss": "{wins} 胜 / {losses} 负",
  "opgg.title": "配装推荐",
  "opgg.unrecognizedChampion": "未识别英雄",
  "opgg.unknownQueue": "未知队列",
  "opgg.close": "关闭配装推荐",
  "opgg.section.core": "核心装备",
  "opgg.section.runes": "符文搭配",
  "opgg.section.spells": "召唤师技能",
  "opgg.section.trends": "出装趋势",
  "opgg.section.matchups": "优势 / 劣势对局",
  "opgg.section.augments": "海克斯推荐",
  "opgg.loading": "正在后台加载 OP.GG 推荐数据，完成后会自动刷新。",
  "opgg.loadFailed": "OP.GG 请求失败：{error}",
  "opgg.noData": "暂无可用 OP.GG 推荐数据。",
  "opgg.noMatchups": "暂无对局克制数据",
  "opgg.matchup.advantage": "优势对局",
  "opgg.matchup.disadvantage": "劣势对局",
  "opgg.noCustomRunes": "不支持自定义符文",
  "opgg.applying": "应用中",
  "opgg.applied": "已应用",
  "opgg.trend": "趋势：",
  "opgg.position.top": "上路",
  "opgg.position.jungle": "打野",
  "opgg.position.mid": "中路",
  "opgg.position.adc": "下路",
  "opgg.position.support": "辅助",
  "opgg.position.select": "选择推荐分路",
  "opgg.chat.buildReady": "{championName} 出装已配备 - Sona",
  "opgg.chat.runesApplied": "{championName} {modeLabel} 符文已应用 - Sona",
  "opgg.chat.runesSaved": "{championName} {modeLabel} 符文更改已保存 - Sona",
  "opgg.chat.restored": "{championName} {modeLabel} {restoredText}已恢复 - Sona",
  "opgg.restored.runesAndSpells": "符文 & 召唤师技能",
  "opgg.restored.runes": "符文",
  "opgg.restored.spells": "召唤师技能",
  "debug.title": "调试面板",
  "debug.group.beautify": "美化客户端相关",
  "debug.beautify.description": "测试客户端环境能否通过文件选择器读取本地图片；当前仅用于预览，不会写入磁盘或修改头像。也可以打开 assets 目录，手动放入自定义图片。",
  "debug.beautify.chooseImage": "选择图片",
  "debug.beautify.clearPreview": "清除预览",
  "debug.group.lcu": "LCU API 测试",
  "debug.group.champSelect": "英雄选择 (ARAM)",
  "debug.group.lookup": "信息查询",
  "debug.group.matchHistory": "战绩查询",
  "debug.group.auth": "鉴权 Token & 直连调试",
  "debug.group.opgg": "OP.GG API 连通性",
  "debug.group.chat": "聊天调试",
  "debug.group.client": "客户端操作",
  "debug.group.assets": "游戏资源",
  "debug.group.replay": "回放调试",
  "debug.group.honor": "荣誉 & 点赞",
  "debug.group.lobby": "房间 & 组队",
  "debug.group.avatar": "头像框 & 头像",
  "debug.group.profileBg": "生涯背景",
  "debug.group.clientConfig": "客户端配置",
  "debug.group.region": "区域 & 炫彩",
  "debug.group.store": "Store 调试",
  "debug.action.summonerInfo": "获取召唤师信息",
  "debug.action.chatMe": "获取在线状态",
  "debug.action.gameflow": "游戏流程阶段",
  "debug.action.chatSessions": "聊天会话列表",
  "debug.action.bannerInventory": "旗帜库存",
  "debug.action.reroll": "重随英雄",
  "debug.action.champSession": "选人 Session",
  "debug.action.bench": "Bench 英雄",
  "debug.action.pickable": "可选英雄",
  "debug.action.dodgeQuitV2": "立即秒退（quitV2）",
  "debug.action.queryPuuid": "查询 PUUID",
  "debug.action.queryMatch": "查询战绩",
  "debug.action.matchDetail": "对局详情",
  "debug.action.timeline": "时间线",
  "debug.action.send": "发送",
  "debug.action.openDevtools": "打开 DevTools",
  "debug.action.openPluginFolder": "打开插件目录",
  "debug.action.reloadClient": "重载客户端",
  "debug.action.gameAnalysis": "对局分析面板",
  "debug.action.fullChampionData": "查询完整数据",
  "debug.action.watchDirectly": "直接观看",
  "debug.action.download": "下载",
  "debug.action.view": "查看",
  "debug.hint.benchSlots": "点击选取共享池对应槽位的英雄",
  "debug.hint.dodgeQuitV2": "仅供测试：使用 Akari 同款 quitV2 调用退出当前英雄选择，会产生正常的秒退惩罚。",
  "debug.confirm.dodgeQuitV2": "确定要立即退出当前英雄选择吗？该操作会真实秒退并产生正常的秒退惩罚。",
  "debug.hint.auth": "测试从 LCU 获取 SGP / RSO 所需的 Token，并尝试请求 Riot UserInfo 与 SGP 战绩接口。",
  "debug.hint.opgg": "使用 Akari 同款数据源测试浏览器环境能否直连 OP.GG Champion API。",
  "debug.hint.chat": "向当前英雄选择聊天框发送指定类型的消息。celebration / system / information 仅自己可见，chat 所有人可见。",
  "debug.hint.opggChampion": "单英雄接口和面板预览优先使用「游戏资源」里选择的英雄；未选择时尝试当前选人英雄，最后用兰博 68 兜底。",
  "debug.label.charCount": "字数: {count}",
  "debug.placeholder.riotId": "名字#Tag (例: 丨一疾风剑豪一丨#77772)",
  "debug.placeholder.puuid": "输入 PUUID 查他人战绩...",
  "debug.placeholder.gameId": "输入 Game ID...",
  "debug.placeholder.corsUrl": "输入要测试跨域 GET 的完整 URL...",
  "debug.placeholder.chat": "输入要发送的消息...",
  "debug.placeholder.champion": "搜索英雄 (名字/称号/英文名)",
  "debug.placeholder.queueId": "输入 Queue ID (如 450=大乱斗)",
  "debug.placeholder.skinId": "输入皮肤 ID (如 777058)",
  "notification.avatarSync.title": "Sona 头像同步成功",
  "notification.avatarSync.details": "自定义头像同步完成",
  "notification.avatarSyncFailed.title": "Sona 头像同步失败",
  "notification.avatarSyncFailed.details": "好友暂时可能看不到你的自定义头像：{error}"
}, h0 = {
  "common.apply": "Apply",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.confirm": "Confirm",
  "common.delete": "Delete",
  "common.download": "Download",
  "common.failed": "Failed",
  "common.loading": "Loading...",
  "common.noData": "No data",
  "common.remove": "Remove",
  "common.reset": "Reset",
  "common.restore": "Restore",
  "common.save": "Save",
  "common.success": "Success",
  "common.unknown": "Unknown",
  "common.win": "Win",
  "common.loss": "Loss",
  "common.today": "Today",
  "common.yesterday": "Yesterday",
  "common.dayBeforeYesterday": "2 days ago",
  "nav.home": "Home",
  "nav.tools": "Tools",
  "nav.beautify": "Beautify",
  "nav.settings": "Settings",
  "nav.about": "About",
  "nav.debug": "Debug",
  "nav.rewards": "Claim Rewards",
  "nav.updateAvailable": "Update Available",
  "sidebar.expand": "Expand sidebar",
  "sidebar.collapse": "Collapse sidebar",
  "settings.title": "Settings",
  "settings.group.general": "General",
  "settings.group.advanced": "Advanced",
  "settings.language.title": "Language",
  "settings.language.description": "Choose the display language for the Sona panel. Auto follows the client page html lang.",
  "settings.language.auto": "Auto",
  "settings.language.zhCN": "Simplified Chinese",
  "settings.language.enUS": "English",
  "settings.hotkey.title": "Panel Hotkey",
  "settings.hotkey.description": "Press the hotkey anytime to open or close the Sona panel.",
  "settings.hideSonaIcon.title": "Hide Sona Icon",
  "settings.hideSonaIcon.description": "Hide the Sona entry icon beside Play. Press {hotkey} to open the panel while it is hidden.",
  "settings.globalParticle.title": "Global Particles",
  "settings.globalParticle.description": "Add a starlight particle background effect to the client.",
  "settings.skippedUpdate.title": "Skipped v{version} update",
  "settings.skippedUpdate.description": "Sona will not remind you about this version again. Restore reminders to check updates again.",
  "settings.skippedUpdate.clear": "Restore Reminder",
  "settings.developerMode.title": "Developer Mode",
  "settings.developerMode.description": "Enable the debug panel. Make sure you know what you are doing ( ˘•ω•˘ )◞⚠!",
  "select.placeholder": "Please select...",
  "home.heading": "Welcome to Sona",
  "home.subtitle": "Your League client enhancement toolkit",
  "home.quote": '"Sona is fully open-source and free. If you paid for it, you were scammed!"',
  "home.quoteAuthor": "- The Great WJZ_P",
  "about.description": "Sona is a League of Legends client enhancement plugin built with React + Vite and powered by Pengu Loader.",
  "about.card.plugin": "Plugin",
  "about.card.framework": "Framework",
  "about.card.loader": "Loader",
  "about.techStack": "Tech Stack",
  "about.license": "License",
  "update.title": "Sona update available",
  "update.titleWithVersion": "Sona update available: ",
  "update.downloadTitle": "Download",
  "update.downloadDescription": "Download the latest Sona release from GitHub Releases, the group files, or Quark Drive.",
  "update.openRelease": "Open Release",
  "update.groupFile": "QQ Group: 1097295981",
  "update.quark": "Quark Drive",
  "update.skipVersion": "Skip v{version}",
  "update.checking": "Checking for updates...",
  "update.checkFailed": "Update check failed: {error}",
  "update.none": "No new version detected.",
  "update.recheck": "Check Again",
  "rewards.title": "Battle Pass Rewards",
  "rewards.hint": 'Lists every reward that is "pending selection" (choose-one / choose-some). You can select and claim them here.',
  "rewards.refresh": "Refresh",
  "rewards.empty": "No selectable rewards pending right now.",
  "rewards.loadFailed": "Failed to load: {error}",
  "rewards.untitled": "Unnamed reward",
  "rewards.selectHintRange": "Select {min}-{max}",
  "rewards.selectHintExact": "Select {count}",
  "rewards.selectedCount": "Selected {count}/{max}",
  "rewards.claim": "Claim",
  "rewards.claimSelected": "Claim Selected ({count})",
  "rewards.claiming": "Claiming...",
  "rewards.claimSuccess": "Claimed: {items}",
  "rewards.claimFailed": "Claim failed: {error}",
  "rewards.quantity": "x{count}",
  "tools.title": "Tools",
  "tools.group.matchQuery": "Match Lookup",
  "tools.group.match": "Match",
  "tools.group.social": "Social",
  "tools.group.interface": "Interface",
  "tools.group.rankDisguise": "Rank Disguise",
  "tools.group.replay": "Replays",
  "tools.group.backup": "Game Settings Backup",
  "tools.matchQuery.description": "Search recent matches for any player by Riot ID.",
  "tools.matchQuery.placeholder": "Name#Tag",
  "tools.matchQuery.search": "Search",
  "tools.matchQuery.invalid": "Invalid format. Use: Name#Tag",
  "tools.matchQuery.notFound": "Summoner not found.",
  "tools.matchQuery.failed": "Search failed. Check the name and tag.",
  "tools.autoAccept.title": "Auto Accept",
  "tools.autoAccept.description": "Automatically accept matches so you do not miss the queue pop.",
  "tools.autoAcceptDelay.title": "Random Accept Delay",
  "tools.autoAcceptDelay.description": "Wait a random delay before accepting. Max 15000 ms.",
  "tools.allowDeclineAfterAccept.title": "Allow Decline After Accept",
  "tools.allowDeclineAfterAccept.description": "Keep the decline button clickable after accepting so you can change your mind anytime; accept and decline stay freely switchable.",
  "tools.benchNoCooldown.title": "ARAM Bench No Cooldown",
  "tools.benchNoCooldown.description": "Remove bench swap cooldown in ARAM and grab champions anytime.",
  "tools.analyzeTeamPower.title": "Team Power Analysis",
  "tools.analyzeTeamPower.description": "Analyze teammates in champion select and send recent stats to chat.",
  "tools.sideIndicator.title": "Side Indicator",
  "tools.sideIndicator.description": "Send whether you are blue side or red side during champion select.",
  "tools.champSelectAssist.title": "Champ Select Assist",
  "tools.champSelectAssist.description": "Show particles, teammate WR/KDA, and champion tier badges. Click avatars for match history.",
  "tools.opggBuildRecommendation.title": "Build Panel",
  "tools.opggBuildRecommendation.description": "After locking a champion, open OP.GG builds, runes, and augments from the skin area.",
  "tools.smartBuildRecommendation.title": "Smart Builds, Runes & Spells",
  "tools.smartBuildRecommendation.description": "Auto-build, save, and restore runes and summoner spells by mode and champion. The final loadout is learned before the first game starts.",
  "tools.balanceBuffTooltip.title": "Balance Buff Tooltip",
  "tools.balanceBuffTooltip.description": "Hover champion portraits in supported modes to view balance modifiers.",
  "tools.champSelectQuitButton.title": "Champ Select Quit Button",
  "tools.champSelectQuitButton.description": "Adds a bottom-right quick-dodge button during champion select in non-custom games.",
  "tools.gameAnalysisPopup.title": "Game Analysis Popup",
  "tools.gameAnalysisPopup.description": "Show a client-side team analysis popup after entering game. Switch back to the client to view it.",
  "tools.autoReturn.title": "Auto Return to Lobby",
  "tools.autoReturn.description": "Return to lobby after a game, with optional auto queue.",
  "tools.autoHonor.title": "Auto Honor",
  "tools.autoHonor.description": "Randomly honor teammates after the game.",
  "tools.autoLock.title": "Auto Pick Champion",
  "tools.autoLock.description": "Automatically pick or lock priority champions when it is your turn, and skip the action when you are autofilled in ranked.",
  "tools.autoLock.searchPlaceholder": "Search champion name/title",
  "tools.autoLock.lock": "Pick & Lock",
  "tools.autoLock.preselect": "Pick Only",
  "tools.autoLock.empty": "No priority champions yet. Sona tries them from left to right.",
  "tools.autoBan.title": "Auto Ban Champion",
  "tools.autoBan.description": "Automatically ban priority champions when it is your turn in ban phase.",
  "tools.autoBan.searchPlaceholder": "Search champion to ban",
  "tools.autoBan.empty": "No auto-ban champions yet. Sona tries them from left to right.",
  "tools.unlockStatus.title": "Unlock Status Message",
  "tools.unlockStatus.description": "Remove the client lock and freely edit your status message.",
  "tools.unlockAvailability.title": "Unlock Availability",
  "tools.unlockAvailability.description": "Take over the status button and switch to hidden states such as offline/mobile.",
  "tools.unlockChromas.title": "Unlock Chromas Tab",
  "tools.unlockChromas.description": "Restore the hidden Chromas tab on the collection page. Restart required after changing.",
  "tools.removeCrest.title": "Remove Crest",
  "tools.removeCrest.description": "Remove profile crest decoration and keep the avatar clean. Requires summoner level 525+.",
  "tools.removeChallengeBadges.title": "Remove Identity Badges",
  "tools.removeChallengeBadges.description": "Clear all three challenge badges shown below the avatar for a cleaner identity card.",
  "tools.removeIcon.title": "Reset Avatar",
  "tools.removeIcon.description": "Restore the default client profile icon.",
  "tools.unequip": "Remove",
  "tools.customProfileBg.title": "Custom Profile Background",
  "tools.customProfileBg.description": "Enhance the profile background picker and use any skin as your background. Visible to friends.",
  "tools.customBanner.title": "Custom Banner",
  "tools.customBanner.description": "Add a custom banner button to the native banner area. Local display only.",
  "tools.friendSmartGroup.title": "Premade Marker",
  "tools.friendSmartGroup.description": "Mark friends in the same premade with matching right-side colors.",
  "tools.enhancedFriendStatus.title": "Enhanced Friend Status",
  "tools.enhancedFriendStatus.description": "Show game mode and elapsed time for in-game friends in the right sidebar.",
  "tools.lobbyEnhancement.title": "Lobby Enhancement",
  "tools.lobbyEnhancement.description": "Click lobby avatars to view match history and show recent performance above banners.",
  "tools.gameModeFilter.title": "Mode Filter",
  "tools.gameModeFilter.description": "Add mode toggles on the PvP page so you can hide rarely played modes.",
  "tools.quickLobby.title": "Quick Lobby Mode",
  "tools.quickLobby.description": "Skip mode selection when clicking the home Play button and jump straight into the target queue lobby.",
  "tools.quickLobby.placeholder": "Select target queue",
  "tools.hideTFT.title": "Hide TFT Entry",
  "tools.hideTFT.description": "Hide the TFT entry in the top navigation.",
  "tools.hideRightNavText.title": "Hide Right Nav Text",
  "tools.hideRightNavText.description": "Hide text labels in the top-right navigation and keep icons only.",
  "tools.hideEsportsPopup.title": "Close Esports Popup",
  "tools.hideEsportsPopup.description": "Automatically remove the official esports livestream popup at the bottom-right of the client.",
  "tools.windowEffect.title": "Window Effect",
  "tools.windowEffect.description": "Add visual effects such as blur. It may stutter while dragging on Windows 10.",
  "tools.rankDisguise.description": "Disguise the rank shown in friend cards only. It does not affect the profile page. Visible to friends.",
  "tools.replay.description": "Enter a Game ID to download or watch a replay.",
  "tools.replay.placeholder": "Game ID...",
  "tools.replay.status.idle": "Ready",
  "tools.replay.status.downloading": "Downloading...",
  "tools.replay.status.ready": "Downloaded",
  "tools.replay.status.launching": "Launching...",
  "tools.replay.status.error": "Failed",
  "tools.replay.watch": "Watch",
  "tools.replay.download": "Download",
  "tools.backup.placeholder": "Backup name",
  "tools.backup.description": "Back up current client settings such as hotkeys and layout. Multiple named backups are supported.",
  "tools.backup.save": "Save Backup",
  "tools.backup.nameRequired": "Please enter a backup name.",
  "tools.backup.saving": "Backing up...",
  "tools.backup.success": "Backup saved.",
  "tools.backup.failed": "Backup failed.",
  "tools.backup.restoring": 'Restoring "{name}"...',
  "tools.backup.restored": '"{name}" restored.',
  "tools.backup.restoreFailed": "Restore failed.",
  "tools.backup.deleted": 'Deleted "{name}"',
  "option.recent.20": "Last 20",
  "option.recent.50": "Last 50",
  "option.recent.100": "Last 100",
  "option.visibility.self": "Only Me",
  "option.visibility.team": "Team Chat",
  "option.autoReturn.queue": "Auto Queue",
  "option.autoReturn.lobby": "Lobby Only",
  "option.windowEffect.none": "None",
  "option.windowEffect.blurbehind": "Blur",
  "option.windowEffect.acrylic": "Acrylic",
  "option.windowEffect.unified": "Mixed",
  "option.windowEffect.mica": "Mica (Win11)",
  "option.windowEffect.transparent": "Transparent",
  "rank.CHALLENGER": "Challenger",
  "rank.GRANDMASTER": "Grandmaster",
  "rank.MASTER": "Master",
  "rank.DIAMOND": "Diamond",
  "rank.EMERALD": "Emerald",
  "rank.PLATINUM": "Platinum",
  "rank.GOLD": "Gold",
  "rank.SILVER": "Silver",
  "rank.BRONZE": "Bronze",
  "rank.IRON": "Iron",
  "rank.UNRANKED": "Unranked",
  "rank.queue.RANKED_SOLO_5x5": "Solo/Duo",
  "rank.queue.RANKED_FLEX_SR": "Flex",
  "rank.queue.RANKED_FLEX_TT": "Flex 3v3",
  "rank.queue.RANKED_TFT": "TFT",
  "rank.queue.RANKED_TFT_DOUBLE_UP": "TFT Double Up",
  "rank.queue.RANKED_TFT_TURBO": "TFT Hyper Roll",
  "beautify.title": "Beautify",
  "beautify.group.client": "Client Beautify",
  "beautify.group.wallpaper": "Home Wallpaper",
  "beautify.group.avatar": "Custom Avatar",
  "beautify.group.assets": "Assets",
  "beautify.wallpaperMode.title": "Wallpaper Mode",
  "beautify.wallpaperMode.description": "Hide the home activity center and clear the sidebar background for a cleaner custom background.",
  "beautify.wallpaperScene.title": "Mode Select / Lobby Scene Glass",
  "beautify.wallpaperScene.description": "In wallpaper mode, adjust the glass blur of mode select and lobby scene backgrounds.",
  "beautify.glass.title": "Friends Sidebar Glass",
  "beautify.glass.description": "Adjust the glass effect for the friends sidebar and wallpaper sidebar.",
  "beautify.navbarBlur.title": "Top Navigation Blur",
  "beautify.navbarBlur.description": "Adjust the backdrop blur strength of the client top navigation bar.",
  "beautify.navbarLines.title": "Remove Navigation Lines",
  "beautify.navbarLines.description": "Hide the vertical separators between navigation icons and the navigation bar bottom border.",
  "beautify.nameEffect.title": "Summoner Name Effect",
  "beautify.nameEffect.description": "Apply a smoothly flowing gradient to summoner names and sync it to friends who also use Sona.",
  "beautify.nameEffect.settingsTitle": "Name Effect Settings",
  "beautify.nameEffect.settingsDescription": "Adjust the water-flow gradient colors and direction.",
  "beautify.nameEffect.preview": "Summoner Name",
  "beautify.nameEffect.startColor": "Start",
  "beautify.nameEffect.endColor": "End",
  "beautify.nameEffect.angle": "Gradient Angle",
  "beautify.slider.blur": "Blur",
  "beautify.slider.opacity": "Tint",
  "beautify.wallpaper.random.title": "Random Wallpaper",
  "beautify.wallpaper.random.description": "Randomly apply one wallpaper on each client start, avoiding the previous one when possible.",
  "beautify.wallpaper.effect": "Wallpaper Effect",
  "beautify.wallpaper.dropHint": "Drag images or videos here from the asset list below",
  "beautify.wallpaper.clickApply": "Click to apply",
  "beautify.wallpaper.adjust": "Adjust",
  "beautify.wallpaper.adjustTitle": "Adjust Wallpaper",
  "beautify.wallpaper.reset": "Reset Crop",
  "beautify.avatar.dropHint": "Drag images here from the asset list below",
  "beautify.avatar.syncing": "Syncing avatar...",
  "beautify.assets.openFolder": "Open assets folder",
  "beautify.assets.add": "Add Asset",
  "beautify.assets.searching": "Searching...",
  "beautify.assets.placeholder": "Asset relative path...",
  "beautify.assets.instructions": "Put an image or video in the assets folder, then enter its name, such as avatar. You can also enter avatar.png or a subfolder path such as icons/avatar. The extension is optional and Sona will find it automatically.",
  "beautify.assets.browserTitle": "Assets",
  "beautify.assets.dragHint": "Drag images to the sections above to use them",
  "beautify.assets.loadFailed": "Asset failed to load",
  "beautify.assets.loadFailedHint": "Check whether the file was moved, renamed, or deleted",
  "beautify.assets.folderTitle": "Assets Folder",
  "beautify.assets.folderDescription": "Open Sona assets folder. Put your custom images and videos here.",
  "beautify.assets.inputTitle": "Add Asset",
  "beautify.assets.inputDescription": "Enter an image or video name from assets. Extensions such as .jpg, .png, and .mp4 are optional. For subfolders, enter icons/avatar.",
  "beautify.assets.examplePlaceholder": "e.g. avatar or icons/avatar",
  "beautify.assets.empty": "No assets added yet.",
  "beautify.status.assetInputRequired": "Please enter an asset path.",
  "beautify.status.assetPathInvalid": "Path cannot contain ..",
  "beautify.status.assetUrlRejected": "Use a relative path inside assets, not a full URL.",
  "beautify.status.assetUnsupported": "Supported assets: png/jpg/jpeg/webp/gif/svg/bmp/ico/mp4/webm/ogg/ogv/mov/m4v.",
  "beautify.status.assetSearching": "Searching for asset: {path}...",
  "beautify.status.assetNotFound": "Could not find “{path}”. Make sure the file is in the assets folder and check its name.",
  "beautify.status.assetMatched": "Found and added automatically: {input} → {path}",
  "beautify.status.assetDuplicate": "This asset has already been added.",
  "beautify.status.assetAdded": "Asset added: {path}",
  "beautify.status.assetRemoved": "Asset removed: {path}",
  "beautify.status.wallpaperApplied": "Wallpaper applied: {path}",
  "beautify.status.wallpaperAdded": "Wallpaper added: {path}",
  "beautify.status.wallpaperRemoved": "Wallpaper removed: {path}",
  "beautify.status.wallpaperSaved": "Wallpaper crop saved: {path}",
  "beautify.status.wallpaperListOnly": "Use an asset from the asset list as a wallpaper.",
  "beautify.status.wallpaperAddListOnly": "Add a recorded asset as a wallpaper.",
  "beautify.status.wallpaperMediaOnly": "Wallpaper supports images and videos only.",
  "beautify.status.avatarAdded": "Added to custom avatars: {path}",
  "beautify.status.avatarRemoved": "Removed from custom avatars: {path}",
  "beautify.status.avatarApplied": "Custom avatar applied: {path}",
  "beautify.status.avatarCurrent": "Current avatar: {path}",
  "beautify.status.avatarSynced": "Custom avatar synced: {path}",
  "beautify.status.avatarSyncFailed": "Local avatar applied, but sync failed: {error}",
  "beautify.status.avatarListOnly": "Add an image from the asset list.",
  "beautify.status.avatarImageOnly": "Custom avatars support images only. Videos can be used for wallpapers.",
  "beautify.status.avatarDuplicate": "This image is already in the custom avatar list.",
  "beautify.wallpaper.adjustHint": "Drag to reposition. Use mouse wheel to zoom.",
  "beautify.wallpaper.saveCrop": "Save Crop",
  "strength.grade.legendary": "Virtuoso",
  "strength.grade.carry": "Carry",
  "strength.grade.strong": "Strong",
  "strength.grade.reliable": "Reliable",
  "strength.grade.balanced": "Balanced",
  "strength.grade.unstable": "Swingy",
  "strength.grade.risky": "Risky",
  "strength.grade.critical": "Needs Help",
  "strength.lowConfidence": "Low sample",
  "strength.line": "{grade} {score} | WR {winRate} | KDA {kda}",
  "strength.teamTier.ace": "🦄 Ace",
  "strength.teamTier.high": "🏇 High",
  "strength.teamTier.mid": "🐎 Mid",
  "strength.teamTier.low": "🐴 Low",
  "strength.teamTier.burden": "🐂 Deadweight",
  "strength.teamTier.newbie": "🆕 Newbie",
  "champSelect.teamAnalysis.header": `Sona ♫ Team pool, last {count} games in this mode:
`,
  "champSelect.teamAnalysis.floor": "F{floor}",
  "champSelect.teamAnalysis.line": "{floor}: {title}|WR{winRate}%|KDA{kda}|Score{score}",
  "champSelect.teamAnalysis.emptyLine": "{floor}: 🆕 Newbie|WR--|Score--",
  "champSelect.stats.winLoss": "{winRate}% ({wins}W/{losses}L)",
  "champSelect.side.blue": "🔵 Blue (bottom left)",
  "champSelect.side.red": "🔴 Red (top right)",
  "champSelect.side.message": "Sona ♫   This game: {side}",
  "champSelect.autoBan.message": "Sona ♫   Auto Ban: {championName}",
  "champSelect.autoLock.lock": "Auto Lock",
  "champSelect.autoLock.preselect": "Auto Pick",
  "champSelect.autoLock.message": "Sona ♫   {action}: {championName}",
  "champSelect.rating.godlike": "👑 Godlike",
  "champSelect.rating.smurf": "🚀 Smurf",
  "champSelect.rating.hardCarry": "🔥 Carry",
  "champSelect.rating.specialist": "⚔️ Main",
  "champSelect.rating.steady": "✨ Steady",
  "champSelect.rating.helper": "🛡️ Helper",
  "champSelect.rating.swing": "🎲 Coinflip",
  "champSelect.rating.holding": "🫠 Weakside",
  "champSelect.rating.autofill": "🍂 Autofill",
  "champSelect.rating.losing": "💀 Losing",
  "champSelect.rating.breakpoint": "🤡 Breakpoint",
  "champSelect.rating.atm": "💸 Walking ATM",
  "champSelect.rating.surrender": "🏳️ FF Starter",
  "champSelect.rating.actor": "☠️ Paid Actor",
  "matchHistory.title": "❖ Recent Matches - {playerName}",
  "matchHistory.filter.all": "All Modes",
  "matchHistory.loading": "Loading matches...",
  "matchHistory.loadingMore": "Loading more...",
  "matchHistory.loadMore": "Scroll down to load more",
  "matchHistory.noMore": "- {count} matches -",
  "matchHistory.empty": "No matches",
  "matchHistory.error": "Failed to load matches: {error}",
  "matchHistory.clickDetail": "Click for match details",
  "matchDetail.title": "Match Details",
  "matchDetail.copyId": "ID copied",
  "matchDetail.reportTitle": "❖ Match Details",
  "matchDetail.loading": "Loading...",
  "matchDetail.error": "Failed to load match details",
  "matchDetail.duration": "Duration {duration}",
  "matchDetail.start": "Start {time}",
  "matchDetail.playerFallback": "Player {id}",
  "matchDetail.team.blue": "Blue Team",
  "matchDetail.team.red": "Red Team",
  "gameAnalysis.title": "Game Analysis",
  "gameAnalysis.loading": "Analyzing game data...",
  "gameAnalysis.empty": "No game data",
  "gameAnalysis.blueTeam": "Blue Team",
  "gameAnalysis.redTeam": "Red Team",
  "gameAnalysis.avgWinRate": "Avg WR",
  "gameAnalysis.broadcaster": "Streamer Mode",
  "gameAnalysis.premadeTeam": "Team {group}",
  "gameAnalysis.unranked": "Unranked",
  "gameAnalysis.noData": "No data",
  "gameAnalysis.recentCount": "Last {count} in mode",
  "gameAnalysis.winLoss": "{wins}W / {losses}L",
  "opgg.title": "Builds",
  "opgg.unrecognizedChampion": "Unknown Champion",
  "opgg.unknownQueue": "Unknown Queue",
  "opgg.close": "Close builds",
  "opgg.section.core": "Core",
  "opgg.section.runes": "Runes",
  "opgg.section.spells": "Spells",
  "opgg.section.trends": "Trends",
  "opgg.section.matchups": "Matchups",
  "opgg.section.augments": "Augments",
  "opgg.loading": "Loading OP.GG recommendations in the background.",
  "opgg.loadFailed": "OP.GG request failed: {error}",
  "opgg.noData": "No OP.GG recommendations available.",
  "opgg.noMatchups": "No matchup data",
  "opgg.matchup.advantage": "Good Matchups",
  "opgg.matchup.disadvantage": "Bad Matchups",
  "opgg.noCustomRunes": "Custom runes are not supported.",
  "opgg.applying": "Applying",
  "opgg.applied": "Applied",
  "opgg.trend": "Trend:",
  "opgg.position.top": "Top",
  "opgg.position.jungle": "Jungle",
  "opgg.position.mid": "Mid",
  "opgg.position.adc": "Bot",
  "opgg.position.support": "Support",
  "opgg.position.select": "Select build role",
  "opgg.chat.buildReady": "{championName} build ready - Sona",
  "opgg.chat.runesApplied": "{championName} {modeLabel} runes applied - Sona",
  "opgg.chat.runesSaved": "{championName} {modeLabel} rune changes saved - Sona",
  "opgg.chat.restored": "{championName} {modeLabel} {restoredText} restored - Sona",
  "opgg.restored.runesAndSpells": "runes & spells",
  "opgg.restored.runes": "runes",
  "opgg.restored.spells": "spells",
  "debug.title": "Debug Panel",
  "debug.group.beautify": "Client Beautify",
  "debug.beautify.description": "Test whether the client can read local images through the file picker. Preview only; it does not write files or change avatars.",
  "debug.beautify.chooseImage": "Choose Image",
  "debug.beautify.clearPreview": "Clear Preview",
  "debug.group.lcu": "LCU API Tests",
  "debug.group.champSelect": "Champ Select (ARAM)",
  "debug.group.lookup": "Lookup",
  "debug.group.matchHistory": "Match History",
  "debug.group.auth": "Auth Tokens & Direct Tests",
  "debug.group.opgg": "OP.GG Connectivity",
  "debug.group.chat": "Chat Debug",
  "debug.group.client": "Client Actions",
  "debug.group.assets": "Game Assets",
  "debug.group.replay": "Replay Debug",
  "debug.group.honor": "Honor",
  "debug.group.lobby": "Lobby & Party",
  "debug.group.avatar": "Crests & Avatars",
  "debug.group.profileBg": "Profile Background",
  "debug.group.clientConfig": "Client Config",
  "debug.group.region": "Region & Chromas",
  "debug.group.store": "Store Debug",
  "debug.action.summonerInfo": "Summoner Info",
  "debug.action.chatMe": "Online Status",
  "debug.action.gameflow": "Gameflow Phase",
  "debug.action.chatSessions": "Chat Sessions",
  "debug.action.bannerInventory": "Banner Inventory",
  "debug.action.reroll": "Reroll",
  "debug.action.champSession": "Champ Session",
  "debug.action.bench": "Bench Champs",
  "debug.action.pickable": "Pickable Champs",
  "debug.action.dodgeQuitV2": "Dodge Now (quitV2)",
  "debug.action.queryPuuid": "Query PUUID",
  "debug.action.queryMatch": "Query Matches",
  "debug.action.matchDetail": "Match Detail",
  "debug.action.timeline": "Timeline",
  "debug.action.send": "Send",
  "debug.action.openDevtools": "Open DevTools",
  "debug.action.openPluginFolder": "Open Plugin Folder",
  "debug.action.reloadClient": "Reload Client",
  "debug.action.gameAnalysis": "Game Analysis Panel",
  "debug.action.fullChampionData": "Full Champion Data",
  "debug.action.watchDirectly": "Watch Directly",
  "debug.action.download": "Download",
  "debug.action.view": "View",
  "debug.hint.benchSlots": "Click a slot to swap with the corresponding bench champion.",
  "debug.hint.dodgeQuitV2": "Test only: uses the same quitV2 call as Akari to leave champion select and incurs the normal dodge penalty.",
  "debug.confirm.dodgeQuitV2": "Leave champion select now? This is a real dodge and incurs the normal dodge penalty.",
  "debug.hint.auth": "Fetch SGP / RSO tokens from LCU and test Riot UserInfo and SGP match-history requests.",
  "debug.hint.opgg": "Test whether this browser environment can directly access OP.GG Champion API.",
  "debug.hint.chat": "Send a message to the current champion-select chat. celebration / system / information are local; chat is visible to everyone.",
  "debug.hint.opggChampion": "Single-champion APIs and panel previews use the selected champion first, then current champ select, then Rumble 68.",
  "debug.label.charCount": "Chars: {count}",
  "debug.placeholder.riotId": "Name#Tag",
  "debug.placeholder.puuid": "PUUID for match history...",
  "debug.placeholder.gameId": "Game ID...",
  "debug.placeholder.corsUrl": "Full URL for cross-origin GET...",
  "debug.placeholder.chat": "Message to send...",
  "debug.placeholder.champion": "Search champion name/title",
  "debug.placeholder.queueId": "Queue ID (e.g. 450=ARAM)",
  "debug.placeholder.skinId": "Skin ID (e.g. 777058)",
  "notification.avatarSync.title": "Sona avatar synced",
  "notification.avatarSync.details": "Your avatar was synced successfully",
  "notification.avatarSyncFailed.title": "Sona avatar sync failed",
  "notification.avatarSyncFailed.details": "Friends may not see your custom avatar for now: {error}"
}, Vu = {
  "zh-CN": g0,
  "en-US": h0
};
function p0(u) {
  return (u ?? "").trim().replace("_", "-").toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
}
function lr(u) {
  return u === "auto" || u === "zh-CN" || u === "en-US" ? u : "auto";
}
function y0() {
  return p0(document.documentElement.lang);
}
function Pg(u) {
  const s = lr(u);
  return s === "auto" ? y0() : s;
}
function eh() {
  return lr(pt.get("locale"));
}
function v0() {
  return Pg(eh());
}
function it(u, s) {
  const c = v0(), o = Vu[c][u] ?? Vu["zh-CN"][u] ?? u;
  return s ? o.replace(/\{(\w+)\}/g, (r, m) => {
    const h = s[m];
    return h == null ? r : String(h);
  }) : o;
}
function th() {
  const [u, s] = Z.useState(() => eh()), [c, o] = Z.useState(() => document.documentElement.lang);
  Z.useEffect(() => {
    const y = pt.onChange("locale", (g) => {
      s(lr(g));
    }), S = new MutationObserver(() => {
      o(document.documentElement.lang);
    });
    return S.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["lang"]
    }), () => {
      y(), S.disconnect();
    };
  }, []);
  const r = Z.useMemo(() => Pg(u === "auto" ? c : u), [c, u]), m = Z.useMemo(() => (y, S) => {
    const g = Vu[r][y] ?? Vu["zh-CN"][y] ?? y;
    return S ? g.replace(/\{(\w+)\}/g, (A, C) => {
      const L = S[C];
      return L == null ? A : String(L);
    }) : g;
  }, [r]);
  return {
    locale: r,
    localeSetting: u,
    setLocaleSetting: (y) => {
      pt.set("locale", y);
    },
    t: m
  };
}
const Hc = {
  // ===== 国服 (Tencent) =====
  TENCENT_HN1: { matchHistory: "https://hn1-k8s-sgp.lol.qq.com:21019", common: "https://hn1-k8s-sgp.lol.qq.com:21019" },
  TENCENT_HN10: { matchHistory: "https://hn10-k8s-sgp.lol.qq.com:21019", common: "https://hn10-k8s-sgp.lol.qq.com:21019" },
  TENCENT_TJ100: { matchHistory: "https://tj100-sgp.lol.qq.com:21019", common: "https://tj100-sgp.lol.qq.com:21019" },
  TENCENT_TJ101: { matchHistory: "https://tj101-sgp.lol.qq.com:21019", common: "https://tj101-sgp.lol.qq.com:21019" },
  TENCENT_NJ100: { matchHistory: "https://nj100-sgp.lol.qq.com:21019", common: "https://nj100-sgp.lol.qq.com:21019" },
  TENCENT_GZ100: { matchHistory: "https://gz100-sgp.lol.qq.com:21019", common: "https://gz100-sgp.lol.qq.com:21019" },
  TENCENT_CQ100: { matchHistory: "https://cq100-sgp.lol.qq.com:21019", common: "https://cq100-sgp.lol.qq.com:21019" },
  TENCENT_BGP2: { matchHistory: "https://bgp2-k8s-sgp.lol.qq.com:21019", common: "https://bgp2-k8s-sgp.lol.qq.com:21019" },
  TENCENT_PBE: { matchHistory: "https://pbe-sgp.lol.qq.com:21019", common: "https://pbe-sgp.lol.qq.com:21019" },
  TENCENT_PREPBE: { matchHistory: "https://prepbe-sgp.lol.qq.com:21019", common: "https://prepbe-sgp.lol.qq.com:21019" },
  // ===== 外服 =====
  TW2: { matchHistory: "https://apse1-red.pp.sgp.pvp.net", common: "https://tw2-red.lol.sgp.pvp.net" },
  SG2: { matchHistory: "https://apse1-red.pp.sgp.pvp.net", common: "https://sg2-red.lol.sgp.pvp.net" },
  PH2: { matchHistory: "https://apse1-red.pp.sgp.pvp.net", common: "https://ph2-red.lol.sgp.pvp.net" },
  VN2: { matchHistory: "https://apse1-red.pp.sgp.pvp.net", common: "https://vn2-red.lol.sgp.pvp.net" },
  TH2: { matchHistory: "https://apse1-red.pp.sgp.pvp.net", common: "https://th2-red.lol.sgp.pvp.net" },
  JP1: { matchHistory: "https://apne1-red.pp.sgp.pvp.net", common: "https://jp-red.lol.sgp.pvp.net" },
  KR: { matchHistory: "https://apne1-red.pp.sgp.pvp.net", common: "https://kr-red.lol.sgp.pvp.net" },
  NA1: { matchHistory: "https://usw2-red.pp.sgp.pvp.net", common: "https://na-red.lol.sgp.pvp.net" },
  BR1: { matchHistory: "https://usw2-red.pp.sgp.pvp.net", common: "https://br-red.lol.sgp.pvp.net" },
  LA1: { matchHistory: "https://usw2-red.pp.sgp.pvp.net", common: "https://lan-red.lol.sgp.pvp.net" },
  LA2: { matchHistory: "https://usw2-red.pp.sgp.pvp.net", common: "https://las-red.lol.sgp.pvp.net" },
  OC1: { matchHistory: "https://apse1-red.pp.sgp.pvp.net", common: "https://oce-red.lol.sgp.pvp.net" },
  EUW: { matchHistory: "https://euc1-red.pp.sgp.pvp.net", common: "https://euw-red.lol.sgp.pvp.net" },
  EUN1: { matchHistory: "https://euc1-red.pp.sgp.pvp.net", common: "https://eun1-red.lol.sgp.pvp.net" },
  TR1: { matchHistory: "https://euc1-red.pp.sgp.pvp.net", common: "https://tr-red.lol.sgp.pvp.net" },
  RU: { matchHistory: "https://euc1-red.pp.sgp.pvp.net", common: "https://ru-red.lol.sgp.pvp.net" },
  PBE: { matchHistory: "https://usw2-red.pp.sgp.pvp.net", common: "https://pbe-red.lol.sgp.pvp.net" },
  // issuer fallback 有时只能解析到 regional PP 集群，保留 match-history 能力即可。
  EUC1: { matchHistory: "https://euc1-red.pp.sgp.pvp.net", common: null },
  USW2: { matchHistory: "https://usw2-red.pp.sgp.pvp.net", common: null },
  APSE1: { matchHistory: "https://apse1-red.pp.sgp.pvp.net", common: null },
  APNE1: { matchHistory: "https://apne1-red.pp.sgp.pvp.net", common: null }
}, wc = [
  "TENCENT_HN1",
  "TENCENT_HN10",
  "TENCENT_NJ100",
  "TENCENT_GZ100",
  "TENCENT_CQ100",
  "TENCENT_TJ100",
  "TENCENT_TJ101",
  "TENCENT_BGP2",
  "TENCENT_PBE",
  "TENCENT_PREPBE"
];
function Ku(u) {
  return u > 0 ? `q_${u}` : "";
}
const wg = [
  129,
  112,
  118,
  169,
  244,
  81,
  80,
  155,
  149,
  152,
  104,
  19,
  206,
  145,
  23,
  231
], b0 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function ah(u) {
  const s = u.trim().toLowerCase();
  if (!b0.test(s)) return "";
  const c = s.replace(/-/g, "");
  let o = "";
  for (let r = 0; r < wg.length; r++) {
    const m = Number.parseInt(c.slice(r * 2, r * 2 + 2), 16);
    o += (m ^ wg[r]).toString(16).padStart(2, "0");
  }
  return [
    o.slice(0, 8),
    o.slice(8, 12),
    o.slice(12, 16),
    o.slice(16, 20),
    o.slice(20)
  ].join("-");
}
var en = /* @__PURE__ */ ((u) => (u.READY_CHECK = "/lol-matchmaking/v1/ready-check", u.GAMEFLOW_PHASE = "/lol-gameflow/v1/session", u.CHAMP_SELECT = "/lol-champ-select/v1/session", u.TFT_BATTLE_PASS = "/lol-tft-pass/v1/battle-pass", u.GAMEFLOW_PHASE_CHANGE = "/lol-gameflow/v1/gameflow-phase", u.LOBBY = "/lol-lobby/v2/lobby", u.CHAT_ME = "/lol-chat/v1/me", u))(en || {});
async function tn(u, s = {}) {
  const c = u.startsWith("/") ? u : `/${u}`, o = await fetch(c, {
    ...s,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...s.headers
    }
  });
  if (!o.ok)
    throw new Error(`[LCU] 请求失败: ${s.method ?? "GET"} ${c} → ${o.status} ${o.statusText}`);
  const r = await o.text();
  return r ? JSON.parse(r) : void 0;
}
function le(u) {
  return tn(u, { method: "GET" });
}
function Ze(u, s) {
  return tn(u, {
    method: "POST",
    body: s != null ? JSON.stringify(s) : void 0
  });
}
function ul(u, s) {
  return tn(u, {
    method: "PUT",
    body: s != null ? JSON.stringify(s) : void 0
  });
}
function _g(u) {
  return !!(u && typeof u == "object" && Array.isArray(u.items));
}
function S0(u) {
  return Array.isArray(u) ? u.filter(_g) : u && typeof u == "object" ? Object.values(u).filter(_g) : [];
}
function sl(u, s) {
  return tn(u, {
    method: "PATCH",
    body: s != null ? JSON.stringify(s) : void 0
  });
}
function ei(u) {
  return tn(u, { method: "DELETE" });
}
const T0 = {
  // 外服 platformId 含数字后缀但 SGP_SERVERS key 不含
  EUW1: "EUW",
  EUN: "EUN1",
  EUNE: "EUN1",
  EUN1: "EUN1",
  RU1: "RU",
  // 命令行 --region 可能不含数字但 SGP_SERVERS key 含数字
  NA: "NA1",
  OCE: "OC1",
  // 以下 platformId 与 SGP_SERVERS key 一致，但显式列出以防遗漏
  BR1: "BR1",
  JP1: "JP1",
  KR: "KR",
  LA1: "LA1",
  LA2: "LA2",
  OC1: "OC1",
  TR1: "TR1",
  TW2: "TW2",
  SG2: "SG2",
  PH2: "PH2",
  VN2: "VN2",
  TH2: "TH2",
  PBE: "PBE"
};
function Hu(u) {
  const s = u.toUpperCase(), c = T0[s] ?? s;
  return Hc[c] ? c : "";
}
const A0 = /* @__PURE__ */ new Set([
  "HN1",
  "HN2",
  "HN3",
  "HN4",
  "HN5",
  "HN6",
  "HN7",
  "HN8",
  "HN9",
  "HN10",
  "HN11",
  "HN12",
  "HN13",
  "HN14",
  "HN15",
  "HN16",
  "HN17",
  "HN18",
  "HN19",
  "WT1",
  "WT2",
  "WT3",
  "WT4",
  "WT5",
  "WT6",
  "WT7",
  "EDU1",
  "BGP1",
  "BGP2",
  "NJ100",
  "GZ100",
  "CQ100",
  "TJ100",
  "TJ101",
  "PBE",
  "PREPBE"
]);
class E0 {
  constructor() {
    Te(this, "eventListeners", /* @__PURE__ */ new Map());
    /** 当前 socket 上已经实际调用过 observe 的 URI 集合 */
    Te(this, "observedUris", /* @__PURE__ */ new Set());
    Te(this, "penguContext", null);
    // -------------------- SGP Token 缓存 --------------------
    /**
     * Entitlements Token 缓存
     *
     * 通过 WS 事件 `/entitlements/v1/token` 自动保活：
     * LCU 会在 token 即将过期时主动推送新 token，无需自己算过期时间。
     * 初始值通过主动拉取填充，后续由 WS 事件驱动更新。
     */
    Te(this, "_entitlementsToken", null);
    /**
     * League Session Token 缓存
     *
     * 通过 WS 事件 `/lol-league-session/v1/league-session-token` 自动保活。
     */
    Te(this, "_leagueSessionToken", null);
    // -------------------- 底层请求 (公开) --------------------
    /** 通用 REST 请求 */
    Te(this, "request", tn);
    Te(this, "get", le);
    Te(this, "post", Ze);
    Te(this, "put", ul);
    Te(this, "patch", sl);
    Te(this, "delete", ei);
  }
  /** SGP Token 是否已就绪（两个 token 都已拿到） */
  get isSgpTokenReady() {
    return this._entitlementsToken !== null && this._leagueSessionToken !== null;
  }
  /** 获取缓存的 Entitlements Token（不会发起网络请求） */
  get cachedEntitlementsToken() {
    return this._entitlementsToken;
  }
  /** 获取缓存的 League Session Token（不会发起网络请求） */
  get cachedLeagueSessionToken() {
    return this._leagueSessionToken;
  }
  // -------------------- 初始化 --------------------
  /**
   * 绑定 PenguContext，用于 WebSocket 事件监听
   * 应在 init(context) 生命周期中调用
   */
  bindContext(s) {
    this.penguContext = s;
    const c = Array.from(this.eventListeners.keys());
    this.observedUris.clear(), console.log("[LCUManager] bindContext() → replay %d observed uri(s)", c.length), c.forEach((o) => this.observeUriOnSocket(o)), this._initSgpTokenKeepAlive();
  }
  /**
   * SGP Token 保活机制
   *
   * 参考 LeagueAkari 的 _maintainEntitlementsToken / _maintainLeagueSessionToken 实现。
   *
   * 策略：
   * 1. 启动时主动拉取一次 token 填充缓存
   * 2. 监听 LCU WebSocket 事件，token 变化时自动更新缓存
   *    - `/entitlements/v1/token` → Entitlements Token
   *    - `/lol-league-session/v1/league-session-token` → League Session Token
   * 3. LCU 会在 token 即将过期时主动推送新 token，无需自己算过期时间
   */
  _initSgpTokenKeepAlive() {
    this._fetchInitialTokens(), this.observe("/entitlements/v1/token", (s) => {
      const c = s.data;
      c ? (this._entitlementsToken = c, console.log("[LCUManager] Entitlements Token 已通过 WS 事件更新")) : (this._entitlementsToken = null, console.log("[LCUManager] Entitlements Token 已清空（WS 事件）"));
    }), this.observe("/lol-league-session/v1/league-session-token", (s) => {
      const c = s.data;
      c ? (this._leagueSessionToken = c, console.log("[LCUManager] League Session Token 已通过 WS 事件更新")) : (this._leagueSessionToken = null, console.log("[LCUManager] League Session Token 已清空（WS 事件）"));
    });
  }
  /** 主动拉取初始 token 填充缓存 */
  async _fetchInitialTokens() {
    try {
      const [s, c] = await Promise.all([
        this.getEntitlementsToken().catch((o) => (console.warn("[LCUManager] 初始拉取 Entitlements Token 失败:", o), null)),
        this.getLeagueSessionToken().catch((o) => (console.warn("[LCUManager] 初始拉取 League Session Token 失败:", o), null))
      ]);
      s && (this._entitlementsToken = s, console.log("[LCUManager] 初始 Entitlements Token 已获取")), c && (this._leagueSessionToken = c, console.log("[LCUManager] 初始 League Session Token 已获取"));
    } catch (s) {
      console.warn("[LCUManager] 初始拉取 SGP Token 异常:", s);
    }
  }
  // ==================== 召唤师 ====================
  /** 获取当前登录的召唤师信息 */
  getSummonerInfo() {
    return le("/lol-summoner/v1/current-summoner");
  }
  /** 通过 summoner ID 获取召唤师信息 */
  getSummonerById(s) {
    return le(`/lol-summoner/v1/summoners/${s}`);
  }
  /** 通过 puuid 获取召唤师信息 */
  getSummonerByPuuid(s) {
    return le(`/lol-summoner/v2/summoners/puuid/${s}`);
  }
  /** 通过 gameName + tagLine (Riot ID) 获取召唤师信息 */
  getSummonerByRiotId(s, c) {
    return le(`/lol-summoner/v1/alias/lookup?gameName=${encodeURIComponent(s)}&tagLine=${encodeURIComponent(c)}`);
  }
  /**
   * 按 Riot ID 解析召唤师 puuid（支持国服跨大区）
   *
   * 解析顺序：
   * 1. 先用 LCU `alias/lookup` 查本区（外服 / 国服本区命中即返回，最快）
   * 2. 仅国服：本区查不到时，借助"所有腾讯大区共享同一 JWT"特性，并发查询
   *    所有互通大区的 SGP `summoner-ledge` 按名接口，再用返回的 tagLine 精确匹配
   *
   * 拿到 puuid 后即可走 `getSgpMatchHistory`（国服互通，可跨区出战绩）。
   *
   * @returns 命中的 puuid；查不到返回空字符串
   */
  async resolveSummonerPuuidByRiotId(s, c) {
    const o = s.trim(), r = c.trim();
    if (!o || !r) return "";
    const m = await this.getSummonerByRiotId(o, r).catch((L) => (console.warn("[CrossRegion] 本区 alias/lookup 失败:", L), null));
    if (console.log("[CrossRegion] 本区 alias/lookup 结果:", m != null && m.puuid ? `puuid=${m.puuid}` : "无"), m != null && m.puuid) return m.puuid;
    const h = (await this.getSgpServerId().catch(() => "")).toUpperCase();
    if (console.log("[CrossRegion] 当前 SGP 服务器:", h || "(未解析到)"), !h.startsWith("TENCENT_"))
      return console.log("[CrossRegion] 非国服，跳过跨大区搜集"), "";
    const y = this._entitlementsToken ?? await this.getEntitlementsToken().catch((L) => (console.warn("[CrossRegion] 获取 Entitlements Token 失败:", L), null));
    if (!(y != null && y.accessToken))
      return console.warn("[CrossRegion] 无可用 accessToken，无法跨大区查询"), "";
    this._entitlementsToken = y;
    const S = r.toLowerCase(), g = o.toLowerCase();
    console.log("[CrossRegion] 开始跨大区搜集 → 目标 %s#%s，大区数 %d", o, r, wc.length);
    const A = await Promise.allSettled(
      wc.map(
        (L) => this._getSgpSummonerByName(L, o, y.accessToken)
      )
    );
    let C = "";
    return A.forEach((L, B) => {
      const q = wc[B];
      if (L.status !== "fulfilled") {
        console.warn("[CrossRegion] [%s] 查询异常:", q, L.reason);
        return;
      }
      if (!L.value) {
        console.log("[CrossRegion] [%s] 无返回 / 非 200", q);
        return;
      }
      const K = (L.value.tagLine ?? "").trim().toLowerCase(), x = (L.value.gameName ?? L.value.name ?? "").trim().toLowerCase();
      console.log("[CrossRegion] [%s] 命中召唤师: name=%s tag=%s puuid=%s", q, x || "(空)", K || "(空)", L.value.puuid || "(空)"), !C && L.value.puuid && (K && K === S || !K && x === g) && (C = L.value.puuid, console.log("[CrossRegion] ✓ 匹配成功 → 大区 %s，puuid=%s", q, C));
    }), C || console.log("[CrossRegion] ✗ 全大区均未匹配到 %s#%s", o, r), C;
  }
  /** 调用指定腾讯大区的 SGP `summoner-ledge` 按召唤师名查询 */
  async _getSgpSummonerByName(s, c, o) {
    const r = Hc[s], m = (r == null ? void 0 : r.common) ?? (r == null ? void 0 : r.matchHistory);
    if (!m) return null;
    const h = s.replace(/^TENCENT_/, ""), y = `${m}/summoner-ledge/v1/regions/${h}/summoners/name/${encodeURIComponent(c)}`, S = await fetch(y, {
      headers: {
        Authorization: `Bearer ${o}`,
        "User-Agent": "LeagueOfLegendsClient/14.13.596.7996 (rcp-be-lol-summoner)"
      }
    }), g = await S.text().catch(() => "");
    if (console.log("[CrossRegion] [%s] %s → %d %s | body: %s", s, y, S.status, S.statusText, g.slice(0, 800) || "(空)"), !S.ok || !g) return null;
    try {
      return JSON.parse(g);
    } catch (A) {
      return console.warn("[CrossRegion] [%s] JSON 解析失败:", s, A), null;
    }
  }
  /** 设置当前召唤师头像 */
  setProfileIcon(s) {
    return ul("/lol-summoner/v1/current-summoner/icon", { profileIconId: s });
  }
  /** 获取指定召唤师的客户端装备集 wrapper */
  getItemSets(s) {
    return le(`/lol-item-sets/v1/item-sets/${s}/sets`);
  }
  /** 覆盖写入指定召唤师的客户端装备集 wrapper */
  putItemSets(s, c) {
    return ul(`/lol-item-sets/v1/item-sets/${s}/sets`, c);
  }
  /** 生成基础观战 payload；好友 presence 中有 spectatorKey 时应优先补上。 */
  createSpectatorLaunchPayload(s, c = {}) {
    return {
      allowObserveMode: "ALL",
      dropInSpectateGameId: "",
      gameQueueType: "",
      puuid: s,
      ...c
    };
  }
  /**
   * 从好友 presence 中拼出观战 payload。
   *
   * spectatorKey 就在 `/lol-chat/v1/friends` 返回的 friend.lol.spectatorKey 里；
   * 这个 key 只对正在游戏且允许观战的好友有值。
   */
  async getSpectatorLaunchPayloadByPuuid(s) {
    var r;
    const o = (await this.getFriends()).find((m) => m.puuid.toLowerCase() === s.toLowerCase());
    return (r = o == null ? void 0 : o.lol) != null && r.spectatorKey ? this.createSpectatorLaunchPayload(o.puuid, {
      gameQueueType: o.lol.gameQueueType || o.lol.gameMode || "",
      spectatorKey: o.lol.spectatorKey
    }) : null;
  }
  /**
   * 观战指定玩家。
   *
   * Akari 的 LCU helper 只传 puuid；实际客户端在部分场景需要 spectatorKey，
   * 可以传入完整 payload（从 getSpectatorLaunchPayloadByPuuid 获取）。
   */
  launchSpectator(s) {
    return Ze(
      "/lol-spectator/v1/spectate/launch",
      typeof s == "string" ? this.createSpectatorLaunchPayload(s) : s
    );
  }
  /** 获取当前玩家的排位数据 */
  getCurrentRankedStats() {
    return le("/lol-ranked/v1/current-ranked-stats");
  }
  /** 通过 puuid 获取排位数据 */
  getRankedStats(s) {
    return le(`/lol-ranked/v1/ranked-stats/${s}`);
  }
  // ==================== 房间/大厅 ====================
  /** 获取当前房间信息 */
  getLobby() {
    return le("/lol-lobby/v2/lobby");
  }
  /** 通过队列 ID 创建房间 */
  createLobby(s) {
    return Ze("/lol-lobby/v2/lobby", { queueId: s });
  }
  /** 通过自定义配置创建房间 */
  createCustomLobby(s) {
    return Ze("/lol-lobby/v2/lobby", s);
  }
  /** 退出当前房间 */
  leaveLobby() {
    return ei("/lol-lobby/v2/lobby");
  }
  /**
   * 秒退英雄选择阶段（dodge ChampSelect）
   *
   * 实现：直接 `DELETE /lol-lobby/v2/lobby` 解散/离开当前房间。离开房间会把玩家
   * 从英雄选择阶段一并拽出，等效于 dodge。
   *
   * 为什么不用 `POST /lol-lobby-team-builder/champ-select/v1/session/quit`：
   *   该端点实测不生效（点了没有任何反应），故弃用。
   *
   * 错误处理：
   *   - 204 No Content：成功
   *   - 404 Not Found：本就不在房间 / 房间已不存在，按幂等成功处理
   *
   * 注：这会吃逃跑惩罚（降低排位或禁止匹配一段时间），由调用方自行确认场景。
   */
  dodgeChampSelect() {
    return ei("/lol-lobby/v2/lobby").catch((s) => {
      if (!(s instanceof Error && /→\s*404\b/.test(s.message)))
        throw s;
    });
  }
  /**
   * 通过 LeagueAkari 使用的登录会话代理调用立即秒退。
   *
   * 该方法目前只用于 Debug 页验证，不替换上面的旧实现。调用后会产生正常的
   * 秒退惩罚，因此调用方必须先确认当前处于 ChampSelect 并取得用户确认。
   */
  dodgeChampSelectViaQuitV2() {
    const s = ["", "teambuilder-draft", "quitV2", ""], c = new URLSearchParams({
      destination: "lcdsServiceProxy",
      method: "call",
      args: JSON.stringify(s)
    });
    return Ze(`/lol-login/v1/session/invoke?${c.toString()}`, { data: s });
  }
  // ==================== 匹配 ====================
  /** 开始匹配 */
  startMatchmaking() {
    return Ze("/lol-lobby/v2/lobby/matchmaking/search");
  }
  /** 停止匹配 */
  stopMatchmaking() {
    return ei("/lol-lobby/v2/lobby/matchmaking/search");
  }
  /** 获取当前匹配搜索状态 */
  async getMatchSearchState() {
    return (await le("/lol-lobby/v2/lobby/matchmaking/search-state")).searchState;
  }
  /** 接受对局 (Ready Check) */
  acceptMatch() {
    return Ze("/lol-matchmaking/v1/ready-check/accept");
  }
  /** 拒绝对局 (Ready Check) */
  declineMatch() {
    return Ze("/lol-matchmaking/v1/ready-check/decline");
  }
  /** 获取 Ready Check 状态 */
  getReadyCheck() {
    return le("/lol-matchmaking/v1/ready-check");
  }
  // ==================== 游戏流程 ====================
  /** 获取当前游戏流程阶段 */
  getGameflowPhase() {
    return le("/lol-gameflow/v1/gameflow-phase");
  }
  /** 获取游戏流程会话详情 */
  getGameflowSession() {
    return le("/lol-gameflow/v1/session");
  }
  /** 提前退出游戏（关闭游戏窗口） */
  earlyExitGame() {
    return Ze("/lol-gameflow/v1/early-exit");
  }
  /** 投降 */
  surrender() {
    return Ze("/lol-gameflow/v1/surrender");
  }
  /** 再来一局（对局结束后返回房间并自动排队） */
  playAgain() {
    return Ze("/lol-lobby/v2/play-again");
  }
  // ==================== 英雄选择 ====================
  /** 获取英雄选择会话 */
  getChampSelectSession() {
    return le("/lol-champ-select/v1/session");
  }
  /** 获取英雄选择阶段指定格子的召唤师状态 */
  getChampSelectSummoner(s) {
    return le(`/lol-champ-select/v1/summoners/${s}`);
  }
  /** 获取当前可选的英雄 ID 列表 */
  getPickableChampionIds() {
    return le("/lol-champ-select/v1/pickable-champion-ids");
  }
  /** 获取当前可禁用的英雄 ID 列表 */
  getBannableChampionIds() {
    return le("/lol-champ-select/v1/bannable-champion-ids");
  }
  /** 获取当前不可用的英雄 ID 列表 */
  getDisabledChampionIds() {
    return le("/lol-champ-select/v1/disabled-champion-ids");
  }
  /**
   * 锁定英雄（完成选人/禁人动作）
   *
   * 流程：从当前 session 中找到属于自己的、正在进行中的 action，
   * 先 PATCH 设置英雄，再 POST complete 锁定。
   *
   * @param championId 要锁定的英雄 ID
   * @param actionId 可选，直接指定 action ID（不传则自动查找当前正在进行的 action）
   */
  async lockChampion(s, c) {
    let o = c;
    if (o == null) {
      const r = await this.getChampSelectSession(), m = r.actions.flat(2).find((h) => h.actorCellId === r.localPlayerCellId && h.isInProgress && !h.completed);
      if (!m)
        throw new Error("[LCU] 找不到当前正在进行的选人/禁人动作");
      o = m.id;
    }
    await sl(`/lol-champ-select/v1/session/actions/${o}`, { championId: s }), await Ze(`/lol-champ-select/v1/session/actions/${o}/complete`);
  }
  /**
   * 仅选择英雄（不锁定）
   * 只执行 PATCH 设置英雄，不执行 complete 锁定
   */
  async pickChampion(s, c) {
    let o = c;
    if (o == null) {
      const r = await this.getChampSelectSession(), m = r.actions.flat(2).find((h) => h.actorCellId === r.localPlayerCellId && h.isInProgress && !h.completed);
      if (!m)
        throw new Error("[LCU] 找不到当前正在进行的选人动作");
      o = m.id;
    }
    await sl(`/lol-champ-select/v1/session/actions/${o}`, { championId: s });
  }
  /**
   * 修改自己的选人信息（皮肤、召唤师技能等）
   * @param selection 选择参数
   */
  updateMySelection(s) {
    return sl("/lol-champ-select/v1/session/my-selection", s);
  }
  /**
   * ARAM 重随英雄
   * 消耗重随点数，随机获得一个新英雄
   */
  reroll() {
    return Ze("/lol-champ-select/v1/session/my-selection/reroll");
  }
  /**
   * 从 ARAM 共享池（Bench）中拿取英雄
   * 将自己当前的英雄放回池子，换取池中指定的英雄
   * @param championId 要从池中拿取的英雄 ID
   */
  benchSwap(s) {
    return Ze(`/lol-champ-select/v1/session/bench/swap/${s}`);
  }
  /**
   * 获取当前 ARAM 共享池中的英雄列表
   * 从 session 的 benchChampions 字段提取
   */
  async getBenchChampions() {
    return (await this.getChampSelectSession()).benchChampions;
  }
  /**
   * 获取本局选人阶段所有玩家的详细信息
   * 包含召唤师信息、排位数据、近期战绩
   * @returns 我方和敌方玩家信息数组
   */
  async getChampSelectPlayers() {
    const s = await this.getChampSelectSession(), c = async (m) => {
      const h = m.puuid || (m.nameVisibilityType === "HIDDEN" ? ah(m.obfuscatedPuuid) : "");
      try {
        const y = h ? await this.getSummonerByPuuid(h) : await this.getSummonerById(m.summonerId), [S, g] = await Promise.all([
          this.getRankedStats(y.puuid).catch(() => null),
          this.getMatchHistory(y.puuid, 0, 19).catch(() => null)
        ]);
        return {
          summonerId: m.summonerId || y.summonerId,
          championId: m.championId,
          assignedPosition: m.assignedPosition,
          gameName: y.gameName,
          tagLine: y.tagLine,
          summonerLevel: y.summonerLevel,
          puuid: y.puuid,
          profileIconId: y.profileIconId,
          ranked: S,
          recentMatches: g
        };
      } catch {
        return {
          summonerId: m.summonerId,
          championId: m.championId,
          assignedPosition: m.assignedPosition,
          gameName: m.gameName || "Unknown",
          tagLine: m.tagLine,
          summonerLevel: 0,
          puuid: h,
          profileIconId: 0,
          ranked: null,
          recentMatches: null
        };
      }
    }, [o, r] = await Promise.all([
      Promise.all(s.myTeam.map(c)),
      Promise.all(s.theirTeam.map(c))
    ]);
    return { myTeam: o, theirTeam: r };
  }
  // ==================== 聊天 ====================
  /** 获取当前用户的聊天状态信息 */
  getChatMe() {
    return le("/lol-chat/v1/me");
  }
  /**
   * 更改玩家在线状态
   * @param availability 在线状态: 'chat'(在线) | 'away'(离开) | 'dnd'(勿扰) | 'offline'(隐身) | 'mobile'(手机在线)
   * @param statusMessage 可选，自定义签名
   */
  setAvailability(s, c) {
    const o = { availability: s };
    return c != null && (o.statusMessage = c), ul("/lol-chat/v1/me", o);
  }
  /** 设置自定义签名 */
  setStatusMessage(s) {
    return ul("/lol-chat/v1/me", { statusMessage: s });
  }
  /** 获取聊天对话列表 */
  getChatConversations() {
    return le("/lol-chat/v1/conversations");
  }
  /** 获取指定会话的消息记录 */
  getChatMessages(s) {
    return le(`/lol-chat/v1/conversations/${s}/messages`);
  }
  /**
   * 向指定会话发送消息
   *
   * 注意：LCU API 单条消息最大长度为 2696 个字符（含空格），超出会被截断或拒绝。
   * 该限制为 API 层限制，客户端前端 UI 的 200 字限制仅为前端校验。
   *
   * @param conversationId 会话 ID
   * @param message 消息内容（字符串或完整请求体）
   */
  sendChatMessage(s, c) {
    const o = typeof c == "string" ? { body: c, type: "chat" } : c;
    return Ze(`/lol-chat/v1/conversations/${s}/messages`, o);
  }
  /**
   * 获取当前英雄选择阶段的聊天会话
   * 从所有会话中找到 type 为 'championSelect' 的会话
   * @returns 英雄选择聊天会话，如果不在选人阶段则返回 null
   */
  async getChampSelectConversation() {
    return (await this.getChatConversations()).find((c) => c.type === "championSelect") ?? null;
  }
  /**
   * 在英雄选择界面发送消息（一步到位）
   * 自动找到选人聊天会话并发送消息
   * @param message 消息内容
   * @param type 消息类型: 'chat'(所有人可见)、'celebration'(仅自己可见/黄色)、'system'(仅自己可见/系统样式)
   * @throws 如果当前不在选人阶段（找不到 championSelect 会话）
   */
  async sendChampSelectMessage(s, c) {
    const o = await this.getChampSelectConversation();
    if (!o)
      throw new Error("[LCU] 当前不在英雄选择阶段，找不到 championSelect 会话");
    return this.sendChatMessage(o.id, { body: s, type: c ?? "chat" });
  }
  // ==================== 队列信息 ====================
  /** 获取所有可用队列（含中文名、游戏模式、地图等） */
  getQueues() {
    return le("/lol-game-queues/v1/queues");
  }
  /** 获取当前游戏模式信息 */
  getCurrentGamemode() {
    return le("/lol-lobby/v1/parties/gamemode");
  }
  /** 获取所有游戏模式 */
  getGameModes() {
    return le("/lol-game-queues/v1/game-type-config");
  }
  /** 获取所有地图信息 */
  getMaps() {
    return le("/lol-maps/v1/maps");
  }
  /** 获取地图资源数据（含地图皮肤/突变模式本地化名称） */
  getMapAssets() {
    return le("/lol-game-data/assets/v1/maps.json");
  }
  // ==================== 战绩 ====================
  /**
   * 获取战绩列表
   * @param puuid 不传则查当前玩家，传入则查指定玩家
   * @param begIndex 起始索引，默认 0
   * @param endIndex 结束索引，默认 19（共 20 条）
   */
  getMatchHistory(s, c = 0, o = 19) {
    const r = s ? `/lol-match-history/v1/products/lol/${s}/matches` : "/lol-match-history/v1/products/lol/current-summoner/matches";
    return le(`${r}?begIndex=${c}&endIndex=${o}`);
  }
  /**
   * 获取单局对局详情
   * @param gameId 对局 ID
   */
  getMatchDetail(s) {
    return le(`/lol-match-history/v1/games/${s}`);
  }
  /**
   * 获取单局时间线数据
   * @param gameId 对局 ID
   */
  getMatchTimeline(s) {
    return le(`/lol-match-history/v1/game-timelines/${s}`);
  }
  /** 获取最近一起玩过的召唤师 */
  getRecentlyPlayedSummoners() {
    return le("/lol-match-history/v1/recently-played-summoners");
  }
  // ==================== 奖励领取（通行证 / Grants） ====================
  /**
   * 获取奖励授予列表（grants）
   *
   * @param status 过滤状态，常用 `'PENDING_SELECTION'`（待选择的多选一/几选几奖励）。
   *   不传则返回全部状态的 grant。
   *
   * 返回的每个 grant 含：
   * - `info.id`：grantId，领取/选择时所需
   * - `info.rewardGroupId` / `rewardGroup.id`：奖励组 id
   * - `rewardGroup.rewards[].id`：单个奖励的 reward id（select 时提交它）
   * - `rewardGroup.selectionStrategyConfig`：几选几（为 null 表示直接发放，无需选择）
   */
  getRewardGrants(s) {
    const c = s ? `?status=${encodeURIComponent(s)}` : "";
    return le(`/lol-rewards/v1/grants${c}`);
  }
  /**
   * 按需领取：选择并领取某个 grant 内的指定奖励
   *
   * 仅对 `PENDING_SELECTION`（多选一/几选几）类奖励有效。
   *
   * @param grantId       grant 的 id（来自 `RewardsGrant.info.id`）
   * @param rewardGroupId 奖励组 id（来自 `rewardGroup.id`）
   * @param rewardIds     想要领取的 reward id 列表（来自 `rewardGroup.rewards[].id`），
   *                      数量需满足 `selectionStrategyConfig` 的 min/max 限制
   */
  selectGrantReward(s, c, o) {
    return Ze(`/lol-rewards/v1/grants/${s}/select`, {
      grantId: s,
      rewardGroupId: c,
      selections: o
    });
  }
  /**
   * 标记 grant 为已查看（去掉客户端红点提示），**不等于领取**。
   * @param grantIds grant id 列表
   */
  viewRewardGrants(s) {
    return sl("/lol-rewards/v1/grants/view", s);
  }
  // ==================== SGP Token ====================
  /**
   * 获取 Entitlements Token（SGP 战绩查询所需）
   *
   * 返回值说明：
   * - `accessToken`: JWT，用于 `Authorization: Bearer {accessToken}` 请求 SGP 战绩/对局详情接口
   * - `token`: Entitlements JWT（格式不同，部分 SGP 接口可能需要）
   * - `issuer`: 签发者 URL，如 `http://hn1-k8s-bcs-internal.lol.qq.com:28088`
   *   可从中解析当前区服（hn1 = 艾欧尼亚、hn10 = 黑色玫瑰 等）
   * - `subject`: 玩家 PUUID
   * - `entitlements`: 权限列表（通常为空数组）
   *
   * Akari 通过 WS 事件 `/entitlements/v1/token` 自动刷新，我们这里按需拉取。
   */
  getEntitlementsToken() {
    return le("/entitlements/v1/token");
  }
  /**
   * 获取 League Session Token（SGP 通用查询所需）
   *
   * 返回纯 JWT 字符串，用于 `Authorization: Bearer {token}` 请求 SGP 通用接口（召唤师/排位等）。
   */
  getLeagueSessionToken() {
    return le("/lol-league-session/v1/league-session-token");
  }
  /**
   * 从 Entitlements Token 的 issuer 推断当前 SGP 服务器 ID
   *
   * 解析策略（多源 fallback）：
   * 1. 优先使用 `/lol-chat/v1/me` 的 `platformId`，这是 Pengu 环境中最接近 Akari
   *    `--region` / `--rso_platform_id` 的来源。
   * 2. Fallback：从 Entitlements Token 的 issuer 解析。
   * 3. 所有解析结果都必须命中 `SGP_SERVERS` 配置，否则继续 fallback。
   *
   * 已知问题（对比 LeagueAkari）：
   * - LeagueAkari 从 LeagueClient.exe 命令行参数 `--region` / `--rso_platform_id` 获取，
   *   这是官方数据源，最可靠。但 Pengu Loader 插件无法访问命令行参数。
   * - 国服部分大区 issuer 不含 `k8s`（如联盟一区 NJ100），旧正则会匹配失败。
   * - 外服 issuer 子域名可能与 SGP_SERVERS key 不一致（如 EUW1 → EUW、EUNE → EUN1）。
   */
  async getSgpServerId() {
    const s = await this._parseSgpServerIdFromPlatformId();
    if (s) return s;
    const c = this._parseSgpServerIdFromIssuer();
    return c || "";
  }
  /** 从 issuer URL 解析 SGP 服务器 ID */
  _parseSgpServerIdFromIssuer() {
    const s = this._entitlementsToken;
    if (!s) return "";
    const c = s.issuer ?? "", o = c.match(/https?:\/\/([a-z0-9]+)(?:-[a-z0-9]+)*\.lol\.qq\.com/);
    if (o) {
      const m = o[1].toUpperCase();
      return Hu(`TENCENT_${m}`);
    }
    const r = c.match(/https?:\/\/([a-z0-9]+)-[a-z0-9]+\.lol\.sgp\.pvp\.net/) ?? c.match(/https?:\/\/([a-z0-9]+)-[a-z0-9]+\.(?:lol\.)?sgp\.pvp\.net/) ?? c.match(/https?:\/\/([a-z0-9]+)-/);
    if (r) {
      const m = r[1].toUpperCase();
      return Hu(m);
    }
    return "";
  }
  /** 从 /lol-chat/v1/me 的 platformId 解析 SGP 服务器 ID（fallback） */
  async _parseSgpServerIdFromPlatformId() {
    var s;
    try {
      const o = ((s = (await this.getChatMe()).platformId) == null ? void 0 : s.toUpperCase()) ?? "";
      return o ? A0.has(o) ? Hu(`TENCENT_${o}`) : Hu(o) : "";
    } catch {
      return "";
    }
  }
  /**
   * 通过 SGP 查询战绩列表
   *
   * 相比 LCU 接口的优势：
   * - 支持 `tag` 参数按队列模式过滤（如 `q_450` 只查大乱斗）
   * - 无浏览器缓存问题
   * - 国服跨区查询
   * - 突破 LCU 100 场上限
   *
   * @param puuid 玩家 PUUID
   * @param options 查询参数
   * @param options.startIndex 起始索引（默认 0，注意：SGP 用 startIndex 而非 LCU 的 begIndex）
   * @param options.count 获取数量（默认 100，注意：SGP 用 count 而非 LCU 的 endIndex）
   * @param options.tag 按队列模式过滤，如 `q_450`（大乱斗），不传则查全部模式。使用 `queueIdToTag()` 生成。
   */
  async getSgpMatchHistory(s, c) {
    var r;
    const o = {
      platformId: "",
      sgpServerId: "",
      matchHistoryBaseUrl: "",
      requestUrl: "",
      issuer: ((r = this._entitlementsToken) == null ? void 0 : r.issuer) ?? ""
    };
    try {
      const m = await this.getChatMe().catch(() => null);
      o.platformId = (m == null ? void 0 : m.platformId) ?? "";
      const h = this._entitlementsToken ?? await this.getEntitlementsToken();
      this._entitlementsToken || (this._entitlementsToken = h), o.issuer = h.issuer ?? o.issuer;
      const y = await this.getSgpServerId();
      o.sgpServerId = y;
      const S = Hc[y.toUpperCase()];
      if (o.matchHistoryBaseUrl = (S == null ? void 0 : S.matchHistory) ?? "", !(S != null && S.matchHistory))
        throw new Error(`[SGP] 找不到服务器配置: ${y}`);
      const g = new URLSearchParams();
      g.set("startIndex", String((c == null ? void 0 : c.startIndex) ?? 0)), g.set("count", String((c == null ? void 0 : c.count) ?? 100)), c != null && c.tag && g.set("tag", c.tag);
      const A = `${S.matchHistory}/match-history-query/v1/products/lol/player/${s}/SUMMARY?${g}`;
      o.requestUrl = A;
      const C = await fetch(A, {
        headers: {
          Authorization: `Bearer ${h.accessToken}`,
          "User-Agent": "LeagueOfLegendsClient/14.13.596.7996 (rcp-be-lol-match-history)"
        }
      });
      if (!C.ok) {
        const L = await C.text().catch(() => "");
        throw new Error(`[SGP] 请求失败: ${C.status} ${C.statusText} ${L.slice(0, 1e3)}`);
      }
      return C.json();
    } catch (m) {
      return console.error("[SGP] 战绩查询失败，回退到客户端原生战绩接口", {
        platformId: o.platformId || "unknown",
        sgpServerId: o.sgpServerId || "unknown",
        matchHistoryBaseUrl: o.matchHistoryBaseUrl || "unknown",
        issuer: o.issuer || "unknown",
        puuid: s,
        startIndex: (c == null ? void 0 : c.startIndex) ?? 0,
        count: (c == null ? void 0 : c.count) ?? 100,
        tag: (c == null ? void 0 : c.tag) ?? "",
        requestUrl: o.requestUrl || "not-built",
        errorName: m instanceof Error ? m.name : typeof m,
        errorMessage: m instanceof Error ? m.message : String(m),
        error: m
      }), this.getNativeMatchHistoryAsSgp(s, c);
    }
  }
  async getNativeMatchHistoryAsSgp(s, c) {
    var C;
    const o = Math.max(0, (c == null ? void 0 : c.startIndex) ?? 0), r = Math.max(1, (c == null ? void 0 : c.count) ?? 100), m = this.parseQueueIdFromSgpTag(c == null ? void 0 : c.tag), h = m ? 0 : o, y = m ? 99 : o + r - 1, g = ((C = (await this.getMatchHistory(s, h, y)).games) == null ? void 0 : C.games) ?? [];
    return {
      games: (m ? g.filter((L) => L.queueId === m).slice(o, o + r) : g).map((L) => this.mapNativeMatchGameToSgpGame(L))
    };
  }
  parseQueueIdFromSgpTag(s) {
    const c = s == null ? void 0 : s.match(/^q_(\d+)$/);
    if (!c) return null;
    const o = Number.parseInt(c[1], 10);
    return Number.isFinite(o) && o > 0 ? o : null;
  }
  mapNativeMatchGameToSgpGame(s) {
    const c = /* @__PURE__ */ new Map();
    s.participantIdentities.forEach((r) => {
      c.set(r.participantId, r);
    });
    const o = s.participants.map((r) => this.mapNativeParticipantToSgpParticipant(r, c.get(r.participantId), s.gameDuration));
    return {
      metadata: {
        product: "lol",
        tags: [`q_${s.queueId}`],
        participants: o.map((r) => r.puuid).filter(Boolean),
        timestamp: new Date(s.gameCreation).toISOString(),
        data_version: "",
        info_type: "SUMMARY",
        match_id: `${s.platformId}_${s.gameId}`,
        private: !1
      },
      json: {
        endOfGameResult: s.endOfGameResult,
        gameCreation: s.gameCreation,
        gameDuration: s.gameDuration,
        gameEndTimestamp: s.gameCreation + s.gameDuration * 1e3,
        gameId: s.gameId,
        gameMode: s.gameMode,
        gameModeMutators: s.gameModeMutators ?? [],
        gameName: "",
        gameStartTimestamp: s.gameCreation,
        gameType: s.gameType,
        gameVersion: s.gameVersion,
        mapId: s.mapId,
        participants: o,
        platformId: s.platformId,
        queueId: s.queueId,
        seasonId: s.seasonId,
        teams: s.teams.map((r) => this.mapNativeTeamToSgpTeam(r)),
        tournamentCode: ""
      }
    };
  }
  mapNativeTeamToSgpTeam(s) {
    return {
      bans: [],
      objectives: {
        baron: { first: s.firstBaron, kills: s.baronKills },
        champion: { first: s.firstBlood, kills: 0 },
        dragon: { first: s.firstDargon, kills: s.dragonKills },
        horde: { first: !1, kills: s.hordeKills },
        inhibitor: { first: s.firstInhibitor, kills: s.inhibitorKills },
        riftHerald: { first: !1, kills: s.riftHeraldKills },
        tower: { first: s.firstTower, kills: s.towerKills }
      },
      teamId: s.teamId,
      win: s.win === "Win"
    };
  }
  mapNativeParticipantToSgpParticipant(s, c, o) {
    var g, A, C, L;
    const r = s.stats, m = c == null ? void 0 : c.player, h = o || 0, y = {
      statPerks: {
        defense: 0,
        flex: 0,
        offense: 0
      },
      styles: [
        {
          description: "primaryStyle",
          style: r.perkPrimaryStyle || 0,
          selections: [
            { perk: r.perk0 || 0, var1: r.perk0Var1 || 0, var2: r.perk0Var2 || 0, var3: r.perk0Var3 || 0 },
            { perk: r.perk1 || 0, var1: r.perk1Var1 || 0, var2: r.perk1Var2 || 0, var3: r.perk1Var3 || 0 },
            { perk: r.perk2 || 0, var1: r.perk2Var1 || 0, var2: r.perk2Var2 || 0, var3: r.perk2Var3 || 0 },
            { perk: r.perk3 || 0, var1: r.perk3Var1 || 0, var2: r.perk3Var2 || 0, var3: r.perk3Var3 || 0 }
          ]
        },
        {
          description: "subStyle",
          style: r.perkSubStyle || 0,
          selections: [
            { perk: r.perk4 || 0, var1: r.perk4Var1 || 0, var2: r.perk4Var2 || 0, var3: r.perk4Var3 || 0 },
            { perk: r.perk5 || 0, var1: r.perk5Var1 || 0, var2: r.perk5Var2 || 0, var3: r.perk5Var3 || 0 }
          ]
        }
      ]
    }, S = {
      damagePerMinute: h > 0 ? r.totalDamageDealtToChampions / h * 60 : 0,
      goldPerMinute: h > 0 ? r.goldEarned / h * 60 : 0,
      kda: r.deaths > 0 ? (r.kills + r.assists) / r.deaths : r.kills + r.assists,
      visionScorePerMinute: h > 0 ? r.visionScore / h * 60 : 0
    };
    return {
      PlayerBehavior: { PlayerBehavior_IsHeroInCombat: 0 },
      PlayerScore0: r.playerScore0 || 0,
      PlayerScore1: r.playerScore1 || 0,
      PlayerScore2: r.playerScore2 || 0,
      PlayerScore3: r.playerScore3 || 0,
      PlayerScore4: r.playerScore4 || 0,
      PlayerScore5: r.playerScore5 || 0,
      PlayerScore6: r.playerScore6 || 0,
      PlayerScore7: r.playerScore7 || 0,
      PlayerScore8: r.playerScore8 || 0,
      PlayerScore9: r.playerScore9 || 0,
      PlayerScore10: 0,
      PlayerScore11: 0,
      assists: r.assists,
      challenges: S,
      champExperience: 0,
      champLevel: r.champLevel,
      championId: s.championId,
      championName: "",
      championTransform: 0,
      damageDealtToBuildings: r.damageDealtToTurrets,
      damageDealtToEpicMonsters: 0,
      damageDealtToObjectives: r.damageDealtToObjectives,
      damageDealtToTurrets: r.damageDealtToTurrets,
      damageSelfMitigated: r.damageSelfMitigated,
      deaths: r.deaths,
      detectorWardsPlaced: r.visionWardsBoughtInGame,
      doubleKills: r.doubleKills,
      dragonKills: 0,
      eligibleForProgression: !0,
      firstBloodAssist: r.firstBloodAssist,
      firstBloodKill: r.firstBloodKill,
      firstTowerAssist: r.firstTowerAssist,
      firstTowerKill: r.firstTowerKill,
      gameEndedInEarlySurrender: r.gameEndedInEarlySurrender,
      gameEndedInSurrender: r.gameEndedInSurrender,
      goldEarned: r.goldEarned,
      goldSpent: r.goldSpent,
      individualPosition: ((g = s.timeline) == null ? void 0 : g.lane) || "",
      inhibitorKills: r.inhibitorKills,
      item0: r.item0,
      item1: r.item1,
      item2: r.item2,
      item3: r.item3,
      item4: r.item4,
      item5: r.item5,
      item6: r.item6,
      killingSprees: r.killingSprees,
      kills: r.kills,
      lane: ((A = s.timeline) == null ? void 0 : A.lane) || "",
      largestCriticalStrike: r.largestCriticalStrike,
      largestKillingSpree: r.largestKillingSpree,
      largestMultiKill: r.largestMultiKill,
      longestTimeSpentLiving: r.longestTimeSpentLiving,
      magicDamageDealt: r.magicDamageDealt,
      magicDamageDealtToChampions: r.magicDamageDealtToChampions,
      magicDamageTaken: r.magicalDamageTaken,
      missions: {},
      neutralMinionsKilled: r.neutralMinionsKilled,
      participantId: s.participantId,
      pentaKills: r.pentaKills,
      perks: y,
      physicalDamageDealt: r.physicalDamageDealt,
      physicalDamageDealtToChampions: r.physicalDamageDealtToChampions,
      physicalDamageTaken: r.physicalDamageTaken,
      placement: r.subteamPlacement,
      playerAugment1: r.playerAugment1,
      playerAugment2: r.playerAugment2,
      playerAugment3: r.playerAugment3,
      playerAugment4: r.playerAugment4,
      playerAugment5: r.playerAugment5,
      playerAugment6: r.playerAugment6,
      playerSubteamId: r.playerSubteamId,
      profileIcon: (m == null ? void 0 : m.profileIcon) ?? 0,
      puuid: (m == null ? void 0 : m.puuid) ?? "",
      quadraKills: r.quadraKills,
      riotIdGameName: (m == null ? void 0 : m.gameName) ?? (m == null ? void 0 : m.summonerName) ?? "",
      riotIdTagline: (m == null ? void 0 : m.tagLine) ?? "",
      role: ((C = s.timeline) == null ? void 0 : C.role) || "",
      roleBoundItem: r.roleBoundItem,
      sightWardsBoughtInGame: r.sightWardsBoughtInGame,
      spell1Id: s.spell1Id,
      spell2Id: s.spell2Id,
      subteamPlacement: r.subteamPlacement,
      summonerId: (m == null ? void 0 : m.summonerId) ?? 0,
      summonerLevel: 0,
      summonerName: (m == null ? void 0 : m.summonerName) ?? (m == null ? void 0 : m.gameName) ?? "",
      teamEarlySurrendered: r.teamEarlySurrendered,
      teamId: s.teamId,
      teamPosition: ((L = s.timeline) == null ? void 0 : L.lane) || "",
      timeCCingOthers: r.timeCCingOthers,
      timePlayed: h,
      totalDamageDealt: r.totalDamageDealt,
      totalDamageDealtToChampions: r.totalDamageDealtToChampions,
      totalDamageShieldedOnTeammates: 0,
      totalDamageTaken: r.totalDamageTaken,
      totalHeal: r.totalHeal,
      totalHealsOnTeammates: 0,
      totalMinionsKilled: r.totalMinionsKilled,
      totalTimeCCDealt: r.totalTimeCrowdControlDealt,
      totalTimeSpentDead: 0,
      totalUnitsHealed: r.totalUnitsHealed,
      tripleKills: r.tripleKills,
      trueDamageDealt: r.trueDamageDealt,
      trueDamageDealtToChampions: r.trueDamageDealtToChampions,
      trueDamageTaken: r.trueDamageTaken,
      turretKills: r.turretKills,
      turretTakedowns: r.turretKills,
      turretsLost: 0,
      unrealKills: r.unrealKills,
      visionScore: r.visionScore,
      visionWardsBoughtInGame: r.visionWardsBoughtInGame,
      wardsKilled: r.wardsKilled,
      wardsPlaced: r.wardsPlaced,
      win: r.win,
      allInPings: 0,
      assistMePings: 0,
      baronKills: 0,
      basicPings: 0,
      commandPings: 0,
      consumablesPurchased: 0,
      dangerPings: 0,
      enemyMissingPings: 0,
      enemyVisionPings: 0,
      getBackPings: 0,
      holdPings: 0,
      inhibitorTakedowns: r.inhibitorKills,
      inhibitorsLost: 0,
      itemsPurchased: 0,
      needVisionPings: 0,
      nexusKills: 0,
      nexusLost: 0,
      nexusTakedowns: 0,
      objectivesStolen: 0,
      objectivesStolenAssists: 0,
      onMyWayPings: 0,
      pushPings: 0,
      retreatPings: 0,
      spell1Casts: 0,
      spell2Casts: 0,
      spell3Casts: 0,
      spell4Casts: 0,
      summoner1Casts: 0,
      summoner2Casts: 0,
      totalAllyJungleMinionsKilled: r.neutralMinionsKilledTeamJungle,
      totalEnemyJungleMinionsKilled: r.neutralMinionsKilledEnemyJungle,
      visionClearedPings: 0
    };
  }
  // ==================== 好友 ====================
  /**
   * 获取好友列表
   * 包含每个好友的在线状态、游戏状态、gameId 等
   */
  getFriends() {
    return le("/lol-chat/v1/friends");
  }
  // ==================== 游戏资源 ====================
  /** 获取当前客户端的游戏版本号（如 "14.7.580.1234"） */
  getGameVersion() {
    return le("/lol-patch/v1/game-version");
  }
  /** 获取所有物品数据（含 iconPath / description） */
  getItems() {
    return le("/lol-game-data/assets/v1/items.json");
  }
  /** 获取所有召唤师技能数据（含 iconPath） */
  getSummonerSpells() {
    return le("/lol-game-data/assets/v1/summoner-spells.json");
  }
  /** 获取所有英雄摘要数据（含 squarePortraitPath） */
  getChampionSummary() {
    return le("/lol-game-data/assets/v1/champion-summary.json");
  }
  /** 获取所有符文数据（含 iconPath / description，对应单个符文 ID） */
  getPerks() {
    return le("/lol-game-data/assets/v1/perks.json");
  }
  /** 获取所有符文系样式（对应 perkPrimaryStyle / perkSubStyle） */
  getPerkStyles() {
    return le("/lol-game-data/assets/v1/perkstyles.json");
  }
  /** 获取斗魂竞技场 / 海克斯模式强化符文数据 */
  getAugments() {
    return le("/lol-game-data/assets/v1/cherry-augments.json");
  }
  // ==================== 旗帜 / 挑战身份 ====================
  /** 获取当前账号拥有的挑战旗帜库存 */
  async getRegaliaBannerInventory() {
    const s = await le("/lol-regalia/v3/inventory/REGALIA_BANNER");
    return S0(s);
  }
  /** 获取当前召唤师的 Regalia 装饰配置 */
  getRegalia() {
    return le("/lol-regalia/v2/current-summoner/regalia");
  }
  /** 更新当前召唤师的 Regalia 装饰配置 */
  updateRegalia(s) {
    return ul("/lol-regalia/v2/current-summoner/regalia", s);
  }
  /** 更新挑战身份偏好，例如展示旗帜、挑战徽章等；challengeIds 传空数组可清空三个展示位 */
  updateChallengePlayerPreferences(s) {
    return Ze("/lol-challenges/v1/update-player-preferences", s);
  }
  /** 应用挑战旗帜 */
  applyRegaliaBanner(s) {
    return this.updateChallengePlayerPreferences({ bannerAccent: s });
  }
  /** 获取玩家符文页 */
  getRunePages() {
    return le("/lol-perks/v1/pages");
  }
  /** 创建符文页 */
  createRunePage(s) {
    return Ze("/lol-perks/v1/pages", s);
  }
  /** 更新指定符文页 */
  updateRunePage(s, c) {
    return ul(`/lol-perks/v1/pages/${s}`, c);
  }
  /** 删除指定符文页 */
  deleteRunePage(s) {
    return ei(`/lol-perks/v1/pages/${s}`);
  }
  /** 创建或更新 Sona 管理的符文页，并设为当前使用页 */
  async applyRunePage(s) {
    const c = {
      ...s,
      current: !0
    }, o = await this.getRunePages(), r = (g) => g.isEditable !== !1, m = (g) => /\s-\s*Sona$/i.test(g.name), h = async (g) => {
      await Promise.allSettled(
        o.filter((A) => A.id !== g && m(A) && A.isDeletable !== !1).map((A) => this.deleteRunePage(A.id))
      );
    }, y = o.find((g) => g.name === s.name && g.isEditable !== !1);
    if (y) {
      const g = await this.updateRunePage(y.id, c);
      return await h(y.id), g;
    }
    const S = o.find((g) => m(g) && r(g));
    if (S) {
      const g = await this.updateRunePage(S.id, c);
      return await h(S.id), g;
    }
    try {
      return await this.createRunePage(c);
    } catch (g) {
      const A = o.find((C) => C.current && C.isEditable !== !1) ?? o.find((C) => C.isEditable !== !1);
      if (A)
        return this.updateRunePage(A.id, c);
      throw g;
    }
  }
  // ==================== 通知 ====================
  /**
   * 发送客户端原生通知（右下角弹窗）
   * @param title 通知标题
   * @param details 通知内容
   */
  sendNotification(s, c) {
    return Ze("/player-notifications/v1/notifications", {
      detailKey: "pre_translated_details",
      titleKey: "pre_translated_title",
      backgroundUrl: "",
      data: { title: s, details: c },
      iconUrl: "/lol-game-data/assets/v1/profile-icons/3867.jpg",
      // https://heimerdinger.lol/index.php/icon/sona-champie-icon-5s8jq
      source: "sona",
      state: "toast",
      type: "string"
    });
  }
  // ==================== 客户端设置备份/恢复 ====================
  async getPuuid() {
    const s = await le("/lol-login/v1/session");
    if (!s.puuid) throw new Error("未获取到 PUUID");
    return s.puuid;
  }
  loadAllBackups(s) {
    return pt.get("gameSettingsBackups")[s] ?? {};
  }
  saveAllBackups(s, c) {
    pt.set("gameSettingsBackups", {
      ...pt.get("gameSettingsBackups"),
      [s]: c
    });
  }
  /** 获取常规游戏设置（画质、声音、HUD 等，对应 game.cfg） */
  getGameSettings() {
    return le("/lol-game-settings/v1/game-settings");
  }
  /** 获取热键设置（对应 PersistedSettings.json 的热键部分） */
  getInputSettings() {
    return le("/lol-game-settings/v1/input-settings");
  }
  /**
   * 创建命名备份（同时拉取常规设置 + 热键设置）
   * @param name 用户自定义的备份名称
   */
  async backupSettings(s) {
    try {
      const c = await this.getPuuid(), [o, r] = await Promise.all([
        this.getGameSettings(),
        this.getInputSettings()
      ]), m = this.loadAllBackups(c);
      return m[s] = { general: o, input: r, timestamp: Date.now() }, this.saveAllBackups(c, m), !0;
    } catch {
      return !1;
    }
  }
  /**
   * 恢复指定名称的备份并写入磁盘
   * @param name 备份名称
   */
  async restoreSettings(s) {
    try {
      const c = await this.getPuuid(), r = this.loadAllBackups(c)[s];
      if (!r) throw new Error(`备份 "${s}" 不存在`);
      return r.general && await sl("/lol-game-settings/v1/game-settings", r.general), r.input && await sl("/lol-game-settings/v1/input-settings", r.input), await Ze("/lol-game-settings/v1/save"), !0;
    } catch {
      return !1;
    }
  }
  /**
   * 删除指定名称的备份
   * @param name 备份名称
   */
  async deleteBackup(s) {
    try {
      const c = await this.getPuuid(), o = this.loadAllBackups(c);
      return s in o ? (delete o[s], this.saveAllBackups(c, o), !0) : !1;
    } catch {
      return !1;
    }
  }
  /**
   * 获取所有备份列表（按时间倒序）
   */
  async listBackups() {
    try {
      const s = await this.getPuuid(), c = this.loadAllBackups(s);
      return Object.entries(c).map(([o, r]) => ({ name: o, timestamp: r.timestamp ?? 0 })).sort((o, r) => r.timestamp - o.timestamp);
    } catch {
      return [];
    }
  }
  // ==================== WebSocket 事件 ====================
  observeUriOnSocket(s) {
    if (!this.penguContext) {
      console.warn("[LCUManager] PenguContext 未绑定，无法监听事件。请先调用 lcu.bindContext(context)");
      return;
    }
    if (this.observedUris.has(s)) {
      console.log("[LCUManager] URI 已订阅到底层 socket，跳过重复 observe: %s", s);
      return;
    }
    this.observedUris.add(s), console.log("[LCUManager] 向当前 socket 订阅 URI: %s", s), this.penguContext.socket.observe(s, (c) => {
      console.log("[LCUManager] WS 收到事件 → uri=%s, data=%o", s, c);
      const o = c, r = this.eventListeners.get(s);
      r == null || r.forEach((m) => m(o));
    });
  }
  /**
   * 监听 LCU WebSocket 事件
   *
   * 基于 Pengu Loader 的 context.socket.observe 实现。
   * 支持同一 URI 注册多个回调。
   *
   * @param uri 事件 URI (e.g. '/lol-gameflow/v1/gameflow-phase')
   * @param callback 事件回调
   * @returns 取消监听的函数
   *
   * @example
   * ```ts
   * const unsubscribe = lcu.observe('/lol-gameflow/v1/gameflow-phase', (event) => {
   *   console.log('Phase changed:', event.data)
   * })
   *
   * // 稍后取消监听
   * unsubscribe()
   * ```
   */
  observe(s, c) {
    var r;
    console.log("[LCUManager] observe() called → uri=%s, hasContext=%s", s, String(!!this.penguContext)), console.log("[LCUManager] eventListeners has uri? %s, listeners count: %d", this.eventListeners.has(s), ((r = this.eventListeners.get(s)) == null ? void 0 : r.size) ?? 0);
    let o = this.eventListeners.get(s);
    return o || (o = /* @__PURE__ */ new Set(), this.eventListeners.set(s, o)), o.add(c), this.observeUriOnSocket(s), () => {
      const m = this.eventListeners.get(s);
      m == null || m.delete(c), m && m.size === 0 && this.eventListeners.delete(s);
    };
  }
  /**
   * 断开所有 WebSocket 事件监听
   * 应在插件卸载时调用
   */
  disconnect() {
    this.penguContext && this.penguContext.socket.disconnect(), this.eventListeners.clear(), this.observedUris.clear();
  }
}
const Ue = new E0(), M0 = /* @__PURE__ */ new Map(), N0 = /* @__PURE__ */ new Map(), C0 = /* @__PURE__ */ new Map(), R0 = /* @__PURE__ */ new Map(), nr = /* @__PURE__ */ new Map(), D0 = /* @__PURE__ */ new Map();
function lh(u) {
  return `/lol-game-data/assets/v1/champion-icons/${u}.png`;
}
function nh(u) {
  return M0.get(u) ?? (u > 0 ? `/lol-game-data/assets/v1/item-icons/${u}.png` : "");
}
function Xu(u) {
  return N0.get(u) ?? "";
}
function xc(u) {
  return C0.get(u) ?? "";
}
function Bc(u) {
  return R0.get(u) ?? "";
}
function ir(u) {
  var s;
  return ((s = nr.get(u)) == null ? void 0 : s.name) ?? `队列${u}`;
}
function w0(u) {
  return nr.get(u);
}
function ih(u) {
  var s;
  return ((s = D0.get(u)) == null ? void 0 : s.name) ?? `地图${u}`;
}
function _0() {
  const u = /* @__PURE__ */ new Set([
    "TUTORIAL",
    "TUTORIAL_MODULE_1",
    "TUTORIAL_MODULE_2",
    "TUTORIAL_MODULE_3",
    "PRACTICETOOL",
    "SWIFTPLAY",
    "TFT"
  ]), s = /* @__PURE__ */ new Set([
    "CHERRY_UNRANKED"
  ]), c = [];
  return nr.forEach((o) => {
    o.id <= 0 || o.isCustom || !o.isEnabled || o.queueAvailability !== "Available" || u.has(o.gameMode) || s.has(o.type) || c.push({ id: o.id, name: o.name || o.shortName || `队列${o.id}` });
  }), c.sort((o, r) => o.name.localeCompare(r.name, "zh")), c;
}
const O0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC6UlEQVR42u3YXUhTcRjH8a4fCILeMHpDGExXlrmbQlNbaJT5VqZk+LaZpUmgkY2i4Y0QaUG2iAJ7pZVXQSAIQRYJvpVUYBEldaGBEVkIXUQ8/fDh8RyHYxfbmRc6+ICeM/x/OefxnLMtWXwtuBetsNuhBAohfr5jGmEQPsIH6If6+Yrxwitgk38wAI2xjvHB8EzIvnKmrMNGmIR6YxVzAd4AT8tzM/kfib1l5qjX4ItFzFvgaQdqmK51KonKrTJHDYPPqpi0WTHFdUaIu4np2Dnj98KjwVFOK4Lq4SswlZwwFi9vZFqZwLQqkclzRrfL0ZOgUfBEMyQLuuE9jANTSjbT5XtMpSclRhaWnytOMbXdYdq6W7ePwwh0gSvyIImZBJ6xIUWOUnapbjPsr2QqOs60Ljl430/oijTGAYPA5EiXU9Lsnz3EORXGogXV5n3y3qrTTAlp+p4BsEcStBSeA9NqB1PteVksWL5Hjspc+2rOynxJUA9QpEfpJoyD/GF3ky4WXlmDecbG4Hq0bp73YUwHF8McPqa4TkM0pgNs0fpPs8Ez+B3yomienTy3OWYSujUmWkHJMARMW1zGkGKgEWDEXH3ItOeI7NuUwZS40zzMjmgGxUMfMNm2M128ZSzmKpaQ9gBTxkHZtjmTqfU200anBvXC2mgGEfTMDPaVBxLlSJcF0wqYduRqjFwYL93VmL/w1IpbRwCmgMnXLqcIUTg1xrwk7WLEyD5vm27/BR1W3eknwHw9klODKMyWHBXdXu3VoG/gsyKoFr4A06FaXVijNMZQUK1Bn6HSiqAcGAGmzCJdOLTUfA16By4rgpJgSAc3bJA9VYP6wWZF0DJ4AUxrkvT6M7f2QPD9a6lVT41P4A8wtdwIHdTs15gp6LTymdoPP4CpoSV0UH2zBn2HViuDPDCqD2m4as9t/TYN+gSlVgYth8d6PQpjAgJAVn8UckIAeqEvhJcQAGcsP73GQXwIcYtfwyyY1390/qDYpdusgQAAAABJRU5ErkJggg==", z0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAC40lEQVR42u3YTUgUYRjA8c6rRpS6X9phwVj3w1Vb6xQRQhEIkURJkmEsRZGHEjIjWjp0CLwWQSAFwUaHsgxJUbNI8KukAosoqYMGRmQhdIh4/LO8rzMDLntwZj3owg/WmZH97/jMO7tuWH+suYerMBhEA+oRWO2YVozjEz5iFC2rFdOO1xCT/xhDa65jkpjUIYc9FXIARhihBOcq5jreQiCN3pgMbN2Zdsga9QbJXMS8g0CaiRkkRBvAUU/MHDWJpFMxu8wxp7yVSyFtviq54qte+vm41xqFuBNBLfgGOW2KOU9MHtvy0c5zvb3ZiJpGws6QvejFB8xCaooj8rR0h5wljBhxKXloJeoJ+yqLw3r7LKbQg1o7gnoxD9G8ReXps3RQDbFZAzOU4Oy4Oca8Hb/Qs9KYMMYhId7xRd793ZIayxAfMUU1EWLed4djL/A7weKQPmYMwZUEFeAFZCOu+vXgWh0jJGHMlcVlhj1fBWMIrpWepdt6dvLRZgxuVufUwLuAGdyy6+Z5DzN6cFuMs5ERywIRlphOlNl1pZXhOf5AICeMebEYQKN1HZpHr46xK6gKE5AYw62HlIEmwIjpR70a8gjHlcM0zGE7gwIYgQSKQvKQdSaoXqzOE02H9GGfO5reFmXfY47xG5f+MErsDHJhSA/2M178ES8YUlG1hOx2Rywx3VAx/9DvxK0jhQVIZ0lcBlVUWEVBKnjOKp3ed5Nj1Pbf6HTqTj8Hy3rURUCEkBi6VQzkkq9KB31H0omgM/gKOWm97PWfyLKtybjSvqDZiaA6TEH2u6NZ16E9asDxHrVOBFVgQg1u1qBtxv1rFGVOBG3CS8jmwnK1/iyvDwXW+1eBU58au/EXcr+0JmMQd3kds4AHTn6mvoGfkA7/9oxB1/zVOugHOpwMSmAa4mMVZtVelsdYoT+j0cmgLejCHCSLOaTgcvqrUBwpDGMkg1dIIZ7Lb69eBDLwrv8bZs08FgGAGn+XDk4mcQAAAABJRU5ErkJggg==", oi = {
  CHALLENGER: "#f1c40f",
  GRANDMASTER: "#e74c3c",
  MASTER: "#9b59b6",
  DIAMOND: "#3498db",
  EMERALD: "#00d084",
  PLATINUM: "#b8c4cc",
  GOLD: "#c8aa6e",
  SILVER: "#a09b8c",
  BRONZE: "#cd7f32",
  IRON: "#7e7e7e",
  UNRANKED: "#5c5b57"
};
function kc(u) {
  return u >= 1e3 ? `${(u / 1e3).toFixed(1)}k` : String(u);
}
function U0(u) {
  return u.toLocaleString();
}
function L0(u) {
  const s = Math.floor(u / 60), c = u % 60;
  return `${s}:${String(c).padStart(2, "0")}`;
}
function H0(u) {
  return new Date(u).toLocaleString(void 0, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  });
}
function x0(u) {
  return new Date(u).toLocaleTimeString(void 0, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  });
}
function _c(u, s) {
  return /* @__PURE__ */ D.jsx("span", { className: s ? "smd-kda-max" : void 0, children: u });
}
function xu(u, s) {
  return s > 0 ? u.get(s) ?? "" : "";
}
function B0(u, s) {
  var c;
  return (c = u.get(s)) == null ? void 0 : c.player;
}
function k0() {
  return { rankText: it("rank.UNRANKED"), rankColor: oi.UNRANKED };
}
function uh(u) {
  return !u || u === "UNRANKED" ? k0() : {
    rankText: it(`rank.${u}`),
    rankColor: oi[u] ?? oi.UNRANKED
  };
}
function j0(u, s = "") {
  const c = uh(s);
  if (!u || typeof u != "object") return c;
  const o = u.queueMap;
  if (!o) return c;
  const r = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"], m = { IV: 1, III: 2, II: 3, I: 4 }, h = [];
  for (const [S, g] of [["RANKED_SOLO_5x5", it("rank.queue.RANKED_SOLO_5x5")], ["RANKED_FLEX_SR", it("rank.queue.RANKED_FLEX_SR")]]) {
    const A = o[S];
    if (!A) continue;
    const C = A.tier ?? "", L = A.division ?? "";
    C && C !== "UNRANKED" && h.push({ key: S, label: g, tier: C, division: L });
  }
  if (h.length === 0) return c;
  h.sort((S, g) => {
    const A = r.indexOf(g.tier) - r.indexOf(S.tier);
    return A !== 0 ? A : (m[g.division] ?? 0) - (m[S.division] ?? 0);
  });
  const y = h[0];
  return {
    rankText: `${it(`rank.${y.tier}`)}${y.division && y.division !== "NA" ? ` ${y.division}` : ""} ${y.label}`,
    rankColor: oi[y.tier] ?? oi.UNRANKED
  };
}
function G0({ team: u, participants: s, isRed: c }) {
  const o = s.reduce((h, y) => h + y.stats.kills, 0), r = s.reduce((h, y) => h + y.stats.goldEarned, 0), m = s.reduce((h, y) => h + y.stats.totalDamageDealtToChampions, 0);
  return /* @__PURE__ */ D.jsxs("div", { className: "smd-team-summary", children: [
    /* @__PURE__ */ D.jsxs("span", { title: "击杀", children: [
      /* @__PURE__ */ D.jsx("span", { className: "smd-sprite-icon", style: { WebkitMaskImage: "url(/fe/lol-match-history/icons.png)", WebkitMaskPositionY: "0%" } }),
      o
    ] }),
    /* @__PURE__ */ D.jsxs("span", { className: "smd-stat-gold", title: "金币", children: [
      /* @__PURE__ */ D.jsx("span", { className: "smd-stat-icon", style: { WebkitMaskImage: "url(/fe/lol-match-history/icon_gold.png)" } }),
      kc(r)
    ] }),
    /* @__PURE__ */ D.jsxs("span", { className: "smd-team-damage", title: "伤害", children: [
      /* @__PURE__ */ D.jsx("span", { className: "smd-damage-icon" }),
      kc(m)
    ] }),
    /* @__PURE__ */ D.jsxs("span", { className: "smd-team-turret", title: "防御塔", children: [
      /* @__PURE__ */ D.jsx("img", { src: c ? z0 : O0, alt: "" }),
      (u == null ? void 0 : u.towerKills) ?? 0
    ] })
  ] });
}
function q0({
  participant: u,
  identity: s,
  maxDamage: c,
  highlighted: o,
  isRed: r,
  rankInfo: m,
  iconMaps: h
}) {
  const y = u.stats, S = [y.item0, y.item1, y.item2, y.item3, y.item4, y.item5], g = [
    { icon: xc(y.perk0) || xu(h.perks, y.perk0), type: "rune" },
    { icon: Bc(y.perkSubStyle) || xu(h.perkStyles, y.perkSubStyle), type: "rune" },
    { icon: Xu(u.spell1Id) || xu(h.spells, u.spell1Id), type: "spell" },
    { icon: Xu(u.spell2Id) || xu(h.spells, u.spell2Id), type: "spell" }
  ].filter((ae) => ae.icon), A = Math.max(y.kills, y.deaths, y.assists), C = c > 0 ? Math.max(6, Math.round(y.totalDamageDealtToChampions / c * 100)) : 0, L = c > 0 && y.totalDamageDealtToChampions === c, B = s ? `${s.gameName}#${s.tagLine}` : it("matchDetail.playerFallback", { id: u.participantId }), q = y.totalMinionsKilled + y.neutralMinionsKilled, K = m ?? uh(u.highestAchievedSeasonTier), x = () => {
    s && navigator.clipboard.writeText(B).then(() => {
      Toast.success(it("matchDetail.copyId"));
    });
  };
  return /* @__PURE__ */ D.jsxs("div", { className: `smd-player-row${r ? " smd-player-row--red" : ""}${o ? " smd-player-row--focus" : ""}${L ? " smd-player-row--top-damage" : ""}`, children: [
    /* @__PURE__ */ D.jsxs("div", { className: "smd-champ-block", children: [
      /* @__PURE__ */ D.jsxs("div", { className: "smd-champ", children: [
        /* @__PURE__ */ D.jsx("img", { src: lh(u.championId), alt: "" }),
        /* @__PURE__ */ D.jsx("span", { className: "smd-champ-level", children: y.champLevel })
      ] }),
      /* @__PURE__ */ D.jsx("div", { className: "smd-loadout", children: g.map(({ icon: ae, type: Y }, $) => /* @__PURE__ */ D.jsx("div", { className: `smd-loadout-slot smd-loadout-${Y}`, children: /* @__PURE__ */ D.jsx("img", { src: ae, alt: "" }) }, `${Y}-${$}`)) })
    ] }),
    /* @__PURE__ */ D.jsxs("div", { className: "smd-player-identity", title: B, children: [
      /* @__PURE__ */ D.jsx("button", { className: "smd-player-name", onClick: x, type: "button", children: /* @__PURE__ */ D.jsx("span", { children: (s == null ? void 0 : s.gameName) ?? it("matchDetail.playerFallback", { id: u.participantId }) }) }),
      /* @__PURE__ */ D.jsxs("strong", { className: "smd-kda", children: [
        _c(y.kills, y.kills === A),
        " / ",
        _c(y.deaths, y.deaths === A),
        " / ",
        _c(y.assists, y.assists === A)
      ] }),
      /* @__PURE__ */ D.jsx("span", { className: "smd-player-rank", style: { color: K.rankColor }, children: K.rankText })
    ] }),
    /* @__PURE__ */ D.jsx("div", { className: "smd-metrics", children: /* @__PURE__ */ D.jsxs("div", { className: "smd-damage", children: [
      /* @__PURE__ */ D.jsxs("span", { className: "smd-damage-value", children: [
        /* @__PURE__ */ D.jsx("span", { className: "smd-damage-icon" }),
        /* @__PURE__ */ D.jsx("strong", { children: U0(y.totalDamageDealtToChampions) })
      ] }),
      /* @__PURE__ */ D.jsx("div", { className: "smd-damage-bar", children: /* @__PURE__ */ D.jsx("i", { style: { width: `${C}%` } }) })
    ] }) }),
    /* @__PURE__ */ D.jsxs("div", { className: "smd-items-block", children: [
      /* @__PURE__ */ D.jsxs("div", { className: "smd-stat-strip", children: [
        /* @__PURE__ */ D.jsxs("span", { className: "smd-stat-pill", title: "补刀", children: [
          /* @__PURE__ */ D.jsx("span", { className: "smd-stat-icon", style: { WebkitMaskImage: "url(/fe/lol-match-history/icon_minions.png)" } }),
          q
        ] }),
        /* @__PURE__ */ D.jsxs("span", { className: "smd-stat-pill smd-stat-gold", title: "金币", children: [
          /* @__PURE__ */ D.jsx("span", { className: "smd-stat-icon", style: { WebkitMaskImage: "url(/fe/lol-match-history/icon_gold.png)" } }),
          kc(y.goldEarned)
        ] })
      ] }),
      /* @__PURE__ */ D.jsx("div", { className: "smd-items", children: S.map((ae, Y) => /* @__PURE__ */ D.jsx("div", { className: "smd-item", children: ae > 0 && /* @__PURE__ */ D.jsx("img", { src: nh(ae), alt: "" }) }, Y)) })
    ] })
  ] });
}
function Y0({ open: u, onClose: s, gameId: c, focusPuuid: o }) {
  const { t: r } = th(), [m, h] = Z.useState(null), [y, S] = Z.useState(/* @__PURE__ */ new Map()), [g, A] = Z.useState({
    spells: /* @__PURE__ */ new Map(),
    perks: /* @__PURE__ */ new Map(),
    perkStyles: /* @__PURE__ */ new Map()
  }), [C, L] = Z.useState(!1), [B, q] = Z.useState("");
  Z.useEffect(() => {
    if (!u || !c) return;
    let $ = !1;
    return L(!0), q(""), h(null), S(/* @__PURE__ */ new Map()), Ue.getMatchDetail(c).then(async (G) => {
      const J = await Promise.all(G.participantIdentities.map(async (oe) => {
        const Q = await Ue.getRankedStats(oe.player.puuid).catch(() => null), ne = G.participants.find((he) => he.participantId === oe.participantId);
        return [oe.player.puuid, j0(Q, (ne == null ? void 0 : ne.highestAchievedSeasonTier) ?? "")];
      }));
      $ || h(G), $ || S(new Map(J));
    }).catch(() => {
      $ || q(r("matchDetail.error"));
    }).finally(() => {
      $ || L(!1);
    }), () => {
      $ = !0;
    };
  }, [u, c, r]), Z.useEffect(() => {
    if (!u) return;
    let $ = !1;
    return Promise.all([
      Ue.getSummonerSpells().catch(() => []),
      Ue.getPerks().catch(() => []),
      Ue.getPerkStyles().catch(() => ({ styles: [] }))
    ]).then(([G, J, oe]) => {
      $ || A({
        spells: new Map(G.map((Q) => [Q.id, Q.iconPath.toLowerCase()])),
        perks: new Map(J.map((Q) => [Q.id, Q.iconPath.toLowerCase()])),
        perkStyles: new Map(oe.styles.map((Q) => [Q.id, Q.iconPath.toLowerCase()]))
      });
    }), () => {
      $ = !0;
    };
  }, [u]);
  const K = Z.useMemo(() => {
    const $ = /* @__PURE__ */ new Map();
    return m == null || m.participantIdentities.forEach((G) => $.set(G.participantId, G)), $;
  }, [m]), x = Z.useMemo(() => {
    const $ = (m == null ? void 0 : m.participants.filter((J) => J.teamId === 100)) ?? [], G = (m == null ? void 0 : m.participants.filter((J) => J.teamId === 200)) ?? [];
    return { team100: $, team200: G };
  }, [m]), ae = Z.useMemo(() => Math.max(0, ...(m == null ? void 0 : m.participants.map(($) => $.stats.totalDamageDealtToChampions)) ?? [0]), [m]), Y = ($, G, J) => {
    const oe = m == null ? void 0 : m.teams.find((ne) => ne.teamId === $), Q = (oe == null ? void 0 : oe.win) === "Win" || G.some((ne) => ne.stats.win);
    return /* @__PURE__ */ D.jsxs("section", { className: `smd-team ${J ? "smd-team--red" : "smd-team--blue"} ${Q ? "smd-win" : "smd-loss"}`, children: [
      /* @__PURE__ */ D.jsxs("div", { className: `smd-team-header ${J ? "smd-team-header--red" : "smd-team-header--blue"}`, children: [
        /* @__PURE__ */ D.jsxs("div", { children: [
          /* @__PURE__ */ D.jsx("strong", { children: r($ === 100 ? "matchDetail.team.blue" : "matchDetail.team.red") }),
          /* @__PURE__ */ D.jsx("span", { children: r(Q ? "common.win" : "common.loss") })
        ] }),
        /* @__PURE__ */ D.jsx(G0, { team: oe, participants: G, isRed: J })
      ] }),
      /* @__PURE__ */ D.jsx("div", { className: "smd-team-list", children: G.map((ne) => {
        const he = B0(K, ne.participantId);
        return /* @__PURE__ */ D.jsx(
          q0,
          {
            participant: ne,
            identity: he,
            maxDamage: ae,
            highlighted: !!(o && (he == null ? void 0 : he.puuid) === o),
            isRed: J,
            rankInfo: he ? y.get(he.puuid) : void 0,
            iconMaps: g
          },
          ne.participantId
        );
      }) })
    ] });
  };
  return /* @__PURE__ */ D.jsx(Wg, { open: u, onClose: s, width: 1240, height: 640, children: /* @__PURE__ */ D.jsxs("div", { className: "smd-container", children: [
    /* @__PURE__ */ D.jsx("div", { className: "smd-header", children: /* @__PURE__ */ D.jsxs("div", { className: "smd-title-line", children: [
      /* @__PURE__ */ D.jsx("span", { className: "smd-title", children: r("matchDetail.reportTitle") }),
      m && /* @__PURE__ */ D.jsxs("div", { className: "smd-meta", children: [
        /* @__PURE__ */ D.jsx("span", { children: ir(m.queueId) }),
        /* @__PURE__ */ D.jsx("span", { children: ih(m.mapId) }),
        /* @__PURE__ */ D.jsx("span", { children: r("matchDetail.duration", { duration: L0(m.gameDuration) }) }),
        /* @__PURE__ */ D.jsx("span", { children: r("matchDetail.start", { time: x0(m.gameCreation) }) }),
        /* @__PURE__ */ D.jsx("span", { children: H0(m.gameCreation) }),
        /* @__PURE__ */ D.jsxs("span", { children: [
          "ID:",
          m.gameId
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ D.jsxs("div", { className: "smd-body", children: [
      C && /* @__PURE__ */ D.jsx("div", { className: "smd-empty", children: r("matchDetail.loading") }),
      B && /* @__PURE__ */ D.jsx("div", { className: "smd-empty smd-error", children: B }),
      !C && !B && m && /* @__PURE__ */ D.jsxs("div", { className: "smd-teams", children: [
        /* @__PURE__ */ D.jsx("div", { className: "smd-team-divider", "aria-hidden": "true" }),
        Y(100, x.team100, !1),
        Y(200, x.team200, !0)
      ] })
    ] })
  ] }) });
}
function Og(u) {
  return u >= 1e3 ? `${(u / 1e3).toFixed(1)}k` : String(u);
}
function Q0(u) {
  const s = new Date(u), c = /* @__PURE__ */ new Date(), o = new Date(c.getFullYear(), c.getMonth(), c.getDate()), r = new Date(s.getFullYear(), s.getMonth(), s.getDate()), m = Math.round((o.getTime() - r.getTime()) / (1e3 * 60 * 60 * 24)), h = s.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return m === 0 ? `${it("common.today")} ${h}` : m === 1 ? `${it("common.yesterday")} ${h}` : m === 2 ? `${it("common.dayBeforeYesterday")} ${h}` : s.toLocaleDateString(void 0, { month: "2-digit", day: "2-digit" }) + " " + h;
}
function zg(u, s) {
  var g, A, C, L, B, q, K;
  const c = u.json, o = c.participants.find((x) => x.puuid === s);
  if (!o) return null;
  let r = ih(c.mapId);
  if (c.mapId === 12) {
    const x = (g = c.gameModeMutators) == null ? void 0 : g[0];
    x === "mapskin_ha_bilgewater" ? r = "屠夫之桥" : x === "mapskin_map12_bloom" ? r = "莲华栈桥" : r = "嚎哭深渊";
  }
  const m = (C = (A = o.perks) == null ? void 0 : A.styles) == null ? void 0 : C[0], h = (B = (L = o.perks) == null ? void 0 : L.styles) == null ? void 0 : B[1], y = ((K = (q = m == null ? void 0 : m.selections) == null ? void 0 : q[0]) == null ? void 0 : K.perk) ?? 0, S = (h == null ? void 0 : h.style) ?? 0;
  return {
    gameId: c.gameId,
    queueId: c.queueId,
    win: o.win,
    championId: o.championId,
    level: o.champLevel,
    kills: o.kills,
    deaths: o.deaths,
    assists: o.assists,
    cs: o.totalMinionsKilled + o.neutralMinionsKilled,
    gold: o.goldEarned,
    damage: o.totalDamageDealtToChampions,
    queueName: ir(c.queueId),
    mapName: r,
    spell1Id: o.spell1Id,
    spell2Id: o.spell2Id,
    perk0: y,
    perkSubStyle: S,
    items: [o.item0, o.item1, o.item2, o.item3, o.item4, o.item5, o.item6],
    gameCreation: c.gameCreation
  };
}
function V0({ match: u, onOpenDetail: s }) {
  const c = u.win ? "smh-win" : "smh-loss", o = u.win ? it("common.win") : it("common.loss"), [r, m] = Z.useState(!1), h = (y) => {
    y.stopPropagation(), navigator.clipboard.writeText(String(u.gameId)).then(() => {
      m(!0), setTimeout(() => m(!1), 1500);
    });
  };
  return /* @__PURE__ */ D.jsxs(
    "div",
    {
      className: `smh-row ${c}`,
      role: "button",
      tabIndex: 0,
      onClick: () => s(u.gameId),
      onKeyDown: (y) => {
        (y.key === "Enter" || y.key === " ") && (y.preventDefault(), s(u.gameId));
      },
      title: it("matchHistory.clickDetail"),
      children: [
        /* @__PURE__ */ D.jsxs("div", { className: "smh-row-left", children: [
          /* @__PURE__ */ D.jsxs("div", { className: "smh-champion", children: [
            /* @__PURE__ */ D.jsx("div", { className: "smh-champion-mask", children: /* @__PURE__ */ D.jsx("img", { className: "smh-champion-icon", src: lh(u.championId), alt: "" }) }),
            /* @__PURE__ */ D.jsx("span", { className: "smh-champion-level", children: u.level })
          ] }),
          /* @__PURE__ */ D.jsxs("div", { className: "smh-row-info", children: [
            /* @__PURE__ */ D.jsx("span", { className: `smh-status ${c}`, children: o }),
            /* @__PURE__ */ D.jsx("span", { className: "smh-gamemode", children: u.queueName }),
            /* @__PURE__ */ D.jsxs("div", { className: "smh-spells", children: [
              /* @__PURE__ */ D.jsx("img", { className: "smh-spell", src: Xu(u.spell1Id), alt: "" }),
              /* @__PURE__ */ D.jsx("img", { className: "smh-spell", src: Xu(u.spell2Id), alt: "" }),
              u.perk0 > 0 && xc(u.perk0) && /* @__PURE__ */ D.jsxs(D.Fragment, { children: [
                /* @__PURE__ */ D.jsx("img", { className: "smh-perk smh-perk-primary", src: xc(u.perk0), alt: "" }),
                u.perkSubStyle > 0 && Bc(u.perkSubStyle) && /* @__PURE__ */ D.jsx("img", { className: "smh-perk smh-perk-sub", src: Bc(u.perkSubStyle), alt: "" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ D.jsxs("div", { className: "smh-row-center", children: [
          /* @__PURE__ */ D.jsx("div", { className: "smh-items", children: u.items.map((y, S) => /* @__PURE__ */ D.jsx("div", { className: "smh-item-slot", children: y > 0 && /* @__PURE__ */ D.jsx("img", { className: "smh-item-icon", src: nh(y), alt: "" }) }, S)) }),
          /* @__PURE__ */ D.jsxs("div", { className: "smh-stats-line", children: [
            /* @__PURE__ */ D.jsxs("span", { className: "smh-kda", children: [
              /* @__PURE__ */ D.jsx("span", { className: "smh-sprite-icon", style: { WebkitMaskImage: "url(/fe/lol-match-history/icons.png)", WebkitMaskPositionY: "0%", width: "22px", height: "22px" } }),
              /* @__PURE__ */ D.jsx("span", { className: `smh-kda-num${u.kills >= u.deaths && u.kills >= u.assists ? " smh-kda-highlight" : ""}`, children: u.kills }),
              " / ",
              /* @__PURE__ */ D.jsx("span", { className: `smh-kda-num${u.deaths > u.kills && u.deaths > u.assists ? " smh-kda-highlight" : ""}`, children: u.deaths }),
              " / ",
              /* @__PURE__ */ D.jsx("span", { className: `smh-kda-num${u.assists > u.kills && u.assists > u.deaths ? " smh-kda-highlight" : ""}`, children: u.assists })
            ] }),
            /* @__PURE__ */ D.jsxs("span", { className: "smh-cs", children: [
              /* @__PURE__ */ D.jsx("span", { className: "smh-stat-icon", style: { WebkitMaskImage: "url(/fe/lol-match-history/icon_minions.png)" } }),
              u.cs
            ] }),
            /* @__PURE__ */ D.jsxs("span", { className: "smh-gold", children: [
              /* @__PURE__ */ D.jsx("span", { className: "smh-stat-icon", style: { WebkitMaskImage: "url(/fe/lol-match-history/icon_gold.png)" } }),
              Og(u.gold)
            ] }),
            /* @__PURE__ */ D.jsxs("span", { className: "smh-damage", children: [
              "🗡️ ",
              Og(u.damage)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ D.jsxs("div", { className: "smh-row-right", children: [
          /* @__PURE__ */ D.jsx("span", { className: "smh-mapname", children: u.mapName }),
          /* @__PURE__ */ D.jsx("span", { className: "smh-date", children: Q0(u.gameCreation) }),
          /* @__PURE__ */ D.jsxs("span", { className: "smh-gameid", onClick: h, children: [
            "ID:",
            u.gameId,
            /* @__PURE__ */ D.jsx("span", { className: `smh-copy-icon ${r ? "smh-copied" : ""}`, style: { WebkitMaskImage: "url(/fe/lol-static-assets/images/game-id-clipboard-copy.svg)" } })
          ] })
        ] })
      ]
    }
  );
}
function Zu({ open: u, onClose: s, puuid: c, playerName: o, queueId: r }) {
  var U;
  const { t: m } = th(), [h, y] = Z.useState(o), [S, g] = Z.useState([]), [A, C] = Z.useState(!1), [L, B] = Z.useState(!1), [q, K] = Z.useState(""), [x, ae] = Z.useState(!0), [Y, $] = Z.useState(r ?? 0), [G, J] = Z.useState(!1), [oe, Q] = Z.useState(null), ne = Z.useRef(""), he = Z.useRef(null), ve = Z.useRef(null), Le = Z.useRef(0), I = Z.useRef(null), at = 20, He = 20;
  Z.useEffect(() => {
    const H = o.trim(), j = !!H.replace(/#/g, "").trim();
    if (y(j ? H : m("common.unknown")), !u || !c || j) return;
    let W = !1;
    return Ue.getSummonerByPuuid(c).then((te) => {
      if (W) return;
      const ue = te.gameName ? `${te.gameName}${te.tagLine ? `#${te.tagLine}` : ""}` : te.displayName;
      ue && y(ue);
    }).catch(() => {
    }), () => {
      W = !0;
    };
  }, [u, o, c, m]);
  const [Ye, w] = Z.useState([]);
  Z.useEffect(() => {
    const H = _0();
    w(H);
  }, []), Z.useEffect(() => {
    const H = (j) => {
      ve.current && !ve.current.contains(j.target) && J(!1);
    };
    return document.addEventListener("mousedown", H), () => document.removeEventListener("mousedown", H);
  }, []);
  const k = Z.useCallback(async (H) => {
    C(!0), K(""), g([]), ae(!0), Le.current = 0;
    try {
      const j = Ku(H), te = (await Ue.getSgpMatchHistory(c, {
        startIndex: 0,
        count: at,
        tag: j || void 0
      })).games ?? [], ue = te.map((ke) => zg(ke, c)).filter((ke) => ke !== null);
      g(ue), Le.current = at, te.length < at && ae(!1);
    } catch {
      K(m("matchHistory.error", { error: "" }).trim());
    } finally {
      C(!1);
    }
  }, [c, m]), P = Z.useCallback(async () => {
    if (!(L || !x)) {
      B(!0);
      try {
        const H = Ku(Y), W = (await Ue.getSgpMatchHistory(c, {
          startIndex: Le.current,
          count: He,
          tag: H || void 0
        })).games ?? [], te = W.map((ue) => zg(ue, c)).filter((ue) => ue !== null);
        g((ue) => [...ue, ...te]), Le.current += W.length, W.length < He && ae(!1);
      } catch {
      } finally {
        B(!1);
      }
    }
  }, [c, Y, L, x]), be = Z.useRef(P);
  be.current = P, Z.useEffect(() => {
    if (!u) return;
    const H = requestAnimationFrame(() => {
      const j = he.current;
      if (!j) return;
      const W = () => {
        const { scrollTop: te, scrollHeight: ue, clientHeight: ke } = j;
        ue - te - ke < 60 && be.current();
      };
      j.addEventListener("scroll", W, { passive: !0 }), I.current = () => j.removeEventListener("scroll", W);
    });
    return () => {
      var j;
      cancelAnimationFrame(H), (j = I.current) == null || j.call(I), I.current = null;
    };
  }, [u]), Z.useEffect(() => {
    if (!u || !c) return;
    const H = `${c}-${r ?? 0}`;
    H !== ne.current && (ne.current = H, $(r ?? 0), k(r ?? 0));
  }, [u, c, r, k]);
  const Ae = (H) => {
    $(H), J(!1), ne.current = `${c}-${H}`, k(H);
  };
  Z.useEffect(() => {
    u || (ne.current = "");
  }, [u]);
  const b = Y > 0 ? ((U = Ye.find((H) => H.id === Y)) == null ? void 0 : U.name) ?? ir(Y) : m("matchHistory.filter.all");
  return /* @__PURE__ */ D.jsx(Wg, { open: u, onClose: s, width: 860, height: 620, children: /* @__PURE__ */ D.jsxs("div", { className: "smh-container", children: [
    /* @__PURE__ */ D.jsxs("div", { className: "smh-header", children: [
      /* @__PURE__ */ D.jsx("span", { className: "smh-title", children: m("matchHistory.title", { playerName: h }) }),
      /* @__PURE__ */ D.jsxs("div", { className: "smh-filter", ref: ve, children: [
        /* @__PURE__ */ D.jsxs(
          "button",
          {
            className: `smh-filter-trigger${G ? " smh-filter-trigger--open" : ""}`,
            onClick: () => J(!G),
            type: "button",
            children: [
              /* @__PURE__ */ D.jsx("span", { children: b }),
              /* @__PURE__ */ D.jsx("svg", { className: `smh-filter-arrow${G ? " smh-filter-arrow--open" : ""}`, width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ D.jsx("polyline", { points: "6 9 12 15 18 9" }) })
            ]
          }
        ),
        G && /* @__PURE__ */ D.jsxs("div", { className: "smh-filter-dropdown", children: [
          /* @__PURE__ */ D.jsx(
            "button",
            {
              className: `smh-filter-option${Y === 0 ? " smh-filter-option--active" : ""}`,
              onClick: () => Ae(0),
              type: "button",
              children: m("matchHistory.filter.all")
            }
          ),
          Ye.map((H) => /* @__PURE__ */ D.jsx(
            "button",
            {
              className: `smh-filter-option${Y === H.id ? " smh-filter-option--active" : ""}`,
              onClick: () => Ae(H.id),
              type: "button",
              children: H.name
            },
            H.id
          ))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ D.jsxs("div", { className: "smh-list", ref: he, children: [
      A && /* @__PURE__ */ D.jsx("div", { className: "smh-empty", children: m("matchHistory.loading") }),
      q && /* @__PURE__ */ D.jsx("div", { className: "smh-empty smh-error", children: q }),
      !A && !q && S.length === 0 && /* @__PURE__ */ D.jsx("div", { className: "smh-empty", children: m("matchHistory.empty") }),
      S.map((H) => /* @__PURE__ */ D.jsx(V0, { match: H, onOpenDetail: Q }, H.gameId)),
      L && /* @__PURE__ */ D.jsx("div", { className: "smh-empty", children: m("matchHistory.loadingMore") }),
      !A && !q && S.length > 0 && /* @__PURE__ */ D.jsx("div", { className: "smh-empty smh-no-more", children: x ? m("matchHistory.loadMore") : m("matchHistory.noMore", { count: S.length }) })
    ] }),
    /* @__PURE__ */ D.jsx(
      Y0,
      {
        open: oe != null,
        onClose: () => Q(null),
        gameId: oe,
        focusPuuid: c
      }
    )
  ] }) });
}
const sh = "sona";
let ku = `//plugins/${sh}/`, Ba = sh;
function Oc(u, s = {}) {
  console.info("[Sona][PluginResolver] %s", u, {
    ...s,
    pluginBaseUrl: ku,
    pluginFolderName: Ba
  });
}
function oh(u) {
  return u.replace(/\\/g, "/");
}
function K0(u) {
  return u.split(/[?#]/, 1)[0] ?? u;
}
function Ug(u) {
  const s = K0(oh(u)), c = s.match(/(?:^|\/)plugins\/([^/]+)\//i);
  if (!c) return null;
  const o = c.index + c[0].length;
  return s.substring(0, o);
}
function Lg(u) {
  const o = oh(u).replace(/\/+$/, "").split("/").at(-1);
  return o ? decodeURIComponent(o) : null;
}
function Hg(u) {
  var c;
  const s = (c = u == null ? void 0 : u.meta) == null ? void 0 : c.name;
  return typeof s == "string" && s ? s : null;
}
function X0(u, s) {
  const c = typeof window.getScriptPath == "function" ? window.getScriptPath() : "", o = c ? Ug(c) : null, r = o ? Lg(o) : null;
  if (r) {
    Ba = r, ku = `//plugins/${encodeURIComponent(Ba)}/`, Oc("initialized from window.getScriptPath() plugin folder", {
      metaUrl: u,
      scriptPath: c,
      scriptBaseUrl: o
    });
    return;
  }
  const m = u ? Ug(u) : null, h = m ? Lg(m) : null;
  if (h) {
    Ba = h, ku = `//plugins/${encodeURIComponent(Ba)}/`, Oc("initialized from import.meta.url plugin folder", {
      metaUrl: u,
      scriptPath: c,
      baseUrl: m
    });
    return;
  }
  Ba = Hg(s) ?? Ba, ku = `//plugins/${encodeURIComponent(Ba)}/`, Oc("initialized from context fallback", {
    metaUrl: u,
    contextPluginName: Hg(s),
    scriptPath: c
  });
}
function an(u) {
  const s = atob(u), c = Uint8Array.from(s, (o) => o.charCodeAt(0));
  return new TextDecoder().decode(c);
}
an("aHR0cHM6Ly9hcGktdGFrdW1pLm1paG95b2dpZnQuY29tL3VwbG9hZC9vdXRlci9nZXRQYXJhbXNCeUFjY291bnQ=");
an("aHR0cHM6Ly9wbGF0LXNoLW9wZXJhdGlvbi1wcm9kLXVwbG9hZC11Z2MuY24tc2hhbmdoYWkub3NzLmFsaXl1bmNzLmNvbS8=");
an("aHR0cHM6Ly9vcGVyYXRpb24tdXBsb2FkLm1paG95by5jb20=");
an("aHR0cHM6Ly93ZWJzdGF0aWMubWlob3lvZ2lmdC5jb20=");
an("aHR0cHM6Ly9jb3JzcHJveHkuaW8v");
an("X01IWVVVSUQ9NWY3NjNlMTYtMjA2Ny00NDhhLTliMzQtN2Q5NmVmMjQ0MmE5OyBNSUhPWU9fTE9HSU5fUExBVEZPUk1fTElGRUNZQ0xFX0lEPTkyYjRjODhlOTA7IERFVklDRUZQX1NFRURfSUQ9ODlhNGM3MjRlYzhmZGNlNzsgREVWSUNFRlBfU0VFRF9USU1FPTE3NzczNDY1NjM4NjU7IERFVklDRUZQPTM4ZDgxN2RiYTA1Zjc7IGNvb2tpZV90b2tlbl92Mj12Ml9iZ253NG80WmRCSS0zZEJCM2h4YTNIQ3BfZF9uS0FRSy1iYjd1ZmEtX1FVbkZjUE1pRFdSTHdBcnNEdFU0RU83S0VwbFNrWktTMk5WdW9lNjhLbTN4b2huQ2pQSnJLNDFIQkllVkRMd0gzTDZxTkxHcTU5QzZjVG90WW9iek1ZTU5jNUR5cEN2bk9hR2xaX25QdmZELkNBRT07IGFjY291bnRfbWlkX3YyPTBwYzNtNHJraTJfbWh5OyBhY2NvdW50X2lkX3YyPTI4MjcwNjA5NDsgbHRva2VuX3YyPXYyX09ZUUpvYzlLUkNpQkUzNEdTaW01aDNndEdFZ29rU1FHQy13aU01RjJXRUt4YTV1Z0RHeUU4cWhoUGpjRzlibHZtU0ZENU5yd3hoNkhWcGZnNkQwWmxRNTd3UmRnZE1QRlRsRThVM3NvOEdJM3lGN2JfcjRkUDhxcm8tRmN3eGFKSlZ3dDJwMzZtNHJhenlaYlM1MnEuQ0FFPTsgbHRtaWRfdjI9MHBjM200cmtpMl9taHk7IGx0dWlkX3YyPTI4MjcwNjA5NDsgY29va2llX3Rva2VuPTkycG90NTN5UEh3V3RnemdRb0JMWllNem1kbGo4NGFpOElsbzV3OU87IGFjY291bnRfaWQ9MjgyNzA2MDk0OyBsdG9rZW49WnBrWkM2bmxTVzdLdEhaZVI0ZURHUlZBN002NFhoY29GYURUUFBTRzsgbHR1aWQ9MjgyNzA2MDk0OyBhbGl5dW5nZl90Yz0zNDBmZTYxZmUyMGJhN2RmYjhiNzY0Mzk2NDUxYTU3MDU1NTg5NjMxMTU0NmVhMzNjM2E3ZGI0ZDc2ZWRhODBm");
I0("aHR0cHM6Ly9vcGVyYXRpb24tdXBsb2FkLm1paG95by5jb20=");
const Z0 = Array.from({ length: 16 }, (u, s) => String.fromCharCode(65024 + s));
new Map(Z0.map((u, s) => [u, s]));
Promise.resolve();
function I0(u) {
  const s = atob(u), c = Uint8Array.from(s, (o) => o.charCodeAt(0));
  return new TextDecoder().decode(c);
}
new Map(
  Object.entries(pt.get("customAvatarRemoteCache"))
);
const J0 = ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico"], F0 = ["mp4", "webm", "ogg", "ogv", "mov", "m4v"];
new Set(J0);
new Set(F0);
const as = 0, ci = 100, Iu = 50, jc = 3, ch = 16, $0 = 1.22, xg = ph(Iu), ur = {
  recencyHalfLife: 18,
  minConfidenceGames: 3,
  fullConfidenceGames: 16,
  trimOutliers: !0,
  skipEarlySurrender: !0,
  skipAfkTeammate: !0
}, sr = {
  combat: 0.26,
  win: 0.12,
  damage: 0.18,
  economy: 0.11,
  objectives: 0.1,
  vision: 0.08,
  durability: 0.09,
  farming: 0.06
};
function rh(u) {
  return it(`strength.grade.${u}`);
}
function fh(u, s, c = {}) {
  const o = { ...ur, ...c }, r = u.map((x) => W0(x, s, o)).filter((x) => x !== null);
  if (r.length === 0)
    return null;
  const m = o.trimOutliers ? hv(r.map((x) => x.score)) : r.map((x) => x.score), h = r.map((x, ae) => pv(ae, o.recencyHalfLife)), y = Fl(m, h), S = mv(m), g = gv(m), A = dv(r.length, o), C = nt((S - 50) * 0.012, -0.6, 0.6), L = nt((g - 50) * 0.01, -0.5, 0.5), B = 0.57 + A * 0.43, q = nt(
    xg + (y - xg) * B + C + L,
    jc,
    ch
  ), K = gh(q);
  return {
    puuid: s,
    score: q,
    rawScore: y,
    confidence: A,
    validGames: r.length,
    winRate: Fl(r.map((x) => x.win ? 1 : 0), h),
    averageKda: Fl(r.map((x) => x.metrics.kda), h),
    averageKillParticipation: Fl(
      r.map((x) => x.metrics.killParticipation),
      h
    ),
    averageDamageShare: Fl(r.map((x) => x.metrics.damageShare), h),
    consistencyScore: S,
    trendScore: g,
    grade: K,
    gradeLabel: rh(K),
    verdict: P0(q, A),
    breakdown: rv(r, h),
    games: r
  };
}
function W0(u, s, c = {}) {
  const o = { ...ur, ...c }, r = u.json.participants.find((ve) => ve.puuid === s);
  if (!r || hh(u, r, o))
    return null;
  const m = u.json.participants.filter((ve) => ve.teamId === r.teamId);
  if (m.length === 0)
    return null;
  const h = ev(u, r), y = fv(sr), S = Math.max((r.timePlayed || u.json.gameDuration || 1) / 60, 1), g = ka(m, (ve) => ve.kills), A = ka(m, (ve) => ve.totalDamageDealtToChampions), C = ka(m, (ve) => ve.goldEarned), L = ka(m, (ve) => ve.damageDealtToObjectives), B = ka(m, (ve) => ve.totalDamageTaken), q = ju(r.kills), K = ju(r.deaths), x = ju(r.assists), ae = q + x, Y = Bt(r, "kda") || (q + x) / Math.max(K, 1), $ = nt(
    Bt(r, "killParticipation") || ht(ae, g),
    0,
    1
  ), G = nt(
    Bt(r, "teamDamagePercentage") || ht(r.totalDamageDealtToChampions, A),
    0,
    1
  ), J = nt(ht(r.goldEarned, C), 0, 1), oe = nt(
    Bt(r, "damageTakenOnTeamPercentage") || ht(r.totalDamageTaken, B),
    0,
    1
  ), Q = ht(r.totalMinionsKilled + r.neutralMinionsKilled, S), ne = Bt(r, "visionScorePerMinute") || ht(r.visionScore, S), he = {
    combat: tv({ kda: Y, killParticipation: $, deaths: K, minutes: S }),
    win: av(u, r),
    damage: lv(h, r, S, G),
    economy: nv(h, r, S, G, J),
    objectives: iv(h, r, S, L),
    vision: uv(h, r, S, ne),
    durability: sv(h, r, S, oe),
    farming: ov(h, Q)
  };
  return {
    gameId: u.json.gameId,
    championId: r.championId,
    role: h,
    win: r.win,
    placement: r.placement || r.subteamPlacement || 0,
    score: ph(cv(he, y)),
    breakdown: he,
    metrics: {
      kills: q,
      deaths: K,
      assists: x,
      kda: Y,
      killParticipation: $,
      damageShare: G,
      goldShare: J,
      csPerMinute: Q,
      visionPerMinute: ne
    }
  };
}
function dh(u, s, c = {}) {
  const o = u.json.participants.find((r) => r.puuid === s);
  return o ? hh(u, o, { ...ur, ...c }) : !0;
}
function mh(u, s) {
  if (!Number.isFinite(s) || s <= 0) return u;
  const c = `q_${s}`;
  return u.filter((o) => {
    var r;
    return o.json.queueId === s || ((r = o.metadata.tags) == null ? void 0 : r.includes(c));
  });
}
function gh(u) {
  return u >= 15 ? "legendary" : u >= 13.5 ? "carry" : u >= 12 ? "strong" : u >= 10.8 ? "reliable" : u >= 9.5 ? "balanced" : u >= 8 ? "unstable" : u >= 6.3 ? "risky" : "critical";
}
function P0(u, s = 1) {
  const c = s < 0.55 ? it("strength.lowConfidence") : "", o = rh(gh(u));
  return `${c}${o}`;
}
function ev(u, s) {
  const c = u.json.gameMode;
  if (c === "ARAM") return "ARAM";
  if (c === "CHERRY" || c === "STRAWBERRY") return "SPECIAL";
  const o = (s.teamPosition || s.individualPosition || s.lane || "").toUpperCase();
  return o === "TOP" ? "TOP" : o === "JUNGLE" ? "JUNGLE" : o === "MIDDLE" || o === "MID" ? "MIDDLE" : o === "BOTTOM" || o === "BOT" ? "BOTTOM" : o === "UTILITY" || o === "SUPPORT" ? "UTILITY" : "UNKNOWN";
}
function tv(u) {
  const s = ut(Math.log1p(u.kda), Math.log1p(1.1), Math.log1p(6.2)), c = ut(u.killParticipation, 0.32, 0.72), o = 1 - ut(ht(u.deaths, u.minutes), 0.18, 0.72);
  return rl(s * 0.38 + c * 0.42 + o * 0.2);
}
function av(u, s) {
  const c = u.json.gameMode, o = s.placement || s.subteamPlacement || 0;
  return (c === "CHERRY" || c === "STRAWBERRY") && o > 0 ? o <= 1 ? 100 : o <= 2 ? 86 : o <= 4 ? 64 : 18 : s.win ? 100 : 18;
}
function lv(u, s, c, o) {
  const m = ut(o, u === "UTILITY" ? 0.06 : 0.1, u === "UTILITY" ? 0.2 : u === "ARAM" ? 0.26 : 0.29), h = Bt(s, "damagePerMinute") || ht(s.totalDamageDealtToChampions, c), y = ls(u, {
    TOP: 650,
    JUNGLE: 560,
    MIDDLE: 730,
    BOTTOM: 760,
    UTILITY: 360,
    ARAM: 950,
    SPECIAL: 720,
    UNKNOWN: 620
  }), S = ut(h, y * 0.42, y);
  return rl(m * 0.68 + S * 0.32);
}
function nv(u, s, c, o, r) {
  const m = Bt(s, "goldPerMinute") || ht(s.goldEarned, c), h = ls(u, {
    TOP: 420,
    JUNGLE: 390,
    MIDDLE: 430,
    BOTTOM: 455,
    UTILITY: 285,
    ARAM: 470,
    SPECIAL: 430,
    UNKNOWN: 395
  }), y = ut(m, h * 0.58, h), S = r > 0 ? o / r : 0, g = ut(S, 0.55, u === "UTILITY" ? 1.05 : 1.28);
  return rl(g * 0.56 + y * 0.44);
}
function iv(u, s, c, o) {
  const r = ht(s.damageDealtToObjectives, o), m = ht(s.damageDealtToObjectives, c), h = Bt(s, "dragonTakedowns") + Bt(s, "baronTakedowns"), y = Bt(s, "turretTakedowns") || s.turretTakedowns, g = ut(m, 20, u === "JUNGLE" ? 360 : u === "BOTTOM" ? 290 : 230), A = ut(r, 0.08, u === "JUNGLE" ? 0.45 : 0.32), C = ut(h * 0.9 + y * 0.45, 0, 2.2);
  return rl(g * 0.38 + A * 0.32 + C * 0.3);
}
function uv(u, s, c, o) {
  const r = ls(u, {
    TOP: 0.75,
    JUNGLE: 0.95,
    MIDDLE: 0.75,
    BOTTOM: 0.65,
    UTILITY: 1.65,
    ARAM: 0.28,
    SPECIAL: 0.25,
    UNKNOWN: 0.75
  }), m = ut(o, r * 0.28, r), h = ht(
    s.wardsPlaced + s.wardsKilled + s.detectorWardsPlaced * 1.5 + Bt(s, "wardTakedowns") * 0.6 + Bt(s, "wardsGuarded") * 0.4,
    c
  ), y = ut(h, 0.05, u === "UTILITY" ? 0.75 : 0.35);
  return rl(m * 0.72 + y * 0.28);
}
function sv(u, s, c, o) {
  const r = ht(s.deaths, c), m = 1 - ut(r, 0.16, 0.7), y = ut(o, 0.08, u === "TOP" || u === "UTILITY" ? 0.32 : 0.24), S = ht(
    s.damageSelfMitigated + s.totalHeal * 0.35 + s.totalHealsOnTeammates * 0.8 + s.totalDamageShieldedOnTeammates,
    c
  ), g = u === "UTILITY" || u === "TOP" ? 820 : 560, A = ut(S, g * 0.18, g);
  return rl(m * 0.46 + y * 0.32 + A * 0.22);
}
function ov(u, s) {
  const c = ls(u, {
    TOP: 7.2,
    JUNGLE: 5.8,
    MIDDLE: 7.4,
    BOTTOM: 7.8,
    UTILITY: 1.3,
    ARAM: 4.2,
    SPECIAL: 4.5,
    UNKNOWN: 6.2
  });
  return rl(ut(s, c * 0.35, c));
}
function cv(u, s) {
  return nt(
    Object.entries(s).reduce((c, [o, r]) => c + u[o] * r, 0),
    0,
    100
  );
}
function rv(u, s) {
  return Object.keys(sr).reduce((o, r) => (o[r] = Fl(u.map((m) => m.breakdown[r]), s), o), {});
}
function fv(u) {
  const s = ka(Object.values(u), (c) => c);
  return s <= 0 ? sr : Object.entries(u).reduce((c, [o, r]) => (c[o] = r / s, c), {});
}
function ls(u, s) {
  return s[u] ?? s.UNKNOWN;
}
function dv(u, s) {
  const c = Math.max(s.fullConfidenceGames - s.minConfidenceGames, 1);
  return 0.35 + nt((u - s.minConfidenceGames) / c, 0, 1) * 0.65;
}
function mv(u) {
  if (u.length <= 1) return Iu;
  const s = yv(u);
  return nt(100 - s * 14, as, ci);
}
function gv(u) {
  if (u.length < 8) return Iu;
  const s = Ju(u.slice(0, 5)), c = Ju(u.slice(5));
  return nt(Iu + (s - c) * 6.5, as, ci);
}
function hv(u) {
  if (u.length < 8) return u;
  const s = [...u].sort((r, m) => r - m), c = Bg(s, 0.05), o = Bg(s, 0.95);
  return u.map((r) => nt(r, c, o));
}
function pv(u, s) {
  return Math.pow(0.5, u / Math.max(s, 1));
}
function Bg(u, s) {
  if (u.length === 0) return 0;
  const c = s * (u.length - 1), o = Math.floor(c), r = Math.ceil(c);
  if (o === r) return u[o];
  const m = c - o;
  return u[o] + (u[r] - u[o]) * m;
}
function yv(u) {
  if (u.length === 0) return 0;
  const s = Ju(u), c = Ju(u.map((o) => Math.pow(o - s, 2)));
  return Math.sqrt(c);
}
function Fl(u, s) {
  const c = ka(s, (o) => o);
  return u.length === 0 || c <= 0 ? 0 : u.reduce((o, r, m) => o + r * (s[m] ?? 1), 0) / c;
}
function Ju(u) {
  return u.length === 0 ? 0 : ka(u, (s) => s) / u.length;
}
function ka(u, s) {
  return u.reduce((c, o) => c + ju(s(o)), 0);
}
function Bt(u, s) {
  var o;
  const c = (o = u.challenges) == null ? void 0 : o[s];
  return typeof c == "number" && Number.isFinite(c) ? c : 0;
}
function kg(u, s) {
  var o;
  const c = (o = u.challenges) == null ? void 0 : o[s];
  return c === !0 || typeof c == "number" && c > 0;
}
function hh(u, s, c) {
  return c.skipEarlySurrender && (s.gameEndedInEarlySurrender || s.teamEarlySurrendered) ? !0 : c.skipAfkTeammate && vv(u, s);
}
function vv(u, s) {
  return kg(s, "hadAfkTeammate") ? !0 : u.json.participants.some((c) => c.teamId === s.teamId && c.puuid !== s.puuid && kg(c, "hadAfkTeammate"));
}
function ut(u, s, c) {
  return c === s ? u >= c ? 1 : 0 : nt((u - s) / (c - s), 0, 1);
}
function ht(u, s) {
  return s > 0 ? u / s : 0;
}
function ju(u) {
  return Number.isFinite(u) ? u : 0;
}
function rl(u) {
  return nt(u * 100, as, ci);
}
function ph(u) {
  const s = nt(u, as, ci) / ci, c = nt(0.5 + (s - 0.5) * $0, 0, 1);
  return jc + c * (ch - jc);
}
function nt(u, s, c) {
  return Math.min(c, Math.max(s, u));
}
const Gc = "data-sona-lobby-history", qc = "data-sona-lobby-stats", jg = "data-sona-lobby-stats-text", bv = [
  "button",
  "a",
  "input",
  "textarea",
  "select",
  '[role="button"]',
  "lol-uikit-flat-button",
  "lol-uikit-icon-button"
].join(","), Sv = 120;
let ii = !1, Fu = /* @__PURE__ */ new Map(), ui = 0, ri = /* @__PURE__ */ new Map(), ti = null, Gg = /* @__PURE__ */ new Map(), Yc = [], ai = null, li = null;
function Tv(u, s, c) {
  li || (li = document.createElement("div"), li.id = "sona-lobby-member-match-history-root", document.body.appendChild(li), ai = ar.createRoot(li));
  const o = () => {
    ai == null || ai.render(
      Z.createElement(Zu, { open: !1, onClose: o, puuid: "", playerName: "" })
    );
  };
  ai.render(
    Z.createElement(Zu, { open: !0, onClose: o, puuid: u, playerName: s, queueId: c })
  );
}
async function Av(u, s) {
  const c = Gg.get(u);
  if (c) return c;
  try {
    const o = await Ue.getSummonerByPuuid(u), r = o.gameName && o.tagLine ? `${o.gameName}#${o.tagLine}` : s;
    return Gg.set(u, r), r;
  } catch {
    return s;
  }
}
function Qc(u) {
  var c;
  const s = /* @__PURE__ */ new Map();
  ui = ((c = u == null ? void 0 : u.gameConfig) == null ? void 0 : c.queueId) ?? 0;
  for (const o of (u == null ? void 0 : u.members) ?? []) {
    const r = {
      puuid: o.puuid,
      summonerId: o.summonerId,
      name: o.summonerName || `召唤师 ${o.summonerId}`
    };
    o.puuid && s.set(`puuid:${o.puuid}`, r), o.summonerId && s.set(`summoner:${o.summonerId}`, r);
  }
  Fu = s;
}
async function Ev() {
  return ti || (ti = Mv().finally(() => {
    ti = null;
  }), ti);
}
async function Mv() {
  const u = [...new Map(
    [...Fu.values()].filter((o) => o.puuid).map((o) => [o.puuid, o])
  ).values()], s = Ku(ui), c = /* @__PURE__ */ new Map();
  await Promise.all(u.map(async (o) => {
    try {
      const m = (await Ue.getSgpMatchHistory(o.puuid, {
        startIndex: 0,
        count: pt.get("lobbyEnhancementFetchCount") || 50,
        tag: s || void 0
      })).games ?? [], h = mh(m, ui);
      let y = 0, S = 0, g = 0, A = 0, C = 0;
      for (const B of h) {
        const q = B.json.participants.find((K) => K.puuid === o.puuid);
        q && (dh(B, o.puuid) || (y++, q.win && S++, g += q.kills, A += q.assists, C += q.deaths));
      }
      if (y === 0) return;
      const L = fh(h, o.puuid);
      c.set(o.puuid, {
        winRate: S / y,
        kda: C === 0 ? g + A : (g + A) / C,
        score: (L == null ? void 0 : L.score) ?? null,
        total: y
      }), we.debug(
        "[LobbyHistory] %s 当前模式有效 %d 场 / 返回 %d 场 (queueId=%d)",
        o.name,
        y,
        m.length,
        ui
      );
    } catch (r) {
      we.debug("[LobbyHistory] 拉取成员战绩失败: %s", o.name, r);
    }
  })), ii && (ri = c, or());
}
async function qg() {
  try {
    const u = await Ue.getLobby();
    if (!ii) return;
    Qc(u), or(), Ev();
  } catch {
    Qc(null), ri.clear();
  }
}
function Nv(u) {
  const s = u.getAttribute("puuid") || "", c = Number(u.getAttribute("summoner-id") || 0);
  return Fu.get(`puuid:${s}`) ?? Fu.get(`summoner:${c}`) ?? null;
}
function Yg(u, s) {
  const c = u.getBoundingClientRect();
  return s.clientY >= c.bottom - Sv;
}
function Qg(u) {
  return u instanceof Element && !!u.closest(bv);
}
function Cv(u) {
  return u >= 0.6 ? "#5bbd72" : u >= 0.5 ? "#c8aa6e" : "#e74c3c";
}
function Rv(u) {
  return u >= 4 ? "#5bbd72" : u >= 2.5 ? "#c8aa6e" : "#e74c3c";
}
function Dv(u) {
  return u >= 14.5 ? "#5bbd72" : u >= 11.2 ? "#c8aa6e" : "#e74c3c";
}
function wv(u) {
  let s = u.querySelector(`[${qc}]`);
  return s || (s = document.createElement("div"), s.setAttribute(qc, "true"), s.style.cssText = [
    "position:absolute",
    "top:12px",
    "left:50%",
    "transform:translateX(-50%)",
    "display:flex",
    "align-items:center",
    "gap:4px",
    "padding:3px 7px",
    "background:rgba(1,10,19,0.72)",
    "border:1px solid rgba(200,170,110,0.28)",
    "border-radius:3px",
    "font-size:10.5px",
    "line-height:1",
    "font-weight:700",
    "white-space:nowrap",
    "pointer-events:none",
    "box-shadow:0 2px 8px rgba(0,0,0,0.28)"
  ].join(";"), u.appendChild(s), s);
}
function Vg(u, s) {
  const c = wv(u), o = s ? [
    `胜率 ${Math.round(s.winRate * 100)}%`,
    `KDA ${s.kda >= 99 ? "Perfect" : s.kda.toFixed(2)}`,
    `评分 ${s.score != null ? s.score.toFixed(1) : "--"}`
  ].join("|") : "战绩加载中...";
  if (c.getAttribute(jg) !== o) {
    if (c.setAttribute(jg, o), !s) {
      c.innerHTML = '<span style="color:#a09b8c">战绩加载中...</span>';
      return;
    }
    c.innerHTML = [
      `<span style="color:${Cv(s.winRate)}">胜率 ${Math.round(s.winRate * 100)}%</span>`,
      '<span style="color:#5c5b57">|</span>',
      `<span style="color:${Rv(s.kda)}">KDA ${s.kda >= 99 ? "Perfect" : s.kda.toFixed(2)}</span>`,
      '<span style="color:#5c5b57">|</span>',
      `<span style="color:${s.score != null ? Dv(s.score) : "#a09b8c"}">评分 ${s.score != null ? s.score.toFixed(1) : "--"}</span>`
    ].join("");
  }
}
function _v(u, s) {
  if (u.hasAttribute(Gc)) {
    Vg(u, ri.get(s.puuid));
    return;
  }
  const c = u.style.position;
  u.setAttribute(Gc, "true"), u.style.position || (u.style.position = "relative"), Vg(u, ri.get(s.puuid));
  const o = (h) => {
    Qg(h.target) || Yg(u, h) && s.puuid && (h.preventDefault(), h.stopPropagation(), Av(s.puuid, s.name).then((y) => {
      Tv(s.puuid, y, ui || void 0);
    }));
  }, r = (h) => {
    u.style.cursor = Yg(u, h) && !Qg(h.target) ? "pointer" : "";
  }, m = () => {
    u.style.cursor = "";
  };
  u.addEventListener("click", o), u.addEventListener("mousemove", r), u.addEventListener("mouseleave", m), Yc.push({ element: u, previousPosition: c, clickHandler: o, moveHandler: r, leaveHandler: m });
}
function or() {
  const u = document.querySelectorAll("lol-regalia-parties-v2-element[puuid], lol-regalia-parties-v2-element[summoner-id]");
  return u.length === 0 || u.forEach((s) => {
    const c = s, o = Nv(c);
    if (!(o != null && o.puuid)) return;
    const r = c.querySelector(".player-identity-container");
    r && _v(r, o);
  }), !0;
}
function Ov() {
  Yc.forEach(({ element: u, previousPosition: s, clickHandler: c, moveHandler: o, leaveHandler: r }) => {
    u.removeEventListener("click", c), u.removeEventListener("mousemove", o), u.removeEventListener("mouseleave", r), u.removeAttribute(Gc), u.style.cursor = "", u.style.position = s, u.querySelectorAll(`[${qc}]`).forEach((m) => m.remove());
  }), Yc = [];
}
function zv(u) {
  ii || (ii = !0, ln.register(or), Ue.observe(en.LOBBY, (s) => {
    if (s.eventType === "Delete") {
      Qc(null), ri.clear(), Ov();
      return;
    }
    qg();
  }), qg().then(() => {
    ii && we.info("Lobby member match history enabled ✓");
  }));
}
const Uv = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cg%20fill='none'%20fill-rule='nonzero'%3e%3cpath%20fill='%230093FF'%20d='M2%200h20v18.056L12%2023%202%2018.056z'%3e%3c/path%3e%3cpath%20fill='%23FFF'%20d='M10.148%2015v-1.554h1.484V6.894h-1.484V5.34h3.416v8.106h1.456V15z'%3e%3c/path%3e%3c/g%3e%3c/svg%3e", Lv = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cg%20fill='none'%20fill-rule='nonzero'%3e%3cpath%20fill='%2300BBA3'%20d='M2%200h20v18.056L12%2023%202%2018.056z'%3e%3c/path%3e%3cpath%20fill='%23FFF'%20d='M9.165%2015v-4.298l1.064-1.064h2.478l.308-.308V7.188l-.322-.308h-1.246l-.322.308v1.05H9.193V6.572l1.218-1.232h3.304l1.246%201.246v3.64l-1.064%201.064h-2.478l-.308.308v1.778h3.836V15z'%3e%3c/path%3e%3c/g%3e%3c/svg%3e", Hv = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cg%20fill='none'%20fill-rule='nonzero'%3e%3cpath%20fill='%23FFB900'%20d='M2%200h20v18.056L12%2023%202%2018.056z'%3e%3c/path%3e%3cpath%20fill='%23FFF'%20d='m10.124%2015-1.232-1.232v-1.722h1.946v1.064l.406.406h1.4l.406-.406v-1.792l-.462-.476h-2.52V9.288h2.52l.462-.462V7.258l-.406-.406h-1.4l-.406.406V8.28H8.892V6.572l1.232-1.232h3.64l1.232%201.218v2.478l-1.008%201.008%201.008%201.022v2.716L13.778%2015z'%3e%3c/path%3e%3c/g%3e%3c/svg%3e", xv = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cg%20fill='none'%20fill-rule='nonzero'%3e%3cpath%20fill='%239AA4AF'%20d='M2%200h20v18.056L12%2023%202%2018.056z'%3e%3c/path%3e%3cpath%20fill='%23FFF'%20d='M12.672%2015v-2.548H8.64v-1.26L9.998%205.34h1.722l-1.092%205.502h2.044V5.34h1.932v5.502h.714v1.61h-.714V15z'%3e%3c/path%3e%3c/g%3e%3c/svg%3e", Bv = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cg%20fill='none'%20fill-rule='nonzero'%3e%3cpath%20fill='%23A88A67'%20d='M2%200h20v18.056L12%2023%202%2018.056z'%3e%3c/path%3e%3cpath%20fill='%23FFF'%20d='m10.327%2015-1.232-1.232V12.06h1.946v1.022l.392.392h1.218l.406-.406v-2.646l-.308-.322h-1.232l-.616.616H9.095V5.34h5.782v1.61h-3.836v2.31l.686-.686h2.128l1.148%201.148v4.032L13.757%2015z'%3e%3c/path%3e%3c/g%3e%3c/svg%3e", kv = "/fe/lol-static-assets/images/ranked-mini-crests", jv = [
  { value: "all", label: "全部段位" },
  { value: "challenger", label: "最强王者" },
  { value: "grandmaster", label: "傲世宗师" },
  { value: "master_plus", label: "超凡大师+" },
  { value: "master", label: "超凡大师" },
  { value: "diamond_plus", label: "璀璨钻石+" },
  { value: "diamond", label: "璀璨钻石" },
  { value: "emerald_plus", label: "流光翡翠+" },
  { value: "emerald", label: "流光翡翠" },
  { value: "platinum_plus", label: "华贵铂金+" },
  { value: "platinum", label: "华贵铂金" },
  { value: "gold_plus", label: "荣耀黄金+" },
  { value: "gold", label: "荣耀黄金" },
  { value: "silver", label: "不屈白银" },
  { value: "bronze", label: "英勇黄铜" },
  { value: "iron", label: "坚韧黑铁" }
];
jv.map((u) => ({
  ...u,
  icon: Gv(u.value)
}));
function Gv(u) {
  return u === "all" || u === "ibsg" ? "" : `${kv}/${u.replace("_plus", "")}.svg`;
}
class Bu extends Error {
  constructor(c, o) {
    super(c);
    Te(this, "url");
    Te(this, "status");
    Te(this, "statusText");
    Te(this, "body");
    this.name = "AramggApiError", this.url = o.url, this.status = o.status, this.statusText = o.statusText, this.body = o.body;
  }
}
function zc(u) {
  return u !== null && typeof u == "object" && !Array.isArray(u);
}
function Jl(u) {
  return u == null ? null : typeof u == "string" || typeof u == "number" ? String(u) : null;
}
function qv(u) {
  const s = JSON.parse(u);
  if (!zc(s) || !zc(s.augments)) return {};
  const c = {};
  for (const [o, r] of Object.entries(s.augments)) {
    if (!/^\d+$/.test(o) || !zc(r)) continue;
    const m = Jl(r.tier), h = Jl(r.pick_rate);
    if (m == null || h == null) continue;
    const y = Jl(r.average_index);
    c[o] = {
      tier: m,
      num_win_games: Jl(r.num_win_games),
      win_rate: Jl(r.win_rate),
      num_games: Jl(r.num_games),
      pick_rate: h,
      ...y != null ? { average_index: y } : {}
    };
  }
  return c;
}
function Vc(u, s) {
  u.championStats = {
    ...u.championStats ?? {},
    ...s
  };
}
function Yv(u, s, c) {
  if (!s) {
    Vc(u, { championId: String(c) });
    return;
  }
  Vc(u, {
    championId: s.championId,
    tier: s.tier,
    num_win_games: s.numWinGames != null ? String(s.numWinGames) : void 0,
    win_rate: s.winRate != null ? String(s.winRate) : void 0,
    num_games: s.numGames != null ? String(s.numGames) : void 0,
    pick_rate: s.pickRate != null ? String(s.pickRate) : void 0,
    version: s.version,
    date: s.date
  });
}
function Qv(u, s = null, c = Number(u.championId)) {
  const o = Number.isFinite(c) && c > 0 ? c : Number(u.championId), r = {
    championStats: { championId: String(o || u.championId) },
    augments: {},
    coreItemBuilds: [],
    items: {}
  };
  for (const m of u.championAugments ?? [])
    if (!(!Array.isArray(m) || typeof m[1] != "string"))
      try {
        Object.assign(r.augments, qv(m[1])), Vc(r, {
          championId: m[0] || String(o),
          version: m[2],
          date: m[3]
        });
      } catch {
      }
  return Yv(r, s, o), r;
}
const ol = class ol {
  constructor() {
    Te(this, "championsStatsCache", null);
    Te(this, "championsStatsPromise", null);
  }
  /**
   * 全英雄海克斯大乱斗 T 级/胜率榜。默认请求会缓存到当前客户端进程内，
   * 供启动预加载、选人角标和单英雄面板共同复用。
   */
  getChampionsStats(s = {}) {
    const c = s.signal == null;
    if (c && this.championsStatsCache) return Promise.resolve(this.championsStatsCache);
    if (c && this.championsStatsPromise) return this.championsStatsPromise;
    const o = this.request("/data/champions-stats.json", s).then((r) => {
      if (!Array.isArray(r))
        throw new Bu("[ARAMGG] 全英雄统计格式异常", {
          url: new URL("/data/champions-stats.json", ol.BASE_URL).toString(),
          body: r
        });
      return c && (this.championsStatsCache = r, this.championsStatsPromise = null), r;
    }).catch((r) => {
      throw c && (this.championsStatsPromise = null), r;
    });
    return c && (this.championsStatsPromise = o), o;
  }
  async getChampionRanking(s) {
    return (await this.getChampionsStats()).find((o) => Number(o.championId) === s) ?? null;
  }
  getMayhemAugmentsZhCn(s = {}) {
    return this.request("/data/aram-mayhem-augments.zh_cn.json", s);
  }
  getAugmentsStatsRaw(s = {}) {
    return this.request("/data/augments-stats-raw.json", s);
  }
  async getAugmentsStats(s = {}) {
    return (await this.getAugmentsStatsRaw(s)).map(([o, r, m, h, y]) => ({
      augmentId: Number(o),
      rawAugmentId: o,
      stats: JSON.parse(r),
      patchVersion: m,
      updatedDate: h,
      marker: y
    }));
  }
  async getChampionRecommendation(s, c = {}) {
    const o = this.getChampionRanking(s).catch((y) => (console.warn(`[ARAMGG] champion ${s} ranking unavailable:`, y), null)), [r, m] = await Promise.all([
      this.request(`/data/champion-details/${s}.json`, c),
      o
    ]), h = Qv(r, m, s);
    return console.groupCollapsed(`[ARAMGG] champion ${s} parsed recommendation`), console.log("summary:", {
      championStats: h.championStats,
      augmentCount: Object.keys(h.augments).length,
      coreItemBuildCount: h.coreItemBuilds.length,
      itemCount: Object.keys(h.items).length
    }), console.groupEnd(), h;
  }
  async request(s, c = {}) {
    var S, g;
    const o = new URL(s, ol.BASE_URL), r = new AbortController(), m = c.timeoutMs ?? ol.DEFAULT_TIMEOUT_MS, h = window.setTimeout(() => r.abort(), m), y = () => r.abort();
    (S = c.signal) == null || S.addEventListener("abort", y, { once: !0 });
    try {
      const A = await fetch(o.toString(), {
        method: "GET",
        mode: "cors",
        headers: { Accept: "application/json" },
        signal: r.signal
      }), C = await A.text(), L = C ? JSON.parse(C) : null;
      if (!A.ok)
        throw new Bu(`[ARAMGG] 请求失败: ${A.status} ${A.statusText}`, {
          url: o.toString(),
          status: A.status,
          statusText: A.statusText,
          body: L
        });
      return L;
    } catch (A) {
      if (A instanceof Bu) throw A;
      const C = A instanceof Error ? A.message : String(A);
      throw new Bu(`[ARAMGG] 请求异常: ${C}`, { url: o.toString() });
    } finally {
      window.clearTimeout(h), (g = c.signal) == null || g.removeEventListener("abort", y);
    }
  }
};
Te(ol, "BASE_URL", "https://aramgg.com"), Te(ol, "DEFAULT_TIMEOUT_MS", 1e4);
let Kc = ol;
const Vv = new Kc();
class Uc extends Error {
  constructor(c, o) {
    super(c);
    Te(this, "url");
    Te(this, "status");
    Te(this, "statusText");
    Te(this, "body");
    this.name = "OpggApiError", this.url = o.url, this.status = o.status, this.statusText = o.statusText, this.body = o.body;
  }
}
const Pl = class Pl {
  async getVersions(s) {
    const { region: c, mode: o, signal: r, timeoutMs: m } = s;
    return this.request(`/api/${c}/champions/${o}/versions`, { signal: r, timeoutMs: m });
  }
  async getChampionsTier(s) {
    const { region: c, mode: o, tier: r, version: m, signal: h, timeoutMs: y } = s;
    return this.request(`/api/${c}/champions/${o}`, {
      params: { tier: r, version: m },
      signal: h,
      timeoutMs: y
    });
  }
  async getChampion(s) {
    const { id: c, region: o, mode: r, tier: m, version: h, signal: y, timeoutMs: S } = s, g = r === "aram" ? "none" : s.position, A = r === "arena" ? `/api/${o}/champions/${r}/${c}` : `/api/${o}/champions/${r}/${c}/${g ?? "none"}`;
    return this.request(A, {
      params: { tier: m, version: h },
      signal: y,
      timeoutMs: S
    });
  }
  async getARAMBalance(s = {}) {
    return this.request("/api/contents/aram-balance", s);
  }
  async request(s, c = {}) {
    var y, S;
    const o = new URL(s, Pl.BASE_URL);
    Object.entries(c.params ?? {}).forEach(([g, A]) => {
      A != null && A !== "" && o.searchParams.set(g, String(A));
    });
    const r = new AbortController(), m = window.setTimeout(() => r.abort(), c.timeoutMs ?? Pl.DEFAULT_TIMEOUT_MS), h = () => r.abort();
    (y = c.signal) == null || y.addEventListener("abort", h, { once: !0 });
    try {
      const g = await fetch(o.toString(), {
        method: "GET",
        mode: "cors",
        headers: { Accept: "application/json" },
        signal: r.signal
      }), A = await g.text(), C = Kv(A);
      if (!g.ok)
        throw new Uc(`OP.GG request failed: ${g.status} ${g.statusText}`, {
          url: o.toString(),
          status: g.status,
          statusText: g.statusText,
          body: C
        });
      return C;
    } catch (g) {
      if (g instanceof Uc) throw g;
      const A = g instanceof Error ? g.message : String(g);
      throw new Uc(`OP.GG request failed: ${A}`, { url: o.toString() });
    } finally {
      window.clearTimeout(m), (S = c.signal) == null || S.removeEventListener("abort", h);
    }
  }
};
Te(Pl, "BASE_URL", "https://lol-api-champion.op.gg"), Te(Pl, "DEFAULT_TIMEOUT_MS", 1e4);
let Xc = Pl;
function Kv(u) {
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch {
    return u;
  }
}
const Xv = new Xc(), Zv = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cg%20fill='none'%20fill-rule='nonzero'%3e%3cpath%20fill='%23E84057'%20d='M2%200h20v18.056L12%2023%202%2018.056z'%3e%3c/path%3e%3cpath%20fill='%23FFF'%20d='m6.666%2015-1.274-1.274V6.614L6.666%205.34h3.598l1.274%201.274v7.112L10.264%2015zm1.12-1.54H9.13l.462-.462V7.342L9.13%206.88H7.786l-.462.462v5.656zM12.854%2015V5.34h4.802l1.26%201.274v3.654l-1.26%201.274H14.8V15zm1.946-4.914h1.75l.42-.434V7.23l-.42-.434H14.8z'%3e%3c/path%3e%3c/g%3e%3c/svg%3e", yh = [
  { selector: ".champion-grid-champion-thumbnail", size: 22, left: -2, top: 0 },
  { selector: ".champion-card-component-click-target", size: 22, left: -2, top: 0 },
  { selector: ".bench-champion-icon", size: 18, left: -2, top: -2 }
], Iv = { size: 20, left: -2, top: "auto", bottom: -2 }, Jv = yh.map((u) => u.selector).join(","), cr = "data-sona-champ-tier-badge", Gu = "data-sona-original-position", Fv = "emerald_plus", $v = [
  "all",
  "challenger",
  "grandmaster",
  "master_plus",
  "master",
  "diamond_plus",
  "diamond",
  "emerald_plus",
  "emerald",
  "platinum_plus",
  "platinum",
  "gold_plus",
  "gold",
  "silver",
  "bronze",
  "iron"
], Wv = /* @__PURE__ */ new Map([
  [0, Zv],
  [1, Uv],
  [2, Lv],
  [3, Hv],
  [4, xv],
  [5, Bv]
]), rr = /* @__PURE__ */ new Map([
  [0, "OP"],
  [1, "T1"],
  [2, "T2"],
  [3, "T3"],
  [4, "T4"],
  [5, "T5"]
]), Pv = ["ranked", "aram", "arena", "kiwi", "urf", "nexus_blitz"];
let Kg = null, $u = !1, ra = /* @__PURE__ */ new Map(), Kt = null, Wu = "", qu = 0;
const Lc = /* @__PURE__ */ new Map();
function vh(u) {
  return $v.includes(u) ? u : Fv;
}
function Xg(u) {
  const s = u.toLowerCase();
  return s === "kiwi" ? "kiwi" : s === "aram" ? "aram" : s === "cherry" || s === "arena" ? "arena" : s === "nexusblitz" || s === "nexus_blitz" ? "nexus_blitz" : s === "urf" || s === "arurf" ? "urf" : "ranked";
}
function bh(u) {
  return u === "arena" || u === "kiwi" ? "all" : vh(pt.get("opggBuildRecommendationTier"));
}
function Sh(u, s) {
  return `${u}|${s}`;
}
function eb(u) {
  var c, o;
  const s = u.positions.filter((r) => {
    var m, h;
    return Number.isFinite((h = (m = r.stats) == null ? void 0 : m.tier_data) == null ? void 0 : h.tier);
  }).sort((r, m) => r.stats.tier_data.tier - m.stats.tier_data.tier)[0];
  return s ? {
    tier: s.stats.tier_data.tier,
    winRate: fi(s.stats.win_rate)
  } : {
    tier: Th((c = u.average_stats) == null ? void 0 : c.tier),
    winRate: fi((o = u.average_stats) == null ? void 0 : o.win_rate)
  };
}
function tb(u, s) {
  if (s === "ranked")
    return eb(u);
  const c = u.average_stats;
  if (!c) return { tier: null, winRate: null };
  const o = "win_rate" in c ? fi(c.win_rate) : fi(c.play > 0 ? c.win / c.play : null);
  return {
    tier: Th(c.tier),
    winRate: o
  };
}
function Th(u) {
  return typeof u == "number" && Number.isFinite(u) && u >= 0 && u <= 5 ? u : null;
}
function fi(u) {
  return typeof u == "number" && Number.isFinite(u) && u >= 0 ? u : null;
}
function ab(u, s) {
  const c = /* @__PURE__ */ new Map();
  for (const o of u.data) {
    const r = tb(o, s);
    (r.tier != null || r.winRate != null) && c.set(o.id, r);
  }
  return c;
}
function lb(u) {
  const s = /* @__PURE__ */ new Map();
  for (const c of u) {
    const o = Number(c.championId), r = Number(c.tier), m = c.winRate;
    if (!Number.isFinite(o) || o <= 0) continue;
    const h = {
      tier: Number.isFinite(r) && r >= 1 && r <= 5 ? r : null,
      winRate: fi(m)
    };
    (h.tier != null || h.winRate != null) && s.set(o, h);
  }
  return s;
}
function Ah(u, s = bh(u)) {
  const c = Sh(u, s), o = Lc.get(c);
  if (o != null && o.data) return Promise.resolve(o.data);
  if (o != null && o.promise) return o.promise;
  const r = {}, m = u === "kiwi" ? "ARAM.GG" : "OP.GG";
  return r.promise = (u === "kiwi" ? Vv.getChampionsStats().then(lb) : Xv.getChampionsTier({ region: "global", mode: u, tier: s }).then((h) => ab(h, u))).then((h) => (r.data = h, r.promise = void 0, we.info("[ChampTier] 已缓存 %s 英雄 T 级 → mode=%s, tier=%s, count=%d", m, u, s, h.size), h)).catch((h) => {
    throw r.promise = void 0, Lc.delete(c), we.warn("[ChampTier] %s 英雄 T 级预加载失败 → mode=%s, tier=%s:", m, u, s, h), h;
  }), Lc.set(c, r), r.promise;
}
function nb() {
  const u = vh(pt.get("opggBuildRecommendationTier"));
  we.info("[ChampTier] 开始预加载全模式英雄 T 级数据 → tier=%s", u), Pv.forEach((s) => {
    Ah(s, s === "arena" || s === "kiwi" ? "all" : u).catch(() => {
    });
  });
}
async function ib(u) {
  var h, y, S, g, A, C;
  const s = u ?? await Ue.getChampSelectSession().catch(() => null), c = (s == null ? void 0 : s.queueId) ?? 0, o = c > 0 ? (h = w0(c)) == null ? void 0 : h.gameMode : "";
  if (o)
    return { mode: Xg(o), gameMode: o, queueId: c };
  const r = await Ue.getGameflowSession().catch(() => null), m = ((S = (y = r == null ? void 0 : r.gameData) == null ? void 0 : y.queue) == null ? void 0 : S.gameMode) || ((g = r == null ? void 0 : r.map) == null ? void 0 : g.gameMode) || "";
  return { mode: Xg(m), gameMode: m, queueId: c || ((C = (A = r == null ? void 0 : r.gameData) == null ? void 0 : A.queue) == null ? void 0 : C.id) || 0 };
}
async function Eh(u) {
  const s = ++qu, c = u ?? await Ue.getChampSelectSession().catch(() => null);
  Kt = c;
  const { mode: o, gameMode: r, queueId: m } = await ib(c ?? void 0), h = bh(o), y = Sh(o, h);
  if (y === Wu && ra.size > 0) {
    di();
    return;
  }
  Wu = y, we.info("[ChampTier] 读取英雄 T 级缓存 → mode=%s, tier=%s, gameMode=%s, queueId=%d", o, h, r || "unknown", m);
  try {
    const S = await Ah(o, h);
    if (s !== qu) return;
    ra = S, di();
  } catch {
    if (s !== qu) return;
    ra = /* @__PURE__ */ new Map();
  }
}
function ub(u) {
  var c, o, r;
  const s = [
    u,
    u.parentElement,
    u.closest(".champion-card-component"),
    u.closest(".bench-champion"),
    u.closest(".champion-grid-champion"),
    u.closest("[data-champion-id]"),
    u.closest("[data-champion-id-value]"),
    u.closest("[data-champion-id-string]")
  ].filter(Boolean);
  for (const m of s)
    for (const h of ["data-champion-id", "data-champion-id-value", "data-champion-id-string", "champion-id"]) {
      const y = m.getAttribute(h);
      if (y && /^\d+$/.test(y)) return Number(y);
    }
  for (const m of s) {
    const h = m.querySelector('img[src*="champion-icons"]'), y = (c = h == null ? void 0 : h.getAttribute("src")) == null ? void 0 : c.match(/champion-icons\/(\d+)\.png/);
    if (y) return Number(y[1]);
    const S = m.outerHTML.match(/champion-icons\/(\d+)\.png/);
    if (S) return Number(S[1]);
    const g = m.querySelector('[style*="champion-icons"]'), C = [
      ((o = m.style) == null ? void 0 : o.backgroundImage) ?? "",
      ((r = g == null ? void 0 : g.style) == null ? void 0 : r.backgroundImage) ?? ""
    ].join(" ").match(/champion-icons\/(\d+)\.png/);
    if (C) return Number(C[1]);
  }
  return null;
}
function Mh(u, s) {
  const c = Wv.get(u), o = rr.get(u);
  if (!c || !o) return null;
  const r = document.createElement("img");
  return r.setAttribute(cr, "true"), r.src = c, r.alt = o, r.title = o, r.style.cssText = [
    "position:absolute",
    `left:${s.left}px`,
    s.top != null && s.top !== "auto" ? `top:${s.top}px` : "",
    s.bottom != null ? `bottom:${s.bottom}px` : "",
    `width:${s.size}px`,
    `height:${s.size}px`,
    "z-index:8",
    "pointer-events:none",
    "filter:drop-shadow(0 1px 2px rgba(0,0,0,.95))"
  ].join(";"), r;
}
function Nh(u) {
  window.getComputedStyle(u).position === "static" && (u.setAttribute(Gu, u.style.position), u.style.position = "relative");
}
function Ch(u) {
  return Array.from(u.children).find((s) => s instanceof HTMLImageElement && s.hasAttribute(cr)) ?? null;
}
function di() {
  return ra.size === 0 || (document.querySelectorAll(Jv).forEach((s) => {
    if (!(s instanceof HTMLElement)) return;
    const c = yh.find((y) => s.matches(y.selector));
    if (!c) return;
    const o = ub(s), r = o != null ? ra.get(o) : void 0, m = r == null ? void 0 : r.tier, h = Ch(s);
    if (!r) {
      h == null || h.remove();
      return;
    }
    if (m == null)
      h == null || h.remove();
    else {
      const y = rr.get(m);
      if (!(h instanceof HTMLImageElement && h.alt === y)) {
        h == null || h.remove();
        const S = Mh(m, c);
        S && (Nh(s), s.appendChild(S));
      }
    }
  }), sb()), !0;
}
function sb() {
  if (!(Kt != null && Kt.myTeam)) return;
  document.querySelectorAll(".party.visible .summoner-wrapper.visible.left").forEach((s, c) => {
    var A;
    const o = s.querySelector(".champion-icon-container");
    if (!o) return;
    const r = Kt == null ? void 0 : Kt.myTeam[c], m = r ? ob(r) : 0, h = Ch(o);
    if (!m) {
      h == null || h.remove();
      return;
    }
    const y = (A = ra.get(m)) == null ? void 0 : A.tier;
    if (y == null) {
      h == null || h.remove();
      return;
    }
    const S = rr.get(y);
    if (h instanceof HTMLImageElement && h.alt === S) return;
    h == null || h.remove();
    const g = Mh(y, Iv);
    g && (Nh(o), o.appendChild(g));
  });
}
function ob(u) {
  return u.championId > 0 ? u.championId : u.championPickIntent > 0 ? u.championPickIntent : 0;
}
function Rh() {
  document.querySelectorAll(`[${cr}]`).forEach((u) => u.remove()), document.querySelectorAll(`[${Gu}]`).forEach((u) => {
    u instanceof HTMLElement && (u.style.position = u.getAttribute(Gu) ?? "", u.removeAttribute(Gu));
  });
}
function Zg(u) {
  Rh(), ra = /* @__PURE__ */ new Map(), Kt = null, Wu = "", $u || (ln.register(di), $u = !0), Eh(u);
}
function cb() {
  qu++, Wu = "", ra = /* @__PURE__ */ new Map(), Kt = null, $u && (ln.unregister(di), $u = !1), Rh();
}
function rb(u) {
  Kg || (Kg = Ue.observe(en.GAMEFLOW_PHASE_CHANGE, (s) => {
    s.data === "ChampSelect" ? Zg() : cb();
  }), Ue.observe(en.CHAMP_SELECT, (s) => {
    s.eventType !== "Create" && s.eventType !== "Update" || (Kt = s.data, ra.size === 0 ? Eh(s.data) : di());
  }), Ue.getGameflowPhase().then((s) => {
    s === "ChampSelect" && Zg();
  }).catch(() => {
  }), we.info("[ChampTier] 英雄选择 T 级角标已启用 ✓"));
}
pt.get("availability");
pt.get("availability");
function Dh(u) {
  return u >= 70 ? {
    id: "blazing",
    borderColor: "#ff3300",
    particleColors: ["#ff3300", "#ffaa00", "#ff003c"],
    particleStyle: "fire",
    boxShadow: "0 0 15px rgba(255,51,0,0.5)"
  } : u >= 60 ? {
    id: "strong",
    borderColor: "#c8aa6e",
    particleColors: ["#4a9eff", "#7ec8ff", "#2060c0"],
    particleStyle: "magic",
    boxShadow: "0 0 8px rgba(74,158,255,0.35)"
  } : u >= 50 ? {
    id: "normal",
    borderColor: "#3c2e16",
    particleColors: ["#a09b8c", "#5c6b73", "#d1d8e0"],
    particleStyle: "ambient",
    boxShadow: "0 0 6px rgba(160,155,140,0.25)"
  } : u >= 40 ? {
    id: "shaky",
    borderColor: "#555555",
    particleColors: ["#8b6914", "#a07828", "#6b4e0a"],
    particleStyle: "ash",
    filter: "saturate(0.5)",
    boxShadow: "0 0 6px rgba(139,105,20,0.3)"
  } : {
    id: "dizzy",
    borderColor: "#8b00ff",
    particleColors: ["#8b00ff", "#4a0080", "#000000"],
    particleStyle: "void",
    filter: "grayscale(1) contrast(1.2)",
    boxShadow: "0 0 10px rgba(139,0,255,0.4)"
  };
}
function fb({ winRate: u, width: s = 160, height: c = 160 }) {
  const o = Z.useRef(null), r = Dh(u);
  return Z.useEffect(() => {
    const m = o.current;
    if (!m) return;
    const h = m.getContext("2d");
    if (!h) return;
    const y = h, S = s / 2, g = c / 2, A = Math.min(s, c) / 4;
    let C = 0;
    const L = [];
    function B() {
      const K = Math.random() * Math.PI * 2, x = A + Math.random() * 5, ae = r.particleColors, Y = {
        x: S + Math.cos(K) * x,
        y: g + Math.sin(K) * x,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.5 + 0.5,
        color: ae[Math.floor(Math.random() * ae.length)],
        life: 1,
        decay: Math.random() * 0.01 + 5e-3
      };
      switch (r.particleStyle) {
        case "fire":
          Y.vx = Math.cos(K) * (Math.random() * 0.3 + 0.1), Y.vy = Math.sin(K) * (Math.random() * 0.3 + 0.1) - 0.2, Y.decay = Math.random() * 8e-3 + 3e-3;
          break;
        case "magic":
          Y.vx = (Math.random() - 0.5) * 0.3, Y.vy = -Math.random() * 0.5 - 0.2;
          break;
        case "ambient":
          Y.vx = (Math.random() - 0.5) * 0.2, Y.vy = (Math.random() - 0.5) * 0.2 - 0.1, Y.decay = Math.random() * 8e-3 + 4e-3;
          break;
        case "ash":
          Y.vx = (Math.random() - 0.5) * 0.3, Y.vy = Math.random() * 0.1 + 0.2;
          break;
        case "void": {
          const $ = A + 15;
          Y.x = S + Math.cos(K) * $, Y.y = g + Math.sin(K) * $, Y.vx = -Math.cos(K) * (Math.random() * 0.4 + 0.1), Y.vy = -Math.sin(K) * (Math.random() * 0.4 + 0.1), Y.decay = Math.random() * 0.015 + 0.01;
          break;
        }
      }
      return Y;
    }
    function q() {
      y.clearRect(0, 0, s, c);
      const K = r.particleStyle === "fire" ? 3 : 2, x = r.particleStyle === "ambient" ? 0.7 : 0.3;
      for (let ae = 0; ae < K; ae++)
        Math.random() > x && L.push(B());
      for (let ae = L.length - 1; ae >= 0; ae--) {
        const Y = L[ae];
        if (Y.x += Y.vx, Y.y += Y.vy, Y.life -= Y.decay, Y.life <= 0) {
          L.splice(ae, 1);
          continue;
        }
        y.beginPath(), y.arc(Y.x, Y.y, Y.size, 0, Math.PI * 2);
        const $ = Y.x - S, G = Y.y - g, J = Math.sqrt($ * $ + G * G), oe = Math.min(s, c) / 2, Q = Math.max(0, 1 - J / oe);
        y.globalAlpha = Y.life * Q, y.fillStyle = Y.color;
        const ne = r.particleStyle;
        ne === "fire" || ne === "magic" ? (y.shadowBlur = 8, y.shadowColor = Y.color) : ne === "ambient" ? (y.shadowBlur = 3, y.shadowColor = Y.color) : y.shadowBlur = 0, y.fill(), y.globalAlpha = 1;
      }
      C = requestAnimationFrame(q);
    }
    return q(), () => {
      cancelAnimationFrame(C), y.clearRect(0, 0, s, c);
    };
  }, [r, s, c]), /* @__PURE__ */ D.jsx(
    "canvas",
    {
      ref: o,
      width: s,
      height: c,
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 0,
        borderRadius: "50%",
        mixBlendMode: r.particleStyle === "void" ? "normal" : "screen"
      }
    }
  );
}
function db(u) {
  return u.puuid ? `puuid:${u.puuid}` : u.summonerId ? `summoner:${u.summonerId}` : u.obfuscatedPuuid ? `obfuscated-puuid:${u.obfuscatedPuuid}` : u.obfuscatedSummonerId ? `obfuscated-summoner:${u.obfuscatedSummonerId}` : `cell:${u.cellId}`;
}
function Yu(u) {
  return u.obfuscatedPuuid ? `obfuscated-puuid:${u.obfuscatedPuuid}` : u.obfuscatedSummonerId ? `obfuscated-summoner:${u.obfuscatedSummonerId}` : u.puuid ? `puuid:${u.puuid}` : u.summonerId ? `summoner:${u.summonerId}` : `floor:${u.floor}`;
}
function Qu(u) {
  return u.puuid ? u.puuid : u.nameVisibilityType !== "HIDDEN" || !u.obfuscatedPuuid ? "" : ah(u.obfuscatedPuuid);
}
let ni = null;
async function mb() {
  if (ni) return ni;
  ni = gb();
  try {
    return await ni;
  } finally {
    ni = null;
  }
}
async function gb() {
  const u = await Ue.getChampSelectSession(), s = u.myTeam.find((A) => A.cellId === u.localPlayerCellId), c = s ? s.cellId < 5 : !0, o = u.queueId;
  we.info("[TeamStats] 当前队列 ID: %d", o);
  const r = Ku(o), m = Math.max(
    pt.get("champSelectAssistFetchCount") || 50,
    pt.get("analyzeTeamPowerFetchCount") || 50
  ), h = (A, C, L = Qu(A), B) => ({
    floor: C + 1,
    summonerId: (B == null ? void 0 : B.summonerId) || A.summonerId,
    puuid: L,
    obfuscatedSummonerId: A.obfuscatedSummonerId,
    obfuscatedPuuid: A.obfuscatedPuuid,
    gameName: (B == null ? void 0 : B.gameName) || A.gameName,
    tagLine: (B == null ? void 0 : B.tagLine) || A.tagLine,
    winRate: null,
    wins: 0,
    total: 0,
    avgK: 0,
    avgD: 0,
    avgA: 0,
    kdaNum: 0,
    strengthScore: null
  }), y = mr(u), S = y.filter((A) => A.nameVisibilityType === "HIDDEN" && !A.puuid);
  if (S.length > 0) {
    const A = S.filter((C) => !!Qu(C)).length;
    we.info("[TeamStats] 匿名模式身份还原: %d/%d", A, S.length);
  }
  const g = await Promise.all(y.map(async (A, C) => {
    const L = Qu(A);
    if (!L)
      return we.warn("[TeamStats] %d楼缺少可查询的 PUUID（visibility=%s）", C + 1, A.nameVisibilityType || "unknown"), h(A, C, "");
    const B = !A.gameName || !A.tagLine || !A.summonerId, q = B ? Ue.getSummonerByPuuid(L).catch((K) => (we.warn("[TeamStats] %d楼 Riot ID 回填失败:", C + 1, K), null)) : Promise.resolve(null);
    try {
      const [K, x] = await Promise.all([
        Ue.getSgpMatchHistory(L, {
          startIndex: 0,
          count: m,
          tag: r || void 0
        }),
        q
      ]), ae = A.gameName || (x == null ? void 0 : x.gameName) || (x == null ? void 0 : x.displayName) || "", Y = A.tagLine || (x == null ? void 0 : x.tagLine) || "", $ = A.summonerId || (x == null ? void 0 : x.summonerId) || 0, G = { summonerId: $, gameName: ae, tagLine: Y };
      B && ae && we.info("[TeamStats] %d楼匿名 Riot ID 回填成功 → %s%s", C + 1, ae, Y ? `#${Y}` : "");
      const J = K.games ?? [], oe = mh(J, o), Q = [];
      for (const He of oe) {
        const Ye = He.json.participants.find((w) => w.puuid === L);
        Ye && (dh(He, L) || Q.push({
          kills: Ye.kills,
          deaths: Ye.deaths,
          assists: Ye.assists,
          win: Ye.win
        }));
      }
      if (Q.length === 0)
        return h(A, C, L, G);
      let ne = 0, he = 0, ve = 0, Le = 0;
      for (const He of Q)
        He.win && ne++, he += He.kills, ve += He.deaths, Le += He.assists;
      const I = Q.length, at = fh(oe, L);
      return we.info(
        "[TeamStats] %s → 当前模式有效 %d 场 / 返回 %d 场 (queueId=%d, tag=%s)",
        ae,
        I,
        J.length,
        o,
        r || "全部"
      ), {
        floor: C + 1,
        summonerId: $,
        puuid: L,
        obfuscatedSummonerId: A.obfuscatedSummonerId,
        obfuscatedPuuid: A.obfuscatedPuuid,
        gameName: ae,
        tagLine: Y,
        winRate: ne / I * 100,
        wins: ne,
        total: I,
        avgK: he / I,
        avgD: ve / I,
        avgA: Le / I,
        kdaNum: ve === 0 ? he + Le : (he + Le) / ve,
        strengthScore: at
      };
    } catch (K) {
      we.warn("[TeamStats] %d楼战绩查询失败（visibility=%s）:", C + 1, A.nameVisibilityType || "unknown", K);
      const x = await q;
      return h(A, C, L, {
        summonerId: A.summonerId || (x == null ? void 0 : x.summonerId) || 0,
        gameName: A.gameName || (x == null ? void 0 : x.gameName) || (x == null ? void 0 : x.displayName) || "",
        tagLine: A.tagLine || (x == null ? void 0 : x.tagLine) || ""
      });
    }
  }));
  return { isBlue: c, queueId: o, stats: g, fetchCount: m };
}
const wh = "data-sona-tier", Zc = "data-sona-stats", Ic = "data-sona-click", Jc = "data-sona-player-key", si = "data-sona-hidden-player-name", fr = "data-sona-hidden-player-key", dr = "data-sona-hidden-real-name", Fc = "data-sona-hidden-name-suffix", $c = "sona-hidden-player-name-style";
let cl = [], mi = /* @__PURE__ */ new Map(), gi = /* @__PURE__ */ new Map(), hi = /* @__PURE__ */ new Map(), pi = /* @__PURE__ */ new Map(), Pu = "", es = 0, Wc = [], $l = [], ja = null, Ga = null;
function hb(u, s, c) {
  Ga || (Ga = document.createElement("div"), Ga.id = "sona-match-history-modal-root", document.body.appendChild(Ga), ja = ar.createRoot(Ga));
  const o = () => {
    ja == null || ja.render(
      Z.createElement(Zu, { open: !1, onClose: o, puuid: "", playerName: "" })
    );
  };
  ja.render(
    Z.createElement(Zu, { open: !0, onClose: o, puuid: u, playerName: s, queueId: c })
  );
}
function pb() {
  ja && (ja.unmount(), ja = null), Ga && (Ga.remove(), Ga = null);
}
function yb() {
  if (document.getElementById($c)) return;
  const u = document.createElement("style");
  u.id = $c, u.textContent = `
    .player-name-wrapper[${si}]::before {
      content: attr(${dr}) "(";
    }

    .player-name-wrapper[${si}] > [${Fc}] {
      display: inline-flex !important;
      align-items: center;
      gap: 3px;
      vertical-align: -1px;
      white-space: nowrap;
      pointer-events: none;
    }

    .player-name-wrapper[${si}] > [${Fc}] > svg {
      width: 11px;
      height: 11px;
      flex: 0 0 11px;
      color: #e6c76a !important;
      -webkit-text-fill-color: #e6c76a !important;
      filter: drop-shadow(0 0 3px rgba(200, 170, 110, 0.55));
    }
  `, document.head.appendChild(u);
}
function vb() {
  const u = document.createElement("span");
  u.setAttribute(Fc, "true"), u.setAttribute("aria-hidden", "true"), u.appendChild(document.createTextNode(")"));
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 16 16"), s.setAttribute("fill", "none"), s.setAttribute("focusable", "false");
  const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
  c.setAttribute("d", "M5 7V5a3 3 0 0 1 6 0v2"), c.setAttribute("stroke", "currentColor"), c.setAttribute("stroke-width", "1.6"), c.setAttribute("stroke-linecap", "round");
  const o = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  o.setAttribute("x", "3"), o.setAttribute("y", "7"), o.setAttribute("width", "10"), o.setAttribute("height", "7"), o.setAttribute("rx", "2"), o.setAttribute("fill", "rgba(230, 199, 106, 0.18)"), o.setAttribute("stroke", "currentColor"), o.setAttribute("stroke-width", "1.4");
  const r = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  return r.setAttribute("cx", "8"), r.setAttribute("cy", "10.5"), r.setAttribute("r", "0.9"), r.setAttribute("fill", "currentColor"), s.append(c, o, r), u.appendChild(s), u;
}
function Ig(u, s) {
  return Array.from(u.childNodes).filter((c) => c !== s).map((c) => c.textContent ?? "").join("").trim();
}
function _h(u) {
  u.suffixElement.remove(), u.nameElement.removeAttribute(si), u.nameElement.removeAttribute(fr), u.nameElement.removeAttribute(dr), u.previousTitle == null ? u.nameElement.removeAttribute("title") : u.nameElement.setAttribute("title", u.previousTitle), u.previousAriaLabel == null ? u.nameElement.removeAttribute("aria-label") : u.nameElement.setAttribute("aria-label", u.previousAriaLabel);
}
function bb(u, s, c) {
  if (!s.obfuscatedPuuid || !s.gameName) return;
  const o = u.querySelector(".player-name-wrapper");
  if (!o) return;
  let r = $l.find((y) => y.nameElement === o), m = !1;
  if (r && r.playerKey !== c && (_h(r), $l = $l.filter((y) => y !== r), r = void 0), r) {
    const y = Ig(o, r.suffixElement);
    y && (r.originalAlias = y);
  } else {
    const y = Ig(o);
    if (!y) return;
    const S = vb();
    r = {
      nameElement: o,
      suffixElement: S,
      playerKey: c,
      originalAlias: y,
      previousTitle: o.getAttribute("title"),
      previousAriaLabel: o.getAttribute("aria-label")
    }, $l.push(r), m = !0;
  }
  (r.suffixElement.parentElement !== o || o.lastChild !== r.suffixElement) && o.appendChild(r.suffixElement), yb();
  const h = `${s.gameName}(${r.originalAlias})`;
  o.setAttribute(si, "true"), o.setAttribute(fr, c), o.setAttribute(dr, s.gameName), o.setAttribute("title", `${h} · 匿名模式`), o.setAttribute("aria-label", `${h}，匿名模式`), m && we.info("[ChampSelect] %d楼匿名名字增强 → %s", s.floor, h);
}
function mr(u) {
  return u.myTeam.filter((s) => !!s.puuid || !!s.obfuscatedPuuid);
}
function Sb(u) {
  return mr(u).map((s) => `${db(s)}:${s.cellId}`).join("|");
}
function Tb(u, s) {
  const c = (u.puuid ? mi.get(u.puuid) : void 0) ?? (u.summonerId ? gi.get(u.summonerId) : void 0) ?? (u.obfuscatedPuuid ? hi.get(u.obfuscatedPuuid) : void 0) ?? (u.obfuscatedSummonerId ? pi.get(u.obfuscatedSummonerId) : void 0);
  return c ? {
    ...c,
    floor: s,
    gameName: u.gameName || c.gameName,
    tagLine: u.tagLine || c.tagLine,
    puuid: u.puuid || c.puuid,
    summonerId: u.summonerId || c.summonerId,
    obfuscatedPuuid: u.obfuscatedPuuid || c.obfuscatedPuuid,
    obfuscatedSummonerId: u.obfuscatedSummonerId || c.obfuscatedSummonerId
  } : {
    floor: s,
    summonerId: u.summonerId,
    puuid: Qu(u),
    obfuscatedSummonerId: u.obfuscatedSummonerId,
    obfuscatedPuuid: u.obfuscatedPuuid,
    gameName: u.gameName,
    tagLine: u.tagLine,
    winRate: null,
    wins: 0,
    total: 0,
    avgK: 0,
    avgD: 0,
    avgA: 0,
    kdaNum: 0,
    strengthScore: null
  };
}
function Ab(u) {
  return mr(u).map((s, c) => Tb(s, c + 1));
}
const Pc = [];
function gr() {
  const u = document.querySelectorAll(".party.visible .summoner-wrapper.visible.left");
  return u.length === 0 || cl.length === 0 || (Array.from(u).some((c, o) => {
    const r = c.querySelector(".champion-icon-container"), m = c.querySelector(".player-name-wrapper"), h = cl[o];
    if (!h) return !1;
    const y = Yu(h), S = r == null ? void 0 : r.getAttribute(Jc), g = m == null ? void 0 : m.getAttribute(fr);
    return !!(S && S !== y || g && g !== y);
  }) && hr(), u.forEach((c, o) => {
    const r = cl[o];
    if (!r) return;
    const m = Yu(r);
    bb(c, r, m);
    const h = c.querySelector(".champion-icon-container");
    if (!h || r.winRate == null) return;
    const y = r.winRate;
    if (h.setAttribute(Jc, m), !h.querySelector("[data-sona-particle]")) {
      h.setAttribute(wh, "true"), h.style.position = "relative", h.style.overflow = "visible", h.style.borderRadius = "50%";
      const A = Dh(y);
      A.boxShadow && (h.style.boxShadow = A.boxShadow);
      const C = document.createElement("div");
      C.setAttribute("data-sona-particle", "true"), h.prepend(C);
      const L = h.getBoundingClientRect(), B = Math.max(L.width, L.height) + 40, q = ar.createRoot(C);
      q.render(Z.createElement(fb, { winRate: y, width: B, height: B })), Pc.push({ root: q, container: C }), we.info("头像粒子特效 → %d楼 胜率%s%% → %s", o + 1, y.toFixed(1), A.id);
    }
    let S = null;
    if (!h.hasAttribute(Ic) && r.puuid) {
      h.setAttribute(Ic, "true"), h.style.cursor = "pointer";
      const A = m;
      S = (C) => {
        if (C.target.closest(".swap-button-component, .swap-button-btn")) return;
        C.stopPropagation(), C.preventDefault();
        const B = cl.find((q) => Yu(q) === A);
        if (B != null && B.puuid) {
          const q = B.gameName ? `${B.gameName}${B.tagLine ? `#${B.tagLine}` : ""}` : "";
          hb(B.puuid, q, es || void 0);
        }
      }, h.addEventListener("click", S, !0);
    }
    const g = c.querySelector(".player-details");
    if (g && !g.querySelector(`[${Zc}]`)) {
      g.style.position = "relative", g.style.overflow = "visible";
      const A = g.closest(".summoner-container");
      A && (A.style.overflow = "visible");
      const C = r.kdaNum >= 99 ? "Perfect" : r.kdaNum.toFixed(1), L = y >= 55 ? "#5bbd72" : y >= 45 ? "#c8aa6e" : "#e74c3c", B = document.createElement("div");
      B.setAttribute(Zc, "true"), B.style.cssText = "position:absolute;left:0;top:100%;display:flex;align-items:center;font-size:11px;line-height:1;white-space:nowrap;margin-top:2px;";
      const q = document.createElement("span");
      q.style.cssText = `color:${L};font-weight:bold;display:inline-block;min-width:90px;`, q.textContent = `${y.toFixed(0)}% (${r.wins}胜/${r.total - r.wins}负)`;
      const K = r.kdaNum >= 5 ? "#5bbd72" : r.kdaNum >= 3 ? "#c8aa6e" : "#e74c3c", x = document.createElement("span");
      x.style.cssText = `color:${K};margin-left:8px;font-weight:bold;text-shadow:0 0 4px rgba(200,170,110,0.6);`, x.textContent = `KDA ${C}`, B.appendChild(q), B.appendChild(x), g.appendChild(B), Wc.push({ statsDiv: B, iconContainer: h, summonerContainer: A, playerDetails: g, clickHandler: S }), we.info(
        "[ChampSelect] %d楼战绩更新成功 → %s#%s 胜率%s%% (%d胜/%d负) KDA %s",
        o + 1,
        r.gameName ?? "?",
        r.tagLine ?? "?",
        y.toFixed(0),
        r.wins,
        r.total - r.wins,
        C
      );
    }
  })), !0;
}
let ts = !1;
function Eb() {
  ts || (ln.register(gr), ts = !0);
}
function er() {
  var u;
  ts && (ln.unregister(gr), ts = !1), cl = [], mi.clear(), gi.clear(), hi.clear(), pi.clear(), Pu = "", es = 0, hr(), (u = document.getElementById($c)) == null || u.remove(), pb();
}
async function Mb() {
  try {
    er();
    const { stats: u, queueId: s } = await mb();
    es = s, cl = u, mi.clear(), gi.clear(), hi.clear(), pi.clear();
    for (const c of u)
      c.puuid && mi.set(c.puuid, c), c.summonerId && gi.set(c.summonerId, c), c.obfuscatedPuuid && hi.set(c.obfuscatedPuuid, c), c.obfuscatedSummonerId && pi.set(c.obfuscatedSummonerId, c);
    Pu = u.map(Yu).join("|"), Eb(), we.info("头像特效数据就绪，%d 位队友，队列 ID: %d", u.length, es);
  } catch (u) {
    we.error("头像特效查询失败:", u);
  }
}
let Jg = null;
function Nb(u) {
  if (u.eventType !== "Update" || mi.size === 0 && gi.size === 0 && hi.size === 0 && pi.size === 0) return;
  const s = u.data;
  if (!(s != null && s.myTeam)) return;
  const c = Sb(s);
  c !== Pu && (we.info("[ChampSelect] 检测到队友展示顺序或分路变化，重建头像战绩绑定"), hr(), cl = Ab(s), Pu = c, gr());
}
function hr() {
  Pc.forEach(({ root: u, container: s }) => {
    u.unmount(), s.remove();
  }), Pc.length = 0;
  for (const u of $l)
    _h(u);
  $l = [];
  for (const u of Wc)
    u.statsDiv.remove(), u.clickHandler && u.iconContainer.removeEventListener("click", u.clickHandler, !0), u.iconContainer.style.filter = "", u.iconContainer.style.boxShadow = "", u.iconContainer.removeAttribute(wh), u.iconContainer.removeAttribute(Ic), u.iconContainer.removeAttribute(Jc), u.iconContainer.style.cursor = "", u.playerDetails.removeAttribute(Zc), u.playerDetails.style.cursor = "", u.summonerContainer && (u.summonerContainer.style.overflow = "");
  Wc = [];
}
function Cb(u) {
  Jg || (Jg = Ue.observe(en.GAMEFLOW_PHASE_CHANGE, (s) => {
    s.data === "ChampSelect" ? (er(), Mb()) : er();
  }), Ue.observe(en.CHAMP_SELECT, Nb), we.info("Champ select assist enabled ✓"));
}
const Rb = "Sona", Db = "1.9.1", we = Fg({
  name: Rb,
  version: Db
});
class wb {
  constructor() {
    Te(this, "tasks", /* @__PURE__ */ new Set());
    Te(this, "observer", null);
    Te(this, "isThrottled", !1);
  }
  /**
   * 注册一个新的注入任务
   * 注册后立即尝试执行一次
   */
  register(s) {
    this.tasks.add(s);
    try {
      s();
    } catch (c) {
      we.error("[Injector] Task failed on register:", c);
    }
  }
  /**
   * 取消注册一个注入任务
   */
  unregister(s) {
    this.tasks.delete(s);
  }
  /**
   * 启动全局 DOM 守护者
   * 只会启动一次，重复调用无效
   */
  start() {
    this.observer || (we.info("[Injector] Starting global DOM observer..."), this.observer = new MutationObserver(() => {
      this.isThrottled || (this.isThrottled = !0, requestAnimationFrame(() => {
        for (const s of this.tasks)
          try {
            s();
          } catch (c) {
            we.error("[Injector] Task failed:", c);
          }
        this.isThrottled = !1;
      }));
    }), this.observer.observe(document.body, {
      childList: !0,
      subtree: !0
    }));
  }
  /**
   * 停止全局守护（一般不需要调用）
   */
  stop() {
    this.observer && (this.observer.disconnect(), this.observer = null, we.info("[Injector] Global DOM observer stopped"));
  }
}
const ln = new wb(), _b = "Sona · ARAMGG 内置版", Ob = "1.9.1", Wl = Fg({
  name: _b,
  version: Ob
});
let Oh = null;
function Ub(u) {
  Oh = u, X0(import.meta.url, u), Ue.bindContext(u), Wl.printBanner(), Wl.info("[ARAMGG] Stats-only mode initialized");
}
function Lb() {
  Wl.info("[ARAMGG] Loading stats plugin..."), ln.start(), nb(), zv(), Wl.info("[ARAMGG] Lobby match history enabled"), Cb(), rb(), Wl.info("[ARAMGG] Champ select assist enabled"), Wl.info("[ARAMGG] Stats plugin loaded ✓");
}
function Hb() {
  return Oh;
}
export {
  Hb as getContext,
  Ub as init,
  Lb as load,
  Wl as logger
};
