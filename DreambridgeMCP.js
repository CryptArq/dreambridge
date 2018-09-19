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



const campaignStatusM = ["Open", "Pending Completion", "Payment Ready", "Finished", "Suspended", "Derelict"];

const Web3 = require('web3');

const nodemailer = require('nodemailer');

const fs = require('fs');

const configFile = './config.json';

const webSocketPath = 'wss://rinkeby.infura.io/ws'
var provider = new Web3.providers.WebsocketProvider(webSocketPath);
var web3 = new Web3(provider);
var factoryDeployed ="0x4c3661c474041a150b54f53edd6b176cde726521";
var factory = new web3.eth.Contract(factoryABI, factoryDeployed);
const wei = 1000000000000000000;
const config = require(configFile);
const transporter = nodemailer.createTransport({
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
});


provider.on('error', e => {
  console.log('Websocket Error:', e);
});
provider.on('end', e => {
  console.log('Connection Lost, attempting to reconnect...');
  provider = new Web3.providers.WebsocketProvider(webSocketPath);
  provider.on('connect', function(){
    console.log('Reconnected...Reinitializing Listener.');
    web3.setProvider(provider);
    return init();
  });

});




go = init()



function init(){
  console.log('Initializing Listener...');
//Phase 1 Check Websocket Status
  console.log('\nPhase 1: Checking Connection\n');
  var listening = false;
  let version = null;
  var sync;
  web3.eth.isSyncing(function(e,d){
    if(!e && d === false){
      console.log('Syncing:',d);
      sync = clearInterval(sync);
    } else if (!e && d !== false){
      console.log('Node has not synced...Initialization Halting until Sync has Completed.');
      sync = setInterval(init, 15000);
      let highest = web3.eth.isSyncing.highestBlock;
      let current = web3.eth.isSyncing.currentBlock;
      let percent = ((current/highest)*100).toFixed(2);
      console.log('Syncing Block:', current, 'of', highest, '('+percent+'% Synced)');
      return;
    }
  });
  console.log('Web3 Version:', web3.version);

  if(web3.version !== undefined){

    version = web3.version;

  }

  web3.eth.net.isListening(function(e,d){

    if(!e){

      listening = d;

      console.log('Listening for peers?',listening);

      if(version !== null && version !== undefined && listening === true){

        console.log('Websocket Connected');

      } else {

        return console.log('Websocket Not Connected.');

      }

    }

  });



//Phase 2 check for past Events

  console.log('\nPhase 2: Checking for Missed Events\n');

  web3.eth.getBlockNumber(function(e,blockNumber){

    if(!e){

      if(blockNumber > config.ETH.lastBlock){

        console.log('Last Block in Config:',config.ETH.lastBlock,'Current Block:', blockNumber, '\nListener is out of Sync by', blockNumber-config.ETH.lastBlock,'Blocks...\Checking Past Events');

        factory.getPastEvents('allEvents',{fromBlock:config.ETH.lastBlock, toBlock: 'latest'}, function(e,events){

          if(events.length > 0){

            console.log('Detected',events.length,'missed Events.\nCatching Up...');

            for(var i = 0; i < events.length; i++){

              let event = events[i].event;

              switch(event){

                case 'campaignLaunched':

                  console.log('Campaign Launched:',events[i].returnValues._newCampaign);

                  MCP._insertToAWS(events[i]);

                  break;

                case 'DonationMade':

                  console.log('Donation to:',web3.utils.fromWei(events[i].returnValues._amount));

                  updateClass._logDonation(web3.utils.fromWei(events[i].returnValues._amount));

                  MCP._donationNotification(events[i]);

              }



            }

            console.log('Past Events Handled');

            listener = initiateListener();

          } else {

            console.log('No Events were Missed.')

            listener = initiateListener();

          }

        });

      } else {

        console.log('Listener is up to Date.')

        listener = initiateListener();

      }

    } else {

      return;

    }

  })



//Phase 3 Initiate Main Logic//



}



