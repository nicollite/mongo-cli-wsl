import { program } from "commander";
import { exec, ShellString } from "shelljs";

program.version("1.0.0");

program
  .command("start")
  .description("starts Mongo DB")
  .action(() => {
    log(exec("sudo service mongod start"));
  });

program
  .command("stop")
  .description("stops Mongo DB")
  .action(() => {
    log(exec('mongo admin --eval "db.shutdownServer()"'));
  });

program
  .command("repair-server-pid-error")
  .description(
    "try to repair ERROR: Cannot write pid file to /var/run/mongodb/mongod.pid: No such file or directory",
  )
  .action(() => {
    log(exec("sudo kill $(sudo lsof -t -i:27017)"));
    log(exec("sudo rm -rf /tmp/mongodb-27017.sock"));
    log(exec("sudo rm -f /var/lib/mongo/mongod.lock"));
    log(exec("sudo rm -f /var/run/mongodb/mongod.pid"));
    log(exec("sudo mkdir -p  /var/run/mongodb/"));
    log(exec("sudo touch /var/run/mongodb/mongod.pid"));
    log(exec("sudo chown -R  mongodb:mongodb /var/run/mongodb/"));
    log(exec("sudo chown mongodb:mongodb /var/run/mongodb/mongod.pid"));
  });

function log(shellStr: ShellString) {
  const stringToLog = shellStr.stdout || shellStr.stderr || shellStr;
  console.log(stringToLog);
}

/**
 * Run the cli program with commander in async
 */
export async function runCliProgram(): Promise<void> {
  await program.parseAsync(process.argv);
}
