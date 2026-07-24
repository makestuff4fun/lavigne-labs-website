export type LabNote = {
  date: string;
  title: string;
  body: string;
  image?: string;
};

// Short, human, behind-the-scenes entries. Newest first.
export const labNotes: LabNote[] = [
  {
    date: "2026-06-10",
    title: "Making a PCB that's also art",
    body: "Spent the weekend pushing soldermask and copper around purely for looks. There's something satisfying about a board that's fully functional and would also look good on a wall. Half the tricks I use for client work came out of experiments exactly like this.",
    image: "/work/pcb-artwork.png",
  },
  {
    date: "2026-05-22",
    title: "Bringing up a parallel 8080 LCD from scratch",
    body: "No library, no example code that matched my part — just the datasheet and a logic analyzer. Bus timing on these old parallel interfaces is fiddly, but there's a real joy in the moment the first pixels finally light up the way you intended.",
    image: "/work/lcd-8080.png",
  },
  {
    date: "2026-04-30",
    title: "Why I still build conference badges",
    body: "Badges are the perfect excuse to try a manufacturing idea at small scale with zero stakes. New assembly process, a weird connector, a tight panelization — if it works on a badge run, I'll trust it on a client's product.",
    image: "/work/digital-badge.png",
  },
  {
    date: "2026-04-08",
    title: "A keyboard is a great systems project",
    body: "Mechanical design, a switch matrix, firmware, an enclosure that has to feel right in the hand — a custom keyboard touches every discipline I use day to day. Great way to stay sharp between bigger projects.",
    image: "/work/keyboard.jpg",
  },
];
