var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _Lotto_instances, sortLottoNumber_fn, _enteredLottoNumbers, _bonusLottoNumber, _LottoStatus_instances, matchLottoStatus_fn, getMatchingCounts_fn, hasBonusNumber_fn, getHasBonusNumbers_fn, getLottoStatus_fn, _matchedLottoStatus, _price, _winningHistory, _LottoResult_instances, updateWinningHistory_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const PRICE = Object.freeze({
  UNIT: 1e3,
  MIN: 1e3,
  MAX: 1e5
});
const InputWithWeb = {
  retry: (callback) => {
    try {
      return callback();
    } catch (e) {
      console.log(e.message);
      alert(e.message);
    }
  }
};
const LOTTO_NUMBER = Object.freeze({
  MIN: 1,
  MAX: 45,
  LENGTH: 6
});
const LOTTO_STATUS = Object.freeze([
  { RANK: 1, COUNT: 6, REWARD: 2e9, IS_BONUS: null },
  { RANK: 2, COUNT: 5, REWARD: 3e7, IS_BONUS: true },
  { RANK: 3, COUNT: 5, REWARD: 15e5, IS_BONUS: false },
  { RANK: 4, COUNT: 4, REWARD: 5e4, IS_BONUS: null },
  { RANK: 5, COUNT: 3, REWARD: 5e3, IS_BONUS: null }
]);
const WINNING_HISTORY = Object.freeze({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0
});
const ERROR_PREFIX = "[ERROR]";
const ERROR = Object.freeze({
  EMPTY: "빈 값은 입력할 수 없습니다.",
  NOT_NUMBER: "숫자가 아닌 값은 입력할 수 없습니다.",
  INVALID_RANGE: "범위를 벗어난 입력은 할 수 없습니다.",
  INCLUDE: "보너스 번호는 로또 번호와 중복될 수 없습니다.",
  UNIT: `구입 금액은 ${PRICE.UNIT} 단위로 입력해야 합니다.`,
  INVALID_RETRY_STRING: "y 또는 n을 입력해주세요.",
  LENGTH: `로또 번호는 ${LOTTO_NUMBER.LENGTH}개여야 합니다.`,
  DUPLICATE: "중복된 숫자가 있습니다."
});
const throwError = (message) => {
  throw new Error(`${ERROR_PREFIX} ${message}`);
};
const validateEmpty = (input) => {
  if (input === "") throwError(ERROR.EMPTY);
};
const validateNumber = (input) => {
  if (isNaN(Number(input))) throwError(ERROR.NOT_NUMBER);
};
const validateRange = ({ min, max }, input) => {
  if (input < min || input > max) throwError(ERROR.INVALID_RANGE);
};
const validatePrice = (price) => {
  validateEmpty(price);
  validateNumber(price);
  validateRange({ min: PRICE.MIN, max: PRICE.MAX }, price);
  checkThousandUnit(price);
};
const checkThousandUnit = (price) => {
  if (price % PRICE.UNIT !== 0) {
    throwError(ERROR.UNIT);
  }
};
const validateLotto = (lotto) => {
  lotto.forEach((number) => {
    validateEmpty(number);
    validateNumber(number);
    validateRange({ min: LOTTO_NUMBER.MIN, max: LOTTO_NUMBER.MAX }, number);
  });
  validateDuplicate(lotto);
  checkLength(lotto);
};
const validateDuplicate = (arr) => {
  if (new Set(arr).size !== arr.length) {
    throwError(ERROR.DUPLICATE);
  }
};
const checkLength = (arr) => {
  if (arr.length !== LOTTO_NUMBER.LENGTH) {
    throwError(ERROR.LENGTH);
  }
};
const validateBonusNumber = ({ enterdLottoNumbers, bonusLottoNumber }) => {
  validateEmpty(bonusLottoNumber);
  validateNumber(bonusLottoNumber);
  validateRange({ min: 1, max: 45 }, bonusLottoNumber);
  validateInclude(enterdLottoNumbers, bonusLottoNumber);
};
const validateInclude = (arr, number) => {
  if (arr.includes(number)) {
    throwError(ERROR.INCLUDE);
  }
};
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _Lotto_instances);
    __privateAdd(this, _numbers);
    __privateSet(this, _numbers, __privateMethod(this, _Lotto_instances, sortLottoNumber_fn).call(this, numbers));
    validateLotto(__privateGet(this, _numbers));
  }
  getLottoNumbers() {
    return __privateGet(this, _numbers);
  }
}
_numbers = new WeakMap();
_Lotto_instances = new WeakSet();
sortLottoNumber_fn = function(numbers) {
  return numbers.sort((a, b) => a - b);
};
const resetInput = (input) => {
  input.value = "";
};
const getPrice = () => {
  const inputElement = document.querySelector(".priceInput");
  const input = inputElement.value;
  return InputWithWeb.retry(() => {
    resetInput(inputElement);
    validatePrice(input);
    return Number(input);
  });
};
const getNeededLottoNumbers = () => {
  const winningLotto = InputWithWeb.retry(() => {
    const inputElements = document.querySelectorAll(".winningNumberInput");
    const winningNumbers = Array.from(inputElements).map(
      (input) => input.value
    );
    validateLotto(winningNumbers);
    const winningLotto2 = new Lotto(winningNumbers.map(Number));
    return winningLotto2;
  });
  if (winningLotto === void 0) return;
  const bonusLottoNumber = InputWithWeb.retry(() => {
    const inputElement = document.querySelector(".bonusNumberInput");
    const bonusNumber = inputElement.value;
    validateBonusNumber({
      enterdLottoNumbers: winningLotto.getLottoNumbers(),
      bonusLottoNumber: bonusNumber
    });
    return Number(bonusNumber);
  });
  return { winningLotto, bonusLottoNumber };
};
const priceStore = /* @__PURE__ */ (() => {
  let price = 0;
  return {
    getPrice: () => price,
    setPrice: (newPrice) => price = newPrice
  };
})();
const lottoStore = /* @__PURE__ */ (() => {
  let lottos = [];
  return {
    setLottos: (newlottos) => {
      lottos = newlottos;
    },
    getLottos: () => lottos
  };
})();
const setPurchaseDetailVisibility = (state) => {
  const purchaseDetail = document.querySelector(".purchaseDetail");
  purchaseDetail.style.display = state === "on" ? "flex" : "none";
};
const resetWinningHistoryUI = () => {
  const winningCount = document.querySelectorAll(".winningCount");
  winningCount.forEach((count) => {
    count.textContent = "0개";
  });
};
const reset = () => {
  priceStore.setPrice(0);
  lottoStore.setLottos([]);
  const dialog = document.querySelector("dialog");
  dialog.close();
  const purchasedLottos = document.querySelector(".purchasedLottos");
  const winningNumberInputs = document.querySelectorAll(".winningNumberInput");
  const bonusNumberInput = document.querySelector(".bonusNumberInput");
  winningNumberInputs.forEach((input) => {
    resetInput(input);
  });
  resetInput(bonusNumberInput);
  resetWinningHistoryUI();
  purchasedLottos.textContent = "";
  setPurchaseDetailVisibility("off");
};
const buyLotto = () => {
  reset();
  const price = getPrice();
  if (price === void 0) return;
  priceStore.setPrice(price);
  document.dispatchEvent(new CustomEvent("priceUpdated"));
};
const clickCheckResult = () => {
  const { winningLotto, bonusLottoNumber } = getNeededLottoNumbers();
  if (winningLotto === void 0 || bonusLottoNumber === void 0) return;
  document.dispatchEvent(
    new CustomEvent("checkResult", {
      detail: { winningLotto, bonusLottoNumber }
    })
  );
};
const appendTextElement = (parent, textContent) => {
  const textElement = document.createElement("div");
  textElement.classList.add("text");
  textElement.textContent = textContent;
  parent.appendChild(textElement);
};
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const Ticket = {
  checkAndAddLottoNumbers: (store, number) => {
    store.add(number);
  },
  issueLottoNumbers: () => {
    const randomNumberStore = /* @__PURE__ */ new Set();
    while (randomNumberStore.size < LOTTO_NUMBER.LENGTH) {
      const number = getRandomNumber(LOTTO_NUMBER.MIN, LOTTO_NUMBER.MAX);
      Ticket.checkAndAddLottoNumbers(randomNumberStore, number);
    }
    return [...randomNumberStore];
  },
  createLottos: (count) => {
    return Array.from({ length: count }, () => {
      const lottoNumbers = Ticket.issueLottoNumbers();
      return new Lotto(lottoNumbers);
    });
  }
};
const showLottos = (count) => {
  setPurchaseDetailVisibility("on");
  const lottos = Ticket.createLottos(count);
  lottoStore.setLottos(lottos);
  updatePurchasedLottosUI(count, lottos);
};
const updatePurchasedLottosUI = (count, lottos) => {
  const purchasedLottos = document.querySelector(".purchasedLottos");
  appendTextElement(purchasedLottos, `총 ${count}개를 구매하였습니다.`);
  const lottosNumbers = createLottoListElement(lottos);
  purchasedLottos.appendChild(lottosNumbers);
};
const createLottoListElement = (lottos) => {
  const lottosNumbers = document.createElement("div");
  lottosNumbers.classList.add("lottosNumbers");
  const ul = document.createElement("ul");
  lottos.forEach((lotto) => ul.appendChild(createLottoItem(lotto)));
  lottosNumbers.appendChild(ul);
  return lottosNumbers;
};
const createLottoItem = (lotto) => {
  const li = document.createElement("li");
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.src = "../../public/lotto.png";
  img.alt = "lotto";
  div.textContent = lotto.getLottoNumbers().join(", ");
  div.classList.add("lottoNumbers");
  li.appendChild(img);
  li.appendChild(div);
  return li;
};
const countMatchingNumbers = (numberArr1, numberArr2) => {
  const arr1 = [...numberArr1];
  const arr2 = [...numberArr2];
  console.log(arr1, arr2);
  if (!arr1.every((element) => typeof element === "number") || !arr2.every((element) => typeof element === "number")) {
    throw new Error("숫자 배열이 아닙니다.");
  }
  return numberArr1.filter((element) => numberArr2.includes(element)).length;
};
class LottoStatus {
  constructor({ enteredLottoNumbers, bonusLottoNumber }) {
    __privateAdd(this, _LottoStatus_instances);
    __privateAdd(this, _enteredLottoNumbers);
    __privateAdd(this, _bonusLottoNumber);
    __privateSet(this, _enteredLottoNumbers, enteredLottoNumbers);
    __privateSet(this, _bonusLottoNumber, bonusLottoNumber);
  }
  getMatchedLottoStatus(issuedLottoNumbers) {
    return __privateMethod(this, _LottoStatus_instances, matchLottoStatus_fn).call(this, issuedLottoNumbers);
  }
}
_enteredLottoNumbers = new WeakMap();
_bonusLottoNumber = new WeakMap();
_LottoStatus_instances = new WeakSet();
matchLottoStatus_fn = function(issuedLottoNumbers) {
  const matchingCounts = __privateMethod(this, _LottoStatus_instances, getMatchingCounts_fn).call(this, issuedLottoNumbers);
  const isBonusArray = __privateMethod(this, _LottoStatus_instances, getHasBonusNumbers_fn).call(this, issuedLottoNumbers);
  return matchingCounts.map(
    (matchCount, index) => __privateMethod(this, _LottoStatus_instances, getLottoStatus_fn).call(this, matchCount, isBonusArray[index])
  ).filter((status) => status);
};
getMatchingCounts_fn = function(issuedLottoNumbers) {
  return issuedLottoNumbers.map(
    (numbers) => countMatchingNumbers(numbers, __privateGet(this, _enteredLottoNumbers))
  );
};
hasBonusNumber_fn = function(numbers) {
  return numbers.includes(__privateGet(this, _bonusLottoNumber));
};
getHasBonusNumbers_fn = function(issuedLottoNumbers) {
  return issuedLottoNumbers.map((numbers) => __privateMethod(this, _LottoStatus_instances, hasBonusNumber_fn).call(this, numbers));
};
getLottoStatus_fn = function(matchCount, isBonus) {
  return LOTTO_STATUS.find(
    (status) => status.COUNT === matchCount && (status.IS_BONUS === null || status.IS_BONUS === isBonus)
  );
};
class LottoResult {
  constructor(matchedLottoStatus, price) {
    __privateAdd(this, _LottoResult_instances);
    __privateAdd(this, _matchedLottoStatus);
    __privateAdd(this, _price);
    __privateAdd(this, _winningHistory);
    __privateSet(this, _matchedLottoStatus, matchedLottoStatus);
    __privateSet(this, _price, price);
    __privateSet(this, _winningHistory, { ...WINNING_HISTORY });
    __privateMethod(this, _LottoResult_instances, updateWinningHistory_fn).call(this);
  }
  getWinningHistory() {
    return __privateGet(this, _winningHistory);
  }
  getTotalProfit() {
    return __privateGet(this, _matchedLottoStatus).reduce((acc, cur) => acc + cur.REWARD, 0);
  }
  getRate() {
    return this.getTotalProfit() / __privateGet(this, _price) * 100;
  }
}
_matchedLottoStatus = new WeakMap();
_price = new WeakMap();
_winningHistory = new WeakMap();
_LottoResult_instances = new WeakSet();
updateWinningHistory_fn = function() {
  __privateGet(this, _matchedLottoStatus).forEach((status) => {
    __privateGet(this, _winningHistory)[status.RANK] += 1;
  });
};
const showResult = ({ winningLotto, bonusLottoNumber }) => {
  const { winningHistory, rate } = getLottoResults(
    winningLotto,
    bonusLottoNumber
  );
  updateWinningHistoryUI(winningHistory);
  updateRateUI(rate);
  showDialog();
};
const updateWinningHistoryUI = (winningHistory) => {
  Object.entries(winningHistory).forEach(([key, value]) => {
    console.log("key", key);
    console.log("value", value);
    if (value === 0) return;
    const countDiv = document.querySelector(`#rank${key}WinningCount`);
    countDiv.textContent = `${value}개`;
  });
};
const showDialog = () => {
  const dialog = document.querySelector("dialog");
  dialog.showModal();
};
const updateRateUI = (rate) => {
  const rateDiv = document.querySelector("#rate");
  rateDiv.textContent = `당신의 총 수익률은 ${rate.toFixed(1)}%입니다.`;
};
const getLottoResults = (winningLotto, bonusLottoNumber) => {
  const lottoStatus = new LottoStatus({
    enteredLottoNumbers: winningLotto.getLottoNumbers(),
    bonusLottoNumber
  });
  const lottosNumbers = lottoStore.getLottos().map((lotto) => lotto.getLottoNumbers());
  const matchedStatus = lottoStatus.getMatchedLottoStatus(lottosNumbers);
  const price = priceStore.getPrice();
  const lottoResult = new LottoResult(matchedStatus, price);
  return {
    winningHistory: lottoResult.getWinningHistory(),
    rate: lottoResult.getRate()
  };
};
const divideByUnit = (unit, price) => Number(price / unit);
const game = () => {
  const buyButton = document.querySelector(".buyButton");
  buyButton.addEventListener("click", () => {
    buyLotto();
  });
  const priceInput = document.querySelector(".priceInput");
  priceInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buyLotto();
    }
  });
  document.addEventListener("priceUpdated", () => {
    showLottos(divideByUnit(PRICE.UNIT, priceStore.getPrice()));
  });
  const checkResultButton = document.querySelector(".checkResultButton");
  checkResultButton.addEventListener("click", () => {
    clickCheckResult();
  });
  document.addEventListener("checkResult", (event) => {
    showResult(event.detail);
  });
  const resetButton = document.querySelector("#reset");
  resetButton.addEventListener("click", () => {
    reset();
  });
  const closeButton = document.querySelector("#closeButton");
  closeButton.addEventListener("click", () => {
    const dialog = document.querySelector("dialog");
    dialog.close();
    resetWinningHistoryUI();
  });
};
game();
