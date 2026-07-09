export const TIME_SLOTS = [
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30",
  "22:00", "22:30",
] as const;

export const SPECIAL_REQUEST_CHIPS = [
  { key: "birthday", en: "🎂 Birthday", vi: "🎂 Sinh nhật" },
  { key: "anniversary", en: "💍 Anniversary", vi: "💍 Kỷ niệm" },
  { key: "quiet", en: "🤫 Quiet table", vi: "🤫 Bàn yên tĩnh" },
  { key: "allergy", en: "⚠️ Food allergy", vi: "⚠️ Dị ứng thực phẩm" },
] as const;

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 20;
