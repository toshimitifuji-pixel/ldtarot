"use strict";

/* ====== 設定 ====== */
const USE_FOOL = true;
const TOPICS = { love:"恋愛運", money:"金運", work:"仕事運" };
let CURRENT_TOPIC = "love";       // 現在選択中のタブ
let currentPick = null;

/* ====== デッキ ====== */
const MAJOR_ARCANA = [
  { key:"00_fool", name:"00_愚者<br> (The Fool)", img:"ftimg/major/00_fool.png", meaning:"新たなチャレンジが吉。<br>未知への期待と共に恐れず一歩を踏み出すと運気上昇。<br>失敗を恐れず自由な発想を大切に。" },
  { key:"01_magician", name:"01_魔術師<br> (The Magician)", img:"ftimg/major/01_magician.png", meaning:"自分の資源と才能を最大限に活かせる好機。<br>意志を明確にすれば物事がスムーズに動き、成果を手にしやすい時。" },
  { key:"02_priestess", name:"02_女教皇<br> (The High Priestess)", img:"ftimg/major/02_priestess.png", meaning:"直感や内なる声が冴える時期。<br>焦らず内省を深めることで本質的なヒントを得られる。<br>秘密や隠れた情報にも注意を向けて。" },
  { key:"03_empress", name:"03_女帝<br>（The Empress）", img:"ftimg/major/03_empress.png", meaning:"豊かさと実りの到来。<br>創造性や愛情表現が高まり、人間関係や仕事に温かな発展をもたらす。<br>心身のケアや住環境を整えると運気が底上げ。" },
  { key:"04_emperor", name:"04_皇帝<br>（The Emperor）", img:"ftimg/major/04_emperor.png", meaning:"リーダーシップが冴える時。<br>計画的に物事を進めると大きな安定と成功をもたらす。<br>規律正しく権威を発揮するほど運気が味方。" },
  { key:"05_hierophant", name:"05_教皇<br>（The Hierophant）", img:"ftimg/major/05_hierophant.png", meaning:"伝統や常識が吉になる局面。<br>組織やコミュニティでのルールを尊重し、信頼関係を築くことでサポートを得やすい。" },
  { key:"06_lovers", name:"06_恋人<br>（The Lovers）", img:"ftimg/major/06_lovers.png", meaning:"人間関係の調和や選択の岐路。<br>大切な人との絆が深まる反面、意思決定が結果を左右するので、自らの価値観を軸に選ぶと良い運気に。" },
  { key:"07_chariot", name:"07_戦車<br>（The Chariot）", img:"ftimg/major/07_chariot.png", meaning:"強い意志と行動力によって障害を突破できる時期。<br>勢いに乗れば勝利を掴みやすいが、自己過信に注意し、冷静さも併せ持って進むのが吉。" },
  { key:"08_strength", name:"08_力<br>（Strength）", img:"ftimg/major/08_strength.png", meaning:"内なる勇気と忍耐力が運気を後押し。<br>逆境にめげず誠実に取り組むほど周囲からの信頼も厚くなり、穏やかな勝利へと導く。" },
  { key:"09_hermit", name:"09_隠者<br>（The Hermit）", img:"ftimg/major/09_hermit.png", meaning:"自己探求や充電の時。<br>外界から距離を置き、内省することで次の行動への確かな指針が得られる。<br>孤独の時間が吉と出る局面。" },
  { key:"10_wheel", name:"10_運命の輪<br>（Wheel of Fortune）", img:"ftimg/major/10_wheel.png", meaning:"環境や状況が大きく変動しやすい時期。<br>好転のチャンスが巡ってくる一方、予測不能な変化にも柔軟に対応する姿勢が運気を安定させる鍵。" },
  { key:"11_justice", name:"11_正義<br>（Justice）", img:"ftimg/major/11_justice.png", meaning:"公平さとバランスが重要視される局面。<br>誠実かつ客観的な判断が吉を呼び込み、不正や偏りがあればトラブルのもとに。" },
  { key:"12_hanged", name:"12_吊された男<br>（The Hanged Man）", img:"ftimg/major/12_hanged.png", meaning:"一時停止・我慢が求められる時。<br>焦らず視点を変えることで新たな発想や解決策が見つかり、物事が自然と進み始める兆し。" },
  { key:"13_death", name:"13_死神<br>（Death）", img:"ftimg/major/13_death.png", meaning:"終焉と再生のサイクル。<br>古い習慣や人間関係を手放すことで、新しいスタートが切れる好機。<br>抵抗せず変化を受け入れると運気向上。" },
  { key:"14_temperance", name:"14_節制<br>（Temperance）", img:"ftimg/major/14_temperance.png", meaning:"調和と統合の時期。<br>バランス感覚を大切にして、異なる要素をうまく組み合わせることで安定かつ発展的な流れを生み出す。" },
  { key:"15_devil", name:"15_悪魔<br>（The Devil）", img:"ftimg/major/15_devil.png", meaning:"執着や誘惑に注意が必要。<br>過度な欲望や依存が足かせとなる時期のため、自制心を働かせ、健全な範囲で楽しむことを心掛けると吉。" },
  { key:"16_tower", name:"16_塔<br>（The Tower）", img:"ftimg/major/16_tower.png", meaning:"想定外の出来事や急激な変化が訪れやすい時。<br>ショックの裏に必ず浄化と再構築の機会があるため、恐れず新たな基盤作りに取り組むと後の安定に繋がる。" },
  { key:"17_star", name:"17_星<br>（The Star）", img:"ftimg/major/17_star.png", meaning:"希望と癒しの運気が高まる時期。<br>夢や目標に向かって前向きに取り組むことで、周囲からのサポートやインスピレーションを受けやすい。" },
  { key:"18_moon", name:"18_月<br>（The Moon）", img:"ftimg/major/18_moon.png", meaning:"潜在意識や不確実性が強調される時。<br>直感に従いつつも、幻想や誤解に惑わされないよう冷静な観察眼を持つことが吉。" },
  { key:"19_sun", name:"19_太陽<br>（The Sun）", img:"ftimg/major/19_sun.png", meaning:"喜びと成功に満ちた好運期。<br>物事が順風満帆に進み、活力や自己肯定感が高まるため、積極的に行動するとさらなる好機を招く。" },
  { key:"20_judgement", name:"20_審判<br>（Judgement）", img:"ftimg/major/20_judgement.png", meaning:"再評価と覚醒の時期。<br>過去の行動や選択を見直し、清算することで新たなステージへと飛躍できる。<br>客観的な自己分析が運気を高める鍵。" },
  { key:"21_world", name:"21_世界<br>（The World）", img:"ftimg/major/21_world.png", meaning:"完成と統合の大吉期。<br>努力が実を結び、達成感と充足感に包まれる。<br>次なる目標設定にも最適なタイミングであり、更なる発展へと繋がる。" }
];
const DECK = USE_FOOL ? MAJOR_ARCANA : MAJOR_ARCANA.filter(c=>c.key!=="00_fool");

