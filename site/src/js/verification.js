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
  data_loaded = true
  main_start()
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
  data_loaded = true
  main_start()
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

const eq_words = (s1, s2) => {
  const s1_words = s1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split('\n').join(' ').split(' ').filter(c => c.length > 3).reduce((a, c) => { if (a.indexOf(c) == -1) a.push(c); return a }, [])
  const s2_words = s2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split('\n').join(' ').split(' ').filter(c => c.length > 3).reduce((a, c) => { if (a.indexOf(c) == -1) a.push(c); return a }, [])
  return s1_words.reduce((a, c) => a + s2_words.includes(c), 0)
}

const main_start = () => {
  if (!dom_loaded || !data_loaded) return

  console.log(data.tokens)
  console.log(data.owners)
  console.log(data.reports)

  document.getElementById("tokens").innerHTML = ''

  for (const t of data.tokens.filter(c => c.state == 0).sort((a, b) => a.crted_at - b.crted_at)) {
    const rep = data.reports.filter(c => c.rep_t_id == t.id)

    let nearest = ''
    for (const n of data.tokens.filter(c => t.crted_at > c.crted_at)) {
      if (!nearest || eq_words(nearest, t.content) < eq_words(n.content, t.content)) nearest = n.content
    }
    const eq_counter = eq_words(nearest, t.content)

    if (
      t.cnfrm_by.length + t.rejct_by.length >= min_voted_users
      && Number(t.cnfrm_at) + min_voted_time * 1000 <= Number(new Date())
      && (
        rep.reduce((a, c) => a || (c.yes_by.length + c.no_by.length >= min_voted_on_report && c.yes_by.length / (c.yes_by.length + c.no_by.length) >= voted_positive_percent), rep.length == 0)
        || rep.reduce((a, c) => a && (c.yes_by.length + c.no_by.length >= min_voted_on_report), true)
      )
    ) {
      document.getElementById("tokens").innerHTML += `
        <div class="card token">
          ${t.image}
          <div class="card-body">
            <p class="card-text">Haiku #${t.id} written by ${t.creator == user_addr ? `<a class="alien" href="${account_link}" target="_blank">you</a>` : `<a class="alien" href="${alien_link}?address=${t.creator}" target="_blank" style="font-family:monospace; font-size: initial;">${t.creator}</a>`}</p>
            <div class="d-flex justify-content-between align-items-center">
              <button type="button" id="update_button-${t.id}" class="btn btn-sm btn-outline-secondary verify_button" ${!user_addr ? 'disabled' : ''}>VERIFY</button>
            </div>
            <p class="buy_note" id="note_result-${t.id}">${!user_addr ? 'Please, connect your wallet to vote for haiku' : ''}</p>
          </div>
        </div>`
    } else {
      document.getElementById("tokens").innerHTML += `
        <div class="card token">
          ${t.image}
          <div class="card-body">
            <p class="card-text" style="margin-bottom: 0;">Haiku #${t.id} written by ${t.creator == user_addr ? `<a class="alien" href="${account_link}" target="_blank">you</a>` : `<a class="alien" href="${alien_link}?address=${t.creator}" target="_blank" style="font-family:monospace; font-size: initial;">${t.creator}</a>`}</p>
          </div>
          ${nearest && eq_counter >= 3 ? `
            <div class="card-body plagiarism">
              <p style="margin-bottom:5px;">Possible plagiarism of:</p><p style="margin-bottom:0;">${nearest.split('\n').join('<br>')}</p>
            </div>` : ''
        }
          <div class="card-body">
            <div class="voting">
              <button type="button" class="btn btn_voting_good" id="good_vote-${t.id}" ${t.cnfrm_by.includes(user_addr) || !user_addr ? 'disabled' : ''}></button>
              <div class="progress" style="width: 100%;margin: 5px;">
                <div class="progress-bar" role="progressbar" id="voting_bar-${t.id}" style="width: ${t.cnfrm_by.length + t.rejct_by.length ? t.cnfrm_by.length / (t.cnfrm_by.length + t.rejct_by.length) * 100 : 50}%"></div>
              </div>
              <button type="button" class="btn btn_voting_bad" id="bad_vote-${t.id}" ${t.rejct_by.includes(user_addr) || !user_addr ? 'disabled' : ''}></button>
            </div>
            <p class="buy_note" id="note_vote-${t.id}">Total number of votes: ${t.cnfrm_by.length + t.rejct_by.length}. You have${t.cnfrm_by.includes(user_addr) ? ' voted for green' : t.rejct_by.includes(user_addr) ? ' voted for red' : "n't voted"}</p>
            <p></p>
            <div class="d-flex justify-content-between align-items-center">
              ${Number(t.cnfrm_at) + min_voted_time * 1000 <= Number(new Date()) ? '<p></p>' : `<button type="button" id="report_button-${t.id}" class="btn btn-sm btn-outline-secondary buy_button">Report</button>`}
              <small class="text-muted">${t.crted_at.toGMTString().split(', ')[1].slice(0, -7)}</small>
            </div>
            <p class="buy_note" id="note_result-${t.id}">${!user_addr ? 'Please, connect your wallet to vote for haiku' : ''}</p>
          </div>
          ${rep.reduce((a, c) => a + `
            <div class="card-body viol_cprt">
              <p class="card-text">Possible violation of copyright!</p>
              <p class="card-text">This is known haiku of <a style="font-family:monospace; font-size: initial;">${c.orig_author}</a></p>
              <p class="card-text">Prove link: <a href="${c.orig_link}" target="_blank">proves here</a></p>
              <div class="voting">
                <button type="button" class="btn btn_voting_good" id="rep_good_vote-${c.id}" ${c.yes_by.includes(user_addr) || !user_addr ? 'disabled' : ''}></button>
                <div class="progress" style="width: 100%;margin: 5px;">
                  <div class="progress-bar" role="progressbar" id="rep_voting_bar-${c.id}" style="width: ${c.yes_by.length + c.no_by.length ? c.yes_by.length / (c.yes_by.length + c.no_by.length) * 100 : 50}%"></div>
                </div>
                <button type="button" class="btn btn_voting_bad" id="rep_bad_vote-${c.id}" ${c.no_by.includes(user_addr) || !user_addr ? 'disabled' : ''}></button>
              </div>
              <p class="buy_note" id="rep_note_vote-${c.id}">Total number of votes: ${c.yes_by.length + c.no_by.length}. You have${c.yes_by.includes(user_addr) ? ' voted for green' : c.no_by.includes(user_addr) ? ' voted for red' : "n't voted"}</p>
              <p class="buy_note" id="rep_note_result-${c.id}">${!user_addr ? 'Please, connect your wallet to vote for haiku' : ''}</p>
            </div>`, '')}
        </div>`
    }
  }
}

