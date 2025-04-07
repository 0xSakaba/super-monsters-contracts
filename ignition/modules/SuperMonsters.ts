// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const input_baseTokenURI =
  "ipfs://bafkreih2qwowvb7v6x7tgry4fsbbac7go2j3khbo2jgmua5acnxa3rb33u";

const SuperMonstersModule = buildModule("SuperMonsterModule", (m) => {
  const baseTokenURI = m.getParameter("baseTokenURI", input_baseTokenURI);

  const SuperMonsters = m.contract("SuperMonsters", [baseTokenURI]);

  return { SuperMonsters };
});

export default SuperMonstersModule;
