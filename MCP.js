//javascript document//
var bucketName = 'dreambridge-profileassets';
var bucketRegion = 'us-east-1';
var IdentityPoolId = 'dreambridgeIdent';
var profileTable = "dreambridgeProfiles";

var AWS = require('aws-sdk');

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:2382d0e7-ce1b-4842-8f54-b573cb899f81',
});


var s3 = new AWS.S3();
var docClient = new AWS.DynamoDB.DocumentClient();

var factoryABI =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_campaign",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_payoutAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_numberOfDonors",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_email",
				"type": "string"
			}
		],
		"name": "CampaignFinished",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_campaign",
				"type": "address"
			},
			{
				"name": "_donorIndex",
				"type": "uint256"
			},
			{
				"name": "_totalDonors",
				"type": "uint256"
			}
		],
		"name": "additionalPayout",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_campaign",
				"type": "address"
			},
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_payoutAmount",
				"type": "uint256"
			},
			{
				"name": "_numberOfDonors",
				"type": "uint256"
			},
			{
				"name": "_email",
				"type": "string"
			}
		],
		"name": "campaignFinishedEmitter",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_goal",
				"type": "uint256"
			},
			{
				"name": "_duration",
				"type": "uint256"
			},
			{
				"name": "_rewardPool",
				"type": "uint256"
			},
			{
				"name": "_auto",
				"type": "bool"
			},
			{
				"name": "_email",
				"type": "string"
			}
		],
		"name": "deployNewContract",
		"outputs": [
			{
				"name": "newContract",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_campaign",
				"type": "address"
			},
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_donor",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			},
			{
				"name": "_email",
				"type": "string"
			},
			{
				"name": "_donorEmail",
				"type": "string"
			}
		],
		"name": "donationEmitter",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_pAdd",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_newCampaign",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_emails",
				"type": "string"
			}
		],
		"name": "campaignLaunched",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_campaign",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_donorIndex",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_totalDonors",
				"type": "uint256"
			}
		],
		"name": "AdditionalPayoutNeeded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_campaign",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_donor",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_email",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_donorEmail",
				"type": "string"
			}
		],
		"name": "DonationMade",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "addressIsCampaign",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "autopayment",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "campaignIdentifier",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_campaign",
				"type": "address"
			}
		],
		"name": "checkActive",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "checkActiveCampaignCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getActiveCampaignCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getActiveCampaigns",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getContractCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_caller",
				"type": "address"
			}
		],
		"name": "getDonations",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			},
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getOwnerActiveCampaign",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getOwnerCampaigns",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "lastRequestSender",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "ownerCampaignCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_campaign",
				"type": "address"
			}
		],
		"name": "paymentReady",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "paymentReadyCampaigns",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "paymentReadyCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "platformCampaigns",
		"outputs": [
			{
				"name": "ownerAddress",
				"type": "address"
			},
			{
				"name": "campaignAddress",
				"type": "address"
			},
			{
				"name": "campaignGoal",
				"type": "uint256"
			},
			{
				"name": "campaignDuration",
				"type": "uint256"
			},
			{
				"name": "rewardPoolPercent",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

/////CAMPAIGN ABI/////
var campaignABI =[
	{
		"constant": true,
		"inputs": [],
		"name": "currentState",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			},
			{
				"name": "_email",
				"type": "string"
			}
		],
		"name": "acceptDonation",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getNumberOfDonors",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "campaignInformation",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "campaignPaymentReady",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "CampaignDetails",
		"outputs": [
			{
				"name": "campaignName",
				"type": "string"
			},
			{
				"name": "campaignDuration",
				"type": "uint256"
			},
			{
				"name": "campaignExpiry",
				"type": "uint256"
			},
			{
				"name": "campaignCreation",
				"type": "uint256"
			},
			{
				"name": "rewardPoolPercent",
				"type": "uint256"
			},
			{
				"name": "campaignGoal",
				"type": "uint256"
			},
			{
				"name": "amountRaised",
				"type": "uint256"
			},
			{
				"name": "RP",
				"type": "uint256"
			},
			{
				"name": "platformFee",
				"type": "uint256"
			},
			{
				"name": "beneficiaryReceived",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "checkDonorPayoutStatus",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getOwnerEmail",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "campaignOpen",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "donorID",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "finishCampaign",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_donor",
				"type": "address"
			}
		],
		"name": "refundDonor",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "donorPaid",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "lastRequestSender",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "lockTimeRemaining",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getDonorArray",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTimeRemaining",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_donor",
				"type": "address"
			}
		],
		"name": "getVerifiedDonorEmail",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "campaignStatus",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "amountDonated",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_arbiter",
				"type": "address"
			},
			{
				"name": "_goal",
				"type": "uint256"
			},
			{
				"name": "_duration",
				"type": "uint256"
			},
			{
				"name": "_rewardPool",
				"type": "uint256"
			},
			{
				"name": "_platformFee",
				"type": "uint256"
			},
			{
				"name": "_factory",
				"type": "address"
			},
			{
				"name": "_autoPayout",
				"type": "bool"
			},
			{
				"name": "_ownerEmail",
				"type": "string"
			},
			{
				"name": "_paymentAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
]


