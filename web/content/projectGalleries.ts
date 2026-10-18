// Gallery images for each project; files live under web/public/work/<slug>/. Alt text describes only what is visible.
export type GalleryImage = { src: string; alt: string; width: number; height: number };

export const projectGalleries: Record<string, GalleryImage[]> = {
  "microscope-slider": [
    { src: "/work/microscope-slider/01.jpg", alt: "Workbench with a digital microscope on a sliding arm mounted under the shelf above a blue work mat, with test instruments stacked beside it.", width: 738, height: 1600 },
    { src: "/work/microscope-slider/02.jpg", alt: "Close view of the blue digital microscope hanging over the blue work mat, with a rail arm above it.", width: 738, height: 1600 },
    { src: "/work/microscope-slider/03.jpg", alt: "Microscope extended on a pale metal slide rail over the work mat, seen beside an oscilloscope and bench power supplies.", width: 738, height: 1600 },
    { src: "/work/microscope-slider/04.jpg", alt: "Low-angle view of a ring-lit microscope head on a rail mounted under the bench shelf, with cables and solder spools below.", width: 1080, height: 1080 },
    { src: "/work/microscope-slider/05.jpg", alt: "Wide view from the bench level of the microscope with its ring light on the sliding rail, above spools of solder and a blue mat.", width: 1600, height: 900 },
    { src: "/work/microscope-slider/06.jpg", alt: "Close view of a blue digital microscope camera hanging from a white sliding rail arm over a blue work mat with glasses, tweezers and cables.", width: 1024, height: 1024 },
  ],
  "micropython-system": [
    { src: "/work/micropython-system/01.jpg", alt: "A stack of small green circuit boards with white connector sockets, a microSD card and red knurled feet, photographed on a table.", width: 1595, height: 1600 },
    { src: "/work/micropython-system/02.jpg", alt: "Small colour display showing a battery gauge, numeric readouts and a speed figure, held in a metal bracket with a red part below.", width: 738, height: 1600 },
    { src: "/work/micropython-system/03.jpg", alt: "A hand holding a small circuit board with screw terminals, a connector and a black chip over a green cutting mat.", width: 1600, height: 738 },
    { src: "/work/micropython-system/04.jpg", alt: "A hand holding a green circuit board with a row of header pins and pads, above a handwritten page on a desk.", width: 738, height: 1600 },
  ],
  "camera-arm": [
    { src: "/work/camera-arm/01.jpg", alt: "Two-link arm with red joints and black tubes standing on a workbench in front of a lathe, lit with a blue background glow.", width: 1024, height: 683 },
    { src: "/work/camera-arm/02.jpg", alt: "Product shot of a black two-link arm with red joints, a camera lens on a clamp at one end and a bracket at the other, on a grey background.", width: 1024, height: 976 },
    { src: "/work/camera-arm/03.jpg", alt: "Long arm with red joints reaching across a workshop floor with a red tool chest, grinder and machine tools behind it.", width: 1600, height: 738 },
    { src: "/work/camera-arm/04.jpg", alt: "A second view of the long arm with red joints stretched across the workshop, with a blue bucket and machine tools nearby.", width: 1600, height: 738 },
    { src: "/work/camera-arm/05.jpg", alt: "Rendered CAD view of a black two-link arm folded in an inverted V, with a small gray base block at the lower left.", width: 746, height: 726 },
    { src: "/work/camera-arm/06.jpg", alt: "Rendered CAD view of a grey two-link arm with red joints on a pale cyan background, with a gray base block at the lower right.", width: 1024, height: 895 },
  ],
  "mechanical-keyboard": [
    { src: "/work/mechanical-keyboard/01.jpg", alt: "Top view of a compact keyboard with red, white, navy and orange keycaps on a green cutting mat.", width: 1600, height: 738 },
    { src: "/work/mechanical-keyboard/02.jpg", alt: "Two views of a keyboard: bare case with white keycaps above and a version with grey, beige and teal keycaps below.", width: 1024, height: 1024 },
    { src: "/work/mechanical-keyboard/03.jpg", alt: "Keyboard with black keycaps and coloured RGB underglow in blue and green along its lower edge.", width: 1024, height: 392 },
  ],
  "whiteboard-plotter": [
    { src: "/work/whiteboard-plotter/01.jpg", alt: "Whiteboard with a gantry plotter and a geometric web-like star pattern drawn in black marker.", width: 1600, height: 738 },
    { src: "/work/whiteboard-plotter/02.jpg", alt: "Whiteboard with a plotter and a black outline world map drawn inside an oval.", width: 1560, height: 720 },
    { src: "/work/whiteboard-plotter/03.jpg", alt: "Whiteboard with a plotter and a block of small black text, with a short list below it.", width: 1600, height: 738 },
    { src: "/work/whiteboard-plotter/04.jpg", alt: "Whiteboard in a wooden frame with the word 'Hello World' written in light pink by the plotter.", width: 1600, height: 738 },
    { src: "/work/whiteboard-plotter/05.jpg", alt: "Pink marker line drawing of a character with a large mouth, drawn on a white board inside a rounded border.", width: 485, height: 604 },
    { src: "/work/whiteboard-plotter/06.jpg", alt: "Open grey electronics enclosure holding a green circuit board, a ventilated power supply and wiring.", width: 738, height: 1600 },
  ],
  "hex-puck-lights": [
    { src: "/work/hex-puck-lights/01.jpg", alt: "Six hexagonal LED lights glowing red, orange, yellow, green, blue and purple on a dark surface.", width: 900, height: 900 },
    { src: "/work/hex-puck-lights/02.jpg", alt: "Upper part shows coloured hexagonal lights; lower part is a technical drawing of a hexagonal light with LED positions marked.", width: 628, height: 1200 },
    { src: "/work/hex-puck-lights/03.jpg", alt: "Three white hexagonal lights connected by thin wires to a white power adapter on a wooden table.", width: 1600, height: 1200 },
    { src: "/work/hex-puck-lights/04.jpg", alt: "Retail packaging image of a three-pack of hexagonal under-cabinet lights with a power adapter and lit warm-white pucks beside it.", width: 1121, height: 1118 },
  ],
  "custom-dog-leashes": [
    { src: "/work/custom-dog-leashes/01.jpg", alt: "Several narrow leash straps in pink, blue with dots and plaid, printed with dog names such as Sora and Moko.", width: 738, height: 1600 },
    { src: "/work/custom-dog-leashes/02.jpg", alt: "A wall of many leash straps in different colours and patterns, each printed with a dog's name.", width: 1024, height: 1024 },
    { src: "/work/custom-dog-leashes/03.jpg", alt: "Seven short printed fabric strips in red, pink, black, plaid, navy and white patterns with names like Momo, Kotetsu and Luna.", width: 1600, height: 1439 },
    { src: "/work/custom-dog-leashes/04.jpg", alt: "A hand holding an orange striped leash with a metal clip attached to a dog's collar, with fur visible.", width: 738, height: 1600 },
    { src: "/work/custom-dog-leashes/05.jpg", alt: "A heat press with a raised upper platen and a red lower bed in a workshop.", width: 1600, height: 738 },
    { src: "/work/custom-dog-leashes/06.jpg", alt: "A heat press with its lower bed pulled out in a workshop, with a broom and a window behind.", width: 1600, height: 738 },
  ],
  "handheld-sokoban": [
    { src: "/work/handheld-sokoban/01.jpg", alt: "Blue handheld game console with Freezing Fortress artwork showing a blue puzzle layout with coloured blocks on a grey screen.", width: 1024, height: 1024 },
    { src: "/work/handheld-sokoban/02.jpg", alt: "The same blue handheld with a plain white blank screen and Freezing Fortress artwork around it.", width: 1024, height: 1024 },
    { src: "/work/handheld-sokoban/03.jpg", alt: "Vertical blue handheld with a grid screen showing a cyan cross-shaped maze with orange squares.", width: 738, height: 1600 },
    { src: "/work/handheld-sokoban/04.jpg", alt: "Blue handheld on a green mat with a grid display lit in purple showing a smiling pixel face.", width: 1600, height: 738 },
    { src: "/work/handheld-sokoban/05.jpg", alt: "Opened handheld showing purple circuit boards and a long black battery in a clear case.", width: 630, height: 1200 },
    { src: "/work/handheld-sokoban/06.jpg", alt: "Opened handheld on a green mat showing green circuit boards joined by a flat ribbon cable.", width: 738, height: 1600 },
  ],
  "pcb-artwork": [
    { src: "/work/pcb-artwork/01.jpg", alt: "Close-up of a green circuit board with copper and silkscreen pixel art of a running figure, a ladder and green bricks, with the letters FTLOTG.", width: 839, height: 1123 },
    { src: "/work/pcb-artwork/02.jpg", alt: "Black-background layout view with red pixel art of a round shape and a spiky character, with FTLOTG below.", width: 1285, height: 883 },
    { src: "/work/pcb-artwork/03.jpg", alt: "Purple pixel art on white showing a dotted circle and fragments of a character, with FTLOTG below.", width: 1285, height: 883 },
    { src: "/work/pcb-artwork/04.jpg", alt: "Close-up of a cream-coloured copper pixel-art ghost on a dark green board, with FTLOTG below.", width: 528, height: 628 },
    { src: "/work/pcb-artwork/05.jpg", alt: "Close-up of a cream-coloured copper pixel-art space invader on a purple board, with FTLOTG below.", width: 634, height: 522 },
    { src: "/work/pcb-artwork/06.jpg", alt: "Close-up of a green circuit board with copper and soldermask pixel art of a running figure in a green cap, with FTLOTG below.", width: 517, height: 695 },
  ],
  "digital-badge": [
    { src: "/work/digital-badge/01.jpg", alt: "Dark circuit board with many small components and a glowing blue ghost-shaped light, lit on an orange base over a blue mat.", width: 738, height: 1600 },
    { src: "/work/digital-badge/02.jpg", alt: "Close-up of a green circuit board with a pixel-art running figure and ladder on its surface.", width: 1600, height: 738 },
    { src: "/work/digital-badge/03.jpg", alt: "Close-up of a green circuit board with a pixel-art planet-like logo among small components.", width: 1600, height: 738 },
  ],
  "badge-pcb-layout": [
    { src: "/work/badge-pcb-layout/01.jpg", alt: "Purple circuit board with a cellular module at its centre and connectors, sitting on a blue work mat with power leads attached.", width: 1600, height: 738 },
    { src: "/work/badge-pcb-layout/02.jpg", alt: "Green circuit board with a labelled module, a USB connector, a micro SD slot and many small components on an orange board holder.", width: 1600, height: 738 },
    { src: "/work/badge-pcb-layout/03.jpg", alt: "Eight black circuit boards arranged in two columns on a green cutting mat.", width: 738, height: 1600 },
    { src: "/work/badge-pcb-layout/04.jpg", alt: "A panel of nine green circuit boards in a three-by-three grid on a white background.", width: 1200, height: 1600 },
  ],
  "8080-lcd": [
    { src: "/work/8080-lcd/01.jpg", alt: "Small circuit board with a black glass touchscreen-style display in a black frame, on a green mat.", width: 738, height: 1600 },
    { src: "/work/8080-lcd/02.jpg", alt: "Black circuit board with screw terminals, USB-C port, a chip, an orange display ribbon and a buzzer on a green mat.", width: 738, height: 1600 },
    { src: "/work/8080-lcd/03.jpg", alt: "A hand holding a green circuit board with a blue character LCD, above handwritten notes.", width: 738, height: 1600 },
  ],
};
