import { MarkOrderAsPaidCommand } from "../../dto/mark-order-as-paid.command";

export interface MarkOrderAsPaidPort {
  execute(markOrderAsPaidCommand: MarkOrderAsPaidCommand): Promise<void>;
}