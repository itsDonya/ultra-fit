export const typesList = [
  { title: "دمبل", value: "IsDumbbellMovement" },
  { title: "هالتر", value: "IsbarbellMovement" },
  { title: "سیم کش", value: "IsCable" },
  { title: "دستگاه", value: "IsMachine" },
  { title: "هیچکدام", value: "None" },
];

export const findType = (value) => {
  const identifiedType = typesList.find((item) => item.value == value);
  return identifiedType?.title || "-";
};
