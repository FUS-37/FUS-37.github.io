export interface Plugin {
  name: string;
  slug: string;
  category: string;
  version: string;
  size: string;
  price: string;
  description: string;
  descriptionEn: string;
  platforms: string[];
  image: string;
  usage: string[];
}

export const plugins: Plugin[] = [
  {
    name: "Magic Channel",
    slug: "magic-channel",
    category: "Channelstrip",
    version: "1.2.0",
    size: "2.4 MB",
    price: "$29.90",
    description: "全新架构，把六种经典设备用现代插件重新演绎。",
    descriptionEn:
      "A new architecture reimagining six classic devices as a modern plugin.",
    platforms: ["macOS", "Windows"],
    image: "",
    usage: [],
  },
  {
    name: "SA-4",
    slug: "sa-4",
    category: "Saturation",
    version: "1.0.0",
    size: "2.4 MB",
    price: "$0.00",
    description: "使用独创Sonaris硬件卷积引擎构建的总线染色效果器。",
    descriptionEn:
      "A bus coloration effect powered by the proprietary Sonaris hardware convolution engine.",
    platforms: ["macOS", "Windows"],
    image: "",
    usage: [],
  },
  {
    name: "Doom",
    slug: "doom",
    category: "Saturation",
    version: "1.0.0",
    size: "2.4 MB",
    price: "$19.90",
    description: "使用独创Sonaris硬件卷积引擎构建的总线染色效果器。",
    descriptionEn:
      "A bus coloration effect powered by the proprietary Sonaris hardware convolution engine.",
    platforms: ["macOS", "Windows"],
    image: "",
    usage: [],
  },
  {
    name: "Locus",
    slug: "locus",
    category: "EQ",
    version: "1.0.0",
    size: "2.4 MB",
    price: "$19.90",
    description: "旗舰级母带均衡器，多款经典设备集于一身。",
    descriptionEn: "Flagship mastering EQ with multiple devices in one.",
    platforms: ["macOS", "Windows"],
    image: "",
    usage: [],
  },
  {
    name: "Rainhere",
    slug: "rainhere",
    category: "Modulation",
    version: "2.0.0",
    size: "2.4 MB",
    price: "$12.90",
    description: "基于工业级通信场景的雨天电台调制效果器。",
    descriptionEn:
      "Rainy-weather radio station modulation effect device based on the industrial-grade communication field.",
    platforms: ["macOS", "Windows"],
    image: "",
    usage: [],
  },
];
