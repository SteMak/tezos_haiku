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
        storage_loaded = true
        check_wallet()
      })
  })
  .catch(error => console.log(`Error: ${JSON.stringify(error, null, 2)}`));

check_wallet = async () => {
  const activeAccount = await Wallet.client.getActiveAccount();
  document.getElementById('wallet').style.display = ''
  if (!activeAccount) {
    document.getElementById('main_container').innerHTML += '<h2 class="fw-light center">Please, connect your wallet to see your account</h2>'
  } else {
    user_addr = activeAccount.address;
    document.getElementById('wallet').onclick = () => { disconnect_wallet(); document.location.reload() }
    document.getElementById('wallet').innerHTML = 'Disconnect or change wallet'
    document.getElementById('main_container').innerHTML = `<h2 class="fw-light center">Created haikus</h2>
    <div id="nothing_crt">
      <div id="created_tokens"></div>
    </div>
    <div class="center">
      <button type="button" class="btn btn-sm btn-outline-secondary center" id="new_haiku_big_button">ORIGINATE NEW
        HAIKU</button>
    </div>
    <h2 class="fw-light center">Owned haikus</h2>
    <div id="nothing_own">
      <div id="owned_tokens"></div>
    </div>
    <div id="token_popup"></div>`

    data_loaded = true
    main_start()
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
  if (storage_loaded) {
    document.getElementById('wallet').onclick = () => { disconnect_wallet(); document.location.reload() }
    document.getElementById('wallet').innerHTML = 'Disconnect or change wallet'
    document.getElementById('main_container').innerHTML = `<h2 class="fw-light center">Created haikus</h2>
    <div id="nothing_crt">
      <div id="created_tokens"></div>
    </div>
    <div class="center">
      <button type="button" class="btn btn-sm btn-outline-secondary center" id="new_haiku_big_button">ORIGINATE NEW
        HAIKU</button>
    </div>
    <h2 class="fw-light center">Owned haikus</h2>
    <div id="nothing_own">
      <div id="owned_tokens"></div>
    </div>
    <div id="token_popup"></div>`

    data_loaded = true
    main_start()
  }
}

disconnect_wallet = async () => await Wallet.clearActiveAccount()

const assign_data = (storage) => {
  data.tokens = []
  data.owners = []
  data.reports = []

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
    data.tokens.push(value)
  }
  for (const [s_key, value] of storage.ledger.valueMap) {
    const key = JSON.parse(s_key)
    value.token_id = Number(key[1])
    value.owner = key[0]
    value.count = Number(value.count)
    value.for_sale = Number(value.for_sale)
    value.price = Number(value.price)
    data.owners.push(value)
  }
  for (const [key, value] of storage.report.valueMap) {
    value.id = Number(key.slice(1, -1))
    value.rep_t_id = Number(value.rep_t_id)
    data.reports.push(value)
  }
}

