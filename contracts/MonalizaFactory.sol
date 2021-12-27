pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";

/**
 * @title Monaliza
 * Monaliza - the contract for non-fungible Monaliza NFTs.
 */
contract Monaliza is ERC721Tradable {
    //using Counters for Counters.Counter;
    //Counters.Counter private _tokenIds;
    string private _localBaseURI;
    mapping (uint256 => string) private _tokenURIs;
    //mapping (uint256 => string) private _tokenURIs;

    constructor(string memory tokenName, string memory symbol, address _proxyRegistryAddress)
        ERC721Tradable(tokenName, symbol, _proxyRegistryAddress)
    {}

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) public virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
        _localBaseURI = _tokenURI;
    }
    
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return  _tokenURIs[tokenId];
    }

    function baseTokenURI() override public view returns (string memory) {
        //return _tokenURIs[_tokenIds.current()];
        //return "https://creatures-api.opensea.io/api/creature/";
        return _localBaseURI;
    }

    function contractURI() public pure returns (string memory) {
        return "https://monaliza-api.opensea.io/contract/opensea-monaliza";
    }

    /*function setLocalBaseURI(string memory baseURI) public{
        _localBaseURI = baseURI;
    }*/
    
}

contract MonalizaFactory {
    address[] public contracts;
    address public lastContractAddress; 
    //uint256 public lastTokenID; 
    mapping (address => uint256) public lastTokenIDs;
    event Mint(Monaliza tokenAddress, uint256 newItemId); 
    event DeployContract(string name, string symbol, address newContract); 

    function getContractCount() public view returns(uint contractCount) {
        return contracts.length;
    }

    function getLastContractAddress() public view returns(address cAddr) {
        return lastContractAddress;
    }

    function deployNFTContract(string memory name, string memory symbol, address registryAddress) public returns(address newContract){
         Monaliza c = new Monaliza(name, symbol, registryAddress);
         //c.setLocalBaseURI(baseURI);
         address cAddr = address(c);
         contracts.push(cAddr);
         lastContractAddress = cAddr;
         //c.mint(to, tokenURI);   
         emit DeployContract(name, symbol, cAddr);
         return cAddr;
    }

    function mintNFT(Monaliza tokenAddress, address to, string memory tokenURI) public returns(uint256 newItemId) {
 
        newItemId = tokenAddress.mintTo(to);
        tokenAddress._setTokenURI(newItemId, tokenURI);
        lastTokenIDs[address(tokenAddress)] = newItemId;

        emit Mint(tokenAddress, newItemId);
        return newItemId;
    }    

    function getLastTokenID(Monaliza contractAddress) public view returns(uint256 newItemId) {
        newItemId = lastTokenIDs[address(contractAddress)];
        return newItemId;
    }    

    function getBaseTokenURI(Monaliza contractAddress) public view returns(string memory baseURI) {
        baseURI = contractAddress.baseTokenURI();
        return baseURI;
    }    

}
