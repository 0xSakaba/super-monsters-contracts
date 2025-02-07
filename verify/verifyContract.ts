import hre from "hardhat";
import { sepolia_verify_address } from "../const";

const arg1 =
  "ipfs://bafkreidhsz4oudhuy3oz56quuqkvq4twnoetdsyc43vqwqmxyfzwarej7i";
async function main() {
  await hre.run("verify:verify", {
    address: "0xC361e1E7E59F2430F4e098AA614d6EF999261dB1",
    constructorArguments: [arg1],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
