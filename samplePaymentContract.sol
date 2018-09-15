pragma solidity ^0.4.24;
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract paymentContract {

    using SafeMath for uint256;

    address arbiter;
    address coldStorage;
    uint opThreshold;

    modifier onlyOwner() {
      require(msg.sender === arbiter || msg.sender === coldStorage);
      _;
    }

    constructor(address _arbiter, address _coldStorage, uint _threshold) public {
        arbiter = _arbiter;
        coldStorage = _coldStorage;
        opThreshold = _threshold * 1 ether;
    }

    function () public payable {
        distribute();
    }

    function distribute() internal {
        if(arbiter.balance < opThreshold) { // if the arbiter wallet is less than the opThreshold
            if(address(this).balance < (opThreshold.sub(arbiter.balance)){ //check to see if the paymentContract balance will fully fill the Arbiter wallet
                arbiter.transfer(address(this).balance);// if not, send everythign from the paymentContract
            } else { // otherwise,
                arbiter.transfer(opThreshold.sub(arbiter.balance)); //fill the arbiter wallet to the opThreshold
                coldStorage.transfer(address(this).balance); // then send the remaining balance to coldStorage.
            }
        } else { //otherwise, if the arbiter wallet is at or above the opThreshold
            coldStorage.transfer(address(this).balance); // send the balance to the coldStorage wallet.
        }
    }
}
