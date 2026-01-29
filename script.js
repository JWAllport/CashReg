const defaultPrice = 19.5;
let cid =
    [["PENNY", 2], ["NICKEL", 2], ["DIME", 5], ["QUARTER", 5], ["ONE", 25], ["FIVE", 50], ["TEN", 50], ["TWENTY", 100], ["ONE HUNDRED", 200]];

let change = 0;
const purchaseBtn = document.querySelector("#purchase-btn");
const regStatus = document.querySelector("#change-due");
const customerCashInput = document.querySelector("#customer-cash");
const ledScreen = document.querySelector("#ledScreen");
const itemPriceInput = document.querySelector("#item-price");

updateRegister();
updateCustomerDisplay(0);
itemPriceInput.value = defaultPrice.toFixed(2);

customerCashInput.addEventListener("input", () => {
    const value = parseFloat(customerCashInput.value);
    updateCustomerDisplay(isNaN(value) ? 0 : value);
});

purchaseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    regStatus.className = "status";

    const moneyGiven = parseFloat(customerCashInput.value);
    const price = parseFloat(itemPriceInput.value);

    if (!price || price <= 0) {
        regStatus.textContent = "Status: Invalid item price";
        regStatus.classList.add("error");
        return;
    }

    if (!moneyGiven) {
        regStatus.textContent = "Status: No money given";
        regStatus.classList.add("error");
        return;
    }

    if (moneyGiven < price) {
        regStatus.textContent = "Status: INSUFFICIENT_FUNDS";
        regStatus.classList.add("error");
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (moneyGiven - price > getTotal()) {
        regStatus.textContent = "Status: INSUFFICIENT_FUNDS";
        regStatus.classList.add("error");
        return;
    }

    if (moneyGiven === price) {
        regStatus.textContent = "No change due - customer paid with exact cash";
        regStatus.classList.add("success");
        alert("No change due - customer paid with exact cash");
        customerCashInput.value = "0.00";
        updateCustomerDisplay(0);
        return;
    }

    const amountOwed = parseFloat((moneyGiven - price).toFixed(2));
    const result = calculateChange(amountOwed);
    updateRegister();

    const paidInFull =
        result.reduce((a, b) => a + parseFloat(b[1] || 0), 0) === amountOwed;

    if (paidInFull) {
        updateStatus(result);
        customerCashInput.value = amountOwed.toFixed(2);
        updateCustomerDisplay(amountOwed);
    } else {
        regStatus.textContent = "Status: INSUFFICIENT_FUNDS";
        regStatus.classList.add("error");
    }
});


function calculateChange(amountOwed) {
    change = 0;
    let result = [];
    for (let i = cid.length - 1; i >= 0; i--) {

        if (cid[i][1] === 0) {
            continue;
        }
        const multiplesOf = parseFloat(translateCurrency(cid[i][0]));
        console.log(cid[i]);
        result[i] = [cid[i][0], 0];
        while (amountOwed >= multiplesOf && cid[i][1] > 0) {
            amountOwed = (amountOwed - multiplesOf).toFixed(2);
            cid[i][1] = parseFloat(cid[i][1] - multiplesOf).toFixed(2);

            if (result[i][1]) {
                result[i][1] = (parseFloat(result[i][1]) + multiplesOf).toFixed(2);
            } else {
                result[i][1] = parseFloat(multiplesOf).toFixed(2);
            }

            change = parseFloat((change + multiplesOf).toFixed(2));
        }


    }
    console.log(result);
    return result;
}

function getTotal() {
    let total = 0.0;
    cid.forEach((foo) => {
        total += parseFloat(foo[1]);
    })

    return total;
}

function translateCurrency(currency) {
    switch (currency) {
        case "PENNY":
            return .01;
        case "NICKEL":
            return .05;
        case "DIME":
            return .1;
        case "QUARTER":
            return .25;
        case "ONE":
            return 1;
        case "FIVE":
            return 5;
        case "TEN":
            return 10;
        case "TWENTY":
            return 20;
        case "ONE HUNDRED":
            return 100;
    }
}

function updateRegister() {
    const registerBody = document.querySelector("#body");
    registerBody.innerHTML = "";
    for (let elem of cid) {
        registerBody.innerHTML += `<div id=money>${elem[0]}:  ${elem[1]}</div>`
    }

}

function updateCustomerDisplay(amount) {
    ledScreen.innerText = `$ ${amount.toFixed(2)}`;
}


function updateStatus(result) {
  const total = getTotal();
  regStatus.textContent = total === 0 ? "Status: CLOSED" : "Status: OPEN";
  regStatus.classList.add(total === 0 ? "success" : "open");

  for (let elem of result.filter(foo => foo && foo[1] > 0).reverse()) {
    const val = parseFloat(elem[1]);
    regStatus.innerText += ` ${elem[0]}: $${val.toFixed(2)}`;
  }
}
