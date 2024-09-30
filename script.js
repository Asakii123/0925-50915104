const birdCardImages = [
    'bird_1.png', 'bird_1.png',
    'bird_2.png', 'bird_2.png',
    'bird_3.png', 'bird_3.png',
    'bird_4.png', 'bird_4.png',
    'bird_5.png', 'bird_5.png',
    'bird_6.png', 'bird_6.png',
    'bird_7.png', 'bird_7.png',
    'bird_8.png', 'bird_8.png'
];

const dinosaurCardImages = [
    'dinosaur_1.png', 'dinosaur_1.png',
    'dinosaur_2.png', 'dinosaur_2.png',
    'dinosaur_3.png', 'dinosaur_3.png',
    'dinosaur_4.png', 'dinosaur_4.png',
    'dinosaur_5.png', 'dinosaur_5.png',
    'dinosaur_6.png', 'dinosaur_6.png',
    'dinosaur_7.png', 'dinosaur_7.png',
    'dinosaur_8.png', 'dinosaur_8.png'
];

let gameBoard = document.getElementById('game-board');
let firstCard = null;
let secondCard = null;
let lockBoard = false;  // 控制是否允許翻牌
let matches = 0;
let gameStarted = false; // 控制遊戲是否開始
let currentCardImages = birdCardImages; // 儲存當前使用的卡片圖片
let frontImage = 'bird_front.png'; // 初始正面圖片

// 隨機打亂卡片
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 建立遊戲板
function createBoard() {
    gameBoard.innerHTML = '';  // 每次建立遊戲板前清空卡片
    const shuffledImages = shuffle(currentCardImages);  // 產生亂數後的圖片
    shuffledImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <img src="${frontImage}" alt="正面圖片" class="front"> <!-- 根據當前主題顯示正面圖片 -->
                <img src="${image}" alt="卡片圖片" class="back"> <!-- 背面圖片 -->
            </div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// 翻轉卡片
function flipCard() {
    if (lockBoard || this === firstCard || !gameStarted) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

// 檢查是否匹配
function checkForMatch() {
    const isMatch = firstCard.querySelector('img.back').src === secondCard.querySelector('img.back').src;

    isMatch ? disableCards() : unflipCards();
}

// 禁用卡片
function disableCards() {
    firstCard.removeEventListener('click', flipCard); // 移除點擊事件
    secondCard.removeEventListener('click', flipCard); // 移除點擊事件
    matches++;
    resetBoard();

    if (matches === currentCardImages.length / 2) {
        setTimeout(() => alert('你贏了！'), 500);
    }
}

// 翻回卡片
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

// 重設板面
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// 顯示正面10秒，然後翻轉到背面
function showAllCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('flipped'));  // 顯示所有正面

    setTimeout(() => {
        allCards.forEach(card => card.classList.remove('flipped'));
        gameStarted = true;  // 遊戲開始，允許玩家翻牌
        lockBoard = false;   // 解除鎖定，允許翻牌
    }, 10000);
}

// 顯示所有卡片的正面
function showAllCardsNow() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('flipped'));
}

// 顯示所有卡片的背面
function hideAllCardsNow() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.remove('flipped'));
}

// 重新開始遊戲
document.getElementById('restart-button').addEventListener('click', () => {
    gameBoard.innerHTML = '';  // 清除現有的卡片
    matches = 0;
    gameStarted = false;  // 重置遊戲開始狀態
    lockBoard = false;    // 解除鎖定
});

// 開始遊戲按鈕邏輯
document.getElementById('start-button').addEventListener('click', () => {
    lockBoard = true;  // 鎖定板面，防止在10秒內玩家點擊
    createBoard();     // 生成隨機卡片板面
    showAllCards();    // 顯示所有卡片的正面
});

// 顯示所有正面按鈕
document.getElementById('show-all-button').addEventListener('click', () => {
    showAllCardsNow(); // 顯示所有卡片的正面
});

// 顯示所有背面按鈕
document.getElementById('hide-all-button').addEventListener('click', () => {
    hideAllCardsNow(); // 顯示所有卡片的背面
});

// 切換主題按鈕
document.getElementById('theme-button').addEventListener('click', () => {
    if (currentCardImages === birdCardImages) {
        currentCardImages = dinosaurCardImages; // 切換到恐龍主題
        frontImage = 'dinosaur_front.png'; // 更新正面圖片
    } else {
        currentCardImages = birdCardImages; // 切換回鳥類主題
        frontImage = 'bird_front.png'; // 更新正面圖片
    }

    if (gameStarted) {
        hideAllCardsNow(); // 如果遊戲已經開始，則顯示背面
        createBoard(); // 重新建立遊戲板
    }
});