const Web3 = require('web3');
const nodemailer = require('nodemailer');
const fs = require('fs');
const config = './config.json';


var transporter = nodemailer.createTransport({
  host: 'dreambridge.io',
  port: 465,
  secure: true,
  auth: {
    user: 'donotreply@dreambridge.io',
    pass: 'bridgenotreplybot'
  },
  tls: {
    rejectUnauthorized: false
  }

})




var messageOptions = {
  from:'donotreply@dreambridge.io',
  to:'cpeterson@dreambridge.io',
  subject:'Listener Initiated: ' + Date.now(),
  text: 'The Event Listener has been started.'
}
var counter = 0;
transporter.sendMail(messageOptions, (error,info) => {
  if(error){
    return console.log(error);
  } else {
    return console.log('Sent');
  }
})

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://0.0.0.0:8555"));
}

//Declare useful Variables.
var factoryDeployed ="0x4c3661c474041a150b54f53edd6b176cde726521";
var campaign = web3.eth.contract(campaignABI);
var factory = web3.eth.contract(factoryABI);
var factoryContract = factory.at(factoryDeployed);
var campaignStatusM = ["Open", "Pending Completion", "Payment Ready", "Finished", "Suspended", "Derelict"];

console.log("Eth Node Version: ", web3.version.node);
console.log("Network: " ,web3.version.network, web3.version.ethereum);
console.log("Connected: ", web3.isConnected(), web3.currentProvider);
console.log("syncing: ", web3.eth.syncing, ", Latest Block: ",web3.eth.blockNumber);

contract = initContract(factoryDeployed);
update = setInterval(statusUpdates,15000);

function initContract(factoryAddress){
  let configFile = './config.json';
  let config = require(configFile);
  let startBlock = 0;
  if(web3.eth.blockNumber > config.ETH.lastBlock){
    console.log('Latest Block in Config: '+ config.ETH.lastBlock + '...Updating Events');
    startBlock = config.ETH.lastBlock-10;
      f = factory.at(factoryDeployed)
      let event = f.allEvents({fromBlock: startBlock, toBlock: 'latest'});
      event.get(function(e,r){
      if(!e){
      for(var i = 0; i< r.length; i++){
          if(r[i].event == 'campaignLaunched'){
            console.log('Email: ', r[i].args._emails,' has launched a new Campaign at Address:', r[i].args._newCampaign, 'created on: ', r[i].transactionHash, 'Adding to AWS...');
            insertToAWS(r[i]);
          } else if (r[i].event == 'DonationMade'){
            donationNotificationCheck(r[i]);
          } else if (r[i].event == 'CampaignFinished'){
            console.log('Campaign Finished: ' + r[i].args);
          } else if (r[i].event == 'AdditionalPayoutNeeded') {
            console.log('Additional Payout: ' + r[i].args);
          }
      }
    } else {return e;}
    });
  } else {
    startBlock = 'latest';
  }
  f = factory.at(factoryAddress)
  let event = f.allEvents()
  console.log('Listening for Events on ', factoryDeployed);
  event.watch(function(e,r){
    if(!e){
			if(r.event == 'campaignLaunched'){
				console.log('Email: ', r.args._emails,' has launched a new Campaign at Address:', r.args._newCampaign, 'created on: ', r.transactionHash, 'Adding to AWS...');
				insertToAWS(r);
				return;
			} else if (r.event == 'DonationMade'){
        donationNotificationCheck(r);
				return;
			} else if (r.event == 'CampaignFinished'){
        console.log('Campaign Finished: ' + r.args);
        return;
      } else if (r.event == 'AdditionalPayoutNeeded') {
        console.log('Additional Payout: ' + r.args);
        return;
      }
    }
  });
  return;
}

