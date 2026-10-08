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
];
