async function giveaway() {
    // メンバーを取得
    /** @type { string } */
    const inputMember = document.getElementById("member").value;
    if (!inputMember.length) return;

    const members = inputMember.split(/\n/g).filter(e => e.length > 0);
    if (!members.length) return;

    // 報酬額を取得
    /** @type { string } */
    const inputReward = document.getElementById("reward").value;
    if (!inputReward.length) return;

    const rewards = inputReward.split(/\n/g).map(e => Number(e) || 0).filter(e => e > 0);
    if (!rewards.length) return;

    // 報酬額の個数以上のユーザーが居るかどうか
    if (rewards.length > members.length) return;

    const element  = createFadeElement();
    const robuxImg = createCenteredImg("./styles/img/robux.png");

    // 抽選結果を決定
    const availableMembers = [...members];

    for (const reward of rewards) {
        const chance = 1 / availableMembers.length;
        const target = availableMembers[Math.floor(availableMembers.length * Math.random())];

        const title    = createCenteredTitle("");
        const subtitle = createCenteredSubtitle(`${reward} Robux ` + "(" + (chance * 100).toFixed(2).toString() + "%)");

        const visualMembers = [...availableMembers];
        visualMembers.sort(() => Math.random() - 0.5);
        for (let i = 0; i < 20; i++) {
            setTimeout(async () => {
                const rolledMember = visualMembers[i % visualMembers.length];
                title.textContent  = rolledMember;
            }, i * 200);
        }
        
        fadeInAnimation(robuxImg, 4);
        scaleInAnimation(robuxImg, 4);
        await fadeInAnimation(element, 4);

        title.textContent    = target;
        for (let i = 0; i < 50; i++) {
            setTimeout(async () => {
                const img = spawnImage("./styles/img/robux.png");
                await fadeInAnimation(img, 0.5);
                await fadeOutAnimation(img, 3);
                img.remove();
            }, 1000 * Math.random());
        }

        const button      = createCenteredButton("次へ");
        let   clicked     = false;
        button.onclick = () => {
            clicked = true;
            resolvePromise(); // プロミスを解決する関数を呼び出す
        };
        await fadeOutAnimation(element, 0.5);
        
        // ボタンがクリックされるまで待機
        let resolvePromise;
        await new Promise(resolve => {
            resolvePromise = resolve; // プロミスの解決関数をグローバル変数に保存
            if (clicked) {
                resolvePromise(); // クリック済みなら即座に解決
            }
        });
        
        button.remove();
        title.remove();
        subtitle.remove();

        availableMembers.splice(availableMembers.indexOf(target), 1);
    }

    element.remove();
    robuxImg.remove();
}

/**
 * 要素を作成します
 * 
 * @returns フェードアニメーションに使用する要素
 */
function createFadeElement() {
    const fadeElement                 = document.createElement("div");
    fadeElement.style.position        = "fixed";
    fadeElement.style.top             = "0";
    fadeElement.style.left            = "0";
    fadeElement.style.width           = "100vw";
    fadeElement.style.height          = "100vh";
    fadeElement.style.backgroundColor = "black";
    fadeElement.style.opacity         = "0";
    fadeElement.style.zIndex          = "9999";
    document.body.appendChild(fadeElement);
    return fadeElement;
}

/**
 * 要素をフェードインさせます
 * 
 * @param { HTMLElement } element フェードインする要素
 * @param { number }      time    フェードインする時間(秒単位)
 */
async function fadeInAnimation(element, time) {
    return new Promise((resolve) => {
        let opacity = 0;

        // ミリ秒単位に変換
        const duration = time * 1000; 
        // インターバルの間隔 (ミリ秒)
        const interval = 20; 
        // 1回のインターバルで増加するopacityの値
        const step     = (interval / duration); 

        const timer = setInterval(() => {
            opacity += step;
            element.style.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(timer);
                resolve();
            }
        }, interval);
    });
}

/**
 * 要素の大きさをスケールインさせます
 * 
 * @param { HTMLElement } element フェードインする要素
 * @param { number }      time    フェードインする時間(秒単位)
 */
async function scaleInAnimation(element, time) {
    return new Promise((resolve) => {
        let scale = 0;

        // ミリ秒単位に変換
        const duration = time * 1000; 
        // インターバルの間隔 (ミリ秒)
        const interval = 20; 
        // 1回のインターバルで増加するopacityの値
        const step     = (interval / duration); 

        const timer = setInterval(() => {
            scale += step;
            element.style.width  = `${10 + scale * 15}vw`;
            element.style.height = "auto";
            if (scale >= 1) {
                clearInterval(timer);
                resolve();
            }
        }, interval);
    });
}