function insertToAWS(result){
	var params = {
    TableName: profileTable,
    Key: {
      "profileAddress": result.args._newCampaign
    }
  };
  docClient.get(params, function(e,res){
    if(e){
			console.log(e);
		} else {
      if (res.Item == undefined) {
				var address = result.args._newCampaign;
				var campaignCon = campaign.at(address);
				campaignCon.campaignInformation.call(function(e, info){
	    		let campaignAddress = address;
          let campaignDuration = info[4].c[0];
	  			let campaignOwner = info[0];
	  			let campaignName = info[1];
	  			let campaignGoal = (info[2].c[0]/10000);
	  			let campaignRewardPool = info[5].c[0];
          let verCode = web3.sha3(address+Date.now()+campaignOwner+campaignName+address);
          let verString = web3.sha3(verCode);
          console.log(verCode +' ' + verString +' '+ web3.sha3(verCode));

        	let params = {
	  				TableName: profileTable,
	  				Item: {
							"profileAddress": campaignAddress,
							"cStatus": "Open",
							"cMajCategory": "General",
							"cMinCategory" : "General",
							"creationTx" : result.transactionHash,
							"updatedCategory" : false,
							"updatedConnect" : false,
							"updatedHeadline" : false,
							"updatedLocation" : false,
							"info": {
								"campaignName": campaignName,
								"campaignGoal": campaignGoal,
								"campaignRewardPool" : campaignRewardPool,
								"profileImage": encodeURIComponent("/static/img/coming_soon.png"),
								"numberOfSupporters" : 0,
                "campaignBalance": 0,
                "timeRemaining": 0,
                "campaignDuration": campaignDuration
							},
              "notifications": {
                "email" : result.args._emails,
                "donations" : false,
                "statusChange" : false,
                "paymentReady" : false,
                "payments" : false,
              },
              "rewardInformation": {
                "rewardCount" : 0,
              },
              "verificationSettings":{
                "verificationString": verString,
                "emailVerified": false,

              }
						}
					}
					docClient.put(params, function(e, data){
						if(e){
							console.log(e);
						} else {
							console.log('Added.')
              let messageOptions = {
                from:'donotreply@dreambridge.io',
                to:'cpeterson@dreambridge.io',
                subject:'New Campaign Added: ' + result.args._newCampaign,
                text: 'A New Campaign at Address: ' + result.args._newCampaign + ' has been Launched and Added to AWS on TX: ' + result.transactionHash
              }
              transporter.sendMail(messageOptions, (error,info) => {
                if(error){
                  return console.log(error);
                } else {
                  return console.log('Addition Message Sent to MCP');
                }
              })
              let messageOptions = {
                from:'donotreply@dreambridge.io',
                to: result.args._emails,
                bcc: 'campaigns@dreambridge.io',
                subject:'Your Dreambridge Campaign has been Launched!',
                html: '<h3>Congratulations!</h3>' +
                  '\n<p><strong>Your Dreambridge Campaign has Successfully Launched!</strong></p>' +
                  '\n\n<p>Your newly created Campaign is now open for Donations at the following Address <a href="http://www.dreambridge.io/viewcampaign?address='+result.args._newCampaign+'">'+result.args._newCampaign+'</a></p>' +
                  '\n\n<strong>Now that your Campaign has been launched, here\'s a few reminders to help you get started!</strong>\n'+
                  '<ol>'+
                  '<li>Verify your Email Address using the verification email we\'ve sent to unlock additional features for your Campaign!</li>'+
                    '<li><p>Visit our <a href="https://www.dreambridge.io/guide#creating-a-public-profile">Detailed Guide</a> for Tips on building a Public Profile for your Campaign.</p></li>'+
                    '<li><p>Stop over to the <a href="https://www.dreambridge.io/myprofile">My Profile</a> or <a href="http://www.dreambridge.io/viewcampaign?address='+result.args._newCampaign+'">Campaign Profile</a> to start building the Public Profile for your Campaign!</p></li>'+
                    '<li><p>Enable Notifications (in the <a href="https://www.dreambridge.io/myprofile">My Profile</a> section) to stay up to date on what\'s happening with your Campaign including Donations, Status Changes, and more!</p></li>' +
                    '<li><p>Start Promoting your Campaign and start Earning Ether!</p></li>' +
                  '</ol>' +
                  '\n\n<p>Additional information and a list of Frequently Asked Questions can be found on our <a href="https://www.dreambridge.io/faqs">FAQs</a> page and of course, if you have any questions or need assistance please feel free to contact us at support@dreambridge.io</p>' +
                  '\n\n<p>Thank you for choosing Dreambridge, we wish you the best of luck on your Campaign!</p>' +
                  '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>',
                text: 'Congratulations! Your Dreambridge Campaign has successfully Launched and is eligible to accept donations at the following Address: ' + result.args._newCampaign + '!\n Now that your Campaign has been Lauinched it\'s Time to take the next Steps on your Dreambridge Journey. First, be sure to build your Public Profile to tell the world a little bit about your Dream. \n Then it\'s time to get Promoting and spreading the word about your Campaign!\nVisit our Detailed Campaign Guide for more information, and please feel free to reach out to us with any questions you have about the process!\nYour Campaign was created on: ' + result.transactionHash + '\n Thank you!\n Dreambridge Support'
              }
              transporter.sendMail(messageOptions, (error,info) => {
                if(error){
                  return console.log(error);
                } else {
                  return console.log('Creation Message Sent to User');
                }
              })
              let messageOptions = {
                from:'donotreply@dreambridge.io',
                to: result.args._emails,
                bcc: 'campaigns@dreambridge.io',
                subject:'Please Verify your Contact Information',
                html: '<h3>Greetings!</h3>' +
                  '\n<p><strong>Thank you for launching a Dreambridge Campaign!</strong></p>' +
                  '\n\n<p>Your Campaign is now open for Donations but to enable additional features, like the addition of custom rewards, you must verify your email address. Please use the code below to fill out our Verification form!</p>' +
                  '\n\n<strong>Now that your Campaign has been launched, here\'s a few reminders to help you get started!</strong>\n'+
                  '<Ul>'+
                  '<li><p><strong>Your Verification Code is: </strong>'+verCode+'</p></li>'+
                    '<li><p>Please fill out our <a href="https://www.dreambridge.io/verify?address='+result.args._newCampaign+'">verification</a> form to verify your email address!</p></li>'+
                    '<li><p>You will need to supply your Campaign Address (which should automatically populate if you follow the baove link), your email address, and the verification code.</p></li>'+
                  '</Ul>' +
                  '\n\n<p>Thank you for choosing Dreambridge, we wish you the best of luck on your Campaign!</p>' +
                  '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>',
                text: 'Congratulations! Your Dreambridge Campaign has successfully Launched and is eligible to accept donations at the following Address: ' + result.args._newCampaign + '!\n Now that your Campaign has been Lauinched it\'s Time to take the next Steps on your Dreambridge Journey. First, be sure to build your Public Profile to tell the world a little bit about your Dream. \n Then it\'s time to get Promoting and spreading the word about your Campaign!\nVisit our Detailed Campaign Guide for more information, and please feel free to reach out to us with any questions you have about the process!\nYour Campaign was created on: ' + result.transactionHash + '\n Thank you!\n Dreambridge Support'
              }
              transporter.sendMail(messageOptions, (error,info) => {
                if(error){
                  return console.log(error);
                } else {
                  return console.log('Verification Message Sent to User');
                }
              })
						};
					});
				});
			} else {
				var params = {
					TableName: profileTable,
					Key:{
						"profileAddress": result.args._newCampaign
					},
					UpdateExpression: "SET creationTx = :tx",
					ExpressionAttributeValues: {":tx" : result.transactionHash},
					ReturnValues:"UPDATED_NEW"
				};
				docClient.update(params, function(e, data){
					if(e){
						console.log(e);
					} else {
						console.log('Added TX Hash');
					}
				});
			}
		}
	});
}