var MCP = {

  _insertToAWS : function(eventResult) {

    	var params = {

        TableName: profileTable,

        Key: {

          "profileAddress": eventResult.returnValues._newCampaign

        }

      };

      docClient.get(params, function(e,result){

        if(e){

    			return console.log(e);

    		} else {

          if (result.Item == undefined) {

    				var address = eventResult.returnValues._newCampaign;

    				let campaignCon = new web3.eth.Contract(campaignABI, address);

    				campaignCon.methods.campaignInformation().call(function(e, info){

    	    		var campaignAddress = address;

              var campaignDuration = info[4];

    	  			var campaignOwner = info[0];

    	  			var campaignName = info[1];

    	  			var campaignGoal = web3.utils.fromWei(info[2]);

    	  			var campaignRewardPool = info[5];

              var verCode = web3.utils.soliditySha3(address,Date.now(),campaignOwner,campaignName,address);

              var verString = web3.utils.sha3(verCode);

            	var params = {

    	  				TableName: profileTable,

    	  				Item: {

    							"profileAddress": campaignAddress,

    							"cStatus": "Open",

    							"cMajCategory": "General",

    							"cMinCategory" : "General",

    							"creationTx" : eventResult.transactionHash,

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

                    "email" : eventResult.returnValues._emails,

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



                  },

                  "profileVisible" : true

    						}

    					}

    					docClient.put(params, function(e, data){

    						if(e){

    							return console.log(e);

    						} else {

    							console.log('Campaign Successfully Added, sending Welcome Packages.')

                  var messageOptions = {

                    from:'donotreply@dreambridge.io',

                    to:'cpeterson@dreambridge.io',

                    subject:'New Campaign Added: ' + eventResult.returnValues._newCampaign,

                    text: 'A New Campaign at Address: ' + eventResult.returnValues._newCampaign + ' has been Launched and Added to AWS on TX: ' + eventResult.transactionHash

                  }

                  transporter.sendMail(messageOptions, (error,info) => {

                    if(error){

                      return console.log(error);

                    } else {

                      return console.log('Welcome Pack 1/3: Addition Message Sent to MCP');

                    }

                  })

                  var messageOptions = {

                    from:'donotreply@dreambridge.io',

                    to: eventResult.returnValues._emails,

                    bcc: 'campaigns@dreambridge.io',

                    subject:'Your Dreambridge Campaign has been Launched!',

                    html: '<h3>Congratulations!</h3>' +

                      '\n<p><strong>Your Dreambridge Campaign has Successfully Launched!</strong></p>' +

                      '\n\n<p>Your Campaign, '+campaignName+', is now open for Donations at the following Address <a href="http://www.dreambridge.io/viewcampaign?address='+eventResult.returnValues._newCampaign+'">'+eventResult.returnValues._newCampaign+'</a></p>' +

                      '\n\n<strong>Now that your Campaign has been launched, here\'s a few things to help you get started!</strong>\n'+

                      '<ol>'+

                      '<li>Verify your Email Address to enable additional features for your Campaign!</li>'+

                        '<li><p>Stop over to the <a href="https://www.dreambridge.io/myprofile">My Profile</a> or <a href="http://www.dreambridge.io/viewcampaign?address='+eventResult.returnValues._newCampaign+'">Campaign Profile</a> to start building the Public Profile for your Campaign!</p></li>'+

                        '<li><p>Enable Notifications (in the <a href="https://www.dreambridge.io/myprofile">My Profile</a> section) to stay up to date on what\'s happening with your Campaign including Donations, Status Changes, and more!</p></li>' +

                        '<li><p>Start Promoting your Campaign and start Earning Ether!</p></li>' +

                      '</ol>' +

                      '\n\n<p>Additional information and a list of Frequently Asked Questions can be found on our <a href="https://www.dreambridge.io/faqs">FAQs</a> page and of course, if you have any questions or need assistance please feel free to contact us at support@dreambridge.io</p>' +

                      '\n\n<p>Thank you for choosing Dreambridge, we wish you the best of luck on your Campaign!</p>' +

                      '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>',

                    text: 'Congratulations! Your Dreambridge Campaign has successfully Launched and is eligible to accept donations at the following Address: ' + eventResult.returnValues._newCampaign + '!\n Now that your Campaign has been Lauinched it\'s Time to take the next Steps on your Dreambridge Journey. First, be sure to build your Public Profile to tell the world a little bit about your Dream. \n Then it\'s time to get Promoting and spreading the word about your Campaign!\nVisit our Detailed Campaign Guide for more information, and please feel free to reach out to us with any questions you have about the process!\nYour Campaign was created on: ' + eventResult.transactionHash + '\n Thank you!\n Dreambridge Support'

                  }

                  transporter.sendMail(messageOptions, (error,info) => {

                    if(error){

                      return console.log(error);

                    } else {

                      return console.log('Welcome Pack 2/3: Creation Message Sent to User');

                    }

                  });

                  var messageOptions = {

                    from:'donotreply@dreambridge.io',

                    to: eventResult.returnValues._emails,

                    bcc: 'campaigns@dreambridge.io',

                    subject:'Please Verify your Contact Information',

                    html: '<h3>Greetings!</h3>' +

                      '\n<p><strong>Thank you for launching a Dreambridge Campaign!</strong></p>' +

                      '\n\n<p>Your Campaign, '+campaignName+', is now open for Donations! To enable additional features, like Notifications and Additional Supporter Rewards, you must verify your Email Address. Please use the code below to fill out our Verification form!</p>' +

                      '\n\n<strong>To Verify your Email Address you must have your Campaign\'s Address ('+address+'), your Email Address, the Verification Code (below), and you must use an <a href="https://www.dreambridge.io/guide#ethereum-providers">Ethereum Provider</a> with the Campaign Owner\'s Wallet you specified when you launched the Campaign!</strong>\n\nYour verification information is below!\n'+

                      '<ul>'+

                      '<li><p><strong>Your Verification Code is: </strong>'+verCode+'</p></li>'+

                        '<li><p>Please fill out our <a href="https://www.dreambridge.io/verify?address='+eventResult.returnValues._newCampaign+'">verification</a> form to verify your email address!</p></li>'+

                        '<li><p>You will need to supply your Campaign Address (which should automatically populate if you follow the baove link), your email address, and the verification code.</p></li>'+

                      '</ul>' +

                      '\n\n<p>Thank you for choosing Dreambridge, we wish you the best of luck on your Campaign!</p>' +

                      '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>',

                    text: 'Congratulations! Your Dreambridge Campaign has successfully Launched and is eligible to accept donations at the following Address: ' + eventResult.returnValues._newCampaign + '!\n Now that your Campaign has been Lauinched it\'s Time to take the next Steps on your Dreambridge Journey. First, be sure to build your Public Profile to tell the world a little bit about your Dream. \n Then it\'s time to get Promoting and spreading the word about your Campaign!\nVisit our Detailed Campaign Guide for more information, and please feel free to reach out to us with any questions you have about the process!\nYour Campaign was created on: ' + eventResult.transactionHash + '\n Thank you!\n Dreambridge Support'

                  }

                  transporter.sendMail(messageOptions, (error,info) => {

                    if(error){

                      return console.log(error);

                    } else {

                      return console.log('Welcome Pack 3/3: Verification Message Sent to User');

                    }

                  });

    					}

    				});

          })

        } else {

          return console.log('Campaign Previously Added')

        }

      }

    });

  },

  _donationNotification: (eventResult) => {

    let campaign = eventResult.returnValues._campaign;

    let email = eventResult.returnValues._email;

    var donorEmail = eventResult.returnValues._donorEmail;

    var params = {

      TableName: profileTable,

      Key: {

        "profileAddress": campaign

      }

    };

    docClient.get(params, function(e,result){

      if(!e && result.Item != undefined){

        if(result.Item.notifications.donations == true){

          if(donorEmail !== 'null' && donorEmail !== undefined){

            var messageOptions = {

              from:'donotreply@dreambridge.io',

              to: email,

              subject:'Your Dreambridge Campaign has received a new Donation!',

              html: '<h3>Congratulations!</h3>' +

              '\n<p><strong>Your Campaign has Received a New Verified Donation!</strong></p>\n' +

              '<p>Verified Donations include an Email Address that Supporters have supplied. You may view this information in the <a href="https://www.dreambridge.io/myprofile">My Profile</a> section of our Site!</p>'+

              '<ul>' +

                '<li>' +

                  '<p><strong>Campaign: </strong>' +result.Item.info.campaignName+ '</p>' +

                  '<p><strong>Donation Amount: </strong>' + web3.utils.fromWei(eventResult.returnValues._amount) + ' Ether </p>' +

                  '<p><strong>From: </strong>' + eventResult.returnValues._donor + '</p>' +

                  '<p><strong>To contact this Supporter about their Verified Donation, please visit the <a href="https://www.dreambridge.io/myprofile">My Profile</a></p>' +

                '</li>' +

              '</ul>' +

              '\nYou can view this Donation on Etherscan <a href="https://rinkeby.etherscan.io/tx/'+eventResult.transactionHash+'">here</a>!' +

              '\n\n<p style="font-size: 0.75em;">To disable notifications, please visit the <a href="https://www.dreambridge.io/myprofile">My Profile</a> page to alter your Notification Settings.</p>' +

              '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>',

              text: 'Congratulations!\n\nYour Campaign: ' + result.Item.info.campaignName + ' has received a new donation of ' + web3.utils.fromWei(eventResult.returnValues._amount)+' Ether!'

            }

          } else {

            var messageOptions = {

              from:'donotreply@dreambridge.io',

              to: email,

              subject:'Your Dreambridge Campaign has received a new Donation!',

              html: '<h3>Congratulations!</h3>' +

              '\n<p><strong>Your Campaign has Received a New Donation!</strong></p>' +

              '<ul>' +

                '<li>' +

                  '<p><strong>Campaign: </strong>' +result.Item.info.campaignName+ '</p>' +

                  '<p><strong>Donation Amount: </strong>' + web3.utils.fromWei(eventResult.returnValues._amount) + ' Ether </p>' +

                  '<p><strong>From: </strong>' + eventResult.returnValues._donor + '!</p>' +

                '</li>' +

              '</ul>' +

              '\nYou can view this Donation on Etherscan <a href="https://rinkeby.etherscan.io/tx/'+eventResult.transactionHash+'">here</a>!' +

              '\n\n<p style="font-size: 0.75em;">To disable notifications, please visit the <a href="https://www.dreambridge.io/myprofile">My Profile</a> page to alter your Notification Settings.</p>' +

              '\n\n\n<p style="font-size: 0.75em;">This email, and any information contained within it, is meant solely for the eyes of the intended recipient. If you are receiving this email in error, please disregard and dispose of this email immediately.</p>',

              text: 'Congratulations!\n\nYour Campaign: ' + result.Item.info.campaignName + ' has received a new donation of ' + web3.utils.fromWei(eventResult.returnValues._amount)+' Ether!'

            }

          }



          transporter.sendMail(messageOptions, (error,info) => {

            if(error){

              return console.log(error);

            } else {



                return console.log('Donation Notification Sent for: ' + eventResult.returnValues._campaign);

            }

        });

      } else {return;}

    } else {

      return;

    }

    });



  },

  _statusUpdateNotification: (address, status, previous) => {

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

  },



  }



  function _statusUpdates() {

            updateClass._updateConfig();

                var params = {

                    TableName: profileTable,

                    ProjectionExpression: "profileAddress, cStatus"

                  }

                docClient.scan(params, function(e,r){

                  if(!e){

                    var resultCount = 0;

                    r.Items.forEach(function(d){

                      let campaignCon = new web3.eth.Contract(campaignABI, d.profileAddress);

                      campaignCon.methods.campaignStatus().call(function(e,status){

                      if(!e && status){

                      if (status !== 'undefined'){

                      var currentStatus = campaignStatusM[status];

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

                            return console.log('Error',d.profileAddress);

                          } else {

                            console.log('Updated: ' + d.profileAddress + ' to: ' + currentStatus);

                            MCP._statusUpdateNotification(d.profileAddress, currentStatus, prevStatus);

                          }

                        });

                      }

                  } else {

                    return console.log('Status not found');

                  }

                } else{

                  return;

                }

                  });



                });

              }

            });



      }



