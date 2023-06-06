import { MarkOrderAsApprovedCommand } from '../../dto/mark-order-as-approved.command';

export interface MarkOrderAsApprovedPort {
  execute(
    markOrderAsApprovedCommand: MarkOrderAsApprovedCommand,
  ): Promise<void>;
}
