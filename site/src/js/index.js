import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosOperationType } from "@airgap/beacon-sdk";

const Tezos = new TezosToolkit(rpc_addr);
const Wallet = new BeaconWallet({ name: "Tezos Haiku" });
Tezos.setWalletProvider(Wallet);

Tezos.contract.at(contract_addr)
  .then(contract => {
    return contract.storage()
      .then(storage => {
        assign_data(storage)
        check_wallet()
        document.getElementById('sort_container').style.display = ''
        data_loaded = true
        main_start()
      })
  })
  .catch(error => console.log(`Error: ${JSON.stringify(error, null, 2)}`));

check_wallet = async () => {
  const activeAccount = await Wallet.client.getActiveAccount();
  if (!activeAccount) {
    document.getElementById('buttons_preview').innerHTML += '<a class="btn btn_primary right_down_space" onclick="connect_wallet()">Connect wallet</a>'
  } else {
    user_addr = activeAccount.address;
  }
}

connect_wallet = async () => {
  const activeAccount = await Wallet.client.getActiveAccount();
  if (!activeAccount) {
    const permissions = await Wallet.client.requestPermissions({
      network: {
        type: network,
        rpcUrl: rpc_addr,
      },
    });
    user_addr = permissions.address;
  } else {
    user_addr = activeAccount.address;
  }

  document.getElementById('buttons_preview').lastChild.remove()
}

disconnect_wallet = async () => await Wallet.clearActiveAccount()

const assign_data = (storage) => {
  data.tokens = []
  data.owners = []

  for (const [s_key, value] of storage.ledger.valueMap) {
    const key = JSON.parse(s_key)
    value.token_id = Number(key[1])
    value.owner = key[0]
    value.count = Number(value.count)
    value.for_sale = Number(value.for_sale)
    value.price = Number(value.price)
    data.owners.push(value)
  }
  for (const [key, value] of storage.token.valueMap) {
    value.id = Number(key.slice(1, -1))
    value.amount = Number(value.amount)
    value.state = Number(value.state)
    value.cnfrm_at = new Date(value.cnfrm_at)
    value.crted_at = new Date(value.crted_at)
    value.text_color = Number(value.text_color)
    const c_t = { b: value.text_color % 256 }
    c_t.g = (value.text_color - c_t.b) / 256 % 256
    c_t.r = ((value.text_color - c_t.b) / 256 - c_t.g) / 256 % 256
    value.back_color = Number(value.back_color)
    const c_b = { b: value.back_color % 256 }
    c_b.g = (value.back_color - c_b.b) / 256 % 256
    c_b.r = ((value.back_color - c_b.b) / 256 - c_b.g) / 256 % 256
    value.image = `<svg class="" width="338px" height="225px" role="img" focusable="false">
      <rect width="100%" height="100%" fill="rgb(${c_b.r},${c_b.g},${c_b.b})" rx="0.25rem" ry="0.25rem"></rect>
      <text y="20%" fill="white" font-size="1.2em">
        ${value.content.split('\n').reduce((a, c) => a + `<tspan x="10%" dy="1.6em" fill="rgb(${c_t.r},${c_t.g},${c_t.b})">${c}</tspan>`, "")}
      </text>
    </svg>`

    value.min_price = data.owners.filter(c => c.token_id == value.id).reduce((a, c) => a > c.price && c.for_sale > 0 ? c.price : a, Infinity)
    value.owners_amount = data.owners.filter(c => c.token_id == value.id).length
    data.tokens.push(value)
  }
}

