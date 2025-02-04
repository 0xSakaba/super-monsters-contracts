import hre from "hardhat";
import { sepolia_verify_address } from "../const";

const arg1 =
  "ipfs://bafkreidhsz4oudhuy3oz56quuqkvq4twnoetdsyc43vqwqmxyfzwarej7i";
async function main() {
  await hre.run("verify:verify", {
    address: "0xB887899Bc9B7563ffa7d5421d5b8Cf3B43cCC8Cf",
    constructorArguments: [arg1],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
