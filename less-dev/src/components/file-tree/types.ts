export enum EFileType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  PDF = "PDF"
}

export type FSNode = {
  name: string;
  isDir: boolean;
  children?: FSNode[];
  type?: EFileType;
}
