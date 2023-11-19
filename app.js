// Import Push SDK & Ethers
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { EVENTS, createSocketConnection } from "@pushprotocol/socket";

const initialize = async (signer) => {
  // Initialize wallet user
  // 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps
  const user = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });

  return user;
};

const onFirstConnect = async () => {
  /*
        initialize user
        loop through nfts
        chatler içinde o nft için olan varsa dahil et bitir
        yoksa o koleksiyon için grup oluştur
    */
};

const sendMessage = async (user, reciever, content) => {
  const stream = await user.initStream([CONSTANTS.STREAM.CHAT]);
  // Configure stream listen events and what to do

  stream.on(CONSTANTS.STREAM.CHAT, (message) => {
    console.log(message);
  });
  // Connect Stream
  stream.connect();
  const aliceMessagesBob = await user.chat.send(reciever, content);
};

const fetchAllChats = async (user) => {
  const chats = await user.chat.list("CHATS");

  return chats;
};

const attendToGroup = async (user, groupChatId) => {
  const joinGroup = await user.chat.group.join(groupChatId);
};

const createNormalGroup = async (
  user,
  groupName,
  groupDescription,
  groupImage,
  members,
  admins
) => {
  const newGroup = await user.chat.group.create(groupName, {
    description: groupDescription,
    image: groupImage,
    members: members,
    admins: admins,
    private: false,
  });

  return newGroup;
};

const createGroupToCollection = async (
  user,
  groupName,
  admins,
  members,
  chain_standart,
  chain_id,
  contract,
  description,
  image
) => {
  // Creating your token gated community
  const createTokenGatedGroup = await user.chat.group.create(groupName, {
    description: description ? description : null,
    image: image ? image : null,
    members: [],
    admins: [],
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
                  subcategory: "holder", // define if you are checking 'holder'
                  data: {
                    contract:
                      //  `${chain_standart}:${chain_id}:${contract}`,
                      `${chain_standart}:${chain_id}:${contract}`,
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

  return createTokenGatedGroup;
};

// const admin = ethers.Wallet.createRandom();
// console.log("admin pkey", admin.privateKey);
// const alice = ethers.Wallet.createRandom();
// console.log("alice pkey", alice.privateKey);

// const bob = ethers.Wallet.createRandom();
// console.log("bob pkey", bob.privateKey);

const admin = new ethers.Wallet(
  "0x0347f649a550b01f74b24d708ee56d5800887b15bf81206f3149ffb0da79145b"
);
const alice = new ethers.Wallet(
  "0xafdf74eb8c1cc91ea96f2ad21a988927b09bd9bef2afef4a514955c6004ad342"
);

const bob = new ethers.Wallet(
  "0x1aa87ce322b0b278b2046a804280ab271d00b34272cf7b316d512df682f02dd6"
);

const userAdmin = await initialize(admin);
const userAlice = await initialize(alice);
const userBob = await initialize(bob);
// This will be the wallet address of the recipient

// const messageBob = await sendMessage(userAlice, bob.publicKey, {
//   content: "1Gm gm! It's a me... Mario",
// });
// const messageBob3 = await sendMessage(userBob, alice.publicKey, {
//   content: "3another message of me",
// });

// const messageBob2 = await sendMessage(userAlice, bob.publicKey, {
//   content: "2another message of me",
// });

const chats = await fetchAllChats(userAlice);
const chatRequest = await userAlice.chat.list("REQUESTS");

// console.log(chats);
// console.log("------");

const messageBob2 = await sendMessage(
  userAlice,
  "0b3522d4260e81138e0d336bb1c1cf5ca062219217fd570db37c5b937f83d0ef",
  {
    content: "ahmet enessss",
  }
);

const aliceChatHistory = await userAlice.chat.history(
  "0b3522d4260e81138e0d336bb1c1cf5ca062219217fd570db37c5b937f83d0ef"
);

console.log(aliceChatHistory);

// const messageBob3 = await sendMessage(
//   userAlice,
//   "chatid:a68d7b9edebfc0019fa24b8dc6131ef734f912aa575e00399e0132f895d01228",
//   {
//     content: "3another message of me",
//   }
// );

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
//   //   "eip155",
//   //   "1",
//   //   "0x431dcee2e2c267f32dc4349619000b6cef1ba932",
//   "eip155:1:0x431dcee2e2c267f32dc4349619000b6cef1ba932"
// );
// console.log(group);

// const chatsOfAdmin = await fetchAllChats(userAdmin);
// console.log(chatsOfAdmin);

// const normalGroup = await createNormalGroup(
//   userAdmin,
//   "Grup 2",
//   "Hey Hey HEYYO",
//   null,
//   [],
//   []
// );
// console.log("GRUPPP: ", normalGroup);
// await attendToGroup(
//   userAlice,
//   "0b3522d4260e81138e0d336bb1c1cf5ca062219217fd570db37c5b937f83d0ef"
// );

// console.log("after:", normalGroup.members);
// const chats = await fetchAllChats(userAdmin);
// console.log(
//   chats[0].groupInformation.members,
//   chats[1].groupInformation.members
// );

// const aliceChatHistory = await userAlice.chat.history();
// console.log(aliceChatHistory);