report_open = async (id) => {
  const t = data.tokens[id]
  const rep = data.reports.filter(c => c.rep_t_id == id)
  document.getElementById('report_popup').innerHTML = `<section id="report_popup_overlay" class="overlay__">
    <div class="container__">
      <h1 class="fw-light buy_header">Report on Haiku #${t.id}</h1>
      <div class="card token buy_image">
        ${t.image}
      </div>
      <div class="buy_body">
        <div class="buy_inputs">
          <label for="real_author" class="buy_label">Please enter name of real author of this haiku</label>
          <input type="text" class="form_range" id="real_author">
          <label for="real_link" class="buy_label">Please past a prove link here</label>
          <input type="text" class="form_range" id="real_link">
        </div>
        <div class="btn-group buy_btn_group" role="group">
          <button type="button" onclick="report_close()" class="btn btn_secondary buy_cfrm_button">CANCEL</button>
          ${user_addr && rep.filter(c => c.reporter_adrs == user_addr).length == 0 ? `<button type="button" id="report_cfrm-${id}" class="btn btn_primary buy_cfrm_button">REPORT</button>` : `<button type="button" id="report_cfrm-${id}" class="btn btn_primary buy_cfrm_button" disabled>REPORT</button>`}
        </div>
        <p class="buy_note" id="note_result">${!user_addr ? 'Please, connect your wallet to report on haiku' : rep.filter(c => c.reporter_adrs == user_addr).length > 0 ? 'You have already sent report on this haiku' : ''}</p>
      </div>
    </div>
  </section>`
}
report_close = () => {
  document.getElementById('report_popup').innerHTML = ''
}

