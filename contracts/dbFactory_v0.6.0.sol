pragma solidity ^0.4.24;



import "./dbCampaignContract.sol";



///@title Dreambridge.io Factory.

///@author Arq

///@notice The Factory creates Dremabridge Crowdfunding Campaigns and stores the Campaign's it has launched.

///@dev This Contract spawns other Contracts.

contract Factory_ver {



    address arbiter;

    address paymentAddress;

    uint _platformFee;



    struct CampaignDetails {

      address ownerAddress;

      address campaignAddress;

      uint campaignGoal;

      uint campaignDuration;

      uint rewardPoolPercent;

    }



    CampaignDetails[] public platformCampaigns;

    mapping (address => uint) public ownerCampaignCount;

    mapping (address => uint) public campaignIdentifier;

    mapping (address => uint) public lastRequestSender;

    mapping (address => bool) public autopayment;



    event campaignLaunched(address indexed _owner, address _newCampaign, string _emails);

    event DonationMade(address indexed _campaign, address indexed _owner, address indexed _donor, uint _amount, string _email, string _donorEmail);

    event AdditionalPayoutNeeded(address indexed _campaign, uint _donorIndex, uint _totalDonors);

    event CampaignFinished(address indexed _campaign, address indexed _owner, uint _payoutAmount, uint _numberOfDonors, string _email);



    /**@dev requestLimited modifier is used to ensure no sender can call any function more than once per a 2 minute period.

    *A counter may be added so it's more of a "you may not make more than x transactions per y time"

    */

    modifier requestLimited(address _requestor) {

        require(lastRequestSender[_requestor] < (now - 2 minutes), 'you may only request a new campaign once every 5 minutes. please try again later.') ;

        _;

    }



    ///@author Arq

    ///@dev it's a constructor function. sets the arbiter and payment contract of the factory contract.

    constructor(address _pAdd) public {

        arbiter = msg.sender;

        paymentAddress = _pAdd;

    }

    ///@author Arq

    ///@notice A function that emits an event when a Donation is made.

    ///@dev Used to send notifications to Campaign Owners, function is called from individual Campaign Contracts.

    ///@param _campaign - The Address of the Campaign calling the emitter.

    ///@param _owner - The Owner of the Contract calling the event.

    ///@param _donor - The Address that made the donation.

    ///@param _value - the Amount of the Donation.

    ///@param _email - The Email Address of the Campaign Owner.

    ///@param _donorEmail - The Email Address provided by the Supporter.

    function donationEmitter(address _campaign, address _owner, address _donor, uint _value, string _email, string _donorEmail) public {

        emit DonationMade(_campaign, _owner, _donor, _value, _email, _donorEmail);

    }

    ///@author Arq

    ///@notice A Function that emits whether or not an additional payout function must be run for a given Campaign.

    ///@dev Due to gas limits, the payout function might need to be run multiple times, if so this event should fire.

    ///@param _campaign - The Campaign requiring additional payouts

    ///@param _donorIndex - The index of the Supporter Array that the function broke out of the loop on.

    ///@param _totalDonors - The number of Supporters, used to compare the _donorIndex to to see how many more Supporters still need to be paid.

    function additionalPayout(address _campaign, uint _donorIndex, uint _totalDonors) public {

        emit AdditionalPayoutNeeded(_campaign, _donorIndex, _totalDonors);

    }

    ///@author Arq

    ///@notice A function that's called by a Contract to tell the Factory that a Campaign has finished.

    ///@dev used to generate campaign finished events.

    ///@param _campaign - The Campaign that has finished.

    ///@param _owner - The Campaign Owner.

    ///@param _payoutAmount - The Amount the Campaign paid to the Owner.

    ///@param _numberOfDonors - The total number of supporters.

    ///@param _email - The Email Address of the Campaign Owner.

    function campaignFinishedEmitter(address _campaign, address _owner, uint _payoutAmount, uint _numberOfDonors, string _email) public{

        emit CampaignFinished(_campaign, _owner, _payoutAmount, _numberOfDonors, _email);

    }



    ///@author Arq

    ///@dev searches the Factory's campaigns for a given Address' present and past campaigns.

    ///@param _owner - The Address of the owner whose campaigns are being fetched.

    ///@return an array that has the campaigns that _owner controls.

   function getOwnerCampaigns(address _owner) public view returns(address[]) {

       address[] memory ownedCampaigns = new address[](ownerCampaignCount[_owner]);

     uint counter = 0;

       for(uint i = 0; i < platformCampaigns.length; i++) {

         if(platformCampaigns[i].ownerAddress == _owner) {

           address campaign = platformCampaigns[i].campaignAddress;

          ownedCampaigns[counter] = campaign;

          counter++;

        }

       }

    return ownedCampaigns;

  }



  ///@author Arq

  ///@notice Checks to see if a given Campaign is a Dreambridge Contract Address (from this Factory)

  ///@dev Used to restrict Campaign Payment Addresses from being Dreambridge Contracts.

  ///@param _address - The payment Address that's being checked.

  ///@return True if _address is a Dreambridge Campaign.

    function addressIsCampaign(address _address) public view returns (bool) {

        bool isCampaign = false;

        for (uint i=0; i < platformCampaigns.length; i++) {

            if (platformCampaigns[i].campaignAddress == _address) {

                isCampaign = true;

            }

        }

        return isCampaign;

    }



    ///@author Arq

    ///@notice Checks a given address for an active Campaign.

    ///@dev only one Campaign per owner can be active at a time.

    ///@param _owner - An Address that the Factory uses to check for an Active Campaign.

    ///@return The Address of an Active Campaign.

    function getOwnerActiveCampaign (address _owner) public view returns(address){

        for (uint i=0; i < platformCampaigns.length; i++) {

            if(platformCampaigns[i].ownerAddress == _owner && checkActive(platformCampaigns[i].campaignAddress)){

                return platformCampaigns[i].campaignAddress;

            }

        }

    }

    ///@author Arq

    ///@notice Checks to see if a Given Campaign Address is in Payment Ready Status.

    ///@dev Used to help initiate the automatic payment of Campaigns.

    ///@param _campaign - The Address of the Campaign.

    ///@return whether the detected Campaign at _campaign is in a payment ready status.

    function paymentReady(address _campaign) public view returns(bool){

        dreambridgeCampaign_ver d = dreambridgeCampaign_ver(_campaign);

        return d.campaignPaymentReady();

    }



    ///@author Arq

    ///@notice used to determine the number of Campaigns in the Factory that are in Payment Ready Status.

    ///@return The number of Payment Ready Campaigns.

    function paymentReadyCount() public view returns (uint) {

        uint counter = 0;

        for(uint i = 0; i < platformCampaigns.length; i++){

            if(paymentReady(platformCampaigns[i].campaignAddress) == true && autopayment[platformCampaigns[i].campaignAddress] == true) {

                counter++;

            }

        }

        return counter;

    }



    ///@author Arq

    ///@notice Fetches an array of Campaigns that are in Payment Ready Status.

    ///@dev used as part of the Automatic Payment Contract.

    ///@return an Array of Payment Ready Addresses.

    function paymentReadyCampaigns() public view returns (address[]){

        require(paymentReadyCount() > 0);

        uint arrayCount = 0;

        address[] memory readyCampaigns = new address[](paymentReadyCount());

        uint i = 0;

        while (i < platformCampaigns.length && gasleft() > 100000){

            if (paymentReady(platformCampaigns[i].campaignAddress) == true && autopayment[platformCampaigns[i].campaignAddress] == true) {

                readyCampaigns[arrayCount] = platformCampaigns[i].campaignAddress;

                i++;

                arrayCount++;

            } else { i++;}

        }

        return readyCampaigns;

    }



    ///@author Arq

    ///@notice Returns the number of active Campaigns in the Factory.

    ///@dev "Active" is defined as "open" in this instance.

    ///@return A Count of Active/Open Campaigns.

    function getActiveCampaignCount() public view returns(uint){

        uint activecount = 0;

        for(uint i = 0; i<platformCampaigns.length;i++){

            dreambridgeCampaign_ver dbr = dreambridgeCampaign_ver(platformCampaigns[i].campaignAddress);

            if(checkActive(address(dbr)) == true && (dbr.campaignStatus() == dreambridgeCampaign_ver.CampaignState.open)){

                activecount++;

            }

        }

        return activecount;

    }



    ///@author Arq

    ///@notice Fetches the Active Campaigns on the Factory.

    ///@dev Used to help display data on the platform.

    ///@return an Array of Active Campaign Addresses.

    function getActiveCampaigns() public view returns (address[]){

        uint arrayCount = 0;

        address[] memory activeCampaigns = new address[](getActiveCampaignCount());

        for(uint ia = 0; ia < platformCampaigns.length ; ia++){

            dreambridgeCampaign_ver dbr = dreambridgeCampaign_ver(platformCampaigns[ia].campaignAddress);

            if (dbr.campaignStatus() == dreambridgeCampaign_ver.CampaignState.open) {

                activeCampaigns[arrayCount] = platformCampaigns[ia].campaignAddress;

                arrayCount++;

            } else { }

        }

        return activeCampaigns;

    }



    ///@author Arq

    ///@dev in an effort to control the traffic on the network, this helps check the number of active campaigns. meant to deter the spamming of campaign creation.

    ///@param _owner is the requested ownerAddress of a new campaign.

    ///@return the number of active campaigns a given address has

    function checkActiveCampaignCount(address _owner) public view returns (uint) {

      uint activeCampaignCount = 0;

      for (uint i = 0; i < platformCampaigns.length; i++) {

        if(platformCampaigns[i].ownerAddress == _owner) {

          address foundAddress = platformCampaigns[i].campaignAddress;

          if (checkActive(foundAddress) == true) {

              activeCampaignCount++;

          }

        }

      }

      return activeCampaignCount;

    }

    ///@author Arq

    ///@notice Checks a given campaign to see if it's open or not.

    ///@dev used as part of the checkActiveCampaignCount function to determine if an Owner's Campaign is active.

    ///@param _campaign - The Address of the Campaign that's being checked.

    ///@return True if the Campaign is not Finished.

    function checkActive(address _campaign) public view returns (bool) {

        dreambridgeCampaign_ver d = dreambridgeCampaign_ver(_campaign);

        return d.campaignOpen();

    }



    ///@author Arq

    ///@notice checks to see how many contracts are in the Factory Contract.

    ///@return The Number of Campaigns stored in this Factory.

    function getContractCount() public view returns(uint) {

        return platformCampaigns.length;

    }



    ///@author Arq

    ///@notice Checks to see how many campaigns a given Suppoerter has donated to.

    ///@param _donor - The Supporter Address that's being used to count donations.

    ///@return The Number of Campaigns _donor has Supported.

    function getDonationCount(address _donor) internal view returns (uint){

        uint donationCount = 0;

        for (uint i = 0; i < platformCampaigns.length ; i++){

            dreambridgeCampaign_ver d = dreambridgeCampaign_ver(platformCampaigns[i].campaignAddress);

            if(d.amountDonated(_donor) > 0){

                donationCount++;

            }



        }

        return donationCount;

    }



    ///@author Arq

    ///@notice Fetches the donations a given Supporter (_donor) has made.

    ///@dev Used to fetch an array of addresses and donation amounts.

    ///@param _donor - The Supporter Address fetching donations.

    ///@return An Array of Donation Amounts and Campaign Addresses.

    function getDonations(address _donor) public view returns (uint[], address[]) {

        uint donationCount = getDonationCount(_donor);

        uint memindex = 0;

        uint[] memory donations = new uint[](donationCount);

        address[] memory campaigns = new address[](donationCount);

        for(uint i = 0; i < platformCampaigns.length;i++){

            dreambridgeCampaign_ver db = dreambridgeCampaign_ver(platformCampaigns[i].campaignAddress);

            if(db.amountDonated(_donor) > 0){

                donations[memindex] = db.amountDonated(_donor);

                campaigns[memindex] = platformCampaigns[i].campaignAddress;

                memindex++;

            }

        }

        return (donations, campaigns);

    }





    ///@author Arq

    ///@notice The Function that Deploys new Dreambridge Contracts.

    ///@dev Cannot be called more than once every 2 minutes by any given msg.sender

    ///@param _owner the address of the owner of this campaign, does not need to be msg.sender

    ///@param _name the name of the campaign

    ///@param _goal The Funding Goal of the Campaign.

    ///@param _duration the duration of the campaign. input should be in days as the function will execute a  * 1 days calculation.

    ///@param _rewardPool this is the percentage that the creator wants to set as the rewardpool. Input should represent a whole number percentage i.e. 25% = 25 not 0.25 (this is important).

    ///@param _auto Whether the owner has selected Automatic Payments or not.

    ///@param _email The Email Address of a Campaign Owner. Can be left blank if the Owner Wants, but will disable notifications and Additional Rewards.

    ///@return the address of the newly created contract.

    function deployNewContract(address _owner, string _name, uint _goal, uint _duration, uint _rewardPool, bool _auto, string _email) public requestLimited(msg.sender) returns(address newContract) {

      require(lastRequestSender[_owner] < (now - 2 minutes), 'You may only request a new campaign once every 2 minutes. please try again later.');

      require(checkActiveCampaignCount(_owner) < 1, 'You may only have one Active Campaign at a time. please try again after your campaign has ended.');

      lastRequestSender[msg.sender] = now;

      require(_owner != address(this) && addressIsCampaign(_owner) == false, 'You may not create a campaign with this address');

      _platformFee = 5;

      dreambridgeCampaign_ver c = new dreambridgeCampaign_ver(_owner, _name, arbiter, _goal, _duration, _rewardPool, _platformFee, address(this), _auto, _email, paymentAddress);

      platformCampaigns.push(CampaignDetails(_owner, c, _goal, _duration, _rewardPool)) - 1;

      campaignIdentifier[c] = platformCampaigns.length - 1;

      ownerCampaignCount[_owner]++;

      autopayment[c] = _auto;

      emit campaignLaunched(_owner, address(c), _email);

      return c;

  }





}