/**
 * 要素をフェードアウトさせます
 * 
 * @param { HTMLElement } element フェードアウトする要素
 * @param { number }      time    フェードアウトする時間(秒単位)
 */
async function fadeOutAnimation(element, time) {
    return new Promise((resolve) => {
        let opacity = 1;

        // ミリ秒単位に変換
        const duration = time * 1000; 
        // インターバルの間隔 (ミリ秒)
        const interval = 20; 
        // 1回のインターバルで増加するopacityの値
        const step     = (interval / duration); 

        const timer = setInterval(() => {
            opacity -= step;
            element.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(timer);
                resolve();
            }
        }, interval);
    });
}

/**
 * 画面の中心にテキストを設置
 * 
 * @param { string } text 
 * 
 * @returns 追加した要素
 */
function createCenteredTitle(text) {
    // 要素の作成
    const centeredText = document.createElement("div");

    // スタイルの設定
    centeredText.style.position   = "fixed";
    centeredText.style.top        = "50%";
    centeredText.style.left       = "50%";
    centeredText.style.transform  = "translate(-50%, -50%)";
    centeredText.style.fontSize   = "32px";
    centeredText.style.zIndex     = "10001";
    centeredText.style.textShadow = "1px 1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000";

    // 文字の設定
    centeredText.textContent = text;

    // 要素の追加
    document.body.appendChild(centeredText);

    return centeredText;
}

/**
 * 画面の中心にテキストを設置
 * 
 * @param { string } text 
 * 
 * @returns 追加した要素
 */
function createCenteredSubtitle(text) {
    // 要素の作成
    const centeredText = document.createElement("div");

    // スタイルの設定
    centeredText.style.position   = "fixed";
    centeredText.style.top        = "50%";
    centeredText.style.left       = "50%";
    centeredText.style.transform  = "translate(-50%, 100%)";
    centeredText.style.zIndex     = "10001";
    centeredText.style.textShadow = "1px 1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000";

    // 文字の設定
    centeredText.textContent = text;

    // 要素の追加
    document.body.appendChild(centeredText);

    return centeredText;
}

/**
 * 画面の中心にボタンを設置
 * 
 * @param { string } text 
 * 
 * @returns 追加した要素
 */
function createCenteredButton(text) {
    // 要素の作成
    const centeredButton = document.createElement("button");

    // スタイルの設定
    centeredButton.style.position  = "fixed";
    centeredButton.style.top       = "50%";
    centeredButton.style.left      = "50%";
    centeredButton.style.transform = "translate(-50%, 150%)";
    centeredButton.style.zIndex    = "10001";
    centeredButton.style.width     = "75vw";
    centeredButton.style.padding   = "0.5rem 1rem";

    // 文字の設定
    centeredButton.textContent = text;

    // 要素の追加
    document.body.appendChild(centeredButton);

    return centeredButton;
}

/**
 * 画面の中心に画像を設置
 * 
 * @param { string } path 
 * 
 * @returns 追加した要素
 */
function createCenteredImg(path) {
    // 要素の作成
    const centeredImg = document.createElement("img");

    // スタイルの設定
    centeredImg.src             = path;
    centeredImg.style.position  = "fixed";
    centeredImg.style.top       = "50%";
    centeredImg.style.left      = "50%";
    centeredImg.style.transform = "translate(-50%, -50%)";
    centeredImg.style.width     = "10vw";
    centeredImg.style.height    = "auto";
    centeredImg.style.zIndex    = "10000";
    centeredImg.style.opacity   = "0";

    // 要素の追加
    document.body.appendChild(centeredImg);

    return centeredImg;
}

/**
 * 画像パーティクルを描画
 * 
 * @param { string } path 
 * 
 * @returns 追加した要素
 */
function spawnImage(path) {
    // 要素の作成
    const centeredImg = document.createElement("img");

    // スタイルの設定
    centeredImg.src             = path;
    centeredImg.style.position  = "fixed";
    centeredImg.style.top       = "50%";
    centeredImg.style.left      = "50%";
    centeredImg.style.transform = `translate(${-50 + (Math.random() - 0.5) * 4000}%, ${-50 + (Math.random() - 0.5) * 4000}%)`;
    centeredImg.style.width     = "32px";
    centeredImg.style.height    = "auto";
    centeredImg.style.zIndex    = "10000";
    centeredImg.style.opacity   = "0";

    for (let i = 0; i < 4000; i += 200) {
        setTimeout(() => {
            centeredImg.style.top = `${50 + i / 400}%`
        }, i);
    }

    // 要素の追加
    document.body.appendChild(centeredImg);

    return centeredImg;
}