!function(e,t,n,a,o){var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},i="function"==typeof r.parcelRequirecef0&&r.parcelRequirecef0,l=i.cache||{},d="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function c(t,n){if(!l[t]){if(!e[t]){var a="function"==typeof r.parcelRequirecef0&&r.parcelRequirecef0;if(!n&&a)return a(t,!0);if(i)return i(t,!0);if(d&&"string"==typeof t)return d(t);var o=new Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}u.resolve=function(n){return e[t][1][n]||n},u.cache={};var s=l[t]=new c.Module(t);e[t][0].call(s.exports,u,s,s.exports,this)}return l[t].exports;function u(e){return c(u.resolve(e))}}c.isParcelRequire=!0,c.Module=function(e){this.id=e,this.bundle=c,this.exports={}},c.modules=e,c.cache=l,c.parent=i,c.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(c,"root",{get:function(){return r.parcelRequirecef0}}),r.parcelRequirecef0=c;for(var s=0;s<t.length;s++)c(t[s]);var u=c(n);"object"==typeof exports&&"undefined"!=typeof module?module.exports=u:"function"==typeof define&&define.amd&&define((function(){return u}))}({"8cjBZ":[function(e,t,n){var a=e("@taquito/taquito"),o=e("@taquito/beacon-wallet");e("@airgap/beacon-sdk");const r=new a.TezosToolkit(rpc_addr),i=new o.BeaconWallet({name:"Tezos Haiku"});r.setWalletProvider(i),r.contract.at(contract_addr).then((e=>e.storage().then((e=>{l(e),storage_loaded=!0,check_wallet()})))).catch((e=>console.log(`Error: ${JSON.stringify(e,null,2)}`))),check_wallet=async()=>{const e=await i.client.getActiveAccount();document.getElementById("wallet").style.display="",e?(user_addr=e.address,document.getElementById("wallet").onclick=()=>{disconnect_wallet(),document.location.reload()},document.getElementById("wallet").innerHTML="Disconnect or change wallet",document.getElementById("main_container").innerHTML='<h2 class="fw-light center">Created haikus</h2>\n    <div id="nothing_crt">\n      <div id="created_tokens"></div>\n    </div>\n    <div class="center">\n      <button type="button" class="btn btn-sm btn_outline_primary center" id="new_haiku_big_button">ORIGINATE NEW\n        HAIKU</button>\n    </div>\n    <h2 class="fw-light center">Owned haikus</h2>\n    <div id="nothing_own">\n      <div id="owned_tokens"></div>\n    </div>\n    <div id="token_popup"></div>',data_loaded=!0,d()):document.getElementById("main_container").innerHTML+='<h2 class="fw-light center">Please, connect your wallet to see your account</h2>'},connect_wallet=async()=>{const e=await i.client.getActiveAccount();if(e)user_addr=e.address;else{const e=await i.client.requestPermissions({network:{type:network,rpcUrl:rpc_addr}});user_addr=e.address}storage_loaded&&(document.getElementById("wallet").onclick=()=>{disconnect_wallet(),document.location.reload()},document.getElementById("wallet").innerHTML="Disconnect or change wallet",document.getElementById("main_container").innerHTML='<h2 class="fw-light center">Created haikus</h2>\n    <div id="nothing_crt">\n      <div id="created_tokens"></div>\n    </div>\n    <div class="center">\n      <button type="button" class="btn btn-sm btn_outline_primary center" id="new_haiku_big_button">ORIGINATE NEW\n        HAIKU</button>\n    </div>\n    <h2 class="fw-light center">Owned haikus</h2>\n    <div id="nothing_own">\n      <div id="owned_tokens"></div>\n    </div>\n    <div id="token_popup"></div>',data_loaded=!0,d())},disconnect_wallet=async()=>await i.clearActiveAccount();const l=e=>{data.tokens=[],data.owners=[],data.reports=[];for(const[t,n]of e.token.valueMap){n.id=Number(t.slice(1,-1)),n.amount=Number(n.amount),n.state=Number(n.state),n.cnfrm_at=new Date(n.cnfrm_at),n.crted_at=new Date(n.crted_at),n.text_color=Number(n.text_color);const e={b:n.text_color%256};e.g=(n.text_color-e.b)/256%256,e.r=((n.text_color-e.b)/256-e.g)/256%256,n.back_color=Number(n.back_color);const a={b:n.back_color%256};a.g=(n.back_color-a.b)/256%256,a.r=((n.back_color-a.b)/256-a.g)/256%256,n.image=`<svg class="" width="338px" height="225px" role="img" focusable="false">\n    <rect width="100%" height="100%" fill="rgb(${a.r},${a.g},${a.b})" rx="0.25rem" ry="0.25rem"></rect>\n    <text y="20%" fill="white" font-size="1.2em">\n      ${n.content.split("\n").reduce(((t,n)=>t+`<tspan x="10%" dy="1.6em" fill="rgb(${e.r},${e.g},${e.b})">${n}</tspan>`),"")}\n    </text>\n  </svg>`,data.tokens.push(n)}for(const[t,n]of e.ledger.valueMap){const e=JSON.parse(t);n.token_id=Number(e[1]),n.owner=e[0],n.count=Number(n.count),n.for_sale=Number(n.for_sale),n.price=Number(n.price),data.owners.push(n)}for(const[t,n]of e.report.valueMap)n.id=Number(t.slice(1,-1)),n.rep_t_id=Number(n.rep_t_id),data.reports.push(n)},d=()=>{if(!dom_loaded||!data_loaded)return;console.log(data.tokens),console.log(data.owners),console.log(data.reports);const e=data.tokens.filter((e=>e.creator==user_addr)).sort(((e,t)=>e.state-t.state||t.cnfrm_at-e.cnfrm_at));for(const t of e){const e=data.reports.filter((e=>e.rep_t_id==t.id)),n=data.owners.filter((e=>e.token_id==t.id)).reduce(((e,t)=>e>t.price&&t.for_sale>0?t.price:e),1/0);t.cnfrm_by.length+t.rejct_by.length>=min_voted_users&&Number(t.cnfrm_at)+1e3*min_voted_time<=Number(new Date)&&(e.reduce(((e,t)=>e||t.yes_by.length+t.no_by.length>=min_voted_on_report&&t.yes_by.length/(t.yes_by.length+t.no_by.length)>=voted_positive_percent),0==e.length)||e.reduce(((e,t)=>e&&t.yes_by.length+t.no_by.length>=min_voted_on_report),!0))?document.getElementById("created_tokens").innerHTML+=`\n        <div class="card token">\n          ${t.image}\n          <div class="card-body state_type_${statuses_d[t.state]}">\n            <p class="card-text">Haiku #${t.id} written by you</p>\n            <div class="d-flex justify-content-between align-items-center">\n              <button type="button" id="update_button-${t.id}" class="btn btn-sm btn-outline-secondary verify_button">VERIFY</button>\n            </div>\n            <p class="buy_note" id="note_result-${t.id}">${user_addr?"":"Please, connect your wallet to vote for haikus"}</p>\n          </div>\n        </div>`:document.getElementById("created_tokens").innerHTML+=`\n        <div class="card token" onclick="info_open(${t.id})">\n          ${t.image}\n          <div class="card-body state_type_${statuses_d[t.state]}">\n            <p class="card-text">Haiku #${t.id} written by you</p>\n            <b class="card-text">${n!==1/0?`Price starts from <a style="font-family:monospace;">${n/1e6}tz</a>`:"Not for sale :("}</b>\n            <p></p>\n            <div class="d-flex justify-content-between align-items-center">\n              <button type="button" id="buy_button-${t.id}" class="btn btn-sm btn-outline-secondary buy_button">More</button>\n              <small class="text-muted">${t.cnfrm_at.toGMTString().split(", ")[1].slice(0,-7)}</small>\n            </div>\n          </div>\n        </div>`}0==e.length&&(document.getElementById("nothing_crt").innerHTML='<h3 class="fw-light center">Nothing here :(</h3>');const t=data.owners.reduce(((e,t)=>(t.owner==user_addr&&e.push(t.token_id),e)),[]),n=data.tokens.filter((e=>t.includes(e.id))).filter((e=>e.state<=1)).sort(((e,t)=>t.cnfrm_at-e.cnfrm_at));for(const e of n){const t=data.owners.filter((t=>t.token_id==e.id)).reduce(((e,t)=>e>t.price&&t.for_sale>0?t.price:e),1/0);document.getElementById("owned_tokens").innerHTML+=`<div class="card token" onclick="sell_open(${e.id})">\n      ${e.image}\n      <div class="card-body">\n        <p class="card-text">Haiku #${e.id} written by ${e.creator==user_addr?"you":`<a style="font-family:monospace; font-size: initial;">${e.creator}</a>`}</p>\n        <b class="card-text">${t!==1/0?`Price starts from <a style="font-family:monospace;">${t/1e6}tz</a>`:"Not for sale :("}</b>\n        <p></p>\n        <div class="d-flex justify-content-between align-items-center">\n          <button type="button" id="buy_button-${e.id}" class="btn btn-sm btn-outline-secondary buy_button">More</button>\n          <small class="text-muted">${e.cnfrm_at.toGMTString().split(", ")[1].slice(0,-7)}</small>\n        </div>\n      </div>\n    </div>`}0==n.length&&(document.getElementById("nothing_own").innerHTML='<h3 class="fw-light center">Nothing here :(</h3>')};info_open=e=>{const t=data.tokens[e];document.getElementById("token_popup").innerHTML=`<section id="popup_overlay" class="overlay__">\n    <div class="container__">\n      <h1 class="fw-light buy_header">Info Haiku #${t.id}</h1>\n      <div class="card token buy_image">\n        ${t.image}\n      </div>\n      <div class="buy_body">\n        <div class="card buy_card">Creator: you</div>\n        <div class="card buy_card">Created at: ${t.crted_at.toGMTString().split(", ")[1]}</div>\n        <div class="card buy_card">Status: ${statuses[t.state]}</div>\n        <div class="card buy_card">Total supply: ${t.amount}</div>\n        ${user_addr?`<div class="card buy_card">You own: ${data.owners.filter((e=>e.owner==user_addr&&e.token_id==t.id)).reduce(((e,t)=>e+t.count),0)}</div>`:""}\n        <div class="btn-group buy_btn_group" role="group">\n          <button type="button" onclick="token_close()" class="btn btn_secondary buy_cfrm_button">CLOSE</button>\n        </div>\n      </div>\n    </div>\n  </section>`},sell_open=e=>{const t=data.tokens[e],n=data.owners.filter((t=>t.owner==user_addr&&t.token_id==e)),a=n.reduce(((e,t)=>e+t.count),0),o=n.reduce(((e,t)=>e+t.for_sale),0),r=n.reduce(((e,t)=>e+t.price),0)/n.length/1e6;document.getElementById("token_popup").innerHTML=`<section id="popup_overlay" class="overlay__">\n    <div class="container__">\n      <h1 class="fw-light buy_header">Update price Haiku #${t.id}</h1>\n      <div class="card token buy_image">\n        ${t.image}\n      </div>\n      <div class="buy_body">\n        <div class="card buy_card">Creator: ${t.creator==user_addr?"you":`<a class="alien" href="${alien_link}?address=${t.creator}" target="_blank">${t.creator.slice(0,7)}...${t.creator.slice(-7)}</a>`}</div>\n        <div class="card buy_card">Created at: ${t.crted_at.toGMTString().split(", ")[1]}</div>\n        <div class="card buy_card">Total supply: ${t.amount}</div>\n        ${user_addr?`<div class="card buy_card">You own: ${a}</div>`:""}\n        <div class="buy_inputs">\n          <label for="sell_amount" class="buy_label">Choose how many items you want to sell</label>\n          <input type="range" class="form_range" min="0" max="${a}" value="${o}" step="1" id="sell_amount">\n          <label for="sell_price" class="buy_label">Choose price for these items</label>\n          <input type="number" class="form_number" min="0" value="${r}" step="0.1" id="sell_price">\n        </div>\n        <div class="card buy_card" id="sell_samt">Selected amount to sell: ${o}</div>\n        <div class="card buy_card" id="sell_cost">Selected price: ${r}tz</div>\n        <div class="btn-group buy_btn_group" role="group">\n          <button type="button" onclick="token_close()" class="btn btn_secondary buy_cfrm_button">CANCEL</button>\n          <button type="button" id="sell_cfrm-${t.id}" class="btn btn_primary buy_cfrm_button">UPDATE PRICE</button>\n        </div>\n        <p class="buy_note" id="note_result"></p>\n      </div>\n    </div>\n  </section>`},new_haiku_open=()=>{storage_loaded&&(document.getElementById("token_popup").innerHTML=`<section id="popup_overlay" class="overlay__">\n      <div class="container__">\n        <h1 class="fw-light buy_header">New Haiku Preview</h1>\n        <div class="card token buy_image">\n          <svg class="" width="338px" height="225px" role="img"\n            aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">\n            <title>Placeholder</title>\n            <rect width="100%" height="100%" fill="rgb(0,0,0)" rx="0.25rem" ry="0.25rem" id="canvas"></rect>\n            <text y="20%" fill="rgb(255,255,255)" font-size="1.2em" id="image_text"></text>\n          </svg>\n        </div>\n        <div class="buy_body">\n          <div class="buy_inputs">\n            <label for="mint_c" class="buy_label">Choose colors of background and text</label>\n            <div class="card buy_card">Backgroung: <input type="color" class="form_color" value="#000000" id="mint_c_b">  Text: <input type="color" class="form_color right_empty" value="#ffffff" id="mint_c_t"></div>\n            <label for="mint_amount" class="buy_label">Choose how many items of haiku you want to mint</label>\n            <input type="number" class="form_number" min="1" max="${max_mint_amount}" value="7" step="1" id="mint_amount">\n            <label for="mint_cont" class="buy_label">Provide yours haiku text below</label>\n            <textarea type="text" class="form_haiku_text" id="mint_cont"></textarea>\n          </div>\n          <div class="card buy_card" id="mint_samt">Selected amount to mint: 7</div>\n          <div class="btn-group buy_btn_group" role="group">\n            <button type="button" onclick="token_close()" class="btn btn_secondary buy_cfrm_button">CANCEL</button>\n            ${user_addr?'<button type="button" id="publish" class="btn btn_primary buy_cfrm_button">ORIGINATE</button>':'<button type="button" id="publish" class="btn btn_primary buy_cfrm_button" disabled>ORIGINATE</button>'}\n            </div>\n            <p class="buy_note" id="note_result">${user_addr?"":"Please, reload the page and connect your wallet to create haikus"}</p>\n          </div>\n          <p class="buy_note" id="note_result"></p>\n        </div>\n      </div>\n    </section>`)},token_close=()=>{document.getElementById("token_popup").innerHTML=""};document.addEventListener("DOMContentLoaded",(()=>{alien_link=new URL(document.getElementById("alien_link").href).pathname,dom_loaded=!0,d()})),document.addEventListener("click",(e=>{"popup_overlay"==e.target.id&&token_close(),"new_haiku_big_button"!=e.target.id&&"new_haiku_button"!=e.target.id||new_haiku_open(),"publish"==e.target.id&&(async e=>{document.getElementById("publish").disabled=!0,document.getElementById("note_result").innerHTML="Please, confirm transaction in your wallet",contract=contract||await r.wallet.at(contract_addr);try{await contract.methods.token_mint_complex(document.getElementById("mint_cont").value.slice(0,max_mint_length)||" ",Number(document.getElementById("mint_amount").value),0,0,"en",parseInt(document.getElementById("mint_c_b").value.slice(1),16),parseInt(document.getElementById("mint_c_t").value.slice(1),16)).send(),document.getElementById("note_result").innerHTML="Your request is in work. Wait some and update page to view changes."}catch(e){"Aborted"==e.title?(document.getElementById("note_result").innerHTML="Please, try again and confirm transaction in your wallet",document.getElementById("publish").disabled=!1):document.getElementById("note_result").innerHTML="Something went wrong, please update page and try again",console.log("The contract call failed and the following error was returned:",e)}})();const t=e.target.id.split("-");"sell_cfrm"==t[0]&&(async e=>{document.getElementById(`sell_cfrm-${e}`).disabled=!0,document.getElementById("note_result").innerHTML="Please, confirm transaction in your wallet",contract=contract||await r.wallet.at(contract_addr);try{await contract.methods.token_update_price(Number(e),Number(document.getElementById("sell_amount").value),Math.ceil(1e6*Number(document.getElementById("sell_price").value))).send(),document.getElementById("note_result").innerHTML="Your request is in work. Wait some and update page to view changes."}catch(t){"Aborted"==t.title?(document.getElementById("note_result").innerHTML="Please, try again and confirm transaction in your wallet",document.getElementById(`sell_cfrm-${e}`).disabled=!1):document.getElementById("note_result").innerHTML="Something went wrong, please try again later",console.log("The contract call failed and the following error was returned:",t)}})(t[1]),"update_button"==t[0]&&(e.stopPropagation(),(async(e,t)=>{document.getElementById(`update_button-${e}`).disabled=!0,document.getElementById(`note_result-${e}`).innerHTML="Please, confirm transaction in your wallet",contract=contract||await r.wallet.at(contract_addr);try{await contract.methods.token_update_state(Number(e)).send(),document.getElementById(`note_result-${e}`).innerHTML="Your request is in work. Wait some and update page to view changes."}catch(t){"Aborted"==t.title?(document.getElementById(`note_result-${e}`).innerHTML="Please, try again and confirm transaction in your wallet",document.getElementById(`update_button-${e}`).disabled=!1):document.getElementById(`note_result-${e}`).innerHTML="Something went wrong, please update page and try again",console.log("The contract call failed and the following error was returned:",t)}})(t[1]))})),document.addEventListener("input",(e=>{"sell_amount"==e.target.id&&(document.getElementById("sell_samt").innerHTML=`Selected amount to sell: ${e.target.value}`),"sell_price"==e.target.id&&(e.target.value<0&&(e.target.value=0),document.getElementById("sell_cost").innerHTML=`Selected price: ${e.target.value}tz`),"mint_amount"==e.target.id&&(e.target.value>max_mint_amount&&(e.target.value=max_mint_amount),e.target.value<1&&(e.target.value=1),document.getElementById("mint_samt").innerHTML=`Selected amount to mint: ${e.target.value}`),"mint_c_b"==e.target.id&&(document.getElementById("canvas").style.fill=e.target.value),"mint_c_t"==e.target.id&&(document.getElementById("image_text").style.fill=e.target.value),"mint_cont"==e.target.id&&(document.getElementById("image_text").innerHTML=e.target.value.slice(0,max_mint_length).split("\n").reduce(((e,t)=>e+`<tspan x="10%" dy="1.6em">${t}</tspan>`),""))}))},{"@taquito/taquito":"5iUTv","@taquito/beacon-wallet":"bh16y","@airgap/beacon-sdk":"d9VoF"}]},["8cjBZ"],"8cjBZ");
//# sourceMappingURL=account.bda3d124.js.map
