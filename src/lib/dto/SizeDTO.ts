export class SizeDTO {
  id: string;
  size: SizeInfoDTO;

  constructor(id: string, size: string) {
    this.id = id;
    this.size = new SizeInfoDTO(size);
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
