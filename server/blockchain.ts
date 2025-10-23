import { createHash, randomBytes } from 'crypto';
import { db } from './db';
import { blockchainTransactions, insertBlockchainTransactionSchema } from '@shared/schema';
import { desc } from 'drizzle-orm';

export class BlockchainService {
  /**
   * Creates a cryptographic hash for blockchain verification
   */
  private static createHash(data: any): string {
    const hash = createHash('sha256');
    hash.update(JSON.stringify(data) + randomBytes(16).toString('hex'));
    return hash.digest('hex');
  }

  /**
   * Get the latest blockchain transaction to link the chain
   */
  private static async getLatestTransaction() {
    const [latest] = await db
      .select()
      .from(blockchainTransactions)
      .orderBy(desc(blockchainTransactions.timestamp))
      .limit(1);
    
    return latest;
  }

  /**
   * Record a blockchain transaction (immutable log)
   */
  static async recordTransaction(
    actorId: string,
    actionType: string,
    resourceType: string,
    resourceId: string,
    metadata: Record<string, any> = {}
  ) {
    const latest = await this.getLatestTransaction();
    const previousHash = latest?.transactionHash || 'genesis';

    const transactionData = {
      actorId,
      actionType,
      resourceType,
      resourceId,
      metadata,
      previousHash,
      timestamp: new Date(),
    };

    const transactionHash = this.createHash(transactionData);

    const [transaction] = await db
      .insert(blockchainTransactions)
      .values({
        transactionHash,
        actorId,
        actionType,
        resourceType,
        resourceId,
        metadata,
        previousHash,
      })
      .returning();

    return transaction;
  }

  /**
   * Create a blockchain hash for a resource (prescriptions, claims, etc.)
   */
  static createResourceHash(resourceData: any): string {
    return this.createHash(resourceData);
  }

  /**
   * Verify blockchain chain integrity
   */
  static async verifyChainIntegrity(): Promise<boolean> {
    const transactions = await db
      .select()
      .from(blockchainTransactions)
      .orderBy(blockchainTransactions.timestamp);

    for (let i = 1; i < transactions.length; i++) {
      const current = transactions[i];
      const previous = transactions[i - 1];

      if (current.previousHash !== previous.transactionHash) {
        return false;
      }
    }

    return true;
  }
}
