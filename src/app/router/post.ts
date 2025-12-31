import { os } from "@orpc/server";
import z from "zod";

export const getPosts = os
  .route({
    method: "GET",
    path: "/posts",
    summary: "Get all posts",
    tags: ["posts"],
  })
  .input(z.void())
  .output(z.void())
  .handler(async ({ input }) => {
    console.log(input);
  });
