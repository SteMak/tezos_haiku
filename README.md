# Tezos Haiku
NFT-haiku marketplace with verification of copyright using DAO.

[Demo on YouTube](https://www.youtube.com/watch?v=kIpb1D33YcE)

[WHITEPAPER](https://github.com/SteMak/tezos_haiku/blob/master/WHITEPAPER.md)

## General idea
### "The best material model of a cat is another, or preferably the same, cat." (Norbert Wiener)
In our mad NFT world, most of projects implements NFT as images, so they store image hash in blockchain or something like that. So, tokens that they mint are linked to images by a thin rope: there are Infinity other images that give us the same hash (from Pigeonhole principle).

So I decided to store artwork in blockchain fully. And my choice fell on haiku: it is short, it is easy to display, and it is easy to verify. In such way I put the artwork completely in blockchain. And minted tokens in my project aren't linked to haiku by thin rope. THESE TOKENS ARE REAL ARTWORKS! I have not seen projects that do in such way, so this is my uniqueness.

### "Write in blockchain - write in history"
Problem of violating copyright was actual many years ago and is actual now. It is not a secret that blockchain can solve it, but there are some questions that should be resolved:

- "What should we do, if someone copied existing artwork?"

Just hard voting of community: there would be the most similar haiku on the verification page. So people will vote if the new haiku good, or it is just a plagiarism.

- "What should we do with artworks of the past?"

My decision - left them in bounds of old system. I ask my users to send a report if someone's haiku is found on the internet, then users vote if this report is correct.

Also, there should be 70% voted for new haiku or report to accept it. Such voting side difference is explained by two facts:

- Firstly, I think, if 30% of voted users dislike the haiku or thinks that it is plagiarism, we should listen to them. And all in all, I hate idea of 50% pleased and 50% aggrieved, because in such way in average people not pleased or aggrieved. In concept of 70% pleased 30% aggrieved, in average all participants became pleased on 40%.

- Secondly, if someone would try to originate bad haiku or report, he will spend a lot of money to accept it.

So in such way, publishing haiku to my project becomes an evidence of creation of this haiku by the user.

Note: if plagiarism or bad haiku still was accepted by community, it means that community evolves: change the rules of writing haiku and allows old artworks to be reborn in blockchain.

### "What do we sell, when we sell NFT?"
In most of the projects when we buy an NFT, we buy nothing. The fact of ownership is just a record in a storage, and it doesn't give us any permissions.

In my project I'm going to sell NFT as a real artwork in terms of [CC BY-ND](https://creativecommons.org/licenses/by-nd/2.0) license. Such improvement makes my NFT tokens much more real. For example, you can buy haiku here and organize an exhibition in your town. Or publish collection of modern haiku... Even use them in advertisement!

I'm sure that NFT shouldn't be just a sound or a record. It should be licensed artwork, and this is the future!

## For users
Who could be interested in this project?
- Authors
  - Create and sell: create and sell your haiku on our site in few clicks!
  - Your copyright is protected: community censure plagiarism, so nobody could reauthor your haiku.
  - Become a history: your haiku are stored in blockchain so, whatever happened, they won't be deleted or changed. 
  - Confirm that you are the author: record in the blockchain proves that exactly you and no one else is the real author of published haiku.

- Collectors
  - Collect and resell: collect haiku, watch them in your account and resell raising money.
  - Participate in verification: vote for haiku on verification in order to make a gallery full of new unique haiku!

- Publishers
  - Publish a collection of modern haiku: buying a haiku gives you a right to publish the haiku according to [CC BY-ND](https://creativecommons.org/licenses/by-nd/2.0) license.

There are 3 pages on the site:
- [Gallery](https://stemak.github.io/tezos_haiku/index.html): here you can read all haiku published in the blockchain. Press "More" button to see a popup window with some info and "Buy" button (if this haiku is on sale).
- [Verification](https://stemak.github.io/tezos_haiku/verification.html): here you can vote for/against haiku or report about violation of copyright. When enough users voted and time has passed, "Verify" button will appear, and the haiku will be ready to publish to the gallery.
- [Account](https://stemak.github.io/tezos_haiku/account.html): here you can see list of your created and owned haiku. Clicking on haiku opens an info popup window, in it, you can put up for sale owned haiku.

Also, you can look at another's account by link https://stemak.github.io/tezos_haiku/alien_account.html?address=ACCOUNT_ADDRESS

## For developers
This repository contains folders with 
- `contract` written on [archetype](https://archetype-lang.org) for [tezos](https://tezos.com)
- `site` written on vanilla-js using [parcel](https://parceljs.org) to import npm modules.

The main goal of the contract is providing useful entrypoints for the site. In other words, contract should implement ALL features of the idea and any user shouldn't have a possibility to get benefits by calling the contract straight.

The site, for its part, should protect users from interacting with blockchain and implement the same features in beautiful design.

### Developing contract
Download dependencies
```sh
yarn
```
Change `contract/contract.arl` as you need and then call
```sh
yarn deploy
```
Please, don't forget about [NFT-standart](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

### Developing site
Download dependencies
```sh
yarn
```
All sources are in `site/src/`. In order to connect to custom contract change following strings in `site/src/js/united.js`
```js
const rpc_addr = "YOUR_RPC_ADDRESS"
const network = "YOUR_NETWORK"
const contract_addr = "CONTRACT_ADDRESS"
```

In order to run site locally run
```sh
yarn dev
```
If you want to deploy site to github pages, configure your `site/package.json` and call
```sh
yarn deploy
```