const token_vote_for_state = async (id, state) => {
  let t = data.tokens[id]

  document.getElementById(`bad_vote-${id}`).disabled = true
  document.getElementById(`good_vote-${id}`).disabled = true
  document.getElementById(`note_result-${t.id}`).innerHTML = 'Please, confirm transaction in your wallet'
  contract = contract ? contract : await Tezos.wallet.at(contract_addr);
  try {
    const result = await contract.methods.token_vote_for_state(Number(id), votes.indexOf(state)).send();
    document.getElementById(`note_result-${t.id}`).innerHTML = 'Your request is in work. Wait some and update page to view changes.'
  } catch (error) {
    if (error.title == 'Aborted') {
      document.getElementById(`note_result-${t.id}`).innerHTML = 'Please, try again and confirm transaction in your wallet'
      document.getElementById(`bad_vote-${id}`).disabled = t.rejct_by.includes(user_addr)
      document.getElementById(`good_vote-${id}`).disabled = t.cnfrm_by.includes(user_addr)
    } else {
      document.getElementById(`note_result-${t.id}`).innerHTML = 'Something went wrong, please update page and try again'
    }
    console.log(`The contract call failed and the following error was returned:`, error);
    return
  }
  if (state == "yes") {
    t.cnfrm_by.push(user_addr)
    if (t.rejct_by.includes(user_addr))
      t.rejct_by.splice(t.rejct_by.indexOf(user_addr), 1)
    document.getElementById(`note_vote-${id}`).innerHTML = `Total number of votes: ${t.cnfrm_by.length + t.rejct_by.length}. You have voted for green`
  }
  if (state == "no") {
    t.rejct_by.push(user_addr)
    if (t.cnfrm_by.includes(user_addr))
      t.cnfrm_by.splice(t.cnfrm_by.indexOf(user_addr), 1)
    document.getElementById(`note_vote-${id}`).innerHTML = `Total number of votes: ${t.cnfrm_by.length + t.rejct_by.length}. You have voted for red`
  }
  document.getElementById(`voting_bar-${id}`).style.width = `${t.cnfrm_by.length / (t.cnfrm_by.length + t.rejct_by.length) * 100}%`
}
const token_vote_for_report = async (id, state) => {
  let t = data.reports.filter(c => c.id == id)[0]
  if (!t) {
    document.getElementById(`rep_note_result-${id}`).innerHTML = 'Report for which we vote is undefined, please, try again later.'
    return
  }

  document.getElementById(`rep_bad_vote-${id}`).disabled = true
  document.getElementById(`rep_good_vote-${id}`).disabled = true
  document.getElementById(`rep_note_result-${id}`).innerHTML = 'Please, confirm transaction in your wallet'
  contract = contract ? contract : await Tezos.wallet.at(contract_addr);
  try {
    const result = await contract.methods.token_vote_for_report(Number(id), votes.indexOf(state)).send();
    document.getElementById(`rep_note_result-${id}`).innerHTML = 'Your request is in work. Wait some and update page to view changes.'
  } catch (error) {
    if (error.title == 'Aborted') {
      document.getElementById(`rep_note_result-${id}`).innerHTML = 'Please, try again and confirm transaction in your wallet'
      document.getElementById(`rep_bad_vote-${id}`).disabled = t.no_by.includes(user_addr)
      document.getElementById(`rep_good_vote-${id}`).disabled = t.yes_by.includes(user_addr)
    } else {
      document.getElementById(`rep_note_result-${id}`).innerHTML = 'Something went wrong, please update page and try again'
    }
    console.log(`The contract call failed and the following error was returned:`, error);
    return
  }
  if (state == "yes") {
    t.yes_by.push(user_addr)
    if (t.no_by.includes(user_addr))
      t.no_by.splice(t.no_by.indexOf(user_addr), 1)
    document.getElementById(`rep_note_vote-${id}`).innerHTML = `Total number of votes: ${t.yes_by.length + t.no_by.length}. You have voted for green`
  }
  if (state == "no") {
    t.no_by.push(user_addr)
    if (t.yes_by.includes(user_addr))
      t.yes_by.splice(t.yes_by.indexOf(user_addr), 1)
    document.getElementById(`rep_note_vote-${id}`).innerHTML = `Total number of votes: ${t.yes_by.length + t.no_by.length}. You have voted for red`
  }
  document.getElementById(`rep_voting_bar-${id}`).style.width = `${t.yes_by.length / (t.yes_by.length + t.no_by.length) * 100}%`
}
const token_report = async (id, state) => {
  document.getElementById(`report_cfrm-${id}`).disabled = true
  document.getElementById('note_result').innerHTML = 'Please, confirm transaction in your wallet'
  contract = contract ? contract : await Tezos.wallet.at(contract_addr);
  try {
    const result = await contract.methods.token_report(Number(id), document.getElementById('real_author').value || " ", document.getElementById('real_link').value || " ").send();
    document.getElementById(`note_result`).innerHTML = 'Your request is in work. Wait some and update page to view changes.'
  } catch (error) {
    if (error.title == 'Aborted') {
      document.getElementById(`note_result`).innerHTML = 'Please, try again and confirm transaction in your wallet'
      document.getElementById(`report_cfrm-${id}`).disabled = false
    } else {
      document.getElementById(`note_result`).innerHTML = 'Something went wrong, please update page and try again'
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
  if (e.target.id == 'report_popup_overlay') report_close()
  const id = e.target.id.split('-')
  if (id[0] == 'good_vote') {
    token_vote_for_state(id[1], "yes")
  }
  if (id[0] == 'bad_vote') {
    token_vote_for_state(id[1], "no")
  }
  if (id[0] == 'rep_good_vote') {
    token_vote_for_report(id[1], "yes")
  }
  if (id[0] == 'rep_bad_vote') {
    token_vote_for_report(id[1], "no")
  }
  if (id[0] == 'report_button') {
    report_open(id[1])
  }
  if (id[0] == 'report_cfrm') {
    token_report(id[1])
  }
  if (id[0] == 'update_button') {
    token_update_state(id[1])
  }
})
document.addEventListener('input', e => {
  if (e.target.id == 'real_author') {
    document.getElementById('real_author').value = e.target.value.slice(0, max_max_report_author)
  }
  if (e.target.id == 'real_link') {
    document.getElementById('real_link').value = e.target.value.slice(0, max_max_report_url)
  }
})
