export interface Photo {
  src: string;
  title?: string;
}

const photoBase = "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img";

export const photos: Photo[] = [
  { src: `${photoBase}/reoenl%20(2).jpg`, title: "Reoenl 02" },
  { src: `${photoBase}/reoenl%20(1).jpg`, title: "Reoenl 01" },
  { src: `${photoBase}/reoenl%20(3).jpg`, title: "Reoenl 03" },
  { src: `${photoBase}/reoenl%20(4).jpg`, title: "Reoenl 04" },
  { src: `${photoBase}/reoenl%20(5).jpg`, title: "Reoenl 05" },
  { src: `${photoBase}/banner/1.png`, title: "Banner 01" },
  { src: `${photoBase}/banner/2.png`, title: "Banner 02" },
  { src: `${photoBase}/banner/3.png`, title: "Banner 03" },
  { src: `${photoBase}/banner/4.png`, title: "Banner 04" },
  { src: `${photoBase}/banner/5.png`, title: "Banner 05" },
  { src: `${photoBase}/banner/6.png`, title: "Banner 06" },
  { src: `${photoBase}/banner/7.png`, title: "Banner 07" },
  { src: `${photoBase}/banner/8.png`, title: "Banner 08" },
  { src: `${photoBase}/banner/9.png`, title: "Banner 09" },
];
