pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Monaliza is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    constructor(string memory tokenName, string memory symbol) public ERC721(tokenName, symbol) {
        //_setBaseURI("ipfs://");
    }

    function mint(address to, string memory tokenURI) public returns (uint256){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    /*function tokenURI(uint256 _tokenId) external view returns (string memory);*/

}

contract MonalizaContractFactory {
    address[] public contracts;
    address public lastContractAddress; 
    event Mint(uint256 newItemId); 

    function getContractCount() public view returns(uint contractCount) {
        return contracts.length;
    }

    function deployNFTContract(string memory name, string memory symbol) public returns(address newContract){
         Monaliza c = new Monaliza(name,symbol);
         address cAddr = address(c);
         contracts.push(cAddr);
         lastContractAddress = cAddr;
         //c.mint(to, tokenURI);   
         return cAddr;
    }

    function mintNFT(Monaliza tokenAddress, address to, string memory tokenURI) public returns(uint256 newItemId) {

      newItemId = tokenAddress.mint(to, tokenURI);
      emit Mint(newItemId);
      return newItemId;
    }    



}