/* ====== テーマ別テキスト（簡潔版） ====== */
const MEANING_OVERRIDES = {
  "00_fool":{love:"新しい出会いや再会が動き出す。肩の力を抜き、素直さを大切に。",money:"小さな挑戦が収穫に。浪費は避け、計画的に。",work:"新規や転職に追い風。準備を整え、軽快に一歩目を。"},
  "01_magician":{love:"言葉と行動が魅力を引き出す。好機を逃さず提案を。",money:"スキルと情報が収益化。根拠を示してスマートに交渉。",work:"企画やプレゼンが刺さる。宣言して実行、形にする。"},
  "02_priestess":{love:"焦らず距離感を整える。心の声を聴き、秘密は丁寧に扱う。",money:"守りの見直し期。固定費や契約を精査して無駄を削減。",work:"調査と学習が成果に直結。感情より事実で判断を。"},
  "03_empress":{love:"温かな交流が実を結ぶ。育む姿勢で安心感が深まる。",money:"実利と潤いが両立。美容や住まいへの投資が後に効く。",work:"クリエイティブと育成が順調。チームで豊かな成果を。"},
  "04_emperor":{love:"関係の基盤を整える時。主導するほど信頼が増す。",money:"予算と規律で安定。長期計画を明文化して進める。",work:"決断力が組織を前進。ルールを守り成果を固める。"},
  "05_hierophant":{love:"紹介や公認に縁。礼節が関係を一段上へ導く。",money:"制度や控除が味方。正しい手続きで堅実に守る。",work:"教育・資格が前進を後押し。先達の助言に価値あり。"},
  "06_lovers":{love:"価値観に沿った選択が愛を強くする。迷いは率直な対話で。",money:"取捨選択が鍵。共同の約束事は条件を明確に。",work:"岐路に立つ時。良い相棒と組めば相乗効果。"},
  "07_chariot":{love:"行動が距離を縮める。計画的なデートが功を奏す。",money:"短期勝負に運。勢い任せの出費は抑える。",work:"期限案件を突破。集中と推進力で勝ち切る。"},
  "08_strength":{love:"思いやりと忍耐が信頼を育てる。穏やかさが最強の魅力。",money:"節度と継続で着実に増やす。体調管理への投資も吉。",work:"誠実さで難局を解く。調整役として評価が高まる。"},
  "09_hermit":{love:"一人時間が心を整える。過去の学びが関係改善に活きる。",money:"情報収集と家計整備。固定費の見直しが効果大。",work:"研究と改善に最適。静かな集中が質を高める。"},
  "10_wheel":{love:"流れが変わる。偶然のチャンスに柔軟に乗る。",money:"波に合わせて攻守を切替。分散とルールで安定化。",work:"環境の変化が追い風。好機は即決で掴む。"},
  "11_justice":{love:"フェアな対話で関係が整う。白黒をつける決断も前進。",money:"契約と清算に吉。数字と法的確認を丁寧に。",work:"透明性が信頼を生む。評価は実力通りに入る。"},
  "12_hanged":{love:"立ち止まり視点を変える時。小さな献身が届く。",money:"我慢と再調整。長期利益を優先し出費を絞る。",work:"待機が好転の準備。裏方の価値が光る。"},
  "13_death":{love:"終わりが新章を開く。手放しが出会いを呼ぶ。",money:"不採算を整理し軽やかに。契約の断捨離で健全化。",work:"体制の終結と刷新。次の土台づくりに着手。"},
  "14_temperance":{love:"自然体で歩調を合わせる。無理のない統合が進展。",money:"収支の均衡を整える。複数収入源のバランスで安定。",work:"異なる強みをブレンド。調整が成果を最大化。"},
  "15_devil":{love:"依存や嫉妬に気づく時。心地よい距離感を保つ。",money:"浪費や借入の誘惑を断つ。サブスクの整理が効く。",work:"しがらみを見直し健全化。ルールと自律で再起動。"},
  "16_tower":{love:"誤解が露わに。率直な対話で修復と再構築。",money:"突発出費に備える。保険と予備費を再設計。",work:"前提が崩れ刷新の好機。ゼロベースで建て直す。"},
  "17_star":{love:"希望の光が差す。優しい交流が距離を縮める。",money:"学びと長期投資が吉。小さな継続が後に輝く。",work:"ビジョンの共有で前進。信頼できる仲間と描く。"},
  "18_moon":{love:"不安や思い込みに注意。結論は急がず見極める。",money:"情報が曖昧。甘い誘いに警戒し慎重に進める。",work:"迷いが生まれやすい時。検証と第三者視点を足す。"},
  "19_sun":{love:"明るい喜びが満ちる。積極策が好結果に直結。",money:"収入や売上が伸びやすい。成功を仕組みに残す。",work:"成果が可視化され評価上昇。チームを前向きに導く。"},
  "20_judgement":{love:"復縁や再評価の気配。率直な意思表示で前へ。",money:"過去案件が実る兆し。返金や補助の朗報も。",work:"実績が再評価。再挑戦や方向転換の決断に吉。"},
  "21_world":{love:"成就と完成。次の段階へ進む好機。",money:"目標達成と安定。国際的な広がりも有望。",work:"プロジェクト完了。実績が新しい扉を開く。"}
};