const main_start = (sort = (a, b) => b.cnfrm_at - a.cnfrm_at) => {
  if (!dom_loaded || !data_loaded) return

  console.log(data.tokens)
  console.log(data.owners)

  document.getElementById("tokens").innerHTML = ''
  for (const t of data.tokens.filter(c => c.state == 1).sort(sort)) {
    document.getElementById("tokens").innerHTML += `<div class="card token" onclick="buy_open(${t.id})">
      ${t.image}
      <div class="card-body">
        <p class="card-text">Haiku #${t.id} written by <a style="font-family:monospace; font-size: initial;">${t.creator}</a></p>
        <b class="card-text">${t.min_price !== Infinity ? `Price starts from <a style="font-family:monospace;">${t.min_price / 1000000}tz</a>` : `Not for sale :(`}</b>
        <p></p>
        <div class="d-flex justify-content-between align-items-center">
          <button type="button" id="buy_button-${t.id}" class="btn btn-sm btn-outline-secondary buy_button">More</button>
          <small class="text-muted">${t.cnfrm_at.toGMTString().split(', ')[1].slice(0, -7)}</small>
        </div>
      </div>
    </div>`
  }
}

buy_open = async (id) => {
  const t = data.tokens[id]
  data.buy_cache = data.owners.filter(c => c.token_id == t.id && c.for_sale > 0).filter(c => c.owner != user_addr).sort((a, b) => a.price - b.price)
  const max_amount = data.buy_cache.reduce((a, c) => a + +c.for_sale, 0)
  document.getElementById('buy_popup').innerHTML = `<section id="buy_popup_overlay" class="overlay__">
    <div class="container__">
      <h1 class="fw-light buy_header">Buy Haiku #${t.id}</h1>
      <div class="card token buy_image">
        ${t.image}
      </div>
      <div class="buy_body">
        <div class="card buy_card">Creator: ${t.creator == user_addr ? `<a class="alien" href="${account_link}" target="_blank">you</a>` : `<a class="alien" href="${alien_link}?address=${t.creator}" target="_blank">${t.creator.slice(0, 7)}...${t.creator.slice(-7)}</a>`}</div>
        <div class="card buy_card">Created at: ${t.crted_at.toGMTString().split(', ')[1]}</div>
        <div class="card buy_card">Total supply: ${t.amount}</div>
        ${user_addr ? `<div class="card buy_card">You own: ${data.owners.filter(c => c.owner == user_addr && c.token_id == t.id).reduce((a, c) => a + c.count, 0)}</div>` : ""}
        ${data.buy_cache.length ? `
          <div class="buy_inputs">
            <label for="buy_amount" class="buy_label">Choose how many items you want to buy</label>
            <input type="range" class="form_range" min="1" max="${max_amount}" value="1" step="1" id="buy_amount">
          </div>
          <div class="card buy_card" id="buy_samt">Selected amount: 1${1 == max_amount ? '(max)' : ''}</div>
          <div class="card buy_card" id="buy_cost">Total price: ${data.buy_cache[0].price / 1000000}tz</div>
          <p class="buy_note">Note: each item of haiku has its own price. But our alghorithm include the cheapest ones in the total price, so you shouldn't worry if price of five items is bigger than price of the first multiplied by five.</p>
        `: ''}
        <div class="btn-group buy_btn_group" role="group">
          <button type="button" onclick="buy_close()" class="btn btn_secondary buy_cfrm_button">CANCEL</button>
          ${data.buy_cache.length && user_addr ? `<button type="button" id="buy_cfrm-${id}" class="btn btn_primary buy_cfrm_button">BUY</button>` : `<button type="button" id="buy_cfrm-${id}" class="btn btn_primary buy_cfrm_button" disabled>BUY</button>`}
        </div>
        <p class="buy_note" id="note_result">${!user_addr ? 'Please, connect your wallet to buy haiku' : ''}</p>
      </div>
    </div>
  </section>`
}
buy_close = () => {
  document.getElementById('buy_popup').innerHTML = ''
  data.buy_cache = undefined
}

const token_buy = async (id, pay, sellers) => {
  document.getElementById(`buy_cfrm-${id}`).disabled = true
  document.getElementById('note_result').innerHTML = 'Please, confirm transaction in your wallet'
  contract = contract ? contract : await Tezos.wallet.at(contract_addr);
  try {
    const result = await contract.methods.token_buy(Number(id), sellers).send({ amount: pay, mutez: true });
    document.getElementById('note_result').innerHTML = 'Your request is in work. Wait some and update page to view changes.'
  } catch (error) {
    if (error.title == 'Aborted') {
      document.getElementById('note_result').innerHTML = 'Please, try again and confirm transaction in your wallet'
      document.getElementById(`buy_cfrm-${id}`).disabled = false
    } else {
      document.getElementById('note_result').innerHTML = 'Something went wrong, please update page and try again'
    }
    console.log(`The contract call failed and the following error was returned:`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => { dom_loaded = true; main_start() })
document.addEventListener('click', e => {
  if (e.target.id == 'buy_popup_overlay') buy_close()
  const id = e.target.id.split('-')
  if (id[0] == 'buy_cfrm') {
    const sellers = []
    let a = document.getElementById('buy_amount').value
    let r = 0
    for (let i = 0; a > 0; i++) {
      if (a >= data.buy_cache[i].for_sale) {
        r += data.buy_cache[i].price * data.buy_cache[i].for_sale
        a -= data.buy_cache[i].for_sale
        sellers.push({ seller: data.buy_cache[i].owner, buy_amount: data.buy_cache[i].for_sale })
      } else {
        r += data.buy_cache[i].price * a
        sellers.push({ seller: data.buy_cache[i].owner, buy_amount: a })
        a = 0
      }
    }
    token_buy(id[1], r, sellers)
  }
})
document.addEventListener('input', e => {
  if (e.target.id == 'buy_amount') {
    let a = e.target.value
    let r = 0
    for (let i = 0; a > 0; i++) {
      if (a >= data.buy_cache[i].for_sale) {
        r += data.buy_cache[i].price * data.buy_cache[i].for_sale
        a -= data.buy_cache[i].for_sale
      } else {
        r += data.buy_cache[i].price * a
        a = 0
      }
    }
    document.getElementById('buy_cost').innerHTML = `Total price: ${r / 1000000}tz`
    document.getElementById('buy_samt').innerHTML = `Selected amount: ${e.target.value}${e.target.value == e.target.max ? '(max)' : ''}`
  }
  if (e.target.id == 'sort') {
    console.log(e.target.value)
    if (e.target.value == 'new') {
      main_start()
    }
    if (e.target.value == 'pop') {
      main_start((a, b) => b.owners_amount - a.owners_amount)
    }
    if (e.target.value == 'chp') {
      main_start((a, b) => a.min_price - b.min_price)
    }
    if (e.target.value == 'exp') {
      main_start((a, b) => {
        if (a.min_price == Infinity && b.min_price == Infinity) return 0
        if (a.min_price == Infinity) return 1
        if (b.min_price == Infinity) return -1
        return b.min_price - a.min_price
      })
    }
    if (e.target.value == 'old') {
      main_start((a, b) => a.cnfrm_at - b.cnfrm_at)
    }
  }
})
