// Import Push SDK & Ethers
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

const initialize = async (signer) => {
  // Initialize wallet user
  // 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps
  const user = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });

  return user;
};

const sendMessage = async (user, reciever, content) => {
  const stream = await userAlice.initStream([CONSTANTS.STREAM.CHAT]);
  // Configure stream listen events and what to do

  stream.on(CONSTANTS.STREAM.CHAT, (message) => {
    console.log(message);
  });
  // Connect Stream
  stream.connect();
  const aliceMessagesBob = await userAlice.chat.send(bobWalletAddress, content);
  console.log("123", aliceMessagesBob);
};

const fetchAllChats = async (user) => {
  const chats = await user.chat.list("CHATS");

  return chats;
};

const createGroupToCollection = async (
  user,
  groupName,
  admins,
  members,
  contract,
  description,
  image
) => {
  // Creating your token gated community
  const createTokenGatedGroup = await user.chat.group.create(groupName, {
    description: description ? description : null,
    image: image ? image : null,
    members: members,
    admins: admins,
    private: true,
    rules: {
      entry: {
        // permission object
        conditions: {
          // conditions object
          any: [
            // conditions namespace decider - Either group owner / admin invites the user or the user has $PUSH on Ethereum or Polygon
            {
              // decider 1 - If admin or owner invites someone
              any: [
                {
                  // criteria 1
                  type: "PUSH",
                  category: "INVITE",
                  subcategory: "DEFAULT",
                  data: {
                    inviterRoles: ["ADMIN", "OWNER"],
                  },
                },
              ],
            },
            {
              any: [
                {
                  // criteria 1
                  type: "PUSH", // define type that rules engine should go for
                  category: "ERC721", // define it's ERC20 token that you want to check, supports ERC721 as well
                  //   subcategory: "holder", // define if you are checking 'holder'
                  data: {
                    contract: contract,
                    comparison: ">=", // what comparison needs to pass
                    amount: 1, // amount that needs to passed
                    decimals: 18,
                  },
                },
              ],
            },
          ],
        },
      },
      // since we are not defining chat permissions, it means that any user who is part of the group can chat
    },
  });
};

const admin = ethers.Wallet.createRandom();
const alice = ethers.Wallet.createRandom();
const bob = ethers.Wallet.createRandom();
const userAdmin = await initialize(admin);
const userAlice = await initialize(alice);
const userBob = await initialize(bob);
// This will be the wallet address of the recipient

const bobWalletAddress = "0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666";

// const messageBob = sendMessage(userAlice, bob.publicKey, {
//   content: "Gm gm! It's a me... Mario",
// });

// const aliceChats = await fetchAllChats(userAlice);
// const bobChats = await fetchAllChats(userBob);

// console.log(aliceChats);
// console.log(bobChats);

// const group = await createGroupToCollection(
//   userAdmin,
//   "NFTKOLEKSİYON1",
//   [],
//   //   [alice.publicKey, bob.publicKey],
//   [],
//   "eip155:80001:0x431dcee2e2c267f32dc4349619000b6cef1ba932"
// );

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

// Initialize wallet user
// 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps

// Creating your token gated community
const createTokenGatedGroup = await userAlice.chat.group.create(
  "Push Community",
  {
    description: null, // provide short description of group
    image: null, // provide base64 encoded image
    members: [], // not needed, rules define this, can omit
    admins: [], // not needed as per problem statement, can omit
    private: true,
    rules: {
      entry: {
        // entry is based on conditions
        conditions: {
          any: [
            // any of the decider should allow entry
            {
              // decider 1 - If admin or owner invites someone
              any: [
                {
                  // criteria 1
                  type: "PUSH",
                  category: "INVITE",
                  subcategory: "DEFAULT",
                  data: {
                    inviterRoles: ["ADMIN", "OWNER"],
                  },
                },
              ],
            },
            {
              // decicder 2 - If wallet holds 1 NFT on polygon testnet
              any: [
                {
                  // criteria 1
                  type: "PUSH", // define type that rules engine should go for
                  category: "ERC721", // define it's ERC20 token that you want to check, supports ERC721 as well
                  subcategory: "holder", // define if you are checking 'holder'
                  data: {
                    contract:
                      "eip155:80001:0x9105D95577575116948F5afcF479254f49F27939",
                    comparison: ">=", // what comparison needs to pass
                    amount: 1, // amount that needs to passed
                    decimals: 18,
                  },
                },
              ],
            },
          ],
        },
      },
    },
  }
);

console.log("Chat created successfully!", createTokenGatedGroup);
