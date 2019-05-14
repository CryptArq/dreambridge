# Dreambridge Smart Contract ReadMe #

### Introduction ###
Hey,  
The Contracts Contained in this section were tested tirelessly in a test environment and used live on a very limited basis. 
Mind you, they worked, but as with anything technology related they could stand to be tested further. 
These Smart Contracts were developed to be used with Solidity 0.4.24, there have been releases since then so some of the functions could be optimized for the new releases (probably).

I take no responsibility for anything that goes wrong with you (or anyone else) misusing these contracts. Make sure you understand what they do before you put any live capital into them. Having designed them I know how they work and what they do but you might not so I'd urge doing *your own testing on these*.

### Description of Files ###
**dbFactory_v0.6.0.sol**  
**Title:**  Dreambridge.io Factory  
**Author:** Arq  
**Description:** The Dreambridge Factory contract. This contract deploys child contracts called Campaigns. The Campaigns are crowdfunding campaigns designed to accept and payout ether under specific circumstances.  Additionally, the Factory Contract stores what's called an Arbiter which has control over the Factory as well as a Payment Address for any Service Fees Collected by the child campaigns.  **The Arbiter Address has very limited power over Campaigns and can only interfere under very specific circumstances to refund donations**.  
Other Info: This Contract is required in the current setup to deploy child contracts. It also consolidates all of the deployed contracts and stores their addresses to ensure certain duplication cannot occur (among other things).
  
**dbCampaign_v0.6.1.sol**  
**Title:** Dreambridge.io Crowdfunding Campaign.  
**Author:** Arq  
**Description:** The Dreambridge Crowdfund Campaign Contract handles donations as well as reward payments which were based on the amount of ether someone donated. Donations were time restricted and the power to refund a donation is put in the hands of the donor under specific circumstances. Everything should be notated in the contract.
**Other Info:** These campaigns in their current form require safemath.sol and must be deployed by using the factory contract. 

### Other Stuff? ###
Hopefully someone can use these, or at least finds them interesting. If you do give me a shoutout on Twitter @UserArq or something. I put about 6 months into conceptualizing and deploying this idea so it would be nice to see it put to use. 
  
Thanks,  
Arq.