function donationNotificationCheck(res){
  var campaign = res.args._campaign;
  var email = res.args._email;
  var donorEmail = res.args._donorEmail;
  var params = {
    TableName: profileTable,
    Key: {
      "profileAddress": campaign
    }
  };
  docClient.get(params, function(e,result){
    if(!e){
      if(result.Item.notifications.donations == true){
        if(donorEmail !== 'N/A' && donorEmail !== undefined){
          var messageOptions = {
            from:'donotreply@dreambridge.io',
            to: res.args._email,
            subject:'Your Dreambridge Campaign has received a new Donation!',
            html: '<h3>Congratulations!</h3>' +
            '\n<p><strong>Your Campaign has Received a New Verified Donation!</strong></p>\n' +
            '<p>Verified Donations include an Email Address that Supporters have supplied. You may view this information in the <a href="https://www.dreambridge.io/myprofile">My Profile</a> section of our Site!</p>'+
            '<ul>' +
              '<li>' +
                '<p><strong>Campaign: </strong>' +result.Item.info.campaignName+ '</p>' +
                '<p><strong>Donation Amount: </strong>' + res.args._amount.c[0]/10000 + ' Ether </p>' +
                '<p><strong>From: </strong>' + res.args._donor + '!</p>' +
              '</li>' +
            '</ul>' +
            '\nYou can view this Donation on Etherscan <a href="https://rinkeby.etherscan.io/tx/'+res.transactionHash+'">here</a>!' +
            '\n\n<p style="font-size: 0.75em;">To disable notifications, please visit the <a href="https://www.dreambridge.io/myprofile">My Profile</a> page to alter your Notification Settings.</p>' +
            '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>',
            text: 'Congratulations!\n\nYour Campaign: ' + result.Item.info.campaignName + ' has received a new donation of ' + res.args._amount.c[0]/10000+' Ether!'
          }
        } else {
          var messageOptions = {
            from:'donotreply@dreambridge.io',
            to: res.args._email,
            subject:'Your Dreambridge Campaign has received a new Donation!',
            html: '<h3>Congratulations!</h3>' +
            '\n<p><strong>Your Campaign has Received a New Donation!</strong></p>' +
            '<ul>' +
              '<li>' +
                '<p><strong>Campaign: </strong>' +result.Item.info.campaignName+ '</p>' +
                '<p><strong>Donation Amount: </strong>' + res.args._amount.c[0]/10000 + ' Ether </p>' +
                '<p><strong>From: </strong>' + res.args._donor + '!</p>' +
              '</li>' +
            '</ul>' +
            '\nYou can view this Donation on Etherscan <a href="https://rinkeby.etherscan.io/tx/'+res.transactionHash+'">here</a>!' +
            '\n\n<p style="font-size: 0.75em;">To disable notifications, please visit the <a href="https://www.dreambridge.io/myprofile">My Profile</a> page to alter your Notification Settings.</p>' +
            '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>',
            text: 'Congratulations!\n\nYour Campaign: ' + result.Item.info.campaignName + ' has received a new donation of ' + res.args._amount.c[0]/10000+' Ether!'
          }
        }

        transporter.sendMail(messageOptions, (error,info) => {
          if(error){
            return console.log(error);
          } else {
              return console.log('Donation Notification Sent for: ' + res.args._campaign);
          }
      });
    } else {
      return;
    }
  }
  });

}
function statusUpdateNotification(address, status, previous) {
  var params = {
    TableName: profileTable,
    Key: {
      "profileAddress": address
    }
  };
  console.log('Checking Status Notifications for: ' + address)
  docClient.get(params, function(e,d) {
    if(!e){
      if(status == 'Payment Ready'){
        if(d.Item.notifications.paymentReady == true){
          var messageOptions = {
            from:'donotreply@dreambridge.io',
            to: d.Item.notifications.email,
            subject:'Your Dreambridge Campaign is Ready for Payment!',
            html: '<h3>The Moment has Arrived!</h3>' +
            '\n<p><strong>Your Campaign '+d.Item.info.campaignName+' has run its duration and is ready to be paid out!</strong></p>' +
            '\nIf you <strong>HAVE</strong> selected "Automatic Payments" and have Payment Notifications enabled, you will receive an email with your Payment Confirmation shortly!' +
            '\nIf you <strong>HAVE NOT</strong> selected "Automatic Payments, please visit the <a href="https://www.dreambridge.io/myprofile">My Profile</a> page to complete your Campaign!' +
            '\n\n<p style="font-size: 0.75em;">To disable notifications, please visit the <a href="https://www.dreambridge.io/myprofile">My Profile</a> page to alter your Notification Settings.</p>' +
            '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>'
          }
          transporter.sendMail(messageOptions, (error,info) => {
            if(error){
              console.log(error);
            } else {
              console.log('Payment Ready Notification sent for: ' + address);
            }
          });
        } else {
          return;
        }
      } else {
        if(d.Item.notifications.statusChange == true){
          var messageOptions = {
            from:'donotreply@dreambridge.io',
            to: d.Item.notifications.email,
            subject:'Your Dreambridge Campaign\'s Status has Changed!',
            html: '<h3>For Your Reference!</h3>' +
            '\n<p><strong>Your Campaign has changed statuses!</strong></p>' +
            '\nWe are notifying you that your Campaign: <a href="https://www.dreambridge.io/viewcampaign?address=' + address + '">'+d.Item.info.campaignName+'</a> has Changed status from: <strong>' + previous + '</strong> to: <strong>' + status + '</strong>' +
            '\n\n<p style="font-size: 0.75em;">To disable notifications, please visit the <a href="https://www.dreambridge.io/myprofile">My Profile</a> page to alter your Notification Settings.</p>' +
            '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>'
          }
          transporter.sendMail(messageOptions, (error,info) => {
            if(error){
              console.log(error);
            } else {
              console.log('Status Change Notification sent for: ' + address);
            }
          });
        } else {
          return;
        }
      }
    }
  });


}

