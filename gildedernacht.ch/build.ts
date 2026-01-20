import fs from "fs";
import path from "path";

fetch("https://elysium.gildedernacht.ch/calendar/v2/gilde.ics").then(
  async (result) => {
    if (result.ok) {
      fs.writeFile(
        path.join(process.cwd(), "gildedernacht.ch/public", "test.ics"),
        await result.text(),
        () => {},
      );
      fs.writeFile(
        path.join(
          process.cwd(),
          "gildedernacht.ch/public",
          "gilden-kalender.ics",
        ),
        await result.text(),
        () => {},
      );
    }
  },
);
