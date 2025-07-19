import { inngest } from "@/inngest/client";
import { BaseContext } from "inngest";

export async function sleep(seconds: number, step: BaseContext<typeof inngest>['step']) {
  await step.sleep("wait-a-moment", `${seconds}s`);
}