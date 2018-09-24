pragma solidity ^0.4.24;

import "./dbFactoryContract.sol";
import "./safeMath.sol";
///@title Dreambridge.io Crowdfunding Campaign.
///@author Arq
///@notice Dreambridge Campaigns must be launched through the Dreambridge.io Site to be included on the website.
///@dev This Contract has not been tested to run without the use of a Dreambridge Factory Contract.
contract dreambridgeCampaign_ver {
    using SafeMath for uint256;

    enum CampaignState {open, hold, paymentReady, finished, suspended, derelict}

    CampaignState public currentState;

    address campaignOwner;
    address campaignArbiter;
    address paymentAddress;
    address factoryAddress;
    Factory_ver f;

    uint precision18;
    uint precision36;

    uint payoutIndex;
    uint feePercent;

    bool interactionLock;
    bool autoPayout;
    string ownerEmail;

    //payout conditionals
    bool donorsPaid;
    bool platformPaid;
    bool beneficiaryPaid;

    struct campaignDetails {
      string campaignName;
      uint campaignDuration;
      uint campaignExpiry;
      uint campaignCreation;
      uint256 rewardPoolPercent;
      uint256 campaignGoal;
      uint amountRaised;
      uint RP;
      uint platformFee;
      uint beneficiaryReceived;
    }

    address[] donorArray;

    campaignDetails public CampaignDetails;

    mapping (address => uint) public amountDonated;
    mapping (address => bool) public donorPaid;
    mapping (address => uint) public donorID;
    mapping (address => uint) public lastRequestSender;
    mapping (address => string) donorEmails;

    modifier requestLimited(address _requestor) {
      require(lastRequestSender[_requestor] < (now - 2 minutes), 'you may only interact once every 2 minutes. please try again later.') ;
      _;
    }
    modifier onlyOwnerArbiter() {
      require(msg.sender == campaignOwner || msg.sender == campaignArbiter, 'this function may only be called by the campaign owner.');
      _;
    }
    modifier interactionsLocked(bool _condition) {
      require (interactionLock == _condition, 'this campaign has been locked while executing an essential function. please try again later.');
      _;
    }
    ///modifier that ensures the campaign is in the proper state for certain functions. allows the possibility for 2 acceptable states.
    modifier onlyState (CampaignState expectedState1) {
      require(expectedState1 == campaignStatus(), 'the campaign is not in the correct stage to execute the requested function.');
      _;
    }

    ///@author Arq
    ///@notice Constructor Function that defines the conditions of the Contract.
    ///@param _owner - The Campaign Owner Address. Used to determine where funds are sent and who controls the contract.
    ///@param _name - The Campaign's name.
    ///@param _arbiter - The Campaign's Arbiter Address, which allows a Dreambridge Wallet to access a payout function.
    ///@param _goal - The Campaign's Funding Goal.
    ///@param _duration - The Amount of time the Campaign will run
    ///@param _rewardPool - The Reward Pool represented as a percentage.
    ///@param _platformFee - The Platform service fees
    ///@param _factory - The factory contract that launched this Campaign.
    ///@param _autoPayout - Whether the Campaign Owner has specified automatic payments or not.
    ///@param _ownerEmail - The email address of the Owner.
    ///@param _paymentAddress - The address that the Campaign sends the Platform Fee to.
    ///@dev parameters must be passed from a Dreambridge Factory Contract.
    constructor (address _owner, string _name, address _arbiter, uint _goal, uint _duration, uint _rewardPool, uint _platformFee, address _factory, bool _autoPayout, string _ownerEmail, address _paymentAddress) public {
       campaignOwner = _owner;
       CampaignDetails.campaignName = _name;
       campaignArbiter = _arbiter;
       CampaignDetails.campaignCreation = now;
       CampaignDetails.campaignDuration = _duration;
       CampaignDetails.campaignExpiry = now + (_duration * 1 days);
       CampaignDetails.campaignGoal = _goal;
       CampaignDetails.rewardPoolPercent = _rewardPool;
       currentState = CampaignState.open;
       CampaignDetails.platformFee = 0;
       CampaignDetails.beneficiaryReceived = 0;
       precision18 = 10**18;
       precision36 = 10**36;
       donorsPaid = false;
       platformPaid = false;
       beneficiaryPaid = false;
       interactionLock = false;
       autoPayout = _autoPayout;
       feePercent = _platformFee;
       payoutIndex = 0;
       ownerEmail = _ownerEmail;
       factoryAddress = _factory;
       paymentAddress = _paymentAddress;
       f = Factory_ver(_factory);
    }

    ///@author Arq
    ///@notice The Fallback function that handles direct payments to the Campaign.
    ///@dev The fallback is requestLimited by sender meaning that donations can only be made once in the alloted time. Additionally, the fallback runs the acceptDonation() function passing a string "null" as the email address. This option was used because deploying the factory with 2 separate donation functions caused it to hit the gas limit.
    function () external payable requestLimited(msg.sender) interactionsLocked(false)  {
      acceptDonation(msg.sender, msg.value,"null");
    }

    ///@author Arq
    ///@notice The function that accepts donations to this Campaign.
    ///@param _from - The Address of the Supporter sending the donation.
    ///@param _value - The Amount of ether donated.
    ///@param _email - The email of the Supporter if applicable.
    ///@dev Requires the campaign to be Open and Interactions to be unlocked.
    function acceptDonation(address _from, uint _value, string _email) public payable onlyState(CampaignState.open) interactionsLocked(false) {
        require (msg.value > 100000000, 'The donation amount is too low, please increase the donation amount and try again.');
        if (amountDonated[_from] == 0) {
          donorArray.push(_from);
        }
        amountDonated[_from] +=  _value;
        lastRequestSender[_from] = now;
        if(keccak256(_email) != keccak256("null")){
            donorEmails[_from] = _email;
        }
        f.donationEmitter(address(this), campaignOwner, _from, _value, ownerEmail, _email);
    }

    ///@author arq
    ///@notice Checks the email address of a specified Donor, if applicable.
    ///@param _donor - The Address of the Supporter whose email we're searching for.
    ///@return Email Address of the Supporter (_donor)
    ///@dev Requires that the calling address be the Campaign Owner, Arbiter, or the Supporter themself.
    function getVerifiedDonorEmail(address _donor)  public view  returns(string){
        require(msg.sender == campaignOwner || msg.sender == campaignArbiter || msg.sender == _donor);
        return donorEmails[_donor];
    }

    ///@author Arq
    ///@notice Checks the Campaign's Owner
    ///@return Email Address of the Owner.
    ///@dev Requires the caller to be the Owner or Arbiter.
    function getOwnerEmail() onlyOwnerArbiter() public view returns(string){
        return ownerEmail;
    }

    ///@author Arq
    ///@notice Fetches the Supporters of the campaignName
    ///@return Array of Supporters.
    ///@dev Requires the caller to be the Owner or Arbiter.
    function getDonorArray() onlyOwnerArbiter() public view returns(address[]){
        return donorArray;
    }

    ///@author Arq
    ///@notice Retrieves information about the campaign.
    ///@return Campaign Owner, the Campaign Name, the Campaign's Funding Goal, either the Current or Final Balance (depending on the state), the Campaign's Duration, the Campaign's Reward Pool, the number of Supporters, the calculated Reward Pool if the campaign has ended, the amount of time the campaign has left, and the Campaign's Current Status.
    ///@dev Used as a snapshot of the Campaign.
    function campaignInformation () public view returns(address, string,
    uint,
    uint,
    uint,
    uint,
    uint,
    uint,
    uint,
    CampaignState) {
        if (campaignStatus() != CampaignState.finished) {
            return (campaignOwner, CampaignDetails.campaignName, CampaignDetails.campaignGoal, address(this).balance, CampaignDetails.campaignDuration, CampaignDetails.rewardPoolPercent, getNumberOfDonors(), 0, getTimeRemaining() , campaignStatus());
        } else {
            return (campaignOwner, CampaignDetails.campaignName, CampaignDetails.campaignGoal, CampaignDetails.amountRaised, CampaignDetails.campaignDuration, CampaignDetails.rewardPoolPercent, getNumberOfDonors(), CampaignDetails.RP, 0, campaignStatus());
        }
    }

    ///@author Arq
    ///@notice Wraps up and pays out the Campaign.
    ///@dev Pays out the Campaign to the Supporters, Owner, and Platform provided the Owner has made the call or the Arbiter has made the call with the autopayout variable set to true.
    function finishCampaign() external  onlyOwnerArbiter() interactionsLocked(false)  {
        if(address(this).balance > 0){
          if(campaignStatus() == CampaignState.paymentReady || campaignStatus() == CampaignState.derelict) {
            if(msg.sender == campaignArbiter && autoPayout == false && (campaignStatus() != CampaignState.derelict)) { ///If the Caller is the Arbiter and the campaign does not allow autopayouts and the campaign is not derelict, return. If the campaign is derelict Arbiter can payout the Campaign.
              return;
            } else {
            if(address(this).balance >= CampaignDetails.campaignGoal) {
              feePercent -= 2;
            }
            if (campaignStatus() == CampaignState.derelict) { //if the campaign is in a Derelict state, add 3% to the fee.
                feePercent += 3;
            }
            interactionLock = true; // lock interactions prior to executing the logic to avoid any interaction while calculating. Unlocks on success or failure.
            if (CampaignDetails.RP == 0) {  // if the reward pool has not been calculated, calculate it.
                logRewardPool();
            }
            payoutShare();
            payPlatform();
            endCampaign();
          }
        } else {
            return;
          }
        }  else {
            currentState = CampaignState.finished; // just end the campaign if it didn't raise anything.
        }
    }

    ///@author Arq
    ///@dev gets the amouont of time remaining in minutes
    ///@return the time remaining in minutes.
    function getTimeRemaining() public view returns (uint256) {
      uint timediv = 1 minutes; //needs to stay minutes
      if(campaignStatus() == CampaignState.hold) {
          if(address(this).balance >= CampaignDetails.campaignGoal){
              if(((CampaignDetails.campaignExpiry + (1 days))- now) > now){
                return 0;
              } else{
                return ((CampaignDetails.campaignExpiry + (1 days))- now) / timediv;
              }
            } else {
                if(((CampaignDetails.campaignExpiry + (3 days))- now) > now){
                return 0;
                } else{
                return ((CampaignDetails.campaignExpiry + (3 days))- now) / timediv;
                }
            }
        } else {
            if((CampaignDetails.campaignExpiry - now) > now){
                return 0;
            } else {
                return (CampaignDetails.campaignExpiry - now) / timediv;
            }
        }
    }

    ///@author Arq
    ///@notice Function used to determine the current state of the Campaign
    ///@dev statically set Campaign states of Suspended and Finished override the logic.
    ///@return the state of the Campaign.\
    function campaignStatus() public view returns (CampaignState) {
        uint time = now;
        if(currentState == CampaignState.suspended) {//if the campaign has been statically set to suspended, return suspended.
            return CampaignState.suspended;
        } else if (currentState == CampaignState.finished) {//if the campaign has been statically set to finished, return finished.
            return CampaignState.finished;
        } else { // if the currentState is set to something other than 'suspended' or 'finished' (default is 'open') evaluate below logic.
          if(time >= CampaignDetails.campaignExpiry) {
            if(CampaignDetails.campaignGoal > address(this).balance) { //if the campaign HAS EXPIRED and HAS NOT MET its goal//
              if(time >= (CampaignDetails.campaignExpiry + 3 days) && time < (CampaignDetails.campaignExpiry + 14 days)) {
                return CampaignState.paymentReady; // if the campaign HAS EXPIRED and HAS NOT MET its goal, and HAS passed the extended hold time but HAS NOT passed the redemption time, return paymentReady.//
              } else if (time < (CampaignDetails.campaignExpiry + 3 days)){
                return CampaignState.hold; // if the campaign HAS EXPIRED and HAS NOT MET its goal and HAS NOT passed the hold time, return hold//
              } else if (time >= (CampaignDetails.campaignExpiry + 3 days) && time >= (CampaignDetails.campaignExpiry + 14 days)) {
                return CampaignState.derelict; // if the campaign HAS EXPIRED and HAS NOT MET its goal and HAS passed the extended hold time AND HAS passed the redemption time, return derelict.
              }
            } else if(CampaignDetails.campaignGoal <= address(this).balance) { //if the campaign HAS EXPIRED and HAS MET its goal//
              if(time >= (CampaignDetails.campaignExpiry + 1 days) && time < (CampaignDetails.campaignExpiry + 14 days)) {
                return CampaignState.paymentReady; // if the campaign HAS EXPIRED and HAS MET its goal, and HAS passed the hold time but HAS NOT passed the redemption time, return paymentReady.//
              } else if (time < (CampaignDetails.campaignExpiry + 1 days)){
                return CampaignState.hold; // if the campaign HAS EXPIRED and HAS NOT MET its goal and HAS NOT passed the hold time, return hold//
              } else if (time >= (CampaignDetails.campaignExpiry + 1 days) && time >= (CampaignDetails.campaignExpiry + 14 days)) {
                return CampaignState.derelict; // if the campaign HAS EXPIRED and HAS MET its goal and HAS passed the extended hold time AND HAS passed the redemption time, return derelict.
              }
            }
          } else if (time < CampaignDetails.campaignExpiry) { //if the campaign HAS NOT EXPIRED return open.//
            return CampaignState.open;
          } else {
              return CampaignState.open; //if for whatever reason we missed a possible state, return open as a coverall.
          }
        }
    }

    ///@author Arq
    ///@notice The End Campaign Function sets necessary values and closes the Campaign.
    function endCampaign() internal {
      require(platformPaid == true && checkDonorPayoutStatus() == true);
        CampaignDetails.beneficiaryReceived = address(this).balance;
        campaignOwner.transfer(address(this).balance);
        currentState = CampaignState.finished;
        interactionLock = false;
        f.campaignFinishedEmitter(address(this), campaignOwner, CampaignDetails.beneficiaryReceived, getNumberOfDonors(), ownerEmail);
        return;
    }

    ///@author Arq
    ///@notice fetches the current number of active supporters (supporters with a non-zero balance).
    ///@return the number of Supporters
    function getNumberOfDonors() public view returns (uint){
        uint donorCount = 0;
        for (uint i = 0; i < donorArray.length; i++){
            if(amountDonated[donorArray[i]] > 0) {
                donorCount++;
            }
        }
        return donorCount;
    }
    ///@author Arq
    ///@notice takes the percentage of the total raised funds
    ///@dev this function operates as the "end campaign" snapshot. commits Reward Pool to the Campaign Details variable.
    function logRewardPool () internal  {
        CampaignDetails.amountRaised = address(this).balance;
        CampaignDetails.RP = (CampaignDetails.amountRaised.mul(CampaignDetails.rewardPoolPercent)).div(100);
        return;
    }

    ///@author Arq
    ///@notice pays the platform fee, only if the donors have been paid out successfully.
    function payPlatform() internal{
        uint fee;
      require(platformPaid == false);//requires that the platform has not been paid and that the donors have been paid.
      fee = (CampaignDetails.amountRaised.mul(feePercent)).div(100); // calculates the platform fee. 5% is standard, 8% for any campaigns the platform launched, 2% additional fee on top of base for derelict campaign redemptions.
      paymentAddress.transfer(fee);
      CampaignDetails.platformFee = fee;
      platformPaid = true;
      return;
    }

    ///@author Arq
    ///@notice Pays the Supporters their share of the Reward Pool.
    //@dev function breaks when nearing the gas limit. May need to be run additonal times, emits an event if that's the case.
    function payoutShare() internal {
       require(checkDonorPayoutStatus() == false && CampaignDetails.RP > 0);
              address foundDonor;
              uint index = payoutIndex;
              while (index < donorArray.length && gasleft() > 10000){
                foundDonor = donorArray[index];
                if(amountDonated[foundDonor] > 0 && donorPaid[foundDonor] == false) {
                  foundDonor.transfer(getDonorReward(foundDonor));
                  donorPaid[foundDonor] = true;
                }
                index++;
              }
              payoutIndex = index;
              if(checkDonorPayoutStatus() == false){
                f.additionalPayout(address(this), payoutIndex, getNumberOfDonors());
                interactionLock = false;
                }
            return;
    }

    ///@author arq
    ///@notice Checks to see if the Supporters have been paid out.
    ///@return True if the payoutIndex is the length of the donorArray.
    ///@dev checks to see that the payoutIndex is the length of the donor array, indicating all donors have been paid.
    function checkDonorPayoutStatus() public view returns (bool) {
      if (payoutIndex < donorArray.length) {
        return false;
      } else {
        return true;
      }
    }

    ///@author Arq
    ///@notice calculates a Supporter's share of the reward Pool.
    ///@param _donor - The Address of the Supporter being paid when this function is executed.
    ///@return the Supporter's payout from the reward pool.
    ///@dev helper function used in the payoutShare() function.
    function getDonorReward (address _donor) internal view  returns (uint256)  {
        uint percent;
        uint result;
        percent = calculatePrecicePercent(_donor);
        result = calculate2(percent, CampaignDetails.RP, precision18, precision36);
        return result;
    }

    ///@author Arq
    ///@dev part of the overall percentage calculation to ensure a high level of precision so truncation does not materially affect payouts. (less than 1 wei is lost through truncation)
    ///@param _precision the number the value will be raised by, usually 10^18.
    ///@param _value the number being multiplied by the precision.
    ///@return the _value raised to the _precision e.g. calculatePrecision(10, 10^18) becomes 10,000,000,000,000,000,000. Wei becomes Hella-Wei.
    function calculatePrecision(uint256 _precision, uint256 _value) internal pure returns (uint256)  {
         return _value.mul(_precision);
    }

    ///@author Arq
    ///@notice returns the number we need to divide another number by to represent the percentage. For example, if we want 25% of something, we need to divide a number by 4, 30% of something by 3. Etc.
    ///@dev this is why percents are represented as a whole number.
    ///@param _precision when calculating a divisor you could say 1 div .25 and get 4, but to be more precise we use 10^18 (or higher) to include the numbers that might have been truncated otherwise (also because .25 is not an integer.).
    ///@param _percent the percent as a whole number that we want to get. so if we want 25% we use 25 or some multiple of 10 of .25 because, again, .25 is not an integer.
    ///@return returns the divisor used to divide whatever number you want to know the percent of.
    function calculateDivisor(uint256 _precision, uint256 _percent) internal pure returns (uint256)  {
        return _precision.div(_percent);
    }

    ///@author Arq
    ///@dev pure function that executes a couple other pure Functions
    ///@param _precision the level of precision used in the calculations.
    ///@param _percent the percent used in the calculations as a whole number.
    ///@param _value the number we want to take a percentage of.
    ///@return return the _percent of _value
    function calculate(uint256 _precision, uint256 _percent, uint256 _value) internal pure returns (uint256)  {
        uint precise;
        uint divisor;
        precise = calculatePrecision(_precision, _value);
        divisor = calculateDivisor(_precision, _percent);
        return (precise.div(divisor)).div(100);
    }

    ///@author arq
    ///@dev when calculating what percent of another number something is, higher precision is used in one section. This is used when determining what percent of a given number something is. Adjusted version of calculate() that helps with Supporter payouts.
    ///@param _percent once the percent of a given number has been found it's passed in.
    ///@param _value is the reward pool in this case,
    ///@param _precisionLow this is 10^18 always.
    ///@param _precisionHigh is 10^36 to offset the percent being represented as (for example) 25% = 25 * 10^18. to get a divisor you need the dividing number to be really big to not lose precision on the backend of the percent.
    ///@return returns the value of percent of _value
    function calculate2(uint256 _percent, uint256 _value, uint _precisionLow, uint _precisionHigh) internal pure returns (uint256)  {
        uint precise;
        uint divisor;
        precise = calculatePrecision(_precisionLow, _value);
        divisor = calculateDivisor(_precisionHigh, _percent);
        return (precise.div(divisor)).div(100);
    }

    ///@author Arq
    ///@dev function calculates what percent of the overall campaign a given donor has contributed.
    ///@param _donor the address of a given donor, used to lookup their donation to the campaign.
    ///@return the precise percent of overall contribution by _donor.
    function calculatePrecicePercent (address _donor) internal view returns (uint256)  {
        uint256 donation;
        donation = amountDonated[_donor];
        return calculatePrecision(precision18, donation).mul(100).div(CampaignDetails.amountRaised); //multiplies by 100 to turn number into percent, albeit a very very large percent.
    }

    ///@author Arq
    ///@dev checks to see if the campaign is open or not. essentially all CampaignStates are considered open except for Finished.
    ///@return whether the campaign is open or not.
    function campaignOpen() external view returns (bool) {
        if (campaignStatus() != CampaignState.finished) {
            return true;
        }
    }

    ///@author Arq
    ///@notice checks to see if the campaign is in Payment Ready Status.
    ///@return True if the campaign is in Payment Ready status.
    function campaignPaymentReady() external view returns (bool) {
        if (campaignStatus() == CampaignState.paymentReady) {
            return true;
        }
    }

    ///@author Arq
    ///@notice Function used to refund Supporters.
    ///@param _donor - The Supporter to be refunded.
    ///@dev requires that the current state is either open or on hold and the campaign HAS NOT MET its funding goal OR that the camapaign is either derelict or suspended (regardless of funding goal).
    function refundDonor(address _donor) public interactionsLocked(false) {
      CampaignState c = campaignStatus(); //sets memory variable c to the current campaing state.
        require(((c == CampaignState.open || c == CampaignState.hold) && address(this).balance < CampaignDetails.campaignGoal) || c == CampaignState.derelict || c == CampaignState.suspended);
        require(msg.sender == _donor || msg.sender == campaignOwner); //only the donor, campaign owner, or arbiter can request/payout a refund.
        uint amount = amountDonated[_donor];
        require(amount > 0, 'donor does not have anything to refund');
        amountDonated[_donor] = 0;
        _donor.transfer(amount);
    }
}