function statusUpdates(){
        updateClass._updateConfig();
            var params = {
                TableName: profileTable,
                ProjectionExpression: "profileAddress, cStatus"
              }
            docClient.scan(params, function(e,r){
              if(!e){
                var resultCount = 0;
                r.Items.forEach(function(d){
                  var campaignCon = campaign.at(d.profileAddress);

                  campaignCon.campaignStatus.call(function(e,status){
                  if(status){
                  if (status.c[0] !== 'undefined'){
                  var currentStatus = campaignStatusM[status.c[0]];
                  if(currentStatus !== 'Finished'){
                    updateClass._updateBalanceSupporters(d.profileAddress);

                  }
                  updateClass._updateTimeRemaining(d.profileAddress);
                    if(d.cStatus !== currentStatus){
                      var prevStatus = d.cStatus;
                      var params = {
                      TableName: profileTable,
                      Key:{
                        "profileAddress": d.profileAddress,
                      },
                      UpdateExpression: "SET cStatus = :1",
                      ExpressionAttributeValues: {":1" : currentStatus},
                      ReturnValues:"UPDATED_NEW"
                    };
                    docClient.update(params, function(e, data){
                      if(e){
                        console.log(e);
                      } else {
                        console.log('Updated: ' + d.profileAddress + ' to: ' + currentStatus);
                        statusUpdateNotification(d.profileAddress, currentStatus, prevStatus);
                      }
                    });
                  }
              } else {
                return console.log('Status not found.');
              }
            }
              });
            });
          }
        })
  }
  var updateClass = {
    _updateBalanceSupporters : function(address) {
      var campaignCon = campaign.at(address);
      campaignCon.campaignInformation.call(function(e,d){
        if(!e && d !== 'undefined'){
          var params = {
            TableName: profileTable,
            Key: {
              "profileAddress": address
            }
          };
        docClient.get(params, function(e,info) {
            if(!e && info.Item !== 'undefined'){
              var cSupporters = info.Item.info.numberOfSupporters;
              var cBalance = info.Item.info.campaignBalance;
              var balance, supporters, duration;
              balance = d[3].c[0];
              supporters = d[6].c[0];
              duration = d[4].c[0];
              if (info.Item.info.campaignDuration !== 'undefined' && info.Item.info.campaignDuration > 0){
                return;
              } else {
                var params = {
                TableName: profileTable,
                Key:{
                  "profileAddress": address,
                },
                UpdateExpression: "SET info.campaignDuration = :1",
                ExpressionAttributeValues: {":1" : duration},
                ReturnValues:"UPDATED_NEW"
                };
                docClient.update(params, function(e, data){
                  if(e){
                    return console.log(e);
                  } else {
                    return console.log('Updated Duration for: '+ address);
                  }
                });
              }
              if(cBalance == balance && cSupporters == supporters){
                return;
              } else {
              var params = {
              TableName: profileTable,
              Key:{
                "profileAddress": address,
              },
              UpdateExpression: "SET info.campaignBalance = :1, info.numberOfSupporters = :2",
              ExpressionAttributeValues: {":1" : balance, ":2" : supporters},
              ReturnValues:"UPDATED_NEW"
              };
              docClient.update(params, function(e, data){
                if(e){
                  return console.log(e);
                } else {
                  return console.log('Updated Balance and Supporters for '+ address);
                }
              });
            }
          } else {
            return;
          }
          });
        } else {
          return;
        }
      });
    },
    _updateTimeRemaining : function (address) {
      var campaignCon = campaign.at(address);
      campaignCon.campaignInformation.call(function(e,d){
        if(!e && d !== 'undefined'){
          var timeRemaining = d[8].c[0];
          var status = campaignStatusM[d[9].c[0]];
          var params = {
            TableName: profileTable,
            Key: {
              "profileAddress": address
            }
          };
        docClient.get(params, function(e,info) {
            if(!e && info.Item !== 'undefined'){
              if(status === 'Finished' || status === 'Derelict'){
                timeRemaining = 0;
              } else {
                var params = {
                TableName: profileTable,
                Key:{
                  "profileAddress": address,
                },
                UpdateExpression: "SET info.timeRemaining = :1",
                ExpressionAttributeValues: {":1" : timeRemaining},
                ReturnValues:"UPDATED_NEW"
                };
                docClient.update(params, function(e, data){
                  if(e){
                    return console.log(e);
                  } else {
                    return;
                  }
                });
              }
            } else {
              return console.log(e);
            }
          });
        } else {
          return console.log(e);
        }
      });
    },
    _updateConfig: function() {
      let blockNumber = web3.eth.blockNumber;
      let configFile = './config.json';
      let config = require(configFile);
      config.ETH.lastBlock = blockNumber;
      fs.writeFile(configFile, JSON.stringify(config, null, 2), function(e){
        if(e) return console.log('Unable to update Config File - ', e);
      });
    }
  };