const main_start = () => {
  if (!dom_loaded || !data_loaded) return

  console.log(data.tokens)
  console.log(data.owners)
  console.log(data.reports)

  const created = data.tokens.filter(c => c.creator == user_addr).sort((a, b) => (a.state - b.state) || (b.cnfrm_at - a.cnfrm_at))
  for (const t of created) {
    const rep = data.reports.filter(c => c.rep_t_id == t.id)
    const min_price = data.owners.filter(c => c.token_id == t.id).reduce((a, c) => a > c.price && c.for_sale > 0 ? c.price : a, Infinity)
    if (
      t.cnfrm_by.length + t.rejct_by.length >= min_voted_users
      && Number(t.cnfrm_at) + min_voted_time * 1000 <= Number(new Date())
      && (
        rep.reduce((a, c) => a || (c.yes_by.length + c.no_by.length >= min_voted_on_report && c.yes_by.length / (c.yes_by.length + c.no_by.length) >= voted_positive_percent), rep.length == 0)
        || rep.reduce((a, c) => a && (c.yes_by.length + c.no_by.length >= min_voted_on_report), true)
      )
    ) {
      document.getElementById("created_tokens").innerHTML += `
        <div class="card token">
          ${t.image}
          <div class="card-body state_type_${statuses_d[t.state]}">
            <p class="card-text">Haiku #${t.id} written by <a style="font-family:monospace; font-size: initial;">${t.creator}</a></p>
            <div class="d-flex justify-content-between align-items-center">
              <button type="button" id="update_button-${t.id}" class="btn btn-sm btn-outline-secondary verify_button">VERIFY</button>
            </div>
            <p class="buy_note" id="note_result-${t.id}">${!user_addr ? 'Please, connect your wallet to vote for haikus' : ''}</p>
          </div>
        </div>`
    } else {
      document.getElementById("created_tokens").innerHTML += `
        <div class="card token" onclick="info_open(${t.id})">
          ${t.image}
          <div class="card-body state_type_${statuses_d[t.state]}">
            <p class="card-text">Haiku #${t.id} written by <a style="font-family:monospace; font-size: initial;">${t.creator}</a></p>
            <b class="card-text">${min_price !== Infinity ? `Price starts from <a style="font-family:monospace;">${min_price / 1000000}tz</a>` : `Not for sale :(`}</b>
            <p></p>
            <div class="d-flex justify-content-between align-items-center">
              <button type="button" id="buy_button-${t.id}" class="btn btn-sm btn-outline-secondary buy_button">More</button>
              <small class="text-muted">${t.cnfrm_at.toGMTString().split(', ')[1].slice(0, -7)}</small>
            </div>
          </div>
        </div>`
    }
  }
  if (created.length == 0) {
    document.getElementById("nothing_crt").innerHTML = `<h3 class="fw-light center">Nothing here :(</h3>`
  }

  const owner_tokens = data.owners.reduce((a, c) => { if (c.owner == user_addr) a.push(c.token_id); return a }, [])
  const owned = data.tokens.filter(c => owner_tokens.includes(c.id)).filter(c => c.state <= 1).sort((a, b) => b.cnfrm_at - a.cnfrm_at)
  for (const t of owned) {
    const min_price = data.owners.filter(c => c.token_id == t.id).reduce((a, c) => a > c.price && c.for_sale > 0 ? c.price : a, Infinity)
    document.getElementById("owned_tokens").innerHTML += `<div class="card token" onclick="sell_open(${t.id})">
      ${t.image}
      <div class="card-body">
        <p class="card-text">Haiku #${t.id} written by <a style="font-family:monospace; font-size: initial;">${t.creator}</a></p>
        <b class="card-text">${min_price !== Infinity ? `Price starts from <a style="font-family:monospace;">${min_price / 1000000}tz</a>` : `Not for sale :(`}</b>
        <p></p>
        <div class="d-flex justify-content-between align-items-center">
          <button type="button" id="buy_button-${t.id}" class="btn btn-sm btn-outline-secondary buy_button">More</button>
          <small class="text-muted">${t.cnfrm_at.toGMTString().split(', ')[1].slice(0, -7)}</small>
        </div>
      </div>
    </div>`
  }
  if (owned.length == 0) {
    document.getElementById("nothing_own").innerHTML = `<h3 class="fw-light center">Nothing here :(</h3>`
  }
}

info_open = (id) => {
  const t = data.tokens[id]
  document.getElementById('token_popup').innerHTML = `<section id="popup_overlay" class="overlay__">
    <div class="container__">
      <h1 class="fw-light buy_header">Info Haiku #${t.id}</h1>
      <div class="card token buy_image">
        ${t.image}
      </div>
      <div class="buy_body">
        <div class="card buy_card">Creator: ${t.creator.slice(0, 7)}...${t.creator.slice(-7)}</div>
        <div class="card buy_card">Created at: ${t.crted_at.toGMTString().split(', ')[1]}</div>
        <div class="card buy_card">Status: ${statuses[t.state]}</div>
        <div class="card buy_card">Total supply: ${t.amount}</div>
        ${user_addr ? `<div class="card buy_card">You own: ${data.owners.filter(c => c.owner == user_addr && c.token_id == t.id).reduce((a, c) => a + c.count, 0)}</div>` : ""}
        <div class="btn-group buy_btn_group" role="group">
          <button type="button" onclick="token_close()" class="btn btn_secondary buy_cfrm_button">CLOSE</button>
        </div>
      </div>
    </div>
  </section>`
}
sell_open = (id) => {
  const t = data.tokens[id]
  const o = data.owners.filter(c => c.owner == user_addr && c.token_id == id)
  const max_amount = o.reduce((a, c) => a + c.count, 0)
  const sale = o.reduce((a, c) => a + c.for_sale, 0)
  const price = o.reduce((a, c) => a + c.price, 0) / o.length / 1000000
  document.getElementById('token_popup').innerHTML = `<section id="popup_overlay" class="overlay__">
    <div class="container__">
      <h1 class="fw-light buy_header">Update price Haiku #${t.id}</h1>
      <div class="card token buy_image">
        ${t.image}
      </div>
      <div class="buy_body">
        <div class="card buy_card">Creator: ${t.creator.slice(0, 7)}...${t.creator.slice(-7)}</div>
        <div class="card buy_card">Created at: ${t.crted_at.toGMTString().split(', ')[1]}</div>
        <div class="card buy_card">Total supply: ${t.amount}</div>
        ${user_addr ? `<div class="card buy_card">You own: ${max_amount}</div>` : ""}
        <div class="buy_inputs">
          <label for="sell_amount" class="buy_label">Choose how many items you want to sell</label>
          <input type="range" class="form_range" min="0" max="${max_amount}" value="${sale}" step="1" id="sell_amount">
          <label for="sell_price" class="buy_label">Choose price for these items</label>
          <input type="number" class="form_number" min="0" value="${price}" step="0.1" id="sell_price">
        </div>
        <div class="card buy_card" id="sell_samt">Selected amount to sell: ${sale}</div>
        <div class="card buy_card" id="sell_cost">Selected price: ${price}tz</div>
        <div class="btn-group buy_btn_group" role="group">
          <button type="button" onclick="token_close()" class="btn btn_secondary buy_cfrm_button">CANCEL</button>
          <button type="button" id="sell_cfrm-${t.id}" class="btn btn_primary buy_cfrm_button">UPDATE PRICE</button>
        </div>
        <p class="buy_note" id="note_result"></p>
      </div>
    </div>
  </section>`
}
new_haiku_open = () => {
  if (storage_loaded) {
    document.getElementById('token_popup').innerHTML = `<section id="popup_overlay" class="overlay__">
      <div class="container__">
        <h1 class="fw-light buy_header">New Haiku Preview</h1>
        <div class="card token buy_image">
          <svg class="" width="338px" height="225px" role="img"
            aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="rgb(0,0,0)" rx="0.25rem" ry="0.25rem" id="canvas"></rect>
            <text y="20%" fill="rgb(255,255,255)" font-size="1.2em" id="image_text"></text>
          </svg>
        </div>
        <div class="buy_body">
          <div class="buy_inputs">
            <label for="mint_c" class="buy_label">Choose colors of background and text</label>
            <div class="card buy_card">
              Backgroung: <input type="color" class="form_color" value="#000000" id="mint_c_b">
              Text: <input type="color" class="form_color right_empty" value="#ffffff" id="mint_c_t"></p>
            </div>
            <label for="mint_amount" class="buy_label">Choose how many items of haiku you want to mint</label>
            <input type="number" class="form_number" min="1" max="${max_mint_amount}" value="7" step="1" id="mint_amount">
            <label for="mint_cont" class="buy_label">Provide yours haiku text below</label>
            <textarea type="text" class="form_haiku_text" id="mint_cont"></textarea>
          </div>
          <div class="card buy_card" id="mint_samt">Selected amount to mint: 7</div>
          <div class="btn-group buy_btn_group" role="group">
            <button type="button" onclick="token_close()" class="btn btn_secondary buy_cfrm_button">CANCEL</button>
            ${user_addr ? `<button type="button" id="publish" class="btn btn_primary buy_cfrm_button">ORIGINATE</button>` : `<button type="button" id="publish" class="btn btn_primary buy_cfrm_button" disabled>ORIGINATE</button>`}
            </div>
            <p class="buy_note" id="note_result">${!user_addr ? 'Please, reload the page and connect your wallet to create haikus' : ''}</p>
          </div>
          <p class="buy_note" id="note_result"></p>
        </div>
      </div>
    </section>`
  }
}
token_close = () => {
  document.getElementById('token_popup').innerHTML = ''
}

const token_update_price = async (id) => {
  document.getElementById(`sell_cfrm-${id}`).disabled = true
  document.getElementById('note_result').innerHTML = 'Please, confirm transaction in your wallet'
  contract = contract ? contract : await Tezos.wallet.at(contract_addr);
  try {
    const result = await contract.methods.token_update_price(Number(id), Number(document.getElementById('sell_amount').value), Math.ceil(Number(document.getElementById('sell_price').value) * 1000000)).send();
    document.getElementById('note_result').innerHTML = 'Your request is in work. Wait some and update page to view changes.'
  } catch (error) {
    if (error.title == 'Aborted') {
      document.getElementById('note_result').innerHTML = 'Please, try again and confirm transaction in your wallet'
      document.getElementById(`sell_cfrm-${id}`).disabled = false
    } else {
      document.getElementById('note_result').innerHTML = 'Something went wrong, please try again later'
    }
    console.log(`The contract call failed and the following error was returned:`, error);
  }
}
const token_mint_complex = async (id) => {
  document.getElementById('publish').disabled = true
  document.getElementById('note_result').innerHTML = 'Please, confirm transaction in your wallet'
  contract = contract ? contract : await Tezos.wallet.at(contract_addr);
  try {
    const result = await contract.methods.token_mint_complex(document.getElementById('mint_cont').value.slice(0, max_mint_length), Number(document.getElementById('mint_amount').value), 0, 0, 'en', parseInt(document.getElementById('mint_c_b').value.slice(1), 16), parseInt(document.getElementById('mint_c_t').value.slice(1), 16)).send();
    document.getElementById('note_result').innerHTML = 'Your request is in work. Wait some and update page to view changes.'
  } catch (error) {
    if (error.title == 'Aborted') {
      document.getElementById('note_result').innerHTML = 'Please, try again and confirm transaction in your wallet'
      document.getElementById('publish').disabled = false
    } else {
      document.getElementById('note_result').innerHTML = 'Something went wrong, please update page and try again'
    }
    console.log(`The contract call failed and the following error was returned:`, error);
  }
}
const token_update_state = async (id, state) => {
  document.getElementById(`update_button-${id}`).disabled = true
  document.getElementById(`note_result-${id}`).innerHTML = 'Please, confirm transaction in your wallet'
  contract = contract ? contract : await Tezos.wallet.at(contract_addr);
  try {
    const result = await contract.methods.token_update_state(Number(id)).send();
    document.getElementById(`note_result-${id}`).innerHTML = 'Your request is in work. Wait some and update page to view changes.'
  } catch (error) {
    if (error.title == 'Aborted') {
      document.getElementById(`note_result-${id}`).innerHTML = 'Please, try again and confirm transaction in your wallet'
      document.getElementById(`update_button-${id}`).disabled = false
    } else {
      document.getElementById(`note_result-${id}`).innerHTML = 'Something went wrong, please update page and try again'
    }
    console.log(`The contract call failed and the following error was returned:`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => { dom_loaded = true; main_start() })
document.addEventListener('click', e => {
  if (e.target.id == 'popup_overlay') token_close()
  if (e.target.id == 'new_haiku_big_button' || e.target.id == 'new_haiku_button') {
    new_haiku_open()
  }
  if (e.target.id == 'publish') {
    token_mint_complex()
  }
  const id = e.target.id.split('-')
  if (id[0] == 'sell_cfrm') {
    token_update_price(id[1])
  }
  if (id[0] == 'update_button') {
    e.stopPropagation()
    token_update_state(id[1])
  }
})
document.addEventListener('input', e => {
  if (e.target.id == 'sell_amount') {
    document.getElementById('sell_samt').innerHTML = `Selected amount to sell: ${e.target.value}`
  }
  if (e.target.id == 'sell_price') {
    if (e.target.value < 0) e.target.value = 0
    document.getElementById('sell_cost').innerHTML = `Selected price: ${e.target.value}tz`
  }
  if (e.target.id == 'mint_amount') {
    if (e.target.value > max_mint_amount) e.target.value = max_mint_amount
    if (e.target.value < 1) e.target.value = 1
    document.getElementById('mint_samt').innerHTML = `Selected amount to mint: ${e.target.value}`
  }
  if (e.target.id == 'mint_c_b') {
    document.getElementById('canvas').style.fill = e.target.value
  }
  if (e.target.id == 'mint_c_t') {
    document.getElementById('image_text').style.fill = e.target.value
  }
  if (e.target.id == 'mint_cont') {
    document.getElementById('image_text').innerHTML = e.target.value.slice(0, max_mint_length).split('\n').reduce((a, c) => a + `<tspan x="10%" dy="1.6em">${c}</tspan>`, "")
  }
})
