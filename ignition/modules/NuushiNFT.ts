// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const input_baseTokenURI =
  "ipfs://bafkreidhsz4oudhuy3oz56quuqkvq4twnoetdsyc43vqwqmxyfzwarej7i";

const NuushiModule = buildModule("NuushiModule", (m) => {
  const baseTokenURI = m.getParameter("baseTokenURI", input_baseTokenURI);

  const Nuushi = m.contract("NuushiNFT", [baseTokenURI]);

  return { Nuushi };
});

export default NuushiModule;
