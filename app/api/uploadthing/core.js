import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/utils/uploadthing"; // If @ works

// If @ doesn't work, replace with correct relative path:
import { ourFileRouter } from "../../../_utils/uploadthing"; // ✅ use this if @ fails

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
