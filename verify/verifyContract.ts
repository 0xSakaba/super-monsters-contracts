import hre from "hardhat";
import { sepolia_verify_address } from "../const";

async function main() {
  await hre.run("verify:verify", {
    address: sepolia_verify_address,
    // constructorArguments: [arg1, arg2],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
