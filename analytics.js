// GA4計測設定: デプロイ前にこのIDを差し替えてください。
const GA4_MEASUREMENT_ID = "G-EP58TWLTJY";

(function initAnalytics() {
  const isConfigured = /^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID) && GA4_MEASUREMENT_ID !== "G-XXXXXXXXXX";

  window.WaritsukeAnalytics = {
    measurementId: GA4_MEASUREMENT_ID,
    isEnabled: isConfigured,
    trackEvent(eventName, params = {}) {
      if (!isConfigured || typeof window.gtag !== "function") return;
      window.gtag("event", eventName, params);
    }
  };

  if (!isConfigured) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA4_MEASUREMENT_ID);
})();

(function initBetaUxEnhancements() {
  const isBeta = /\/waritsuke-pon\/beta\/?$/.test(window.location.pathname) || window.location.pathname.includes("/beta/");
  if (!isBeta) return;

  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const style = document.createElement("style");
    style.textContent = `
      #betaStartGuide{
        position:fixed;
        inset:0;
        z-index:80;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:96px 18px 168px;
        pointer-events:none;
      }
      #betaStartGuide.hidden{ display:none; }
      .betaStartCard{
        width:min(420px, 100%);
        border-radius:22px;
        padding:18px;
        background:rgba(20,24,32,0.78);
        border:1px solid rgba(255,255,255,0.14);
        box-shadow:0 18px 44px rgba(0,0,0,0.32);
        backdrop-filter:blur(18px) saturate(1.15);
        -webkit-backdrop-filter:blur(18px) saturate(1.15);
        color:#fff;
        pointer-events:auto;
      }
      .betaStartTitle{
        margin:0 0 8px;
        font-size:18px;
        line-height:1.35;
        font-weight:900;
      }
      .betaStartText{
        margin:0 0 14px;
        color:rgba(255,255,255,0.78);
        font-size:13px;
        line-height:1.7;
      }
      #betaStartFileBtn{
        width:100%;
        min-height:44px;
        border:0;
        border-radius:14px;
        color:#fff;
        font-size:15px;
        font-weight:900;
        background:linear-gradient(180deg,#22c55e,#16a34a);
      }
      #nextActionGuide{
        pointer-events:auto;
        border-radius:14px;
        padding:9px 11px;
        color:#fff;
        background:rgba(0,0,0,0.36);
        border:1px solid rgba(255,255,255,0.10);
        font-size:12px;
        line-height:1.45;
        font-weight:800;
        box-shadow:0 8px 18px rgba(0,0,0,0.16);
      }
      .betaFieldHint{
        display:block;
        margin-top:2px;
        color:rgba(255,255,255,0.58);
        font-size:9px;
        line-height:1.35;
        font-weight:700;
      }
      .btn.betaDisabled,
      .stepTab.betaDisabled{
        opacity:0.42;
        filter:saturate(0.65);
      }
      .menuItem.betaManualLink{
        display:block;
        text-decoration:none;
      }
      @media (max-width:430px){
        #betaStartGuide{ padding:92px 14px 154px; }
        .betaStartCard{ padding:16px; }
      }
    `;
    document.head.appendChild(style);

    const get = (id) => document.getElementById(id);
    const chipFile = get("chipFile");
    const chipScale = get("chipScale");
    const chipPoly = get("chipPoly");
    const topBar = get("topBar");
    const menuSheet = get("menuSheet");
    const fileInput = get("fileInput");
    const openFileBtn = get("openFileBtn");
    const saveImageBtn = get("saveImageBtn");
    const dangerToggleProxyBtn = get("dangerToggleProxyBtn");
    const showGridBtn = get("showGridBtn");
    const basePointBtn = get("basePointBtn");
    const confirmGridBtn = get("confirmGridBtn");

    if (saveImageBtn) saveImageBtn.textContent = "画像として保存";
    if (dangerToggleProxyBtn) dangerToggleProxyBtn.textContent = "危険小片の表示 ON/OFF";
    if (openFileBtn) openFileBtn.textContent = "図面を読み込む";

    const tileLabel = get("sectionGrid")?.querySelector("label");
    if (tileLabel && !tileLabel.querySelector(".betaFieldHint")) {
      tileLabel.innerHTML = `タイル寸法(mm)<span class="betaFieldHint">左が幅、右が高さです。</span>`;
    }

    const dangerLabel = get("dangerMmVisibleInput")?.closest(".sectionCompact")?.querySelectorAll("label")?.[1];
    if (dangerLabel && !dangerLabel.querySelector(".betaFieldHint")) {
      dangerLabel.innerHTML = `危険小片しきい値(mm)<span class="betaFieldHint">この寸法より小さい端材を強調表示します。</span>`;
    }

    if (menuSheet && !get("manualLinkBtn")) {
      const manualLink = document.createElement("a");
      manualLink.id = "manualLinkBtn";
      manualLink.className = "menuItem betaManualLink";
      manualLink.href = "../manual/";
      manualLink.textContent = "使い方マニュアル";
      menuSheet.appendChild(manualLink);
    }

    if (!get("nextActionGuide") && topBar) {
      const guide = document.createElement("div");
      guide.id = "nextActionGuide";
      guide.textContent = "まず図面を読み込んでください。";
      topBar.appendChild(guide);
    }

    if (!get("betaStartGuide")) {
      const guide = document.createElement("div");
      guide.id = "betaStartGuide";
      guide.innerHTML = `
        <div class="betaStartCard">
          <p class="betaStartTitle">図面を読み込んで開始</p>
          <p class="betaStartText">PDFまたは画像を選ぶと、水平合わせ、縮尺合わせ、施工範囲指定へ進めます。</p>
          <button id="betaStartFileBtn" type="button">図面を読み込む</button>
        </div>
      `;
      document.body.appendChild(guide);
      get("betaStartFileBtn")?.addEventListener("click", () => fileInput?.click());
    }

    const hasLoadedFile = () => chipFile && !chipFile.textContent.includes("読込前");
    const hasScale = () => chipScale && !chipScale.textContent.includes("未確定");
    const hasPoly = () => chipPoly && !chipPoly.textContent.includes("未完了");
    const activeStep = () => document.querySelector("#stepTabs .stepTab.active")?.dataset.step || "align";

    const setSoftDisabled = (button, disabled, message) => {
      if (!button) return;
      button.classList.toggle("betaDisabled", !!disabled);
      button.setAttribute("aria-disabled", disabled ? "true" : "false");
      if (message) button.title = disabled ? message : "";
    };

    const updateGuide = () => {
      const startGuide = get("betaStartGuide");
      startGuide?.classList.toggle("hidden", !!hasLoadedFile());

      let text = "まず図面を読み込んでください。";
      if (hasLoadedFile()) {
        const step = activeStep();
        if (step === "align") text = "水平基準にしたい線の上で2点をタップし、確定してください。";
        if (step === "measure") text = "寸法線の両端を2点で指定し、実寸(mm)を入力して確定してください。";
        if (step === "poly") text = "施工範囲の角を順番にタップします。既存点を動かす時は『範囲調整』を使ってください。";
        if (step === "grid") {
          if (!hasScale()) text = "先に縮尺合わせを完了すると、グリッド生成へ進めます。";
          else if (!hasPoly()) text = "先に施工範囲を完了すると、グリッド生成へ進めます。";
          else text = "タイル寸法を確認してグリッド生成し、位置を調整してから確定してください。";
        }
      }
      const nextActionGuide = get("nextActionGuide");
      if (nextActionGuide) nextActionGuide.textContent = text;

      const blockGrid = !hasScale() || !hasPoly();
      setSoftDisabled(showGridBtn, blockGrid, "縮尺合わせと施工範囲指定を完了してください。");
      setSoftDisabled(confirmGridBtn, !hasLoadedFile(), "先に図面を読み込んでください。");
      setSoftDisabled(basePointBtn, !hasScale() || !hasPoly(), "先に縮尺合わせ、施工範囲指定、グリッド生成を完了してください。");
    };

    const tuneRangePointHitTargets = () => {
      const modeText = get("modePinned")?.textContent || "";
      const isDrawingRange = modeText.includes("施工範囲指定");
      const isAdjustingRange = modeText.includes("範囲調整");
      if (!isDrawingRange && !isAdjustingRange) return;

      const stage = window.Konva?.stages?.[0];
      if (!stage) return;

      const visiblePx = isDrawingRange ? 12 : 24;
      const radius = visiblePx / (stage.scaleX() || 1);
      stage.find(".polyDot").forEach((dot) => {
        const hitCircle = dot.findOne(".hitCircle");
        if (hitCircle && Math.abs(hitCircle.radius() - radius) > 0.2) {
          hitCircle.radius(radius);
        }

        dot.listening(!isDrawingRange);
        dot.draggable(!isDrawingRange);
        if (hitCircle) hitCircle.listening(!isDrawingRange);
      });
    };

    const scheduleHitTargetTune = () => {
      requestAnimationFrame(tuneRangePointHitTargets);
      setTimeout(tuneRangePointHitTargets, 0);
      setTimeout(tuneRangePointHitTargets, 40);
      setTimeout(tuneRangePointHitTargets, 100);
      setTimeout(tuneRangePointHitTargets, 220);
    };

    fileInput?.addEventListener("change", () => setTimeout(updateGuide, 250));
    document.querySelectorAll("#stepTabs .stepTab").forEach((button) => {
      button.addEventListener("click", () => {
        setTimeout(updateGuide, 0);
        scheduleHitTargetTune();
      });
    });

    [chipFile, chipScale, chipPoly, get("modePinned")].filter(Boolean).forEach((target) => {
      new MutationObserver(() => {
        updateGuide();
        scheduleHitTargetTune();
      }).observe(target, { childList: true, characterData: true, subtree: true });
    });

    window.addEventListener("resize", () => {
      updateGuide();
      scheduleHitTargetTune();
    });
    window.addEventListener("pointerdown", scheduleHitTargetTune, { passive: true });
    window.addEventListener("pointerup", scheduleHitTargetTune, { passive: true });
    window.addEventListener("touchend", scheduleHitTargetTune, { passive: true });
    setInterval(tuneRangePointHitTargets, 300);
    updateGuide();
    scheduleHitTargetTune();
  });
})();
