import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { WalletGraph } from "../target/types/wallet_graph";

describe("wallet-graph", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const walletGraph = anchor.workspace.WalletGraph as Program<WalletGraph>;

  it("make connection", async () => {
    // Add your test here.
    let from = provider.wallet.publicKey;
    let to = anchor.web3.Keypair.generate().publicKey;
    let connection = await findConnection(from, to);
    const tx = await walletGraph.rpc.makeConnection({
      accounts: {
        from: provider.wallet.publicKey,
        to: to,
        connection: connection.address,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
    console.log("Your transaction signature", tx);
  });

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