/* ====== 総合運関連 ====== */
const OVERALL_OVERRIDES = { /* 必要なら key:"総合短文" を追加 */ };
const RATING = {"00_fool":4,"01_magician":4,"02_priestess":3,"03_empress":5,"04_emperor":4,"05_hierophant":3,"06_lovers":4,"07_chariot":4,"08_strength":4,"09_hermit":3,"10_wheel":4,"11_justice":3,"12_hanged":3,"13_death":2,"14_temperance":4,"15_devil":1,"16_tower":1,"17_star":5,"18_moon":2,"19_sun":5,"20_judgement":4,"21_world":5};

function stripTags(html){ const d=document.createElement("div"); d.innerHTML=html; return d.textContent || d.innerText || ""; }
function getMeaningByTopic(card, topic){ return (MEANING_OVERRIDES[card.key] && MEANING_OVERRIDES[card.key][topic]) || card.meaning; }
function getOverall(card){ return OVERALL_OVERRIDES[card.key] || stripTags(card.meaning); }
function getRating(card){ return (card && RATING[card.key] != null) ? RATING[card.key] : 3; }
function renderStars(n){ n=Math.max(0,Math.min(5,Math.floor(+n||0))); return "★★★★★☆☆☆☆☆".slice(5-n,10-n); }
function pickRandom(){ return DECK[Math.floor(Math.random()*DECK.length)]; }

