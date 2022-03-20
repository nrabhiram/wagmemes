// SPDX-License-Identifier: UNIDENTIFIED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";

/// @title A contract that mints memes as NFTs
/// @author Abhiram Reddy
/// @notice Currently, the contract only allows you to mint memes from imgflip
/// @dev The image URL links to imgflip so the token's metdata isn't completely on-chain
contract MemeNFT is ERC721URIStorage {
    constructor() ERC721("Meme", "MEME") {
        console.log("This contract lets you mint memes as NFTs!");
    }
    /// @dev This library allows you to sidestep the SafeMath overflow check (since you can only perform increments of one) and save gas. You can read more about it here: https://docs.openzeppelin.com/contracts/3.x/api/utils#Counters
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _totalTokens;

    /// @notice this event is emitted when a token is minted
    event NewMemeMinted(address sender, uint256 tokenId);

    /// @notice slice a specific section of a word from the beginning
    /// @param begin the index of the starting letter of the sliced section
    /// @param end the index of the final letter of the sliced section
    /// @return string sliced from the beginning index to the ending index
    /// @dev the index starts from the beginning, i.e. from left to right
    function _sliceFromBeginning(uint256 begin, uint256 end, string memory text) private pure returns (string memory) {
        bytes memory a = new bytes(end-begin+1);
        for(uint i=0;i<=end-begin;i++){
            a[i] = bytes(text)[i+begin-1];
        }
        return string(a);    
    }

    /// @notice slice a specific section of a word from the end
    /// @param begin the index of the final letter of the sliced section
    /// @param end the index of the first letter of the sliced section
    /// @return string sliced from the ending index to the beginning index
    /// @dev the index starts from the end, i.e. from right to left
    function _sliceFromEnd(uint256 begin, uint256 end, string memory text) private pure returns (string memory) {
        bytes memory a = new bytes(end-begin+1);
        for(uint i=0; i <= end-begin; i++) {
            a[i] = bytes(text)[i+bytes(text).length-end];
        }
        return string(a);
    }

    /// @notice check if the image in the token's metadata is valid
    /// @param tokenImage the token's image URL
    /// @dev check if the image URL ends with ".jpg" and begins with "https://i.imgflip.com/"
    modifier isImageValid(string memory tokenImage) {
        require(keccak256(abi.encodePacked(_sliceFromBeginning(1, 22, tokenImage))) == keccak256(abi.encodePacked("https://i.imgflip.com/")), "Image URL isn't valid. Please use a meme from Imgflip.");
        require(keccak256(abi.encodePacked(_sliceFromEnd(1, 4, tokenImage))) == keccak256(abi.encodePacked(".jpg")), "Image URL isn't a JPEG. Please ensure that it links to the meme's image file.");
        _;
    }

    /// @notice mint a meme as an NFT
    /// @param memer the address that will own the minted NFT
    /// @param tokenName the name of the meme
    /// @param tokenDescription a brief description of the meme
    /// @param tokenImage the meme's image URL
    /// @dev although the rest of the metadata is stored completely on-chain, we're only storing the image URL and not the image itself 
    function mintMemeNFT(
        address memer, 
        string memory tokenName, 
        string memory tokenDescription, 
        string memory tokenImage
    ) public isImageValid(tokenImage) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        tokenName,
                        '", "description": "',
                        tokenDescription,
                        '", "image": "',
                        tokenImage,
                        '"}'
                    )
                )
            )
        );
        string memory finalTokenURI = string(abi.encodePacked("data:application/json;base64,", json));
        uint256 newTokenId = _tokenIds.current();
        _safeMint(memer, newTokenId);
        _setTokenURI(newTokenId, finalTokenURI);
        emit NewMemeMinted(msg.sender, newTokenId);
        _tokenIds.increment();
        _totalTokens.increment();
    }

    /// @notice find out the total number of tokens minted
    /// @return _totalTokens the total number of tokens minted so far
    /// @dev we return the value of a private counter variable that keeps track of the number of tokens minted
    function totalTokensMinted() public view returns (uint256) {
        uint256 numTokensMinted = _totalTokens.current();
        return numTokensMinted;
    }
}