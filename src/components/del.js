(() => {
  "use strict";
  var t = {
      151: (t, e) => {
        function i(t, e) {
          if (void 0 === t)
            throw new Error(
              "".concat(null != e ? e : "Value", " is undefined")
            );
          return t;
        }
        function r(t, e) {
          if (null === t)
            throw new Error("".concat(null != e ? e : "Value", " is null"));
          return t;
        }
        (e.ensureNotNull = void 0), (e.ensureNotNull = r);
      },
    },
    e = {};
  function i(r) {
    var n = e[r];
    if (void 0 !== n) return n.exports;
    var s = (e[r] = { exports: {} });
    return t[r](s, s.exports, i), s.exports;
  }
  (() => {
    var t = i(151);
    new Set(["battle", "staging", "test", "local"]);
    const e = {
      "color-cold-gray-300": "#B2B5BE",
      "color-brand": "#2962FF",
      "color-brand-hover": "#1E53E5",
      "color-brand-active": "#1848CC",
    };
    const r = JSON.parse(
      '{"crypto-mkt-screener":{"width":1000,"height":490,"defaultColumn":"overview","market":"crypto","screener_type":"crypto_mkt","displayCurrency":"USD","isTransparent":false},"events":{"width":510,"height":600,"isTransparent":false,"hideImportanceIndicator":false,"autosize":false},"forex-cross-rates":{"width":770,"height":400,"isTransparent":false,"currencies":["EUR","USD","JPY","GBP","CHF","AUD","CAD","NZD"],"frameElementId":null,"autosize":false},"forex-heat-map":{"width":770,"height":400,"isTransparent":false,"currencies":["EUR","USD","JPY","GBP","CHF","AUD","CAD","NZD","CNY"],"frameElementId":null,"autosize":false},"hotlists":{"width":400,"height":600,"isTransparent":false,"dateRange":"12M","showSymbolLogo":false},"market-overview":{"width":400,"height":650,"isTransparent":false,"dateRange":"12M","showSymbolLogo":true},"market-quotes":{"width":770,"height":450,"isTransparent":false,"showSymbolLogo":false},"mini-symbol-overview":{"width":350,"height":220,"symbol":"FX:EURUSD","dateRange":"12M","isTransparent":false,"autosize":false,"largeChartUrl":""},"symbol-overview":{"width":1000,"height":500,"symbols":[["Apple","AAPL|1D"],["Google","GOOGL|1D"],["Microsoft","MSFT|1D"]],"autosize":false,"chartOnly":false,"hideDateRanges":false,"hideMarketStatus":false,"hideSymbolLogo":false,"scalePosition":"right","scaleMode":"Normal","fontFamily":"-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif","fontSize":"10","noTimeScale":false,"chartType":"area","valuesTracking":"0","changeMode":"price-and-percent"},"advanced-chart":{"bodyId":"widget-container","bodyClasses":["chart-page","unselectable","on-widget"]},"screener":{"width":1100,"height":523,"defaultColumn":"overview","defaultScreen":"general","market":"forex","showToolbar":true,"isTransparent":false},"single-quote":{"width":350,"symbol":"FX:EURUSD","isTransparent":false},"symbol-profile":{"width":480,"height":650,"symbol":"NASDAQ:AAPL","isTransparent":false},"symbol-info":{"width":1000,"symbol":"NASDAQ:AAPL","isTransparent":false},"technical-analysis":{"interval":"1m","width":425,"isTransparent":false,"height":450,"symbol":"NASDAQ:AAPL","showIntervalTabs":true,"displayMode":"single"},"ticker-tape":{"isTransparent":false,"displayMode":"adaptive","showSymbolLogo":false},"tickers":{"isTransparent":false,"showSymbolLogo":false},"financials":{"width":480,"height":830,"autosize":false,"symbol":"NASDAQ:AAPL","isTransparent":false,"displayMode":"regular","largeChartUrl":""},"timeline":{"width":480,"height":830,"autosize":false,"isTransparent":false,"displayMode":"regular","feedMode":"all_symbols"},"stock-heatmap":{"width":500,"height":500,"autosize":true,"dataSource":"SPX500","exchanges":[],"grouping":"sector","blockSize":"market_cap_basic","blockColor":"change","hasTopBar":false,"isDataSetEnabled":false,"isZoomEnabled":true,"hasSymbolTooltip":true,"symbolUrl":"","isMonoSize":false},"crypto-coins-heatmap":{"width":500,"height":500,"autosize":true,"dataSource":"Crypto","blockSize":"market_cap_calc","blockColor":"change","hasTopBar":false,"isDataSetEnabled":false,"isZoomEnabled":true,"hasSymbolTooltip":true,"symbolUrl":"","isMonoSize":false},"etf-heatmap":{"width":500,"height":500,"autosize":true,"dataSource":"AllUSEtf","blockSize":"aum","blockColor":"change","grouping":"asset_class","hasTopBar":false,"isDataSetEnabled":false,"isZoomEnabled":true,"hasSymbolTooltip":true,"symbolUrl":"","isMonoSize":false}}'
    );
    var n, s;
    !(function (t) {
      let e;
      !(function (t) {
        (t.SetSymbol = "set-symbol"), (t.SetInterval = "set-interval");
      })((e = t.Names || (t.Names = {})));
    })(n || (n = {})),
      (function (t) {
        let e;
        !(function (t) {
          (t.SymbolClick = "tv-widget-symbol-click"),
            (t.WidgetLoad = "tv-widget-load"),
            (t.WidgetReady = "tv-widget-ready"),
            (t.ResizeIframe = "tv-widget-resize-iframe"),
            (t.NoData = "tv-widget-no-data");
        })((e = t.Names || (t.Names = {})));
      })(s || (s = {}));
    const o = "__FAIL__",
      a = "__NHTTP__",
      l = new RegExp("^http(s)?:(//)?");
    function c(t = location.href) {
      const e = (function (t) {
        try {
          const e = new URL(t);
          return l.test(e.protocol) ? null : a;
        } catch (t) {
          return o;
        }
      })(t);
      return e || t.replace(l, "");
    }
    const d = ["locale", "symbol", "market"];
    const h = [
      "container_id",
      "symbol",
      "interval",
      "timezone",
      "theme",
      "style",
      "locale",
      "allow_symbol_change",
      "backgroundColor",
      "gridColor",
      "autosize",
      "width",
      "height",
      "hide_volume",
      "whitelabel",
      "range",
      "hide_top_toolbar",
      "hide_side_toolbar",
      "hide_legend",
      "save_image",
      "watchlist",
      "editablewatchlist",
      "studies",
      "extended_hours",
      "details",
      "calendar",
      "hotlist",
      "hideideasbutton",
      "widgetbar_width",
      "withdateranges",
      "customer",
      "venue",
      "symbology",
      "show_popup_button",
      "popup_height",
      "popup_width",
      "studies_overrides",
      "overrides",
      "enabled_features",
      "disabled_features",
      "publish_source",
      "whotrades",
      "referral_id",
      "no_referral_id",
      "fundamental",
      "percentage",
      "padding",
      "greyText",
      "horztouchdrag",
      "verttouchdrag",
      "support_host",
      "compareSymbols",
    ];
    new (class extends class {
      constructor(t) {
        this._copyrightContainer = null;
        const e = null != t ? t : this._getScriptInfo();
        e && this._replaceScript(e);
      }
      hasCopyright() {
        return !!this._copyrightContainer;
      }
      get widgetId() {
        throw new Error("Method must be overridden");
      }
      widgetUtmName() {
        return this.widgetId;
      }
      get defaultSettings() {
        return r[this.widgetId];
      }
      get propertiesToWorkWith() {
        return [];
      }
      get useParamsForConnectSocket() {
        return !1;
      }
      get useSnowplowPageView() {
        return !1;
      }
      filterRawSettings(t) {
        const e = {},
          i = Object.keys(t),
          r = new Set(this.propertiesToWorkWith);
        return (
          i.forEach((i) => {
            r.has(i) && (e[i] = t[i]);
          }),
          e
        );
      }
      get shouldListenToIframeResize() {
        return !0;
      }
      get propertiesToSkipInHash() {
        return ["customer", "locale"];
      }
      get propertiesToAddToGetParams() {
        return ["locale"];
      }
      _defaultWidth() {}
      _defaultHeight() {}
      _getScriptInfo() {
        const t = document.currentScript;
        if (!t || !t.src)
          return (
            console.error(
              "Could not self-replace the script, widget embedding has been aborted"
            ),
            null
          );
        const e = (function (t) {
          const e = new URL(t, document.baseURI);
          return {
            host: e.host,
            pathname: e.pathname,
            href: e.href,
            protocol: e.protocol,
          };
        })(t.src);
        var i;
        return {
          scriptURL: e,
          scriptEnv:
            ((i = e.host),
            -1 !==
              [
                "i18n.tradingview.com",
                "partial.tradingview.com",
                "www.tradingview.com",
                "wwwcn.tradingview.com",
              ].indexOf(i) ||
            -1 !==
              [
                "d33t3vvu2t2yu5.cloudfront.net",
                "dwq4do82y8xi7.cloudfront.net",
                "s.tradingview.com",
                "s3.tradingview.com",
              ].indexOf(i) ||
            i.match(/^[a-z]{2}\.tradingview\.com/) ||
            i.match(/prod-[^.]+.tradingview.com/)
              ? "battle"
              : i.includes("tradingview.com") || i.includes("staging")
              ? "staging"
              : "local"),
          scriptElement: t,
          id: t.id,
          rawSettings: this._scriptContentToJSON(t),
        };
      }
      _replaceScript(i) {
        const {
            scriptEnv: r,
            scriptURL: n,
            scriptElement: o,
            rawSettings: a,
            id: l,
          } = i,
          c = o.parentNode,
          d = o.nonce || o.getAttribute("nonce"),
          h = (function (t) {
            if (null === t) return null;
            const e = t.querySelector("#tradingview-copyright"),
              i = t.querySelector("#tradingview-quotes"),
              r = e || i;
            return r && t.removeChild(r), r;
          })(c),
          g = c.querySelector(".tradingview-widget-copyright");
        this._copyrightContainer = h || g;
        const u = c.classList.contains("tradingview-widget-container");
        (this.iframeContainer = c && u ? c : document.createElement("div")),
          a && (this.settings = this.filterRawSettings(a)),
          (a && this._validateSettings()) ||
            (console.error("Invalid settings provided, fall back to defaults"),
            (this.settings = this.filterRawSettings(this.defaultSettings)));
        const m = "32px",
          { width: p, height: f } = this.settings,
          w = void 0 === f ? void 0 : `${f}${Number.isInteger(f) ? "px" : ""}`,
          y = void 0 === p ? void 0 : `${p}${Number.isInteger(p) ? "px" : ""}`;
        void 0 !== y && (this.iframeContainer.style.width = y),
          void 0 !== w && (this.iframeContainer.style.height = w);
        const b = (function () {
          const t = document.createElement("style");
          return (
            (t.innerHTML = `\n\t.tradingview-widget-copyright {\n\t\tfont-size: 13px !important;\n\t\tline-height: 32px !important;\n\t\ttext-align: center !important;\n\t\tvertical-align: middle !important;\n\t\t/* @mixin sf-pro-display-font; */\n\t\tfont-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif !important;\n\t\tcolor: ${e["color-cold-gray-300"]} !important;\n\t}\n\n\t.tradingview-widget-copyright .blue-text {\n\t\tcolor: ${e["color-brand"]} !important;\n\t}\n\n\t.tradingview-widget-copyright a {\n\t\ttext-decoration: none !important;\n\t\tcolor: ${e["color-cold-gray-300"]} !important;\n\t}\n\n\t.tradingview-widget-copyright a:visited {\n\t\tcolor: ${e["color-cold-gray-300"]} !important;\n\t}\n\n\t.tradingview-widget-copyright a:hover .blue-text {\n\t\tcolor: ${e["color-brand-hover"]} !important;\n\t}\n\n\t.tradingview-widget-copyright a:active .blue-text {\n\t\tcolor: ${e["color-brand-active"]} !important;\n\t}\n\n\t.tradingview-widget-copyright a:visited .blue-text {\n\t\tcolor: ${e["color-brand"]} !important;\n\t}\n\t`),
            t
          );
        })();
        d && b.setAttribute("nonce", d), this.iframeContainer.appendChild(b);
        const v = this.hasCopyright() ? "calc(100% - 32px)" : "100%",
          S = location.hostname,
          _ = g ? "widget_new" : "widget",
          C = this.widgetUtmName();
        (this.settings.utm_source = S),
          (this.settings.utm_medium = _),
          (this.settings.utm_campaign = C),
          this._updateCopyrightHrefParams(S, _, C);
        const T =
            this.settings.iframeTitle ||
            `${this.widgetId.replace("-", " ")} TradingView widget`,
          k = this.settings.iframeLang || "en";
        this.iframe = this._createIframe(v, n, r, l, T, k);
        const x = this._iframeSrcHost(n, r);
        this._addCSPErrorListener(x), d && this.iframe.setAttribute("nonce", d);
        const A = this.iframeContainer.querySelector(
          ".tradingview-widget-container__widget"
        );
        if (
          (A
            ? ((0, t.ensureNotNull)(A.parentElement).replaceChild(
                this.iframe,
                A
              ),
              null == o || o.remove())
            : u
            ? (this.iframeContainer.appendChild(this.iframe),
              null == o || o.remove())
            : (this.iframeContainer.appendChild(this.iframe),
              c.replaceChild(this.iframeContainer, (0, t.ensureNotNull)(o))),
          this.shouldListenToIframeResize &&
            (function (t, e, i) {
              const r = e.contentWindow;
              if (!r)
                return (
                  console.error(
                    "Cannot listen to the event from the provided iframe, contentWindow is not available"
                  ),
                  () => {}
                );
              function n(e) {
                e.source &&
                  e.source === r &&
                  e.data &&
                  e.data.name &&
                  e.data.name === t &&
                  i(e.data.data);
              }
              window.addEventListener("message", n, !1);
            })(s.Names.ResizeIframe, this.iframe, (t) => {
              t.width &&
                ((this.iframe.style.width = t.width + "px"),
                (this.iframeContainer.style.width = t.width + "px")),
                (this.iframe.style.height = t.height + "px"),
                (this.iframeContainer.style.height =
                  t.height + (this.hasCopyright() ? 32 : 0) + "px");
            }),
          h)
        ) {
          const t = document.createElement("div");
          (t.style.height = m),
            (t.style.lineHeight = m),
            void 0 !== y && (t.style.width = y),
            (t.style.textAlign = "center"),
            (t.style.verticalAlign = "middle"),
            (t.innerHTML = h.innerHTML),
            this.iframeContainer.appendChild(t);
        }
      }
      _iframeSrcBase(t, e) {
        let i = `${this._iframeSrcHost(t, e)}/embed-widget/${this.widgetId}/`;
        return (
          this.settings.customer &&
            -1 !== this.propertiesToSkipInHash.indexOf("customer") &&
            (i += `${this.settings.customer}/`),
          i
        );
      }
      _iframeSrcHost(t, e) {
        const i = "https://www.tradingview-widget.com";
        if ("battle" === e) return i;
        const r =
          t.host.includes("beta.tradingview.com") ||
          t.host.includes("betacdn.tradingview.com");
        return "staging" === e && r
          ? "https://www.xstaging-widget.tv"
          : ["staging", "local"].includes(e)
          ? `${t.protocol}//${t.host}`
          : i;
      }
      _validateSettings() {
        const t = (t, e) => {
            if (void 0 === t) return e;
            const i = String(t);
            return /^\d+$/.test(i)
              ? parseInt(i)
              : /^(\d+%|auto)$/.test(i)
              ? i
              : null;
          },
          e = t(this.settings.width, this._defaultWidth()),
          i = t(this.settings.height, this._defaultHeight());
        return (
          null !== e &&
          null !== i &&
          ((this.settings.width = e), (this.settings.height = i), !0)
        );
      }
      _setSettingsQueryString(t) {
        const e = this.propertiesToAddToGetParams.filter(
            (t) => -1 !== d.indexOf(t)
          ),
          i = (function (t, e) {
            const i = Object.create(Object.getPrototypeOf(t));
            for (const r of e)
              Object.prototype.hasOwnProperty.call(t, r) && (i[r] = t[r]);
            return i;
          })(this.settings, e);
        for (const [e, r] of Object.entries(i)) t.searchParams.append(e, r);
      }
      _setHashString(t, e) {
        const i = {};
        e && (i.frameElementId = e),
          Object.keys(this.settings).forEach((t) => {
            -1 === this.propertiesToSkipInHash.indexOf(t) &&
              (i[t] = this.settings[t]);
          }),
          (this.useParamsForConnectSocket || this.useSnowplowPageView) &&
            (i["page-uri"] = c());
        Object.keys(i).length > 0 &&
          (t.hash = encodeURIComponent(JSON.stringify(i)));
      }
      _scriptContentToJSON(t) {
        const e = t.innerHTML.trim();
        try {
          return JSON.parse(e);
        } catch (t) {
          return console.error(`Widget settings parse error: ${t}`), null;
        }
      }
      _createIframe(t, e, i, r, n, s) {
        const o = document.createElement("iframe");
        r && (o.id = r),
          this.settings.enableScrolling || o.setAttribute("scrolling", "no"),
          o.setAttribute("allowtransparency", "true"),
          o.setAttribute("frameborder", "0"),
          (o.style.userSelect = "none"),
          (o.style.boxSizing = "border-box"),
          (o.style.display = "block"),
          (o.style.height = t),
          (o.style.width = "100%");
        const a = new URL(this._iframeSrcBase(e, i));
        return (
          this._setSettingsQueryString(a),
          this._setHashString(a, r),
          o.setAttribute("src", a.toString()),
          (o.title = n),
          (o.lang = s),
          o
        );
      }
      _addCSPErrorListener(t) {
        document.addEventListener("securitypolicyviolation", (e) => {
          e.blockedURI.includes(t) &&
            (this._tryFixCSPIssueWithFallback(t),
            console.warn(
              "Please update your CSP rules to allow the tradingview-widget.com origin for frame-src."
            ));
        });
      }
      _tryFixCSPIssueWithFallback(t) {
        const e = this.iframe.getAttribute("src");
        if (e) {
          const i = new URL(e.replace(t, "https://s.tradingview.com"));
          this.iframe.setAttribute("src", i.href);
        }
      }
      _updateCopyrightHrefParams(t, e, i) {
        if (this._copyrightContainer) {
          const r = this._copyrightContainer.querySelector("a");
          if (r) {
            const n = r.getAttribute("href");
            if (n)
              try {
                const s = new URL(n);
                s.searchParams.set("utm_source", t),
                  s.searchParams.set("utm_medium", e),
                  s.searchParams.set("utm_campaign", i),
                  r.setAttribute("href", s.toString());
              } catch (t) {
                console.log(`Cannot update link UTM params, href="${n}"`);
              }
          }
        }
      }
    } {
      get widgetId() {
        return "advanced-chart";
      }
      get useParamsForConnectSocket() {
        return !0;
      }
      get propertiesToWorkWith() {
        return [...h, "customer"];
      }
      _defaultWidth() {
        return "100%";
      }
      _defaultHeight() {
        return "100%";
      }
    })();
  })();
})();
