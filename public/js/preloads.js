
    (function() {
      var cdnOrigin = "https://cdn.shopify.com";
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills-legacy.uhRbxNvx.js","/cdn/shopifycloud/checkout-web/assets/c1/app-legacy.Cza4Px4X.js","/cdn/shopifycloud/checkout-web/assets/c1/dist-vendor-legacy.Bs2jcAnJ.js","/cdn/shopifycloud/checkout-web/assets/c1/browser-legacy.CN-mzv0S.js","/cdn/shopifycloud/checkout-web/assets/c1/approval-scopes-FullScreenBackground-legacy.Lv44_YPj.js","/cdn/shopifycloud/checkout-web/assets/c1/shared-unactionable-errors-legacy.LCBFHSme.js","/cdn/shopifycloud/checkout-web/assets/c1/actions-shop-discount-offer-legacy.Wewu88Ea.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-alternativePaymentCurrency-legacy.D6ZjWN0j.js","/cdn/shopifycloud/checkout-web/assets/c1/utils-proposal-legacy.geWjsn7E.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useHasOrdersFromMultipleShops-legacy.-6Qd1ZKB.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en-legacy.DB6AIHam.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage-legacy.GlO0Gumo.js","/cdn/shopifycloud/checkout-web/assets/c1/Captcha-PaymentButtons-legacy.DW18VWLd.js","/cdn/shopifycloud/checkout-web/assets/c1/Menu-LocalPickup-legacy.Bi11gCGH.js","/cdn/shopifycloud/checkout-web/assets/c1/timeout-trigger-MarketsProDisclaimer-legacy.BaOxrIwl.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-NoAddressLocation-legacy.BgHbnI6-.js","/cdn/shopifycloud/checkout-web/assets/c1/shopPaySessionTokenStorage-Page-legacy.DPyud7dW.js","/cdn/shopifycloud/checkout-web/assets/c1/icons-OffsitePaymentFailed-legacy.CzABM1Lb.js","/cdn/shopifycloud/checkout-web/assets/c1/icons-ShopPayLogo-legacy.DQ9ULIYb.js","/cdn/shopifycloud/checkout-web/assets/c1/BuyWithPrimeChangeLink-VaultedPayment-legacy.BDP96eiT.js","/cdn/shopifycloud/checkout-web/assets/c1/DeliveryMacros-ShippingGroupsSummaryLine-legacy.C-SMt1rk.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandisePreviewThumbnail-StackedMerchandisePreview-legacy.Dt7AwDkI.js","/cdn/shopifycloud/checkout-web/assets/c1/Map-PickupPointCarrierLogo-legacy.B7mtUSua.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-legacy.DYd-RKdY.js","/cdn/shopifycloud/checkout-web/assets/c1/PostPurchaseShouldRender-AddDiscountButton-legacy.BaFMwekT.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-RememberMeDescriptionText-legacy.-WnhmcYq.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-ShopPayOptInDisclaimer-legacy.CORG02yN.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-MobileOrderSummary-legacy.C9XrTPZg.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-OrderEditVaultedDelivery-legacy.DJIXyex6.js","/cdn/shopifycloud/checkout-web/assets/c1/captcha-SeparatePaymentsNotice-legacy.D_sjW3dm.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblems-StockProblemsLineItemList-legacy.CU9_zbe0.js","/cdn/shopifycloud/checkout-web/assets/c1/redemption-useShopCashCheckoutEligibility-legacy.9Pv5Nfix.js","/cdn/shopifycloud/checkout-web/assets/c1/negotiated-ShipmentBreakdown-legacy.BfNiuQhg.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-MerchandiseModal-legacy.fTlhUKGp.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-shipping-options-legacy.CbP0QOtA.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-DutyOptions-legacy.C9bknU4m.js","/cdn/shopifycloud/checkout-web/assets/c1/DeliveryInstructionsFooter-ShippingMethodSelector-legacy.BrUS5L70.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-SubscriptionPriceBreakdown-legacy.BhE4cYWL.js","/cdn/shopifycloud/checkout-web/assets/c1/component-RuntimeExtension-legacy.CKVaL0oZ.js","/cdn/shopifycloud/checkout-web/assets/c1/DatePicker-AnnouncementRuntimeExtensions-legacy.CMPNxMqu.js","/cdn/shopifycloud/checkout-web/assets/c1/standard-rendering-extension-targets-legacy.DNUbFFGA.js","/cdn/shopifycloud/checkout-web/assets/c1/esm-browser-v4-legacy.On_frbc2.js","/cdn/shopifycloud/checkout-web/assets/c1/ExtensionsInner-legacy.B0yDjU1X.js","/cdn/shopifycloud/checkout-web/assets/c1/adapter-useShopPayNewSignupLoginExperiment-legacy.C2PEePQ-.js"];
      var styles = [];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0594/7251/1153/files/theindusvalley-svg-logo_x320.png?v=1756295013"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [cdnOrigin].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  