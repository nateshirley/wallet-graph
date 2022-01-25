import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { WalletGraph } from "../target/types/wallet_graph";
import * as assert from "assert";

describe("wallet-graph", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const walletGraph = anchor.workspace.WalletGraph as Program<WalletGraph>;

  it("make & revoke a connection", async () => {
    // Add your test here.
    let from = provider.wallet.publicKey;
    let to = anchor.web3.Keypair.generate().publicKey;
    let connection = await findConnection(from, to);

    const make = await walletGraph.rpc.makeConnection({
      accounts: {
        from: provider.wallet.publicKey,
        to: to,
        connection: connection.address,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
    console.log("make sig:", formatSig(make));

    let newConnectionInfo = await walletGraph.account.connection.fetch(
      connection.address
    );
    //console.log(connectionInfo);
    assert.ok(newConnectionInfo.from.equals(from));
    assert.ok(newConnectionInfo.to.equals(to));

    const revoke = await walletGraph.rpc.revokeConnection(connection.bump, {
      accounts: {
        from: provider.wallet.publicKey,
        to: to,
        connection: connection.address,
      },
    });
    console.log("revoke sig:", formatSig(revoke));

    await walletGraph.account.connection
      .fetch(connection.address)
      .then((info) => {
        //should be none
      })
      .catch((err) => {
        console.log("received expected error");
      });
  });

  const formatSig = (signature: string) => {
    return signature.substring(0, 4) + "..." + signature.slice(-4);
  };

  const findConnection = async (from: PublicKey, to: PublicKey) => {
    return await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("connection"),
        from.toBuffer(),
        to.toBuffer(),
      ],
      walletGraph.programId
    ).then(([address, bump]) => {
      return {
        address: address,
        bump: bump,
      };
    });
  };
});
