import fs from "fs";
import path from "path";

fetch("https://elysium.gildedernacht.ch/calendar/gilde.ics").then(
  async (result) => {
    const text = await result.text();

    if (result.ok) {
      fs.writeFile(
        path.join(process.cwd(), "gildedernacht.ch/public", "test.ics"),
        text,
        () => {},
      );
      fs.writeFile(
        path.join(
          process.cwd(),
          "gildedernacht.ch/public",
          "gilden-kalender.ics",
        ),
        text,
        () => {},
      );
    }
  },
);
