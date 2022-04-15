pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "hardhat/console.sol";
/**
 * @title Monaliza
 * Monaliza - the contract for non-fungible Monaliza NFTs.
 */
contract Monaliza is BaseRelayRecipient, ERC721Tradable {
    //using Counters for Counters.Counter;
    //Counters.Counter private _tokenIds;
    string private _localBaseURI;
    mapping (uint256 => string) private _tokenURIs;
    //mapping (uint256 => string) private _tokenURIs;
    //mapping (address => bool) public allowedAddresses;
     string public override versionRecipient = "2.2.0";
     
     constructor(string memory tokenName, string memory symbol, address _proxyRegistryAddress, address forwarder)
        ERC721Tradable(tokenName, symbol, _proxyRegistryAddress)
    {
        _setTrustedForwarder(forwarder); 
        console.log("Deploying contract for", tokenName);
    }

          

    function _msgData() internal view override(Context, BaseRelayRecipient) returns (bytes memory) {
        return BaseRelayRecipient._msgData();
    }

    function _msgSender() internal view override(ERC721Tradable, BaseRelayRecipient) returns (address ret) {
        return BaseRelayRecipient._msgSender();
    }

    /*function setAddressesAllowedForMinting(address[] memory addressesAllowedForMinting) public virtual {
        //require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        //addressesAllowedForMinting = addressesAllowedForMinting;
        for (uint i=0; i < addressesAllowedForMinting.length; i++) {
            allowedAddresses[addressesAllowedForMinting[i]] = true;
        }
    }

    function isAddressAllowed(address to) public view returns (bool){
        return allowedAddresses[to];
    }*/

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
    mapping (string => address) public lastContractAddressesWithUniqs;
    //uint256 public lastTokenID; 
    struct MintedTokenStruct {
        Monaliza contractAddress;
        address to;
        uint256 tokenID;
    }
    MintedTokenStruct[] mintedTokenStructs;

    //mapping (uint256 => mintedTokenStruct) public lastTokenIDsStructs;
    event Mint(Monaliza tokenAddress, uint256 newItemId); 
    event DeployContract(string name, string symbol, address newContract); 
    //event AddAirDrop(address tokenAddress); 
    event TransferToken(Monaliza tokenAddress, address toAddress, uint256 tokenId);
    address owner;

    constructor() public{
      owner = msg.sender;
    }   


    function getContractCount() public view returns(uint contractCount) {
        return contracts.length;
    }

    function getLastContractAddressWithUniq(string memory uniq) public view returns(address lastContract) {
        return lastContractAddressesWithUniqs[uniq];
    }

    function deployNFTContract(string memory name, string memory symbol, address registryAddress, address forwarder, string memory uniq) public returns(address newContract){
         Monaliza c = new Monaliza(name, symbol, registryAddress, forwarder);
         //c.setLocalBaseURI(baseURI);
         address cAddr = address(c);
         contracts.push(cAddr);
         lastContractAddressesWithUniqs[uniq] = cAddr;
         //c.mint(to, tokenURI);   
         emit DeployContract(name, symbol, cAddr);
         return cAddr;
    }

    /*function addAirDrop(Monaliza tokenAddress, address[] memory addressesAllowedForMinting) public returns(address contractAddress){
         require(msg.sender == owner);
         tokenAddress.setAddressesAllowedForMinting(addressesAllowedForMinting);
         //c.setLocalBaseURI(baseURI);
         address cAddr = address(tokenAddress);
         emit AddAirDrop(cAddr);
        return cAddr;
    }*/

    function mintNFT(Monaliza tokenAddress, address to, string memory tokenURI) public returns(uint256 newItemId) {
        require(msg.sender == owner);

        //if(tokenAddress.isAddressAllowed(to)){
                newItemId = tokenAddress.mintTo(to);
                tokenAddress._setTokenURI(newItemId, tokenURI);
                mintedTokenStructs.push(MintedTokenStruct(tokenAddress, to, newItemId));

                emit Mint(tokenAddress, newItemId);
                return newItemId;
        //}

    }   

    function transferToken(Monaliza tokenAddress, address from, address to, uint256 tokenID) public returns(uint256 newItemId) {
        //require(msg.sender == tokenAddress.owner());
        //tokenAddress.approve(to, tokenID);
        tokenAddress.safeTransferFrom(from, to, tokenID);
        emit TransferToken(tokenAddress, to, tokenID);
        return tokenID;
    }     

    function getLastTokenID(Monaliza contractAddress, address to) public view returns(uint256 newItemId) {
        uint256 count =  mintedTokenStructs.length;
        for(uint256 i=0; i < count; i++){
            if ((mintedTokenStructs[i].contractAddress == contractAddress) && (mintedTokenStructs[i].to == to)){
                return mintedTokenStructs[i].tokenID;
            }
        }
    }    

    /*function isAddressAllowedForMinting(Monaliza contractAddress, address userAddress) public view returns(bool) {
        return contractAddress.isAddressAllowed(userAddress);  
    }*/   

    function getBaseTokenURI(Monaliza contractAddress) public view returns(string memory baseURI) {
        baseURI = contractAddress.baseTokenURI();
        return baseURI;
    }    

}