/* ====== タブ（内容の表示切替） ====== */
function initTabs(){
  const tabs = document.querySelectorAll('.fortune-switch [role="tab"]');
  if (!tabs.length) return;

  const setActive = (el) => {
    tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); t.tabIndex = -1; });
    el.classList.add('is-active'); el.setAttribute('aria-selected','true'); el.tabIndex = 0;
    CURRENT_TOPIC = el.dataset.type || "love";

    // 結果が出ていればパネルの表示を切替
    if (currentPick) showTopicPanel(CURRENT_TOPIC);
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => setActive(tab));
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(tab); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const list = [...tabs];
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = list[(list.indexOf(tab) + dir + list.length) % list.length];
        setActive(next);
      }
    });
  });
}

/* 選択中トピックだけを表示 */
function showTopicPanel(topic){
  const panels = ['love','money','work'].map(k => document.getElementById(`panel-${k}`));
  panels.forEach(p => { if(!p) return; if (p.id === `panel-${topic}`) p.hidden = false; else p.hidden = true; });
}

/* ====== セットアップ ====== */
function setup(){
  initTabs();

  const backs = document.querySelectorAll(".card-back");
  const result = document.getElementById("result");
  if (!backs.length || !result) return;

  let locked=false;

  backs.forEach((card, index)=>{
    card.setAttribute("role","button");
    card.setAttribute("aria-label","カード"+(index+1)+"を選ぶ");
    card.tabIndex=0;

    const choose=(e)=>{
      if (locked) return;
      if (e && e.type==="keydown"){
        if (e.key!=="Enter" && e.key!==" ") return;
        e.preventDefault();
      }
      locked=true;

      backs.forEach((b,i)=>{ if(i!==index) b.classList.add("dimmed"); else b.classList.add("selected"); });

      const picked = pickRandom();
      currentPick = picked;
      const altText = stripTags(picked.name);

      // 現在のタブ状態を取得（未クリック時は love）
      const activeTab = document.querySelector('.fortune-switch [role="tab"].is-active');
      CURRENT_TOPIC = activeTab?.dataset.type || "love";

      result.innerHTML = `
        <img id="resultCard" src="${picked.img}" alt="${altText}" class="reveal-card" />
        <h2 id="resultTitle" class="reveal-title">${picked.name}</h2>

        <!-- 総合運（常時表示） -->
        <section class="panel reveal-overall" aria-label="総合運">
          <div class="panel-head">
            <span class="panel-title">総合運</span>
            <span class="panel-stars" aria-label="総合評価: ${getRating(picked)} / 5">${renderStars(getRating(picked))}</span>
          </div>
          <p id="overallText" class="panel-text">${getOverall(picked)}</p>
        </section>

        <!-- タブパネル群（初期はアクティブ以外 hidden） -->
        <section id="panel-love"  role="tabpanel" aria-labelledby="tab-love"  class="panel fortune-panel reveal-panel" data-type="love"  ${CURRENT_TOPIC!=="love"  ? "hidden":""}>
          <div class="panel-head"><span class="panel-title">${TOPICS.love}</span></div>
          <p class="panel-text">${getMeaningByTopic(picked,"love")}</p>
        </section>

        <section id="panel-money" role="tabpanel" aria-labelledby="tab-money" class="panel fortune-panel reveal-panel" data-type="money" ${CURRENT_TOPIC!=="money" ? "hidden":""}>
          <div class="panel-head"><span class="panel-title">${TOPICS.money}</span></div>
          <p class="panel-text">${getMeaningByTopic(picked,"money")}</p>
        </section>

        <section id="panel-work"  role="tabpanel" aria-labelledby="tab-work"  class="panel fortune-panel reveal-panel" data-type="work"  ${CURRENT_TOPIC!=="work"  ? "hidden":""}>
          <div class="panel-head"><span class="panel-title">${TOPICS.work}</span></div>
          <p class="panel-text">${getMeaningByTopic(picked,"work")}</p>
        </section>
　　　　<div class="retry-wrapper">
        <button id="retryBtn" class="retry-btn" type="button">もう一度占う</button>
	  </div>
      `;
      result.classList.add("show");
      applyDayNightTheme();

      // 画像エラー時のフォールバック
      const img = document.getElementById("resultCard");
      if (img && !img.complete){
        img.addEventListener("error", ()=>{
          const svg = 'data:image/svg+xml;utf8,' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="340" height="566" viewBox="0 0 340 566">' +
            '<rect width="100%" height="100%" rx="18" fill="#f0eef7"/>' +
            '<text x="50%" y="52%" text-anchor="middle" font-size="28" fill="#666" font-family="sans-serif">Card Image</text></svg>';
          img.src = svg;
        }, { once:true });
      }

      document.getElementById("retryBtn").addEventListener("click", ()=>{
        backs.forEach(b=>b.classList.remove("dimmed","selected"));
        result.innerHTML=""; result.classList.remove("show");
        currentPick = null; locked=false; backs[index].focus();
      }, { once:true });
    };

    card.addEventListener("click", choose);
    card.addEventListener("keydown", choose);
  });
}

document.addEventListener("DOMContentLoaded", setup);

/* ====== 昼夜テーマ切替 ====== */
function applyDayNightTheme(){
  const hour = new Date().getHours();
  const body = document.body;
  const retryBtn = document.querySelector(".retry-btn");

  // 一度リセット
  body.classList.remove("bg-fairy","bg-mystic");
  if(retryBtn) retryBtn.classList.remove("fairy","mystic");

  if(hour >= 6 && hour < 17){
    // 朝6:00～夕方17:59 → フェアリー
    body.classList.add("bg-fairy");
    if(retryBtn) retryBtn.classList.add("fairy");
  } else {
    // 夜 → ミステリアス
    body.classList.add("bg-mystic");
    if(retryBtn) retryBtn.classList.add("mystic");
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  // 初期実行
  applyDayNightTheme();
  // 1分ごとに更新（17:59→18:00で自動切替）
  setInterval(applyDayNightTheme, 60000);
});
