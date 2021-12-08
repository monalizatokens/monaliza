pragma solidity  ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Monaliza is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping (uint256 => string) private _tokenURIs;


    constructor(string memory tokenName, string memory symbol) public ERC721(tokenName, symbol) {
        //_setBaseURI("ipfs://");
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
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

contract MonalizaFactory {
    address[] public contracts;
    address public lastContractAddress; 
    event Mint(Monaliza tokenAddress, uint256 newItemId); 
    event DeployContract(string name, string symbol, address newContract); 

    function getContractCount() public view returns(uint contractCount) {
        return contracts.length;
    }

    function deployNFTContract(string memory name, string memory symbol) public returns(address newContract){
         Monaliza c = new Monaliza(name,symbol);
         address cAddr = address(c);
         contracts.push(cAddr);
         lastContractAddress = cAddr;
         //c.mint(to, tokenURI);   
         emit DeployContract(name, symbol, cAddr);
         return cAddr;
    }

    function mintNFT(Monaliza tokenAddress, address to, string memory tokenURI) public returns(uint256 newItemId) {

      newItemId = tokenAddress.mint(to, tokenURI);
      emit Mint(tokenAddress, newItemId);
      return newItemId;
    }    



}
