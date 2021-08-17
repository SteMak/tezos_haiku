# WHITEPAPER
## Abstract
Tezos Haiku is an NFT marketplace, where NFT tokens are haiku, a known Japanese type of poetry. Here users can create tokens, participate in verification and make collections.

Key differences from existing NFT projects:
- Token data completely stores in blockchain (no ipfs or other third party storages used)
- Community censure all tokens for plagiarism, mistakes, "bad" content
- Everyone has access to minting tokens - As the token is artwork itself, minting token transaction is an evidence of creation haiku by user and proves his copyright
- As the token is artwork itself, owning it gives you permission in terms of [CC BY-ND](https://creativecommons.org/licenses/by-nd/2.0) license

## Introduction
We live in a mad NFT world, thousands of artworks already became digital and are sold on different NFT marketplaces. But there are some limitations in these projects, so I decided to make my own NFT marketplace that censure plagiarism, deals with copyright and stores the artwork completely in blockchain.

### Ownership
- Creator preserves all rights except burning (no one can do this) on his artwork
- Owner have rights in terms of [CC BY-ND](https://creativecommons.org/licenses/by-nd/2.0) license while he owns the token
- Anyone doesn't have any rights on tokens that he doesn't own.

### Provenance and Historical Audit
Blockchains track and monitor all transactions after their first block to the current block, along with any other transfer and/or exchange history of an NFT asset. Blockchains do this with unparalleled data encryption. It ensures a strong tracking of ownership and a complete history of NFT asset purchases. There is no mystery as to the origin or history of the NFT, because everything is registered and completely transparent.

### Transferability
As soon as NFT was placed on sell, it could be bought by any user of the blockchain for the selected price. Exchanging, selling, buying tokens also could be done by any marketplaces using smart contract straight.

## Problematic
### Is the created token an artwork?
In most of the NFT marketplaces the artwork isn't pushed to blockchain, so they exist separately: token just have a link to artwork, not the artwork itself.

In my realization, token is like a box, or better, frame for the art work. I choose haiku as theme for all NFTs in my project, so I have no problems to push it fully to blockchain. In such way, NFT of my project became as real as postmarks or limitated book edition. In such way we can sell/buy NFTs in terms of license ([CC BY-ND](https://creativecommons.org/licenses/by-nd/2.0) I chose).

### Problem of plagiarism and unacceptable content
In most of the NFT projects that I know, there are "moderators of content" or even nothing to solve the problem.

But in my project, I decided to use community in order to check new artworks for plagiarism and unacceptable content. Simple voting for/against the haiku and a possibility to send a report attaching name of real author and prove link.

There are 3 scenarios to solve the problem:
- Artwork has unacceptable content - community vote against and token destroys
- Artwork has plagiarism of already published haiku in my project - "Possible plagiarism" title appears with a link to original, then community vote against and token destroys
- Artwork has plagiarism of haiku that wasn't published in my project - someone sends a report and community vote for the report, then token destroys

Also, there should be 70% voted for new haiku or report to accept it. Such voting side difference is explained by two facts:

- Firstly, I think, if 30% of voted users dislike the haiku or thinks that it is plagiarism, we should listen to them. And all in all, I hate idea of 50% pleased and 50% aggrieved, because in such way in average people not pleased or aggrieved. In concept of 70% pleased 30% aggrieved, in average all participants became pleased on 40%.

- Secondly, if someone would try to originate bad haiku or report, he will spend a lot of money to accept it.

So in such way, publishing haiku to my project becomes an evidence of creation of this haiku by the user.

Note: if plagiarism or bad haiku still was accepted by community, it means that community evolves: change the rules of writing haiku and allows old artworks to be reborn in blockchain.

## Conclusion
So in such way we have several good sides:
- NFT token IS artwork itself
- Copyright is protected
- People are judged by community without any moderators
- Plagiarism is unacceptable
- Buying a token you get more than just a record in the storage (permissions according to [CC BY-ND](https://creativecommons.org/licenses/by-nd/2.0) license)
