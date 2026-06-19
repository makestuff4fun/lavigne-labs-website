export type Project = {
  slug: string;
  title: string;
  blurb: string;
  image: string;
  tags: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "microscope-slider",
    title: "Microscope X/Y Slider",
    blurb:
      "A precision motorized X/Y stage for digital microscopy — mechanical design, motion control, and a custom driver board.",
    image: "/work/microscope-slider.jpg",
    tags: ["Mechanical", "Motion control", "PCB"],
    featured: true,
  },
  {
    slug: "micropython-system",
    title: "Modular MicroPython System",
    blurb:
      "A stackable, modular hardware platform with a clean MicroPython API — designed to be reconfigured and reused across projects.",
    image: "/work/micropython-system.jpg",
    tags: ["PCB", "Firmware", "Modular"],
    featured: true,
  },
  {
    slug: "camera-arm",
    title: "Articulated Camera Arm",
    blurb:
      "A rigid, smoothly-articulating camera arm engineered for repeatable positioning on the bench.",
    image: "/work/camera-arm.jpg",
    tags: ["Mechanical", "Product design"],
    featured: true,
  },
  {
    slug: "mechanical-keyboard",
    title: "Mechanical Keyboard",
    blurb:
      "A custom mechanical keyboard from PCB to case — switch matrix, firmware, and a machined enclosure.",
    image: "/work/keyboard.jpg",
    tags: ["PCB", "Firmware", "Enclosure"],
    featured: true,
  },
  {
    slug: "whiteboard-plotter",
    title: "Whiteboard Plotter",
    blurb:
      "A wall-mounted plotter that draws on a whiteboard — motion system, control board, and toolpath software.",
    image: "/work/plotter.jpg",
    tags: ["Mechanical", "Motion control"],
    featured: true,
  },
  {
    slug: "hex-puck-lights",
    title: "Hex Puck Lights",
    blurb:
      "Modular hexagonal RGB light tiles — addressable LEDs, a tidy interconnect, and a manufacturable PCB.",
    image: "/work/hex-puck.png",
    tags: ["PCB", "Lighting", "Product design"],
    featured: true,
  },
  {
    slug: "custom-dog-leashes",
    title: "Custom Dog Leashes",
    blurb:
      "A small-batch product run — material sourcing, hardware, and production managed end to end.",
    image: "/work/dog-leash.jpg",
    tags: ["Product", "Production", "Sourcing"],
  },
  {
    slug: "handheld-sokoban",
    title: "Handheld Sokoban",
    blurb:
      "A pocketable handheld game console — custom PCB, display, controls, and firmware in one tidy package.",
    image: "/work/sokoban.jpg",
    tags: ["PCB", "Firmware", "Enclosure"],
  },
  {
    slug: "pcb-artwork",
    title: "PCB Artwork",
    blurb:
      "Functional art on copper and soldermask — pushing what a printed circuit board can look like.",
    image: "/work/pcb-artwork.png",
    tags: ["PCB", "Art"],
  },
  {
    slug: "digital-badge",
    title: "Digital Badge",
    blurb:
      "An interactive electronic conference badge — playful hardware with a real production path.",
    image: "/work/digital-badge.png",
    tags: ["PCB", "Firmware"],
  },
  {
    slug: "badge-pcb-layout",
    title: "Digital Badge PCB Layout",
    blurb:
      "The board behind the badge — a compact, manufacturable layout balancing aesthetics and DFM.",
    image: "/work/badge-pcb.png",
    tags: ["PCB", "Layout"],
  },
  {
    slug: "8080-lcd",
    title: "Adventures with an 8080 LCD",
    blurb:
      "Bringing up a parallel 8080-interface LCD from scratch — bus timing, drivers, and a working display.",
    image: "/work/lcd-8080.png",
    tags: ["Firmware", "Bring-up"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
