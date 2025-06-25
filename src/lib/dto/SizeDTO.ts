import { Size } from "@prisma/client";

export class SizeDTO {
  id: string;
  name: string;
  size: SizeInfoDTO;

  constructor(size: Size) {
    this.id = size.id;
    this.name = size.size;
    this.size = new SizeInfoDTO(size.size);
  }
}

export class SizeInfoDTO {
  en: string;
  ko: string;
  constructor(size: string) {
    this.en = translateToEnglishMap[size] || size;
    this.ko = size;
  }
}

const translateToEnglishMap: Record<string, string> = {
  XS: "Extra Small",
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "Extra Large",
  XXL: "Double Extra Large",
  XXXL: "Triple Extra Large",
  "230": "5",
  "240": "6",
  "250": "7",
  "260": "8",
  "270": "9",
  "280": "10",
  "290": "11",
};
