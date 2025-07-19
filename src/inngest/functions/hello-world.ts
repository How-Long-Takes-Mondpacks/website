import { inngest } from "@/inngest/client";
import { sleep } from "@/inngest/utils";

//! DO NOT USE THIS FUNCTION IN INNGEST, THIS IS AN EXAMPLE FUNCTION
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await sleep(1, step)
    return { message: `Hello ${event.data.email}!` };
  },
);