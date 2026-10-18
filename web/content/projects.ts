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
      "A sliding stand for a digital microscope: an X/Y table under the workbench with linear rails and cable chains, so the microscope glides into place with a push.",
    image: "/work/microscope-slider.jpg",
    tags: ["Mechanical", "Motion control", "PCB"],
    featured: true,
  },
  {
    slug: "micropython-system",
    title: "Modular MicroPython System",
    blurb:
      "PyBikeBrain, a modular microPython board for E-bikes, inspired by the pyBoard, with stackable layers for serial, power and more.",
    image: "/work/micropython-system.jpg",
    tags: ["PCB", "Firmware", "Modular"],
    featured: true,
  },
  {
    slug: "camera-arm",
    title: "Articulated Camera Arm",
    blurb:
      "An articulated camera arm of carbon fiber tubes, polished steel spheres and red aluminum pressure plates, inspired by Robin Renzetti's design.",
    image: "/work/camera-arm.jpg",
    tags: ["Mechanical", "Product design"],
    featured: true,
  },
  {
    slug: "mechanical-keyboard",
    title: "Mechanical Keyboard",
    blurb:
      "A reproduction of Input Club's open source K-type keyboard, built to study manufacturing and find ways to cut BOM cost.",
    image: "/work/keyboard.jpg",
    tags: ["PCB", "Firmware", "Enclosure"],
    featured: true,
  },
  {
    slug: "whiteboard-plotter",
    title: "Whiteboard Plotter",
    blurb:
      "A whiteboard plotter inspired by draw bots, built on plywood with linear rails, a 3D printer control board and open-source software.",
    image: "/work/plotter.jpg",
    tags: ["Mechanical", "Motion control"],
    featured: true,
  },
  {
    slug: "hex-puck-lights",
    title: "Hex Puck Lights",
    blurb:
      "Black + Decker Hex Puck under cabinet lighting: a master puck with satellite pucks and a low-profile, screwless clip-together housing.",
    image: "/work/hex-puck.png",
    tags: ["PCB", "Lighting", "Product design"],
    featured: true,
  },
  {
    slug: "custom-dog-leashes",
    title: "Custom Dog Leashes",
    blurb:
      "Custom leashes printed with pet names, made with a purpose-built heat press and a CNC sewing machine.",
    image: "/work/dog-leash.jpg",
    tags: ["Product", "Production", "Sourcing"],
  },
  {
    slug: "handheld-sokoban",
    title: "Handheld Sokoban",
    blurb:
      "Freezing Fortress, an unreleased Sokoban-style handheld game with a D-pad, two buttons and a 7\" retro LED screen.",
    image: "/work/sokoban.jpg",
    tags: ["PCB", "Firmware", "Enclosure"],
  },
  {
    slug: "pcb-artwork",
    title: "PCB Artwork",
    blurb:
      "Tips for adding artwork to PCB designs, treating copper, soldermask and silkscreen like easter eggs in a video game.",
    image: "/work/pcb-artwork.png",
    tags: ["PCB", "Art"],
  },
  {
    slug: "digital-badge",
    title: "Digital Badge",
    blurb:
      "A digital badge built around an ESP32-S3 and a 2.4\" LCD for Maker Faire Shenzhen, with a Flappy Bird style game.",
    image: "/work/digital-badge.png",
    tags: ["PCB", "Firmware"],
  },
  {
    slug: "badge-pcb-layout",
    title: "Digital Badge PCB Layout",
    blurb:
      "A walkthrough of the digital badge's PCB layout, from layer stackup to the ESP32, antenna, USB Type C and power areas.",
    image: "/work/badge-pcb.png",
    tags: ["PCB", "Layout"],
  },
  {
    slug: "8080-lcd",
    title: "Adventures with an 8080 LCD",
    blurb:
      "Getting a 2.4\" 8080-interface TFT with an ST7789P3 controller running on an ESP32-S3, and speeding it up for a Flappy Bird style game.",
    image: "/work/lcd-8080.png",
    tags: ["Firmware", "Bring-up"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
