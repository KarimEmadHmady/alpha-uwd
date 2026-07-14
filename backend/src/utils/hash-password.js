import bcrypt from "bcrypt";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter password to hash: ", (password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("\nHashed password:");
  console.log(hashedPassword);
  rl.close();
});
