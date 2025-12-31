import { os } from "@orpc/server";
import { getPosts } from "./post";

export const router = os.router({
  post: {
    getPosts,
  },
});
