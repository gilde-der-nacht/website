export type AstroHeading = {
  slug: string;
  text: string;
  depth: number;
};

export type TocConfig =
  | {
      startLevel: number;
      endLevel: number;
      ordered?: boolean;
    }
  | true;

export type TocView = {
  text: string;
  slug: string;
  sub: TocView[];
};

export type TocConfigView =
  | {
      render: true;
      startLevel: number;
      endLevel: number;
      ordered: boolean;
      toc: TocView[];
    }
  | { render: false };

function buildToc(headings: AstroHeading[]): TocView[] {
  const startHeading = headings[0]?.depth;
  const toc: TocView[] = [];
  const parentHeadings = new Map();
  headings.forEach((h) => {
    const heading: TocView & AstroHeading = { ...h, sub: [] };
    parentHeadings.set(heading.depth, heading);
    if (heading.depth === startHeading) {
      toc.push(heading);
    } else {
      parentHeadings.get(heading.depth - 1).sub.push(heading);
    }
  });
  return toc;
}

export function generateTocView(
  headings: AstroHeading[],
  startLevel: number,
  endLevel: number,
): TocView[] {
  const filteredEntries = headings.filter(
    (heading) => heading.depth >= startLevel && heading.depth <= endLevel,
  );
  return buildToc(filteredEntries);
}
