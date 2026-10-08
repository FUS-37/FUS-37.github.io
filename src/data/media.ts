export interface Track {
  title: string;
  artist?: string;
  artistUrl?: string;
  url: string;
  cover?: string;
}

export interface BilibiliVideo {
  title: string;
  aid: string;
  bvid: string;
  cid: string;
}

export const covers = [
  "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(2).jpg",
  "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(1).jpg",
  "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(3).jpg",
  "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(4).jpg",
  "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(5).jpg",
];

export const tracks: Track[] = [
  {
    title: "Remember (remix)",
    artist: "烁音Ayane",
    artistUrl: "https://space.bilibili.com/19346228",
    url: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/remember.mp3",
    cover: covers[0],
  },
  {
    title: "僕だけの青い空",
    artist: "烁音Ayane",
    artistUrl: "https://space.bilibili.com/19346228",
    url: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/%E5%83%95%E3%81%A0%E3%81%91%E3%81%AE%E9%9D%92%E3%81%84%E7%A9%BA.mp3",
    cover: covers[1],
  },
  {
    title: "月下缭乱 (Orchestral)",
    artist: "DeemoAlice",
    artistUrl: "https://space.bilibili.com/389430530",
    url: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/mp3/%E6%9C%88%E4%B8%8B%E7%BC%AD%E4%B9%B1-Orchestral.mp3",
    cover: covers[2],
  },
  {
    title: "Final Battle",
    artist: "热爱音乐的王小明同学",
    artistUrl: "https://space.bilibili.com/380065177",
    url: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/mp3/Final%20Battle.mp3",
    cover: covers[3],
  },
  {
    title: "Winter",
    artist: "Alyxium欧石楠",
    artistUrl: "https://space.bilibili.com/1192681736",
    url: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/mp3/winter.mp3",
    cover: covers[4],
  },
];

export const videos: BilibiliVideo[] = [
  {
    title: "三福「定格万千生活」",
    aid: "115915714730498",
    bvid: "BV1sCksBEEgN",
    cid: "35464612446",
  },
  {
    title: "动画单品《从今往后，那片花海》",
    aid: "113899294693303",
    bvid: "BV13Ff2YiE7m",
    cid: "28107083462",
  },
];

export const albums = tracks.map((track) => ({
  title: track.title,
  artist: track.artist ?? "",
  cover: track.cover ?? "",
}));