var updateClass = {

  _updateBalanceSupporters : function(address) {

    let campaignCon = new web3.eth.Contract(campaignABI, address);

    campaignCon.methods.campaignInformation().call(function(e,d){

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

            balance = d[3];

            supporters = d[6];

            duration = d[4];

            if (info.Item.info.campaignDuration !== 'undefined' && info.Item.info.campaignDuration > 0) {



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

  _updateTimeRemaining : (address) => {

    let campaignCon = new web3.eth.Contract(campaignABI, address);

    campaignCon.methods.campaignInformation().call(function(e,d){

      if(!e && d !== 'undefined'){

        var timeRemaining = d[8];

        var status = campaignStatusM[d[9]];

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

  _updateConfig: () => {

    web3.eth.getBlockNumber(function(e,blockNumber){

      if(e){
        return console.log('Error fetching BlockNumber');

      } else {

        config.ETH.lastBlock = blockNumber;

        fs.writeFile(configFile, JSON.stringify(config, null, 2), function(e){

          if(e) return console.log('Unable to update Config File - ', e);

        });

      }

  });

},

  _logDonation: (amount) => {

    let _amount = parseFloat(amount);

    config.log.Donations += _amount;

    fs.writeFile(configFile, JSON.stringify(config, null, 2), function(e){

      if(e) return console.log('Unable to update Config File - ', e);

    });

  },

  _logDate: () => {

    let date = new Date();

    date = date.toString();

    config.log.listenerStarted = date;

    fs.writeFile(configFile, JSON.stringify(config, null, 2), function(e){

      if(e) return console.log('Unable to update Config File - ', e);

    });

  }

};



function initiateListener() {

  console.log('\n\nPhase 3: Starting Main Application\n\n');

  updateClass._logDate();

  update = setInterval(_statusUpdates,15000);

  listener = setInterval(listening, 30000);



  console.log('Listener Initiated');



  factory.events.allEvents().on('data', event => {

    let foundEvent = event.event;

    switch(foundEvent){

      case 'campaignLaunched':

      console.log('Campaign Launched:',event.returnValues._newCampaign);

        MCP._insertToAWS(event);

        break;

      case 'DonationMade':

        console.log('Donation to:',event.returnValues._campaign,'-',web3.utils.fromWei(event.returnValues._amount),'Ether');

        updateClass._logDonation(web3.utils.fromWei(event.returnValues._amount));

        MCP._donationNotification(event);

    }

  });

}



function listening() {

  web3.eth.net.isListening(function(e,d){

    if(!e){

      let listening = d;

      if(listening === true){

        return;

      } else {

        listener = clearInterval(listener);

        update = clearInterval(update);

        console.log('Websocket Not Connected...\nReinitializing...');

        initiateListener();

      }

    }

  });

}
