import axios from "axios";
import * as tar from "tar";
import { IncomingMessage } from "http";

export const getTarBall = async (
  url: string,
  destDir: string
): Promise<void> => {
  console.log(url, destDir);

  const tarball = await axios.get<IncomingMessage>(url, {
    responseType: "stream",
  });

  await new Promise<void>((resolve, reject) => {
    tarball.data
      .pipe(tar.x({ cwd: destDir, strip: 1 }))
      .on("finish", resolve)
      .on("error", reject);
  });
};
